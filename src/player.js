// First-person player: movement, stamina, hiding, weapons and med kits.
// Health, level and inventory live in the run state so they persist.
import * as THREE from 'three';
import { PLAYER, NOISE, TILE, WALL_H, PIT_DEPTH, T } from './config.js';
import { clamp, damp, angleDiff } from './util.js';
import { WEAPONS, weaponStats, AMMO } from './weapons.js';
import { weaponByUid, playerMaxHp, playerMaxStamina, playerSpeedMul } from './run.js';

const HIDE_CAM = {
  locker: { y: 1.5, fwd: -0.02, yawLim: 0.55, pitchMin: -0.35, pitchMax: 0.25 },
  closet: { y: 1.55, fwd: 0.0, yawLim: 0.6, pitchMin: -0.35, pitchMax: 0.25 },
  bed: { y: 0.2, fwd: 0.3, yawLim: 0.8, pitchMin: -0.15, pitchMax: 0.12 },
  bench: { y: 0.2, fwd: 0.05, yawLim: 0.8, pitchMin: -0.15, pitchMax: 0.15 },
};

const FISTS = { id: 'fists', name: 'Fists', cat: 'melee', dmg: 10, rate: 1.6, range: 1.6, arc: 1.0, stam: 6, sound: 'melee', look: {} };

export class Player {
  constructor(game) {
    this.game = game;
    this.pos = new THREE.Vector3();
    this.vel = new THREE.Vector3();
    this.yaw = 0;
    this.pitch = 0;
    this.radius = PLAYER.radius;
    this.flashlight = true;
    this.slot = 0;
    this.resetTransient();
  }

  get run() {
    return this.game.run;
  }
  get level() {
    return this.run.player.level;
  }
  get health() {
    return this.run.player.hp;
  }
  set health(v) {
    this.run.player.hp = v;
  }
  get maxHealth() {
    return playerMaxHp(this.level);
  }
  get maxStamina() {
    return playerMaxStamina(this.level);
  }
  get speedMul() {
    return playerSpeedMul(this.level);
  }

  resetTransient() {
    this.stamina = this.maxStamina || PLAYER.baseStamina;
    this.exhausted = false;
    this.staminaDelay = 0;
    this.velY = 0;
    this.onGround = true;
    this.crouch = false;
    this.eyeH = PLAYER.eye;
    this.hidden = null;
    this.hideT = 0;
    this.trapped = 0;
    this.inPit = 0;
    this.alive = true;
    this.invuln = 0;
    this.stepDist = 0;
    this.bob = 0;
    this.shake = 0;
    this.running = false;
    this.moving = false;
    this.reloading = 0;
    this.reloadTotal = 1;
    this.fireCd = 0;
    this.recoil = 0;
    this.swing = 0;
    this.pendingSwing = 0;
    this.spin = 0;
    this.switchT = 0;
    this.lastSafe = new THREE.Vector3();
    this.breathCd = 0;
    this.deathT = 0;
  }

  spawn(sp) {
    this.pos.set(sp.x, 0, sp.z);
    this.vel.set(0, 0, 0);
    this.yaw = sp.yaw;
    this.pitch = 0;
    this.lastSafe.copy(this.pos);
  }

  get eye() {
    return this.pos.y + this.eyeH;
  }

  visibility() {
    let r = this.flashlight ? 22 : 10;
    if (this.crouch) r *= 0.6;
    if (this.running) r *= 1.15;
    return r;
  }

  forward(out = new THREE.Vector3()) {
    return out.set(-Math.sin(this.yaw) * Math.cos(this.pitch), Math.sin(this.pitch), -Math.cos(this.yaw) * Math.cos(this.pitch));
  }
  // facing angle in the atan2(dx, dz) convention the AI uses
  get facing() {
    return Math.atan2(-Math.sin(this.yaw), -Math.cos(this.yaw));
  }

