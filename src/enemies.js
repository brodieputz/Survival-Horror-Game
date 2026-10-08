// Zombie AI. In buildings ("roam" mode) zombies patrol, hunt by sight or
// sound and use the original Grunt / Blood Hound / Blind Brute
// behaviours. In the camp ("wave" mode) they march on the barricade, batter it
// down, then go for the player and the survivors.
import * as THREE from 'three';
import { makeGrunt, makeBrute, makeHound, glowSprite } from './models.js';
import { makeZombie, makeRaider } from './actors.js';
import { makeGunModel } from './gunModels.js';
import { WEAPONS } from './weapons.js';
import { dampAngle, angleDiff, dist2D, mulberry32 } from './util.js';
import { mul } from './perks.js';

export const ZOMBIES = {
  walker: { name: 'Walker', hp: 60, radius: 0.38, walk: 1.0, run: 2.2, wave: 2.0, sight: 0.85, fov: 2.0, stride: 1.2, dmg: 12, bdmg: 9, cd: 1.3, reach: 1.9, xp: 1 },
  runner: { name: 'Runner', hp: 42, radius: 0.36, walk: 1.6, run: 5.4, wave: 5.4, sight: 1.0, fov: 2.2, stride: 1.5, dmg: 10, bdmg: 6, cd: 0.9, reach: 1.8, xp: 2 },
  grunt: { name: 'Grunt', hp: 90, radius: 0.42, walk: 2.0, run: 5.4, wave: 3.0, sight: 1.0, fov: 2.1, stride: 1.4, dmg: 20, bdmg: 12, cd: 1.1, reach: 2.0, xp: 2 },
  fat: { name: 'Bloater', hp: 230, radius: 0.6, walk: 0.9, run: 1.8, wave: 1.7, sight: 0.7, fov: 1.8, stride: 1.3, dmg: 24, bdmg: 20, cd: 1.6, reach: 2.1, xp: 4 },
  rotter: { name: 'Rotter', hp: 270, radius: 0.42, walk: 0.8, run: 1.2, wave: 1.5, sight: 0.8, fov: 2.0, stride: 1.1, dmg: 20, bdmg: 15, cd: 1.4, reach: 2.0, xp: 4 },
  armored: { name: 'Riot Zombie', hp: 170, radius: 0.44, walk: 1.4, run: 3.2, wave: 2.5, sight: 0.9, fov: 2.0, stride: 1.4, dmg: 18, bdmg: 14, cd: 1.2, reach: 2.0, armor: 0.55, xp: 5 },
  crawler: { name: 'Crawler', hp: 35, radius: 0.35, walk: 1.2, run: 2.8, wave: 2.9, sight: 0.6, fov: 2.0, stride: 0.9, dmg: 8, bdmg: 5, cd: 0.9, reach: 1.5, xp: 1 },
  hound: { name: 'Blood Hound', hp: 32, radius: 0.32, walk: 2.6, run: 5.9, wave: 6.6, sight: 1.25, fov: 2.4, stride: 0.55, dmg: 9, bdmg: 5, cd: 0.75, reach: 1.6, xp: 2 },
  spitter: { name: 'Spitter', hp: 70, radius: 0.38, walk: 1.1, run: 3.2, wave: 2.4, sight: 1.15, fov: 2.3, stride: 1.2, dmg: 9, bdmg: 6, cd: 1.2, reach: 1.8, xp: 3, spit: { range: 15, min: 3.5, cd: 3.2, dmg: 12 } },
  lurker: { name: 'Lurker', hp: 85, radius: 0.4, walk: 1.0, run: 4.8, wave: 3.4, sight: 0.9, fov: 2.0, stride: 1.3, dmg: 22, bdmg: 10, cd: 1.0, reach: 1.9, xp: 3 },
  // not a zombie: an armed human holding a building
  raider: { name: 'Raider', hp: 110, radius: 0.38, walk: 1.5, run: 4.0, wave: 3, sight: 1.3, fov: 2.5, stride: 1.4, dmg: 14, bdmg: 8, cd: 1.1, reach: 1.8, xp: 6, human: true },
  brute: { name: 'Blind Brute', hp: 650, radius: 0.75, walk: 1.6, run: 4.9, wave: 2.1, sight: 0, fov: 0, stride: 2.1, dmg: 42, bdmg: 55, cd: 1.7, reach: 2.4, xp: 15 },
};

// Which of the original sound-sets each zombie uses.
const VOICE = { walker: 'grunt', runner: 'grunt', grunt: 'grunt', fat: 'brute', rotter: 'grunt', armored: 'grunt', crawler: 'grunt', hound: 'hound', spitter: 'grunt', lurker: 'grunt', raider: 'grunt', brute: 'brute' };

let seedCounter = 1;

const RAIDER_SHOUTS = ['"Over there! Light \'em up!"', '"We got company!"', '"This is our place! Get out!"', '"Flank \'em!"', '"Drop the bag and walk away!"'];

// Corpses lie for a moment, then fade out and sink away.
const FADE_START = 6;
const FADE_TIME = 2.5;

export class Enemy {
  constructor(game, type, x, z, opts = {}) {
    this.game = game;
    this.type = type;
    this.voice = VOICE[type];
    const s = ZOMBIES[type];
    this.s = s;
    const mul = opts.mul || { hp: 1, spd: 1, dmg: 1 };
    this.mul = mul;
    this.hp = s.hp * mul.hp;
    this.maxHp = this.hp;
    this.radius = s.radius;
    this.mode = opts.wave ? 'wave' : 'roam';
    this.pos = new THREE.Vector3(x, 0, z);
    this.yaw = this.mode === 'wave' ? -Math.PI / 2 : Math.random() * Math.PI * 2;
    const rng = mulberry32(seedCounter++ * 7919);
    this.model =
      type === 'grunt' ? makeGrunt() : type === 'brute' ? makeBrute() : type === 'hound' ? makeHound() : type === 'raider' ? makeRaider(rng) : makeZombie(type, rng);
    if (type === 'raider') {
      // a raider's gun: how hard it hits in their (unsteady) hands
      this.gunId = opts.gun && WEAPONS[opts.gun] ? opts.gun : 'glock';
      const def = WEAPONS[this.gunId];
      this.gun = { def, dmg: Math.min(16, def.dmg * (def.pellets || 1) * 0.4), rate: Math.min(def.rate, 1.4), range: Math.min(def.range, 30) };
      const gm = makeGunModel(def);
      gm.group.rotation.x = -Math.PI / 2;
      this.model.gunMount.add(gm.group);
      this.gunModel = gm;
      this.aimT = 0;
    }
    this.model.hipY = this.model.hipY ?? this.model.hips?.position.y ?? 0.95;
    this.root = this.model.root;
    this.root.traverse((o) => {
      if (o.isMesh) o.userData.enemy = this;
    });
    (opts.group || game.level.group).add(this.root);
    this.state = this.mode === 'wave' ? 'march' : type === 'lurker' && !opts.awake ? 'dormant' : 'patrol';
    this.spitCd = 1 + Math.random() * 2;
    this.stateT = 0;
    this.path = null;
    this.pathI = 0;
    this.pathGoal = null;
    this.repath = 0;
    this.target = null;
    this.foe = null;
    this.lastSeen = new THREE.Vector3(x, 0, z);
    this.lostT = 0;
    this.attackCd = Math.random() * 0.8;
    this.attackAnim = 0;
    this.windup = 0;
    this.stun = 0;
    this.knowsSpot = null;
    this.speedNow = 0;
    this.phase = Math.random() * 10;
    this.stepDist = 0;
    this.vocalCd = 3 + Math.random() * 8;
    this.shriekCd = 0;
    this.enraged = 0;
    this.frenzy = 0;
    this.fightWith = null;
    this.deadT = 0;
    this.pauseT = 0;
    this.jaw = 0;
    this.awake = false;
    this.observed = false;
    this.flinch = 0;
    this.burn = 0;
    this.burnDps = 0;
    this.burnSrc = null;
    this.laneZ = z;
    this.gone = false;
    this.syncModel(0);
  }

