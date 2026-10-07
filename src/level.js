// A single dungeon level: builds props/pickups/traps/monsters from the
// generated layout and runs their per-frame logic.
import * as THREE from 'three';
import { generateDungeon } from './dungeon.js';
import { World } from './world.js';
import { Enemy } from './enemies.js';
import { RNG, dist2D } from './util.js';
import { TILE, WALL_H, PIT_DEPTH, T, NOISE } from './config.js';
import * as M from './models.js';
import { tex } from './textures.js';

const HIDE_DIMS = {
  locker: { w: 0.85, d: 0.6, label: 'Hide in locker' },
  closet: { w: 1.3, d: 0.72, label: 'Hide in wardrobe' },
  bed: { w: 2.0, d: 1.05, label: 'Crawl under bed' },
  bench: { w: 2.0, d: 0.56, label: 'Crawl under bench' },
};

export class Level {
  constructor(game, num, seed) {
    this.game = game;
    game.level = this;
    this.num = num;
    this.d = generateDungeon(num, seed);
    this.rng = new RNG((seed ^ 0x9e3779b9) >>> 0);
    this.world = new World(this.d);
    this.group = new THREE.Group();
    game.scene.add(this.world.group);
    game.scene.add(this.group);

    this.hiding = [];
    this.crates = [];
    this.golds = [];
    this.ammos = [];
    this.diamonds = [];
    this.bearTraps = [];
    this.wires = [];
    this.torches = [];
    this.candles = [];
    this.glassTiles = new Set();
    this.enemies = [];
    this.needed = this.d.diamonds.length;
    this.found = 0;
    this.mapOwned = false;
    this.unlocked = false;
    this.revealT = 0;
    this.lightT = 0;

    const W = this.d.W;
    const H = this.d.H;
    this.explored = new Uint8Array(W * H);
    this.mapCanvas = document.createElement('canvas');
    this.mapCanvas.width = W;
    this.mapCanvas.height = H;
    this.mapCtx = this.mapCanvas.getContext('2d');
    this.mapCtx.fillStyle = '#000';
    this.mapCtx.fillRect(0, 0, W, H);

    this.buildSafeRoom();
    this.buildHiding();
    this.buildCrates();
    this.buildPickups();
    this.buildTraps();
    this.buildTorches();
    this.buildDecor();
    for (const e of this.d.enemies) this.enemies.push(new Enemy(game, e.type, e.x, e.z));
    // the safe room is always on the map
    for (let y = this.d.safe.y - 1; y <= this.d.safe.y + this.d.safe.h; y++)
      for (let x = this.d.safe.x - 1; x <= this.d.safe.x + this.d.safe.w; x++) this.markExplored(x, y);
  }

