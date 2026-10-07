// Survivor NPCs: idle around camp by day, hold the barricade at night and
// follow the player through buildings. They never run out of ammo.
import * as THREE from 'three';
import { makeHuman, makeDog } from './actors.js';
import { makeGunModel } from './gunModels.js';
import { WEAPONS, weaponStats, isExplosive } from './weapons.js';
import { survivorSpeed, survivorAim, weaponByUid, removeWeapon, DOG_BITE } from './run.js';
import { dist2D, dampAngle, angleDiff, clamp } from './util.js';

const FISTS = { dmg: 9, range: 1.6, rate: 1.3, mag: 0, reload: 0, spread: 0, pellets: 1, def: { cat: 'melee', name: 'Fists', sound: 'melee' } };

export class SurvivorActor {
  constructor(game, rec, x, z, mode, group) {
    this.game = game;
    this.rec = rec;
    this.pos = new THREE.Vector3(x, 0, z);
    this.yaw = Math.random() * 6;
    this.radius = 0.35;
    this.hidden = false;
    this.mode = mode; // 'camp' | 'defend' | 'follow' | 'found'
    this.home = { x, z };
    this.post = null;
    this.dog = !!rec.dog;
    this.model = this.dog ? makeDog(rec.look) : makeHuman(rec.look);
    if (this.dog) this.radius = 0.3;
    this.root = this.model.root;
    (group || game.level.group).add(this.root);
    this.phase = Math.random() * 6;
    this.speedNow = 0;
    this.attackAnim = 0;
    this.aimT = 0;
    this.cd = Math.random() * 0.5;
    this.reloadT = 0;
    this.target = null;
    this.retarget = 0;
    this.path = null;
    this.pathI = 0;
    this.pathGoal = null;
    this.repath = 0;
    this.hurtT = 0;
    this.deadT = 0;
    this.wanderT = Math.random() * 4;
    this.wanderGoal = null;
    this.equip();
  }

  get alive() {
    return this.rec.status !== 'dead' && this.rec.hp > 0;
  }
  get name() {
    return this.rec.name;
  }

  equip() {
    if (this.dog) {
      // teeth: quick, hard bites up close
      this.stats = { dmg: DOG_BITE(this.rec), range: 1.5, rate: 1.5, mag: 0, reload: 0, spread: 0, pellets: 1, def: { cat: 'melee', name: 'Bite', sound: 'melee' } };
      this.mag = 0;
      this.melee = true;
      this.explosive = false;
      this.flameT = 0;
      return;
    }
    if (this.gun) this.model.gunMount.remove(this.gun.group);
    this.gun = null;
    const run = this.game.run;
    const inst = this.rec.weapon != null ? weaponByUid(run, this.rec.weapon) : null;
    if (inst) {
      this.stats = weaponStats(inst, this.rec.level);
      this.gun = makeGunModel(WEAPONS[inst.id]);
      this.gun.group.rotation.x = -Math.PI / 2;
      if (this.stats.def.cat === 'melee') this.gun.group.rotation.x = -Math.PI * 0.75;
      this.model.gunMount.add(this.gun.group);
    } else this.stats = FISTS;
    this.mag = this.stats.mag;
    this.melee = this.stats.def.cat === 'melee';
    this.explosive = isExplosive(this.stats.def);
    this.flameT = 0;
  }

  // ------------------------------------------------------------ health
  damage(amount, cause) {
    if (!this.alive) return;
    this.rec.hp -= amount;
    this.hurtT = 0.3;
    this.game.audio.impactNpc?.(this.pos);
    if (this.rec.hp <= 0) this.die(cause);
  }

  die(cause) {
    const run = this.game.run;
    this.rec.hp = 0;
    this.rec.status = 'dead';
    this.deadT = 0;
    const inst = this.rec.weapon != null ? weaponByUid(run, this.rec.weapon) : null;
    if (inst) removeWeapon(run, inst.uid);
    this.lostWeapon = inst ? WEAPONS[inst.id].name : null;
    if (this.gun) this.gun.group.visible = false;
    this.game.onSurvivorDied(this, cause);
  }