  get alive() {
    return this.state !== 'dead';
  }

  // Is this zombie actively hunting (drives chase music)?
  get hunting() {
    if (!this.alive || this.stun > 0) return false;
    if (this.mode === 'wave') return true;
    return ['chase', 'alert', 'pullout', 'shriek', 'charge', 'bark', 'shoot'].includes(this.state) || this.enraged > 0;
  }

  setState(s) {
    if (this.state === 'dead') return;
    if (s === 'bark' && this.state !== 'bark') this.shriekCd = Math.min(this.shriekCd, 0.6);
    this.state = s;
    this.stateT = 0;
    this.path = null;
  }

  // ------------------------------------------------------------ perception
  dist() {
    const p = this.game.player;
    return dist2D(this.pos.x, this.pos.z, p.pos.x, p.pos.z);
  }

  canSee(ignoreHidden = false) {
    if (this.s.sight === 0) return false;
    const p = this.game.player;
    if (!p.alive) return false;
    if (p.hidden && !ignoreHidden) return false;
    const d = this.dist();
    const range = p.visibility() * this.s.sight;
    if (d > range) return false;
    const engaged = ['chase', 'pullout', 'bark', 'alert'].includes(this.state);
    if (d > 2.2 && !engaged) {
      const a = Math.atan2(p.pos.x - this.pos.x, p.pos.z - this.pos.z);
      if (Math.abs(angleDiff(this.yaw, a)) > this.s.fov / 2) return false;
    }
    return this.game.level.world.los(this.pos.x, this.pos.z, p.pos.x, p.pos.z);
  }

  // Nearest companion survivor this zombie can see (buildings).
  spotCompanion() {
    if (this.s.sight === 0) return null;
    const list = this.game.level.actors || [];
    let best = null;
    let bd = 14 * this.s.sight;
    for (const a of list) {
      if (!a.alive) continue;
      const d = dist2D(this.pos.x, this.pos.z, a.pos.x, a.pos.z);
      if (d > bd) continue;
      const engaged = this.state === 'chase';
      if (d > 2.2 && !engaged) {
        const ang = Math.atan2(a.pos.x - this.pos.x, a.pos.z - this.pos.z);
        if (Math.abs(angleDiff(this.yaw, ang)) > this.s.fov / 2) continue;
      }
      if (!this.game.level.world.los(this.pos.x, this.pos.z, a.pos.x, a.pos.z)) continue;
      bd = d;
      best = a;
    }
    return best;
  }

  // Every living human this zombie could attack.
  humans() {
    const out = [];
    const p = this.game.player;
    if (p.alive && !p.hidden) out.push(p);
    for (const a of this.game.level.actors || []) if (a.alive) out.push(a);
    return out;
  }

  nearestHuman(maxD = Infinity) {
    let best = null;
    let bd = maxD;
    for (const h of this.humans()) {
      const d = dist2D(this.pos.x, this.pos.z, h.pos.x, h.pos.z);
      if (d < bd) {
        bd = d;
        best = h;
      }
    }
    return best;
  }

  hear(n) {
    if (!this.alive || this.stun > 0 || this.mode === 'wave') return;
    if (this.state === 'fight') return;
    if (this.trapped) {
      if (dist2D(this.pos.x, this.pos.z, n.x, n.z) < n.r * 0.85) this.game.level.rouseBoards?.();
      return;
    }
    if (this.state === 'dormant') {
      if (dist2D(this.pos.x, this.pos.z, n.x, n.z) < Math.min(6, n.r * 0.5)) this.wake();
      return;
    }
    const mult = this.type === 'brute' ? (n.kind === 'glass' ? 2.0 : 1.5) : this.type === 'hound' ? 1.0 : 0.85;
    const d = dist2D(this.pos.x, this.pos.z, n.x, n.z);
    if (d > n.r * mult) return;
    if (n.kind === 'hide' && this.type !== 'brute') return;
    if (this.type === 'brute') {
      const fromPlayer = n.kind === 'player' || n.kind === 'glass' || n.kind === 'gun' || n.kind === 'hide';
      if (fromPlayer && d < 11) {
        if (this.state !== 'charge') this.game.audio.growl('brute', this.pos);
        this.setState('charge');
        this.target = new THREE.Vector3(n.x, 0, n.z);
        this.lastHeard = this.game.time;
      } else if (this.state !== 'charge' && this.state !== 'pullout') {
        if (this.state === 'patrol') this.game.audio.growl('brute', this.pos, 0.6);
        this.setState('investigate');
        this.target = new THREE.Vector3(n.x, 0, n.z);
      } else if (this.state === 'charge') this.target = new THREE.Vector3(n.x, 0, n.z);
      return;
    }
    if (['chase', 'alert', 'shriek', 'pullout', 'bark', 'shoot'].includes(this.state)) return;
    this.setState('investigate');
    this.target = new THREE.Vector3(n.x, 0, n.z);
  }

  // Alerted by a hound's shriek. spot = hiding spot the hound has found.
  alerted(x, z, spot) {
    if (!this.alive || this.stun > 0 || this.state === 'fight' || this.state === 'dormant' || this.trapped || this.type === 'raider') return;
    if (this.mode === 'wave') {
      this.frenzy = 7;
      return;
    }
    if (spot && this.game.player.hidden === spot) {
      this.knowsSpot = spot;
      this.setState('pullout');
      return;
    }
    if (this.type === 'hound') return;
    if (['chase', 'pullout'].includes(this.state)) return;
    if (this.type === 'brute') {
      this.setState('charge');
      this.target = new THREE.Vector3(x, 0, z);
      this.lastHeard = this.game.time;
      return;
    }
    this.setState('investigate');
    this.target = new THREE.Vector3(x, 0, z);
    this.alertRun = true;
  }