  // ------------------------------------------------------------ build
  buildSafeRoom() {
    const d = this.d;
    const sw = d.safeWorld;
    const dir = d.door.dir;
    const half = (d.safe.w * TILE) / 2;
    const perp = [-dir[1], dir[0]];
    const faceAngle = Math.atan2(dir[0], dir[1]);

    // The Keeper (shop) against the wall opposite the door
    const sk = M.makeShopkeeper();
    const kx = sw.cx - dir[0] * (half - 1.0);
    const kz = sw.cz - dir[1] * (half - 1.0);
    sk.group.position.set(kx, 0, kz);
    sk.group.rotation.y = faceAngle;
    this.group.add(sk.group);
    this.keeper = { x: kx, z: kz, eyes: sk.eyes, label: 'Trade with the Keeper' };
    const cxs = Math.abs(dir[0]) ? 1.4 : 1.95;
    const czs = Math.abs(dir[0]) ? 1.95 : 1.4;
    this.world.addCollider(kx - cxs / 2, kz - czs / 2, kx + cxs / 2, kz + czs / 2);

    // Hatch to the next level (a back corner)
    const hx = sw.cx - dir[0] * (half - 2.0) + perp[0] * (half - 2.0);
    const hz = sw.cz - dir[1] * (half - 2.0) + perp[1] * (half - 2.0);
    const hatch = M.makeHatch();
    hatch.group.position.set(hx, 0, hz);
    hatch.group.rotation.y = faceAngle;
    this.group.add(hatch.group);
    this.hatch = { x: hx, z: hz, ...hatch, open: 0 };

    // A cot, rug, candles and shelves for a lived-in feel
    const bed = M.mergeStatic(M.makeBed(true));
    const bx = sw.cx - dir[0] * (half - 2.2) - perp[0] * (half - 0.65);
    const bz = sw.cz - dir[1] * (half - 2.2) - perp[1] * (half - 0.65);
    bed.position.set(bx, 0, bz);
    bed.rotation.y = Math.atan2(perp[0], perp[1]);
    this.group.add(bed);
    const bw = Math.abs(perp[0]) ? 1.1 : 2.05;
    const bd = Math.abs(perp[0]) ? 2.05 : 1.1;
    this.world.addCollider(bx - bw / 2, bz - bd / 2, bx + bw / 2, bz + bd / 2);

    const rug = new THREE.Mesh(new THREE.PlaneGeometry(3, 4.5), new THREE.MeshLambertMaterial({ map: tex('rug') }));
    rug.rotation.x = -Math.PI / 2;
    rug.rotation.z = faceAngle;
    rug.position.set(sw.cx, 0.01, sw.cz);
    this.group.add(rug);

    for (const [a, b] of [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ]) {
      const c = M.makeCandle();
      c.position.set(sw.cx + a * (half - 0.5), 0, sw.cz + b * (half - 0.5));
      if (Math.hypot(c.position.x - hx, c.position.z - hz) < 1.5) continue;
      this.group.add(c);
      this.candles.push(c);
    }

    // Door frame + warding rune
    const fr = M.makeDoorFrame(TILE - 0.5);
    const doorX = (d.door.x + 0.5) * TILE;
    const doorZ = (d.door.y + 0.5) * TILE;
    fr.group.position.set(doorX + (dir[0] * TILE) / 2, 0, doorZ + (dir[1] * TILE) / 2);
    fr.group.rotation.y = Math.atan2(perp[0], perp[1]) + Math.PI / 2;
    this.group.add(fr.group);
    fr.group.remove(fr.rune);
    fr.rune.position.set(doorX, 0.02, doorZ);
    this.group.add(fr.rune);
    this.rune = fr.rune;

    this.safeLightPos = new THREE.Vector3(kx + dir[0] * 1.5, 2.6, kz + dir[1] * 1.5);
  }

  buildHiding() {
    for (const h of this.d.hiding) {
      const dims = HIDE_DIMS[h.kind];
      const model =
        h.kind === 'locker'
          ? M.makeLocker()
          : M.mergeStatic(h.kind === 'closet' ? M.makeCloset() : h.kind === 'bed' ? M.makeBed() : M.makeBench());
      model.position.set(h.x, 0, h.z);
      model.rotation.y = h.angle;
      this.group.add(model);
      const sx = h.fx !== 0 ? dims.d : dims.w;
      const sz = h.fx !== 0 ? dims.w : dims.d;
      const collider = this.world.addCollider(h.x - sx / 2, h.z - sz / 2, h.x + sx / 2, h.z + sz / 2);
      const exitD = dims.d / 2 + 0.7;
      this.hiding.push({
        kind: h.kind,
        x: h.x,
        z: h.z,
        fx: h.fx,
        fz: h.fz,
        exit: { x: h.x + h.fx * exitD, z: h.z + h.fz * exitD },
        model,
        collider,
        label: dims.label,
      });
    }
  }

  buildCrates() {
    for (const c of this.d.crates) {
      const m = M.makeCrate(c.locked);
      m.group.position.set(c.x, 0, c.z);
      m.group.rotation.y = c.angle;
      this.group.add(m.group);
      this.world.addCollider(c.x - 0.55, c.z - 0.55, c.x + 0.55, c.z + 0.55);
      this.crates.push({ x: c.x, z: c.z, locked: c.locked, opened: false, lid: m.lid, open: 0, model: m.group });
    }
  }

  buildPickups() {
    for (const g of this.d.gold) this.addGold(g.x, g.z, g.value);
    for (const a of this.d.ammo) {
      const m = M.mergeStatic(M.makeAmmo(), false);
      m.position.set(a.x, 0, a.z);
      m.rotation.y = this.rng.range(0, 6.28);
      this.group.add(m);
      this.ammos.push({ x: a.x, z: a.z, model: m, taken: false });
    }
    for (const dm of this.d.diamonds) {
      const m = M.makeDiamond();
      m.group.position.set(dm.x, 1.0, dm.z);
      this.group.add(m.group);
      this.diamonds.push({ x: dm.x, z: dm.z, ...m, taken: false, known: false });
    }
  }

  addGold(x, z, value) {
    const m = M.mergeStatic(M.makeGold(value), false);
    m.position.set(x, 0, z);
    this.group.add(m);
    this.golds.push({ x, z, value, model: m, taken: false });
  }