  // ------------------------------------------------------------ weapons
  slotUid(slot = this.slot) {
    const lo = this.run.loadout;
    return slot === 0 ? lo.primary : lo.secondary;
  }
  weapon() {
    const uid = this.slotUid();
    return uid != null ? weaponByUid(this.run, uid) : null;
  }
  weaponDef() {
    const w = this.weapon();
    return w ? WEAPONS[w.id] : FISTS;
  }
  weaponStats() {
    const w = this.weapon();
    if (!w) return { def: FISTS, mag: 0, dmg: FISTS.dmg * (1 + 0.02 * (this.level - 1)), rate: FISTS.rate, range: FISTS.range, spread: 0, reload: 0, pellets: 1, pierce: 0, splash: 0 };
    return weaponStats(w, this.level);
  }

  switchTo(slot) {
    if (slot === this.slot && this.switchT <= 0) return;
    this.slot = slot;
    this.reloading = 0;
    this.spin = 0;
    this.switchT = 0.35;
    this.game.refreshViewModel();
    this.game.audio.click(0.4);
  }

  // ------------------------------------------------------------ update
  update(dt, input) {
    const game = this.game;
    const world = game.level.world;
    this.invuln = Math.max(0, this.invuln - dt);
    this.fireCd = Math.max(0, this.fireCd - dt);
    this.switchT = Math.max(0, this.switchT - dt);
    this.recoil = damp(this.recoil, 0, 10, dt);
    this.swing = Math.max(0, this.swing - dt * 3.2);
    this.shake = Math.max(0, this.shake - dt * 2.5);

    const sens = 0.0022 * input.sensitivity;
    this.yaw -= input.mouseDX * sens;
    this.pitch -= input.mouseDY * sens;
    // how fast the view is turning, for weapon sway (rad/s)
    this.turnX = dt > 0 ? (input.mouseDX * sens) / dt : 0;
    this.turnY = dt > 0 ? (input.mouseDY * sens) / dt : 0;
    this.pitch = clamp(this.pitch, -1.45, 1.45);

    if (!this.alive) return;
    if (this.hidden) {
      this.updateHidden(dt, input);
      return;
    }

    // reload in progress
    if (this.reloading > 0) {
      this.reloading -= dt;
      if (this.reloading <= 0) this.finishReload();
    }

    if (input.wasPressed('KeyC') || input.wasPressed('ControlLeft')) this.crouch = !this.crouch;

    let mx = 0;
    let mz = 0;
    if (input.down('KeyW') || input.down('ArrowUp')) mz -= 1;
    if (input.down('KeyS') || input.down('ArrowDown')) mz += 1;
    if (input.down('KeyA') || input.down('ArrowLeft')) mx -= 1;
    if (input.down('KeyD') || input.down('ArrowRight')) mx += 1;
    // the touch stick is analog: a light push walks slowly
    let analog = 1;
    if (input.stick) {
      mx = input.moveX;
      mz = input.moveY;
      analog = Math.max(0.3, Math.min(1, Math.hypot(mx, mz)));
    }
    const len = Math.hypot(mx, mz);
    if (len > 0) {
      mx /= len;
      mz /= len;
    }
    this.moving = len > 0;
    const wantRun = (input.down('ShiftLeft') || input.down('ShiftRight')) && this.moving && mz <= 0.2;
    if (wantRun && this.crouch) this.crouch = false;
    this.running = wantRun && !this.exhausted && this.stamina > 0 && this.trapped <= 0;

    if (this.running) {
      this.stamina -= PLAYER.runDrain * dt;
      this.staminaDelay = 0.9;
      if (this.stamina <= 0) {
        this.stamina = 0;
        this.exhausted = true;
      }
    } else {
      this.staminaDelay -= dt;
      if (this.staminaDelay <= 0) this.stamina = Math.min(this.maxStamina, this.stamina + (PLAYER.staminaRegen + (this.level - 1) * 0.8) * dt);
      if (this.exhausted && this.stamina > this.maxStamina * 0.3) this.exhausted = false;
    }
    this.breathCd -= dt;
    if (this.exhausted && this.breathCd <= 0) {
      game.audio.breath(0.7);
      this.breathCd = 1.4;
    }

    let speed = this.crouch ? PLAYER.crouch : this.running ? PLAYER.run : PLAYER.walk;
    speed *= this.speedMul * (this.running ? 1 : analog);
    const wdef = this.weaponDef();
    if (wdef.cat === 'lmg' || wdef.cat === 'launcher') speed *= 0.88;
    if (this.trapped > 0) {
      this.trapped -= dt;
      speed = 0;
    }
    if (this.inPit > 0) speed = 0;
    const sy = Math.sin(this.yaw);
    const cy = Math.cos(this.yaw);
    const tx = (mx * cy + mz * sy) * speed;
    const tz = (-mx * sy + mz * cy) * speed;
    const accel = this.onGround ? 12 : 2.5;
    this.vel.x = damp(this.vel.x, tx, accel, dt);
    this.vel.z = damp(this.vel.z, tz, accel, dt);

    if (input.wasPressed('Space') && this.onGround && this.trapped <= 0 && this.inPit <= 0 && this.stamina >= PLAYER.jumpCost * 0.5) {
      this.velY = PLAYER.jumpV;
      this.onGround = false;
      this.stamina = Math.max(0, this.stamina - PLAYER.jumpCost);
      this.staminaDelay = 0.9;
      this.crouch = false;
      game.audio.jump();
    }

    const ox = this.pos.x;
    const oz = this.pos.z;
    this.pos.x += this.vel.x * dt;
    this.pos.z += this.vel.z * dt;
    if (this.pos.y > -0.2) world.collide(this.pos, PLAYER.radius, false);
    else {
      this.pos.x = ox;
      this.pos.z = oz;
    }

    const ground = this.groundAt(this.pos.x, this.pos.z);
    this.velY -= PLAYER.gravity * dt;
    this.pos.y += this.velY * dt;
    if (!world.isOpenSky(this.pos.x, this.pos.z) && this.pos.y + this.eyeH > WALL_H - 0.15) {
      this.pos.y = WALL_H - 0.15 - this.eyeH;
      this.velY = Math.min(0, this.velY);
    }
    if (this.pos.y <= ground) {
      const impact = this.velY;
      this.pos.y = ground;
      this.velY = 0;
      if (!this.onGround) {
        this.onGround = true;
        if (impact < -2) this.landKick = Math.min(1, -impact / 9);
        if (ground < -1) this.landInPit();
        else if (impact < -4) {
          game.audio.playerStep(this.surface(), 1.2);
          game.emitNoise(this.pos.x, this.pos.z, NOISE.land, 'player');
        }
      }
    } else if (this.pos.y > ground + 0.05) this.onGround = false;

    if (this.inPit > 0) {
      this.inPit -= dt;
      if (this.inPit <= 0) {
        this.pos.copy(this.lastSafe);
        this.velY = 0;
        game.ui.message('You claw your way out of the pit.');
      }
    } else if (this.onGround && ground === 0) this.lastSafe.copy(this.pos);

    const targetEye = this.crouch ? PLAYER.crouchEye : PLAYER.eye;
    this.eyeH = damp(this.eyeH, targetEye, 10, dt);

    const hs = Math.hypot(this.pos.x - ox, this.pos.z - oz);
    if (this.onGround && hs > 0.001) {
      this.stepDist += hs;
      this.bob += hs * (this.running ? 2.6 : 3.2);
      const stride = this.crouch ? 1.25 : this.running ? 2.3 : 1.75;
      if (this.stepDist > stride) {
        this.stepDist = 0;
        this.footstep();
      }
    }

    if (input.wasPressed('KeyF')) this.toggleFlashlight();
    if (input.wasPressed('KeyH')) this.useMedkit();
    if (game.placing) return; // trap placement uses the mouse
    if (input.wasPressed('Digit1')) this.switchTo(0);
    if (input.wasPressed('Digit2')) this.switchTo(1);
    if (input.wasPressed('KeyQ') || input.wheel) this.switchTo(this.slot ? 0 : 1);
    if (input.wasPressed('KeyR')) this.startReload();
    this.updateAttack(dt, input);
  }