  // ------------------------------------------------------------ movement
  goTo(x, z, speed, dt, arrive = 0.6) {
    const world = this.game.level.world;
    const dGoal = dist2D(this.pos.x, this.pos.z, x, z);
    if (dGoal < arrive) {
      this.speedNow = 0;
      return true;
    }
    this.repath -= dt;
    if (!this.path || !this.pathGoal || dist2D(this.pathGoal.x, this.pathGoal.z, x, z) > 1.2 || this.repath <= 0) {
      this.path = world.findPath(this.pos.x, this.pos.z, x, z);
      this.pathI = 0;
      this.pathGoal = { x, z };
      this.repath = 0.5 + Math.random() * 0.4;
      if (!this.path) {
        this.speedNow = 0;
        this.unreachable = (this.unreachable || 0) + 1;
        return false;
      }
      this.unreachable = 0;
    }
    if (!this.path) return false;
    for (let k = 0; k < 3 && this.pathI < this.path.length - 1; k++) {
      const n = this.path[this.pathI + 1];
      if (world.clearLine(this.pos.x, this.pos.z, n.x, n.z, this.radius)) this.pathI++;
      else break;
    }
    let wp = this.path[this.pathI];
    let dx = wp.x - this.pos.x;
    let dz = wp.z - this.pos.z;
    let d = Math.hypot(dx, dz);
    if (d < 0.25 && this.pathI < this.path.length - 1) {
      this.pathI++;
      wp = this.path[this.pathI];
      dx = wp.x - this.pos.x;
      dz = wp.z - this.pos.z;
      d = Math.hypot(dx, dz);
    }
    if (d < 1e-4) {
      this.speedNow = 0;
      return dGoal < arrive + 0.4;
    }
    this.stepToward(dx / d, dz / d, Math.min(speed * dt, d), dt);
    return false;
  }

  stepToward(nx, nz, step, dt) {
    const world = this.game.level.world;
    const ox = this.pos.x;
    const oz = this.pos.z;
    this.pos.x += nx * step;
    this.pos.z += nz * step;
    world.collide(this.pos, this.radius, true);
    const moved = Math.hypot(this.pos.x - ox, this.pos.z - oz);
    this.speedNow = moved / Math.max(dt, 1e-4);
    this.yaw = dampAngle(this.yaw, Math.atan2(nx, nz), 8, dt);
    this.stepDist += moved;
  }

  face(x, z, dt, rate = 8) {
    this.yaw = dampAngle(this.yaw, Math.atan2(x - this.pos.x, z - this.pos.z), rate, dt);
  }

  pickPatrol() {
    const lvl = this.game.level;
    const rooms = lvl.d.rooms;
    for (let a = 0; a < 8; a++) {
      const r = this.confine != null ? rooms[this.confine] : rooms[1 + Math.floor(Math.random() * (rooms.length - 1))];
      if (!r) break;
      const x = (r.x + 0.5 + Math.random() * (r.w - 1)) * 3;
      const z = (r.y + 0.5 + Math.random() * (r.h - 1)) * 3;
      const [tx, ty] = lvl.world.tileOf(x, z);
      if (!lvl.world.walkableForMonster(tx, ty)) continue;
      if (a < 6 && dist2D(x, z, this.pos.x, this.pos.z) > 55) continue;
      this.target = new THREE.Vector3(x, 0, z);
      return;
    }
    this.target = this.pos.clone();
  }

  // ------------------------------------------------------------ damage
  // src: the player, a survivor actor, or a string ('turret', 'trap', 'fire')
  hit(dmg, src = null, info = {}) {
    if (!this.alive) return;
    if (this.s.armor && !info.head && !info.explosive && !info.fire) dmg *= 1 - this.s.armor;
    this.hp -= dmg;
    this.flinch = 1;
    const g = this.game;
    if (!info.fire) g.audio.flesh(this.pos);
    if (this.hp <= 0) {
      this.die(src, info);
      return;
    }
    if (this.mode === 'wave') {
      if (this.type === 'brute' && src && src !== 'trap') {
        if (this.enraged <= 0) g.audio.growl('brute', this.pos, 1.3);
        this.enraged = 6;
      }
      return;
    }
    const byHuman = src && typeof src === 'object';
    if (this.state === 'dormant' || this.state === 'rise') {
      this.wake();
      return;
    }
    if (this.type === 'raider') {
      this.lastSeen.copy(byHuman ? src.pos : g.player.pos);
      if (this.state !== 'shoot') this.setState('shoot');
      return;
    }
    if (this.type === 'brute') {
      this.enraged = 6;
      g.audio.growl('brute', this.pos, 1.3);
      this.setState('charge');
      this.target = (byHuman ? src.pos : g.player.pos).clone();
    } else if (this.state !== 'fight' && this.stun <= 0) {
      if (byHuman && src !== g.player) this.foe = src;
      else this.foe = null;
      this.lastSeen.copy(byHuman ? src.pos : g.player.pos);
      if (this.type === 'hound' && this.state !== 'chase') this.startShriek();
      else if (this.state !== 'chase') {
        this.setState('chase');
        g.audio.growl(this.voice, this.pos);
      }
    }
  }

  ignite(seconds, dps, src) {
    if (!this.alive) return;
    if (src && src === this.game.player) {
      const f = mul(this.game.run, 'fireMul');
      seconds *= f;
      dps *= f;
    }
    this.burn = Math.max(this.burn, seconds);
    this.burnDps = Math.max(this.burnDps, dps);
    this.burnSrc = src;
    if (!this.fireSprite) {
      this.fireSprite = glowSprite(0xff7a20, this.model.height * 0.9, 0.8);
      this.fireSprite.position.y = this.model.height * 0.55;
      this.root.add(this.fireSprite);
    }
    this.fireSprite.visible = true;
  }

  die(src, info = {}) {
    const g = this.game;
    this.state = 'dead';
    this.deadT = 0;
    this.speedNow = 0;
    this.burn = 0;
    if (this.fireSprite) this.fireSprite.visible = false;
    g.audio.monsterDeath(this.voice, this.pos);
    if (this.fightWith && this.fightWith.fightWith === this) {
      this.fightWith.fightWith = null;
      this.fightWith.setState('search');
    }
    g.onZombieKilled(this, src, info);
    if (this.type === 'raider') {
      if (this.gunModel) this.gunModel.group.visible = false;
      g.level.raiderDown?.(this);
    }
  }

  trap(seconds, dmg, src = 'trap') {
    if (!this.alive) return false;
    this.stun = seconds;
    this.hit(dmg, src);
    if (this.alive) {
      this.game.audio.growl(this.voice, this.pos, 1.2);
      if (this.mode === 'roam') this.setState('stunned');
    }
    return true;
  }

