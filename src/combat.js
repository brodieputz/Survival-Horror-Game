// Shared combat: hitscan bullets, projectiles (rockets, grenades, arrows,
// molotovs, turret shells), explosions, fire, melee swings and tracers.
// Works in whichever scene is active through game.level.
import * as THREE from 'three';
import { tex } from './textures.js';
import { dist2D, angleDiff } from './util.js';
import { WALL_H } from './config.js';

const MAX_TRACERS = 96;
const tmp = new THREE.Vector3();
const tmp2 = new THREE.Vector3();

export class Combat {
  constructor(game) {
    this.game = game;
    this.raycaster = new THREE.Raycaster();
    this.group = new THREE.Group();
    game.scene.add(this.group);
    this.projectiles = [];
    this.fires = [];
    this.flashes = [];
    this.flames = [];
    this.pools = [];
    // tracer pool
    const g = new THREE.BufferGeometry();
    this.tPos = new Float32Array(MAX_TRACERS * 6);
    this.tCol = new Float32Array(MAX_TRACERS * 6);
    this.tLife = new Float32Array(MAX_TRACERS);
    this.tBase = new Float32Array(MAX_TRACERS * 3);
    g.setAttribute('position', new THREE.BufferAttribute(this.tPos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(this.tCol, 3));
    this.tGeo = g;
    const lines = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    lines.frustumCulled = false;
    this.group.add(lines);
    this.tNext = 0;
    this.boomLight = new THREE.PointLight(0xffa040, 0, 30, 1.4);
    game.scene.add(this.boomLight);
    this.boomI = 0;
  }

  clear() {
    for (const p of this.projectiles) p.mesh && this.group.remove(p.mesh);
    for (const f of this.fires) this.group.remove(f.group);
    for (const f of this.flashes) this.group.remove(f.s);
    for (const f of this.flames) this.group.remove(f.s);
    for (const a of this.pools) this.group.remove(a.mesh);
    this.pools = [];
    this.projectiles = [];
    this.fires = [];
    this.flashes = [];
    this.flames = [];
    this.tLife.fill(0);
    this.tCol.fill(0);
    this.tGeo.attributes.color.needsUpdate = true;
    this.boomI = 0;
    this.boomLight.intensity = 0;
  }

  // ------------------------------------------------------------ tracers
  tracer(a, b, color = 0xffd890, life = 0.08) {
    const i = this.tNext;
    this.tNext = (this.tNext + 1) % MAX_TRACERS;
    this.tPos.set([a.x, a.y, a.z, b.x, b.y, b.z], i * 6);
    const c = new THREE.Color(color);
    this.tBase.set([c.r, c.g, c.b], i * 3);
    this.tLife[i] = life;
    this.tCol.set([c.r * 0.3, c.g * 0.3, c.b * 0.3, c.r, c.g, c.b], i * 6);
    this.tGeo.attributes.position.needsUpdate = true;
    this.tGeo.attributes.color.needsUpdate = true;
  }

  // ------------------------------------------------------------ hitscan
  shootables() {
    return this.game.level?.shootables ? this.game.level.shootables() : [];
  }

  // Fire one bullet. Returns the end point.
  hitscan(origin, dir, { dmg, range, pierce = 0, src = null, tracer = true, color }) {
    const lvl = this.game.level;
    const world = lvl.world;
    const wallD = world.ray3D(origin, dir, range);
    this.raycaster.set(origin, dir);
    this.raycaster.far = wallD;
    this.raycaster.camera = this.game.camera; // sprites (flames, glows) need it
    const roots = [];
    for (const e of lvl.enemies) if (e.alive && e.pos.distanceTo(origin) < range + 3) roots.push(e.root);
    for (const s of this.shootables()) roots.push(s.root);
    const hits = this.raycaster.intersectObjects(roots, true);
    const seen = new Set();
    let left = pierce + 1;
    let end = tmp.copy(origin).addScaledVector(dir, Math.max(0, wallD - 0.05)).clone();
    let stopped = false;
    for (const h of hits) {
      const e = h.object.userData.enemy;
      const s = h.object.userData.shootable;
      const key = e || s;
      if (!key || seen.has(key)) continue;
      seen.add(key);
      if (s) {
        s.onShot(h.point, src, dmg);
        end = h.point.clone();
        stopped = true;
        break;
      }
      if (!e.alive) continue;
      const head = !e.model.crawl && !e.model.quad && h.point.y > e.model.height * 0.8;
      e.hit(dmg * (head ? 1.7 : 1), src, { head });
      this.game.particles.burst(h.point, head ? 22 : 14, 0x7a0000, 3);
      left--;
      if (left <= 0) {
        end = h.point.clone();
        stopped = true;
        break;
      }
      dmg *= 0.7;
    }
    if (!stopped && wallD < range - 0.1) this.game.particles.burst(end, 6, 0x9a8a70, 2);
    if (tracer) {
      const from = tmp2.copy(origin).addScaledVector(dir, 1.2);
      if (from.distanceTo(origin) < end.distanceTo(origin)) this.tracer(from, end, color);
    }
    return end;
  }

  // A survivor or turret shot: rolls to hit instead of ray casting meshes.
  aimedShot(from, target, { dmg, hitChance, src, color = 0xffd890, headChance = 0.15 }) {
    const to = new THREE.Vector3(target.pos.x, target.model.height * 0.6, target.pos.z);
    if (Math.random() < hitChance) {
      const head = Math.random() < headChance && !target.model.crawl;
      target.hit(dmg * (head ? 1.7 : 1), src, { head });
      this.game.particles.burst(to, 8, 0x7a0000, 2.5);
    } else {
      to.x += (Math.random() - 0.5) * 2.5;
      to.y += (Math.random() - 0.3) * 1.5;
      to.z += (Math.random() - 0.5) * 2.5;
    }
    this.tracer(from, to, color);
  }

  // ------------------------------------------------------------ melee
  melee(src, x, z, yaw, { reach, arc, dmg, cleave = 1, fwd = null }) {
    const lvl = this.game.level;
    const hits = [];
    for (const e of lvl.enemies) {
      if (!e.alive) continue;
      const d = dist2D(x, z, e.pos.x, e.pos.z) - e.radius * 0.6;
      if (d > reach) continue;
      const a = Math.atan2(e.pos.x - x, e.pos.z - z);
      if (Math.abs(angleDiff(yaw, a)) > arc / 2 && d > 0.6) continue;
      if (!lvl.world.los(x, z, e.pos.x, e.pos.z)) continue;
      hits.push({ e, d });
    }
    hits.sort((a, b) => a.d - b.d);
    for (const s of this.shootables()) {
      if (s.x === undefined || dist2D(x, z, s.x, s.z) > reach + 0.8) continue;
      if (Math.abs(angleDiff(yaw, Math.atan2(s.x - x, s.z - z))) < arc / 2 + 0.3) s.onShot(new THREE.Vector3(s.x, 0.6, s.z), src, dmg);
    }
    let n = 0;
    for (const { e } of hits.slice(0, cleave)) {
      e.hit(dmg, src, { melee: true });
      this.game.particles.burst(new THREE.Vector3(e.pos.x, 1.2, e.pos.z), 14, 0x7a0000, 3);
      if (fwd && e.alive && e.type !== 'brute') {
        const k = 0.4 * Math.min(1, dmg / 70);
        e.pos.x += fwd.x * k;
        e.pos.z += fwd.z * k;
      }
      n++;
    }
    return n;
  }

  // ------------------------------------------------------------ flame
  flame(src, origin, dir, { range, dmg, spread }) {
    const lvl = this.game.level;
    const yaw = Math.atan2(dir.x, dir.z);
    for (const e of lvl.enemies) {
      if (!e.alive) continue;
      const d = dist2D(origin.x, origin.z, e.pos.x, e.pos.z);
      if (d > range) continue;
      const a = Math.atan2(e.pos.x - origin.x, e.pos.z - origin.z);
      if (Math.abs(angleDiff(yaw, a)) > spread * 2 + 0.25 / Math.max(1, d)) continue;
      if (!lvl.world.los(origin.x, origin.z, e.pos.x, e.pos.z)) continue;
      e.hit(dmg, src, { fire: true });
      e.ignite(3, 26, src);
    }
    for (const s of this.shootables()) {
      const d = dist2D(origin.x, origin.z, s.x, s.z);
      if (d < range && Math.abs(angleDiff(yaw, Math.atan2(s.x - origin.x, s.z - origin.z))) < 0.35) s.onShot(new THREE.Vector3(s.x, 0.6, s.z), src);
    }
    // visual: a few drifting fire sprites
    for (let i = 0; i < 2; i++) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex('glow'), color: 0xff7a20, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
      s.position.copy(origin).addScaledVector(dir, 0.6);
      s.scale.setScalar(0.4);
      const v = dir.clone().multiplyScalar(range * 1.3);
      v.x += (Math.random() - 0.5) * 3;
      v.y += (Math.random() - 0.2) * 2;
      v.z += (Math.random() - 0.5) * 3;
      this.group.add(s);
      this.flames.push({ s, v, life: 0.7, max: 0.7 });
    }
  }

