// The journey between two cities, as a short film: the train steaming
// across open country, smoke rolling back off the stack, rods driving the
// wheels, telegraph poles whipping past. The land starts out looking like
// the city you left and ends looking like the one you're heading for. Three
// shots (a low look along the front, a tracking shot down the side, a wide
// aerial) with title cards; any key skips it.
import * as THREE from 'three';
import { World } from './world.js';
import { BIOMES } from './run.js';
import { cityLabel } from './cities.js';
import { tex } from './textures.js';
import { macroVary } from './atmos.js';
import * as P from './props.js';
import * as LP from './lotprops.js';
import { makeLocomotive, makeTender, makeTrainCar } from './train.js';
import { box, lambert as L } from './models.js';

const SPEED = 19; // m/s, about 42 mph
const SPAN = 520; // scenery wraps over this length of track
const DUR = 15.5;
const SMOKE = 46;

let smokeTex = null;
function smokeTexture() {
  if (smokeTex) return smokeTex;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 31);
  g.addColorStop(0, 'rgba(255,255,255,0.9)');
  g.addColorStop(0.5, 'rgba(255,255,255,0.45)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  smokeTex = new THREE.CanvasTexture(c);
  return smokeTex;
}

export class TravelScene {
  constructor(game, from, to, miles) {
    this.game = game;
    this.kind = 'travel';
    game.level = this;
    this.from = from;
    this.to = to;
    this.miles = miles;
    this.biomeKey = from.biome;
    this.enemies = [];
    this.actors = [];
    this.lamps = [];
    this.t = 0;
    this.dist = 0;
    this.group = new THREE.Group();
    game.scene.add(this.group);
    // a token world so shared code has something to ask
    const tiles = new Uint8Array(16).fill(2);
    this.world = new World({ W: 4, H: 4, tiles, blocked: new Uint8Array(16) }, { render: false, outdoor: true });
    this.rng = () => Math.random();
    this.buildTrack();
    this.buildTrain();
    this.scenery = new THREE.Group();
    this.group.add(this.scenery);
    this.dressLand(from.biome);
    this.buildSmoke();
    this.cards = 0;
    this.shot = -1;
    this.chugT = 0;
    this.clackT = 0.4;
  }