  // A lurker lying among the dead gets up.
  wake() {
    if (this.state !== 'dormant') return;
    this.setState('rise');
    this.game.audio.growl(this.voice, this.pos, 1.4);
    if (!this.game.anyHunting()) this.game.audio.stinger();
  }

  // Lob a glob of bile at someone. lob = a high arc (over the barricade).
  spit(target, lob = false) {
    const g = this.game;
    const from = new THREE.Vector3(this.pos.x, this.model.height * 0.85, this.pos.z);
    const d = dist2D(this.pos.x, this.pos.z, target.pos.x, target.pos.z);
    const T = lob ? 1.0 + d * 0.035 : 0.4 + d * 0.035;
    const err = 0.25 + d * 0.04;
    const tx = target.pos.x + (Math.random() - 0.5) * err * 2;
    const tz = target.pos.z + (Math.random() - 0.5) * err * 2;
    const grav = 9.8;
    const ty = 0.9;
    const vel = new THREE.Vector3((tx - from.x) / T, (ty - from.y + 0.5 * grav * T * T) / T, (tz - from.z) / T);
    g.combat.spawn('acid', from, vel, { grav, dmg: this.s.spit.dmg * this.mul.dmg, src: this, splash: 0 });
    g.audio.swipe(this.pos);
    this.jaw = 1;
    this.attackAnim = 0.6;
    this.spitCd = this.s.spit.cd * (0.85 + Math.random() * 0.4);
  }

  startShriek() {
    this.setState('shriek');
    this.shriekCd = 7;
  }

  doShriek(spot) {
    const g = this.game;
    g.audio.shriek(this.pos);
    g.alert(this.pos.x, this.pos.z, 40, spot, this);
    this.jaw = 1;
  }

  // ------------------------------------------------------------ update
  update(dt) {
    this.stateT += dt;
    this.attackCd = Math.max(0, this.attackCd - dt);
    this.attackAnim = Math.max(0, this.attackAnim - dt * 3);
    this.flinch = Math.max(0, this.flinch - dt * 4);
    this.jaw = Math.max(0, this.jaw - dt * 0.8);
    this.vocalCd -= dt;
    this.shriekCd -= dt;
    this.enraged = Math.max(0, this.enraged - dt);
    this.frenzy = Math.max(0, this.frenzy - dt);
    const g = this.game;

    if (this.state === 'dead') {
      this.deadT += dt;
      this.syncModel(dt);
      if (this.deadT > FADE_START) this.fadeOut(Math.min(1, (this.deadT - FADE_START) / FADE_TIME));
      return;
    }

    if (this.burn > 0) {
      this.burn -= dt;
      this.hit(this.burnDps * dt, this.burnSrc, { fire: true });
      if (this.fireSprite) this.fireSprite.material.opacity = 0.5 + Math.random() * 0.4;
      if (this.burn <= 0 && this.fireSprite) this.fireSprite.visible = false;
      if (!this.alive) return;
    }

    if (this.stun > 0) {
      this.stun -= dt;
      this.speedNow = 0;
      if (this.stun <= 0 && this.mode === 'roam') {
        this.setState('investigate');
        this.target = g.player.pos.clone();
      }
      this.syncModel(dt);
      return;
    }

    this.spitCd -= dt;
    if (this.state === 'dormant' || this.state === 'rise') {
      this.updateLurker(dt);
      this.syncModel(dt);
      return;
    }
    if (this.mode === 'wave') this.updateWave(dt);
    else if (this.type === 'raider') this.updateRaider(dt);
    else if (this.type === 'brute') this.updateBrute(dt);
    else this.updateSighted(dt);

    const strideLen = this.s.stride;
    if (strideLen && this.stepDist > strideLen) {
      this.stepDist = 0;
      if (this.dist() < 32) g.audio.monsterStep(this.voice, this.pos);
    }
    if (this.vocalCd <= 0 && this.type !== 'raider') {
      this.vocalCd = (this.mode === 'wave' ? 7 : 5) + Math.random() * 9;
      if (this.dist() < 30) g.audio.growl(this.voice, this.pos, this.hunting ? 1 : 0.55);
    }
    this.syncModel(dt);
  }

  // ------------------------------------------------------------ camp waves
  waveSpeed() {
    let s = this.s.wave * this.mul.spd;
    if (this.type === 'brute' && this.enraged > 0) s = this.s.run * 0.8;
    if (this.frenzy > 0) s *= 1.35;
    return s;
  }

  updateWave(dt) {
    const g = this.game;
    const camp = g.level;
    if (this.type === 'hound' && !this.shrieked && this.pos.x < camp.bx + 55) {
      this.shrieked = true;
      g.audio.shriek(this.pos);
      for (const e of camp.enemies) if (e.alive && dist2D(e.pos.x, e.pos.z, this.pos.x, this.pos.z) < 45) e.frenzy = 7;
      this.jaw = 1;
      g.ui.message('A Blood Hound shrieks — the horde surges forward!', 'bad');
    }
    if (this.s.spit && camp.barricadeUp && this.pos.x - camp.bx < 17) {
      // spitters hang back from the barricade and lob bile at the defenders
      const t = this.nearestHuman(34);
      if (t) {
        this.speedNow = 0;
        this.face(t.pos.x, t.pos.z, dt, 8);
        if (this.spitCd <= 0) this.spit(t, true);
        return;
      }
    }
    if (camp.barricadeUp) {
      const gap = this.pos.x - camp.bx;
      if (gap <= camp.barricadeFace + this.radius + 0.35) {
        this.speedNow = 0;
        this.face(camp.bx - 5, this.pos.z, dt, 8);
        if (this.attackCd <= 0) {
          this.windup += dt;
          this.attackAnim = Math.min(1, this.windup * 2.5);
          if (this.windup > 0.45) {
            this.windup = 0;
            this.attackCd = this.s.cd * (0.85 + Math.random() * 0.3);
            this.attackAnim = 1;
            camp.damageBarricade(this.s.bdmg * this.mul.dmg, this);
          }
        }
        return;
      }
      const step = camp.flowTarget(this.pos.x, this.pos.z, this.laneZ, this);
      const dx = step.x - this.pos.x;
      const dz = step.z - this.pos.z;
      const d = Math.hypot(dx, dz) || 1;
      this.stepToward(dx / d, dz / d, this.waveSpeed() * dt, dt);
      return;
    }
    // the barricade is down: hunt the living
    if (!this.foe || !this.foe.alive || this.stateT > 1.2) {
      this.foe = this.nearestHuman();
      this.stateT = 0;
    }
    const f = this.foe;
    if (!f) {
      this.speedNow = 0;
      return;
    }
    const d = dist2D(this.pos.x, this.pos.z, f.pos.x, f.pos.z);
    if (d < this.s.reach * 0.85) {
      this.speedNow = 0;
      this.face(f.pos.x, f.pos.z, dt, 12);
      this.attack(dt, f);
    } else {
      this.windup = 0;
      if (g.level.world.clearLine(this.pos.x, this.pos.z, f.pos.x, f.pos.z, this.radius)) {
        this.path = null;
        this.stepToward((f.pos.x - this.pos.x) / d, (f.pos.z - this.pos.z) / d, this.waveSpeed() * 1.15 * dt, dt);
      } else this.goTo(f.pos.x, f.pos.z, this.waveSpeed() * 1.15, dt, 0.5);
    }
  }