  // ------------------------------------------------------------ explosions
  explode(pos, radius, dmg, src, { fire = false, quiet = false, noCrawler = false } = {}) {
    const g = this.game;
    const lvl = g.level;
    if (!quiet) g.audio.explosion(pos, radius);
    // light flash
    this.boomLight.position.set(pos.x, pos.y + 1.5, pos.z);
    this.boomI = Math.max(this.boomI, 60 + radius * 12);
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex('glow'), color: fire ? 0xff6a10 : 0xffc060, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    s.position.set(pos.x, Math.max(0.8, pos.y), pos.z);
    s.scale.setScalar(radius * 1.2);
    this.group.add(s);
    this.flashes.push({ s, life: 0.45, max: 0.45, grow: radius * 2.4 });
    g.particles.burst(new THREE.Vector3(pos.x, Math.max(0.3, pos.y), pos.z), 40, 0xff8a20, 9, 1.4);
    g.particles.burst(new THREE.Vector3(pos.x, Math.max(0.3, pos.y), pos.z), 30, 0x3a3430, 6, 1.6);
    for (const e of lvl.enemies) {
      if (!e.alive) continue;
      const d = dist2D(pos.x, pos.z, e.pos.x, e.pos.z);
      if (d > radius + e.radius) continue;
      const f = 1 - Math.min(1, d / (radius + e.radius)) * 0.6;
      if (!lvl.world.los(pos.x, pos.z, e.pos.x, e.pos.z) && d > 1.5) continue;
      e.hit(dmg * f, src, { explosive: true, noCrawler });
      if (fire) e.ignite(4, 22, src);
      if (e.alive && e.type !== 'brute') {
        const k = (1 - d / (radius + 1)) * 1.4;
        e.pos.x += ((e.pos.x - pos.x) / (d || 1)) * k;
        e.pos.z += ((e.pos.z - pos.z) / (d || 1)) * k;
      }
    }
    // humans caught in the blast
    const p = g.player;
    const dp = dist2D(pos.x, pos.z, p.pos.x, p.pos.z);
    if (p.alive && dp < radius && lvl.world.los(pos.x, pos.z, p.pos.x, p.pos.z)) p.damage(dmg * 0.35 * (1 - dp / radius), 'explosion');
    if (p.alive) p.shake = Math.max(p.shake, Math.min(1, (radius * 3) / Math.max(4, dp)));
    for (const a of lvl.actors || []) {
      if (!a.alive) continue;
      const d = dist2D(pos.x, pos.z, a.pos.x, a.pos.z);
      if (d < radius) a.damage(dmg * 0.3 * (1 - d / radius), 'explosion');
    }
    lvl.onExplosion?.(pos, radius, src);
    if (fire) this.addFire(pos, radius * 0.8, 7, src);
  }