  groundAt(x, z) {
    const world = this.game.level.world;
    const tx = Math.floor(x / TILE);
    const tz = Math.floor(z / TILE);
    if (world.t(tx, tz) !== T.PIT) return 0;
    const lx = x - tx * TILE;
    const lz = z - tz * TILE;
    const m = 0.3;
    if (lx < m || lz < m || lx > TILE - m || lz > TILE - m) return 0;
    return -PIT_DEPTH;
  }

  surface() {
    const level = this.game.level;
    if (level.kind === 'camp') return 'dirt';
    const [tx, ty] = level.world.tileOf(this.pos.x, this.pos.z);
    if (level.glassTiles?.has(ty * level.world.W + tx)) return 'glass';
    if (level.world.t(tx, ty) === T.YARD) return 'dirt';
    return 'stone';
  }

  footstep() {
    const s = this.surface();
    const g = this.game;
    const vol = this.crouch ? 0.35 : this.running ? 1.1 : 0.7;
    g.audio.playerStep(s === 'dirt' ? 'wood' : s, vol);
    let r = this.crouch ? NOISE.crouch : this.running ? NOISE.run : NOISE.walk;
    let kind = 'player';
    if (s === 'glass') {
      r = this.crouch ? NOISE.glassCrouch : NOISE.glass;
      kind = 'glass';
    }
    g.emitNoise(this.pos.x, this.pos.z, r, kind);
  }

