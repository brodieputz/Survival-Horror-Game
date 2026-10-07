// Entry point: renderer, the day/night game flow and the main loop.
import * as THREE from 'three';
import { CampScene } from './camp.js';
import { BuildingScene } from './building.js';
import { Player } from './player.js';
import { AudioSys } from './audio.js';
import { UI } from './ui.js';
import { Input } from './input.js';
import { Particles } from './fx.js';
import { Combat } from './combat.js';
import { Enemy } from './enemies.js';
import { makeViewModel, makeFistsViewModel, makeGunModel } from './gunModels.js';
import { makeBearTrap } from './models.js';
import { makeMine, makeTripSpikes, makeKeroseneTank } from './props.js';
import { DAY_HOURS, TRAVEL_HOURS, BARRICADE, TURRETS, TRAPS, TRAP_ORDER } from './config.js';
import { WEAPONS, upgradeCost, UPG_MAX } from './weapons.js';
import * as R from './run.js';
import { damp, dist2D, clamp } from './util.js';

const SETTINGS_KEY = 'dreaddepths.settings';
const SPAWNS = {
  tent: { x: 21.5, z: 9.5, yaw: -Math.PI / 2 },
  table: { x: 22.6, z: 31.5, yaw: -Math.PI / 2 },
  night: { x: 31, z: 25.5, yaw: -Math.PI / 2 },
};