  addFire(pos, radius, life, src) {
    const group = new THREE.Group();
    const sprites = [];
    for (let i = 0; i < 7; i++) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex('flame'), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * radius * 0.8;
      s.position.set(pos.x + Math.cos(a) * r, 0.5, pos.z + Math.sin(a) * r);
      s.scale.set(0.7, 1.2, 1);
      group.add(s);
      sprites.push(s);
    }
    this.group.add(group);
    this.fires.push({ group, sprites, pos: pos.clone(), radius, life, tick: 0, src });
  }

  // ------------------------------------------------------------ projectiles
  spawn(kind, origin, vel, opts) {
    let mesh;
    if (kind === 'rocket' || kind === 'missile') {
      mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.6, 6), new THREE.MeshBasicMaterial({ color: 0x4a5a3a }));
      mesh.geometry.rotateX(Math.PI / 2);
      const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex('glow'), color: 0xffa040, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
      glow.scale.setScalar(0.9);
      glow.position.z = 0.35;
      mesh.add(glow);
    } else if (kind === 'arrow') {
      mesh = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.75), new THREE.MeshStandardMaterial({ color: 0x8a6a40, roughness: 0.7 }));
    } else if (kind === 'shell') {
      mesh = new THREE.Mesh(new THREE.SphereGeometry(0.16, 6, 5), new THREE.MeshBasicMaterial({ color: 0x2a2a2a }));
      const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex('glow'), color: 0xffd080, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
      glow.scale.setScalar(0.8);
      mesh.add(glow);
    } else if (kind === 'molotov') {
      mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.22, 6), new THREE.MeshStandardMaterial({ color: 0x3a6a3a, emissive: 0x102010, roughness: 0.5, metalness: 0.3 }));
      const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex('glow'), color: 0xff8a30, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
      glow.scale.setScalar(0.4);
      glow.position.y = 0.14;
      mesh.add(glow);
    } else if (kind === 'acid') {
      mesh = new THREE.Mesh(new THREE.SphereGeometry(0.12, 7, 5), new THREE.MeshBasicMaterial({ color: 0x9adf20 }));
      const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex('glow'), color: 0x8aff20, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
      glow.scale.setScalar(0.7);
      mesh.add(glow);
    } else {
      mesh = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 5), new THREE.MeshStandardMaterial({ color: 0x3a4a2a, emissive: 0x0a0c08, roughness: 0.5, metalness: 0.4 }));
    }
    mesh.position.copy(origin);
    this.group.add(mesh);
    this.projectiles.push({ kind, pos: origin.clone(), vel: vel.clone(), mesh, life: opts.fuse || 8, age: 0, hitSet: new Set(), pierceLeft: opts.pierce ?? 0, ...opts });
  }

  // A glob of bile hitting a person: the player or a survivor.
  projHitHuman(p) {
    const g = this.game;
    const list = [g.player, ...(g.level.actors || [])];
    for (const h of list) {
      if (!h.alive || h.hidden) continue;
      if (dist2D(p.pos.x, p.pos.z, h.pos.x, h.pos.z) < 0.55 && p.pos.y < 1.9) return h;
    }
    return null;
  }

  // A spitter's bile pools where it lands and burns anyone standing in it.
  acidSplash(pos, dmg) {
    const g = this.game;
    g.audio.flesh?.(pos);
    g.particles.burst(new THREE.Vector3(pos.x, 0.3, pos.z), 18, 0x8acf20, 3.5, 0.9);
    const r = 1.3;
    for (const h of [g.player, ...(g.level.actors || [])]) {
      if (!h.alive || h.hidden) continue;
      const d = dist2D(pos.x, pos.z, h.pos.x, h.pos.z);
      if (d < r) h.damage(dmg * (1 - (d / r) * 0.5), 'acid');
    }
    const mesh = new THREE.Mesh(
      new THREE.CircleGeometry(r, 18),
      new THREE.MeshBasicMaterial({ color: 0x7ac020, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(pos.x, 0.03, pos.z);
    this.group.add(mesh);
    this.pools.push({ mesh, pos: new THREE.Vector3(pos.x, 0, pos.z), r, life: 5, tick: 0.5 });
  }

  projHitEnemy(p) {
    const lvl = this.game.level;
    for (const e of lvl.enemies) {
      if (!e.alive || p.hitSet.has(e)) continue;
      const d = dist2D(p.pos.x, p.pos.z, e.pos.x, e.pos.z);
      if (d < e.radius + 0.25 && p.pos.y < e.model.height + 0.2 && p.pos.y > -0.2) return e;
    }
    return null;
  }

  update(dt) {
    const g = this.game;
    const lvl = g.level;
    // tracers
    let dirty = false;
    for (let i = 0; i < MAX_TRACERS; i++) {
      if (this.tLife[i] <= 0) continue;
      this.tLife[i] -= dt;
      const f = Math.max(0, this.tLife[i] / 0.08);
      const r = this.tBase[i * 3];
      const gg = this.tBase[i * 3 + 1];
      const b = this.tBase[i * 3 + 2];
      this.tCol.set([r * 0.3 * f, gg * 0.3 * f, b * 0.3 * f, r * f, gg * f, b * f], i * 6);
      dirty = true;
    }
    if (dirty) this.tGeo.attributes.color.needsUpdate = true;
    // flash light
    this.boomI = Math.max(0, this.boomI - dt * 260);
    this.boomLight.intensity = this.boomI;
    for (const f of this.flashes) {
      f.life -= dt;
      const t = 1 - f.life / f.max;
      f.s.scale.setScalar(f.grow * (0.5 + t * 0.6));
      f.s.material.opacity = Math.max(0, f.life / f.max);
      if (f.life <= 0) {
        this.group.remove(f.s);
        f.s.material.dispose();
      }
    }
    this.flashes = this.flashes.filter((f) => f.life > 0);
    for (const f of this.flames) {
      f.life -= dt;
      f.s.position.addScaledVector(f.v, dt);
      f.v.multiplyScalar(1 - dt * 2.5);
      const t = 1 - f.life / f.max;
      f.s.scale.setScalar(0.4 + t * 1.6);
      f.s.material.opacity = Math.max(0, f.life / f.max);
      f.s.material.color.setRGB(1, 0.5 - t * 0.35, 0.15 * (1 - t));
      if (f.life <= 0) {
        this.group.remove(f.s);
        f.s.material.dispose();
      }
    }
    this.flames = this.flames.filter((f) => f.life > 0);
    // fires
    for (const f of this.fires) {
      f.life -= dt;
      f.tick -= dt;
      for (const s of f.sprites) {
        const k = 0.8 + Math.random() * 0.4;
        s.scale.set(0.7 * k, 1.3 * k * Math.min(1, f.life), 1);
      }
      if (f.tick <= 0) {
        f.tick = 0.3;
        for (const e of lvl.enemies)
          if (e.alive && dist2D(f.pos.x, f.pos.z, e.pos.x, e.pos.z) < f.radius) e.ignite(2.5, 24, f.src);
        const p = g.player;
        if (p.alive && dist2D(f.pos.x, f.pos.z, p.pos.x, p.pos.z) < f.radius * 0.8) p.damage(5, 'fire');
      }
      if (f.life <= 0) this.group.remove(f.group);
    }
    this.fires = this.fires.filter((f) => f.life > 0);
    for (const a of this.pools) {
      a.life -= dt;
      a.tick -= dt;
      a.mesh.material.opacity = Math.min(0.55, a.life * 0.3) * (0.85 + Math.sin(g.time * 7 + a.r) * 0.15);
      if (a.tick <= 0) {
        a.tick = 0.5;
        // standing in bile burns, but pools don't stack
        for (const h of [g.player, ...(lvl.actors || [])])
          if (h.alive && !h.hidden && g.time - (h.acidT ?? -9) > 0.45 && dist2D(a.pos.x, a.pos.z, h.pos.x, h.pos.z) < a.r * 0.9) {
            h.acidT = g.time;
            h.damage(2, 'acid');
          }
      }
      if (a.life <= 0) {
        this.group.remove(a.mesh);
        a.mesh.geometry.dispose();
        a.mesh.material.dispose();
      }
    }
    this.pools = this.pools.filter((a) => a.life > 0);

    // projectiles
    const world = lvl.world;
    for (const p of this.projectiles) {
      if (p.stuck !== undefined && p.dead) {
        p.stuck -= dt;
        if (p.stuck <= 0) {
          p.gone = true;
          this.group.remove(p.mesh);
        }
        continue;
      }
      p.age += dt;
      if (p.kind === 'missile' && p.target) {
        if (p.target.alive) {
          tmp.set(p.target.pos.x, 1.0, p.target.pos.z).sub(p.pos).normalize().multiplyScalar(p.speed);
          p.vel.lerp(tmp, Math.min(1, dt * 3));
        }
      }
      if (p.grav) p.vel.y -= p.grav * dt;
      const steps = Math.max(1, Math.ceil((p.vel.length() * dt) / 0.5));
      const sdt = dt / steps;
      let boom = false;
      for (let k = 0; k < steps && !boom && !p.dead; k++) {
        const ox = p.pos.x;
        const oz = p.pos.z;
        p.pos.addScaledVector(p.vel, sdt);
        // walls
        const wallD = world.rayDist(ox, oz, p.pos.x, p.pos.z);
        const segL = Math.hypot(p.pos.x - ox, p.pos.z - oz);
        const hitWall = segL > 1e-4 && wallD < segL - 1e-3;
        const hitCeil = p.pos.y > WALL_H - 0.05 && !world.isOpenSky(p.pos.x, p.pos.z);
        const hitGround = p.pos.y <= 0.05;
        if (hitWall || hitCeil || hitGround) {
          if (p.kind === 'frag') {
            if (hitWall) {
              p.pos.x = ox;
              p.pos.z = oz;
              p.vel.x *= -0.4;
              p.vel.z *= -0.4;
            }
            if (hitCeil) p.vel.y = -Math.abs(p.vel.y) * 0.3;
            if (hitGround) {
              p.pos.y = 0.06;
              p.vel.y = Math.abs(p.vel.y) * 0.35;
              p.vel.x *= 0.6;
              p.vel.z *= 0.6;
            }
            continue;
          }
          if (hitWall) {
            p.pos.x = ox + ((p.pos.x - ox) * Math.max(0, wallD - 0.1)) / segL;
            p.pos.z = oz + ((p.pos.z - oz) * Math.max(0, wallD - 0.1)) / segL;
          }
          if (p.kind === 'arrow') {
            p.dead = true;
            p.stuck = 6;
            g.audio.click(0.3);
          } else boom = true;
          break;
        }
        if (p.kind === 'acid') {
          if (this.projHitHuman(p)) boom = true;
          continue;
        }
        const e = p.kind === 'frag' || p.kind === 'shell' ? null : this.projHitEnemy(p);
        if (e) {
          if (p.kind === 'arrow') {
            p.hitSet.add(e);
            const head = p.pos.y > e.model.height * 0.8;
            e.hit(p.dmg * (head ? 1.7 : 1), p.src, { head });
            g.particles.burst(p.pos, 12, 0x7a0000, 2.5);
            if (p.pierceLeft-- <= 0) {
              p.dead = true;
              break;
            }
          } else boom = true;
        }
      }
      if (p.kind === 'frag' && p.age >= p.fuse) boom = true;
      if (p.kind === 'missile' && p.age > 6) boom = true;
      if (boom) {
        p.dead = true;
        if (p.kind === 'acid') this.acidSplash(p.pos, p.dmg);
        else if (p.kind === 'molotov') {
          g.audio.glass(p.pos);
          this.explode(p.pos, p.splash * 0.5, p.dmg * 0.5, p.src, { fire: true, quiet: true });
          this.addFire(p.pos, p.splash, 8, p.src);
        } else this.explode(p.pos, p.splash, p.dmg, p.src);
      }
      if (p.mesh) {
        p.mesh.position.copy(p.pos);
        if (p.vel.lengthSq() > 0.01 && !p.stuck) p.mesh.lookAt(tmp.copy(p.pos).sub(p.vel));
        if (p.kind === 'rocket' || p.kind === 'missile') g.particles.burst(p.pos, 1, 0x8a8a8a, 0.6, 0.4);
      }
      if (p.stuck === undefined && (p.dead || p.age > 12)) {
        p.gone = true;
        this.group.remove(p.mesh);
      }
    }
    this.projectiles = this.projectiles.filter((p) => !p.gone);
  }
}