  landInPit() {
    this.inPit = 1.4;
    this.game.audio.fallPit();
    this.game.emitNoise(this.pos.x, this.pos.z, NOISE.pit, 'player');
    this.damage(35, 'spikes');
    this.game.ui.message('Impaled on spikes!', 'bad');
  }

  // ------------------------------------------------------------ attacking
  updateAttack(dt, input) {
    const def = this.weaponDef();
    const st = this.weaponStats();
    if (this.switchT > 0 || this.inPit > 0) return;
    const g = this.game;
    // melee wind-up resolves a moment after the click
    if (this.pendingSwing > 0) {
      this.pendingSwing -= dt;
      if (this.pendingSwing <= 0) this.resolveSwing(def, st);
    }
    if (def.cat === 'lmg' && def.spinUp) {
      this.spin = input.mouseDown ? Math.min(def.spinUp, this.spin + dt) : Math.max(0, this.spin - dt * 2);
      if (input.mouseDown && this.spin < def.spinUp) return;
    }
    const wants = def.auto ? input.mouseDown : input.clicked;
    if (!wants || this.fireCd > 0) return;
    if (def.cat === 'melee') {
      if (this.stamina < (def.stam || 0) * 0.5 && def.stam) {
        g.audio.breath(0.5);
        this.fireCd = 0.4;
        return;
      }
      this.fireCd = 1 / st.rate;
      this.stamina = Math.max(0, this.stamina - (def.stam || 0));
      this.staminaDelay = 0.7;
      this.swing = 1;
      if (def.id === 'chainsaw') this.resolveSwing(def, st);
      else {
        this.pendingSwing = 0.12;
        g.audio.weaponFire(def);
      }
      return;
    }
    if (this.reloading > 0) return;
    const inst = this.weapon();
    if (inst.mag <= 0) {
      g.audio.click(0.6);
      this.fireCd = 0.3;
      if (this.canReload(def)) this.startReload();
      else g.ui.message(`Out of ${AMMO[def.ammo].name.toLowerCase()}.`, 'dim');
      return;
    }
    inst.mag--;
    this.fireCd = 1 / st.rate;
    this.recoil = def.cat === 'sniper' || def.cat === 'shotgun' || def.cat === 'launcher' ? 1.4 : def.cat === 'flame' ? 0.1 : def.auto ? 0.45 : 1;
    this.shake = Math.max(this.shake, def.cat === 'flame' ? 0.05 : Math.min(0.5, 0.12 + st.dmg * st.pellets * 0.0012));
    g.audio.weaponFire(def);
    g.muzzleFlash(def);
    const origin = g.camera.getWorldPosition(new THREE.Vector3());
    let fwd = g.camera.getWorldDirection(new THREE.Vector3());
    if (g.touch?.active && def.cat !== 'flame' && def.cat !== 'thrown') fwd = this.aimAssist(origin, fwd, st.range);
    if (def.cat === 'flame') {
      g.combat.flame(this, origin.clone().addScaledVector(fwd, 0.4).add(new THREE.Vector3(0, -0.2, 0)), fwd, { range: st.range, dmg: st.dmg, spread: st.spread });
    } else if (def.proj) {
      const dir = this.spreadDir(fwd, st.spread);
      if (def.cat === 'thrown') dir.y += 0.28;
      const speed = def.proj.speed * (def.cat === 'thrown' ? 1 + (st.range / def.range - 1) * 0.5 : 1);
      const start = origin.clone().addScaledVector(fwd, 0.6).add(new THREE.Vector3(0, -0.15, 0));
      g.combat.spawn(def.proj.kind, start, dir.normalize().multiplyScalar(speed), {
        grav: def.proj.grav,
        dmg: st.dmg,
        splash: st.splash,
        fuse: def.proj.fuse || undefined,
        pierce: st.pierce,
        src: this,
      });
    } else {
      for (let i = 0; i < st.pellets; i++) {
        const dir = this.spreadDir(fwd, st.spread * (this.moving ? 1.35 : 1) * (this.crouch ? 0.75 : 1));
        g.combat.hitscan(origin, dir, { dmg: st.dmg, range: st.range, pierce: st.pierce, src: this, tracer: i < 3 });
      }
    }
    if (def.noise) g.emitNoise(this.pos.x, this.pos.z, def.noise, 'gun');
    if (inst.mag <= 0 && this.canReload(def) && def.cat !== 'thrown') setTimeout(() => this.startReload(), 250);
    if (def.cat === 'thrown' && inst.mag <= 0) this.startReload();
  }