  // ------------------------------------------------------------ buildings
  // Grunts, walkers, runners and hounds: hunt by sight.
  updateSighted(dt) {
    const g = this.game;
    const p = g.player;
    const isHound = this.type === 'hound';
    const seesP = this.canSee();
    const comp = this.state === 'chase' && this.foe ? null : this.spotCompanion();
    const d = this.dist();

    if ((seesP || comp) && ['patrol', 'investigate', 'search'].includes(this.state)) {
      this.foe = seesP && (!comp || d <= dist2D(this.pos.x, this.pos.z, comp.pos.x, comp.pos.z) + 2) ? null : comp;
      this.lastSeen.copy(this.foe ? this.foe.pos : p.pos);
      if (isHound) this.startShriek();
      else {
        this.setState('alert');
        g.audio.growl(this.voice, this.pos, 1.2);
        if (!g.anyHunting()) g.audio.stinger();
      }
    }

    switch (this.state) {
      case 'patrol': {
        if (!this.target || this.pauseT > 0) {
          this.pauseT -= dt;
          this.speedNow = 0;
          if (this.pauseT <= 0 && !this.target) this.pickPatrol();
          break;
        }
        const arrived = this.goTo(this.target.x, this.target.z, this.s.walk * this.mul.spd, dt, 0.8);
        if (arrived || this.unreachable > 2 || this.stateT > 40) {
          this.target = null;
          this.pauseT = 1 + Math.random() * 3;
          this.stateT = 0;
        }
        break;
      }
      case 'alert': {
        const f = this.foe || p;
        this.speedNow = 0;
        this.face(f.pos.x, f.pos.z, dt, 12);
        this.attackAnim = 0.4;
        if (this.stateT > 0.45) this.setState('chase');
        break;
      }
      case 'shriek': {
        const f = this.foe || p;
        this.speedNow = 0;
        this.face(f.pos.x, f.pos.z, dt, 12);
        if (this.stateT < dt * 1.5) this.doShriek(null);
        if (this.stateT > 0.9) this.setState('chase');
        break;
      }
      case 'chase': {
        if (this.foe) {
          this.chaseCompanion(dt);
          break;
        }
        if (!p.alive) {
          this.setState('search');
          break;
        }
        if (p.hidden) {
          if (this.knowsSpot === p.hidden) this.setState(isHound ? 'bark' : 'pullout');
          else {
            this.setState('investigate');
            this.target = this.lastSeen.clone();
            this.alertRun = true;
          }
          break;
        }
        if (seesP) {
          this.lastSeen.copy(p.pos);
          this.lostT = 0;
        } else this.lostT += dt;
        if (isHound && seesP && this.shriekCd <= 0) {
          this.shriekCd = 8;
          this.doShriek(null);
        }
        if (this.s.spit && seesP && d > this.s.spit.min && d < this.s.spit.range) {
          // keep its distance and spit; shuffle sideways between globs
          this.face(p.pos.x, p.pos.z, dt, 10);
          this.windup = 0;
          if (this.spitCd <= 0) this.spit(p);
          else if (this.spitCd > 0.8) {
            const side = Math.sin(this.phase * 0.3 + this.stateT) > 0 ? 1 : -1;
            const nx = (p.pos.z - this.pos.z) / d;
            const nz = -(p.pos.x - this.pos.x) / d;
            this.stepToward(nx * side, nz * side, this.s.walk * dt, dt);
            this.yaw = dampAngle(this.yaw, Math.atan2(p.pos.x - this.pos.x, p.pos.z - this.pos.z), 10, dt);
          } else this.speedNow = 0;
          break;
        }
        const range = isHound ? 1.25 : this.s.reach * 0.78;
        if (d < range && seesP) {
          this.face(p.pos.x, p.pos.z, dt, 14);
          this.speedNow = 0;
          this.attack(dt, p);
        } else {
          this.windup = 0;
          // a companion blocking the way gets attacked instead
          const blocker = this.nearestHuman(this.s.reach * 0.7);
          if (blocker && blocker !== p) {
            this.face(blocker.pos.x, blocker.pos.z, dt, 14);
            this.speedNow = 0;
            this.attack(dt, blocker);
            break;
          }
          const tgt = seesP ? p.pos : this.lastSeen;
          const arrived = this.goTo(tgt.x, tgt.z, this.s.run * this.mul.spd, dt, 0.5);
          if ((!seesP && arrived) || this.lostT > 6) this.setState('search');
        }
        break;
      }
      case 'investigate': {
        const spd = (this.alertRun ? this.s.run * 0.85 : this.s.walk * 1.5) * this.mul.spd;
        const arrived = this.goTo(this.target.x, this.target.z, spd, dt, 1.0);
        if (arrived || this.unreachable > 2 || this.stateT > 25) {
          this.alertRun = false;
          this.setState('search');
        }
        break;
      }
      case 'search': {
        this.speedNow = 0;
        this.foe = null;
        this.yaw += Math.sin(this.stateT * 2.2) * dt * 2.2;
        if (this.stateT > 3.5) {
          this.knowsSpot = null;
          this.setState('patrol');
          this.target = null;
          this.pauseT = 0.3;
        }
        break;
      }
      case 'pullout': {
        const spot = this.knowsSpot;
        if (!spot || p.hidden !== spot) {
          this.knowsSpot = null;
          if (p.alive && !p.hidden) {
            this.lastSeen.copy(p.pos);
            this.setState('chase');
          } else this.setState('search');
          break;
        }
        const arrived = this.goTo(spot.exit.x, spot.exit.z, this.s.run * this.mul.spd, dt, 0.7);
        if (arrived || dist2D(this.pos.x, this.pos.z, spot.exit.x, spot.exit.z) < 1.0) {
          this.face(spot.x, spot.z, dt, 14);
          this.attackAnim = 1;
          g.pullOut(this, 30);
          this.knowsSpot = null;
          this.attackCd = 1.4;
          this.lastSeen.copy(p.pos);
          this.setState('chase');
        }
        break;
      }
      case 'bark': {
        const spot = this.knowsSpot;
        if (!spot || p.hidden !== spot) {
          this.knowsSpot = null;
          this.setState(p.alive && !p.hidden ? 'chase' : 'search');
          break;
        }
        const arrived = this.goTo(spot.exit.x, spot.exit.z, this.s.run, dt, 0.8);
        if (arrived) {
          this.face(spot.x, spot.z, dt, 10);
          if (this.shriekCd <= 0) {
            this.shriekCd = 3.5;
            this.doShriek(spot);
          }
        }
        break;
      }
      case 'fight':
        this.updateFight(dt);
        break;
      case 'stunned':
        this.setState('search');
        break;
      case 'bang':
        this.updateBang(dt);
        break;
    }
  }