  // ------------------------------------------------------------ movement
  navigate(x, z, speed, dt, arrive = 0.6) {
    const world = this.game.level.world;
    const dGoal = dist2D(this.pos.x, this.pos.z, x, z);
    if (dGoal < arrive) {
      this.speedNow = 0;
      return true;
    }
    let tx = x;
    let tz = z;
    if (!world.clearLine(this.pos.x, this.pos.z, x, z, this.radius)) {
      this.repath -= dt;
      if (!this.path || this.repath <= 0 || !this.pathGoal || dist2D(this.pathGoal.x, this.pathGoal.z, x, z) > 1.5) {
        this.path = world.findPath(this.pos.x, this.pos.z, x, z);
        this.pathI = 0;
        this.pathGoal = { x, z };
        this.repath = 0.6;
      }
      if (this.path && this.path.length) {
        while (this.pathI < this.path.length - 1 && world.clearLine(this.pos.x, this.pos.z, this.path[this.pathI + 1].x, this.path[this.pathI + 1].z, this.radius)) this.pathI++;
        const wp = this.path[this.pathI];
        if (dist2D(this.pos.x, this.pos.z, wp.x, wp.z) < 0.3 && this.pathI < this.path.length - 1) this.pathI++;
        tx = this.path[this.pathI].x;
        tz = this.path[this.pathI].z;
      }
    } else this.path = null;
    const dx = tx - this.pos.x;
    const dz = tz - this.pos.z;
    const d = Math.hypot(dx, dz);
    if (d < 1e-4) {
      this.speedNow = 0;
      return false;
    }
    const step = Math.min(speed * dt, d);
    const ox = this.pos.x;
    const oz = this.pos.z;
    this.pos.x += (dx / d) * step;
    this.pos.z += (dz / d) * step;
    world.collide(this.pos, this.radius, true);
    this.speedNow = Math.hypot(this.pos.x - ox, this.pos.z - oz) / Math.max(dt, 1e-4);
    this.yaw = dampAngle(this.yaw, Math.atan2(dx, dz), 8, dt);
    return false;
  }

  face(x, z, dt, rate = 10) {
    this.yaw = dampAngle(this.yaw, Math.atan2(x - this.pos.x, z - this.pos.z), rate, dt);
  }

  // ------------------------------------------------------------ combat
  pickTarget(range, filter) {
    const lvl = this.game.level;
    let best = null;
    let bs = Infinity;
    for (const e of lvl.enemies) {
      if (!e.alive) continue;
      if (filter && !filter(e)) continue;
      if (this.explosive && !this.safeBlast(e)) continue;
      const d = dist2D(this.pos.x, this.pos.z, e.pos.x, e.pos.z);
      if (d > range) continue;
      if (!lvl.world.los(this.pos.x, this.pos.z, e.pos.x, e.pos.z)) continue;
      // prefer what is closest to us (or to the barricade at night)
      const score = this.mode === 'defend' && lvl.barricadeUp ? e.pos.x - lvl.bx + d * 0.2 : d;
      if (score < bs) {
        bs = score;
        best = e;
      }
    }
    return best;
  }

  // Never lob a blast where it would catch the player or another survivor.
  safeBlast(e) {
    const r = (this.stats.splash || 0) + 1.8;
    if (!r || this.stats.def.cat === 'flame') return true;
    const g = this.game;
    const humans = [g.player, ...(g.level.actors || [])];
    for (const h of humans) if (h.alive && dist2D(h.pos.x, h.pos.z, e.pos.x, e.pos.z) < r) return false;
    return true;
  }

  muzzlePos() {
    const v = new THREE.Vector3();
    if (this.gun) this.gun.muzzle.getWorldPosition(v);
    else v.set(this.pos.x, 1.3, this.pos.z);
    return v;
  }

