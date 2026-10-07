// Monster AI: Grunt, Angel, Blind Brute and Blood Hound.
import * as THREE from 'three';
import { makeGrunt, makeBrute, makeHound, makeAngel, setAngelPose } from './models.js';
import { dampAngle, angleDiff, dist2D } from './util.js';

const STATS = {
  grunt: { hp: 90, radius: 0.42, walk: 2.0, run: 5.55, sight: 1.0, fov: 2.1, stride: 1.4, gold: 18 },
  hound: { hp: 30, radius: 0.32, walk: 2.6, run: 5.9, sight: 1.25, fov: 2.4, stride: 0.55, gold: 12 },
  brute: { hp: 420, radius: 0.75, walk: 1.6, run: 4.9, sight: 0, fov: 0, stride: 2.1, gold: 90 },
  angel: { hp: Infinity, radius: 0.4, walk: 0, run: 11.5, sight: 0, fov: 0, stride: 0, gold: 0 },
};

const tmpV = new THREE.Vector3();

export class Enemy {
  constructor(game, type, x, z) {
    this.game = game;
    this.type = type;
    const s = STATS[type];
    this.s = s;
    this.hp = s.hp;
    this.maxHp = s.hp;
    this.radius = s.radius;
    this.pos = new THREE.Vector3(x, 0, z);
    this.yaw = Math.random() * Math.PI * 2;
    this.model =
      type === 'grunt' ? makeGrunt() : type === 'brute' ? makeBrute() : type === 'hound' ? makeHound() : makeAngel();
    this.root = this.model.root;
    this.root.traverse((o) => {
      if (o.isMesh) o.userData.enemy = this;
    });
    game.level.group.add(this.root);
    this.state = 'patrol';
    this.stateT = 0;
    this.path = null;
    this.pathI = 0;
    this.pathGoal = null;
    this.repath = 0;
    this.target = null;
    this.lastSeen = new THREE.Vector3(x, 0, z);
    this.lostT = 0;
    this.attackCd = 0;
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
    this.fightWith = null;
    this.deadT = 0;
    this.pauseT = 0;
    this.jaw = 0;
    this.awake = false;
    this.observed = false;
    this.wasMoving = false;
    this.movedRecently = 0;
    this.grind = null;
    this.flinch = 0;
    if (type === 'angel') {
      this.pose = Math.floor(Math.random() * 2);
      setAngelPose(this.model, this.pose);
    }
    this.syncModel(0);
  }

  get alive() {
    return this.state !== 'dead';
  }

