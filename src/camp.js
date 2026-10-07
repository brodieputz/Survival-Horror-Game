// The camp beside the train: sleeping area, barricade, the long field the
// horde crosses, placed traps, train-mounted turrets, survivors and the
// night waves.
//
// Layout (world units, x grows toward the horde):
//   x  6..12  the train (five cars, turrets on the roofs)
//   x 12..36  sleeping area (tent, map table, weapon rack, campfire)
//   x 37.5    the barricade (gate in the middle opens by day)
//   x 39..153 the field; zombies spawn at the far end
import * as THREE from 'three';
import { World } from './world.js';
import { Enemy } from './enemies.js';
import { SurvivorActor } from './survivors.js';
import { RNG, dist2D, clamp, angleDiff } from './util.js';
import { TILE, T, TURRETS, TRAPS } from './config.js';
import { tex } from './textures.js';
import * as M from './models.js';
import * as P from './props.js';
import { makeLocomotive, makeTender, makeTrainCar } from './train.js';
import { BIOMES, barricadeMax } from './run.js';
import { macroVary, makeGrass, Smoke, WIND } from './atmos.js';

export const CW = 52;
export const CH = 17;
export const BX = 12 * TILE + 1.5; // barricade line
const TRAIN_X = 8.5;
const CAR_Z = [5.2, 14.8, 24.4, 34.0, 43.6];
const SEG = 4.5;
const GATE_Z0 = 23.25;
const GATE_Z1 = 27.75;
const SPAWN_X0 = 144;
const SPAWN_X1 = 152;
const Z_MIN = 3.6;
const Z_MAX = CH * TILE - 3.6;
const MAX_ALIVE = 50;

export class CampScene {
  constructor(game) {
    this.game = game;
    this.kind = 'camp';
    game.level = this;
    const run = game.run;
    this.run = run;
    this.biome = BIOMES[run.locality.biome];
    this.rng = new RNG(run.locality.seed);
    this.bx = BX;
    this.barricadeFace = 0.9;
    this.group = new THREE.Group();
    game.scene.add(this.group);
    this.enemies = [];
    this.actors = [];
    this.lamps = [];
    this.traps = [];
    this.turrets = [];
    this.cover = [];
    this.wave = null;
    this.flowT = 0;

    // ---------- grid ----------
    const tiles = new Uint8Array(CW * CH);
    for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) tiles[y * CW + x] = x === 0 || y === 0 || x === CW - 1 || y === CH - 1 ? T.ROCK : T.FLOOR;
    this.d = { W: CW, H: CH, tiles, blocked: new Uint8Array(CW * CH), rooms: [] };
    this.world = new World(this.d, { render: false, outdoor: true });

