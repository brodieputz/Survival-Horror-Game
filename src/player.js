// First-person player: movement, stamina, hiding, revolver and inventory.
import * as THREE from 'three';
import { PLAYER, GUN, NOISE, TILE, WALL_H, PIT_DEPTH, T } from './config.js';
import { clamp, damp, angleDiff } from './util.js';

const HIDE_CAM = {
  locker: { y: 1.5, fwd: -0.02, yawLim: 0.55, pitchMin: -0.35, pitchMax: 0.25 },
  closet: { y: 1.55, fwd: 0.0, yawLim: 0.6, pitchMin: -0.35, pitchMax: 0.25 },
  bed: { y: 0.2, fwd: 0.3, yawLim: 0.8, pitchMin: -0.15, pitchMax: 0.12 },
  bench: { y: 0.2, fwd: 0.05, yawLim: 0.8, pitchMin: -0.15, pitchMax: 0.15 },
};

export class Player {
  constructor(game) {
    this.game = game;
    this.pos = new THREE.Vector3();
    this.vel = new THREE.Vector3();
    this.yaw = 0;
    this.pitch = 0;
    this.lives = PLAYER.startLives;
    this.gold = 0;
    this.stats = { gold: 0, diamonds: 0, kills: 0 };
    this.upgrades = { health: 0, speed: 0, stamina: 0, greed: 0 };
    this.livesBought = 0;
    this.inv = { medkit: 1, beartrap: 0, key: 0 };
    this.clip = GUN.clip;
    this.reserve = 6;
    this.flashlight = true;
    this.resetTransient();
  }

  get maxHealth() {
    return PLAYER.baseHealth + this.upgrades.health * 20;
  }
  get maxStamina() {
    return PLAYER.baseStamina + this.upgrades.stamina * 25;
  }
  get speedMul() {
    return 1 + this.upgrades.speed * 0.07;
  }
  get goldMul() {
    return 1 + this.upgrades.greed * 0.25;
  }