function mixPal(a, b, f) {
  const c = (x, y) => new THREE.Color(x).lerp(new THREE.Color(y), f).getHex();
  const n = (x, y) => x + (y - x) * f;
  return { sky: c(a.sky, b.sky), fog: c(a.fog, b.fog), hemiS: c(a.hemiS, b.hemiS), hemiG: c(a.hemiG, b.hemiG), sun: c(a.sun, b.sun), sunI: n(a.sunI, b.sunI), hemiI: n(a.hemiI, b.hemiI), fogD: n(a.fogD, b.fogD) };
}

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
    this.camera = new THREE.PerspectiveCamera(72, 1, 0.05, 320);
    this.camera.rotation.order = 'YXZ';
    this.scene.add(this.camera);

    this.hemi = new THREE.HemisphereLight(0x45455e, 0x1a100c, 0.85);
    this.scene.add(this.hemi);
    const sun = (this.sun = new THREE.DirectionalLight(0xffffff, 1));
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -95, right: 95, top: 60, bottom: -60, near: 1, far: 420 });
    sun.shadow.bias = -0.0006;
    this.scene.add(sun, sun.target);
    const fl = (this.flashlight = new THREE.SpotLight(0xfff0d2, 90, 32, 0.46, 0.5, 1.35));
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
      const l = new THREE.PointLight(0xff7a30, 0, 12, 1.3);
      this.scene.add(l);
      this.torchLights.push(l);
    }
    this.muzzle = new THREE.PointLight(0xffc870, 0, 14, 1.5);
    this.muzzle.position.set(0.25, -0.1, -0.7);
    this.camera.add(this.muzzle);
    this.vm = null;
    this.particles = new Particles(this.scene);
    this.combat = new Combat(this);

    this.audio = new AudioSys();
    this.audio.volume = { master: this.settings.master, music: this.settings.music, sfx: this.settings.sfx };
    this.input = new Input(this.canvas);
    this.input.sensitivity = this.settings.sens;
    this.run = null;
    this.ui = new UI(this);

    this.state = 'title';
    this.time = 0;
    this.player = null;
    this.level = null;
    this.placing = null;
    this.trip = null;
    this.frustum = new THREE.Frustum();
    this.projM = new THREE.Matrix4();
    this.sphere = new THREE.Sphere();
    this.chaseHold = 0;
    this.heartCd = 0;
    this.lightFlicker = 0;
    this.fov = 72;
    this.shriekMsgCd = 0;
    this.dawnT = 0;

    this.audio.occluded = (pos) => {
      if (!this.level || this.level.kind === 'camp') return false;
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
    this.showTitle();
    this.last = performance.now();
    requestAnimationFrame((t) => this.frame(t));
  }

  // ------------------------------------------------------------ setup
  bindButtons() {
    document.getElementById('startBtn').addEventListener('click', () => this.newRun());
    document.getElementById('continueBtn').addEventListener('click', () => this.continueRun());
    document.getElementById('resumeBtn').addEventListener('click', () => this.input.lock());
    document.getElementById('quitBtn').addEventListener('click', () => this.toTitle());
    document.getElementById('retryBtn').addEventListener('click', () => this.newRun());
    document.getElementById('panelClose').addEventListener('click', () => this.closePanel());
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

  showTitle() {
    const best = R.bestNights();
    const saved = R.loadRun();
    this.ui.showTitle(true, best ? `Longest run: ${best} ${best === 1 ? 'night' : 'nights'}` : '', saved ? `CONTINUE — DAY ${saved.day}, ${saved.locality.name}` : '');
  }

  // ------------------------------------------------------------ helpers used by scenes
  holderOfUid(uid) {
    return R.holderOf(this.run, uid);
  }
  gunModelFor(id) {
    return makeGunModel(WEAPONS[id]);
  }

  refreshViewModel() {
    if (this.vm) this.camera.remove(this.vm.group);
    const w = this.player?.weapon();
    this.vm = w ? makeViewModel(WEAPONS[w.id]) : makeFistsViewModel();
    this.camera.add(this.vm.group);
  }

  muzzleFlash(def) {
    if (!this.vm) return;
    if (['melee', 'bow', 'thrown'].includes(def.cat)) return;
    this.vm.flash.material.opacity = def.cat === 'flame' ? 0.5 : 1;
    this.muzzle.intensity = def.cat === 'flame' ? 12 : 25;
  }

  // ------------------------------------------------------------ run flow
  newRun() {
    this.audio.init();
    R.clearRun();
    this.run = R.newRun();
    this.startRun(true);
  }

  continueRun() {
    this.audio.init();
    const run = R.loadRun();
    if (!run) return this.newRun();
    this.run = run;
    this.startRun(false);
  }

  startRun(fresh) {
    this.ui.showTitle(false);
    this.ui.showGameOver(null, false);
    this.ui.hideDeath();
    this.ui.closePanel();
    this.player = new Player(this);
    this.enterCamp(this.run.phase === 'night' ? 'night' : 'tent');
    this.state = 'playing';
    this.ui.showHud(true);
    this.ui.fadeV = 1;
    this.ui.fade(0, 2);
    this.input.lock();
    this.audio.setMode('safe');
    if (fresh) {
      this.ui.banner(`DAY ${this.run.day}`, `${this.run.locality.name} · ${R.BIOMES[this.run.locality.biome].name}`, 4);
      this.ui.message('Study the maps on the table to find places to search. Sleep in your tent to end the day.', '', 9);
    } else this.ui.banner(`DAY ${this.run.day}`, this.run.locality.name, 3);
  }

  disposeLevel() {
    this.stopPlacing();
    if (this.level) {
      this.level.dispose();
      this.level = null;
    }
    this.combat.clear();
    this.ui.toggleMap(false);
  }

  enterCamp(spawn) {
    this.disposeLevel();
    new CampScene(this);
    const p = this.player;
    p.resetTransient();
    p.spawn(SPAWNS[spawn] || SPAWNS.tent);
    this.setEnvironment();
    this.refreshViewModel();
    this.level.assignLights(this.torchLights, p.pos.x, p.pos.z);
    this.updateCamera(0);
  }

  enterLocation(loc, compIds) {
    const run = this.run;
    if (run.phase !== 'day' || run.hours < loc.hours || loc.searched || loc.claimed) return;
    run.hours -= loc.hours;
    const comps = compIds.map((id) => run.survivors.find((s) => s.id === id)).filter((s) => s && s.status === 'camp' && s.hp > 0);
    this.trip = { loc, found: [], recruits: [], kills: 0, lost: [] };
    this.closePanel(false);
    this.transition(() => {
      this.disposeLevel();
      new BuildingScene(this, loc, comps);
      const p = this.player;
      p.resetTransient();
      p.spawn(this.level.d.spawn);
      this.setEnvironment();
      this.refreshViewModel();
      this.level.assignLights(this.torchLights, p.pos.x, p.pos.z);
      const L = R.LOCATION_TYPES[loc.type];
      this.ui.banner(loc.name.toUpperCase(), `${L.name} · danger ${'☠'.repeat(loc.difficulty)}`, 3.5);
      this.audio.setMode('explore');
      this.input.lock();
    });
  }

  leaveBuilding() {
    const run = this.run;
    const trip = this.trip;
    trip.loc.searched = true;
    run.stats.searched++;
    this.transition(() => {
      this.enterCamp('table');
      const lines = [];
      lines.push({ text: `You made it back from ${trip.loc.name}.` });
      if (trip.found.length) lines.push({ kind: 'good', text: `Found: ${R.summarizeItems(trip.found).join(', ')}.` });
      else lines.push({ kind: 'muted', text: 'You came back empty-handed.' });
      for (const n of trip.recruits) lines.push({ kind: 'good', text: `${n} joined the camp.` });
      for (const n of trip.lost) lines.push({ kind: 'bad', text: `${n} didn't make it.` });
      if (trip.kills) lines.push({ text: `Zombies put down: ${trip.kills}.` });
      this.trip = null;
      if (run.hours <= 0) lines.push(...this.startDusk());
      else lines.push({ kind: 'gold', text: `${run.hours} hours of daylight left.` });
      R.saveRun(run);
      this.audio.setMode('safe');
      this.openPanel('report', lines, 'BACK AT CAMP');
    });
  }

  resolveExpeditionsNow() {
    const lines = R.resolveExpeditions(this.run);
    if (lines.length && this.level?.kind === 'camp') this.level.spawnSurvivors();
    return lines;
  }

  // Daylight is gone: returns report lines.
  startDusk() {
    const run = this.run;
    run.phase = 'dusk';
    const lines = [{ kind: 'gold', text: 'The sun is setting. Prepare the camp, then sleep in your tent.' }, ...this.resolveExpeditionsNow()];
    this.setEnvironment();
    this.ui.banner('DUSK', 'Night is coming', 3);
    return lines;
  }

  requestSleep() {
    const run = this.run;
    if (run.phase === 'day' && run.hours > 0) this.openPanel('sleep');
    else this.sleep();
  }

  sleep() {
    const run = this.run;
    if (run.phase === 'night' || this.level?.kind !== 'camp') return;
    this.closePanel(false);
    this.transition(
      () => {
        const lines = this.resolveExpeditionsNow();
        run.phase = 'night';
        const camp = this.level;
        camp.spawnSurvivors();
        camp.setGate(false);
        this.nightLost = [];
        this.nightKills0 = run.stats.kills;
        if (Math.random() < R.waveChance(run)) {
          const comp = R.waveComposition(run);
          run.wavesFaced++;
          camp.startWave(comp);
          const p = this.player;
          p.resetTransient();
          p.spawn(SPAWNS.night);
          p.flashlight = true;
          this.setEnvironment();
          this.nightReport = { lines, quiet: false };
          this.ui.banner(`NIGHT ${run.day}`, 'Something is coming across the field...', 4);
          this.audio.horn();
          this.audio.setMode('chase');
          this.input.lock();
          return true;
        }
        run.stats.quietNights++;
        this.nightReport = { lines, quiet: true };
        this.ui.banner('A QUIET NIGHT', 'Nothing came out of the dark.', 3.5);
        this.state = 'sleeping';
        this.quietT = 3.5;
        return 'dark';
      },
      1.4,
      1.4
    );
  }

  onWaveCleared() {
    this.run.stats.waves++;
    this.ui.banner('THE HORDE IS BROKEN', 'Dawn is coming.', 3.5);
    this.audio.dawn();
    this.dawnT = 4.5;
  }

  morning() {
    const run = this.run;
    this.transition(
      () => {
        const camp = this.level;
        const nr = this.nightReport || { lines: [], quiet: true };
        const lines = [...nr.lines];
        if (nr.quiet) lines.push({ kind: 'muted', text: 'The night passed quietly.' });
        else {
          lines.push({ kind: 'good', text: `You held the camp through night ${run.day}. ${run.stats.kills - this.nightKills0} zombies killed.` });
          for (const n of this.nightLost) lines.push({ kind: 'bad', text: `${n} died defending the camp.` });
          const b = run.barricade;
          if (b.hp <= 0) lines.push({ kind: 'bad', text: 'The barricade is in ruins. Rebuild it with scrap.' });
          else if (b.hp < R.barricadeMax(run)) lines.push({ text: `The barricade is at ${Math.ceil(b.hp)} / ${R.barricadeMax(run)}.` });
        }
        run.day++;
        run.hours = DAY_HOURS;
        run.phase = 'day';
        camp.clearNight();
        camp.spawnSurvivors();
        camp.setGate(true);
        this.combat.clear();
        const p = this.player;
        p.resetTransient();
        p.spawn(SPAWNS.tent);
        this.setEnvironment();
        this.audio.setMode('safe');
        this.audio.dawn();
        lines.push({ kind: 'gold', text: `Tonight's chance of an attack: ${Math.round(R.waveChance(run) * 100)}%.` });
        this.nightReport = null;
        R.saveRun(run);
        this.ui.banner(`DAY ${run.day}`, `${run.locality.name}`, 3);
        this.openPanel('report', lines, `DAWN — DAY ${run.day}`);
      },
      1.0,
      1.6
    );
  }

  travelTo(i) {
    const run = this.run;
    const opt = run.region.options[i];
    if (!opt || run.coal < opt.coal || run.phase !== 'day' || run.hours < TRAVEL_HOURS) return;
    if (run.survivors.some((s) => s.status === 'away')) return;
    this.closePanel(false);
    run.hours -= TRAVEL_HOURS;
    this.audio.whistle();
    this.transition(
      () => {
        R.travel(run, opt);
        this.enterCamp('table');
        const lines = [{ text: `The train rolls into ${run.locality.name}.` }, { kind: 'muted', text: `${R.BIOMES[run.locality.biome].name} country. New places to search.` }];
        if (run.hours <= 0) lines.push(...this.startDusk());
        this.ui.banner(run.locality.name.toUpperCase(), R.BIOMES[run.locality.biome].name, 3.5);
        R.saveRun(run);
        this.input.lock();
      },
      1.8,
      2.0
    );
  }

  // Fade to black, run fn, fade back in. fn may return 'dark' to stay black.
  transition(fn, out = 0.8, inT = 1.2) {
    if (this.state === 'transition') return;
    this.stopPlacing();
    this.state = 'transition';
    this.ui.setPrompt('');
    this.ui.fade(1, out);
    this.transQ = { t: out + 0.05, fn, inT };
  }

  toTitle() {
    const run = this.run;
    if (run && this.level?.kind === 'camp' && run.phase !== 'night') R.saveRun(run);
    this.disposeLevel();
    this.state = 'title';
    this.ui.showPause(false);
    this.ui.closePanel();
    this.ui.showHud(false);
    this.showTitle();
    this.audio.setMode('safe');
    if (this.audio.ctx) this.audio.ctx.resume();
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
    if (this.state === 'panel') {
      if (e.code === 'Escape' || e.code === 'KeyE') this.closePanel();
      return;
    }
    if (this.state === 'gameover' && (e.code === 'Enter' || e.code === 'Space')) this.newRun();
    if (this.state === 'title' && e.code === 'Enter') R.loadRun() ? this.continueRun() : this.newRun();
  }

  // ------------------------------------------------------------ panels
  openPanel(kind, arg, title) {
    this.stopPlacing();
    this.state = 'panel';
    this.input.unlock();
    this.ui.setPrompt('');
    this.ui.openPanel(kind, arg);
    if (title) {
      this.ui.panel.title = title;
      this.ui.renderPanel();
    }
    this.audio.uiClick();
  }

  closePanel(relock = true) {
    const was = this.ui.panel;
    this.ui.closePanel();
    if (this.state === 'panel') this.state = 'playing';
    this.input.pressed.clear();
    if (was && this.level?.kind === 'camp' && this.run.phase !== 'night') R.saveRun(this.run);
    if (relock && this.state === 'playing') this.input.lock();
  }

  afterGearChange() {
    const lo = this.run.loadout;
    if (lo.primary != null && !R.weaponByUid(this.run, lo.primary)) lo.primary = null;
    if (lo.secondary != null && !R.weaponByUid(this.run, lo.secondary)) lo.secondary = null;
    this.refreshViewModel();
    if (this.level?.kind === 'camp') {
      this.level.refreshRack();
      this.level.refreshSurvivorGear();
    }
  }

  panelAction(act, ds) {
    const run = this.run;
    const P = this.ui.panel;
    const camp = this.level?.kind === 'camp' ? this.level : null;
    const survivor = (id) => run.survivors.find((s) => s.id === +id);
    switch (act) {
      case 'close':
        this.closePanel();
        return;
      case 'selw':
        P.sel = +ds.uid;
        break;
      case 'equip': {
        if (P.sel == null) break;
        R.unassign(run, P.sel);
        if (+ds.slot === 0) run.loadout.primary = P.sel;
        else run.loadout.secondary = P.sel;
        this.player.slot = +ds.slot;
        this.afterGearChange();
        this.audio.click(0.5);
        break;
      }
      case 'rack':
        if (P.sel != null) R.unassign(run, P.sel);
        this.afterGearChange();
        break;
      case 'give': {
        const s = survivor(ds.id);
        const inst = R.weaponByUid(run, P.sel);
        if (!s || !inst || WEAPONS[inst.id].noSurvivor) break;
        R.unassign(run, inst.uid);
        s.weapon = inst.uid;
        this.afterGearChange();
        this.audio.click(0.5);
        break;
      }
      case 'upg': {
        const inst = R.weaponByUid(run, P.sel);
        if (!inst) break;
        const def = WEAPONS[inst.id];
        inst.up = inst.up || {};
        const lv = inst.up[ds.key] || 0;
        const cost = upgradeCost(def, lv);
        if (lv >= UPG_MAX || run.scrap < cost) break;
        run.scrap -= cost;
        inst.up[ds.key] = lv + 1;
        this.audio.hammer();
        this.afterGearChange();
        break;
      }
      case 'heal': {
        const s = survivor(P.arg);
        if (!s || run.medkits <= 0) break;
        const max = R.survivorMaxHp(s);
        run.medkits--;
        s.hp = Math.min(max, s.hp + Math.round(max * 0.6));
        this.audio.pickup();
        break;
      }
      case 'stake': {
        const s = survivor(P.arg);
        if (s && s.weapon != null) R.unassign(run, s.weapon);
        this.afterGearChange();
        break;
      }
      case 'sgive': {
        const s = survivor(P.arg);
        if (!s) break;
        R.unassign(run, +ds.uid);
        s.weapon = +ds.uid;
        this.afterGearChange();
        this.audio.click(0.5);
        break;
      }
      case 'repair': {
        const b = run.barricade;
        const max = R.barricadeMax(run);
        let want = ds.amt === 'all' ? max - b.hp : Math.min(60, max - b.hp);
        const cost = Math.min(run.scrap, Math.ceil(want / BARRICADE.hpPerScrap));
        if (cost <= 0) break;
        want = Math.min(want, cost * BARRICADE.hpPerScrap);
        const wasDown = b.hp <= 0;
        run.scrap -= cost;
        b.hp = Math.min(max, b.hp + want);
        this.audio.hammer();
        if (camp && wasDown) {
          camp.buildBarricade();
          camp.computeFlow();
        }
        break;
      }
      case 'improve': {
        const b = run.barricade;
        const cost = BARRICADE.improveCost(b.level);
        if (b.level >= BARRICADE.maxLevel || run.scrap < cost) break;
        run.scrap -= cost;
        b.level++;
        b.hp = Math.min(R.barricadeMax(run), b.hp + BARRICADE.perLevel);
        this.audio.hammer();
        if (camp) {
          camp.buildBarricade();
          camp.computeFlow();
        }
        break;
      }
      case 'build': {
        const d = TURRETS[ds.type];
        const i = P.arg;
        if (run.turrets[i] || run.blueprints[ds.type] <= 0 || run.scrap < d.cost) break;
        run.scrap -= d.cost;
        run.blueprints[ds.type]--;
        run.turrets[i] = { type: ds.type };
        camp?.buildTurrets();
        this.audio.hammer();
        this.ui.message(`${d.name} mounted on car ${i + 1}.`, 'good');
        break;
      }
      case 'tab':
        P.tab = ds.tab;
        P.sel = null;
        break;
      case 'loc':
        P.sel = +ds.id;
        P.comps.clear();
        break;
      case 'comp': {
        const id = +ds.id;
        if (P.comps.has(id)) P.comps.delete(id);
        else P.comps.add(id);
        break;
      }
      case 'search': {
        const loc = run.locality.locations.find((l) => l.id === P.sel);
        if (loc) this.enterLocation(loc, [...P.comps]);
        return;
      }
      case 'send': {
        const s = survivor(ds.id);
        const loc = run.locality.locations.find((l) => l.id === P.sel);
        if (!s || !loc || loc.searched || loc.claimed || s.status !== 'camp') break;
        run.expeditions.push({ survivorId: s.id, locId: loc.id });
        s.status = 'away';
        loc.claimed = true;
        P.comps.delete(s.id);
        camp?.spawnSurvivors();
        this.ui.message(`${s.name} heads out for ${loc.name}. They'll be back at dusk.`, 'good', 4);
        break;
      }
      case 'rsel':
        P.sel = 'r' + ds.i;
        break;
      case 'travel':
        this.travelTo(+ds.i);
        return;
      case 'sleepyes':
        this.sleep();
        return;
    }
    if (this.ui.panel) this.ui.renderPanel();
  }

  // ------------------------------------------------------------ trap placement
  startPlacing() {
    const run = this.run;
    if (this.level?.kind !== 'camp' || run.phase === 'night') return;
    if (run.phase !== 'day' && run.phase !== 'dusk') return;
    const type = TRAP_ORDER.find((t) => run.traps[t] > 0);
    if (!type) {
      this.ui.message('You have no traps. Scavenge some first.', 'dim');
      return;
    }
    this.placing = { type, error: null, ok: false };
    this.makeGhost();
    this.ui.message('Aim at the ground beyond the barricade and click to set a trap.', 'dim', 4);
  }

  makeGhost() {
    if (this.ghost) this.scene.remove(this.ghost);
    const t = this.placing.type;
    const g = t === 'bear' ? makeBearTrap().group : t === 'mine' ? makeMine().group : t === 'tripwire' ? makeTripSpikes(6).group : makeKeroseneTank();
    this.ghostMat = new THREE.MeshBasicMaterial({ color: 0x6aff6a, transparent: true, opacity: 0.55, depthWrite: false });
    g.traverse((o) => {
      if (o.isMesh) o.material = this.ghostMat;
      if (o.isSprite) o.visible = false;
    });
    this.ghost = g;
    this.scene.add(g);
  }

  stopPlacing() {
    this.placing = null;
    if (this.ghost) this.scene.remove(this.ghost);
    this.ghost = null;
  }

  updatePlacing() {
    const pl = this.placing;
    const input = this.input;
    const run = this.run;
    if (input.wasPressed('KeyT') || input.wasPressed('KeyE')) return this.stopPlacing();
    let idx = TRAP_ORDER.indexOf(pl.type);
    for (let k = 0; k < 4; k++) if (input.wasPressed('Digit' + (k + 1))) idx = k;
    if (input.wheel) idx = (idx + (input.wheel > 0 ? 1 : 3)) % 4;
    if (TRAP_ORDER[idx] !== pl.type) {
      pl.type = TRAP_ORDER[idx];
      this.makeGhost();
    }
    const cam = this.camera;
    const o = cam.getWorldPosition(new THREE.Vector3());
    const d = cam.getWorldDirection(new THREE.Vector3());
    pl.error = null;
    let x = 0;
    let z = 0;
    if (d.y > -0.03) pl.error = 'Aim at the ground.';
    else {
      const t = -o.y / d.y;
      if (t > 40) pl.error = 'Too far away.';
      x = o.x + d.x * t;
      z = o.z + d.z * t;
    }
    if (!pl.error) pl.error = this.level.canPlaceTrap(pl.type, x, z);
    if (!pl.error && run.traps[pl.type] <= 0) pl.error = `No ${TRAPS[pl.type].name.toLowerCase()}s left.`;
    this.ghost.visible = d.y < -0.03;
    this.ghost.position.set(x, 0, z);
    this.ghostMat.color.setHex(pl.error ? 0xff4a3a : 0x6aff6a);
    if (input.clicked && !pl.error) {
      this.level.placeTrap(pl.type, x, z);
      this.audio.click(0.8);
      this.ui.message(`${TRAPS[pl.type].name} set.`, 'good');
      if (run.traps[pl.type] <= 0) {
        const next = TRAP_ORDER.find((t) => run.traps[t] > 0);
        if (!next) return this.stopPlacing();
        pl.type = next;
        this.makeGhost();
      }
    }
  }

  // ------------------------------------------------------------ events from entities
  emitNoise(x, z, r, kind) {
    if (!this.level || this.level.kind !== 'building') return;
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
      if (!e.alive || e.type === 'angel' || e.stun > 0 || e.mode === 'wave') continue;
      let knows = false;
      if (e.type === 'hound') knows = e.canSee(true) || (['chase', 'alert', 'shriek', 'bark'].includes(e.state) && e.dist() < 40);
      else if (e.type === 'brute') knows = (e.state === 'charge' || e.enraged > 0) && e.dist() < 9;
      else knows = e.canSee(true);
      if (!knows) continue;
      e.knowsSpot = spot;
      e.foe = null;
      if (e.type === 'hound') {
        if (e.state !== 'shriek') e.setState('bark');
      } else if (e.state !== 'fight') e.setState('pullout');
    }
  }

  pullOut(enemy, dmg) {
    const p = this.player;
    if (!p.hidden) return;
    p.exitHide(true);
    p.yaw = Math.atan2(-(enemy.pos.x - p.pos.x), -(enemy.pos.z - p.pos.z));
    p.invuln = 0;
    p.damage(dmg, enemy.type);
    p.invuln = 0.9;
    this.audio.growl(enemy.voice, enemy.pos, 1.4);
    if (p.alive) this.ui.message('It saw you hide. You are dragged out!', 'bad');
  }

  killPlayer(cause) {
    const p = this.player;
    if (!p.alive) return;
    p.invuln = 0;
    p.damage(9999, cause);
  }

  onZombieKilled(e, src, info) {
    const run = this.run;
    const lvl = this.level;
    run.stats.kills++;
    if (this.trip && lvl.kind === 'building') this.trip.kills++;
    const xp = e.s.xp;
    if (src === this.player) {
      run.player.kills++;
      const lv = R.grantXp(run.player, xp);
      if (lv) {
        this.player.health = Math.min(this.player.maxHealth, this.player.health + 10 * lv);
        this.ui.message(`LEVEL UP! You are now level ${run.player.level}.`, 'level', 4);
        this.audio.buy();
      }
    } else if (src && src.rec) {
      src.rec.kills = (src.rec.kills || 0) + 1;
      const lv = R.grantXp(src.rec, xp);
      if (lv) {
        src.rec.hp += 10 * lv;
        src.equip();
        this.ui.message(`${src.rec.name} reached level ${src.rec.level}.`, 'level', 3);
      }
    }
    // explosions can leave the legless still crawling
    if (info.explosive && !info.noCrawler && !['crawler', 'hound', 'brute', 'angel'].includes(e.type) && Math.random() < 0.3) {
      const x = e.pos.x;
      const z = e.pos.z;
      setTimeout(() => {
        if (this.level !== lvl || this.state === 'gameover') return;
        if (lvl.kind === 'camp' && lvl.wave?.active) lvl.spawnZombie('crawler', x + 0.4, z, e.mul);
        else if (lvl.kind === 'building') lvl.enemies.push(new Enemy(this, 'crawler', x, z, { group: lvl.group }));
      }, 900);
    }
  }

  onSurvivorDied(actor) {
    const run = this.run;
    run.stats.lost++;
    this.ui.message(`${actor.rec.name} is dead${actor.lostWeapon ? ` — the ${actor.lostWeapon} is lost` : ''}.`, 'bad', 5);
    this.audio.stinger();
    if (this.trip && this.level?.kind === 'building') this.trip.lost.push(actor.rec.name);
    if (this.nightLost && run.phase === 'night') this.nightLost.push(actor.rec.name);
  }

  playerDied(cause) {
    const p = this.player;
    if (!p.alive) return;
    p.alive = false;
    p.deathT = 0;
    if (p.hidden) p.exitHide(true);
    this.stopPlacing();
    this.state = 'dying';
    this.deathCause = cause;
    if (cause === 'angel') this.audio.stinger();
    this.audio.death();
    this.audio.setMode('dead');
    this.ui.toggleMap(false);
    R.clearRun();
    setTimeout(() => {
      if (this.state === 'dying') this.ui.showDeath(cause);
    }, 900);
  }

  gameOver() {
    const run = this.run;
    const nights = run.day - 1;
    const best = R.recordBest(nights);
    this.state = 'gameover';
    this.ui.hideDeath();
    this.ui.showHud(false);
    this.input.unlock();
    this.ui.showGameOver({ nights, waves: run.stats.waves, kills: run.stats.kills, searched: run.stats.searched, localities: run.stats.localities, recruited: run.stats.recruited, lost: run.stats.lost, level: run.player.level, best });
  }

  // Is the angel visible to the player right now?
  isObserved(e) {
    const p = this.player;
    if (!p.alive || p.hidden) return false;
    const cam = this.camera;
    const d = dist2D(e.pos.x, e.pos.z, cam.position.x, cam.position.z);
    if (d > 36) return false;
    if (!p.flashlight && d > 5 && !this.nearTorch(e.pos)) return false;
    this.projM.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse);
    this.frustum.setFromProjectionMatrix(this.projM);
    this.sphere.center.set(e.pos.x, 1.0, e.pos.z);
    this.sphere.radius = 0.7;
    if (!this.frustum.intersectsSphere(this.sphere)) return false;
    const w = this.level.world;
    const rx = Math.cos(p.yaw) * 0.32;
    const rz = -Math.sin(p.yaw) * 0.32;
    return w.los(cam.position.x, cam.position.z, e.pos.x, e.pos.z) || w.los(cam.position.x, cam.position.z, e.pos.x + rx, e.pos.z + rz) || w.los(cam.position.x, cam.position.z, e.pos.x - rx, e.pos.z - rz);
  }
  nearTorch(pos) {
    for (const l of this.torchLights) if (l.userData.on && dist2D(l.position.x, l.position.z, pos.x, pos.z) < 5) return true;
    return false;
  }

  anyHunting() {
    const p = this.player;
    return this.level.enemies.some((e) => e.hunting && dist2D(e.pos.x, e.pos.z, p.pos.x, p.pos.z) < 45);
  }

  // ------------------------------------------------------------ environment
  setEnvironment() {
    const lvl = this.level;
    const run = this.run;
    const b = R.BIOMES[run.locality.biome];
    const sun = this.sun;
    if (lvl.kind === 'camp') {
      let pal;
      if (run.phase === 'night') pal = b.tod.night;
      else if (run.phase === 'dusk') pal = b.tod.dusk;
      else pal = mixPal(b.tod.day, b.tod.dusk, clamp((4 - run.hours) / 4, 0, 1) * 0.8);
      this.scene.background = new THREE.Color(pal.sky);
      this.scene.fog = new THREE.FogExp2(pal.fog, pal.fogD);
      this.hemi.color.setHex(pal.hemiS);
      this.hemi.groundColor.setHex(pal.hemiG);
      this.hemi.intensity = pal.hemiI;
      sun.visible = true;
      sun.color.setHex(pal.sun);
      sun.intensity = pal.sunI;
      const low = run.phase === 'dusk' ? 0.3 : run.phase === 'night' ? 0.8 : clamp(run.hours / DAY_HOURS, 0.35, 1);
      sun.position.set(80 - 70 * (1 - low), 40 + 60 * low, 25 - 60);
      sun.target.position.set(80, 0, 25);
      sun.castShadow = run.phase !== 'night';
      this.camera.far = 330;
    } else {
      this.scene.background = new THREE.Color(b.tod.day.sky);
      this.scene.fog = new THREE.FogExp2(0x000000, 0.055);
      this.hemi.color.setHex(0x45455e);
      this.hemi.groundColor.setHex(0x1a100c);
      this.hemi.intensity = 0.85;
      sun.visible = false;
      sun.castShadow = false;
      this.camera.far = 90;
    }
    this.camera.updateProjectionMatrix();
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
    this.time += dt;
    if (s === 'playing' || s === 'dying') {
      const p = this.player;
      if (s === 'playing') {
        p.update(dt, this.input);
        if (this.placing) this.updatePlacing();
        else {
          this.handleInteraction();
          if (this.input.wasPressed('KeyT') && this.level.kind === 'camp') this.startPlacing();
        }
        if (this.input.wasPressed('KeyM') || this.input.wasPressed('Tab')) this.ui.toggleMap();
      } else {
        this.ui.setPrompt('');
        p.deathT += dt;
        if (p.deathT > 4) this.gameOver();
      }
      if (this.dawnT > 0) {
        this.dawnT -= dt;
        if (this.dawnT <= 0 && this.state === 'playing') this.morning();
      }
      this.updateCamera(dt);
      this.camera.updateMatrixWorld();
      this.level.update(dt);
      this.combat.update(dt);
      this.updateLights(dt);
      this.updateAudio(dt);
      this.particles.update(dt);
      this.shriekMsgCd -= dt;
      this.ui.update(dt);
    } else if (s === 'transition') {
      const q = this.transQ;
      q.t -= dt;
      if (q.t <= 0 && !q.done) {
        q.done = true;
        const res = q.fn();
        if (this.state === 'transition') this.state = 'playing';
        if (res !== 'dark') this.ui.fade(0, q.inT);
      }
      this.ui.update(dt);
    } else if (s === 'sleeping') {
      this.quietT -= dt;
      if (this.quietT <= 0) {
        this.state = 'playing';
        this.morning();
      }
      this.ui.update(dt);
    } else if (s === 'panel') {
      this.level?.update(dt * 0.0);
      this.ui.update(dt);
    } else this.ui.update(0);
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
    if (!best) return this.ui.setPrompt(this.level.kind === 'camp' && this.run.phase !== 'night' ? '' : '');
    this.ui.setPrompt(`<b>E</b> ${best.label}`);
    if (!input.wasPressed('KeyE')) return;
    switch (best.type) {
      case 'hide':
        p.enterHide(best.obj);
        break;
      case 'container':
        this.level.openContainer(best.obj);
        break;
      case 'recruit':
        this.level.recruit(best.obj);
        break;
      case 'exit':
        this.leaveBuilding();
        break;
      case 'tent':
        this.requestSleep();
        break;
      case 'maptable':
        this.openPanel('map', 'local');
        break;
      case 'rack':
        this.openPanel('armory');
        break;
      case 'trapcrate':
        this.startPlacing();
        break;
      case 'barricade':
        this.openPanel('barricade');
        break;
      case 'turret':
        this.openPanel('turret', best.idx);
        break;
      case 'survivor':
        this.openPanel('survivor', best.obj.rec.id);
        break;
      case 'pickup':
        this.level.pickUpTrap(best.obj);
        this.audio.click(0.6);
        this.ui.message(`Picked up the ${TRAPS[best.obj.rec.type].name.toLowerCase()}.`, 'dim');
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
    cam.rotation.set(p.pitch + p.recoil * 0.05 + (Math.random() - 0.5) * sh * 0.5, p.yaw, roll);
    const targetFov = p.running && p.moving ? 79 : 72;
    this.fov = damp(this.fov, targetFov, 6, dt);
    if (Math.abs(cam.fov - this.fov) > 0.01) {
      cam.fov = this.fov;
      cam.updateProjectionMatrix();
    }

    const vm = this.vm;
    if (!vm) return;
    vm.group.visible = p.alive && !p.hidden;
    const bob = this.bobAmt || 0;
    vm.group.position.set(Math.cos(p.bob * 0.5) * bob * 0.5, Math.sin(p.bob) * bob * 0.6 - (p.crouch ? 0.02 : 0), 0);
    const rel = p.reloading > 0 ? Math.sin((1 - p.reloading / p.reloadTotal) * Math.PI) : 0;
    const sw = p.switchT / 0.35;
    const base = vm.basePos;
    const def = vm.def;
    if (!def || def.cat === 'melee') {
      const k = p.swing;
      const arc = Math.sin(k * Math.PI);
      vm.gun.rotation.set(-arc * 1.1 + k * 0.4, arc * 0.5, -arc * 0.5);
      vm.gun.position.set(base[0] - arc * 0.12, base[1] + arc * 0.05 - sw * 0.3, base[2] - arc * 0.1);
    } else {
      vm.gun.rotation.set(p.recoil * 0.22 + rel * 0.6, 0, -rel * 0.9);
      vm.gun.position.set(base[0], base[1] - rel * 0.12 - sw * 0.3, base[2] + p.recoil * 0.05);
    }
    vm.flash.material.opacity = Math.max(0, vm.flash.material.opacity - dt * 14);
    if (vm.lens) vm.lens.material.color.setHex(p.flashlight ? 0xfff2cc : 0x222222);
    if (vm.model.spin) vm.model.spin.rotation.z += dt * (p.spin > 0 ? 40 * (p.spin / (def.spinUp || 1)) : 0);
  }

  updateLights(dt) {
    const p = this.player;
    const lvl = this.level;
    if (!p || !lvl) return;
    this.lightFlicker -= dt;
    let fl = 1;
    const danger = this.chaseHold > 0;
    if (this.lightFlicker < 0) {
      if (Math.random() < (danger ? 0.06 : 0.008)) this.lightFlicker = 0.05 + Math.random() * 0.25;
      else this.lightFlicker = 0;
    } else fl = Math.random() < 0.5 ? 0.15 : 0.7;
    const dayCamp = lvl.kind === 'camp' && this.run.phase === 'day';
    this.flashlight.intensity = p.flashlight && p.alive && !dayCamp ? 90 * fl : 0;
    this.flashlight.castShadow = lvl.kind === 'building';
    this.muzzle.intensity = Math.max(0, this.muzzle.intensity - dt * 160);
    this.lightT = (this.lightT || 0) - dt;
    if (this.lightT <= 0) {
      this.lightT = 0.3;
      lvl.assignLights(this.torchLights, p.pos.x, p.pos.z);
    }
    for (const l of this.torchLights)
      if (l.userData.on) {
        const tc = l.userData.torch;
        const on = tc.on ?? 1;
        l.intensity = (tc.power ?? 7) * on * (0.8 + Math.sin(this.time * 11 + tc.phase) * 0.1 + Math.random() * 0.12);
      }
  }

  updateAudio(dt) {
    const p = this.player;
    const cam = this.camera;
    const fwd = cam.getWorldDirection(new THREE.Vector3());
    this.audio.setListener(cam.position, fwd);
    if (this.state === 'dying') return;
    const lvl = this.level;
    let nearest = Infinity;
    for (const e of lvl.enemies) if (e.alive && e.hunting) nearest = Math.min(nearest, dist2D(e.pos.x, e.pos.z, p.pos.x, p.pos.z));
    let mode;
    if (lvl.kind === 'camp') {
      if (lvl.wave?.active) mode = 'chase';
      else if (this.run.phase === 'night') mode = 'explore';
      else mode = 'safe';
    } else {
      if (nearest < 45) this.chaseHold = 4;
      else this.chaseHold -= dt;
      mode = this.chaseHold > 0 ? 'chase' : 'explore';
    }
    if (mode !== this.audio.mode) this.audio.setMode(mode);
    this.heartCd -= dt;
    const hpFrac = p.health / p.maxHealth;
    const danger = clamp(1 - nearest / 14, 0, 1);
    const intensity = Math.max(danger, hpFrac < 0.35 ? 0.6 : 0);
    if (intensity > 0 && this.heartCd <= 0 && p.alive) {
      this.audio.heartbeat(0.4 + intensity * 0.6);
      this.heartCd = 1.1 - intensity * 0.6;
    }
    const dayCamp = lvl.kind === 'camp' && this.run.phase !== 'night';
    this.ui.el.vignette.style.opacity = (dayCamp ? 0.35 : 0.75 + intensity * 0.25).toFixed(2);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.__game = new Game();
});