  tryAttack(dt, target) {
    const s = this.stats;
    if (this.reloadT > 0) {
      this.reloadT -= dt;
      if (this.reloadT <= 0) this.mag = s.mag;
      return;
    }
    this.cd -= dt;
    const g = this.game;
    const d = dist2D(this.pos.x, this.pos.z, target.pos.x, target.pos.z);
    if (this.explosive) return this.tryExplosive(dt, target, d);
    if (this.cd > 0) return;
    if (this.melee) {
      if (d > s.range + target.radius) return;
      this.cd = 1 / s.rate;
      this.attackAnim = 1;
      if (this.dog) g.audio.bark?.(this.pos, true);
      else g.audio.swing?.(this.pos);
      target.hit(s.dmg, this, { melee: true });
      g.particles.burst(new THREE.Vector3(target.pos.x, 1.1, target.pos.z), 10, 0x7a0000, 2.5);
      return;
    }
    if (this.aimT < 0.25) return;
    this.cd = 1 / Math.min(s.rate, 5) + Math.random() * 0.1;
    const aim = survivorAim(this.rec);
    const spreadF = clamp(1 - s.spread * 4, 0.5, 1);
    const distF = clamp(1.15 - (d / s.range) * 0.55, 0.35, 1);
    const from = this.muzzlePos();
    for (let i = 0; i < s.pellets; i++)
      g.combat.aimedShot(from, target, { dmg: s.dmg, hitChance: aim * spreadF * distF * 0.85, src: this });
    g.audio.weaponFire(s.def, this.pos);
    if (this.gun) this.attackAnim = 0.6;
    if (s.mag > 0) {
      this.mag--;
      if (this.mag <= 0) this.reloadT = s.reload * 1.2;
    }
  }

  // Launchers, grenades, molotovs and flamethrowers: slow and deliberate.
  tryExplosive(dt, target, d) {
    const g = this.game;
    const s = this.stats;
    const def = s.def;
    if (def.cat === 'flame') {
      if (this.flameT > 0) {
        this.flameT -= dt;
        this.flameTick -= dt;
        if (this.flameTick <= 0) {
          this.flameTick = 0.15;
          const from = this.muzzlePos();
          const dir = new THREE.Vector3(target.pos.x - from.x, 0.9 - from.y, target.pos.z - from.z).normalize();
          g.combat.flame(this, from, dir, { range: s.range, dmg: s.dmg, spread: s.spread });
          g.audio.weaponFire(def, this.pos);
          this.attackAnim = 0.3;
        }
        return;
      }
      if (this.cd > 0 || this.aimT < 0.6 || d > s.range) return;
      this.flameT = 1.2;
      this.flameTick = 0;
      this.cd = 1.2 + 4 + Math.random() * 1.5;
      return;
    }
    if (this.cd > 0 || this.aimT < 0.6 || !this.safeBlast(target)) return;
    // one shot every 6-8 seconds
    this.cd = Math.max(1 / s.rate, 4.5) + 1.5 + Math.random() * 2;
    const from = this.muzzlePos();
    const pr = def.proj;
    const arc = pr.grav > 0;
    const T = arc ? clamp(d / (pr.speed * 0.8), 0.5, 3) : d / pr.speed;
    // lead the target a little, and miss by more the worse the aim
    const err = (1 - survivorAim(this.rec)) * d * 0.25;
    const tx = target.pos.x + Math.sin(target.yaw) * target.speedNow * T * 0.8 + (Math.random() - 0.5) * 2 * err;
    const tz = target.pos.z + Math.cos(target.yaw) * target.speedNow * T * 0.8 + (Math.random() - 0.5) * 2 * err;
    const vel = arc
      ? new THREE.Vector3((tx - from.x) / T, (0.3 - from.y + 0.5 * pr.grav * T * T) / T, (tz - from.z) / T)
      : new THREE.Vector3(tx - from.x, 1.0 - from.y, tz - from.z).normalize().multiplyScalar(pr.speed);
    g.combat.spawn(pr.kind, from, vel, { grav: pr.grav, dmg: s.dmg, splash: s.splash, fuse: pr.fuse || undefined, pierce: s.pierce, src: this });
    g.audio.weaponFire(def, this.pos);
    this.attackAnim = 1;
  }

