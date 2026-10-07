// A searchable location: builds each floor's interior (walls, furniture,
// windows, stairs), its loot containers, survivors waiting to be found,
// hazards, zombies, pickups (batteries, a key, notes) and the locked vault,
// and runs whichever floor the player is on. Floors are built the first time
// the player reaches them and keep their state after that.
import * as THREE from 'three';
import { generateBuilding } from './dungeon.js';
import { World } from './world.js';
import { Enemy } from './enemies.js';
import { SurvivorActor } from './survivors.js';
import { RNG, dist2D } from './util.js';
import { TILE, WALL_H, PIT_DEPTH, T, NOISE, MAX_SURVIVORS, EDGE, DOOR_W, DOOR_H } from './config.js';
import * as M from './models.js';
import { makeContainer, makeWallLamp, makeDebris, CONTAINER_WIDTH, CONTAINER_DEPTH } from './props.js';
import { buildExterior } from './exterior.js';
import { makeFurniture, FURN } from './furniture.js';
import { tex } from './textures.js';
import { LOCATION_TYPES, describeItem, grantLoot } from './run.js';
import { WEAPONS, RARITY } from './weapons.js';

const HIDE_DIMS = {
  locker: { w: 0.85, d: 0.6, label: 'Hide in locker' },
  closet: { w: 1.3, d: 0.72, label: 'Hide in wardrobe' },
  bed: { w: 2.0, d: 1.05, label: 'Crawl under bed' },
  bench: { w: 2.0, d: 0.56, label: 'Crawl under bench' },
};
const CONTAINER_LABEL = {
  crate: 'Search crate',
  cabinet: 'Search cabinet',
  desk: 'Search desk',
  fridge: 'Search fridge',
  toolbox: 'Search tool chest',
  medcab: 'Search medicine cabinet',
  gunlocker: 'Search gun locker',
  footlocker: 'Search footlocker',
  shelf: 'Search shelves',
};
// everything that belongs to one floor
const FLOOR_FIELDS = ['d', 'world', 'fgroup', 'hiding', 'containers', 'found', 'bearTraps', 'wires', 'lamps', 'glassTiles', 'enemies', 'explored', 'mapCanvas', 'mapCtx', 'airDist', 'pickups', 'windows', 'gateObj', 'exitMarker', 'prevPlayer'];
const MAP_PX = 4; // minimap pixels per tile

export class BuildingScene {
  constructor(game, loc, companions) {
    this.game = game;
    this.kind = 'building';
    game.level = this;
    this.loc = loc;
    this.L = LOCATION_TYPES[loc.type];
    this.plan = generateBuilding(loc, game.run.locality.biome);
    this.nFloors = this.plan.nFloors;
    this.rng = new RNG((loc.seed ^ 0x9e3779b9) >>> 0);
    this.group = new THREE.Group(); // things that follow the player between floors
    game.scene.add(this.group);
    this.states = this.plan.floors.map(() => null);
    this.floorIdx = -1;
    this.actors = [];
    this.revealT = 0;
    // a lock with nowhere to put its vault: someone already forced it
    if (loc.lock && !loc.lock.opened && !this.plan.floors.some((d) => d.gate)) {
      loc.lock.opened = true;
      this.vaultForced = true;
    }
    this.setFloor(0);
    // companions arrive with the player
    companions.forEach((rec, i) => {
      const sp = this.d.spawn;
      const a = new SurvivorActor(game, rec, sp.x + (i % 2 ? 1.2 : -1.2), sp.z - 1.2 - Math.floor(i / 2) * 1.2, 'follow', this.group);
      this.actors.push(a);
    });
  }

  // ------------------------------------------------------------ floors
  get floorName() {
    if (this.nFloors === 1) return '';
    return this.floorIdx === 0 ? 'Ground floor' : `Floor ${this.floorIdx + 1}`;
  }

  setFloor(i) {
    const scene = this.game.scene;
    if (this.floorIdx >= 0) {
      const st = this.states[this.floorIdx];
      for (const k of FLOOR_FIELDS) st[k] = this[k];
      scene.remove(this.world.group);
      scene.remove(this.fgroup);
    }
    this.floorIdx = i;
    if (!this.states[i]) {
      this.buildFloor(i);
      this.states[i] = {};
    } else for (const k of FLOOR_FIELDS) this[k] = this.states[i][k];
    scene.add(this.world.group);
    scene.add(this.fgroup);
    this.prevPlayer = null;
  }

  buildFloor(i) {
    const game = this.game;
    const d = (this.d = this.plan.floors[i]);
    this.world = new World(d, { smart: true });
    this.fgroup = new THREE.Group();
    this.hiding = [];
    this.containers = [];
    this.found = [];
    this.bearTraps = [];
    this.wires = [];
    this.lamps = [];
    this.glassTiles = new Set();
    this.enemies = [];
    this.pickups = [];
    this.windows = [];
    this.gateObj = null;
    this.exitMarker = null;
    const W = d.W;
    const H = d.H;
    this.explored = new Uint8Array(W * H);
    this.mapCanvas = document.createElement('canvas');
    this.mapCanvas.width = W * MAP_PX;
    this.mapCanvas.height = H * MAP_PX;
    this.mapCtx = this.mapCanvas.getContext('2d');
    this.mapCtx.fillStyle = '#000';
    this.mapCtx.fillRect(0, 0, W * MAP_PX, H * MAP_PX);

    if (i === 0) this.buildYard();
    this.computeIndoor();
    this.buildHiding();
    this.buildContainers();
    this.buildTraps();
    this.buildLamps();
    this.buildDecor();
    this.buildFurniture();
    this.buildWindows();
    this.buildStairs();
    this.buildGate();
    this.buildPickups();
    for (const e of d.enemies) this.enemies.push(new Enemy(game, e.type, e.x, e.z, { group: this.fgroup }));
    for (const s of d.survivors) {
      const rec = this.loc.survivors[s.idx];
      if (!rec) continue;
      this.found.push(new SurvivorActor(game, rec, s.x, s.z, 'found', this.fgroup));
    }
    if (i === 0) for (let y = d.yard.y - 1; y <= d.yard.y + d.yard.h; y++) for (let x = d.yard.x - 1; x <= d.yard.x + d.yard.w; x++) this.markExplored(x, y);
  }