  // Shut in behind a boarded door: batter the boards until they give.
  updateBang(dt) {
    const bd = this.game.level.boards;
    if (!bd || bd.broken || !this.trapped) {
      this.trapped = false;
      this.setState('search');
      return;
    }
    const tx = bd.x + bd.dx * 0.75;
    const tz = bd.z + bd.dy * 0.75;
    const d = dist2D(this.pos.x, this.pos.z, tx, tz);
    if (d > 1.2) {
      this.goTo(tx, tz, this.s.walk * 1.6 * this.mul.spd, dt, 0.9);
      if (this.stateT > 10 && this.speedNow < 0.05) this.stateT = 0;
      if (d > 2.2 || this.speedNow > 0.05) return;
    }
    this.speedNow = 0;
    this.face(bd.x, bd.z, dt, 8);
    if (this.attackCd <= 0) {
      this.windup += dt;
      this.attackAnim = Math.min(1, this.windup * 2.5);
      if (this.windup > 0.4) {
        this.windup = 0;
        this.attackCd = this.s.cd * (1.1 + Math.random() * 0.4);
        this.attackAnim = 1;
        this.game.level.damageBoards(this.s.bdmg * 0.6, this);
      }
    }
  }

  // ------------------------------------------------------------ raiders
  // The nearest living person this raider can see.
  raiderTarget() {
    const p = this.game.player;
    const comp = this.spotCompanion();
    const seesP = this.canSee();
    if (seesP && (!comp || this.dist() <= dist2D(this.pos.x, this.pos.z, comp.pos.x, comp.pos.z) + 2)) return p;
    return comp;
  }

  // Raiders hold their ground and shoot: they keep a fighting distance,
  // close in when they lose sight of you and back off when you rush them.
  updateRaider(dt) {
    const g = this.game;
    const tgt = this.raiderTarget();
    if (tgt) {
      this.lastSeen.copy(tgt.pos);
      this.lostT = 0;
      if (this.state !== 'shoot') {
        this.setState('shoot');
        this.aimT = 0;
        if (!g.anyHunting()) g.audio.stinger();
        if (g.time - (g.raiderShoutT ?? -99) > 8) {
          g.raiderShoutT = g.time;
          g.ui.message(RAIDER_SHOUTS[Math.floor(Math.random() * RAIDER_SHOUTS.length)], 'bad', 3);
        }
      }
    }
    switch (this.state) {
      case 'patrol': {
        if (!this.target || this.pauseT > 0) {
          this.pauseT -= dt;
          this.speedNow = 0;
          if (this.pauseT <= 0 && !this.target) this.pickPatrol();
          break;
        }
        const arrived = this.goTo(this.target.x, this.target.z, this.s.walk * this.mul.spd, dt, 0.8);
        if (arrived || this.unreachable > 2 || this.stateT > 40) {
          this.target = null;
          this.pauseT = 2 + Math.random() * 4;
          this.stateT = 0;
        }
        break;
      }
      case 'investigate': {
        const arrived = this.goTo(this.target.x, this.target.z, this.s.walk * 1.8, dt, 1.0);
        if (arrived || this.unreachable > 2 || this.stateT > 25) this.setState('search');
        break;
      }
      case 'search': {
        this.speedNow = 0;
        this.yaw += Math.sin(this.stateT * 1.8) * dt * 1.8;
        if (this.stateT > 4) {
          this.setState('patrol');
          this.target = null;
        }
        break;
      }
      case 'shoot': {
        if (!tgt) {
          this.aimT = 0;
          this.lostT += dt;
          const arrived = this.goTo(this.lastSeen.x, this.lastSeen.z, this.s.run * 0.7, dt, 1.0);
          if (arrived || this.lostT > 9) this.setState('search');
          break;
        }
        const d = dist2D(this.pos.x, this.pos.z, tgt.pos.x, tgt.pos.z);
        const nx = (tgt.pos.x - this.pos.x) / (d || 1);
        const nz = (tgt.pos.z - this.pos.z) / (d || 1);
        if (d > this.gun.range * 0.8) this.goTo(tgt.pos.x, tgt.pos.z, this.s.run * 0.8, dt, 2);
        else if (d < 4) this.stepToward(-nx, -nz, this.s.walk * dt, dt);
        else {
          // a little sidestep between shots
          const side = Math.sin(this.stateT * 0.9 + this.phase) > 0 ? 1 : -1;
          if (this.attackCd > 0.3) this.stepToward(nz * side, -nx * side, this.s.walk * 0.5 * dt, dt);
          else this.speedNow = 0;
        }
        this.yaw = dampAngle(this.yaw, Math.atan2(nx, nz), 10, dt);
        this.aimT += dt;
        if (this.aimT > 0.9 && this.attackCd <= 0) this.raiderFire(tgt, d);
        if (d < this.s.reach && this.attackCd <= 0) this.attack(dt, tgt);
        break;
      }
      case 'stunned':
        this.setState('search');
        break;
      default:
        this.setState('patrol');
    }
  }

  raiderFire(tgt, d) {
    const g = this.game;
    const gun = this.gun;
    this.attackCd = (1 / gun.rate) * (0.9 + Math.random() * 0.7);
    this.attackAnim = 0.5;
    let hit = Math.max(0.1, Math.min(0.48, 0.55 - d * 0.025));
    if (tgt === g.player) {
      if (tgt.running) hit *= 0.6;
      else if (tgt.moving) hit *= 0.78;
      if (tgt.crouch) hit *= 0.8;
    }
    const from = new THREE.Vector3();
    if (this.gunModel?.muzzle) this.gunModel.muzzle.getWorldPosition(from);
    else from.set(this.pos.x, 1.4, this.pos.z);
    const to = new THREE.Vector3(tgt.pos.x, 1.2, tgt.pos.z);
    const hitNow = Math.random() < hit && g.level.world.los(this.pos.x, this.pos.z, tgt.pos.x, tgt.pos.z);
    if (!hitNow) {
      to.x += (Math.random() - 0.5) * 2.4;
      to.y += (Math.random() - 0.3) * 1.2;
      to.z += (Math.random() - 0.5) * 2.4;
    } else tgt.damage(gun.dmg * this.mul.dmg, 'raider');
    g.combat.tracer(from, to, 0xffc080);
    g.particles.burst(from, 3, 0xffd080, 1.5, 0.4);
    g.audio.weaponFire(gun.def, this.pos);
    g.emitNoise(this.pos.x, this.pos.z, gun.def.noise || 24, 'gun');
  }