  // On a touch screen, shots bend a few degrees toward the zombie nearest the
  // crosshair (more up close), the way mobile shooters help thumbs aim.
  aimAssist(origin, fwd, range) {
    const lvl = this.game.level;
    let best = null;
    let bestScore = 1;
    for (const e of lvl.enemies) {
      if (!e.alive) continue;
      const tx = e.pos.x - origin.x;
      const tz = e.pos.z - origin.z;
      const ty = (e.pos.y || 0) + (e.model.height || 1.6) * 0.62 - origin.y;
      const d = Math.hypot(tx, ty, tz);
      if (d > range || d < 0.4) continue;
      const a = Math.acos(Math.min(1, (tx * fwd.x + ty * fwd.y + tz * fwd.z) / d));
      const score = a / Math.max(0.05, Math.min(0.14, 0.9 / d));
      if (score >= bestScore || !lvl.world.los(origin.x, origin.z, e.pos.x, e.pos.z)) continue;
      bestScore = score;
      best = new THREE.Vector3(tx / d, ty / d, tz / d);
    }
    return best ? fwd.clone().lerp(best, 0.8).normalize() : fwd;
  }

  spreadDir(fwd, spread) {
    const d = fwd.clone();
    if (spread <= 0) return d;
    const r = spread * Math.sqrt(Math.random());
    const a = Math.random() * Math.PI * 2;
    const up = Math.abs(d.y) > 0.95 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
    const right = new THREE.Vector3().crossVectors(d, up).normalize();
    const up2 = new THREE.Vector3().crossVectors(right, d).normalize();
    return d.addScaledVector(right, Math.cos(a) * r).addScaledVector(up2, Math.sin(a) * r).normalize();
  }

  resolveSwing(def, st) {
    const g = this.game;
    const fwd = this.forward();
    const n = g.combat.melee(this, this.pos.x, this.pos.z, this.facing, {
      reach: st.range,
      arc: def.arc ?? 1.1,
      dmg: st.dmg,
      cleave: def.cleave ?? 1,
      fwd: def.id === 'chainsaw' ? null : fwd,
    });
    if (def.id === 'chainsaw') g.audio.weaponFire(def);
    if (n) {
      g.audio.meleeHit(new THREE.Vector3(this.pos.x - Math.sin(this.yaw), 1.2, this.pos.z - Math.cos(this.yaw)));
      this.shake = Math.max(this.shake, 0.15);
    }
    g.emitNoise(this.pos.x, this.pos.z, NOISE.melee, 'player');
  }

  // Shared ammo pools: some weapons use more than one unit per round (molotovs).
  canReload(def) {
    return (this.run.ammo[def.ammo] || 0) >= (def.ammoPer || 1);
  }

