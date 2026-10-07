// Entry point: renderer, game state machine and the main loop.
import * as THREE from 'three';
import { Level } from './level.js';
import { Player } from './player.js';
import { AudioSys } from './audio.js';
import { UI } from './ui.js';
import { Input } from './input.js';
import { Particles } from './fx.js';
import { makeViewModel } from './models.js';
import { SHOP_ITEMS, itemPrice, GUN, PLAYER } from './config.js';
import { damp, dist2D, clamp } from './util.js';

const SETTINGS_KEY = 'dreaddepths.settings';
const BEST_KEY = 'dreaddepths.best';

class Game {
  constructor() {
    this.canvas = document.getElementById('game');
    this.settings = { sens: 1, master: 0.85, music: 0.7, sfx: 1, retro: true };
    try {
      Object.assign(this.settings, JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'));
    } catch (e) {
      /* ignore corrupt settings */
    }

    const r = (this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: false, powerPreference: 'high-performance' }));
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFShadowMap;
    r.outputColorSpace = THREE.SRGBColorSpace;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.scene.fog = new THREE.FogExp2(0x000000, 0.058);
    this.camera = new THREE.PerspectiveCamera(72, 1, 0.05, 80);
    this.camera.rotation.order = 'YXZ';
    this.scene.add(this.camera);

    this.hemi = new THREE.HemisphereLight(0x45455e, 0x1a100c, 0.85);
    this.scene.add(this.hemi);
    const fl = (this.flashlight = new THREE.SpotLight(0xfff0d2, 90, 32, 0.46, 0.5, 1.35));
    // the beam starts at the lens of the flashlight held in the left hand
    fl.position.set(-0.22, -0.22, -0.7);
    fl.target.position.set(0.0, -0.15, -8);
    fl.castShadow = true;
    fl.shadow.mapSize.set(1024, 1024);
    fl.shadow.camera.near = 0.3;
    fl.shadow.camera.far = 30;
    fl.shadow.bias = -0.0008;
    this.camera.add(fl);
    this.camera.add(fl.target);
    this.torchLights = [];
    for (let i = 0; i < 4; i++) {
      const l = new THREE.PointLight(0xff7a30, 0, 10, 1.3);
      this.scene.add(l);
      this.torchLights.push(l);
    }
    this.safeLight = new THREE.PointLight(0xffa860, 0, 15, 1.1);
    this.scene.add(this.safeLight);
    this.muzzle = new THREE.PointLight(0xffc870, 0, 14, 1.5);
    this.muzzle.position.set(0.25, -0.1, -0.7);
    this.camera.add(this.muzzle);
    this.vm = makeViewModel();
    this.vm.group.visible = false;
    this.camera.add(this.vm.group);
    this.particles = new Particles(this.scene);

    this.audio = new AudioSys();
    this.audio.volume = { master: this.settings.master, music: this.settings.music, sfx: this.settings.sfx };
    this.input = new Input(this.canvas);
    this.input.sensitivity = this.settings.sens;
    this.ui = new UI(this);

    this.state = 'title';
    this.time = 0;
    this.levelNum = 1;
    this.player = null;
    this.level = null;
    this.raycaster = new THREE.Raycaster();
    this.frustum = new THREE.Frustum();
    this.projM = new THREE.Matrix4();
    this.sphere = new THREE.Sphere();
    this.chaseHold = 0;
    this.heartCd = 0;
    this.lightFlicker = 0;
    this.fov = 72;
    this.shriekMsgCd = 0;

    this.audio.occluded = (pos) => {
      if (!this.level) return false;
      const c = this.camera.position;
      return !this.level.world.los(c.x, c.z, pos.x, pos.z);
    };