  // Lurkers lie still among the bodies until someone comes too close.
  updateLurker(dt) {
    const g = this.game;
    this.speedNow = 0;
    if (this.state === 'dormant') {
      const near = this.nearestHuman(3.2);
      if (near && g.level.world.los(this.pos.x, this.pos.z, near.pos.x, near.pos.z)) {
        this.foe = near === g.player ? null : near;
        this.wake();
      }
      return;
    }
    // rising
    const f = this.foe || g.player;
    this.face(f.pos.x, f.pos.z, dt, 6);
    if (this.stateT > 0.85) {
      this.lastSeen.copy(f.pos);
      this.attackCd = 0;
      this.setState('chase');
    }
  }

  chaseCompanion(dt) {
    const f = this.foe;
    const world = this.game.level.world;
    if (!f || !f.alive) {
      this.foe = null;
      this.setState('search');
      return;
    }
    const d = dist2D(this.pos.x, this.pos.z, f.pos.x, f.pos.z);
    const sees = world.los(this.pos.x, this.pos.z, f.pos.x, f.pos.z);
    if (sees) {
      this.lastSeen.copy(f.pos);
      this.lostT = 0;
    } else this.lostT += dt;
    // switch to the player if they're closer and visible
    if (this.canSee() && this.dist() + 1.5 < d) {
      this.foe = null;
      return;
    }
    if (d < this.s.reach * 0.78 && sees) {
      this.face(f.pos.x, f.pos.z, dt, 14);
      this.speedNow = 0;
      this.attack(dt, f);
    } else {
      this.windup = 0;
      const tgt = sees ? f.pos : this.lastSeen;
      const arrived = this.goTo(tgt.x, tgt.z, this.s.run * this.mul.spd, dt, 0.5);
      if ((!sees && arrived) || this.lostT > 6) {
        this.foe = null;
        this.setState('search');
      }
    }
  }

  attack(dt, target) {
    const g = this.game;
    if (this.attackCd > 0) return;
    this.windup += dt;
    this.attackAnim = Math.min(1, this.windup * 3);
    const wind = this.type === 'hound' ? 0.2 : this.type === 'brute' ? 0.55 : 0.35;
    if (this.windup >= wind) {
      this.windup = 0;
      this.attackCd = this.s.cd;
      this.attackAnim = 1;
      g.audio.swipe(this.pos);
      let t = target;
      if (!t || !t.alive || (t.hidden ?? false) || dist2D(this.pos.x, this.pos.z, t.pos.x, t.pos.z) > this.s.reach) t = this.nearestHuman(this.s.reach);
      if (t) {
        t.damage(this.s.dmg * this.mul.dmg, this.type);
        if (this.type === 'hound') this.jaw = 1;
      }
    }
  }

  // Blind Brute: hunts by sound and touch.
  updateBrute(dt) {
    const g = this.game;
    const p = g.player;
    const d = this.dist();
    const exposed = p.alive && !p.hidden;
    if (exposed && d < 2.6 && (p.moving || d < 1.8) && this.state !== 'fight') {
      if (this.state !== 'charge') g.audio.growl('brute', this.pos, 1.2);
      if (this.state !== 'charge') this.setState('charge');
      this.target = p.pos.clone();
      this.lastHeard = g.time;
    }
    if (this.enraged > 0 && exposed && this.state !== 'fight' && this.state !== 'charge') {
      this.setState('charge');
      this.target = p.pos.clone();
      this.lastHeard = g.time;
    }
    switch (this.state) {
      case 'patrol': {
        if (!this.target || this.pauseT > 0) {
          this.pauseT -= dt;
          this.speedNow = 0;
          if (this.pauseT <= 0 && !this.target) this.pickPatrol();
          break;
        }
        const arrived = this.goTo(this.target.x, this.target.z, this.s.walk, dt, 0.9);
        if (arrived || this.unreachable > 2 || this.stateT > 45) {
          this.target = null;
          this.pauseT = 2 + Math.random() * 3;
          this.stateT = 0;
        }
        break;
      }
      case 'investigate': {
        const arrived = this.goTo(this.target.x, this.target.z, 3.0, dt, 1.0);
        if (arrived || this.unreachable > 2 || this.stateT > 25) this.setState('search');
        break;
      }
      case 'charge': {
        const near = this.nearestHuman(2.0);
        if (near) {
          this.face(near.pos.x, near.pos.z, dt, 10);
          this.speedNow = 0;
          this.attack(dt, near);
          break;
        }
        this.windup = 0;
        if (p.hidden && this.knowsSpot === p.hidden) {
          this.setState('pullout');
          break;
        }
        const spd = this.enraged > 0 ? this.s.run * 1.12 : this.s.run;
        const arrived = this.goTo(this.target.x, this.target.z, spd, dt, 1.0);
        if (arrived || this.unreachable > 2 || g.time - (this.lastHeard || 0) > 7) this.setState('search');
        break;
      }
      case 'search': {
        this.speedNow = 0;
        this.yaw += Math.sin(this.stateT * 1.5) * dt * 1.5;
        if (this.stateT > 4) {
          this.knowsSpot = null;
          this.setState('patrol');
          this.target = null;
        }
        break;
      }
      case 'pullout': {
        const spot = this.knowsSpot;
        if (!spot || p.hidden !== spot) {
          this.knowsSpot = null;
          this.setState('search');
          break;
        }
        const arrived = this.goTo(spot.exit.x, spot.exit.z, this.s.run, dt, 0.9);
        if (arrived || dist2D(this.pos.x, this.pos.z, spot.exit.x, spot.exit.z) < 1.2) {
          this.face(spot.x, spot.z, dt, 14);
          this.attackAnim = 1;
          g.pullOut(this, 40);
          this.knowsSpot = null;
          this.attackCd = 1.8;
          this.target = p.pos.clone();
          this.lastHeard = g.time;
          this.setState('charge');
        }
        break;
      }
      case 'fight':
        this.updateFight(dt);
        break;
      case 'stunned':
        this.setState('search');
        break;
    }
  }

