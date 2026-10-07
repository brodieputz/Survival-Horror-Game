// A searchable location: builds the generated interior, its loot containers,
// survivors waiting to be found, hazards and zombies, and runs them.
import * as THREE from 'three';
import { generateBuilding } from './dungeon.js';
import { World } from './world.js';
import { Enemy } from './enemies.js';
import { SurvivorActor } from './survivors.js';
import { RNG, dist2D } from './util.js';
import { TILE, PIT_DEPTH, T, NOISE, MAX_SURVIVORS } from './config.js';
import * as M from './models.js';
import { makeContainer, makeWallLamp, makeDebris, CONTAINER_WIDTH, CONTAINER_DEPTH } from './props.js';
import { buildExterior } from './exterior.js';
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

export class BuildingScene {
  constructor(game, loc, companions) {
    this.game = game;
    this.kind = 'building';
    game.level = this;
    this.loc = loc;
    this.L = LOCATION_TYPES[loc.type];
    this.d = generateBuilding(loc, game.run.locality.biome);
    this.rng = new RNG((loc.seed ^ 0x9e3779b9) >>> 0);
    this.world = new World(this.d);
    this.group = new THREE.Group();
    game.scene.add(this.world.group);
    game.scene.add(this.group);

    this.hiding = [];
    this.containers = [];
    this.found = [];
    this.bearTraps = [];
    this.wires = [];
    this.lamps = [];
    this.glassTiles = new Set();
    this.enemies = [];
    this.actors = [];
    this.revealT = 0;

    const W = this.d.W;
    const H = this.d.H;
    this.explored = new Uint8Array(W * H);
    this.mapCanvas = document.createElement('canvas');
    this.mapCanvas.width = W;
    this.mapCanvas.height = H;
    this.mapCtx = this.mapCanvas.getContext('2d');
    this.mapCtx.fillStyle = '#000';
    this.mapCtx.fillRect(0, 0, W, H);

    this.buildYard();
    this.computeIndoor();
    this.buildHiding();
    this.buildContainers();
    this.buildTraps();
    this.buildLamps();
    this.buildDecor();
    for (const e of this.d.enemies) this.enemies.push(new Enemy(game, e.type, e.x, e.z, { group: this.group }));
    for (const s of this.d.survivors) {
      const rec = loc.survivors[s.idx];
      if (!rec) continue;
      const a = new SurvivorActor(game, rec, s.x, s.z, 'found', this.group);
      this.found.push(a);
    }
    // companions arrive with the player
    companions.forEach((rec, i) => {
      const sp = this.d.spawn;
      const a = new SurvivorActor(game, rec, sp.x + (i % 2 ? 1.2 : -1.2), sp.z - 1.2 - Math.floor(i / 2) * 1.2, 'follow', this.group);
      this.actors.push(a);
    });
    for (let y = this.d.yard.y - 1; y <= this.d.yard.y + this.d.yard.h; y++)
      for (let x = this.d.yard.x - 1; x <= this.d.yard.x + this.d.yard.w; x++) this.markExplored(x, y);
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
        if (tiles[j] === T.ROCK || dist[j] !== 255) continue;
        dist[j] = Math.min(254, dist[i] + 1);
        q.push(j);
      }
    }
    this.airDist = dist;
  }

  // 0 out in the open, 1 well inside; ramps through the doorway.
  indoorAt(x, z) {
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
      const model = h.kind === 'locker' ? M.makeLocker() : M.mergeStatic(h.kind === 'closet' ? M.makeCloset() : h.kind === 'bed' ? M.makeBed() : M.makeBench());
      model.position.set(h.x, 0, h.z);
      model.rotation.y = h.angle;
      this.group.add(model);
      const sx = h.fx !== 0 ? dims.d : dims.w;
      const sz = h.fx !== 0 ? dims.w : dims.d;
      const collider = this.world.addCollider(h.x - sx / 2, h.z - sz / 2, h.x + sx / 2, h.z + sz / 2);
      const exitD = dims.d / 2 + 0.7;
      this.hiding.push({ kind: h.kind, x: h.x, z: h.z, fx: h.fx, fz: h.fz, exit: { x: h.x + h.fx * exitD, z: h.z + h.fz * exitD }, model, collider, label: dims.label });
    }
  }

  buildContainers() {
    for (const c of this.d.containers) {
      const m = makeContainer(c.kind);
      m.group.position.set(c.x, 0, c.z);
      m.group.rotation.y = c.angle;
      this.group.add(m.group);
      const w = CONTAINER_WIDTH[c.kind];
      const dp = CONTAINER_DEPTH[c.kind];
      const sx = c.fx !== 0 ? dp : w;
      const sz = c.fx !== 0 ? w : dp;
      this.world.addCollider(c.x - sx / 2, c.z - sz / 2, c.x + sx / 2, c.z + sz / 2);
      const empty = !(this.loc.containers[c.idx] || []).length;
      this.containers.push({ ...c, opened: false, empty, lid: m.lid, hinge: m.hinge, open: 0, label: CONTAINER_LABEL[c.kind] || 'Search' });
    }
  }

  buildTraps() {
    const d = this.d;
    for (const p of d.pits) {
      const s = M.makeSpikeField(26, TILE - 0.4);
      s.position.set((p.tx + 0.5) * TILE, -PIT_DEPTH, (p.ty + 0.5) * TILE);
      this.group.add(s);
    }
    for (const b of d.bearTraps) {
      const m = M.makeBearTrap();
      m.group.position.set(b.x, 0, b.z);
      m.group.rotation.y = this.rng.range(0, 6.28);
      this.group.add(m.group);
      this.bearTraps.push({ x: b.x, z: b.z, armed: true, jaws: m.jaws });
    }
    for (const w of d.tripwires) {
      const m = M.makeTripwire(TILE);
      m.group.position.set(w.x, 0, w.z);
      m.group.rotation.y = w.alongX ? Math.PI / 2 : 0;
      this.group.add(m.group);
      this.wires.push({ ...w, ...m, triggered: false, t: 0 });
    }
    for (const g of d.glass) {
      const m = M.mergeStatic(M.makeGlass(this.rng), false);
      m.position.set((g.tx + 0.5) * TILE, 0, (g.ty + 0.5) * TILE);
      this.group.add(m);
      this.glassTiles.add(g.ty * d.W + g.tx);
    }
  }

  buildLamps() {
    for (const l of this.d.lamps) {
      const m = makeWallLamp(l.red ? 0xff3a2a : 0xd8e4ff);
      m.group.position.set(l.x, 0, l.z);
      m.group.rotation.y = Math.atan2(l.fx, l.fz);
      this.group.add(m.group);
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
      this.group.add(m);
    }
  }

  // ------------------------------------------------------------ map
  markExplored(x, y) {
    const W = this.d.W;
    if (x < 0 || y < 0 || x >= W || y >= this.d.H) return;
    const i = y * W + x;
    if (this.explored[i]) return;
    this.explored[i] = 1;
    const t = this.d.tiles[i];
    const ctx = this.mapCtx;
    if (t === T.ROCK) ctx.fillStyle = '#2a2420';
    else if (t === T.YARD) ctx.fillStyle = '#3f7a46';
    else if (t === T.PIT) ctx.fillStyle = '#8a1c1c';
    else ctx.fillStyle = this.glassTiles.has(i) ? '#8a9aa8' : '#857462';
    ctx.fillRect(x, y, 1, 1);
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
        } else if (world.los(px, pz, wx, wz)) this.markExplored(x, y);
      }
    for (const c of this.containers) if (!c.seen && dist2D(c.x, c.z, px, pz) < 12 && world.los(px, pz, c.x, c.z)) c.seen = true;
    for (const f of this.found) if (!f.seen && dist2D(f.pos.x, f.pos.z, px, pz) < 16 && world.los(px, pz, f.pos.x, f.pos.z)) {
      f.seen = true;
      this.game.ui.message(`Someone is alive in here — ${f.name}!`, 'good');
    }
  }

  mapMarkers() {
    const out = [{ x: this.exitMarker.x, z: this.exitMarker.z, color: '#7affa0', shape: 'square' }];
    for (const c of this.containers) if (c.seen) out.push({ x: c.x, z: c.z, color: c.opened ? '#4a4038' : '#f0b43a', shape: 'dot' });
    for (const f of this.found) if (f.seen && f.mode === 'found') out.push({ x: f.pos.x, z: f.pos.z, color: '#6fd05a', shape: 'dot' });
    for (const a of this.actors) if (a.alive) out.push({ x: a.pos.x, z: a.pos.z, color: '#6fd6ff', shape: 'dot' });
    return out;
  }

  // ------------------------------------------------------------ interactions
  interactables() {
    const out = [];
    for (const h of this.hiding) out.push({ type: 'hide', obj: h, x: h.x, z: h.z, label: h.label, range: 2.0 });
    for (const c of this.containers) if (!c.opened) out.push({ type: 'container', obj: c, x: c.x, z: c.z, label: c.label, range: 2.0 });
    for (const f of this.found) if (f.mode === 'found' && f.alive) out.push({ type: 'recruit', obj: f, x: f.pos.x, z: f.pos.z, label: `Talk to ${f.name}`, range: 2.2 });
    out.push({ type: 'exit', obj: this.exitMarker, x: this.exitMarker.x, z: this.exitMarker.z, label: 'Head back to camp', range: 2.4 });
    return out;
  }

  openContainer(c) {
    const g = this.game;
    const run = g.run;
    c.opened = true;
    g.audio.crate(false);
    g.emitNoise(c.x, c.z, NOISE.crate, 'player');
    const items = this.loc.containers[c.idx] || [];
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
    this.loc.containers[c.idx] = [];
    g.audio.pickup();
  }

  recruit(actor) {
    const g = this.game;
    const run = g.run;
    const alive = run.survivors.filter((s) => s.status !== 'dead').length;
    if (alive >= MAX_SURVIVORS) {
      g.ui.message(`"There's no room on your train for me..." (max ${MAX_SURVIVORS} survivors)`, 'dim', 4);
      return;
    }
    actor.rec.status = 'camp';
    run.survivors.push(actor.rec);
    run.stats.recruited++;
    this.loc.survivors = this.loc.survivors.filter((s) => s !== actor.rec);
    actor.mode = 'follow';
    this.found = this.found.filter((f) => f !== actor);
    this.actors.push(actor);
    g.trip.recruits.push(actor.rec.name);
    g.audio.pickup();
    g.ui.message(`${actor.rec.name} (level ${actor.rec.level}) joins you!`, 'good', 4);
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
      this.group.remove(e.root);
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
    this.exitMarker.glow.material.opacity = 0.55 + Math.sin(t * 2.5) * 0.2;
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
    for (const e of this.enemies) e.dispose();
    this.game.scene.remove(this.group);
    this.game.scene.remove(this.world.group);
    this.group.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
    });
    this.world.dispose();
  }
}