    this.input.onLockChange = (locked) => {
      if (!locked && this.state === 'playing') this.pause(true);
      if (locked && this.state === 'paused') this.pause(false);
    };
    this.input.onKey = (e) => this.onKey(e);
    this.bindButtons();
    window.addEventListener('resize', () => this.resize());
    this.resize();
    this.ui.showTitle(true, this.bestLine());
    this.last = performance.now();
    requestAnimationFrame((t) => this.frame(t));
  }

  // ------------------------------------------------------------ setup
  bindButtons() {
    document.getElementById('startBtn').addEventListener('click', () => this.startGame());
    document.getElementById('resumeBtn').addEventListener('click', () => this.input.lock());
    document.getElementById('quitBtn').addEventListener('click', () => this.toTitle());
    document.getElementById('retryBtn').addEventListener('click', () => this.startGame());
    document.getElementById('shopClose').addEventListener('click', () => this.closeShop());
    document.getElementById('mapScreen').addEventListener('click', () => this.ui.toggleMap(false));
    this.canvas.addEventListener('click', () => {
      if (this.state === 'playing' && !this.input.locked) this.input.lock();
    });
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.applyResolution();
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }
  applyResolution() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.setPixelRatio(this.settings.retro ? 0.5 : Math.min(dpr, 1.5));
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);
    this.canvas.classList.toggle('retro', !!this.settings.retro);
  }
  saveSettings() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
    } catch (e) {
      /* storage unavailable */
    }
  }
  best() {
    try {
      return parseInt(localStorage.getItem(BEST_KEY) || '0', 10) || 0;
    } catch (e) {
      return 0;
    }
  }
  bestLine() {
    const b = this.best();
    return b ? `Deepest descent: Level ${b}` : '';
  }

  // ------------------------------------------------------------ flow
  startGame() {
    this.audio.init();
    this.ui.showTitle(false);
    this.ui.showGameOver(null, false);
    this.ui.hideDeath();
    this.player = new Player(this);
    this.levelNum = 1;
    this.loadLevel(1);
    this.state = 'playing';
    this.ui.showHud(true);
    this.ui.fadeV = 1;
    this.ui.fade(0, 2);
    this.input.lock();
    this.ui.message('Find the diamonds. Gold buys survival. The Keeper waits in the sanctuary.', '', 7);
  }

  loadLevel(n) {
    if (this.level) {
      this.level.dispose();
      this.level = null;
    }
    const seed = (Math.random() * 0xffffffff) >>> 0;
    new Level(this, n, seed); // assigns this.level
    this.player.spawn(this.level.d.spawn);
    this.player.trapped = 0;
    this.player.inPit = 0;
    this.player.hidden = null;
    this.level.assignLights(this.torchLights, this.player.pos.x, this.player.pos.z);
    this.safeLight.position.copy(this.level.safeLightPos);
    this.safeLight.intensity = 9;
    this.ui.toggleMap(false);
    const need = this.level.needed;
    this.ui.banner(`LEVEL <span class="num">${n}</span>`, `Find ${need} ${need === 1 ? 'diamond' : 'diamonds'}`, 4);
    this.updateCamera(0);
  }

  toTitle() {
    this.state = 'title';
    this.ui.showPause(false);
    this.ui.showHud(false);
    this.ui.showTitle(true, this.bestLine());
    this.audio.setMode('safe');
  }

  pause(on) {
    if (on) {
      this.state = 'paused';
      this.ui.showPause(true);
      this.ui.toggleMap(false);
      if (this.audio.ctx) this.audio.ctx.suspend();
    } else {
      this.state = 'playing';
      this.ui.showPause(false);
      if (this.audio.ctx) this.audio.ctx.resume();
    }
  }

  onKey(e) {
    if (this.state === 'shop') {
      if (e.code === 'Escape' || e.code === 'KeyE' || e.code === 'Tab') this.closeShop();
      const m = e.code.match(/^Digit(\d)$/);
      if (m) {
        const idx = (parseInt(m[1], 10) + 9) % 10;
        if (SHOP_ITEMS[idx]) this.buy(SHOP_ITEMS[idx].id);
      }
      return;
    }
    if (this.state === 'gameover' && (e.code === 'Enter' || e.code === 'Space')) this.startGame();
    if (this.state === 'title' && e.code === 'Enter') this.startGame();
  }

  // ------------------------------------------------------------ shop
  shopState(item) {
    const p = this.player;
    if (item.upgrade) {
      const t = p.upgrades[item.id] || 0;
      return { maxed: t >= item.max, info: `Rank ${t} / ${item.max}` };
    }
    if (item.id === 'map') return { maxed: this.level.mapOwned, info: this.level.mapOwned ? 'Owned for this level' : 'This level only' };
    const owned = { life: p.lives, medkit: p.inv.medkit, key: p.inv.key, beartrap: p.inv.beartrap, ammo: p.reserve }[item.id];
    return { maxed: false, info: `Owned: ${owned}` };
  }

  openShop() {
    this.state = 'shop';
    this.input.unlock();
    this.ui.setPrompt('');
    this.ui.showShop(true);
    this.audio.uiClick();
  }
  closeShop() {
    if (this.state !== 'shop') return;
    this.ui.showShop(false);
    this.state = 'playing';
    this.input.pressed.clear(); // don't let the closing key re-open the shop
    this.input.lock();
  }

  buy(id) {
    const item = SHOP_ITEMS.find((i) => i.id === id);
    const p = this.player;
    const price = itemPrice(item, this.levelNum, p);
    const st = this.shopState(item);
    if (st.maxed || p.gold < price) {
      this.audio.denied();
      return;
    }
    p.gold -= price;
    switch (id) {
      case 'life':
        p.lives++;
        p.livesBought++;
        break;
      case 'medkit':
        p.inv.medkit++;
        break;
      case 'health':
        p.upgrades.health++;
        p.health += 20;
        break;
      case 'speed':
        p.upgrades.speed++;
        break;
      case 'stamina':
        p.upgrades.stamina++;
        p.stamina = p.maxStamina;
        break;
      case 'greed':
        p.upgrades.greed++;
        break;
      case 'map':
        this.level.revealAll();
        break;
      case 'key':
        p.inv.key++;
        break;
      case 'beartrap':
        p.inv.beartrap++;
        break;
      case 'ammo':
        p.reserve += 6;
        break;
    }
    this.audio.buy();
    this.ui.refreshShop();
  }

  // ------------------------------------------------------------ events from entities
  emitNoise(x, z, r, kind) {
    if (!this.level) return;
    const n = { x, z, r, kind };
    for (const e of this.level.enemies) e.hear(n);
  }

  alert(x, z, r, spot, src) {
    for (const e of this.level.enemies) {
      if (e === src) continue;
      if (dist2D(e.pos.x, e.pos.z, x, z) < r) e.alerted(x, z, spot);
    }
    const p = this.player;
    if (this.shriekMsgCd <= 0 && dist2D(p.pos.x, p.pos.z, x, z) < 45) {
      this.shriekMsgCd = 6;
      this.ui.message(spot ? 'The Blood Hound shrieks at your hiding place!' : 'A Blood Hound shrieks! The others are coming...', 'bad');
    }
  }

  onPlayerHide(spot) {
    for (const e of this.level.enemies) {
      if (!e.alive || e.type === 'angel' || e.stun > 0) continue;
      let knows = false;
      if (e.type === 'grunt') knows = e.canSee(true);
      else if (e.type === 'hound')
        knows = e.canSee(true) || (['chase', 'alert', 'shriek', 'bark'].includes(e.state) && e.dist() < 40);
      else if (e.type === 'brute') knows = (e.state === 'charge' || e.enraged > 0) && e.dist() < 9;
      if (!knows) continue;
      e.knowsSpot = spot;
      if (e.type === 'hound') {
        if (e.state !== 'shriek') e.setState('bark');
      } else if (e.state !== 'fight') e.setState('pullout');
    }
  }

  pullOut(enemy, dmg) {
    const p = this.player;
    if (!p.hidden) return;
    p.exitHide(true);
    // face the monster that dragged you out
    p.yaw = Math.atan2(-(enemy.pos.x - p.pos.x), -(enemy.pos.z - p.pos.z));
    p.invuln = 0;
    p.damage(dmg, enemy.type);
    p.invuln = 0.9;
    this.audio.growl(enemy.type, enemy.pos, 1.4);
    if (p.alive) this.ui.message('It saw you hide. You are dragged out!', 'bad');
  }

  killPlayer(cause) {
    const p = this.player;
    if (!p.alive) return;
    p.invuln = 0;
    this.killer = cause;
    p.damage(9999, cause);
  }

  playerDied(cause) {
    const p = this.player;
    if (!p.alive) return;
    p.alive = false;
    p.deathT = 0;
    p.lives--;
    if (p.hidden) p.exitHide(true);
    this.state = 'dying';
    this.deathCause = cause;
    if (cause === 'angel') this.audio.stinger();
    this.audio.death();
    this.audio.setMode('dead');
    this.ui.toggleMap(false);
    setTimeout(() => this.ui.showDeath(cause, p.lives), 900);
  }

  respawn() {
    const p = this.player;
    const lost = Math.floor(p.gold * 0.25);
    p.gold -= lost;
    p.resetTransient();
    p.spawn(this.level.d.spawn);
    for (const e of this.level.enemies)
      if (e.alive && e.type !== 'angel') {
        e.knowsSpot = null;
        e.enraged = 0;
        if (e.state !== 'fight') {
          e.setState('patrol');
          e.target = null;
        }
      } else if (e.type === 'angel') e.awake = false;
    p.invuln = 2;
    this.ui.hideDeath();
    this.ui.fadeV = 1;
    this.ui.fade(0, 1.5);
    this.state = 'playing';
    this.ui.message(lost ? `You wake in the sanctuary, ${lost} gold lighter.` : 'You wake in the sanctuary.', 'dim', 5);
  }

  gameOver() {
    const p = this.player;
    const best = Math.max(this.best(), this.levelNum);
    try {
      localStorage.setItem(BEST_KEY, String(best));
    } catch (e) {
      /* ignore */
    }
    this.state = 'gameover';
    this.ui.hideDeath();
    this.ui.showHud(false);
    this.input.unlock();
    this.ui.showGameOver({ level: this.levelNum, diamonds: p.stats.diamonds, gold: p.stats.gold, kills: p.stats.kills, best });
  }

  descend() {
    if (this.state !== 'playing') return;
    this.state = 'transition';
    this.transT = 0;
    this.audio.hatch();
    this.ui.fade(1, 1.2);
  }

  // ------------------------------------------------------------ combat
  shoot() {
    const cam = this.camera;
    const origin = cam.getWorldPosition(new THREE.Vector3());
    const dir = cam.getWorldDirection(new THREE.Vector3());
    const wallD = this.level.world.ray3D(origin, dir, GUN.range);
    this.raycaster.set(origin, dir);
    this.raycaster.far = wallD;
    const roots = this.level.enemies.filter((e) => e.alive && e.pos.distanceTo(origin) < GUN.range + 2).map((e) => e.root);
    const hits = this.raycaster.intersectObjects(roots, true);
    this.vm.flash.material.opacity = 1;
    this.muzzle.intensity = 25;
    if (hits.length) {
      const h = hits[0];
      const e = h.object.userData.enemy;
      if (e.type === 'angel') {
        this.audio.ricochet(h.point);
        this.particles.burst(h.point, 10, 0xbbbbaa, 3);
        this.ui.message('The bullet ricochets off cold stone.', 'dim');
      } else {
        const head = h.point.y > e.model.height * 0.82;
        e.hit(GUN.damage * (head ? 1.6 : 1));
        this.particles.burst(h.point, 18, 0x7a0000, 3);
      }
      return;
    }
    const hp = origin.clone().addScaledVector(dir, Math.max(0, wallD - 0.05));
    this.particles.burst(hp, 8, 0x9a8a70, 2);
  }

  // Is the angel visible to the player right now?
  isObserved(e) {
    const p = this.player;
    if (!p.alive || p.hidden) return false;
    const cam = this.camera;
    const d = dist2D(e.pos.x, e.pos.z, cam.position.x, cam.position.z);
    if (d > 36) return false;
    // In darkness you can't really see it — keep your light on it.
    if (!p.flashlight && d > 5 && !this.nearTorch(e.pos)) return false;
    this.projM.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse);
    this.frustum.setFromProjectionMatrix(this.projM);
    this.sphere.center.set(e.pos.x, 1.0, e.pos.z);
    this.sphere.radius = 0.7;
    if (!this.frustum.intersectsSphere(this.sphere)) return false;
    const w = this.level.world;
    const rx = Math.cos(p.yaw) * 0.32;
    const rz = -Math.sin(p.yaw) * 0.32;
    return (
      w.los(cam.position.x, cam.position.z, e.pos.x, e.pos.z) ||
      w.los(cam.position.x, cam.position.z, e.pos.x + rx, e.pos.z + rz) ||
      w.los(cam.position.x, cam.position.z, e.pos.x - rx, e.pos.z - rz)
    );
  }
  nearTorch(pos) {
    for (const l of this.torchLights) if (l.userData.on && dist2D(l.position.x, l.position.z, pos.x, pos.z) < 5) return true;
    return false;
  }

  anyHunting() {
    const p = this.player;
    return this.level.enemies.some((e) => e.hunting && dist2D(e.pos.x, e.pos.z, p.pos.x, p.pos.z) < 45);
  }

  // ------------------------------------------------------------ main loop
  frame(now) {
    requestAnimationFrame((t) => this.frame(t));
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    this.step(dt);
    this.renderer.render(this.scene, this.camera);
    this.input.endFrame();
  }

  step(dt) {
    const s = this.state;
    if (s === 'playing' || s === 'dying' || s === 'transition') {
      this.time += dt;
      const p = this.player;
      if (s === 'playing') {
        p.update(dt, this.input);
        this.handleInteraction();
        if (this.input.wasPressed('KeyM') || this.input.wasPressed('Tab')) this.ui.toggleMap();
      } else {
        this.ui.setPrompt('');
      }
      if (s === 'dying') {
        p.deathT += dt;
        if (p.deathT > 4) {
          if (p.lives > 0) this.respawn();
          else this.gameOver();
        }
      }
      if (s === 'transition') {
        this.transT += dt;
        if (this.transT > 1.4) {
          this.levelNum++;
          this.loadLevel(this.levelNum);
          this.state = 'playing';
          this.ui.fade(0, 1.5);
          this.audio.setMode('safe');
        }
      }
      this.updateCamera(dt);
      this.camera.updateMatrixWorld();
      if (this.level && this.state !== 'transition') this.level.update(dt);
      this.updateLights(dt);
      this.updateAudio(dt);
      this.particles.update(dt);
      this.shriekMsgCd -= dt;
      this.ui.update(dt);
    } else if (this.player && this.level) {
      this.ui.update(0);
    }
    if (s === 'title') {
      // slow drifting camera behind the title screen
      this.time += dt;
    }
    this.audio.update();
  }

  handleInteraction() {
    const p = this.player;
    const input = this.input;
    if (p.hidden) {
      this.ui.setPrompt('<b>E</b> Leave hiding place');
      if (input.wasPressed('KeyE') && p.hideT > 0.6) p.exitHide();
      return;
    }
    if (!p.alive || p.inPit > 0) return this.ui.setPrompt('');
    const fwd = p.forward();
    const fl = Math.hypot(fwd.x, fwd.z) || 1;
    let best = null;
    let bestScore = Infinity;
    for (const it of this.level.interactables()) {
      const dx = it.x - p.pos.x;
      const dz = it.z - p.pos.z;
      const d = Math.hypot(dx, dz);
      if (d > it.range) continue;
      const dot = (dx * fwd.x + dz * fwd.z) / (fl * (d || 1));
      if (dot < 0.35 && d > 1.1) continue;
      const score = d - dot * 1.5;
      if (score < bestScore) {
        bestScore = score;
        best = it;
      }
    }
    if (!best) return this.ui.setPrompt('');
    const lockedNoKey = best.type === 'crate' && best.obj.locked && p.inv.key <= 0;
    let text = `<b>E</b> ${best.label}`;
    if (lockedNoKey) text = `<b>E</b> ${best.label} <i>(needs skeleton key)</i>`;
    if (best.type === 'hatch' && !this.level.unlocked)
      text = `The hatch is chained shut — <i>${this.level.needed - this.level.found} diamond(s) remain</i>`;
    this.ui.setPrompt(text);
    if (!input.wasPressed('KeyE')) return;
    switch (best.type) {
      case 'hide':
        p.enterHide(best.obj);
        break;
      case 'crate':
        this.level.openCrate(best.obj);
        break;
      case 'keeper':
        this.openShop();
        break;
      case 'hatch':
        if (this.level.unlocked) this.descend();
        else {
          this.audio.rattle();
          this.ui.message(`Find all ${this.level.needed} diamond(s) to break the chains.`, 'dim');
        }
        break;
    }
  }

  updateCamera(dt) {
    const p = this.player;
    if (!p) return;
    const cam = this.camera;
    let roll = 0;
    if (p.hidden) {
      const hc = p.hideCamera();
      const t = p.hideT * p.hideT * (3 - 2 * p.hideT);
      const f = p.hideFrom;
      cam.position.set(f.x + (hc.x - f.x) * t, f.y + (hc.y - f.y) * t, f.z + (hc.z - f.z) * t);
    } else {
      const moving = p.onGround && p.moving && p.trapped <= 0;
      const amt = moving ? (p.running ? 0.065 : p.crouch ? 0.02 : 0.035) : 0;
      this.bobAmt = damp(this.bobAmt || 0, amt, 8, dt);
      cam.position.set(p.pos.x, p.pos.y + p.eyeH + Math.sin(p.bob) * this.bobAmt, p.pos.z);
      roll = Math.cos(p.bob * 0.5) * this.bobAmt * 0.25;
    }
    if (!p.alive) {
      const t = Math.min(1, p.deathT / 1.2);
      cam.position.y = Math.max(0.25, p.pos.y + p.eyeH * (1 - t) + 0.25 * t);
      roll = t * 1.2;
    }
    const sh = p.shake * 0.06;
    cam.position.x += (Math.random() - 0.5) * sh;
    cam.position.y += (Math.random() - 0.5) * sh;
    cam.rotation.set(p.pitch + p.recoil * 0.06 + (Math.random() - 0.5) * sh * 0.5, p.yaw, roll);
    const targetFov = p.running && p.moving ? 79 : 72;
    this.fov = damp(this.fov, targetFov, 6, dt);
    if (Math.abs(cam.fov - this.fov) > 0.01) {
      cam.fov = this.fov;
      cam.updateProjectionMatrix();
    }

    // view model
    const vm = this.vm;
    vm.group.visible = p.alive && !p.hidden;
    const sway = Math.sin(p.bob) * (this.bobAmt || 0) * 0.6;
    vm.group.position.set(Math.cos(p.bob * 0.5) * (this.bobAmt || 0) * 0.5, sway - (p.crouch ? 0.02 : 0), 0);
    const rel = p.reloading > 0 ? Math.sin((1 - p.reloading / GUN.reloadTime) * Math.PI) : 0;
    vm.gun.rotation.set(p.recoil * 0.5 + rel * 0.6, 0, -rel * 0.9);
    vm.gun.position.set(0.2, -0.2 - rel * 0.12, -0.55 + p.recoil * 0.06);
    vm.flash.material.opacity = Math.max(0, vm.flash.material.opacity - dt * 14);
    vm.lens.material.color.setHex(p.flashlight ? 0xfff2cc : 0x222222);
  }

  updateLights(dt) {
    const p = this.player;
    const lvl = this.level;
    if (!p || !lvl) return;
    // flashlight with occasional nervous flicker
    this.lightFlicker -= dt;
    let fl = 1;
    const danger = this.chaseHold > 0;
    if (this.lightFlicker < 0) {
      if (Math.random() < (danger ? 0.08 : 0.01)) this.lightFlicker = 0.05 + Math.random() * 0.25;
      else this.lightFlicker = 0;
    } else fl = Math.random() < 0.5 ? 0.15 : 0.7;
    this.flashlight.intensity = p.flashlight && p.alive ? 90 * fl : 0;
    this.muzzle.intensity = Math.max(0, this.muzzle.intensity - dt * 160);
    // torches
    this.lightT = (this.lightT || 0) - dt;
    if (this.lightT <= 0) {
      this.lightT = 0.3;
      lvl.assignLights(this.torchLights, p.pos.x, p.pos.z);
    }
    for (const l of this.torchLights)
      if (l.userData.on) {
        const tc = l.userData.torch;
        l.intensity = 9 * (0.8 + Math.sin(this.time * 11 + tc.phase) * 0.1 + Math.random() * 0.12);
      }
    this.safeLight.intensity = 26 * (0.92 + Math.sin(this.time * 7) * 0.04 + Math.random() * 0.04);
  }

  updateAudio(dt) {
    const p = this.player;
    const cam = this.camera;
    const fwd = cam.getWorldDirection(new THREE.Vector3());
    this.audio.setListener(cam.position, fwd);
    if (this.state === 'dying') return;
    let nearest = Infinity;
    for (const e of this.level.enemies)
      if (e.hunting) nearest = Math.min(nearest, dist2D(e.pos.x, e.pos.z, p.pos.x, p.pos.z));
    if (nearest < 45) this.chaseHold = 4;
    else this.chaseHold -= dt;
    const mode = p.inSafe ? 'safe' : this.chaseHold > 0 ? 'chase' : 'explore';
    if (mode !== this.audio.mode) this.audio.setMode(mode);
    // heartbeat when danger is close or health is low
    this.heartCd -= dt;
    const hpFrac = p.health / p.maxHealth;
    const danger = clamp(1 - nearest / 14, 0, 1);
    const intensity = Math.max(danger, hpFrac < 0.35 ? 0.6 : 0);
    if (intensity > 0 && this.heartCd <= 0 && p.alive) {
      this.audio.heartbeat(0.4 + intensity * 0.6);
      this.heartCd = 1.1 - intensity * 0.6;
    }
    this.ui.el.vignette.style.opacity = (0.75 + intensity * 0.25).toFixed(2);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.__game = new Game();
});

export { PLAYER };