  addBearTrap(x, z, owned) {
    const m = M.makeBearTrap();
    m.group.position.set(x, 0, z);
    m.group.rotation.y = this.rng.range(0, 6.28);
    this.group.add(m.group);
    this.bearTraps.push({ x, z, owned, armed: true, jaws: m.jaws, model: m.group, holding: null, holdT: 0 });
  }

  buildTraps() {
    const d = this.d;
    for (const p of d.pits) {
      const s = M.makeSpikeField(26, TILE - 0.4);
      s.position.set((p.tx + 0.5) * TILE, -PIT_DEPTH, (p.ty + 0.5) * TILE);
      this.group.add(s);
      // dark lip so the pit edge reads in the flashlight
      const bones = M.mergeStatic(M.makeBones(this.rng, true), false);
      bones.position.set((p.tx + 0.5) * TILE + 0.4, -PIT_DEPTH + 0.05, (p.ty + 0.5) * TILE - 0.3);
      this.group.add(bones);
    }
    for (const b of d.bearTraps) this.addBearTrap(b.x, b.z, false);
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

  buildTorches() {
    for (const t of this.d.torches) {
      const m = M.makeTorch();
      m.group.position.set(t.x, 0, t.z);
      m.group.rotation.y = Math.atan2(t.fx, t.fz);
      this.group.add(m.group);
      const lp = new THREE.Vector3(t.x + t.fx * 0.35, 2.4, t.z + t.fz * 0.35);
      this.torches.push({ ...m, pos: lp, phase: this.rng.range(0, 10) });
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
      } else if (dc.kind === 'chain') {
        m = M.mergeStatic(M.makeChain());
        m.position.set(dc.x, WALL_H, dc.z);
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
    if (t === T.ROCK) {
      ctx.fillStyle = '#2a2420';
    } else if (t === T.SAFE) ctx.fillStyle = '#3f7a46';
    else if (t === T.DOOR) ctx.fillStyle = '#7affa0';
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
          // reveal wall tiles that border something we can see
          if (world.rayDist(px, pz, wx, wz) >= dd - TILE * 0.75) this.markExplored(x, y);
        } else if (world.los(px, pz, wx, wz)) this.markExplored(x, y);
      }
    for (const dm of this.diamonds) {
      if (dm.known || dm.taken) continue;
      if (dist2D(dm.x, dm.z, px, pz) < 16 && world.los(px, pz, dm.x, dm.z)) {
        dm.known = true;
        this.game.ui.message('You glimpse a diamond glinting in the dark...', 'diamond');
      }
    }
  }