  // ------------------------------------------------------------ build
  buildTrack() {
    // ballast bed and two long rails; the sleepers scroll under them
    const g = this.group;
    g.add(box(4.0, 0.2, SPAN, L({ map: tex('roofGravel'), color: 0x8a8478, roughness: 1 }), 0, 0.1, 0));
    for (const x of [-0.75, 0.75]) {
      g.add(box(0.08, 0.07, SPAN, L({ color: 0x9a9894, roughness: 0.3, metalness: 0.9 }), x, 0.27, 0));
      g.add(box(0.14, 0.05, SPAN, L({ color: 0x3a2e26, roughness: 0.7, metalness: 0.5 }), x, 0.215, 0));
    }
    const n = Math.floor(SPAN / 0.65);
    const tie = new THREE.BoxGeometry(2.6, 0.12, 0.24);
    this.ties = new THREE.InstancedMesh(tie, L({ map: tex('wood', 5), color: 0x5a4434, roughness: 0.95 }), n);
    this.ties.receiveShadow = true;
    this.tieN = n;
    g.add(this.ties);
    this.groundMat = macroVary(new THREE.MeshStandardMaterial({ roughness: 1 }));
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400), this.groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    g.add(ground);
    this.ground = ground;
    // telegraph wires (the poles under them scroll)
    for (const [y, x] of [
      [6.7, 6.1],
      [6.7, 6.9],
      [6.2, 6.5],
    ])
      g.add(box(0.02, 0.02, SPAN, L({ color: 0x1a1a1a }), x, y, 0));
  }

  buildTrain() {
    const loco = makeLocomotive();
    loco.position.y = 0.26;
    this.loco = loco;
    this.group.add(loco);
    const tender = makeTender();
    tender.position.set(0, 0.26, 9.0);
    this.group.add(tender);
    this.cars = [tender];
    let z = 9.0 + 3.3 + 0.6 + 4.6;
    for (let i = 0; i < 5; i++) {
      const car = makeTrainCar(i % 2 ? 'box' : 'flat', i);
      car.position.set(0, 0.26, z);
      this.group.add(car);
      this.cars.push(car);
      z += 9.8;
    }
    // the headlamp throws a real beam down the track
    const lamp = new THREE.SpotLight(0xffe0a0, 40, 60, 0.35, 0.6, 1.2);
    lamp.position.set(0, 4.2, -5.8);
    lamp.target.position.set(0, 0, -40);
    this.group.add(lamp, lamp.target);
    this.lampLight = lamp;
  }

  // Trees, rocks, fences and poles for this climate, scattered either side.
  dressLand(biomeKey) {
    const b = BIOMES[biomeKey];
    const gt = tex(b.ground, 31).clone();
    gt.needsUpdate = true;
    gt.wrapS = gt.wrapT = THREE.RepeatWrapping;
    gt.repeat.set(350, 350);
    this.groundMat.map = gt;
    this.groundMat.needsUpdate = true;
    this.groundTex = gt;
    for (const c of [...this.scenery.children]) {
      this.scenery.remove(c);
      c.traverse?.((o) => o.geometry?.dispose());
    }
    this.items = [];
    const rr = this.rng;
    const tree = () => {
      if (biomeKey === 'desert') return rr() < 0.55 ? P.makeCactus(rr).mesh : P.makeRock(rr, 0x8a6a4a).mesh;
      if (biomeKey === 'tundra') return rr() < 0.75 ? P.makePine(rr, true).mesh : P.makeDeadTree(rr).mesh;
      if (biomeKey === 'plains') return rr() < 0.45 ? LP.makeLeafyTree(rr) : rr() < 0.6 ? P.makeBush(rr, 0x6a6a30).mesh : P.makeRock(rr).mesh;
      if (biomeKey === 'swamp') return rr() < 0.6 ? P.makeDeadTree(rr).mesh : P.makeBush(rr, 0x2a4a22).mesh;
      return rr() < 0.65 ? P.makePine(rr, false).mesh : LP.makeLeafyTree(rr);
    };
    const count = { forest: 150, tundra: 120, swamp: 110, plains: 70, desert: 60 }[biomeKey] ?? 100;
    for (let i = 0; i < count; i++) {
      const m = tree();
      const side = rr() < 0.5 ? -1 : 1;
      const x = side * (9 + Math.pow(rr(), 1.6) * 120);
      const z = -SPAN / 2 + rr() * SPAN;
      const s = 0.8 + rr() * 0.7;
      m.scale.multiplyScalar(s);
      m.position.set(x, 0, z);
      m.rotation.y = rr() * 6.28;
      this.scenery.add(m);
      this.items.push(m);
    }
    // the odd farmhouse or barn in the distance
    for (let i = 0; i < 6; i++) {
      const h = new THREE.Group();
      const w = 6 + rr() * 6;
      const d = 5 + rr() * 5;
      const wall = L({ map: tex(rr() < 0.5 ? 'facadeSiding' : 'boxcar', rr() < 0.5 ? 60 : 111), roughness: 0.9 });
      h.add(box(w, 4 + rr() * 2, d, wall, 0, 2.5, 0));
      const roof = new THREE.Mesh(new THREE.ConeGeometry(Math.max(w, d) * 0.75, 2.5, 4), L({ color: 0x3a2a24, roughness: 0.9 }));
      roof.position.y = 6;
      roof.rotation.y = Math.PI / 4;
      roof.scale.set(w / Math.max(w, d), 1, d / Math.max(w, d));
      h.add(roof);
      h.traverse((o) => {
        if (o.isMesh) o.castShadow = o.receiveShadow = true;
      });
      const side = rr() < 0.5 ? -1 : 1;
      h.position.set(side * (40 + rr() * 90), 0, -SPAN / 2 + rr() * SPAN);
      this.scenery.add(h);
      this.items.push(h);
    }
    // telegraph poles beside the track
    for (let z = -SPAN / 2; z < SPAN / 2; z += 42) {
      const pole = new THREE.Group();
      pole.add(box(0.2, 7.2, 0.2, L({ map: tex('wood', 5), color: 0x6a5040 }), 0, 3.6, 0));
      pole.add(box(1.6, 0.12, 0.12, L({ map: tex('wood', 5), color: 0x6a5040 }), 0, 6.6, 0));
      for (const x of [-0.6, 0.4]) pole.add(box(0.06, 0.12, 0.06, L({ color: 0x8aa0a0, roughness: 0.2 }), x, 6.72, 0));
      pole.traverse((o) => {
        if (o.isMesh) o.castShadow = true;
      });
      pole.position.set(6.5, 0, z);
      this.scenery.add(pole);
      this.items.push(pole);
    }
    // a backdrop ring of hills
    const hills = P.makeBackdrop(b.backdrop, rr, 0, 0, 380);
    this.scenery.add(hills);
    this.hills = hills;
  }

  buildSmoke() {
    this.smoke = [];
    const mat = new THREE.SpriteMaterial({ map: smokeTexture(), color: 0x3a3a3a, transparent: true, depthWrite: false, opacity: 0 });
    for (let i = 0; i < SMOKE; i++) {
      const s = new THREE.Sprite(mat.clone());
      s.visible = false;
      this.group.add(s);
      this.smoke.push({ s, life: 0, v: new THREE.Vector3() });
    }
    this.smokeI = 0;
    this.smokeT = 0;
  }

  // ------------------------------------------------------------ update
  update(dt) {
    const g = this.game;
    this.t += dt;
    const step = SPEED * dt;
    this.dist += step;
    // the train stands still and the world rolls past
    for (const m of this.items) {
      m.position.z += step;
      if (m.position.z > SPAN / 2) m.position.z -= SPAN;
    }
    if (this.groundTex) this.groundTex.offset.y += step / 4;
    const dummy = this.dummy || (this.dummy = new THREE.Object3D());
    const off = this.dist % 0.65;
    for (let i = 0; i < this.tieN; i++) {
      dummy.position.set(0, 0.24, -SPAN / 2 + i * 0.65 + off);
      dummy.updateMatrix();
      this.ties.setMatrixAt(i, dummy.matrix);
    }
    this.ties.instanceMatrix.needsUpdate = true;
    // wheels and rods
    this.loco.userData.anim.update(this.dist / 0.85);
    for (const car of this.cars) for (const w of car.userData.wheels || []) w.obj.rotation.x = -this.dist / w.r;
    // the train rocks a little on the rail joints
    const sway = Math.sin(this.t * 7.3) * 0.004 + Math.sin(this.t * 2.1) * 0.006;
    this.loco.rotation.z = sway;
    this.cars.forEach((c, i) => (c.rotation.z = Math.sin(this.t * 6.1 + i) * 0.006));
    // smoke off the stack, blown back along the train
    this.smokeT -= dt;
    if (this.smokeT <= 0) {
      this.smokeT = 0.055;
      const p = this.smoke[this.smokeI];
      this.smokeI = (this.smokeI + 1) % SMOKE;
      const st = this.loco.userData.stack;
      p.s.position.set(st.x + (Math.random() - 0.5) * 0.2, st.y + 0.26, st.z);
      p.v.set((Math.random() - 0.5) * 0.8, 3.2 + Math.random(), SPEED * 0.75);
      p.life = 1;
      p.s.visible = true;
    }
    for (const p of this.smoke) {
      if (p.life <= 0) continue;
      p.life -= dt / 3.2;
      if (p.life <= 0) {
        p.s.visible = false;
        continue;
      }
      p.v.y *= 1 - dt * 0.6;
      p.s.position.addScaledVector(p.v, dt);
      const age = 1 - p.life;
      const sz = 0.9 + age * 9;
      p.s.scale.set(sz, sz, sz);
      p.s.material.opacity = Math.min(1, age * 8) * p.life * 0.55;
      p.s.material.color.setScalar(0.22 + age * 0.45);
    }
    // sound: the chuff of the exhaust and the clack of rail joints
    this.chugT -= dt;
    if (this.chugT <= 0) {
      this.chugT = 0.19;
      g.audio.chug?.(0.8);
    }
    this.clackT -= dt;
    if (this.clackT <= 0) {
      this.clackT = 0.55 + Math.random() * 0.1;
      g.audio.clack?.();
    }
    this.directShots(dt);
  }

  // The camera work and the title cards.
  directShots() {
    const g = this.game;
    const cam = g.camera;
    const t = this.t;
    const ui = g.ui;
    const shot = t < 5 ? 0 : t < 10 ? 1 : 2;
    const k = shot === 0 ? t / 5 : shot === 1 ? (t - 5) / 5 : Math.min(1, (t - 10) / (DUR - 10));
    const e = 0.5 - Math.cos(Math.PI * k) / 2;
    if (shot !== this.shot) {
      this.shot = shot;
      if (shot === 0) ui.banner(`LEAVING ${this.from.name.toUpperCase()}`, cityLabel(this.from), 4);
      if (shot === 1) ui.banner(`${this.miles.toLocaleString()} MILES`, `${BIOMES[this.from.biome].name} country gives way to ${BIOMES[this.to.biome].name.toLowerCase()}`, 4);
      if (shot === 2) {
        ui.banner(`ARRIVING ${this.to.name.toUpperCase()}`, cityLabel(this.to), 4.5);
        this.game.audio.whistle();
      }
    }
    // the land changes under a fade between the second and third shots
    if (!this.swapped && t > 9.6) {
      this.swapped = true;
      ui.fade(1, 0.35);
    }
    if (this.swapped && !this.swapDone && t > 10.0) {
      this.swapDone = true;
      this.biomeKey = this.to.biome;
      this.dressLand(this.to.biome);
      g.env.refresh();
      ui.fade(0, 0.6);
    }
    const V = (x, y, z) => new THREE.Vector3(x, y, z);
    let from;
    let to;
    let lookA;
    let lookB;
    if (shot === 0) {
      // low, just off the rails ahead of the locomotive, looking back at it
      from = V(4.2, 0.9, -21);
      to = V(3.0, 1.5, -14);
      lookA = V(0, 2.6, -2);
      lookB = V(0, 2.8, 2);
    } else if (shot === 1) {
      // tracking along the side, the poles whipping through the frame
      from = V(9.5, 2.4, 30);
      to = V(8.5, 2.8, 2);
      lookA = V(0, 2.2, 22);
      lookB = V(0, 2.6, -4);
    } else {
      // up and away: the whole train crossing the country
      from = V(22, 9, 26);
      to = V(48, 34, 70);
      lookA = V(0, 2, 6);
      lookB = V(0, 0, -30);
    }
    cam.position.lerpVectors(from, to, e);
    cam.lookAt(new THREE.Vector3().lerpVectors(lookA, lookB, e));
    const fov = shot === 2 ? 50 : 58;
    if (cam.fov !== fov) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
  }

  get done() {
    return this.t >= DUR;
  }

  // ------------------------------------------------------------ level API
  indoorAt() {
    return 0;
  }
  interactables() {
    return [];
  }
  mapMarkers() {
    return [];
  }
  assignLights(lights) {
    for (const l of lights) {
      l.userData.on = false;
      l.intensity = 0;
    }
  }

  dispose() {
    this.game.scene.remove(this.group);
    this.group.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
    });
    this.world.dispose();
  }
}