  // ------------------------------------------------------------ build
  buildYard() {
    // the building's shell, roof and signage, its lot and the street outside
    const ext = buildExterior(this);
    this.exitMarker = ext.exit;
  }

  // How far each tile is from open air (the lot), for the lighting blend.
  computeIndoor() {
    const { W, H, tiles } = this.d;
    const dist = new Uint8Array(W * H).fill(255);
    const q = [];
    for (let i = 0; i < W * H; i++)
      if (tiles[i] === T.YARD) {
        dist[i] = 0;
        q.push(i);
      }
    for (let h = 0; h < q.length; h++) {
      const i = q[h];
      const x = i % W;
      const y = (i - x) / W;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const j = ny * W + nx;
        if (tiles[j] === T.ROCK || dist[j] !== 255 || !this.world.passable(x, y, dx, dy)) continue;
        dist[j] = Math.min(254, dist[i] + 1);
        q.push(j);
      }
    }
    this.airDist = dist;
  }

  // 0 out in the open, 1 well inside; ramps through the doorway.
  indoorAt(x, z) {
    if (this.d.upper) return 1;
    const tx = Math.floor(x / TILE);
    const ty = Math.floor(z / TILE);
    if (tx < 0 || ty < 0 || tx >= this.d.W || ty >= this.d.H) return 0;
    const dd = this.airDist[ty * this.d.W + tx];
    if (dd === 0) return 0;
    if (dd === 1) return 0.2 + 0.5 * Math.min(1, Math.max(0, (this.d.front * TILE - z) / TILE));
    if (dd === 2) return 0.85;
    return dd === 255 ? 0 : 1;
  }

  buildHiding() {
    for (const h of this.d.hiding) {
      const dims = HIDE_DIMS[h.kind];
      const model = h.kind === 'locker' ? M.makeLocker() : M.mergeStatic(h.kind === 'closet' ? M.makeCloset() : h.kind === 'bed' ? M.makeBed(true) : M.makeBench());
      model.position.set(h.x, 0, h.z);
      model.rotation.y = h.angle;
      this.fgroup.add(model);
      const sx = h.fx !== 0 ? dims.d : dims.w;
      const sz = h.fx !== 0 ? dims.w : dims.d;
      const collider = this.world.addCollider(h.x - sx / 2, h.z - sz / 2, h.x + sx / 2, h.z + sz / 2);
      const exitD = dims.d / 2 + 0.7;
      this.hiding.push({ kind: h.kind, x: h.x, z: h.z, fx: h.fx, fz: h.fz, exit: { x: h.x + h.fx * exitD, z: h.z + h.fz * exitD }, model, collider, label: dims.label });
    }
  }

  buildContainers() {
    const lock = this.loc.lock;
    const all = [...this.d.containers, ...(lock ? this.d.vaultBoxes : [])];
    for (const c of all) {
      const m = makeContainer(c.kind);
      m.group.position.set(c.x, 0, c.z);
      m.group.rotation.y = c.angle;
      this.fgroup.add(m.group);
      const w = CONTAINER_WIDTH[c.kind];
      const dp = CONTAINER_DEPTH[c.kind];
      const sx = c.fx !== 0 ? dp : w;
      const sz = c.fx !== 0 ? w : dp;
      this.world.addCollider(c.x - sx / 2, c.z - sz / 2, c.x + sx / 2, c.z + sz / 2);
      const items = c.vault ? lock.boxes[c.idx] : this.loc.containers[c.idx];
      const empty = !(items || []).length;
      this.containers.push({ ...c, opened: false, empty, lid: m.lid, hinge: m.hinge, open: 0, label: CONTAINER_LABEL[c.kind] || 'Search' });
    }
  }

  buildTraps() {
    const d = this.d;
    for (const p of d.pits) {
      const s = M.makeSpikeField(26, TILE - 0.4);
      s.position.set((p.tx + 0.5) * TILE, -PIT_DEPTH, (p.ty + 0.5) * TILE);
      this.fgroup.add(s);
    }
    for (const b of d.bearTraps) {
      const m = M.makeBearTrap();
      m.group.position.set(b.x, 0, b.z);
      m.group.rotation.y = this.rng.range(0, 6.28);
      this.fgroup.add(m.group);
      this.bearTraps.push({ x: b.x, z: b.z, armed: true, jaws: m.jaws });
    }
    for (const w of d.tripwires) {
      const m = M.makeTripwire(TILE);
      m.group.position.set(w.x, 0, w.z);
      m.group.rotation.y = w.alongX ? Math.PI / 2 : 0;
      this.fgroup.add(m.group);
      this.wires.push({ ...w, ...m, triggered: false, t: 0 });
    }
    for (const g of d.glass) {
      const m = M.mergeStatic(M.makeGlass(this.rng), false);
      m.position.set((g.tx + 0.5) * TILE, 0, (g.ty + 0.5) * TILE);
      this.fgroup.add(m);
      this.glassTiles.add(g.ty * d.W + g.tx);
    }
  }

  buildLamps() {
    for (const l of this.d.lamps) {
      const m = makeWallLamp(l.red ? 0xff3a2a : 0xd8e4ff);
      m.group.position.set(l.x, 0, l.z);
      m.group.rotation.y = Math.atan2(l.fx, l.fz);
      this.fgroup.add(m.group);
      const pos = new THREE.Vector3(l.x + l.fx * 0.4, 2.6, l.z + l.fz * 0.4);
      this.lamps.push({ ...m, pos, red: l.red, phase: this.rng.range(0, 10), dead: 0 });
    }
  }

  buildDecor() {
    for (const dc of this.d.decor) {
      let m;
      if (dc.kind === 'blood') {
        m = M.makeBlood(this.rng);
        m.scale.set(dc.s * 1.6, dc.s * 1.6, 1);
        m.position.set(dc.x, 0.012, dc.z);
        m.rotation.z = dc.rot;
      } else if (dc.kind === 'debris') {
        m = makeDebris(() => this.rng.next());
        m.position.set(dc.x, 0, dc.z);
        m.rotation.y = dc.rot;
      } else {
        m = M.mergeStatic(M.makeBones(this.rng, dc.kind === 'skull'), false);
        m.position.set(dc.x, 0, dc.z);
        m.rotation.y = dc.rot;
      }
      this.fgroup.add(m);
    }
  }

  // Every room's furniture, merged into a handful of meshes.
  buildFurniture() {
    const all = new THREE.Group();
    const flat = new THREE.Group();
    for (const f of this.d.furniture) {
      const m = makeFurniture(f.kind, this.rng);
      m.position.set(f.x, 0, f.z);
      m.rotation.y = f.angle || 0;
      (FURN[f.kind].decor ? flat : all).add(m);
      if (f.boxes) for (const b of f.boxes) this.world.addCollider(b.x0, b.z0, b.x1, b.z1);
      else if (!f.decorOnly && f.box) {
        // a little inside the footprint so you can squeeze past
        const b = f.box;
        this.world.addCollider(b.x0 + 0.05, b.z0 + 0.05, b.x1 - 0.05, b.z1 - 0.05);
      }
    }
    this.fgroup.add(M.mergeStatic(all, true));
    if (flat.children.length) this.fgroup.add(M.mergeStatic(flat, false));
  }

  // Windows in the outside walls: daylight through dusty blinds, or boards.
  buildWindows() {
    const env = this.game.env;
    const out = env.out;
    const day = this.game.run.phase === 'day';
    const sky = out ? out.sky.clone().lerp(new THREE.Color(0xffffff), 0.3) : new THREE.Color(0xa8b4c0);
    const glowC = day ? sky.multiplyScalar(0.95) : new THREE.Color(0x0a1220);
    const frameMat = M.lambert({ color: 0x3a3430, roughness: 0.7 });
    const blindMat = new THREE.MeshBasicMaterial({ map: tex('blinds', 109), color: glowC, toneMapped: true, fog: false });
    const blindMat2 = new THREE.MeshBasicMaterial({ map: tex('blinds', 110), color: glowC, fog: false });
    const glassMat = new THREE.MeshBasicMaterial({ color: glowC, fog: false });
    const plank = M.lambert({ map: tex('wood', 5), color: 0x8a6a4a });
    const shaftMat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false });
    const staticG = new THREE.Group();
    const lit = new THREE.Group();
    for (const w of this.d.windows) {
      const g = new THREE.Group();
      const y = w.lowSill ? 1.75 : 1.55;
      const fw = w.w;
      const fh = w.h;
      g.add(M.box(fw + 0.16, 0.08, 0.1, frameMat, 0, y - fh / 2 - 0.04, 0.03));
      g.add(M.box(fw + 0.16, 0.08, 0.06, frameMat, 0, y + fh / 2 + 0.04, 0.02));
      for (const s of [-1, 1]) g.add(M.box(0.08, fh, 0.06, frameMat, (s * (fw + 0.08)) / 2, y, 0.02));
      g.add(M.box(0.04, fh, 0.04, frameMat, 0, y, 0.02));
      const pane = new THREE.Mesh(new THREE.PlaneGeometry(fw, fh), w.boarded ? glassMat : this.rng.chance(0.6) ? blindMat : this.rng.chance(0.5) ? blindMat2 : glassMat);
      pane.position.set(0, y, 0.005);
      const pg = new THREE.Group();
      pg.add(pane);
      pg.position.set(w.x, 0, w.z);
      pg.rotation.y = w.angle;
      lit.add(pg);
      if (w.boarded) {
        // planks nailed across, daylight in the gaps
        for (let k = 0; k < 4; k++) {
          const p = M.box(fw + 0.3, 0.2, 0.05, plank, this.rng.range(-0.05, 0.05), y - fh / 2 + 0.18 + k * (fh / 4), 0.06);
          p.rotation.z = this.rng.range(-0.12, 0.12);
          g.add(p);
        }
      } else if (day) {
        // a shaft of light falling into the room
        const geo = new THREE.BufferGeometry();
        const hw = fw / 2;
        const hh = fh / 2;
        const len = 3.4;
        const drop = 1.4;
        const pos = [-hw, y - hh, 0.02, hw, y - hh, 0.02, hw, y + hh, 0.02, -hw, y + hh, 0.02, -hw - 0.3, y - hh - drop, len, hw + 0.3, y - hh - drop, len, hw + 0.3, y + hh - drop, len, -hw - 0.3, y + hh - drop, len];
        const a0 = 0.11;
        const col = [];
        for (let k = 0; k < 8; k++) col.push(glowC.r, glowC.g * 0.95, glowC.b * 0.85, k < 4 ? a0 : 0);
        geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 4));
        geo.setIndex([0, 1, 5, 0, 5, 4, 1, 2, 6, 1, 6, 5, 2, 3, 7, 2, 7, 6, 3, 0, 4, 3, 4, 7]);
        const shaft = new THREE.Mesh(geo, shaftMat);
        shaft.position.set(w.x, 0, w.z);
        shaft.rotation.y = w.angle;
        shaft.renderOrder = 2;
        lit.add(shaft);
      }
      g.position.set(w.x, 0, w.z);
      g.rotation.y = w.angle;
      staticG.add(g);
      this.windows.push(w);
    }
    if (staticG.children.length) this.fgroup.add(M.mergeStatic(staticG, false));
    this.fgroup.add(lit);
  }

  // The stairwell: a landing, a flight up into the dark and/or a flight down.
  buildStairs() {
    const st = this.d.stairs;
    this.stairs = null;
    if (!st) return;
    const g = new THREE.Group();
    const L0 = { x: (st.landing.x + 0.5) * TILE, z: (st.landing.y + 0.5) * TILE };
    const ux = st.far.x - st.landing.x;
    const uz = st.far.y - st.landing.y;
    // local frame: u runs from the landing into the stairwell, v across it
    const vx = -uz;
    const vz = ux;
    const P = (u, v) => [L0.x - (ux * TILE) / 2 + ux * u + vx * v, L0.z - (uz * TILE) / 2 + uz * u + vz * v];
    const concrete = M.lambert({ map: tex('concrete', 23), color: 0x8a8680, roughness: 0.95 });
    const dark = M.lambert({ color: 0x1a1816, roughness: 1 });
    const rail = M.lambert({ color: 0x5a3a24, roughness: 0.5, metalness: 0.2 });
    const steel = M.lambert({ color: 0x4a4e50, roughness: 0.4, metalness: 0.7 });
    const ceil = M.lambert({ map: tex('ceiling', 4), roughness: 0.95 });
    const slab = (u0, u1, v0, v1, y0, y1, mat) => {
      const [cx, cz] = P((u0 + u1) / 2, (v0 + v1) / 2);
      const lu = u1 - u0;
      const lv = v1 - v0;
      const bx = Math.abs(ux) ? lu : lv;
      const bz = Math.abs(ux) ? lv : lu;
      const m = M.box(bx, y1 - y0, bz, mat, cx, (y0 + y1) / 2, cz);
      m.receiveShadow = true;
      g.add(m);
      return m;
    };
    const total = TILE * 2;
    const start = 1.0; // the landing's depth
    const run = total - start;
    const n = 12;
    const rise = WALL_H / n;
    const tread = run / n;
    // the landing and its ceiling
    slab(0, start, -TILE / 2, TILE / 2, -0.05, 0, concrete);
    slab(0, start, -TILE / 2, TILE / 2, WALL_H, WALL_H + 0.1, ceil);
    // left half: a flight up, or floor
    if (st.up) {
      for (let k = 0; k < n; k++) slab(start + k * tread, total, -TILE / 2, -0.05, 0, (k + 1) * rise, concrete);
      // the shaft above, so the flight climbs into darkness
      slab(start, total, -TILE / 2, -0.05, WALL_H + 3.0, WALL_H + 3.1, dark);
      for (const v of [-TILE / 2, -0.05]) slab(start, total, v - 0.02, v + 0.02, WALL_H, WALL_H + 3.0, dark);
      slab(total - 0.02, total, -TILE / 2, -0.05, WALL_H, WALL_H + 3.0, dark);
      // handrail
      for (let k = 0; k <= n; k += 3) slab(start + k * tread - 0.03, start + k * tread + 0.03, -0.1, -0.06, k * rise, k * rise + 0.95, steel);
      const r0 = P(start, -0.08);
      const r1 = P(total, -0.08);
      const len = Math.hypot(run, WALL_H);
      const hr = M.box(0.06, 0.06, len, rail);
      hr.position.set((r0[0] + r1[0]) / 2, WALL_H / 2 + 0.95, (r0[1] + r1[1]) / 2);
      hr.lookAt(r1[0], WALL_H + 0.95, r1[1]);
      g.add(hr);
    } else {
      slab(start, total, -TILE / 2, 0, -0.05, 0, concrete);
      slab(start, total, -TILE / 2, 0, WALL_H, WALL_H + 0.1, ceil);
    }
    // right half: a flight down, or floor
    if (st.down) {
      for (let k = 0; k < n; k++) slab(start + k * tread, total, 0.05, TILE / 2, -WALL_H, -(k + 1) * rise + 0.001, concrete);
      slab(start, total, 0.05, TILE / 2, -WALL_H - 0.1, -WALL_H, dark);
      slab(start, total, 0, 0.05, -WALL_H, 0, dark);
      slab(total - 0.02, total, 0, TILE / 2, -WALL_H, 0, dark);
      // a railing around the stairwell
      for (let u = start; u <= total; u += 0.5) slab(u - 0.025, u + 0.025, 0.0, 0.05, 0, 1.0, steel);
      slab(start, total, -0.01, 0.07, 0.98, 1.04, rail);
      slab(start - 0.03, start + 0.03, 0.05, TILE / 2, 0.98, 1.04, rail);
      for (let v = 0.5; v <= TILE / 2; v += 0.5) slab(start - 0.025, start + 0.025, v - 0.025, v + 0.025, 0, 1.0, steel);
      slab(start, total, 0.05, TILE / 2, WALL_H, WALL_H + 0.1, ceil);
    } else {
      slab(start, total, 0, TILE / 2, -0.05, 0, concrete);
      slab(start, total, 0, TILE / 2, WALL_H, WALL_H + 0.1, ceil);
    }
    // a sign on the wall
    const label = this.floorIdx === 0 ? 'G' : String(this.floorIdx + 1);
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), new THREE.MeshStandardMaterial({ map: signTex(label), roughness: 0.6 }));
    const [sx, sz] = P(0.5, -TILE / 2 + 0.02);
    sign.position.set(sx, 1.9, sz);
    sign.rotation.y = Math.atan2(vx, vz);
    g.add(sign);
    this.fgroup.add(M.mergeStatic(g, true));
    // the flights are out of bounds; you take them with E from the landing
    const a = P(start, -TILE / 2);
    const b = P(total, TILE / 2);
    this.world.addCollider(Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[0], b[0]), Math.max(a[1], b[1]));
    const [upX, upZ] = P(start - 0.3, -0.75);
    const [dnX, dnZ] = P(start - 0.3, 0.75);
    this.stairs = { up: st.up ? { x: upX, z: upZ } : null, down: st.down ? { x: dnX, z: dnZ } : null };
  }

  // The vault's barred gate, locked until someone brings the key.
  buildGate() {
    const gt = this.d.gate;
    const lock = this.loc.lock;
    if (!gt || !lock) return;
    const g = new THREE.Group();
    const m = M.lambert({ color: 0x3a3e40, roughness: 0.4, metalness: 0.8 });
    const leaf = new THREE.Group();
    for (let x = 0.07; x < DOOR_W; x += 0.13) leaf.add(M.box(0.035, DOOR_H - 0.1, 0.035, m, x, DOOR_H / 2, 0));
    for (const y of [0.1, 1.1, DOOR_H - 0.1]) leaf.add(M.box(DOOR_W, 0.06, 0.05, m, DOOR_W / 2, y, 0));
    const padlock = M.box(0.12, 0.16, 0.08, M.lambert({ color: 0xb89a40, roughness: 0.3, metalness: 0.9 }), DOOR_W - 0.15, 1.05, 0.06);
    leaf.add(padlock);
    leaf.position.x = -DOOR_W / 2;
    g.add(leaf);
    // a hasp and a stencilled warning
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.3), new THREE.MeshStandardMaterial({ map: signTex(lock.vault.toUpperCase(), '#c8a020', '#1a1a1a'), roughness: 0.6 }));
    sign.position.set(0, 2.55, -0.12);
    sign.rotation.y = Math.PI;
    g.add(sign);
    g.position.set(gt.x, 0, gt.z);
    g.rotation.y = gt.angle;
    this.fgroup.add(g);
    const hw = DOOR_W / 2;
    const collider = gt.dx ? this.world.addCollider(gt.x - 0.08, gt.z - hw, gt.x + 0.08, gt.z + hw) : this.world.addCollider(gt.x - hw, gt.z - 0.08, gt.x + hw, gt.z + 0.08);
    this.gateObj = { ...gt, group: g, leaf, padlock, collider, open: lock.opened ? 1 : 0, label: '' };
    if (lock.opened) this.openGate(true);
  }

  openGate(instant = false) {
    const go = this.gateObj;
    go.opening = true;
    if (instant) go.open = 1;
    go.padlock.visible = false;
    this.world.removeCollider(go.collider);
    const e = go.edge;
    if (e.dx) this.world.edgeE[e.y * this.d.W + e.x - (e.dx < 0 ? 1 : 0)] = EDGE.DOOR;
    else this.world.edgeS[(e.y - (e.dy < 0 ? 1 : 0)) * this.d.W + e.x] = EDGE.DOOR;
  }

  // Batteries, the key, notes.
  buildPickups() {
    const lock = this.loc.lock;
    for (const p of this.d.pickups) {
      let m;
      if (p.kind === 'battery') m = makeBattery();
      else if (p.kind === 'key') m = makeKey();
      else m = makeNote(p.pinned);
      m.position.set(p.x, p.y + (p.pinned ? 0 : 0.01), p.z);
      m.rotation.y = p.angle ?? this.rng.range(0, Math.PI * 2);
      this.fgroup.add(m);
      const glint = M.glowSprite(p.kind === 'key' ? 0xffd070 : p.kind === 'battery' ? 0x9affb0 : 0xfff0d0, p.kind === 'key' ? 0.5 : 0.35, 0.5);
      glint.position.set(p.x, p.y + 0.12, p.z);
      this.fgroup.add(glint);
      let label = 'Pick up the battery';
      let text = '';
      if (p.kind === 'key') label = `Take the ${this.loc.key.label}`;
      else if (p.kind === 'note') {
        label = 'Read the note';
        text = this.loc.notes[p.note].text;
      } else if (p.kind === 'gatenote') {
        label = 'Read the note on the wall';
        text = lock.note;
      }
      this.pickups.push({ ...p, model: m, glint, label, text, taken: false });
    }
  }

  // ------------------------------------------------------------ map
  markExplored(x, y) {
    const d = this.d;
    const W = d.W;
    if (x < 0 || y < 0 || x >= W || y >= d.H) return;
    const i = y * W + x;
    if (this.explored[i]) return;
    this.explored[i] = 1;
    const t = d.tiles[i];
    const ctx = this.mapCtx;
    if (t === T.ROCK) ctx.fillStyle = '#2a2420';
    else if (t === T.YARD) ctx.fillStyle = '#3f7a46';
    else if (t === T.PIT) ctx.fillStyle = '#8a1c1c';
    else if (d.stairs && d.skipFloor.has(i)) ctx.fillStyle = '#6a6a8a';
    else ctx.fillStyle = this.glassTiles.has(i) ? '#8a9aa8' : '#857462';
    const P = MAP_PX;
    ctx.fillRect(x * P, y * P, P, P);
    if (t === T.ROCK || !d.edgeE) return;
    // thin walls drawn on the tile's edges
    ctx.fillStyle = '#1a1410';
    const w = this.world;
    const wall = (dx, dy) => {
      const e = w.edge(x, y, dx, dy);
      return e === EDGE.WALL || e === EDGE.GATE;
    };
    if (wall(1, 0)) ctx.fillRect(x * P + P - 1, y * P, 1, P);
    if (wall(-1, 0)) ctx.fillRect(x * P, y * P, 1, P);
    if (wall(0, 1)) ctx.fillRect(x * P, y * P + P - 1, P, 1);
    if (wall(0, -1)) ctx.fillRect(x * P, y * P, P, 1);
  }

  revealAround(px, pz) {
    const world = this.world;
    const [cx, cy] = world.tileOf(px, pz);
    const R = 5;
    for (let y = cy - R; y <= cy + R; y++)
      for (let x = cx - R; x <= cx + R; x++) {
        if (x < 0 || y < 0 || x >= this.d.W || y >= this.d.H) continue;
        if (this.explored[y * this.d.W + x]) continue;
        const wx = (x + 0.5) * TILE;
        const wz = (y + 0.5) * TILE;
        const dd = Math.hypot(wx - px, wz - pz);
        if (dd > R * TILE) continue;
        const t = world.t(x, y);
        if (t === T.ROCK) {
          if (world.rayDist(px, pz, wx, wz) >= dd - TILE * 0.75) this.markExplored(x, y);
        } else if (world.los(px, pz, wx, wz) || world.rayDist(px, pz, wx, wz) >= dd - TILE * 0.6) this.markExplored(x, y);
      }
    for (const c of this.containers) if (!c.seen && dist2D(c.x, c.z, px, pz) < 12 && world.los(px, pz, c.x, c.z)) c.seen = true;
    for (const f of this.found)
      if (!f.seen && dist2D(f.pos.x, f.pos.z, px, pz) < 16 && world.los(px, pz, f.pos.x, f.pos.z)) {
        f.seen = true;
        this.game.ui.message(f.rec.dog ? `A dog — ${f.name}! It looks hungry.` : `Someone is alive in here — ${f.name}!`, 'good');
      }
    const go = this.gateObj;
    if (go && !go.seen && dist2D(go.x, go.z, px, pz) < 9 && world.rayDist(px, pz, go.x, go.z) > dist2D(go.x, go.z, px, pz) - 0.6) {
      go.seen = true;
      const lock = this.loc.lock;
      if (!lock.opened) {
        lock.seen = true;
        this.game.ui.message(`A locked gate — the ${lock.vault}. ${this.game.run.keys.includes(lock.id) ? 'You have the key.' : 'You need a key.'}`, 'gold', 4);
      }
    }
  }

  mapMarkers() {
    const out = [];
    if (this.exitMarker) out.push({ x: this.exitMarker.x, z: this.exitMarker.z, color: '#7affa0', shape: 'square' });
    if (this.stairs) for (const s of [this.stairs.up, this.stairs.down]) if (s) out.push({ x: s.x, z: s.z, color: '#b8b8ff', shape: 'square' });
    for (const c of this.containers) if (c.seen) out.push({ x: c.x, z: c.z, color: c.opened ? '#4a4038' : '#f0b43a', shape: 'dot' });
    for (const f of this.found) if (f.seen && f.mode === 'found') out.push({ x: f.pos.x, z: f.pos.z, color: '#6fd05a', shape: 'dot' });
    for (const a of this.actors) if (a.alive) out.push({ x: a.pos.x, z: a.pos.z, color: '#6fd6ff', shape: 'dot' });
    if (this.gateObj?.seen) out.push({ x: this.gateObj.x, z: this.gateObj.z, color: this.loc.lock.opened ? '#8a8a8a' : '#e0b030', shape: 'square' });
    return out;
  }

  // ------------------------------------------------------------ interactions
  interactables() {
    const out = [];
    for (const h of this.hiding) out.push({ type: 'hide', obj: h, x: h.x, z: h.z, label: h.label, range: 2.0 });
    for (const c of this.containers) if (!c.opened) out.push({ type: 'container', obj: c, x: c.x, z: c.z, label: c.label, range: 2.0 });
    for (const f of this.found) if (f.mode === 'found' && f.alive) out.push({ type: 'recruit', obj: f, x: f.pos.x, z: f.pos.z, label: f.rec.dog ? `Call ${f.name} over` : `Talk to ${f.name}`, range: 2.2 });
    for (const p of this.pickups) if (!p.taken) out.push({ type: 'item', obj: p, x: p.x, z: p.z, label: p.label, range: p.pinned ? 2.0 : 1.8 });
    if (this.stairs) {
      if (this.stairs.up) out.push({ type: 'stairs', dir: 1, x: this.stairs.up.x, z: this.stairs.up.z, label: `Go upstairs (floor ${this.floorIdx + 2})`, range: 2.0 });
      if (this.stairs.down) out.push({ type: 'stairs', dir: -1, x: this.stairs.down.x, z: this.stairs.down.z, label: this.floorIdx === 1 ? 'Go down to the ground floor' : `Go downstairs (floor ${this.floorIdx})`, range: 2.0 });
    }
    const go = this.gateObj;
    if (go && !this.loc.lock.opened) {
      const has = this.game.run.keys.includes(this.loc.lock.id);
      out.push({ type: 'gate', obj: go, x: go.x - go.dx * 0.6, z: go.z - go.dy * 0.6, label: has ? `Unlock the ${this.loc.lock.vault}` : `Locked (${this.loc.lock.vault})`, range: 2.2 });
    }
    if (this.exitMarker) out.push({ type: 'exit', obj: this.exitMarker, x: this.exitMarker.x, z: this.exitMarker.z, label: 'Head back to camp', range: 2.4 });
    return out;
  }

  openContainer(c) {
    const g = this.game;
    const run = g.run;
    c.opened = true;
    g.audio.crate(false);
    g.emitNoise(c.x, c.z, NOISE.crate, 'player');
    const list = c.vault ? this.loc.lock.boxes : this.loc.containers;
    const items = list[c.idx] || [];
    if (!items.length) {
      g.ui.message(this.rng.pick(['Empty. Someone got here first.', 'Nothing but dust.', 'Picked clean.']), 'dim');
      return;
    }
    for (const it of grantLoot(run, items, this.L.ammo)) {
      if (it.weapon) {
        const def = WEAPONS[it.weapon.id];
        g.ui.message(`Found a ${def.name} (${RARITY[def.rarity].name})`, 'rarity-' + def.rarity, 4);
      } else g.ui.message(`Found ${describeItem(it)}`, it.k === 'scrap' ? 'gold' : it.k === 'food' ? 'food' : 'good');
      g.trip.found.push(it);
    }
    list[c.idx] = [];
    g.audio.pickup();
  }

  takePickup(p) {
    const g = this.game;
    const run = g.run;
    const locs = run.locality.locations;
    if (p.kind === 'battery') {
      p.taken = true;
      run.batteries++;
      g.trip.found.push({ k: 'battery', n: 1 });
      g.ui.message(`Found a battery (${run.batteries} spare).`, 'good');
      g.audio.pickup();
    } else if (p.kind === 'key') {
      p.taken = true;
      const key = this.loc.key;
      if (!run.keys.includes(key.opens)) run.keys.push(key.opens);
      const target = locs.find((l) => l.id === key.opens);
      if (target?.lock) target.lock.hint = true;
      g.trip.keys = (g.trip.keys || []).concat(key.label);
      g.ui.message(`Found the ${key.label}${target ? ` — it opens the ${target.lock.vault} there` : ''}.`, 'gold', 5);
      g.audio.pickup();
    } else {
      // notes stay where they are; reading one may point to a key
      const hintFor = p.kind === 'gatenote' ? this.loc.lock : p.note != null && this.loc.notes[p.note].hint != null ? locs.find((l) => l.id === this.loc.notes[p.note].hint)?.lock : null;
      if (hintFor) {
        hintFor.hint = true;
        const keyLoc = locs.find((l) => l.id === hintFor.keyAt);
        if (keyLoc) keyLoc.keyHint = true;
      }
      if (!run.notes.includes(p.text)) run.notes.push(p.text);
      g.audio.uiClick?.();
      g.openPanel('note', { text: p.text, where: this.loc.name, hint: !!hintFor });
    }
    if (p.taken) {
      p.model.visible = false;
      p.glint.visible = false;
    }
  }

  useGate(go) {
    const g = this.game;
    const lock = this.loc.lock;
    if (!g.run.keys.includes(lock.id)) {
      lock.seen = true;
      g.audio.click?.(0.5);
      const keyLoc = lock.hint ? g.run.locality.locations.find((l) => l.id === lock.keyAt) : null;
      g.ui.message(`The ${lock.vault} is locked.${keyLoc ? ` The key should be at ${keyLoc.name}.` : ' There must be a key somewhere in town.'}`, 'dim', 4);
      return;
    }
    lock.opened = true;
    this.openGate();
    g.audio.crate(true);
    g.emitNoise(go.x, go.z, NOISE.crate, 'player');
    g.ui.message(`The key turns. The ${lock.vault} swings open.`, 'gold', 4);
  }

  recruit(actor) {
    const g = this.game;
    const run = g.run;
    const alive = run.survivors.filter((s) => s.status !== 'dead').length;
    if (alive >= MAX_SURVIVORS) {
      g.ui.message(actor.rec.dog ? `There's no room on the train for ${actor.name}. (max ${MAX_SURVIVORS})` : `"There's no room on your train for me..." (max ${MAX_SURVIVORS} survivors)`, 'dim', 4);
      return;
    }
    actor.rec.status = 'camp';
    run.survivors.push(actor.rec);
    run.stats.recruited++;
    this.loc.survivors = this.loc.survivors.filter((s) => s !== actor.rec);
    actor.mode = 'follow';
    this.found = this.found.filter((f) => f !== actor);
    this.group.attach(actor.root);
    this.actors.push(actor);
    g.trip.recruits.push(actor.rec.dog ? `${actor.rec.name} the dog` : actor.rec.name);
    g.audio.pickup();
    g.ui.message(actor.rec.dog ? `${actor.rec.name} the ${actor.rec.look.breed.toLowerCase()} pads over and joins you!` : `${actor.rec.name} (level ${actor.rec.level}) joins you!`, 'good', 4);
  }

  // Move everyone following the player to where they arrive on a floor.
  bringCompanions(x, z) {
    this.actors.forEach((a, i) => {
      if (!a.alive) return;
      a.pos.set(x + (i % 2 ? 0.9 : -0.9), 0, z + 0.9 + Math.floor(i / 2) * 0.8);
      this.world.collide(a.pos, 0.3);
      a.root?.position.copy(a.pos);
      a.path = null;
    });
  }

  // ------------------------------------------------------------ update
  update(dt) {
    const g = this.game;
    const p = g.player;
    const t = g.time;
    for (const c of this.containers) {
      if (c.opened && c.open < 1) {
        c.open = Math.min(1, c.open + dt * 2.5);
        if (c.hinge === 'door') c.lid.rotation.y = -c.open * 1.8;
        else if (c.hinge === 'lid') c.lid.rotation.x = -c.open * 1.7;
      }
    }
    const go = this.gateObj;
    if (go && go.opening && go.open < 1) go.open = Math.min(1, go.open + dt * 0.9);
    if (go) go.leaf.rotation.y = go.open * 1.75;
    for (const e of this.enemies) {
      if (!e.hunting && dist2D(e.pos.x, e.pos.z, p.pos.x, p.pos.z) > 55) {
        e.lodAcc = (e.lodAcc || 0) + dt;
        if (e.lodAcc < 0.2) continue;
        e.update(e.lodAcc);
        e.lodAcc = 0;
      } else e.update(dt);
    }
    this.enemies = this.enemies.filter((e) => {
      if (!e.gone) return true;
      e.dispose();
      e.root.parent?.remove(e.root);
      return false;
    });
    this.enemyInteractions();
    for (const a of this.actors) a.update(dt);
    for (const f of this.found) f.update(dt);
    this.updateTraps(dt);
    for (const l of this.lamps) {
      if (l.dead > 0) l.dead -= dt;
      else if (Math.random() < dt * 0.15) l.dead = 0.05 + Math.random() * 0.3;
      const on = l.dead <= 0 ? 1 : 0.1;
      l.glow.material.opacity = 0.55 * on;
      l.bulb.material.color.setScalar(on);
      if (l.red && on) l.bulb.material.color.setRGB(1, 0.25, 0.2);
      l.on = on;
    }
    for (const pk of this.pickups) if (!pk.taken) pk.glint.material.opacity = 0.35 + Math.sin(t * 3 + pk.x) * 0.2;
    if (this.exitMarker) this.exitMarker.glow.material.opacity = 0.55 + Math.sin(t * 2.5) * 0.2;
    this.revealT -= dt;
    if (this.revealT <= 0) {
      this.revealT = 0.15;
      if (!p.hidden) this.revealAround(p.pos.x, p.pos.z);
    }
  }

  enemyInteractions() {
    const list = this.enemies;
    for (let i = 0; i < list.length; i++) {
      const a = list[i];
      if (!a.alive) continue;
      for (let j = i + 1; j < list.length; j++) {
        const b = list[j];
        if (!b.alive) continue;
        const dx = b.pos.x - a.pos.x;
        const dz = b.pos.z - a.pos.z;
        const d = Math.hypot(dx, dz);
        const min = a.radius + b.radius;
        if (d < min && d > 1e-4) {
          const push = (min - d) / 2;
          const nx = dx / d;
          const nz = dz / d;
          a.pos.x -= nx * push;
          a.pos.z -= nz * push;
          b.pos.x += nx * push;
          b.pos.z += nz * push;
        }
        // Brutes and Grunts still brawl when they cross paths
        const pair = (a.type === 'brute' && b.type === 'grunt') || (a.type === 'grunt' && b.type === 'brute');
        if (pair && d < 2.6 && a.state !== 'fight' && b.state !== 'fight' && a.stun <= 0 && b.stun <= 0 && this.world.los(a.pos.x, a.pos.z, b.pos.x, b.pos.z)) {
          a.setState('fight');
          b.setState('fight');
          a.fightWith = b;
          b.fightWith = a;
          a.attackCd = 0.3;
          b.attackCd = 0.5;
          this.game.audio.growl('brute', (a.type === 'brute' ? a : b).pos, 1.2);
        }
      }
    }
  }

  updateTraps(dt) {
    const g = this.game;
    const p = g.player;
    for (const bt of this.bearTraps) {
      if (!bt.armed) continue;
      if (p.alive && !p.hidden && p.pos.y < 0.25 && dist2D(bt.x, bt.z, p.pos.x, p.pos.z) < 0.5) {
        bt.armed = false;
        M.setBearTrapOpen(bt.jaws, false);
        g.audio.bearSnap(bt);
        g.emitNoise(bt.x, bt.z, NOISE.bearTrap, 'player');
        p.trapped = 2.5;
        p.damage(25, 'beartrap');
        g.ui.message('A bear trap bites into your leg!', 'bad');
        continue;
      }
      for (const e of this.enemies) {
        if (!e.alive || e.stun > 0) continue;
        if (dist2D(bt.x, bt.z, e.pos.x, e.pos.z) < 0.45 + e.radius * 0.5) {
          bt.armed = false;
          M.setBearTrapOpen(bt.jaws, false);
          g.audio.bearSnap(bt);
          e.trap(e.type === 'brute' ? 5 : 6, e.type === 'brute' ? 60 : 40);
          break;
        }
      }
    }
    const prev = this.prevPlayer || p.pos.clone();
    for (const w of this.wires) {
      if (w.triggered) {
        w.t += dt;
        const ext = w.t < 0.12 ? w.t / 0.12 : w.t < 1.5 ? 1 : Math.max(0, 1 - (w.t - 1.5) / 0.6);
        w.spikes.visible = ext > 0;
        for (const s of w.spikes.children) s.position.x = s.userData.s * (TILE / 2 + 0.6 - 1.2 * ext);
        continue;
      }
      if (!p.alive || p.hidden || p.pos.y > 0.3) continue;
      const crossed = w.alongX
        ? (prev.x - w.x) * (p.pos.x - w.x) <= 0 && Math.abs(p.pos.z - w.z) < 1.5 && prev.x !== p.pos.x
        : (prev.z - w.z) * (p.pos.z - w.z) <= 0 && Math.abs(p.pos.x - w.x) < 1.5 && prev.z !== p.pos.z;
      if (crossed) {
        w.triggered = true;
        w.wire.visible = false;
        g.audio.spikes(w);
        g.emitNoise(w.x, w.z, NOISE.spikes, 'player');
        p.damage(30, 'spikes');
        g.ui.message('Tripwire! Spikes lance from the walls!', 'bad');
      }
    }
    this.prevPlayer = p.pos.clone();
  }

  assignLights(lights, px, pz) {
    const sorted = this.lamps.map((t) => ({ t, d: dist2D(t.pos.x, t.pos.z, px, pz) })).sort((a, b) => a.d - b.d);
    lights.forEach((l, i) => {
      const s = sorted[i];
      if (s && s.d < 30) {
        l.position.copy(s.t.pos);
        l.userData.torch = s.t;
        l.userData.on = true;
        l.color.setHex(s.t.red ? 0xff3020 : 0xc8d8ff);
      } else {
        l.userData.on = false;
        l.intensity = 0;
      }
    });
  }

  dispose() {
    const scene = this.game.scene;
    if (this.floorIdx >= 0) {
      const st = this.states[this.floorIdx];
      for (const k of FLOOR_FIELDS) st[k] = this[k];
    }
    for (const st of this.states) {
      if (!st || !st.world) continue;
      for (const e of st.enemies) e.dispose();
      scene.remove(st.fgroup);
      scene.remove(st.world.group);
      st.fgroup.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
      });
      st.world.dispose();
    }
    scene.remove(this.group);
  }
}