    this.buildTerrain();
    this.buildTrain();
    this.buildSleepingArea();
    this.buildCover();
    this.buildBarricade();
    this.buildTraps();
    this.buildTurrets();
    this.computeFlow();
    this.spawnSurvivors();
    this.weather = new Weather(game, this.biome.weather);
    this.group.add(this.weather.points);
  }

  // ------------------------------------------------------------ build
  buildTerrain() {
    const b = this.biome;
    const gtex = tex(b.ground).clone();
    gtex.needsUpdate = true;
    gtex.repeat.set(120, 120);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), macroVary(new THREE.MeshStandardMaterial({ map: gtex, roughness: 1 })));
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(80, 0, 25);
    ground.receiveShadow = true;
    this.group.add(ground);
    // trampled dirt in the sleeping area
    const dtex = tex('dirt').clone();
    dtex.needsUpdate = true;
    dtex.repeat.set(8, 16);
    const dirt = new THREE.Mesh(new THREE.PlaneGeometry(26, 48), macroVary(new THREE.MeshStandardMaterial({ map: dtex, transparent: true, opacity: 0.85, roughness: 1 })));
    dirt.rotation.x = -Math.PI / 2;
    dirt.position.set(24, 0.01, 25.5);
    dirt.receiveShadow = true;
    this.group.add(dirt);
    const rr = () => this.rng.next();
    this.group.add(P.makeBackdrop(b.backdrop, rr, 80, 25, 230));
    // a city's skyline on the horizon, as big as the city is
    const size = this.run.locality.size ?? 0;
    if (size >= 1) this.group.add(P.makeSkyline(b.backdrop, rr, 80, 25, 250, size));
    // grass: thick in the forest, dry clumps in the desert, a few stalks
    // poking through the snow; trampled flat around the train and the camp
    const G = { grass: [9000, 0x5a7a3a, 0.5], prairie: [9000, 0xb8a060, 0.55], marsh: [7000, 0x4a6a34, 0.6], sand: [2200, 0xa89660, 0.38], snow: [700, 0xb4ac8c, 0.32] }[b.ground] || [4000, 0x5a7a3a, 0.45];
    this.grass = makeGrass({
      count: G[0],
      color: G[1],
      height: G[2],
      x0: -12,
      x1: 172,
      z0: -24,
      z1: CH * TILE + 24,
      rng: rr,
      place: (x, z) => {
        if (x > 3 && x < 14) return false; // the tracks
        if (x > 14 && x < BX + 1.5 && z > 2 && z < CH * TILE - 2) return rr() < 0.08; // camp
        return true;
      },
    });
    this.group.add(this.grass);
    // a treeline / boulder line just outside the playable edges
    for (let i = 0; i < 70; i++) {
      const side = i % 2 ? -1 : 1;
      const x = this.rng.range(-20, 175);
      const z = side < 0 ? this.rng.range(-26, -3) : this.rng.range(CH * TILE + 3, CH * TILE + 26);
      const m = this.makeCoverModel(true);
      m.mesh.position.set(x, 0, z);
      m.mesh.rotation.y = this.rng.range(0, 6.28);
      this.group.add(m.mesh);
    }
    for (let i = 0; i < 18; i++) {
      const m = this.makeCoverModel(true);
      m.mesh.position.set(this.rng.range(158, 190), 0, this.rng.range(-10, 60));
      this.group.add(m.mesh);
    }
  }

  makeCoverModel(tall = false) {
    const rr = () => this.rng.next();
    const kinds = this.biome.cover;
    let k = this.rng.pick(kinds);
    if (tall) k = this.rng.pick(kinds.filter((x) => ['pine', 'pineSnow', 'deadtree', 'cactus', 'rock'].includes(x)));
    switch (k) {
      case 'pine':
        return P.makePine(rr, false);
      case 'pineSnow':
        return P.makePine(rr, true);
      case 'deadtree':
        return P.makeDeadTree(rr);
      case 'cactus':
        return P.makeCactus(rr);
      case 'log':
        return P.makeLog(rr);
      case 'stump':
        return P.makeStump(rr);
      case 'bush':
        return P.makeBush(rr, this.biome.ground === 'sand' || this.biome.ground === 'prairie' ? 0x6a6a3a : 0x2a4a22);
      case 'car':
        return P.makeCarWreck(rr);
      case 'barrel':
        return P.makeBarrel(rr);
      case 'ice':
        return P.makeIce(rr);
      case 'skull':
        return P.makeCowSkull();
      case 'rock':
      default:
        return P.makeRock(rr, this.biome.ground === 'snow' ? 0x8a929a : this.biome.ground === 'sand' ? 0x8a6a4a : 0x6a6660);
    }
  }

  buildTrain() {
    const rails = P.makeRails(140);
    rails.position.set(TRAIN_X, 0, 25);
    this.group.add(rails);
    this.carModels = [];
    // the train sits on the rails (railhead 0.26 m up)
    const RY = 0.26;
    CAR_Z.forEach((z, i) => {
      const car = M.mergeStatic(makeTrainCar(i % 2 ? 'box' : 'flat', i));
      car.position.set(TRAIN_X, RY, z);
      this.group.add(car);
      this.world.addCollider(TRAIN_X - 1.5, z - 4.7, TRAIN_X + 1.5, z + 4.7);
      this.carModels.push({ z, roof: (i % 2 ? 3.2 : 1.45) + RY });
    });
    const tender = M.mergeStatic(makeTender());
    tender.position.set(TRAIN_X, RY, 53.4);
    tender.rotation.y = Math.PI;
    this.group.add(tender);
    const loco = makeLocomotive();
    loco.position.set(TRAIN_X, RY, 62.5);
    loco.rotation.y = Math.PI;
    this.group.add(M.mergeStatic(loco));
    this.world.addCollider(TRAIN_X - 1.5, 48.4, TRAIN_X + 1.5, 70);
    for (let y = 0; y < CH; y++) for (let x = 2; x <= 3; x++) this.d.blocked[y * CW + x] = 1;
  }

  buildSleepingArea() {
    const g = this.group;
    // player's tent
    const tent = P.makeTent(true);
    tent.position.set(17, 0, 9);
    tent.rotation.y = Math.PI / 2;
    g.add(tent);
    this.world.addCollider(15.2, 7.4, 18.8, 10.6);
    this.tent = { x: 19.3, z: 9 };
    // map table
    const table = P.makeMapTable();
    table.position.set(20, 0, 32);
    table.rotation.y = Math.PI / 2;
    g.add(table);
    this.world.addCollider(19.3, 30.9, 20.7, 33.1);
    this.table = { x: 20, z: 32 };
    this.lamps.push({ pos: new THREE.Vector3(20.4, 1.4, 31.2), phase: 1, color: 0xffb050, power: 6 });
    // weapon rack shows the weapons not carried by anyone
    const rack = P.makeWeaponRack();
    rack.position.set(14.2, 0, 40);
    rack.rotation.y = Math.PI / 2;
    g.add(rack);
    this.world.addCollider(13.6, 38.7, 14.8, 41.3);
    this.rack = { x: 14.6, z: 40, group: new THREE.Group() };
    this.rack.group.position.copy(rack.position);
    this.rack.group.rotation.copy(rack.rotation);
    g.add(this.rack.group);
    this.refreshRack();
    // campfire
    const fire = P.makeCampfire();
    fire.group.position.set(26, 0, 22);
    g.add(fire.group);
    this.fire = fire;
    this.smoke = new Smoke(26, 0.9, 22);
    this.group.add(this.smoke.group);
    this.world.addCollider(25.3, 21.3, 26.7, 22.7);
    this.lamps.push({ pos: new THREE.Vector3(26, 1.2, 22), phase: 0, color: 0xff8a30, power: 12, fire: true });
    // trap crate by the gate
    const crate = P.makeTrapCrate();
    crate.position.set(33.5, 0, 19.5);
    g.add(crate);
    this.world.addCollider(32.8, 19.0, 34.2, 20.0);
    this.trapCrate = { x: 33.5, z: 19.5 };
    // supply clutter
    const rr = () => this.rng.next();
    for (const [x, z] of [
      [13.5, 18],
      [14, 30],
      [30, 46],
    ]) {
      const b = P.makeBarrel(rr);
      b.mesh.position.set(x, 0, z);
      g.add(b.mesh);
      this.world.addCollider(x - 0.4, z - 0.4, x + 0.4, z + 0.4);
    }
  }

  refreshRack() {
    const rg = this.rack.group;
    while (rg.children.length) rg.remove(rg.children[0]);
    const run = this.run;
    const free = run.weapons.filter((w) => !this.game.holderOfUid(w.uid));
    free.slice(0, 7).forEach((w, i) => {
      const m = this.game.gunModelFor(w.id);
      m.group.rotation.set(-Math.PI / 2 + 0.15, 0, 0);
      m.group.position.set(-0.9 + i * 0.3, 0.2, -0.05);
      rg.add(m.group);
    });
  }

  buildCover() {
    const n = this.rng.int(16, 26);
    for (let i = 0; i < n; i++) {
      for (let a = 0; a < 20; a++) {
        const x = this.rng.range(46, 138);
        const z = this.rng.range(Z_MIN + 1, Z_MAX - 1);
        if (this.cover.some((c) => dist2D(c.x, c.z, x, z) < 6)) continue;
        const m = this.makeCoverModel(false);
        m.mesh.position.set(x, 0, z);
        let rot = this.rng.range(0, 6.28);
        if (m.box || m.long) rot = this.rng.chance(0.5) ? 0 : Math.PI / 2;
        m.mesh.rotation.y = rot;
        this.group.add(m.mesh);
        const c = { x, z, r: m.r, soft: m.soft };
        if (!m.soft) {
          let hx = m.r * 0.8;
          let hz = m.r * 0.8;
          if (m.box) [hx, hz] = Math.abs(rot) < 0.1 ? [m.box[0], m.box[1]] : [m.box[1], m.box[0]];
          if (m.long) [hx, hz] = Math.abs(rot) < 0.1 ? [0.35, m.long / 2] : [m.long / 2, 0.35];
          c.collider = this.world.addCollider(x - hx, z - hz, x + hx, z + hz);
          const [tx0, tz0] = this.world.tileOf(x - hx + 0.3, z - hz + 0.3);
          const [tx1, tz1] = this.world.tileOf(x + hx - 0.3, z + hz - 0.3);
          for (let ty = tz0; ty <= tz1; ty++) for (let tx = tx0; tx <= tx1; tx++) this.d.blocked[ty * CW + tx] = 1;
        }
        this.cover.push(c);
        break;
      }
    }
  }

  // ---------- barricade ----------
  get barricadeUp() {
    return this.run.barricade.hp > 0;
  }

  buildBarricade() {
    if (this.barGroup) this.group.remove(this.barGroup);
    for (const c of this.barColliders || []) this.world.removeCollider(c);
    this.barGroup = new THREE.Group();
    this.group.add(this.barGroup);
    this.barColliders = [];
    const rr = () => this.rng.next();
    const lvl = this.run.barricade.level;
    const up = this.barricadeUp;
    // sections of about SEG metres either side of the gate in the middle
    const segs = [];
    const span = (a, b) => {
      const n = Math.max(1, Math.round((b - a) / SEG));
      for (let i = 0; i < n; i++) segs.push({ z0: a + (i * (b - a)) / n, w: (b - a) / n });
    };
    span(1.5, GATE_Z0);
    segs.push({ z0: GATE_Z0, w: GATE_Z1 - GATE_Z0, gate: true });
    span(GATE_Z1, CH * TILE - 1.5);
    for (const { z0, w, gate } of segs) {
      const zc = z0 + w / 2;
      if (gate && up) {
        const g = P.makeGate(w);
        g.group.position.set(BX, 0, zc);
        this.barGroup.add(g.group);
        this.gate = g;
        continue;
      }
      const m = up ? P.makeBarricade(w, lvl, rr) : P.makeBarricadeRubble(w, rr);
      m.position.set(BX, 0, zc);
      this.barGroup.add(m);
      if (up) this.barColliders.push(this.world.addCollider(BX - 0.5, z0, BX + 0.5, z0 + w));
    }
    if (!up) this.gate = null;
    this.gateCollider = null;
    this.setGate(this.game.run.phase !== 'night');
    // lanterns
    if (!this.lanterns) {
      this.lanterns = [];
      for (const z of [8, 25.5, 43]) {
        const l = P.makeLantern();
        l.group.position.set(BX - 0.8, 0, z + 2.6);
        this.group.add(l.group);
        this.lanterns.push(l);
        this.lamps.push({ pos: new THREE.Vector3(BX - 0.8, 2.3, z + 2.6), phase: z, color: 0xffb050, power: 8 });
      }
    }
    for (let y = 1; y < CH - 1; y++) this.d.blocked[y * CW + 12] = up ? 1 : 0;
    this.lastHp = this.run.barricade.hp;
  }

  setGate(open, instant = true) {
    this.gateOpen = open && this.barricadeUp;
    this.gateT = this.gateOpen ? 1 : 0;
    if (instant) this.gateAnim = this.gateT;
    if (this.gateCollider) {
      this.world.removeCollider(this.gateCollider);
      this.gateCollider = null;
    }
    if (!open && this.barricadeUp) this.gateCollider = this.world.addCollider(BX - 0.5, GATE_Z0, BX + 0.5, GATE_Z1);
  }

  damageBarricade(amount, src) {
    const b = this.run.barricade;
    if (b.hp <= 0) return;
    b.hp = Math.max(0, b.hp - amount);
    const g = this.game;
    g.audio.barricadeHit(src.pos, amount > 20);
    g.particles.burst(new THREE.Vector3(BX + 0.4, 1, src.pos.z), 5, 0x7a5a3a, 2);
    if (b.hp <= 0) {
      this.buildBarricade();
      g.audio.barricadeBreak();
      g.ui.banner('THE BARRICADE IS BREACHED', 'Hold the camp!', 3);
      g.ui.message('They are through!', 'bad', 4);
      this.computeFlow();
    } else if (this.lastHp > barricadeMax(this.run) * 0.25 && b.hp <= barricadeMax(this.run) * 0.25) {
      g.ui.message('The barricade is about to give!', 'bad');
    }
    this.lastHp = b.hp;
  }

  // ---------- flow field toward the barricade ----------
  computeFlow() {
    const W = CW;
    const dist = new Int32Array(CW * CH).fill(-1);
    const q = [];
    for (let y = 1; y < CH - 1; y++) {
      const i = y * W + 13;
      if (!this.d.blocked[i]) {
        dist[i] = 0;
        q.push(i);
      }
    }
    for (let h = 0; h < q.length; h++) {
      const c = q[h];
      const cx = c % W;
      const cy = (c / W) | 0;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx < 13) continue;
        const ni = ny * W + nx;
        if (dist[ni] >= 0 || !this.world.walkableForMonster(nx, ny)) continue;
        dist[ni] = dist[c] + 1;
        q.push(ni);
      }
    }
    this.flow = dist;
  }

  flowTarget(x, z, laneZ, e) {
    const tz = clamp(laneZ, Z_MIN, Z_MAX);
    // the last stretch: walk right up to the planks
    if (x < BX + 6) return { x: BX + 1.0, z: clamp(z + (tz - z) * 0.2, Z_MIN, Z_MAX) };
    // straight at the barricade when nothing is in the way
    if (e) {
      e.flowCheck = (e.flowCheck || 0) - 1;
      if (e.flowCheck <= 0) {
        e.flowCheck = 20;
        e.flowDirect = this.world.clearLine(x, z, BX + 2, tz, e.radius + 0.25);
      }
      if (e.flowDirect) return { x: BX + 1.5, z: tz };
    }
    const [cx, cy] = this.world.tileOf(x, z);
    const W = CW;
    let best = null;
    let bd = Infinity;
    for (let oy = -1; oy <= 1; oy++)
      for (let ox = -1; ox <= 1; ox++) {
        if (!ox && !oy) continue;
        const nx = cx + ox;
        const ny = cy + oy;
        const dd = this.flow[ny * W + nx];
        if (dd < 0 || dd === undefined) continue;
        if (ox && oy && (this.flow[cy * W + nx] < 0 || this.flow[ny * W + cx] < 0)) continue;
        const score = dd + (ox && oy ? 0.4 : 0) + Math.abs((ny + 0.5) * TILE - tz) * 0.02;
        if (score < bd) {
          bd = score;
          best = [nx, ny];
        }
      }
    if (!best) return { x: BX + 1.5, z: tz };
    return { x: (best[0] + 0.5) * TILE, z: (best[1] + 0.5) * TILE };
  }

  // ---------- traps ----------
  buildTraps() {
    for (const t of this.run.placedTraps) this.addTrapRuntime(t);
  }

  addTrapRuntime(t) {
    let rt;
    if (t.type === 'bear') {
      const m = M.makeBearTrap();
      m.group.position.set(t.x, 0, t.z);
      m.group.rotation.y = t.rot || 0;
      this.group.add(m.group);
      rt = { rec: t, model: m.group, jaws: m.jaws, armed: true };
    } else if (t.type === 'mine') {
      const m = P.makeMine();
      m.group.position.set(t.x, 0, t.z);
      this.group.add(m.group);
      rt = { rec: t, model: m.group, light: m.light, armed: true };
    } else if (t.type === 'tripwire') {
      const m = P.makeTripSpikes(6);
      m.group.position.set(t.x, 0, t.z);
      this.group.add(m.group);
      rt = { rec: t, model: m.group, wire: m.wire, spikes: m.spikes, armed: true, t: 0 };
    } else {
      const m = P.makeKeroseneTank();
      m.position.set(t.x, 0, t.z);
      this.group.add(m);
      rt = { rec: t, model: m, armed: true, x: t.x, z: t.z, root: m };
      rt.onShot = () => this.blowTank(rt);
      m.traverse((o) => {
        if (o.isMesh) o.userData.shootable = rt;
      });
    }
    this.traps.push(rt);
    return rt;
  }

  consumeTrap(rt) {
    rt.armed = false;
    this.run.placedTraps = this.run.placedTraps.filter((t) => t !== rt.rec);
  }

  canPlaceTrap(type, x, z, px, pz) {
    if (px < BX + 1.0) return 'Head out through the gate to set traps.';
    if (Math.hypot(x - px, z - pz) > 4.5) return 'Too far away. Walk closer.';
    if (x < BX + 2.5 || x > 140 || z < Z_MIN || z > Z_MAX) return 'Traps go beyond the barricade.';
    if (type === 'tripwire' && (z - 3 < Z_MIN - 1.5 || z + 3 > Z_MAX + 1.5)) return 'Not enough room for the wire.';
    for (const t of this.traps) if (t.armed && dist2D(t.rec.x, t.rec.z, x, z) < (type === 'tripwire' || t.rec.type === 'tripwire' ? 2.2 : 1.3)) return 'Too close to another trap.';
    for (const c of this.cover) if (!c.soft && dist2D(c.x, c.z, x, z) < c.r + 0.6) return 'Something is in the way.';
    return null;
  }

  placeTrap(type, x, z) {
    const rec = { type, x, z, rot: Math.random() * 6.28, id: Math.floor(Math.random() * 1e9) };
    this.run.placedTraps.push(rec);
    this.run.traps[type]--;
    this.addTrapRuntime(rec);
  }

  pickUpTrap(rt) {
    this.consumeTrap(rt);
    this.run.traps[rt.rec.type]++;
    this.group.remove(rt.model);
    this.traps = this.traps.filter((t) => t !== rt);
  }

  blowTank(rt) {
    if (!rt.armed) return;
    this.consumeTrap(rt);
    this.group.remove(rt.model);
    this.game.combat.explode(new THREE.Vector3(rt.rec.x, 0.6, rt.rec.z), 5.5, 210, 'trap', { fire: true });
  }

  shootables() {
    return this.traps.filter((t) => t.armed && t.rec.type === 'kerosene');
  }

  onExplosion(pos, radius) {
    for (const t of this.traps) {
      if (!t.armed) continue;
      const d = dist2D(pos.x, pos.z, t.rec.x, t.rec.z);
      if (d > radius + 0.5) continue;
      if (t.rec.type === 'kerosene') setTimeout(() => this.blowTank(t), 120);
      else if (t.rec.type === 'mine') setTimeout(() => this.blowMine(t), 150);
    }
  }

  blowMine(t) {
    if (!t.armed) return;
    this.consumeTrap(t);
    this.group.remove(t.model);
    this.game.combat.explode(new THREE.Vector3(t.rec.x, 0.3, t.rec.z), 4.5, 230, 'trap');
  }

  updateTraps(dt) {
    const g = this.game;
    for (const t of this.traps) {
      if (t.rec.type === 'tripwire' && t.fired) {
        t.t += dt;
        const ext = t.t < 0.12 ? t.t / 0.12 : t.t < 2 ? 1 : Math.max(0, 1 - (t.t - 2) / 0.8);
        t.spikes.visible = ext > 0;
        for (const s of t.spikes.children) s.position.y = -0.9 + ext * 1.5;
        if (t.t > 3) {
          this.group.remove(t.model);
          t.dead = true;
        }
        continue;
      }
      if (!t.armed) continue;
      if (t.rec.type === 'mine') t.light.material.opacity = Math.sin(g.time * 6) > 0 ? 0.9 : 0.2;
      for (const e of this.enemies) {
        if (!e.alive) continue;
        const dx = e.pos.x - t.rec.x;
        const dz = e.pos.z - t.rec.z;
        if (t.rec.type === 'bear') {
          if (e.stun <= 0 && Math.hypot(dx, dz) < 0.5 + e.radius * 0.5) {
            this.consumeTrap(t);
            M.setBearTrapOpen(t.jaws, false);
            g.audio.bearSnap(e.pos);
            e.trap(e.type === 'brute' ? 4 : 7, e.type === 'brute' ? 70 : 50, 'trap');
            break;
          }
        } else if (t.rec.type === 'mine') {
          if (Math.hypot(dx, dz) < 0.7 + e.radius * 0.5) {
            this.blowMine(t);
            break;
          }
        } else if (t.rec.type === 'tripwire') {
          if (Math.abs(dx) < 0.5 && Math.abs(dz) < 3) {
            this.consumeTrap(t);
            t.fired = true;
            t.wire.visible = false;
            g.audio.spikes(e.pos);
            for (const o of this.enemies)
              if (o.alive && Math.abs(o.pos.x - t.rec.x) < 1.4 && Math.abs(o.pos.z - t.rec.z) < 3.3) {
                o.hit(150, 'trap', { explosive: false });
                if (o.alive) o.stun = Math.max(o.stun, 1.2);
              }
            break;
          }
        }
      }
    }
    this.traps = this.traps.filter((t) => !t.dead);
  }

  // ---------- turrets ----------
  buildTurrets() {
    for (const t of this.turrets) this.group.remove(t.model.group);
    this.turrets = [];
    this.run.turrets.forEach((tr, i) => {
      if (!tr) return;
      const m = P.makeTurret(tr.type);
      m.group.position.set(TRAIN_X, this.carModels[i].roof, this.carModels[i].z);
      m.yaw.rotation.y = -Math.PI / 2;
      this.group.add(m.group);
      this.turrets.push({ type: tr.type, def: TURRETS[tr.type], model: m, cd: Math.random(), target: null, retarget: 0, flash: 0, car: i });
    });
  }

  updateTurrets(dt) {
    const g = this.game;
    const active = this.wave && this.wave.active;
    for (const t of this.turrets) {
      t.flash = Math.max(0, t.flash - dt * 8);
      t.model.flash.material.opacity = t.flash;
      if (!active) continue;
      const base = t.model.group.position;
      t.retarget -= dt;
      if (t.retarget <= 0 || !t.target?.alive || t.target.pos.x <= BX + 1) {
        t.retarget = 0.5;
        t.target = this.pickTurretTarget(t, base);
      }
      const tg = t.target;
      if (!tg) continue;
      const dx = tg.pos.x - base.x;
      const dz = tg.pos.z - base.z;
      const want = Math.atan2(-dx, -dz);
      const cur = t.model.yaw.rotation.y;
      const diff = angleDiff(cur, want);
      t.model.yaw.rotation.y = cur + clamp(diff, -dt * 2.5, dt * 2.5);
      const dist = Math.hypot(dx, dz);
      const pitch = t.type === 'artillery' ? 0.6 : Math.atan2(1.0 - (base.y + 0.7), dist);
      t.model.pitch.rotation.x = pitch;
      t.cd -= dt;
      if (Math.abs(diff) > 0.12 || t.cd > 0) continue;
      t.cd = 1 / t.def.rate;
      t.flash = 1;
      const muzzle = t.model.muzzle.getWorldPosition(new THREE.Vector3());
      if (t.type === 'mg') {
        g.combat.aimedShot(muzzle, tg, { dmg: t.def.dmg, hitChance: 0.72, src: 'turret', color: 0xffe0a0, headChance: 0.1 });
        g.audio.turretFire('mg', muzzle);
      } else if (t.type === 'missile') {
        const v = new THREE.Vector3(tg.pos.x, 1, tg.pos.z).sub(muzzle).normalize().multiplyScalar(14);
        v.y += 8;
        g.combat.spawn('missile', muzzle, v, { target: tg, speed: 34, dmg: t.def.dmg, splash: t.def.splash, src: 'turret' });
        g.audio.turretFire('missile', muzzle);
      } else {
        const T2 = clamp(dist / 28, 1.4, 3.2);
        const grav = 18;
        const lead = tg.speedNow * T2 * 0.8;
        const tx = tg.pos.x - lead;
        const v = new THREE.Vector3((tx - muzzle.x) / T2, (0 - muzzle.y + 0.5 * grav * T2 * T2) / T2, (tg.pos.z - muzzle.z) / T2);
        g.combat.spawn('shell', muzzle, v, { grav, dmg: t.def.dmg, splash: t.def.splash, src: 'turret' });
        g.audio.turretFire('artillery', muzzle);
      }
    }
  }

  pickTurretTarget(t, base) {
    let best = null;
    let bs = Infinity;
    for (const e of this.enemies) {
      if (!e.alive || e.pos.x <= BX + 1) continue;
      const d = dist2D(base.x, base.z, e.pos.x, e.pos.z);
      if (d > t.def.range) continue;
      if (t.def.minRange && e.pos.x < BX + t.def.minRange) continue;
      let score = e.pos.x;
      if (t.type === 'artillery') {
        let n = 0;
        for (const o of this.enemies) if (o.alive && dist2D(o.pos.x, o.pos.z, e.pos.x, e.pos.z) < 6) n++;
        score = -n * 10 + e.pos.x * 0.05;
      } else if (t.type === 'missile') score = e.pos.x - e.maxHp * 0.05;
      if (score < bs) {
        bs = score;
        best = e;
      }
    }
    return best;
  }

  // ---------- survivors ----------
  spawnSurvivors() {
    for (const a of this.actors) a.dispose();
    this.actors = [];
    const list = this.run.survivors.filter((s) => s.status === 'camp' && s.hp > 0);
    list.forEach((rec, i) => {
      const a = (i / Math.max(1, 8)) * Math.PI * 2 + 0.4;
      const hx = 26 + Math.cos(a) * 3.6;
      const hz = 22 + Math.sin(a) * 3.6;
      const bed = P.makeBedroll(rec.dog ? 0x5a4a3a : rec.look.shirt); // a dog gets an old blanket
      bed.position.set(26 + Math.cos(a) * 5.2, 0.01, 22 + Math.sin(a) * 5.2);
      bed.rotation.y = -a + Math.PI / 2;
      this.group.add(bed);
      const actor = new SurvivorActor(this.game, rec, hx, hz, 'camp', this.group);
      actor.yaw = Math.atan2(26 - hx, 22 - hz);
      this.actors.push(actor);
    });
  }

  refreshSurvivorGear() {
    for (const a of this.actors) a.equip();
  }

  setDefend(on) {
    const n = this.actors.length;
    this.actors.forEach((a, i) => {
      a.mode = on ? 'defend' : 'camp';
      const z = Z_MIN + 2 + ((i + 0.5) / Math.max(1, n)) * (Z_MAX - Z_MIN - 4);
      a.post = { x: a.melee ? BX - 3.2 : BX - 1.4, z };
      a.target = null;
    });
  }

  // ------------------------------------------------------------ waves
  startWave(comp) {
    this.setGate(false);
    this.setDefend(true);
    this.wave = { ...comp, active: true, spawned: 0, total: comp.list.length, nextT: 2.5, killed: 0 };
  }

  spawnZombie(type, x, z, mul) {
    const e = new Enemy(this.game, type, x, z, { wave: true, mul, group: this.group });
    e.laneZ = clamp(z + (Math.random() - 0.5) * 18, Z_MIN, Z_MAX);
    this.enemies.push(e);
    return e;
  }

  updateWave(dt) {
    const w = this.wave;
    if (!w || !w.active) return;
    const alive = this.enemies.filter((e) => e.alive).length;
    w.nextT -= dt;
    if (w.spawned < w.total && w.nextT <= 0 && alive < MAX_ALIVE) {
      const group = Math.min(w.total - w.spawned, 2 + Math.floor(Math.random() * Math.min(6, 1 + w.wave / 2)));
      const zc = w.firstZ ?? this.rng.range(Z_MIN + 3, Z_MAX - 3);
      w.firstZ = null; // the opening shot frames the first group
      for (let i = 0; i < group; i++) {
        const type = w.list[w.spawned++];
        this.spawnZombie(type, this.rng.range(SPAWN_X0, SPAWN_X1), clamp(zc + this.rng.range(-5, 5), Z_MIN, Z_MAX), { hp: w.hpMul, spd: w.spdMul, dmg: w.dmgMul });
      }
      w.nextT = Math.max(0.35, 2.2 - w.wave * 0.15) * (0.6 + Math.random() * 0.8);
    }
    if (w.spawned >= w.total && alive === 0) {
      w.active = false;
      this.game.onWaveCleared();
    }
  }

  get remaining() {
    const w = this.wave;
    if (!w) return 0;
    return w.total - w.spawned + this.enemies.filter((e) => e.alive).length;
  }

  clearNight() {
    for (const e of this.enemies) {
      e.dispose();
      this.group.remove(e.root);
    }
    this.enemies = [];
    this.wave = null;
    this.setDefend(false);
    for (const a of this.actors) {
      a.pos.set(a.home.x, 0, a.home.z);
      a.path = null;
    }
    this.actors = this.actors.filter((a) => {
      if (a.alive) return true;
      a.dispose();
      return false;
    });
  }

  // ------------------------------------------------------------ interactions
  interactables() {
    const g = this.game;
    const out = [];
    if (this.wave?.active) return out;
    const day = g.run.phase !== 'night';
    out.push({ type: 'tent', x: this.tent.x, z: this.tent.z, label: g.run.phase === 'day' ? 'Sleep (ends the day)' : 'Sleep', range: 2.6 });
    out.push({ type: 'maptable', x: this.table.x, z: this.table.z, label: 'Study the maps', range: 2.3 });
    if (g.run.phase === 'day') out.push({ type: 'campfire', x: 26, z: 22, label: 'Rest by the fire (pass time)', range: 2.4 });
    out.push({ type: 'rack', x: this.rack.x, z: this.rack.z, label: 'Weapon rack & workbench', range: 2.4 });
    if (day) out.push({ type: 'trapcrate', x: this.trapCrate.x, z: this.trapCrate.z, label: 'Take traps (then head out through the gate)', range: 2.2 });
    const p = g.player;
    if (p.pos.x < BX + 2.5) {
      const bz = clamp(p.pos.z, 2, CH * TILE - 2);
      out.push({ type: 'barricade', x: BX - 0.7, z: bz, label: this.barricadeUp ? 'Repair / reinforce the barricade' : 'Rebuild the barricade', range: 1.9 });
    }
    CAR_Z.forEach((z, i) => {
      const t = this.run.turrets[i];
      out.push({ type: 'turret', idx: i, x: TRAIN_X + 1.6, z, label: t ? `${TURRETS[t.type].name} (car ${i + 1})` : `Train car ${i + 1}: build a turret`, range: 2.8 });
    });
    for (const a of this.actors) if (a.alive) out.push({ type: 'survivor', obj: a, x: a.pos.x, z: a.pos.z, label: `Talk to ${a.name}`, range: 2.2 });
    if (day) for (const t of this.traps) if (t.armed) out.push({ type: 'pickup', obj: t, x: t.rec.x, z: t.rec.z, label: `Pick up ${TRAPS[t.rec.type].name.toLowerCase()}`, range: 1.6 });
    return out;
  }

  // ------------------------------------------------------------ update
  update(dt) {
    const g = this.game;
    const t = g.time;
    for (const e of this.enemies) e.update(dt);
    this.separate();
    this.enemies = this.enemies.filter((e) => {
      if (!e.gone) return true;
      this.group.remove(e.root);
      return false;
    });
    for (const a of this.actors) a.update(dt);
    this.updateWave(dt);
    this.updateTraps(dt);
    this.updateTurrets(dt);
    for (const f of this.fire.flames) f.scale.set(0.6 * (0.85 + Math.random() * 0.3), 1.0 * (0.85 + Math.random() * 0.3), 1);
    this.fire.glow.material.opacity = 0.45 + Math.random() * 0.1;
    for (const l of this.lanterns) l.glow.material.opacity = 0.75 + Math.sin(t * 5 + l.group.position.z) * 0.08;
    if (this.gate) {
      const target = this.gateT ?? 0;
      this.gateAnim = (this.gateAnim ?? target) + Math.sign(target - (this.gateAnim ?? target)) * Math.min(Math.abs(target - (this.gateAnim ?? target)), dt * 0.8);
      const a = this.gateAnim * (Math.PI / 2) * 0.96;
      this.gate.left.rotation.y = -a;
      this.gate.right.rotation.y = a;
    }
    this.weather.update(dt, g.camera.position);
    WIND.value += dt;
    this.smokeTint = (this.smokeTint || new THREE.Color()).copy(g.hemi.color).multiplyScalar(Math.min(1, g.hemi.intensity * 0.55));
    this.smoke.update(dt, this.smokeTint);
  }

  separate() {
    const list = this.enemies;
    for (let i = 0; i < list.length; i++) {
      const a = list[i];
      if (!a.alive) continue;
      for (let j = i + 1; j < list.length; j++) {
        const b = list[j];
        if (!b.alive) continue;
        const dx = b.pos.x - a.pos.x;
        if (dx > 1.6 || dx < -1.6) continue;
        const dz = b.pos.z - a.pos.z;
        const d = Math.hypot(dx, dz);
        const min = a.radius + b.radius;
        if (d < min && d > 1e-4) {
          const push = (min - d) / 2;
          a.pos.x -= (dx / d) * push;
          a.pos.z -= (dz / d) * push;
          b.pos.x += (dx / d) * push;
          b.pos.z += (dz / d) * push;
        }
      }
    }
  }

  assignLights(lights, px, pz) {
    const night = this.game.run.phase !== 'day';
    const sorted = this.lamps.map((t) => ({ t, d: dist2D(t.pos.x, t.pos.z, px, pz) })).sort((a, b) => (a.t.fire ? -1 : 0) - (b.t.fire ? -1 : 0) || a.d - b.d);
    lights.forEach((l, i) => {
      const s = sorted[i];
      if (s && night) {
        l.position.copy(s.t.pos);
        l.userData.torch = s.t;
        l.userData.on = true;
        l.color.setHex(s.t.color);
        l.distance = s.t.fire ? 26 : 14;
      } else {
        l.userData.on = false;
        l.intensity = 0;
      }
    });
  }

  dispose() {
    for (const e of this.enemies) e.dispose();
    for (const a of this.actors) a.dispose();
    this.game.scene.remove(this.group);
    this.group.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
    });
    this.world.dispose();
  }
}

