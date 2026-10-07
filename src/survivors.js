// Survivor NPCs: idle around camp by day, hold the barricade at night and
// follow the player through buildings. They never run out of ammo.
import * as THREE from 'three';
import { makeHuman } from './actors.js';
import { makeGunModel } from './gunModels.js';
import { WEAPONS, weaponStats } from './weapons.js';
import { survivorSpeed, survivorAim, weaponByUid, removeWeapon } from './run.js';
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
    this.model = makeHuman(rec.look);
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
    if (this.gun) this.model.gunMount.remove(this.gun.group);
    this.gun = null;
    const run = this.game.run;
    const inst = this.rec.weapon != null ? weaponByUid(run, this.rec.weapon) : null;
    if (inst && !WEAPONS[inst.id].noSurvivor) {
      this.stats = weaponStats(inst, this.rec.level);
      this.gun = makeGunModel(WEAPONS[inst.id]);
      this.gun.group.rotation.x = -Math.PI / 2;
      if (this.stats.def.cat === 'melee') this.gun.group.rotation.x = -Math.PI * 0.75;
      this.model.gunMount.add(this.gun.group);
    } else this.stats = FISTS;
    this.mag = this.stats.mag;
    this.melee = this.stats.def.cat === 'melee';
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
      if (!e.alive || e.type === 'angel') continue;
      if (filter && !filter(e)) continue;
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
    if (this.cd > 0) return;
    const g = this.game;
    const d = dist2D(this.pos.x, this.pos.z, target.pos.x, target.pos.z);
    if (this.melee) {
      if (d > s.range + target.radius) return;
      this.cd = 1 / s.rate;
      this.attackAnim = 1;
      g.audio.swing?.(this.pos);
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

  dispose() {
    this.root.parent?.remove(this.root);
  }
}