  // ------------------------------------------------------------ update
  update(dt) {
    this.attackAnim = Math.max(0, this.attackAnim - dt * 4);
    this.hurtT = Math.max(0, this.hurtT - dt);
    if (!this.alive) {
      this.deadT += dt;
      this.sync(dt, false);
      return;
    }
    const g = this.game;
    const p = g.player;
    const spd = survivorSpeed(this.rec);
    let aiming = false;
    this.retarget -= dt;
    switch (this.mode) {
      case 'found': {
        this.speedNow = 0;
        if (dist2D(this.pos.x, this.pos.z, p.pos.x, p.pos.z) < 8) this.face(p.pos.x, p.pos.z, dt, 4);
        break;
      }
      case 'camp': {
        this.wanderT -= dt;
        if (this.wanderT <= 0) {
          this.wanderT = 4 + Math.random() * 6;
          this.wanderGoal = Math.random() < 0.6 ? { x: this.home.x + (Math.random() - 0.5) * 3, z: this.home.z + (Math.random() - 0.5) * 3 } : null;
        }
        if (this.wanderGoal) {
          if (this.navigate(this.wanderGoal.x, this.wanderGoal.z, spd * 0.4, dt, 0.4)) this.wanderGoal = null;
        } else {
          this.speedNow = 0;
          if (dist2D(this.pos.x, this.pos.z, p.pos.x, p.pos.z) < 5) this.face(p.pos.x, p.pos.z, dt, 3);
        }
        break;
      }
      case 'defend': {
        const lvl = g.level;
        if (lvl.barricadeUp) {
          if (this.retarget <= 0 || !this.target?.alive) {
            this.retarget = 0.4;
            this.target = this.pickTarget(this.melee ? 0 : this.stats.range, (e) => e.pos.x > lvl.bx);
          }
          const post = this.post || this.home;
          const atPost = this.navigate(post.x, post.z, spd, dt, 0.5);
          if (atPost && this.target && !this.melee) {
            aiming = true;
            this.face(this.target.pos.x, this.target.pos.z, dt, 10);
            this.tryAttack(dt, this.target);
          } else if (atPost) this.face(lvl.bx + 10, post.z, dt, 3);
        } else {
          if (this.retarget <= 0 || !this.target?.alive) {
            this.retarget = 0.4;
            this.target = this.pickTarget(this.melee ? 30 : this.stats.range);
          }
          const t = this.target;
          if (t) {
            const d = dist2D(this.pos.x, this.pos.z, t.pos.x, t.pos.z);
            if (this.melee) {
              if (d > this.stats.range + t.radius * 0.5) this.navigate(t.pos.x, t.pos.z, spd * 1.2, dt, this.stats.range * 0.7);
              else {
                this.speedNow = 0;
                this.face(t.pos.x, t.pos.z, dt, 12);
                this.tryAttack(dt, t);
              }
            } else {
              aiming = true;
              // back off from anything that gets too close
              if (d < 2.4 && this.rec.hp > 0) {
                const ax = this.pos.x - t.pos.x;
                const az = this.pos.z - t.pos.z;
                const al = Math.hypot(ax, az) || 1;
                this.navigate(this.pos.x + (ax / al) * 2, this.pos.z + (az / al) * 2, spd, dt, 0.2);
              } else this.speedNow = 0;
              this.face(t.pos.x, t.pos.z, dt, 12);
              this.tryAttack(dt, t);
            }
          } else this.navigate(this.home.x, this.home.z, spd, dt, 0.8);
        }
        break;
      }
      case 'follow': {
        if (this.retarget <= 0 || !this.target?.alive) {
          this.retarget = 0.35;
          this.target = this.pickTarget(this.melee ? 7 : Math.min(this.stats.range, 26));
        }
        const t = this.target;
        const dp = dist2D(this.pos.x, this.pos.z, p.pos.x, p.pos.z);
        if (t && dp < 14) {
          const d = dist2D(this.pos.x, this.pos.z, t.pos.x, t.pos.z);
          if (this.melee && d > this.stats.range + t.radius * 0.5) this.navigate(t.pos.x, t.pos.z, spd * 1.2, dt, this.stats.range * 0.7);
          else {
            this.speedNow = 0;
            aiming = !this.melee;
            this.face(t.pos.x, t.pos.z, dt, 12);
            this.tryAttack(dt, t);
          }
        } else if (dp > 3.2) {
          const run = dp > 7;
          this.navigate(p.pos.x, p.pos.z, spd * (run ? 1.6 : 1), dt, 2.6);
        } else {
          this.speedNow = 0;
          if (this.reloadT > 0) this.reloadT -= dt;
        }
        break;
      }
    }
    this.aimT = aiming ? this.aimT + dt : 0;
    // keep out of each other / the player
    for (const o of g.level.actors || []) {
      if (o === this || !o.alive) continue;
      const dx = this.pos.x - o.pos.x;
      const dz = this.pos.z - o.pos.z;
      const d = Math.hypot(dx, dz);
      if (d < 0.75 && d > 1e-4) {
        this.pos.x += (dx / d) * (0.75 - d) * 0.5;
        this.pos.z += (dz / d) * (0.75 - d) * 0.5;
      }
    }
    {
      const dx = this.pos.x - p.pos.x;
      const dz = this.pos.z - p.pos.z;
      const d = Math.hypot(dx, dz);
      if (d < 0.8 && d > 1e-4) {
        this.pos.x += (dx / d) * (0.8 - d);
        this.pos.z += (dz / d) * (0.8 - d);
      }
    }
    this.sync(dt, aiming);
  }