// ---------------------------------------------------------------- weather
// Rain falls as short streaks; snow and dust drift as soft round flakes.
// Both take their brightness from the ambient light so they don't glow at night.
const WN = 900;
class Weather {
  constructor(game, kind) {
    this.kind = kind;
    this.game = game;
    this.pos = new Float32Array(WN * 3);
    this.vel = new Float32Array(WN * 3);
    for (let i = 0; i < WN; i++) this.reset(i, 0, 0, 0, true);
    this.base = new THREE.Color(kind === 'rain' ? 0xa8b4c4 : kind === 'snow' ? 0xf4f8ff : 0xc8a878);
    const g = new THREE.BufferGeometry();
    if (kind === 'rain') {
      this.line = new Float32Array(WN * 6);
      g.setAttribute('position', new THREE.BufferAttribute(this.line, 3));
      this.points = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: this.base, transparent: true, opacity: 0.32, depthWrite: false }));
    } else {
      g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
      const size = kind === 'snow' ? 0.16 : 0.1;
      this.points = new THREE.Points(g, new THREE.PointsMaterial({ color: this.base, map: tex('glow'), size, transparent: true, opacity: kind === 'dust' ? 0.45 : 0.85, depthWrite: false }));
    }
    this.points.frustumCulled = false;
    this.geo = g;
  }
  reset(i, cx, cy, cz, init) {
    const p = this.pos;
    p[i * 3] = cx + (Math.random() - 0.5) * 40;
    p[i * 3 + 1] = init ? Math.random() * 20 : 16 + Math.random() * 4;
    p[i * 3 + 2] = cz + (Math.random() - 0.5) * 40;
    const v = this.vel;
    if (this.kind === 'rain') {
      v[i * 3] = -1.5;
      v[i * 3 + 1] = -22 - Math.random() * 6;
      v[i * 3 + 2] = 0.5;
    } else if (this.kind === 'snow') {
      v[i * 3] = (Math.random() - 0.5) * 1.2;
      v[i * 3 + 1] = -1.4 - Math.random() * 1.2;
      v[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
    } else {
      v[i * 3] = -4 - Math.random() * 4;
      v[i * 3 + 1] = (Math.random() - 0.5) * 0.6;
      v[i * 3 + 2] = (Math.random() - 0.5) * 2;
      if (!init) p[i * 3 + 1] = Math.random() * 6;
    }
  }
  update(dt, cam) {
    const p = this.pos;
    const v = this.vel;
    for (let i = 0; i < WN; i++) {
      p[i * 3] += v[i * 3] * dt;
      p[i * 3 + 1] += v[i * 3 + 1] * dt;
      p[i * 3 + 2] += v[i * 3 + 2] * dt;
      if (this.kind === 'snow') p[i * 3] += Math.sin(p[i * 3 + 1] + i) * dt * 0.4;
      const dx = p[i * 3] - cam.x;
      const dz = p[i * 3 + 2] - cam.z;
      if (p[i * 3 + 1] < 0 || dx * dx + dz * dz > 450 || (this.kind === 'dust' && p[i * 3 + 1] > 7)) this.reset(i, cam.x, cam.y, cam.z, false);
    }
    if (this.line) {
      const l = this.line;
      for (let i = 0; i < WN; i++) {
        const k = i * 6;
        l[k] = p[i * 3];
        l[k + 1] = p[i * 3 + 1];
        l[k + 2] = p[i * 3 + 2];
        l[k + 3] = p[i * 3] - v[i * 3] * 0.03;
        l[k + 4] = p[i * 3 + 1] - v[i * 3 + 1] * 0.03;
        l[k + 5] = p[i * 3 + 2] - v[i * 3 + 2] * 0.03;
      }
    }
    this.geo.attributes.position.needsUpdate = true;
    const h = this.game.hemi;
    this.points.material.color.copy(this.base).multiplyScalar(Math.min(1, 0.25 + h.intensity * 0.5));
  }
}