  revealAll() {
    this.mapOwned = true;
    const ctx = this.mapCtx;
    const W = this.d.W;
    for (let y = 0; y < this.d.H; y++)
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        if (this.explored[i] || this.d.tiles[i] === T.ROCK) continue;
        ctx.fillStyle = this.d.tiles[i] === T.PIT ? '#4a1414' : '#3c3644';
        ctx.fillRect(x, y, 1, 1);
      }
    for (const dm of this.diamonds) dm.known = true;
  }

  // ------------------------------------------------------------ interactions
  interactables() {
    const out = [];
    for (const h of this.hiding) out.push({ type: 'hide', obj: h, x: h.x, z: h.z, label: h.label, range: 2.0 });
    for (const c of this.crates)
      if (!c.opened)
        out.push({ type: 'crate', obj: c, x: c.x, z: c.z, label: c.locked ? 'Open locked crate' : 'Open crate', range: 1.9 });
    out.push({ type: 'keeper', obj: this.keeper, x: this.keeper.x, z: this.keeper.z, label: this.keeper.label, range: 2.6 });
    out.push({
      type: 'hatch',
      obj: this.hatch,
      x: this.hatch.x,
      z: this.hatch.z,
      label: this.unlocked ? `Descend to level ${this.num + 1}` : 'The hatch is chained shut',
      range: 1.9,
    });
    return out;
  }

  openCrate(c) {
    const g = this.game;
    const p = g.player;
    const ui = g.ui;
    if (c.locked) {
      if (p.inv.key <= 0) {
        g.audio.rattle();
        ui.message('Locked tight. A skeleton key would open it.', 'dim');
        return;
      }
      p.inv.key--;
      ui.message('The skeleton key turns... and crumbles to dust.', 'dim');
    }
    c.opened = true;
    g.audio.crate(c.locked);
    g.emitNoise(c.x, c.z, NOISE.crate, 'player');
    const r = this.rng;
    const lvl = this.num;
    const loot = [];
    if (c.locked) {
      loot.push(['gold', r.int(80, 150) + lvl * 12]);
      const roll = r.next();
      if (roll < 0.12) loot.push(['life', 1]);
      else if (roll < 0.45) loot.push(['medkit', 1]);
      else if (roll < 0.7) loot.push(['ammo', 6]);
      else if (roll < 0.85) loot.push(['beartrap', 1]);
      else loot.push(['gold', r.int(40, 80)]);
    } else {
      const roll = r.next();
      if (roll < 0.45) loot.push(['gold', r.int(20, 45) + lvl * 4]);
      else if (roll < 0.63) loot.push(['ammo', r.int(2, 5)]);
      else if (roll < 0.75) loot.push(['medkit', 1]);
      else if (roll < 0.83) loot.push(['beartrap', 1]);
      else if (roll < 0.88) loot.push(['key', 1]);
      else loot.push(['nothing', 0]);
    }
    for (const [kind, n] of loot) {
      if (kind === 'gold') {
        const got = p.addGold(n);
        ui.message(`+${got} gold`, 'gold');
        g.audio.coin();
      } else if (kind === 'ammo') {
        p.reserve += n;
        ui.message(`+${n} revolver rounds`, 'good');
      } else if (kind === 'medkit') {
        p.inv.medkit++;
        ui.message('Found a med kit', 'good');
      } else if (kind === 'beartrap') {
        p.inv.beartrap++;
        ui.message('Found a bear trap', 'good');
      } else if (kind === 'key') {
        p.inv.key++;
        ui.message('Found a skeleton key', 'good');
      } else if (kind === 'life') {
        p.lives++;
        ui.message('A strange relic... +1 LIFE', 'diamond');
      } else ui.message('Empty. Only dust and bone.', 'dim');
    }
    if (loot.some(([k]) => k !== 'gold' && k !== 'nothing')) g.audio.pickup();
  }

  // ------------------------------------------------------------ update
  update(dt) {
    const g = this.game;
    const p = g.player;
    const t = g.time;

    // diamonds / gold / ammo animation & pickup
    for (const dm of this.diamonds) {
      if (dm.taken) continue;
      dm.group.position.y = 1.0 + Math.sin(t * 2 + dm.x) * 0.12;
      dm.gem.rotation.y += dt * 1.5;
      dm.glow.material.opacity = 0.7 + Math.sin(t * 3) * 0.2;
      if (p.alive && !p.hidden && dist2D(dm.x, dm.z, p.pos.x, p.pos.z) < 1.1 && p.pos.y > -0.5) {
        dm.taken = true;
        dm.group.visible = false;
        this.found++;
        p.stats.diamonds++;
        g.audio.diamond();
        if (this.found >= this.needed) {
          this.unlocked = true;
          this.hatch.chains.visible = false;
          g.audio.allDiamonds();
          g.ui.message('All diamonds found! Return to the safe room and descend.', 'diamond', 6);
          g.ui.banner('THE WAY DOWN IS OPEN', 'Return to the sanctuary', 3.5);
        } else g.ui.message(`Diamond found (${this.found}/${this.needed})`, 'diamond');
      }
    }
    for (const go of this.golds) {
      if (go.taken) continue;
      if (p.alive && !p.hidden && dist2D(go.x, go.z, p.pos.x, p.pos.z) < 0.95 && p.pos.y > -0.5) {
        go.taken = true;
        go.model.visible = false;
        const got = p.addGold(go.value);
        g.audio.coin();
        g.ui.message(`+${got} gold`, 'gold');
      }
    }
    for (const a of this.ammos) {
      if (a.taken) continue;
      if (p.alive && !p.hidden && dist2D(a.x, a.z, p.pos.x, p.pos.z) < 0.95) {
        a.taken = true;
        a.model.visible = false;
        p.reserve += 4;
        g.audio.pickup();
        g.ui.message('+4 revolver rounds', 'good');
      }
    }

    // crates opening animation
    for (const c of this.crates) {
      if (c.opened && c.open < 1) {
        c.open = Math.min(1, c.open + dt * 2);
        c.lid.rotation.x = -c.open * 1.9;
      }
    }

    // hatch
    if (this.unlocked && this.hatch.open < 1) {
      this.hatch.open = Math.min(1, this.hatch.open + dt * 0.6);
      this.hatch.door.rotation.x = -this.hatch.open * 1.75;
      this.hatch.glow.material.opacity = this.hatch.open * 0.9;
      if (this.hatch.open === 1) g.audio.hatch();
    }
    if (this.unlocked) this.hatch.glow.material.opacity = 0.75 + Math.sin(t * 2) * 0.15;
    this.rune.material.opacity = 0.55 + Math.sin(t * 1.3) * 0.25;
    for (const c of this.candles) {
      const f = c.userData.flame;
      f.scale.y = 0.12 * (0.85 + Math.random() * 0.3);
    }
    this.keeper.eyes.forEach((e) => (e.visible = Math.sin(t * 0.6) > -0.97));

    // enemies
    for (const e of this.enemies) {
      // distant, idle monsters think less often
      if (!e.hunting && dist2D(e.pos.x, e.pos.z, p.pos.x, p.pos.z) > 55) {
        e.lodAcc = (e.lodAcc || 0) + dt;
        if (e.lodAcc < 0.2) continue;
        e.update(e.lodAcc);
        e.lodAcc = 0;
      } else e.update(dt);
    }
    this.enemyInteractions(dt);

    // traps
    this.updateTraps(dt);

    // torches flicker
    for (const tc of this.torches) {
      const f = 0.85 + Math.sin(t * 13 + tc.phase) * 0.08 + Math.random() * 0.1;
      tc.flame.scale.set(0.25 * f, 0.45 * f, 1);
      tc.glow.material.opacity = 0.35 * f;
    }

    // map reveal
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
          // separation (angels are immovable statues)
          const push = (min - d) / 2;
          const nx = dx / d;
          const nz = dz / d;
          if (a.type !== 'angel') {
            a.pos.x -= nx * push * (b.type === 'angel' ? 2 : 1);
            a.pos.z -= nz * push * (b.type === 'angel' ? 2 : 1);
          }
          if (b.type !== 'angel') {
            b.pos.x += nx * push * (a.type === 'angel' ? 2 : 1);
            b.pos.z += nz * push * (a.type === 'angel' ? 2 : 1);
          }
        }
        // Brutes and Grunts brawl when they cross paths
        const pair =
          (a.type === 'brute' && b.type === 'grunt') || (a.type === 'grunt' && b.type === 'brute') ? true : false;
        if (pair && d < 2.6 && a.state !== 'fight' && b.state !== 'fight' && a.stun <= 0 && b.stun <= 0) {
          if (this.game.level.world.los(a.pos.x, a.pos.z, b.pos.x, b.pos.z)) {
            a.setState('fight');
            b.setState('fight');
            a.fightWith = b;
            b.fightWith = a;
            a.attackCd = 0.3;
            b.attackCd = 0.5;
            this.game.audio.growl('brute', (a.type === 'brute' ? a : b).pos, 1.2);
            this.game.audio.growl('grunt', (a.type === 'grunt' ? a : b).pos, 1.2);
          }
        }
      }
    }
  }

  updateTraps(dt) {
    const g = this.game;
    const p = g.player;
    for (const bt of this.bearTraps) {
      if (!bt.armed) continue;
      // player
      if (!bt.owned && p.alive && !p.hidden && p.pos.y < 0.25 && dist2D(bt.x, bt.z, p.pos.x, p.pos.z) < 0.5) {
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
        if (!e.alive || e.type === 'angel' || e.stun > 0) continue;
        if (dist2D(bt.x, bt.z, e.pos.x, e.pos.z) < 0.45 + e.radius * 0.5) {
          bt.armed = false;
          M.setBearTrapOpen(bt.jaws, false);
          g.audio.bearSnap(bt);
          const secs = e.type === 'brute' ? 5 : e.type === 'hound' ? 7 : 6;
          e.trap(secs, e.type === 'brute' ? 60 : 40);
          if (bt.owned && dist2D(bt.x, bt.z, p.pos.x, p.pos.z) < 30) g.ui.message('Something is caught in your trap!', 'good');
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

  // Pick the torches nearest the player for the limited light pool.
  assignLights(lights, px, pz) {
    const sorted = this.torches
      .map((t) => ({ t, d: dist2D(t.pos.x, t.pos.z, px, pz) }))
      .sort((a, b) => a.d - b.d);
    lights.forEach((l, i) => {
      const s = sorted[i];
      if (s && s.d < 30) {
        l.position.copy(s.t.pos);
        l.userData.torch = s.t;
        l.userData.on = true;
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
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        for (const m of mats) m.dispose();
      }
    });
    this.world.dispose();
  }
}