  // Brute vs Grunt brawl.
  updateFight(dt) {
    const o = this.fightWith;
    if (!o || !o.alive) {
      this.fightWith = null;
      this.setState('search');
      return;
    }
    this.speedNow = 0;
    this.face(o.pos.x, o.pos.z, dt, 10);
    const d = dist2D(this.pos.x, this.pos.z, o.pos.x, o.pos.z);
    if (d > 2.2) {
      this.goTo(o.pos.x, o.pos.z, 2.5, dt, 1.6);
      return;
    }
    if (this.attackCd <= 0) {
      const brute = this.type === 'brute';
      this.attackCd = brute ? 1.35 : 0.85;
      this.attackAnim = 1;
      this.game.audio.swipe(this.pos);
      let dmg = brute ? 30 + Math.random() * 10 : 9 + Math.random() * 6;
      if (!brute && Math.random() < 0.08) dmg *= 4;
      o.hp -= dmg;
      o.flinch = 1;
      this.game.audio.flesh(o.pos);
      if (o.hp <= 0) o.die(null, {});
    }
    if (this.stateT > 1.5 && Math.random() < dt * 0.7) {
      this.game.emitNoise(this.pos.x, this.pos.z, 16, 'fight');
      this.game.audio.growl(this.voice, this.pos, 1.1);
    }
  }

  fadeOut(t) {
    if (!this.fadeMats) {
      // give this body its own transparent copies of its materials
      this.fadeMats = [];
      this.root.traverse((o) => {
        if (!o.isMesh) return;
        const list = Array.isArray(o.material) ? o.material : [o.material];
        const copies = list.map((m) => {
          const c = m.clone();
          c.transparent = true;
          c.depthWrite = false;
          this.fadeMats.push(c);
          return c;
        });
        o.material = Array.isArray(o.material) ? copies : copies[0];
        o.castShadow = false;
      });
    }
    for (const m of this.fadeMats) m.opacity = 1 - t;
    this.root.position.y -= t * 0.35;
    if (t >= 1) {
      this.root.visible = false;
      for (const m of this.fadeMats) m.dispose();
      this.fadeMats = [];
      this.gone = true;
    }
  }

  // ------------------------------------------------------------ animation
  syncModel(dt) {
    const m = this.model;
    this.root.position.x = this.pos.x;
    this.root.position.z = this.pos.z;
    this.root.position.y = 0;
    this.root.rotation.y = this.yaw;
    if (this.state === 'dormant' || this.state === 'rise') {
      const e = this.state === 'dormant' ? 1 : Math.max(0, 1 - this.stateT / 0.85) ** 2;
      this.root.rotation.order = 'YXZ';
      this.root.rotation.x = -e * 1.45;
      this.root.position.y = e * 0.12;
      m.jaw.rotation.x = this.state === 'rise' ? 0.5 : 0.3;
      for (const arm of m.arms) arm.sh.rotation.x = -1.2 * e - (1 - e) * 1.0;
      return;
    }
    this.root.rotation.x = 0;
    if (this.state === 'dead') {
      const t = Math.min(1, this.deadT / 0.7);
      const e = t * t;
      this.root.rotation.order = 'YXZ';
      if (m.quad) this.root.rotation.z = e * 1.45;
      else if (m.crawl) this.root.rotation.z = e * 0.6;
      else this.root.rotation.x = -e * 1.45;
      this.root.position.y = e * 0.12;
      m.jaw.rotation.x = 0.4;
      for (const arm of m.arms) arm.sh.rotation.x = -1.2 * e;
      return;
    }
    const spd = this.speedNow;
    const k = this.type === 'hound' ? 2.8 : this.type === 'brute' ? 1.9 : 2.3;
    this.phase += dt * Math.max(spd, 0.0) * k;
    const amp = Math.min(1, spd / 3) * (this.type === 'hound' ? 0.8 : 0.65);
    const s = Math.sin(this.phase);
    for (const leg of m.legs) {
      if (m.quad) {
        leg.hip.rotation.x = Math.sin(this.phase * 1.6 + (leg.s > 0 ? 0 : Math.PI)) * amp;
        leg.knee.rotation.x = Math.max(0, -Math.sin(this.phase * 1.6 + (leg.s > 0 ? 0 : Math.PI))) * amp * 0.9;
      } else {
        leg.hip.rotation.x = s * amp * leg.s;
        leg.knee.rotation.x = Math.max(0, s * leg.s) * amp * 1.1;
      }
    }
    const atk = this.attackAnim;
    const reaching = this.mode === 'wave' || this.state === 'chase';
    if (this.type === 'raider') {
      // gun up when fighting, at the hip otherwise
      const aiming = this.state === 'shoot';
      for (const arm of m.arms) {
        const gunArm = arm.fore.children.includes(m.gunMount);
        if (aiming) {
          arm.sh.rotation.x = -1.45 + atk * 0.25;
          arm.sh.rotation.z = gunArm ? 0.05 : -arm.s * 0.5;
          arm.fore.rotation.x = gunArm ? 0 : -0.3;
        } else {
          arm.sh.rotation.x = -Math.sin(this.phase) * Math.min(1, spd / 3) * 0.4 * arm.s - (gunArm ? 0.35 : 0);
          arm.sh.rotation.z = arm.s * 0.06;
          arm.fore.rotation.x = -0.2 - (gunArm ? 0.5 : 0);
        }
      }
      m.torso.rotation.x = m.baseLean + this.flinch * -0.3;
      m.hips.position.y = m.hipY + Math.abs(Math.sin(this.phase)) * 0.03;
      m.head.rotation.z = 0;
      return;
    }
    for (const arm of m.arms) {
      if (m.crawl) {
        arm.sh.rotation.x = -2.4 + Math.sin(this.phase * 2 + (arm.s > 0 ? 0 : Math.PI)) * 0.6 - atk * 0.4;
        arm.fore.rotation.x = -0.4;
        continue;
      }
      const swing = -s * amp * 0.6 * arm.s;
      arm.sh.rotation.x = swing - atk * 2.2 - (reaching ? (this.type === 'walker' || this.type === 'rotter' ? 1.3 : 0.5) : 0);
      arm.sh.rotation.z = arm.s * (0.08 + atk * 0.25);
      arm.fore.rotation.x = -0.25 - atk * 0.6;
    }
    const t = this.game.time;
    const lean = m.baseLean + (spd > 3.5 ? 0.15 : 0) + this.flinch * -0.3;
    m.torso.rotation.x = lean + Math.sin(t * 1.7 + this.phase) * 0.03;
    m.hips.position.y = m.hipY + (m.crawl ? 0 : Math.abs(Math.sin(this.phase)) * 0.04);
    if (Math.random() < 0.01) this.twitch = 0.25;
    this.twitch = Math.max(0, (this.twitch || 0) - dt);
    m.head.rotation.z = this.twitch > 0 ? Math.sin(t * 60) * 0.25 : Math.sin(t * 0.7) * 0.08;
    m.jaw.rotation.x = Math.max(this.jaw, atk * 0.5) * 0.6;
    if (m.tail) m.tail.rotation.y = Math.sin(t * 9) * 0.4;
    if (m.quad) m.head.rotation.x = -this.jaw * 0.5;
    if (m.spit) m.spit.scale.setScalar(1 + Math.max(0, 1 - this.spitCd) * 0.35 + Math.sin(t * 3) * 0.04);
  }

  dispose() {}
}