// ---------------------------------------------------------------- small props
const signCache = new Map();
function signTex(text, bg = '#d8d4c8', fg = '#1a1a1a') {
  const key = text + bg + fg;
  if (signCache.has(key)) return signCache.get(key);
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = text.length > 3 ? 64 : 128;
  const ctx = c.getContext('2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = fg;
  ctx.font = text.length > 3 ? 'bold 14px sans-serif' : 'bold 84px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 64, c.height / 2 + 2);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  signCache.set(key, t);
  return t;
}

function makeBattery() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.13, 10), M.lambert({ color: 0x1a1a1a, roughness: 0.4, metalness: 0.4 }));
  body.rotation.z = Math.PI / 2;
  body.position.y = 0.035;
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.05, 10), M.lambert({ color: 0xd8a020, roughness: 0.4, metalness: 0.5 }));
  band.rotation.z = Math.PI / 2;
  band.position.set(0.035, 0.035, 0);
  g.add(body, band);
  return g;
}
function makeKey() {
  const g = new THREE.Group();
  const brass = M.lambert({ color: 0xc8a040, roughness: 0.3, metalness: 0.9 });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.01, 6, 14), brass);
  ring.rotation.x = Math.PI / 2;
  ring.position.set(-0.05, 0.012, 0);
  g.add(ring);
  g.add(M.box(0.11, 0.012, 0.016, brass, 0.03, 0.012, 0));
  g.add(M.box(0.012, 0.012, 0.03, brass, 0.07, 0.012, 0.016));
  // a paper tag
  g.add(M.box(0.05, 0.003, 0.035, M.lambert({ color: 0xe8dcc0 }), -0.1, 0.004, 0.03));
  return g;
}
function makeNote(pinned) {
  const g = new THREE.Group();
  const paper = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.29), M.lambert({ map: tex('mapPaper', 38), color: 0xf0e8d0, side: THREE.DoubleSide }));
  if (pinned) {
    paper.position.z = 0.01;
    g.add(paper);
    g.add(M.box(0.02, 0.02, 0.02, M.lambert({ color: 0xb81a12 }), 0, 0.12, 0.02));
  } else {
    paper.rotation.x = -Math.PI / 2;
    paper.position.y = 0.003;
    g.add(paper);
  }
  return g;
}