  // ------------------------------------------------------------ animation
  sync(dt, aiming) {
    if (this.dog) return this.syncDog(dt);
    const m = this.model;
    this.root.position.set(this.pos.x, 0, this.pos.z);
    this.root.rotation.y = this.yaw;
    if (!this.alive) {
      const t = Math.min(1, this.deadT / 0.8);
      this.root.rotation.order = 'YXZ';
      this.root.rotation.x = -t * t * 1.45;
      return;
    }
    this.phase += dt * this.speedNow * 2.4;
    const amp = Math.min(1, this.speedNow / 3) * 0.6;
    const s = Math.sin(this.phase);
    for (const leg of m.legs) {
      leg.hip.rotation.x = s * amp * leg.s;
      leg.knee.rotation.x = Math.max(0, s * leg.s) * amp * 1.1;
    }
    const recoil = this.attackAnim;
    for (const arm of m.arms) {
      const gunArm = arm.fore.children.includes(m.gunMount);
      if (aiming && this.gun) {
        arm.sh.rotation.x = -1.45 + recoil * 0.25;
        arm.sh.rotation.z = gunArm ? 0.05 : -arm.s * 0.5;
        arm.fore.rotation.x = gunArm ? 0 : -0.3;
      } else if (this.melee && gunArm) {
        arm.sh.rotation.x = -0.5 - recoil * 1.6 + Math.sin(this.phase) * amp * 0.3;
        arm.sh.rotation.z = 0.1;
        arm.fore.rotation.x = -0.6 + recoil * 0.4;
      } else {
        arm.sh.rotation.x = -s * amp * 0.6 * arm.s - (gunArm && this.gun ? 0.35 : 0);
        arm.sh.rotation.z = arm.s * 0.06;
        arm.fore.rotation.x = -0.2 - (gunArm && this.gun ? 0.5 : 0);
      }
    }
    m.torso.rotation.x = m.baseLean + (this.hurtT > 0 ? -0.15 : 0) + Math.sin(this.game.time * 1.4 + this.phase) * 0.015;
    m.hips.position.y = m.hipY + Math.abs(Math.sin(this.phase)) * 0.03;
    m.head.rotation.x = aiming ? 0.1 : 0;
    if (this.gun?.spin) this.gun.spin.rotation.z += dt * (aiming ? 30 : 0);
    void angleDiff;
  }