  resetTransient() {
    this.health = this.maxHealth;
    this.stamina = this.maxStamina;
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
    this.fireCd = 0;
    this.recoil = 0;
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
  get inSafe() {
    return this.game.level.world.inSafeRoom(this.pos.x, this.pos.z);
  }

  // How far away monsters can spot the player.
  visibility() {
    let r = this.flashlight ? 22 : 10;
    if (this.crouch) r *= 0.6;
    if (this.running) r *= 1.15;
    return r;
  }

  forward(out = new THREE.Vector3()) {
    return out.set(-Math.sin(this.yaw) * Math.cos(this.pitch), Math.sin(this.pitch), -Math.cos(this.yaw) * Math.cos(this.pitch));
  }

  // ------------------------------------------------------------ update
  update(dt, input) {
    const game = this.game;
    const world = game.level.world;
    this.invuln = Math.max(0, this.invuln - dt);
    this.fireCd = Math.max(0, this.fireCd - dt);
    this.recoil = damp(this.recoil, 0, 10, dt);
    this.shake = Math.max(0, this.shake - dt * 2.5);

    // look
    const sens = 0.0022 * input.sensitivity;
    this.yaw -= input.mouseDX * sens;
    this.pitch -= input.mouseDY * sens;
    this.pitch = clamp(this.pitch, -1.45, 1.45);

    if (!this.alive) return;

    if (this.hidden) {
      this.updateHidden(dt, input);
      return;
    }

    if (this.reloading > 0) {
      this.reloading -= dt;
      if (this.reloading <= 0) {
        const n = Math.min(GUN.clip - this.clip, this.reserve);
        this.clip += n;
        this.reserve -= n;
      }
    }

    // crouch toggle
    if (input.wasPressed('KeyC') || input.wasPressed('ControlLeft')) this.crouch = !this.crouch;

    // movement intent
    let mx = 0;
    let mz = 0;
    if (input.down('KeyW') || input.down('ArrowUp')) mz -= 1;
    if (input.down('KeyS') || input.down('ArrowDown')) mz += 1;
    if (input.down('KeyA') || input.down('ArrowLeft')) mx -= 1;
    if (input.down('KeyD') || input.down('ArrowRight')) mx += 1;
    const len = Math.hypot(mx, mz);
    if (len > 0) {
      mx /= len;
      mz /= len;
    }
    this.moving = len > 0;
    const wantRun = (input.down('ShiftLeft') || input.down('ShiftRight')) && this.moving && mz <= 0.2;
    if (wantRun && this.crouch) this.crouch = false;
    this.running = wantRun && !this.exhausted && this.stamina > 0 && this.trapped <= 0;

    // stamina
    if (this.running) {
      this.stamina -= PLAYER.runDrain * dt;
      this.staminaDelay = 0.9;
      if (this.stamina <= 0) {
        this.stamina = 0;
        this.exhausted = true;
      }
    } else {
      this.staminaDelay -= dt;
      if (this.staminaDelay <= 0)
        this.stamina = Math.min(this.maxStamina, this.stamina + (PLAYER.staminaRegen + this.upgrades.stamina * 3) * dt);
      if (this.exhausted && this.stamina > this.maxStamina * 0.3) this.exhausted = false;
    }
    this.breathCd -= dt;
    if (this.exhausted && this.breathCd <= 0) {
      game.audio.breath(0.7);
      this.breathCd = 1.4;
    }

    let speed = this.crouch ? PLAYER.crouch : this.running ? PLAYER.run : PLAYER.walk;
    speed *= this.speedMul;
    if (this.trapped > 0) {
      this.trapped -= dt;
      speed = 0;
    }
    if (this.inPit > 0) speed = 0;
    const sy = Math.sin(this.yaw);
    const cy = Math.cos(this.yaw);
    // forward = (-sin, -cos); right = (cos, -sin)
    const tx = (mx * cy + mz * sy) * speed;
    const tz = (-mx * sy + mz * cy) * speed;
    const accel = this.onGround ? 12 : 2.5;
    this.vel.x = damp(this.vel.x, tx, accel, dt);
    this.vel.z = damp(this.vel.z, tz, accel, dt);

    // jump
    if (input.wasPressed('Space') && this.onGround && this.trapped <= 0 && this.inPit <= 0) {
      if (this.stamina >= PLAYER.jumpCost * 0.5) {
        this.velY = PLAYER.jumpV;
        this.onGround = false;
        this.stamina = Math.max(0, this.stamina - PLAYER.jumpCost);
        this.staminaDelay = 0.9;
        this.crouch = false;
        game.audio.jump();
      }
    }

    const ox = this.pos.x;
    const oz = this.pos.z;
    this.pos.x += this.vel.x * dt;
    this.pos.z += this.vel.z * dt;
    if (this.pos.y > -0.2) world.collide(this.pos, PLAYER.radius, false);
    else {
      // inside a pit: stay within it
      this.pos.x = ox;
      this.pos.z = oz;
    }

    // vertical
    const ground = this.groundAt(this.pos.x, this.pos.z);
    this.velY -= PLAYER.gravity * dt;
    this.pos.y += this.velY * dt;
    if (this.pos.y + this.eyeH > WALL_H - 0.15) {
      this.pos.y = WALL_H - 0.15 - this.eyeH;
      this.velY = Math.min(0, this.velY);
    }
    if (this.pos.y <= ground) {
      const impact = this.velY;
      this.pos.y = ground;
      this.velY = 0;
      if (!this.onGround) {
        this.onGround = true;
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

    // eye height
    const targetEye = this.crouch ? PLAYER.crouchEye : PLAYER.eye;
    this.eyeH = damp(this.eyeH, targetEye, 10, dt);

    // footsteps
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
    if (input.wasPressed('KeyR')) this.startReload();
    if (input.wasPressed('KeyH') || input.wasPressed('Digit1')) this.useMedkit();
    if (input.wasPressed('KeyT') || input.wasPressed('Digit2')) this.placeTrap();
    if (input.clicked) this.fire();
  }

  groundAt(x, z) {
    const world = this.game.level.world;
    const tx = Math.floor(x / TILE);
    const tz = Math.floor(z / TILE);
    if (world.t(tx, tz) !== T.PIT) return 0;
    // forgiving edges: only fall when well inside the pit
    const lx = x - tx * TILE;
    const lz = z - tz * TILE;
    const m = 0.3;
    if (lx < m || lz < m || lx > TILE - m || lz > TILE - m) return 0;
    return -PIT_DEPTH;
  }

  surface() {
    const level = this.game.level;
    if (level.world.isSafePos(this.pos.x, this.pos.z)) return 'wood';
    const [tx, ty] = level.world.tileOf(this.pos.x, this.pos.z);
    if (level.glassTiles.has(ty * level.world.W + tx)) return 'glass';
    return 'stone';
  }

  footstep() {
    const s = this.surface();
    const g = this.game;
    const vol = this.crouch ? 0.35 : this.running ? 1.1 : 0.7;
    g.audio.playerStep(s, vol);
    let r = this.crouch ? NOISE.crouch : this.running ? NOISE.run : NOISE.walk;
    let kind = 'player';
    if (s === 'glass') {
      r = this.crouch ? NOISE.glassCrouch : NOISE.glass;
      kind = 'glass';
    }
    if (s !== 'wood') g.emitNoise(this.pos.x, this.pos.z, r, kind);
  }

  landInPit() {
    this.inPit = 1.4;
    this.game.audio.fallPit();
    this.game.emitNoise(this.pos.x, this.pos.z, NOISE.pit, 'player');
    this.damage(35, 'spikes');
    this.game.ui.message('Impaled on spikes!', 'bad');
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
    // regen stamina while hiding
    this.stamina = Math.min(this.maxStamina, this.stamina + PLAYER.staminaRegen * 1.3 * dt);
    if (this.exhausted && this.stamina > this.maxStamina * 0.3) this.exhausted = false;
    if (input.wasPressed('KeyF')) this.toggleFlashlight();
    if (input.wasPressed('KeyH') || input.wasPressed('Digit1')) this.useMedkit();
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
    if (this.inv.medkit <= 0) return this.game.ui.message('No med kits.', 'dim');
    if (this.health >= this.maxHealth) return this.game.ui.message('Already at full health.', 'dim');
    this.inv.medkit--;
    this.health = Math.min(this.maxHealth, this.health + 50);
    this.game.audio.pickup();
    this.game.ui.message('+50 health', 'good');
  }

  placeTrap() {
    const g = this.game;
    if (this.inv.beartrap <= 0) return g.ui.message('No bear traps.', 'dim');
    if (this.inSafe || g.level.world.isSafePos(this.pos.x, this.pos.z)) return g.ui.message("Traps are useless in the sanctuary.", 'dim');
    const x = this.pos.x - Math.sin(this.yaw) * 1.1;
    const z = this.pos.z - Math.cos(this.yaw) * 1.1;
    const w = g.level.world;
    const [tx, ty] = w.tileOf(x, z);
    if (w.t(tx, ty) !== T.FLOOR) return g.ui.message("Can't place a trap there.", 'dim');
    this.inv.beartrap--;
    g.level.addBearTrap(x, z, true);
    g.audio.click(0.8);
    g.ui.message('Bear trap set.', 'good');
  }

  startReload() {
    if (this.reloading > 0 || this.clip >= GUN.clip || this.reserve <= 0) return;
    this.reloading = GUN.reloadTime;
    this.game.audio.reload();
  }

  fire() {
    const g = this.game;
    if (this.hidden || this.reloading > 0 || this.fireCd > 0 || this.inPit > 0) return;
    if (this.clip <= 0) {
      g.audio.click(0.6);
      this.fireCd = 0.3;
      if (this.reserve > 0) this.startReload();
      else g.ui.message('Out of ammo.', 'dim');
      return;
    }
    this.clip--;
    this.fireCd = GUN.fireDelay;
    this.recoil = 1;
    this.shake = Math.max(this.shake, 0.25);
    g.audio.gunshot();
    g.shoot();
    if (!this.inSafe) g.emitNoise(this.pos.x, this.pos.z, GUN.noise, 'gun');
  }

  addGold(v) {
    const amount = Math.round(v * this.goldMul);
    this.gold += amount;
    this.stats.gold += amount;
    return amount;
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