  // Is this monster actively hunting the player (drives chase music)?
  get hunting() {
    if (!this.alive || this.stun > 0) return false;
    if (this.type === 'angel') return this.awake && this.movedRecently > 0;
    return ['chase', 'alert', 'pullout', 'shriek', 'charge', 'bark'].includes(this.state) || this.enraged > 0;
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
    if (!p.alive || p.inSafe) return false;
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

  hear(n) {
    if (!this.alive || this.stun > 0 || this.type === 'angel') return;
    if (this.state === 'fight') return;
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
    if (['chase', 'alert', 'shriek', 'pullout', 'bark'].includes(this.state)) return;
    this.setState('investigate');
    this.target = new THREE.Vector3(n.x, 0, n.z);
  }

  // Alerted by a hound's shriek. spot = hiding spot the hound has found.
  alerted(x, z, spot) {
    if (!this.alive || this.type === 'angel' || this.stun > 0 || this.state === 'fight') return;
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
    // string pulling: skip waypoints we can walk straight to
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
    const step = Math.min(speed * dt, d);
    const ox = this.pos.x;
    const oz = this.pos.z;
    this.pos.x += (dx / d) * step;
    this.pos.z += (dz / d) * step;
    world.collide(this.pos, this.radius, true);
    const moved = Math.hypot(this.pos.x - ox, this.pos.z - oz);
    this.speedNow = moved / Math.max(dt, 1e-4);
    this.yaw = dampAngle(this.yaw, Math.atan2(dx, dz), this.type === 'angel' ? 30 : 8, dt);
    this.stepDist += moved;
    return false;
  }

  face(x, z, dt, rate = 8) {
    this.yaw = dampAngle(this.yaw, Math.atan2(x - this.pos.x, z - this.pos.z), rate, dt);
  }

  pickPatrol() {
    const lvl = this.game.level;
    const rooms = lvl.d.rooms;
    // prefer rooms not too far away so monsters roam their region
    for (let a = 0; a < 8; a++) {
      const r = rooms[1 + Math.floor(Math.random() * (rooms.length - 1))];
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
  hit(dmg) {
    if (!this.alive) return;
    if (this.type === 'angel') return;
    this.hp -= dmg;
    this.flinch = 1;
    const g = this.game;
    g.audio.flesh(this.pos);
    if (this.hp <= 0) {
      this.die();
      return;
    }
    if (this.type === 'brute') {
      // Enraged: it knows exactly where the shot came from and charges.
      this.enraged = 6;
      g.audio.growl('brute', this.pos, 1.3);
      this.setState('charge');
      this.target = g.player.pos.clone();
    } else if (this.state !== 'fight' && this.stun <= 0) {
      this.lastSeen.copy(g.player.pos);
      if (this.type === 'hound' && this.state !== 'chase') this.startShriek();
      else if (this.state !== 'chase') {
        this.setState('chase');
        g.audio.growl(this.type, this.pos);
      }
    }
  }

  die() {
    const g = this.game;
    this.state = 'dead';
    this.deadT = 0;
    this.speedNow = 0;
    g.audio.monsterDeath(this.type, this.pos);
    g.player.stats.kills++;
    if (this.fightWith && this.fightWith.fightWith === this) {
      this.fightWith.fightWith = null;
      this.fightWith.setState('search');
    }
    if (this.s.gold) g.level.addGold(this.pos.x, this.pos.z, this.s.gold + g.levelNum * 3);
    this.grind?.stop();
    this.grind = null;
  }

  trap(seconds, dmg) {
    if (this.type === 'angel' || !this.alive) return false;
    this.stun = seconds;
    this.hit(dmg);
    if (this.alive) {
      this.game.audio.growl(this.type, this.pos, 1.2);
      this.setState('stunned');
    }
    return true;
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
    this.movedRecently = Math.max(0, this.movedRecently - dt);
    const g = this.game;
    const p = g.player;

    if (this.state === 'dead') {
      this.deadT += dt;
      this.syncModel(dt);
      return;
    }

    if (this.stun > 0) {
      this.stun -= dt;
      this.speedNow = 0;
      if (this.stun <= 0) {
        this.setState('investigate');
        this.target = p.pos.clone();
      }
      this.syncModel(dt);
      return;
    }

    if (this.type === 'angel') this.updateAngel(dt);
    else if (this.type === 'brute') this.updateBrute(dt);
    else this.updateSighted(dt);

    // footsteps
    const strideLen = this.s.stride;
    if (strideLen && this.stepDist > strideLen) {
      this.stepDist = 0;
      if (this.dist() < 32) g.audio.monsterStep(this.type, this.pos);
    }
    // idle vocalisations
    if (this.vocalCd <= 0 && this.type !== 'angel') {
      this.vocalCd = 5 + Math.random() * 9;
      if (this.dist() < 28) g.audio.growl(this.type, this.pos, this.hunting ? 1 : 0.55);
    }
    this.syncModel(dt);
  }

  // Grunt & Blood Hound: hunt by sight.
  updateSighted(dt) {
    const g = this.game;
    const p = g.player;
    const isHound = this.type === 'hound';
    const sees = this.canSee();
    const d = this.dist();

    if (sees && ['patrol', 'investigate', 'search'].includes(this.state)) {
      this.lastSeen.copy(p.pos);
      if (isHound) this.startShriek();
      else {
        this.setState('alert');
        g.audio.growl('grunt', this.pos, 1.2);
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
        const arrived = this.goTo(this.target.x, this.target.z, this.s.walk, dt, 0.8);
        if (arrived || this.unreachable > 2 || this.stateT > 40) {
          this.target = null;
          this.pauseT = 1 + Math.random() * 3;
          this.stateT = 0;
        }
        break;
      }
      case 'alert': {
        // brief roar before giving chase
        this.speedNow = 0;
        this.face(p.pos.x, p.pos.z, dt, 12);
        this.attackAnim = 0.4;
        if (this.stateT > 0.45) this.setState('chase');
        break;
      }
      case 'shriek': {
        this.speedNow = 0;
        this.face(p.pos.x, p.pos.z, dt, 12);
        if (this.stateT < dt * 1.5) this.doShriek(null);
        if (this.stateT > 0.9) this.setState('chase');
        break;
      }
      case 'chase': {
        if (p.inSafe || !p.alive) {
          this.setState('search');
          break;
        }
        if (p.hidden) {
          if (this.knowsSpot === p.hidden) {
            this.setState(isHound ? 'bark' : 'pullout');
          } else {
            // lost them: go where we last saw them, then look around
            this.setState('investigate');
            this.target = this.lastSeen.clone();
            this.alertRun = true;
          }
          break;
        }
        if (sees) {
          this.lastSeen.copy(p.pos);
          this.lostT = 0;
        } else this.lostT += dt;
        if (isHound && sees && this.shriekCd <= 0) {
          this.shriekCd = 8;
          this.doShriek(null);
        }
        const range = isHound ? 1.25 : 1.55;
        if (d < range && sees) {
          this.face(p.pos.x, p.pos.z, dt, 14);
          this.speedNow = 0;
          this.attack(dt);
        } else {
          this.windup = 0;
          const tgt = sees ? p.pos : this.lastSeen;
          const arrived = this.goTo(tgt.x, tgt.z, this.s.run, dt, 0.5);
          if ((!sees && arrived) || this.lostT > 6) this.setState('search');
        }
        break;
      }
      case 'investigate': {
        const spd = this.alertRun ? this.s.run * 0.85 : this.s.walk * 1.5;
        const arrived = this.goTo(this.target.x, this.target.z, spd, dt, 1.0);
        if (arrived || this.unreachable > 2 || this.stateT > 25) {
          this.alertRun = false;
          this.setState('search');
        }
        break;
      }
      case 'search': {
        // stand and look around, then move on
        this.speedNow = 0;
        this.yaw += Math.sin(this.stateT * 2.2) * dt * 2.2;
        if (this.stateT > 3.5 + Math.random() * 0.02) {
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
          if (p.alive && !p.inSafe && !p.hidden) {
            this.lastSeen.copy(p.pos);
            this.setState('chase');
          } else this.setState('search');
          break;
        }
        const arrived = this.goTo(spot.exit.x, spot.exit.z, this.s.run, dt, 0.7);
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
        // hound found the hiding spot: stand at it and keep screaming
        const spot = this.knowsSpot;
        if (!spot || p.hidden !== spot) {
          this.knowsSpot = null;
          this.setState(p.alive && !p.inSafe && !p.hidden ? 'chase' : 'search');
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
    }
  }

  attack(dt) {
    const g = this.game;
    const p = g.player;
    if (this.attackCd > 0) return;
    this.windup += dt;
    this.attackAnim = Math.min(1, this.windup * 3);
    const wind = this.type === 'hound' ? 0.2 : this.type === 'brute' ? 0.55 : 0.35;
    if (this.windup >= wind) {
      this.windup = 0;
      this.attackCd = this.type === 'hound' ? 0.75 : this.type === 'brute' ? 1.7 : 1.1;
      this.attackAnim = 1;
      g.audio.swipe(this.pos);
      const reach = this.type === 'brute' ? 2.4 : this.type === 'hound' ? 1.6 : 2.0;
      if (this.dist() < reach && !p.hidden && p.alive) {
        const dmg = this.type === 'hound' ? 9 : this.type === 'brute' ? 42 : 20;
        p.damage(dmg, this.type);
        if (this.type === 'hound') this.jaw = 1;
      }
    }
  }

  // Blind Brute: hunts by sound and touch.
  updateBrute(dt) {
    const g = this.game;
    const p = g.player;
    const d = this.dist();
    const exposed = p.alive && !p.hidden && !p.inSafe;
    // can feel / smell the player at very close range
    if (exposed && d < 2.6 && (p.moving || d < 1.8) && this.state !== 'fight') {
      if (this.state !== 'charge') g.audio.growl('brute', this.pos, 1.2);
      if (this.state !== 'charge') this.setState('charge');
      this.target = p.pos.clone();
      this.lastHeard = g.time;
    }
    if (this.enraged > 0 && exposed && this.state !== 'fight') {
      if (this.state !== 'charge') this.setState('charge');
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
        if (p.inSafe) {
          this.setState('search');
          break;
        }
        if (exposed && d < 2.0) {
          this.face(p.pos.x, p.pos.z, dt, 10);
          this.speedNow = 0;
          this.attack(dt);
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
      if (!brute && Math.random() < 0.08) dmg *= 4; // a lucky grunt can land a vicious blow
      o.hp -= dmg;
      o.flinch = 1;
      this.game.audio.flesh(o.pos);
      if (o.hp <= 0) o.die();
    }
    if (this.stateT > 1.5 && Math.random() < dt * 0.7) {
      this.game.emitNoise(this.pos.x, this.pos.z, 16, 'fight');
      this.game.audio.growl(this.type, this.pos, 1.1);
    }
  }

  // Angel: moves only while unobserved.
  updateAngel(dt) {
    const g = this.game;
    const p = g.player;
    const d = this.dist();
    const world = g.level.world;
    const exposed = p.alive && !p.hidden && !p.inSafe;
    this.observed = g.isObserved(this);
    if (!this.awake) {
      if (exposed && d < 24 && world.los(this.pos.x, this.pos.z, p.pos.x, p.pos.z)) this.awake = true;
    } else if (d > 42 || !p.alive) this.awake = false;

    const shouldMove = this.awake && exposed && !this.observed;
    if (!shouldMove) {
      if (this.wasMoving && this.observed) {
        // snapped into a new pose the instant you look
        this.pose = d < 10 ? 2 + Math.floor(Math.random() * 2) : Math.floor(Math.random() * 3);
        setAngelPose(this.model, this.pose);
      }
      this.wasMoving = false;
      this.speedNow = 0;
      this.grind?.set(this.pos, 0);
      return;
    }
    if (!this.wasMoving) {
      this.pose = d < 10 ? 2 + Math.floor(Math.random() * 2) : Math.floor(Math.random() * 2);
      setAngelPose(this.model, this.pose);
    }
    this.wasMoving = true;
    this.movedRecently = 2.5;
    if (!this.grind && g.audio.ctx) this.grind = g.audio.loop(240, 2.5);
    this.grind?.set(this.pos, 1.0);
    if (d < 1.15) {
      g.killPlayer('angel', this);
      return;
    }
    this.goTo(p.pos.x, p.pos.z, this.s.run, dt, 0.9);
    this.yaw = Math.atan2(p.pos.x - this.pos.x, p.pos.z - this.pos.z);
  }

  // ------------------------------------------------------------ animation
  syncModel(dt) {
    const m = this.model;
    this.root.position.set(this.pos.x, 0, this.pos.z);
    this.root.rotation.y = this.yaw;
    if (this.type === 'angel') return;
    if (this.state === 'dead') {
      const t = Math.min(1, this.deadT / 0.7);
      const e = t * t;
      this.root.rotation.order = 'YXZ';
      if (m.quad) this.root.rotation.z = e * 1.45;
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
    for (const arm of m.arms) {
      const swing = -s * amp * 0.6 * arm.s;
      arm.sh.rotation.x = swing - atk * 2.2 - (this.state === 'chase' ? 0.5 : 0);
      arm.sh.rotation.z = arm.s * (0.08 + atk * 0.25);
      arm.fore.rotation.x = -0.25 - atk * 0.6;
    }
    // breathing, lean and nervous twitching
    const t = this.game.time;
    const lean = m.baseLean + (spd > 3.5 ? 0.15 : 0) + this.flinch * -0.3;
    m.torso.rotation.x = lean + Math.sin(t * 1.7 + this.phase) * 0.03;
    m.hips.position.y = (m.quad ? 0.5 : m.height === 2.8 ? 1.3 : 0.95) + Math.abs(Math.sin(this.phase)) * 0.04;
    if (this.type === 'grunt' && Math.random() < 0.01) this.twitch = 0.25;
    this.twitch = Math.max(0, (this.twitch || 0) - dt);
    m.head.rotation.z = this.twitch > 0 ? Math.sin(t * 60) * 0.25 : Math.sin(t * 0.7) * 0.08;
    m.jaw.rotation.x = Math.max(this.jaw, atk * 0.5) * 0.6;
    if (m.tail) m.tail.rotation.y = Math.sin(t * 9) * 0.4;
    if (m.quad) m.head.rotation.x = -this.jaw * 0.5;
  }

  dispose() {
    this.grind?.stop();
    this.grind = null;
  }
}

export { tmpV };