  syncDog(dt) {
    const m = this.model;
    const g = this.game;
    this.root.position.set(this.pos.x, 0, this.pos.z);
    this.root.rotation.y = this.yaw;
    if (!this.alive) {
      // rolls onto its side
      const t = Math.min(1, this.deadT / 0.6);
      m.body.rotation.z = t * 1.45;
      m.body.position.y = m.shoulder * (1 - t * 0.7);
      return;
    }
    // bark at the dead when they come near
    this.barkCd = (this.barkCd ?? Math.random() * 3) - dt;
    if (this.barkCd <= 0) {
      this.barkCd = 1.6 + Math.random() * 2.5;
      const near = g.level.enemies.some((e) => e.alive && dist2D(e.pos.x, e.pos.z, this.pos.x, this.pos.z) < 14);
      if (near && this.mode !== 'found') g.audio.bark?.(this.pos, false);
    }
    const sp = this.speedNow;
    const gallop = sp > 4;
    this.phase += dt * (gallop ? 11 : 2.6 * Math.max(sp, 0.01) + (sp > 0.1 ? 3 : 0));
    const amp = Math.min(1, sp / 3) * (gallop ? 0.85 : 0.55);
    for (const leg of m.legs) {
      // a walk moves diagonal pairs together; a gallop moves front and back pairs
      const off = gallop ? (leg.front ? 0 : Math.PI) + leg.s * 0.4 : (leg.front ? 0 : Math.PI) + (leg.s > 0 ? Math.PI : 0);
      const s = Math.sin(this.phase + off);
      leg.hip.rotation.x = s * amp;
      leg.knee.rotation.x = (leg.front ? -1 : 1) * Math.max(0, -s) * amp * 0.9;
    }
    const sitting = this.mode === 'found' || (sp < 0.05 && this.mode === 'camp');
    const sit = (this.sitT = Math.max(0, Math.min(1, (this.sitT || 0) + (sitting ? dt : -dt * 3) * 2)));
    m.body.rotation.x = -sit * 0.5 + (gallop ? Math.sin(this.phase) * 0.06 : 0);
    m.body.position.y = m.shoulder - sit * 0.12 + (gallop ? Math.abs(Math.sin(this.phase)) * 0.05 : Math.abs(Math.sin(this.phase * 2)) * 0.01);
    for (const leg of m.legs) if (!leg.front && sit > 0) leg.hip.rotation.x += sit * 1.2;
    // the tail wags; faster with the player close by
    const p = g.player;
    const happy = dist2D(this.pos.x, this.pos.z, p.pos.x, p.pos.z) < 4 ? 1 : 0.4;
    m.tail.rotation.y = Math.sin(g.time * (6 + 8 * happy)) * 0.45 * happy;
    m.tail.rotation.x = this.target ? -0.2 : -0.5 * happy;
    // a lunge and a snap when it bites
    const a = this.attackAnim;
    m.neck.rotation.x = -a * 0.5 + (this.hurtT > 0 ? 0.3 : 0);
    m.jaw.rotation.x = a * 0.6 + (this.target ? 0.12 + Math.sin(g.time * 20) * 0.05 : 0);
    m.head.rotation.y = this.mode === 'found' ? Math.sin(g.time * 0.7) * 0.3 : 0;
  }

  dispose() {
    this.root.parent?.remove(this.root);
  }
}