  startReload() {
    const def = this.weaponDef();
    const inst = this.weapon();
    if (!inst || def.cat === 'melee' || this.reloading > 0) return;
    const st = this.weaponStats();
    if (inst.mag >= st.mag || !this.canReload(def)) return;
    this.reloading = st.reload;
    this.reloadTotal = st.reload;
    if (def.cat !== 'thrown' && def.cat !== 'bow') this.game.audio.reload();
  }

  finishReload() {
    const inst = this.weapon();
    if (!inst) return;
    const def = WEAPONS[inst.id];
    const st = this.weaponStats();
    const per = def.ammoPer || 1;
    const n = Math.min(st.mag - inst.mag, Math.floor((this.run.ammo[def.ammo] || 0) / per));
    inst.mag += n;
    this.run.ammo[def.ammo] -= n * per;
  }

  // ------------------------------------------------------------ hiding
  enterHide(spot) {
    this.game.onPlayerHide(spot);
    this.hidden = spot;
    this.hideT = 0;
    this.hideFrom = { x: this.pos.x, y: this.pos.y + this.eyeH, z: this.pos.z, yaw: this.yaw, pitch: this.pitch };
    this.crouch = false;
    this.running = false;
    this.moving = false;
    this.vel.set(0, 0, 0);
    this.spotYaw = Math.atan2(-spot.fx, -spot.fz);
    this.yaw = this.spotYaw;
    this.pitch = 0;
    this.game.audio.locker(spot, spot.kind);
    this.game.emitNoise(spot.x, spot.z, 4, 'hide');
  }

  exitHide(forced = false) {
    const spot = this.hidden;
    if (!spot) return;
    this.hidden = null;
    this.pos.set(spot.exit.x, 0, spot.exit.z);
    this.eyeH = PLAYER.eye;
    this.velY = 0;
    this.onGround = true;
    this.yaw = this.spotYaw;
    if (!forced) this.game.audio.locker(spot, spot.kind);
    this.game.level.world.collide(this.pos, PLAYER.radius);
  }

  updateHidden(dt, input) {
    const spot = this.hidden;
    const cfg = HIDE_CAM[spot.kind];
    this.hideT = Math.min(1, this.hideT + dt * 3.5);
    const d = angleDiff(this.spotYaw, this.yaw);
    this.yaw = this.spotYaw + clamp(d, -cfg.yawLim, cfg.yawLim);
    this.pitch = clamp(this.pitch, cfg.pitchMin, cfg.pitchMax);
    this.stamina = Math.min(this.maxStamina, this.stamina + PLAYER.staminaRegen * 1.3 * dt);
    if (this.exhausted && this.stamina > this.maxStamina * 0.3) this.exhausted = false;
    if (input.wasPressed('KeyF')) this.toggleFlashlight();
    if (input.wasPressed('KeyH')) this.useMedkit();
  }

  hideCamera() {
    const s = this.hidden;
    const cfg = HIDE_CAM[s.kind];
    return { x: s.x + s.fx * cfg.fwd, y: cfg.y, z: s.z + s.fz * cfg.fwd };
  }

  // ------------------------------------------------------------ actions
  toggleFlashlight() {
    this.flashlight = !this.flashlight;
    this.game.audio.flashlight();
  }

  useMedkit() {
    const run = this.run;
    if (run.medkits <= 0) return this.game.ui.message('No med kits.', 'dim');
    if (this.health >= this.maxHealth) return this.game.ui.message('Already at full health.', 'dim');
    run.medkits--;
    const heal = Math.round(this.maxHealth * 0.6);
    this.health = Math.min(this.maxHealth, this.health + heal);
    this.game.audio.pickup();
    this.game.ui.message(`+${heal} health`, 'good');
  }

  damage(amount, cause) {
    if (!this.alive || this.invuln > 0) return;
    this.health -= amount;
    this.shake = Math.max(this.shake, Math.min(1, amount / 30));
    this.game.ui.hurt(Math.min(1, amount / 40));
    this.game.audio.impactPlayer(amount >= 35);
    if (this.health <= 0) {
      this.health = 0;
      this.game.playerDied(cause);
    }
  }
}
