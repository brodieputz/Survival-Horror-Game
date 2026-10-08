// DOM HUD, minimaps and the camp management panels (armory, survivors,
// barricade, turrets, local & regional maps, reports).
import { TILE, TRAPS, TRAP_ORDER, TURRETS, TURRET_ORDER, BARRICADE, TRAVEL_HOURS } from './config.js';
import { WEAPONS, WEAPON_LIST, RARITY, RARITY_ORDER, AMMO, AMMO_ORDER, CATEGORY, UPGRADES, UPG_MAX, upgradeKeys, weaponStats, isExplosive } from './weapons.js';
import {
  BIOMES,
  LOCATION_TYPES,
  xpToNext,
  survivorMaxHp,
  survivorSpeed,
  survivorStamina,
  survivorAim,
  barricadeMax,
  weaponByUid,
  holderOf,
  expeditionChance,
  waveChance,
  calendar,
  season,
  SEASONS,
  bloodMoon,
  mouthsToFeed,
  appraisal,
  TAG_NAMES,
  DOG_BITE,
  searchHours,
  tripCoal,
  hpPerScrap,
  reinforceCost,
  upgCost,
  PROFS,
  profSkill,
  survivorTitle,
} from './run.js';
import { RAIL_EVENTS, canAfford } from './railevents.js';
import { BRANCHES, PERKS, PERK, hasPerk, perkStats } from './perks.js';
import { CITIES, CITY, US_OUTLINE, LAKES, MAP_ASPECT, project, SIZE_NAMES, citySize } from './cities.js';

// Where a city sits on the regional map canvas (and, as fractions, on the
// overlaid markers). The map keeps the lower 48's real proportions.
const RMAP = { W: 1280, H: 720, pad: 26 };
{
  let mh = RMAP.H - RMAP.pad * 2;
  let mw = mh * MAP_ASPECT;
  if (mw > RMAP.W - RMAP.pad * 2) {
    mw = RMAP.W - RMAP.pad * 2;
    mh = mw / MAP_ASPECT;
  }
  Object.assign(RMAP, { mw, mh, ox: (RMAP.W - mw) / 2, oy: (RMAP.H - mh) / 2 });
}
function mapXY(lat, lon) {
  const [u, v] = project(lat, lon);
  return [RMAP.ox + u * RMAP.mw, RMAP.oy + v * RMAP.mh];
}
const CLIMATE_TINT = { forest: '74,110,64', desert: '196,140,80', tundra: '200,214,226', plains: '190,170,96', swamp: '80,110,82' };

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const DEATH_TEXT = {
  walker: 'Dragged down by the shambling dead.',
  runner: 'Run down by a sprinting corpse.',
  grunt: 'Torn apart by a Grunt.',
  fat: 'Crushed under a Bloater.',
  rotter: 'Rotted hands found your throat.',
  armored: 'Beaten down by a Riot Zombie.',
  crawler: 'Something crawled out of the dark and bit.',
  hound: 'Mauled by a Blood Hound.',
  brute: 'Crushed by the Blind Brute.',
  spitter: 'Dissolved by a Spitter\'s bile.',
  acid: 'Dissolved by a Spitter\'s bile.',
  lurker: 'Something lying among the bodies was not dead.',
  cold: 'Froze in the night.',
  raider: 'Gunned down by raiders.',
  spikes: 'Impaled on rusted spikes.',
  beartrap: 'Bled out in the jaws of a trap.',
  explosion: 'Caught in your own blast.',
  fire: 'Burned alive.',
  starvation: 'You starved to death.',
};

const skulls = (n) => '☠'.repeat(n);
const bar = (v, max) => `<div class="sbar"><i style="width:${Math.max(0, Math.min(100, (v / max) * 100)).toFixed(0)}%"></i></div>`;
const rname = (def) => `<span style="color:${RARITY[def.rarity].color}">${esc(def.name)}</span>`;

export class UI {
  constructor(game) {
    this.game = game;
    this.el = {};
    for (const id of [
      'hud', 'dayLine', 'phaseLine', 'locLine', 'res', 'barBox', 'barFill', 'barText', 'waveText', 'squad', 'miniHint', 'lvlText', 'xpText',
      'xpFill', 'hpFill', 'hpText', 'stFill', 'status', 'trapHud', 'inv', 'wname', 'ammo', 'ammoSub', 'cross', 'prompt', 'msgs', 'banner',
      'bannerT', 'bannerS', 'hurt', 'hideMask', 'fade', 'title', 'pause', 'panel', 'panelTitle', 'panelSub', 'panelBody', 'mapScreen',
      'bigmap', 'death', 'deathCause', 'deathSub', 'gameover', 'goStats', 'minimap', 'bestLine', 'vignette', 'mapLegend', 'continueBtn', 'battery',
    ])
      this.el[id] = $(id);
    this.mini = this.el.minimap.getContext('2d');
    this.big = this.el.bigmap.getContext('2d');
    this.cache = {};
    this.messages = [];
    this.bannerT = 0;
    this.hurtV = 0;
    this.fadeV = 0;
    this.fadeTarget = 0;
    this.fadeSpeed = 1;
    this.mapOpen = false;
    this.panel = null;
    this.bindSettings();
    this.el.panelBody.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]');
      if (!b || b.disabled) return;
      this.game.panelAction(b.dataset.act, b.dataset);
    });
  }

  set(key, el, value, prop = 'textContent') {
    if (this.cache[key] === value) return;
    this.cache[key] = value;
    el[prop] = value;
  }

  // ------------------------------------------------------------ messages
  message(text, kind = '', dur = 3) {
    const div = document.createElement('div');
    div.className = 'msg ' + kind;
    div.textContent = text;
    this.el.msgs.prepend(div);
    this.messages.push({ div, t: dur });
    while (this.el.msgs.children.length > 6) {
      const last = this.el.msgs.lastChild;
      this.el.msgs.removeChild(last);
      this.messages = this.messages.filter((m) => m.div !== last);
    }
  }
  banner(title, sub = '', dur = 3) {
    this.el.bannerT.innerHTML = title;
    this.el.bannerS.textContent = sub;
    this.el.banner.classList.add('show');
    this.bannerT = dur;
  }
  hurt(v) {
    this.hurtV = Math.min(1, this.hurtV + v * 0.9 + 0.2);
  }
  fade(to, seconds = 1) {
    this.fadeTarget = to;
    this.fadeSpeed = 1 / Math.max(0.01, seconds);
  }

  // ------------------------------------------------------------ per frame
  update(dt) {
    const g = this.game;
    const p = g.player;
    const run = g.run;
    const lvl = g.level;
    for (const m of this.messages) {
      m.t -= dt;
      if (m.t < 0.6) m.div.style.opacity = Math.max(0, m.t / 0.6);
      if (m.t <= 0) m.div.remove();
    }
    this.messages = this.messages.filter((m) => m.t > 0);
    if (this.bannerT > 0) {
      this.bannerT -= dt;
      if (this.bannerT <= 0) this.el.banner.classList.remove('show');
    }
    if (this.fadeV !== this.fadeTarget) {
      const s = this.fadeSpeed * dt;
      this.fadeV = this.fadeV < this.fadeTarget ? Math.min(this.fadeTarget, this.fadeV + s) : Math.max(this.fadeTarget, this.fadeV - s);
      this.el.fade.style.opacity = this.fadeV.toFixed(3);
    }
    if (!p || !lvl || !run) return;
    this.hurtV = Math.max(0, this.hurtV - dt * 1.2);
    const lowHp = p.alive && p.health / p.maxHealth < 0.3 ? 0.25 + Math.sin(g.time * 5) * 0.08 : 0;
    this.el.hurt.style.opacity = Math.max(this.hurtV, lowHp).toFixed(3);

    // top-left: day, phase, place, resources
    this.set('day', this.el.dayLine, `DAY ${run.day}`);
    let phase = '';
    let pc = '';
    if (lvl.kind === 'building') {
      phase = `Searching ${lvl.loc.name}`;
      pc = '';
    } else if (run.phase === 'night') {
      pc = 'night';
      phase = lvl.wave?.active ? `${lvl.wave.bloodMoon ? 'BLOOD MOON' : 'NIGHT'} ${run.day} · WAVE ${lvl.wave.wave}` : `NIGHT ${run.day}`;
    } else if (run.phase === 'dusk') {
      pc = 'dusk';
      phase = 'Dusk — sleep in your tent when ready';
    } else phase = `${run.hours} ${run.hours === 1 ? 'hour' : 'hours'} of daylight left`;
    this.set('phase', this.el.phaseLine, phase);
    this.set('phasec', this.el.phaseLine, pc, 'className');
    const b = BIOMES[run.locality.biome];
    const cal = calendar(run);
    const se = SEASONS[season(run)];
    const threat = bloodMoon(run) ? 'BLOOD MOON tonight' : `wave chance ${Math.round(waveChance(run) * 100)}%`;
    this.set('loc', this.el.locLine, `${run.locality.name} · ${b.name} · ${se.icon} ${cal.month} ${cal.date} · ${threat}`);
    const bp = run.blueprints.mg + run.blueprints.missile + run.blueprints.artillery;
    const mouths = mouthsToFeed(run);
    this.set(
      'res',
      this.el.res,
      `<span class="r-scrap">⚙ <b>${run.scrap}</b></span><span class="r-food ${run.food < mouths ? 'short' : ''}">◍ <b>${run.food}</b> food</span><span class="r-coal">◼ <b>${run.coal}</b> coal</span><span class="r-med">✚ <b>${run.medkits}</b></span>` +
        (bp ? `<span class="muted">✎ ${bp}</span>` : ''),
      'innerHTML'
    );

    // barricade + wave box
    const camp = lvl.kind === 'camp';
    this.set('barShow', this.el.barBox, camp ? 'show' : '', 'className');
    if (camp) {
      const max = barricadeMax(run);
      const hp = run.barricade.hp;
      this.set('barw', this.el.barFill.style, ((hp / max) * 100).toFixed(1) + '%', 'width');
      this.set('barc', this.el.barFill, hp < max * 0.3 ? 'fill low' : 'fill', 'className');
      this.set('bart', this.el.barText, hp > 0 ? `${Math.ceil(hp)} / ${max}` : 'BREACHED');
      this.set('wave', this.el.waveText, lvl.wave?.active ? `${lvl.remaining} zombies remaining` : '');
    }

    // squad
    let sq = '';
    const list = lvl.kind === 'building' ? (lvl.party || lvl.actors).map((a) => a.rec) : run.survivors.filter((s) => s.status !== 'dead');
    for (const s of list) {
      const actor = lvl.kind === 'building' ? lvl.party.find((a) => a.rec === s) : null;
      const away = s.status === 'away' || (actor && actor.floor != null && !lvl.actors.includes(actor));
      const icon = s.dog ? '🐕' : PROFS[s.prof]?.icon || '';
      const tag = actor?.mode === 'stay' ? ' ⏸' : '';
      const hpF = Math.max(0, s.hp / survivorMaxHp(s));
      sq += `<div class="sq ${away ? 'away' : ''}"><span>${icon ? icon + ' ' : ''}${esc(s.name.split(' ')[0])} <small>L${s.level}</small>${tag}${away ? (actor ? ' (other floor)' : ' (out)') : ''}</span><div class="hb"><i style="width:${(hpF * 100).toFixed(0)}%"></i></div></div>`;
    }
    this.set('squad', this.el.squad, sq, 'innerHTML');
    this.set('miniHint', this.el.miniHint, lvl.kind === 'building' ? '[M] map' : '');

    // bottom-left: level, health, stamina
    const pp = run.player.perkPoints || 0;
    this.set('lvlT', this.el.lvlText, `LEVEL ${run.player.level}${pp ? ` <span class="perkpt">★ ${pp} perk point${pp > 1 ? 's' : ''} · P</span>` : ''}`, 'innerHTML');
    this.set('xpT', this.el.xpText, `${run.player.xp} / ${xpToNext(run.player.level)} xp`);
    this.set('xpw', this.el.xpFill.style, ((run.player.xp / xpToNext(run.player.level)) * 100).toFixed(1) + '%', 'width');
    const hp = Math.max(0, p.health / p.maxHealth);
    this.set('hpw', this.el.hpFill.style, (hp * 100).toFixed(1) + '%', 'width');
    this.set('hpt', this.el.hpText, `${Math.ceil(p.health)} / ${p.maxHealth}`);
    const st = p.stamina / p.maxStamina;
    this.set('stw', this.el.stFill.style, (st * 100).toFixed(1) + '%', 'width');
    this.set('stc', this.el.stFill, p.exhausted ? 'fill exhausted' : 'fill', 'className');
    const status = [];
    if (p.hidden) status.push('HIDDEN');
    else if (p.crouch) status.push('CROUCHED');
    if (!p.flashlight) status.push('LIGHT OFF');
    // the flashlight's battery: five cells and the spares
    const ch = run.player.battery ?? 1;
    const cells = Math.ceil(ch * 5);
    this.set('batt', this.el.battery, `<span class="${ch < 0.2 ? 'bad' : ''}">🔋 ${'▮'.repeat(cells)}<span class="muted">${'▯'.repeat(5 - cells)}</span></span> ×${run.batteries}`, 'innerHTML');
    if (p.trapped > 0) status.push('TRAPPED');
    this.set('status', this.el.status, status.join(' · '));

    // inventory slots
    const slot = (key, uid, idx) => {
      const w = uid != null ? weaponByUid(run, uid) : null;
      const def = w ? WEAPONS[w.id] : null;
      const on = p.slot === idx ? 'style="border-color:var(--gold)"' : '';
      if (!def) return `<div class="slot empty" ${on}><b>${key}</b><span class="ico">✊</span>–<small>Fists</small></div>`;
      const short = def.name.length > 9 ? def.name.slice(0, 9) + '…' : def.name;
      const ammo = def.cat === 'melee' ? '∞' : `${w.mag}`;
      return `<div class="slot" ${on}><b>${key}</b><span class="ico" style="color:${RARITY[def.rarity].color}">${def.cat === 'melee' ? '⚔' : '⁍'}</span>${ammo}<small>${esc(short)}</small></div>`;
    };
    const traps = TRAP_ORDER.reduce((n, t) => n + run.traps[t], 0);
    this.set(
      'inv',
      this.el.inv,
      slot('1', run.loadout.primary, 0) +
        slot('2', run.loadout.secondary, 1) +
        `<div class="slot ${run.medkits ? '' : 'empty'}"><b>H</b><span class="ico">✚</span>${run.medkits}<small>Med kit</small></div>` +
        `<div class="slot ${traps ? '' : 'empty'}"><b>T</b><span class="ico">⊗</span>${traps}<small>Traps</small></div>`,
      'innerHTML'
    );

    // weapon readout
    const def = p.weaponDef();
    const inst = p.weapon();
    this.set('wname', this.el.wname, `<span style="color:${RARITY[def.rarity]?.color || 'var(--bone-dim)'}">${esc(def.name.toUpperCase())}</span>`, 'innerHTML');
    if (def.cat === 'melee') {
      this.set('ammo', this.el.ammo, '—');
      this.set('ammoSub', this.el.ammoSub, 'melee');
    } else {
      const stt = p.weaponStats();
      this.set('ammo', this.el.ammo, p.reloading > 0 ? 'RELOADING' : `${inst.mag} / ${stt.mag}`);
      this.set('ammoSub', this.el.ammoSub, `${run.ammo[def.ammo] || 0} ${AMMO[def.ammo].short.toLowerCase()} spare`);
    }
    this.set('hideMask', this.el.hideMask, 'overlay mask' + (p.hidden ? ' ' + p.hidden.kind : ''), 'className');
    this.set('cross', this.el.cross.style, p.hidden || !p.alive ? 'none' : 'block', 'display');
    this.updateTrapHud();
    this.drawMinimap();
    if (this.mapOpen) this.drawBigMap();
  }

  setPrompt(text) {
    this.set('prompt', this.el.prompt, text || '', 'innerHTML');
    this.set('promptVis', this.el.prompt.style, text ? '1' : '0', 'opacity');
  }

  updateTrapHud() {
    const g = this.game;
    const pl = g.placing;
    this.set('trapShow', this.el.trapHud, pl ? 'show' : '', 'className');
    if (!pl) return;
    const run = g.run;
    const items = TRAP_ORDER.map((t, i) => `<span class="t ${pl.type === t ? 'on' : ''} ${run.traps[t] ? '' : 'none'}">${i + 1} ${TRAPS[t].icon} ${TRAPS[t].name} ×${run.traps[t]}</span>`).join('');
    const msg = pl.error ? `<span class="bad">${esc(pl.error)}</span>` : `<span class="muted">${esc(TRAPS[pl.type].desc)}</span>`;
    this.set('trapHud', this.el.trapHud, `<div class="tsel">${items}</div>${msg}<div class="muted">Click: place · 1-4 / wheel: choose · T or Esc: done</div>`, 'innerHTML');
  }

  // ------------------------------------------------------------ minimaps
  drawMinimap() {
    const g = this.game;
    const lvl = g.level;
    const ctx = this.mini;
    const size = this.el.minimap.width;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, size, size);
    if (lvl.kind === 'camp') return this.drawCampMap(ctx, size);
    if (lvl.kind !== 'building') return;
    const p = g.player;
    const view = 26;
    const scale = size / view;
    const ox = p.pos.x / TILE - view / 2;
    const oz = p.pos.z / TILE - view / 2;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(lvl.mapCanvas, -ox * scale, -oz * scale, lvl.d.W * scale, lvl.d.H * scale);
    this.drawMarkers(ctx, ox, oz, scale);
  }

  drawCampMap(ctx, size) {
    const g = this.game;
    const lvl = g.level;
    const W = 160;
    const s = size / W;
    const oy = (size - 51 * s) / 2;
    const X = (x) => x * s;
    const Y = (z) => oy + z * s;
    ctx.fillStyle = '#1a1a14';
    ctx.fillRect(0, oy, size, 51 * s);
    ctx.fillStyle = '#2a2418';
    ctx.fillRect(X(12), oy, X(24), 51 * s);
    ctx.fillStyle = '#5a3a2a';
    ctx.fillRect(X(7), oy, X(3), 51 * s);
    const run = g.run;
    const f = run.barricade.hp / barricadeMax(run);
    ctx.fillStyle = run.barricade.hp <= 0 ? '#5a1010' : `rgb(${(220 - f * 120) | 0},${(80 + f * 120) | 0},60)`;
    ctx.fillRect(X(lvl.bx - 0.6), oy, Math.max(2, X(1.2)), 51 * s);
    ctx.fillStyle = '#444038';
    for (const c of lvl.cover) if (!c.soft) ctx.fillRect(X(c.x) - 1.5, Y(c.z) - 1.5, 3, 3);
    ctx.fillStyle = '#f0b43a';
    for (const t of lvl.traps) if (t.armed) ctx.fillRect(X(t.rec.x) - 1, Y(t.rec.z) - 1, 2, 2);
    ctx.fillStyle = '#ff3a2a';
    for (const e of lvl.enemies) if (e.alive) ctx.fillRect(X(e.pos.x) - 1.5, Y(e.pos.z) - 1.5, 3, 3);
    ctx.fillStyle = '#6fd6ff';
    for (const a of lvl.actors) if (a.alive) ctx.fillRect(X(a.pos.x) - 1.5, Y(a.pos.z) - 1.5, 3, 3);
    this.drawArrow(ctx, X(g.player.pos.x), Y(g.player.pos.z), 5);
  }

  drawArrow(ctx, px, py, s) {
    const a = this.game.player.yaw;
    const fx = -Math.sin(a);
    const fz = -Math.cos(a);
    ctx.fillStyle = '#ffe8a0';
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(px + fx * s, py + fz * s);
    ctx.lineTo(px - fx * s * 0.6 + fz * s * 0.6, py - fz * s * 0.6 - fx * s * 0.6);
    ctx.lineTo(px - fx * s * 0.25, py - fz * s * 0.25);
    ctx.lineTo(px - fx * s * 0.6 - fz * s * 0.6, py - fz * s * 0.6 + fx * s * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  drawMarkers(ctx, ox, oz, scale) {
    const lvl = this.game.level;
    const p = this.game.player;
    const toX = (x) => (x / TILE - ox) * scale;
    const toY = (z) => (z / TILE - oz) * scale;
    for (const m of lvl.mapMarkers()) {
      ctx.fillStyle = m.color;
      const r = Math.max(2.5, scale * 0.35);
      if (m.shape === 'square') ctx.fillRect(toX(m.x) - r, toY(m.z) - r, r * 2, r * 2);
      else {
        ctx.beginPath();
        ctx.arc(toX(m.x), toY(m.z), r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    this.drawArrow(ctx, toX(p.pos.x), toY(p.pos.z), Math.max(5, scale * 0.8));
  }

  drawBigMap() {
    const lvl = this.game.level;
    if (lvl.kind !== 'building') return;
    const c = this.el.bigmap;
    const W = lvl.d.W;
    const H = lvl.d.H;
    const avail = Math.min(window.innerWidth * 0.86, window.innerHeight * 0.74);
    const scale = Math.max(2, Math.floor(avail / Math.max(W, H)));
    if (c.width !== W * scale) {
      c.width = W * scale;
      c.height = H * scale;
    }
    const ctx = this.big;
    ctx.fillStyle = '#050403';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(lvl.mapCanvas, 0, 0, W * scale, H * scale);
    this.drawMarkers(ctx, 0, 0, scale);
  }

  toggleMap(force) {
    const lvl = this.game.level;
    this.mapOpen = (force ?? !this.mapOpen) && lvl?.kind === 'building';
    this.el.mapScreen.classList.toggle('show', this.mapOpen);
    if (lvl?.kind === 'building') this.el.mapLegend.textContent = `${lvl.loc.name} — only what you have seen.`;
  }

  // ------------------------------------------------------------ panels
  openPanel(kind, arg) {
    this.panel = { kind, arg, sel: this.panel?.kind === kind ? this.panel.sel : null, tab: arg === 'regional' ? 'regional' : 'local', comps: new Set() };
    this.el.panel.classList.add('show');
    this.el.hud.classList.add('dim');
    this.renderPanel();
  }
  closePanel() {
    this.panel = null;
    this.el.panel.classList.remove('show');
    this.el.hud.classList.remove('dim');
  }

  renderPanel() {
    const P = this.panel;
    if (!P) return;
    const r = {
      armory: () => this.panelArmory(),
      survivor: () => this.panelSurvivor(),
      barricade: () => this.panelBarricade(),
      turret: () => this.panelTurret(),
      map: () => this.panelMap(),
      sleep: () => this.panelSleep(),
      wait: () => this.panelWait(),
      report: () => this.panelReport(),
      note: () => this.panelNote(),
      railevent: () => this.panelRailEvent(),
      squad: () => this.panelSquad(),
      perks: () => this.panelPerks(),
    }[P.kind]();
    this.el.panelTitle.textContent = r.title;
    this.el.panelSub.innerHTML = r.sub || '';
    this.el.panelBody.innerHTML = r.body;
    const close = $('panelClose');
    close.textContent = r.close || 'CLOSE [E]';
    if (P.kind === 'map' && P.tab === 'local') this.drawLocalMap();
    if (P.kind === 'map' && P.tab === 'regional') this.drawRegionalMap();
  }

  resLine() {
    const run = this.game.run;
    return `<span class="r-scrap">⚙ ${run.scrap} scrap</span> · <span class="r-food">◍ ${run.food} food (${mouthsToFeed(run)}/day)</span> · <span class="r-coal">◼ ${run.coal} coal</span> · <span class="r-med">✚ ${run.medkits} med kits</span> · <span class="r-bat">🔋 ${run.batteries}</span>${run.keys.length ? ` · <span class="gold">🔑 ${run.keys.length}</span>` : ''}`;
  }

  holderLabel(uid) {
    const run = this.game.run;
    const h = holderOf(run, uid);
    if (!h) return 'on the rack';
    if (h === 'player') return run.loadout.primary === uid ? 'you · primary' : 'you · secondary';
    return h.name.split(' ')[0];
  }

  panelArmory() {
    const g = this.game;
    const run = g.run;
    const P = this.panel;
    const list = run.weapons
      .slice()
      .sort((a, b) => RARITY_ORDER.indexOf(WEAPONS[b.id].rarity) - RARITY_ORDER.indexOf(WEAPONS[a.id].rarity) || WEAPONS[a.id].name.localeCompare(WEAPONS[b.id].name));
    if (P.sel == null || !weaponByUid(run, P.sel)) P.sel = run.loadout.primary ?? list[0]?.uid ?? null;
    let left = `<div class="box"><h3>Weapons (${list.length})</h3><div class="wlist">`;
    for (const w of list) {
      const def = WEAPONS[w.id];
      const lv = Object.values(w.up || {}).reduce((a, b) => a + b, 0);
      left += `<button class="witem ${P.sel === w.uid ? 'sel' : ''}" data-act="selw" data-uid="${w.uid}"><span>${rname(def)}${lv ? ` <small>+${lv}</small>` : ''}</span><small>${esc(this.holderLabel(w.uid))}</small></button>`;
    }
    left += `</div></div><div class="box" style="margin-top:8px"><h3>Ammunition</h3><div class="ammo-grid">`;
    for (const k of AMMO_ORDER) left += `<span title="${esc(AMMO[k].desc)}">${AMMO[k].name}<small class="muted"> · ${esc(AMMO[k].desc.toLowerCase())}</small></span><b>${run.ammo[k] || 0}</b>`;
    left += `</div></div>`;

    let mid = '<div class="box">';
    const inst = P.sel != null ? weaponByUid(run, P.sel) : null;
    if (inst) {
      const def = WEAPONS[inst.id];
      const s = perkStats(weaponStats(inst, run.player.level), run);
      const melee = def.cat === 'melee';
      // compare with what you're holding (or the other hand, if this is it)
      const lo = run.loadout;
      const heldSlot = P.cmp ?? g.player?.slot ?? 0;
      let cmpUid = heldSlot === 0 ? lo.primary : lo.secondary;
      if (cmpUid === inst.uid) cmpUid = heldSlot === 0 ? lo.secondary : lo.primary;
      const cmpInst = cmpUid != null && cmpUid !== inst.uid ? weaponByUid(run, cmpUid) : null;
      const c = cmpInst ? perkStats(weaponStats(cmpInst, run.player.level), run) : null;
      mid += `<h3 style="font-size:30px">${rname(def)}</h3><div class="muted">${RARITY[def.rarity].name} ${CATEGORY[def.cat]}${def.ammo ? ` · uses ${AMMO[def.ammo].name.toLowerCase()} (shared by ${WEAPON_LIST.filter((w) => w.ammo === def.ammo).length} weapons)${def.ammoPer ? `, ${def.ammoPer} per throw` : ''}` : ''}${isExplosive(def) ? ' · <span class="muted">survivors use it slowly</span>' : ''}</div>`;
      mid += `<div class="cmp-line">Compared with ${cmpInst ? rname(WEAPONS[cmpInst.id]) : '<span class="muted">nothing (that hand is empty)</span>'} <button class="pbtn ${heldSlot === 0 ? 'on' : ''}" data-act="cmp" data-slot="0">[1]</button><button class="pbtn ${heldSlot === 1 ? 'on' : ''}" data-act="cmp" data-slot="1">[2]</button></div>`;
      const dps = (x) => x.dmg * x.pellets * Math.min(x.rate, 15);
      const acc = (x) => Math.round((1 - x.spread * 4) * 100);
      const row = (label, v, max, txt, cv, better = 1, dec = 0) => {
        let d = '';
        if (c && cv != null) {
          const diff = v - cv;
          if (Math.abs(diff) > (dec ? 0.05 : 0.5)) d = `<span class="${diff * better > 0 ? 'cmp-up' : 'cmp-down'}">${diff > 0 ? '▲' : '▼'}${Math.abs(diff).toFixed(dec)}</span>`;
          else d = '<span class="cmp-same">=</span>';
        }
        return `<div class="stat-row cmp"><span>${label}</span>${bar(v, max)}<span>${txt}</span>${d}</div>`;
      };
      mid += `<div style="margin:6px 0">`;
      mid += row('Damage', s.dmg * s.pellets, 300, `${Math.round(s.dmg)}${s.pellets > 1 ? '×' + s.pellets : ''}`, c && c.dmg * c.pellets);
      mid += row('Damage / sec', dps(s), 600, `${Math.round(dps(s))}`, c && dps(c));
      mid += row(melee ? 'Swing rate' : 'Fire rate', s.rate, 20, `${s.rate.toFixed(1)}/s`, c && c.rate, 1, 1);
      if (!melee && def.cat !== 'thrown') mid += row('Magazine', s.mag, 100, `${s.mag}`, c && c.def.cat !== 'melee' ? c.mag : null);
      if (!melee && def.cat !== 'thrown' && s.reload) mid += row('Reload', s.reload, 6, `${s.reload.toFixed(1)}s`, c && c.reload ? c.reload : null, -1, 1);
      mid += row(melee ? 'Reach' : 'Range', s.range, melee ? 3 : 150, `${s.range.toFixed(melee ? 1 : 0)}m`, c && (c.def.cat === 'melee') === melee ? c.range : null, 1, melee ? 1 : 0);
      if (!melee && def.cat !== 'thrown') mid += row('Accuracy', acc(s), 100, `${acc(s)}%`, c && c.def.cat !== 'melee' && c.def.cat !== 'thrown' ? acc(c) : null);
      if (s.splash) mid += row('Blast', s.splash, 8, `${s.splash.toFixed(1)}m`, c && c.splash ? c.splash : null, 1, 1);
      if (s.pierce) mid += row('Pierces', s.pierce, 6, `${s.pierce}`, c ? c.pierce || 0 : null);
      mid += `</div><div>Held by: <b class="gold">${esc(this.holderLabel(inst.uid))}</b></div>`;
      mid += `<div style="margin:6px 0"><button class="pbtn" data-act="equip" data-slot="0">Equip as primary</button><button class="pbtn" data-act="equip" data-slot="1">Equip as secondary</button><button class="pbtn" data-act="rack">Put on the rack</button></div>`;
      const camp = run.survivors.filter((v) => v.status === 'camp' && v.hp > 0 && !v.dog);
      if (camp.length) {
        mid += `<div>Give to: `;
        for (const v of camp) mid += `<button class="pbtn" data-act="give" data-id="${v.id}" ${v.weapon === inst.uid ? 'disabled' : ''}>${esc(v.name.split(' ')[0])}</button>`;
        mid += `</div>`;
      }
      mid += `<h3 style="margin-top:10px">Workbench</h3>`;
      for (const k of upgradeKeys(def)) {
        const lv = inst.up?.[k] || 0;
        const cost = upgCost(run, def, lv);
        const maxed = lv >= UPG_MAX;
        mid += `<div class="upg"><span>${UPGRADES[k].name}</span><span class="pips">${'●'.repeat(lv)}${'○'.repeat(UPG_MAX - lv)}</span><span>${
          maxed ? '<span class="muted">maxed</span>' : `<button class="pbtn" data-act="upg" data-key="${k}" ${run.scrap < cost ? 'disabled' : ''}>Upgrade · ⚙ ${cost}</button>`
        }</span></div>`;
      }
    } else mid += '<div class="muted">No weapons.</div>';
    mid += '</div>';

    let right = `<div class="box"><h3>Loadout</h3>`;
    const nm = (uid) => {
      const w = uid != null ? weaponByUid(run, uid) : null;
      return w ? rname(WEAPONS[w.id]) : '<span class="muted">fists</span>';
    };
    right += `<div>[1] ${nm(run.loadout.primary)}</div><div>[2] ${nm(run.loadout.secondary)}</div>`;
    right += `<h3 style="margin-top:10px">Survivors</h3>`;
    const alive = run.survivors.filter((v) => v.status !== 'dead');
    if (!alive.length) right += `<div class="muted">No one yet. Search the area for survivors.</div>`;
    for (const v of alive) right += `<div>${esc(survivorTitle(v))} <small class="muted">${v.dog ? 'dog · ' : v.prof && v.prof !== 'citizen' ? PROFS[v.prof].name.toLowerCase() + ' · ' : ''}L${v.level}${v.status === 'away' ? ' · out' : ''}</small><br>&nbsp;&nbsp;${v.dog ? '<span class="muted">teeth</span>' : nm(v.weapon)}</div>`;
    right += `</div>`;
    return { title: 'WEAPON RACK', sub: this.resLine(), body: `<div class="cols"><div>${left}</div><div>${mid}</div><div>${right}</div></div>` };
  }

  panelSurvivor() {
    const g = this.game;
    const run = g.run;
    const s = run.survivors.find((v) => v.id === this.panel.arg);
    if (!s) return { title: 'GONE', body: '' };
    const max = survivorMaxHp(s);
    const w = s.weapon != null ? weaponByUid(run, s.weapon) : null;
    let body = `<div class="cols2"><div class="box"><h3>${esc(survivorTitle(s))} — level ${s.level}</h3>`;
    if (!s.dog) body += `<div class="${s.prof === 'citizen' ? 'muted' : 'gold'}">${PROFS[s.prof]?.icon || ''} ${PROFS[s.prof]?.name || 'Citizen'}: ${esc(profSkill(s))}</div>`;
    body += `<div class="stat-row"><span>Health</span>${bar(s.hp, max)}<span>${Math.ceil(s.hp)}/${max}</span></div>`;
    body += `<div class="stat-row"><span>Experience</span>${bar(s.xp, xpToNext(s.level))}<span>${s.xp}/${xpToNext(s.level)}</span></div>`;
    if (!s.dog) body += `<div class="stat-row"><span>Aim</span>${bar(survivorAim(s), 1)}<span>${Math.round(survivorAim(s) * 100)}%</span></div>`;
    body += `<div class="stat-row"><span>Speed</span>${bar(survivorSpeed(s), 6)}<span>${survivorSpeed(s).toFixed(1)}</span></div>`;
    body += `<div class="stat-row"><span>Stamina</span>${bar(survivorStamina(s), 200)}<span>${survivorStamina(s)}</span></div>`;
    body += `<div style="margin-top:6px">Kills: ${s.kills || 0}</div>`;
    body += `<div style="margin-top:8px"><button class="pbtn big" data-act="heal" ${run.medkits <= 0 || s.hp >= max ? 'disabled' : ''}>Use a med kit (+60%) · ${run.medkits} left</button></div></div>`;
    if (s.dog) {
      body += `<div class="box"><h3>${esc(s.look.breed)}</h3><div class="muted">Dogs can't carry weapons and won't go scavenging on their own, but they're fast, bite hard (${DOG_BITE(s)} a bite) and bark when the dead come close. They eat like everyone else.</div></div></div>`;
      return { title: s.name.toUpperCase(), sub: 'Dog', body };
    }
    body += `<div class="box"><h3>Weapon</h3><div style="font-size:24px">${w ? rname(WEAPONS[w.id]) : '<span class="muted">Fists</span>'}</div>`;
    if (w) body += `<button class="pbtn" data-act="stake">Take it back</button>`;
    body += `<div class="muted" style="margin-top:8px">Survivors never run out of ammo. With launchers, grenades, molotovs and flamethrowers they're slow and careful, and won't fire where the blast would catch a friend. If they die, their weapon is lost.</div>`;
    const rack = run.weapons.filter((x) => !holderOf(run, x.uid));
    body += `<h3 style="margin-top:8px">From the rack</h3><div class="wlist" style="max-height:34vh">`;
    if (!rack.length) body += `<div class="muted">Nothing on the rack they can use.</div>`;
    for (const x of rack) body += `<button class="witem" data-act="sgive" data-uid="${x.uid}"><span>${rname(WEAPONS[x.id])}</span><small>${CATEGORY[WEAPONS[x.id].cat]}</small></button>`;
    body += `</div></div></div>`;
    return { title: 'SURVIVOR', sub: this.resLine(), body };
  }

  // The perk tree: branches in columns, tiers in rows.
  panelPerks() {
    const run = this.game.run;
    const pts = run.player.perkPoints || 0;
    const sel = this.panel.sel ? PERK[this.panel.sel] : null;
    let body = `<div class="perk-grid" style="grid-template-columns:repeat(${BRANCHES.length}, 1fr)">`;
    for (const b of BRANCHES) body += `<div class="perk-head" title="${esc(b.blurb)}">${b.icon} ${esc(b.name)}</div>`;
    for (let tier = 1; tier <= 5; tier++)
      for (const b of BRANCHES) {
        body += '<div class="perk-cell">';
        for (const p of PERKS.filter((q) => q.branch === b.id && q.tier === tier)) {
          const own = hasPerk(run, p.id);
          const open = p.req.every((r) => hasPerk(run, r));
          const cls = own ? 'own' : open ? (pts ? 'can' : 'open') : 'locked';
          body += `<button class="perk ${cls} ${sel === p ? 'sel' : ''}" data-act="perksel" data-id="${p.id}" title="${esc(p.desc)}">${esc(p.name)}</button>`;
        }
        body += '</div>';
      }
    body += '</div>';
    body += '<div class="box perk-detail">';
    if (sel) {
      const own = hasPerk(run, sel.id);
      const missing = sel.req.filter((r) => !hasPerk(run, r)).map((r) => PERK[r].name);
      body += `<b class="gold">${esc(sel.name)}</b> — ${esc(sel.desc)} `;
      if (own) body += '<span class="good">You have this perk.</span>';
      else if (missing.length) body += `<span class="muted">Needs ${missing.map(esc).join(' and ')} first.</span>`;
      else body += `<button class="pbtn big" data-act="perktake" ${pts ? '' : 'disabled'}>${pts ? 'Take this perk' : 'No perk points'}</button>`;
    } else body += `<span class="muted">Pick a perk to see what it does. You earn a perk point every time you level up. Gold perks are yours; green ones you can take now.</span>`;
    body += '</div>';
    const owned = (run.player.perks || []).length;
    return { title: 'PERKS', sub: `Level ${run.player.level} · <span class="${pts ? 'gold' : 'muted'}">${pts} perk point${pts === 1 ? '' : 's'} to spend</span> · ${owned} of ${PERKS.length} perks`, body };
  }

  // A companion in a building: orders, and trading weapons hand to hand.
  panelSquad() {
    const g = this.game;
    const run = g.run;
    const s = run.survivors.find((v) => v.id === this.panel.arg);
    const a = g.level?.actors?.find((x) => x.rec === s);
    if (!s || !a) return { title: 'GONE', body: '' };
    const max = survivorMaxHp(s);
    const wname = (uid) => {
      const w = uid != null ? weaponByUid(run, uid) : null;
      return w ? rname(WEAPONS[w.id]) : '<span class="muted">nothing</span>';
    };
    let body = `<div class="cols2"><div class="box"><h3>${esc(survivorTitle(s))} — level ${s.level}</h3>`;
    if (!s.dog) body += `<div class="${s.prof === 'citizen' ? 'muted' : 'gold'}">${PROFS[s.prof]?.icon || ''} ${PROFS[s.prof]?.name || 'Citizen'}: ${esc(profSkill(s))}</div>`;
    body += `<div class="stat-row"><span>Health</span>${bar(s.hp, max)}<span>${Math.ceil(s.hp)}/${max}</span></div>`;
    body += `<div style="margin:8px 0">${a.mode === 'stay' ? 'Holding position.' : 'Following you.'}</div>`;
    body += `<button class="pbtn big ${a.mode !== 'stay' ? 'on' : ''}" data-act="sqorder" data-mode="follow">Follow me</button>`;
    body += `<button class="pbtn big ${a.mode === 'stay' ? 'on' : ''}" data-act="sqorder" data-mode="stay">Stay here</button>`;
    body += `<div style="margin-top:10px"><button class="pbtn" data-act="heal" ${run.medkits <= 0 || s.hp >= max ? 'disabled' : ''}>Use a med kit (+60%) · ${run.medkits} left</button></div>`;
    body += `<div class="muted" style="margin-top:8px">Press <b>G</b> to tell everyone to stay or follow at once. Anyone left behind on another floor waits there, and makes their own way back to camp if you leave.</div></div>`;
    if (s.dog) {
      body += `<div class="box"><h3>${esc(s.look.breed)}</h3><div class="muted">Dogs can't carry weapons.</div></div></div>`;
      return { title: s.name.toUpperCase(), sub: 'Dog', body };
    }
    body += `<div class="box"><h3>Weapons</h3><div style="font-size:22px">They carry: ${wname(s.weapon)}</div>`;
    const lo = run.loadout;
    [
      ['primary', 0],
      ['secondary', 1],
    ].forEach(([key, slot]) => {
      const mine = lo[key];
      if (mine == null && s.weapon == null) return;
      const label = mine == null ? `Take their ${wname(s.weapon)} (${key})` : s.weapon == null ? `Give them your ${wname(mine)}` : `Swap your ${wname(mine)} for their ${wname(s.weapon)}`;
      body += `<div><button class="pbtn" data-act="sqswap" data-slot="${slot}">${label}</button></div>`;
    });
    const found = (g.trip?.found || []).filter((it) => it.weapon && weaponByUid(run, it.weapon.uid) && !holderOf(run, it.weapon.uid));
    if (found.length) {
      body += `<h3 style="margin-top:8px">Found on this trip</h3><div class="wlist" style="max-height:26vh">`;
      for (const it of found) body += `<button class="witem" data-act="sqgive" data-uid="${it.weapon.uid}"><span>${rname(WEAPONS[it.weapon.id])}</span><small>${CATEGORY[WEAPONS[it.weapon.id].cat]}</small></button>`;
      body += `</div>`;
    }
    body += `<div class="muted" style="margin-top:8px">Survivors never run out of ammo; you do. If they die, their weapon is lost.</div></div></div>`;
    return { title: 'YOUR PARTY', sub: this.resLine(), body };
  }

  panelBarricade() {
    const run = this.game.run;
    const b = run.barricade;
    const max = barricadeMax(run);
    const missing = Math.max(0, max - b.hp);
    const full = Math.ceil(missing / hpPerScrap(run));
    const part = Math.ceil(Math.min(60, missing) / hpPerScrap(run));
    const imp = reinforceCost(run);
    let body = `<div class="box" style="max-width:720px;margin:auto">`;
    body += `<div class="stat-row"><span>Strength</span>${bar(b.hp, max)}<span>${Math.ceil(b.hp)}/${max}</span></div>`;
    body += `<div>Reinforcement level ${b.level} / ${BARRICADE.maxLevel}${b.hp <= 0 ? ' · <span class="bad">breached — zombies will walk straight in</span>' : ''}</div>`;
    body += `<div style="margin-top:10px"><button class="pbtn big" data-act="repair" data-amt="60" ${!missing || run.scrap < part ? 'disabled' : ''}>Patch up ${Math.min(60, Math.ceil(missing))} hp · ⚙ ${part}</button>`;
    body += `<button class="pbtn big" data-act="repair" data-amt="all" ${!missing || run.scrap < 1 ? 'disabled' : ''}>Repair fully · ⚙ ${full}${run.scrap < full && missing ? ' (partial)' : ''}</button></div>`;
    if (b.level < BARRICADE.maxLevel)
      body += `<div style="margin-top:10px"><button class="pbtn big" data-act="improve" ${run.scrap < imp ? 'disabled' : ''}>Reinforce to level ${b.level + 1} (+${BARRICADE.perLevel} max strength) · ⚙ ${imp}</button></div>`;
    else body += `<div class="good" style="margin-top:10px">Fully reinforced.</div>`;
    body += `<p class="muted">Each scrap restores ${+hpPerScrap(run).toFixed(1)} strength. Reinforcing adds sandbags and sheet metal, and the new strength comes ready-built.</p></div>`;
    return { title: 'THE BARRICADE', sub: this.resLine(), body };
  }

  panelTurret() {
    const run = this.game.run;
    const i = this.panel.arg;
    const t = run.turrets[i];
    let body = `<div class="box" style="max-width:760px;margin:auto">`;
    if (t) {
      const d = TURRETS[t.type];
      body += `<h3>${d.name}</h3><div>Range ${d.range}m · ${d.splash ? `blast ${d.splash}m · ` : ''}${d.dmg} damage · ${d.rate}/s</div><p class="muted">Turrets never run out of ammunition and can't be destroyed. They only fire at targets beyond the barricade.</p>`;
    } else {
      body += `<h3>Train car ${i + 1}</h3><p class="muted">Each car can carry one turret. A turret needs scrap and a blueprint found while scavenging.</p>`;
      for (const k of TURRET_ORDER) {
        const d = TURRETS[k];
        const have = run.blueprints[k];
        const can = have > 0 && run.scrap >= d.cost;
        body += `<div class="turret-opt"><div><b>${d.name}</b> <small class="muted">(${d.rarity} blueprint)</small><br><small class="muted">Range ${d.range}m · ${d.dmg} dmg${d.splash ? ` · ${d.splash}m blast` : ''} · ${d.rate}/s${d.minRange ? ` · can't hit within ${d.minRange}m of the barricade` : ''} · blueprints: ${have}</small></div><button class="pbtn big" data-act="build" data-type="${k}" ${can ? '' : 'disabled'}>Build · ⚙ ${d.cost}</button></div>`;
      }
    }
    body += `</div>`;
    return { title: 'TRAIN TURRET', sub: this.resLine(), body };
  }

  panelSleep() {
    const run = this.game.run;
    return {
      title: 'END THE DAY?',
      sub: '',
      body: `<div class="box" style="max-width:640px;margin:auto;text-align:center"><p>You still have <b class="gold">${run.hours} hours</b> of daylight.</p><p class="muted">Tonight there is a ${Math.round(
        waveChance(run) * 100
      )}% chance the dead come for the camp.</p><button class="pbtn big" data-act="sleepyes">Sleep now</button><button class="pbtn big" data-act="close">Not yet</button></div>`,
    };
  }

  panelWait() {
    const run = this.game.run;
    const opts = [1, 2, 4].filter((h) => h < run.hours);
    let b = '';
    for (const h of opts) b += `<button class="pbtn big" data-act="wait" data-h="${h}">${h} ${h === 1 ? 'hour' : 'hours'}</button>`;
    b += `<button class="pbtn big warn" data-act="wait" data-h="dusk">Until dusk (${run.hours}h)</button>`;
    return {
      title: 'REST BY THE FIRE',
      sub: '',
      body: `<div class="box" style="max-width:680px;margin:auto;text-align:center"><p>${run.hours} ${run.hours === 1 ? 'hour' : 'hours'} of daylight left. How long do you sit?</p><div>${b}</div><p class="muted">Survivors you've sent out come back at dusk.</p><button class="pbtn" data-act="close">Get up</button></div>`,
    };
  }

  panelNote() {
    const n = this.panel.arg || {};
    const body = `<div class="note-paper">${esc(n.text || '')}</div>${n.hint ? '<div class="gold" style="text-align:center;margin-top:10px">Marked on your map.</div>' : ''}`;
    return { title: 'A NOTE', sub: n.where ? esc(n.where) : '', body, close: 'PUT IT DOWN [E]' };
  }

  panelRailEvent() {
    const run = this.game.run;
    const ev = this.panel.arg;
    const def = RAIL_EVENTS[ev.key];
    let body = `<div class="box rail-event" style="max-width:720px;margin:auto"><p class="rail-text">${esc(def.text)}</p>`;
    if (!ev.result) {
      body += '<div class="rail-opts">';
      def.options.forEach((o, i) => {
        const ok = canAfford(run, o.need);
        body += `<button class="pbtn big rail-opt" data-act="railpick" data-i="${i}" ${ok ? '' : 'disabled'}><b>${esc(o.label)}</b>${o.note ? `<span class="muted"> — ${esc(o.note)}</span>` : ''}${ok ? '' : ' <span class="bad">(not enough)</span>'}</button>`;
      });
      body += '</div>';
    } else {
      body += '<div class="report">';
      for (const l of ev.result) body += `<div class="${l.kind || ''}">${esc(l.text)}</div>`;
      body += '</div>';
    }
    body += '</div>';
    const cal = calendar(run);
    return { title: def.title, sub: `${this.resLine()} · ${run.hours}h of daylight · ${cal.month} ${cal.date}`, body, close: ev.result ? 'STEAM ON [E]' : 'SAFE CHOICE [E]' };
  }

  panelReport() {
    const lines = this.panel.arg || [];
    let body = `<div class="box report" style="max-width:820px;margin:auto">`;
    for (const l of lines) body += `<div class="${l.kind || ''}">${esc(l.text)}</div>`;
    body += `</div>`;
    return { title: this.panel.title || 'REPORT', sub: this.panel.sub || '', body, close: 'CONTINUE [E]' };
  }

  // ---------- maps ----------
  panelMap() {
    const g = this.game;
    const run = g.run;
    const P = this.panel;
    const tabs = `<div class="tabs"><button class="pbtn ${P.tab === 'local' ? 'on' : ''}" data-act="tab" data-tab="local">Local map</button><button class="pbtn ${P.tab === 'regional' ? 'on' : ''}" data-act="tab" data-tab="regional">Regional map</button></div>`;
    const sub = `${this.resLine()} · <span class="gold">${run.phase === 'day' ? `${run.hours}h of daylight` : 'too dark to travel'}</span>`;
    if (P.tab === 'regional') return { title: 'REGIONAL MAP', sub, body: tabs + this.regionalBody() };
    const locs = run.locality.locations;
    let markers = '<div class="camp-dot" style="left:50%;top:50%">⛺</div>';
    for (const l of locs) {
      const L = LOCATION_TYPES[l.type];
      const cls = ['loc', L.landmark ? 'landmark' : '', P.sel === l.id ? 'sel' : '', l.searched ? 'done' : '', l.claimed ? 'claim' : ''].join(' ');
      // a lock you've found (or heard about), a key you know the whereabouts of
      let badge = '';
      if (l.lock && !l.lock.opened && (l.lock.seen || l.lock.hint)) badge += `<span class="badge ${run.keys.includes(l.lock.id) ? 'have' : ''}" title="locked ${esc(l.lock.vault)}">🔒</span>`;
      if (l.key && l.keyHint && !run.keys.includes(l.key.opens)) badge += `<span class="badge key" title="a key is here">🔑</span>`;
      markers += `<button class="${cls}" style="left:${(l.x * 100).toFixed(1)}%;top:${(l.y * 100).toFixed(1)}%" data-act="loc" data-id="${l.id}" title="${esc(l.name)}">${L.icon}${badge}<span class="lbl">${esc(l.name)}</span></button>`;
    }
    const left = `<div class="mapwrap"><canvas id="localMapCanvas" width="640" height="480"></canvas>${markers}</div>`;
    const loc = locs.find((l) => l.id === P.sel);
    let right = '<div class="box">';
    if (!loc) right += `<h3>${esc(run.locality.name)}</h3><div class="appraisal">${this.appraisalHtml(run.locality.profile)}</div><div class="muted">Pick a location on the map. Searching costs daylight hours. Bring survivors along, or send one alone to search it for you.</div>`;
    else {
      const L = LOCATION_TYPES[loc.type];
      right += `<h3>${L.icon} ${esc(loc.name)}</h3><div class="${L.landmark ? 'gold' : 'muted'}">${L.landmark ? `★ Landmark · ${L.name}` : L.name}</div>`;
      if (L.blurb) right += `<div class="muted" style="font-size:17px">${esc(L.blurb)}</div>`;
      right += `<div>Danger: <span class="skulls">${skulls(loc.difficulty)}</span><span class="muted">${skulls(6 - loc.difficulty).replace(/☠/g, '·')}</span></div>`;
      right += `<div>Search time: <b class="gold">${searchHours(run, loc)} hours</b></div>`;
      right += `<div class="muted" style="font-size:17px">Often holds: ${this.lootHint(L)}</div>`;
      if (loc.floors > 1) right += `<div class="muted" style="font-size:17px">${loc.floors} floors</div>`;
      const lk = loc.lock;
      if (lk && !lk.opened && (lk.seen || lk.hint)) {
        const keyLoc = run.locality.locations.find((x) => x.id === lk.keyAt);
        const have = run.keys.includes(lk.id);
        right += `<div class="${have ? 'good' : 'gold'}" style="margin-top:4px">🔒 A locked ${esc(lk.vault)}. ${have ? 'You have the key.' : lk.hint && keyLoc ? `The key is at ${esc(keyLoc.name)}.` : 'Somewhere in town there is a key.'}</div>`;
      }
      if (loc.key && loc.keyHint && !run.keys.includes(loc.key.opens)) right += `<div class="gold" style="margin-top:4px">🔑 A note says a key is here.</div>`;
      if (loc.visited && !loc.searched && lk && !lk.opened) right += `<div class="muted">You've been through it once; the rest was picked over.</div>`;
      if (loc.searched) right += `<div class="muted" style="margin-top:8px">Already searched.</div>`;
      else if (loc.claimed) right += `<div class="good" style="margin-top:8px">A survivor is searching it now.</div>`;
      else if (run.phase !== 'day') right += `<div class="bad" style="margin-top:8px">It's getting dark. Nobody leaves camp now.</div>`;
      else {
        const camp = run.survivors.filter((v) => v.status === 'camp' && v.hp > 0);
        right += `<div style="margin-top:8px"><button class="pbtn big" data-act="search" ${run.hours < searchHours(run, loc) ? 'disabled' : ''}>Search it${P.comps.size ? ` with ${P.comps.size}` : ''} · ${searchHours(run, loc)}h</button></div>`;
        if (run.hours < searchHours(run, loc)) right += `<div class="bad">Not enough daylight left.</div>`;
        if (camp.length) {
          right += `<div style="margin-top:6px">Bring along: `;
          for (const v of camp) right += `<span class="chip ${P.comps.has(v.id) ? 'on' : ''}" data-act="comp" data-id="${v.id}">${v.dog ? '🐕 ' : PROFS[v.prof]?.icon ? PROFS[v.prof].icon + ' ' : ''}${esc(v.name.split(' ')[0])} L${v.level}</span>`;
          right += `</div><div style="margin-top:8px">Send alone (back at dusk):</div>`;
          for (const v of camp) {
            if (v.dog) continue;
            const pc = Math.round(expeditionChance(run, v, loc) * 100);
            const w = v.weapon != null ? weaponByUid(run, v.weapon) : null;
            right += `<div><button class="pbtn" data-act="send" data-id="${v.id}">Send ${esc(v.name.split(' ')[0])}</button> <span class="${pc >= 70 ? 'good' : pc >= 45 ? 'gold' : 'bad'}">${pc}% survival</span> <small class="muted">L${v.level} · ${w ? esc(WEAPONS[w.id].name) : 'unarmed'}</small></div>`;
          }
        } else right += `<div class="muted" style="margin-top:6px">With survivors you could send someone out alone.</div>`;
      }
    }
    right += '</div>';
    return { title: 'LOCAL MAP', sub, body: tabs + `<div class="cols2"><div>${left}</div><div>${right}</div></div>` };
  }

  appraisalHtml(profile) {
    if (!profile) return '';
    const text = appraisal(profile);
    const cut = text.lastIndexOf(';');
    const danger = text.slice(cut + 1).trim();
    const cls = ['good', 'gold', 'bad', 'bad'][profile.danger];
    return `${esc(text.slice(0, cut))}; <b class="${cls}">${esc(danger)}</b>`;
  }

  lootHint(L) {
    const names = { scrap: 'scrap', coal: 'coal', medkit: 'med kits', ammo: 'ammo', weapon: 'weapons', trap: 'traps', blueprint: 'blueprints', food: 'food', battery: 'batteries' };
    return Object.entries(L.loot)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([k]) => names[k])
      .join(', ');
  }

  drawLocalMap() {
    const c = $('localMapCanvas');
    if (!c) return;
    const ctx = c.getContext('2d');
    const run = this.game.run;
    const biome = run.locality.biome;
    ctx.fillStyle = biome === 'desert' ? '#d8bc88' : biome === 'tundra' ? '#dfe4e6' : '#c8c098';
    ctx.fillRect(0, 0, 640, 480);
    let seed = run.locality.seed;
    const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    // terrain blotches
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = biome === 'forest' ? 'rgba(60,90,50,0.25)' : biome === 'desert' ? 'rgba(160,110,60,0.2)' : 'rgba(150,170,190,0.25)';
      ctx.beginPath();
      ctx.ellipse(rnd() * 640, rnd() * 480, 20 + rnd() * 50, 14 + rnd() * 30, rnd() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    // the railway through camp
    ctx.strokeStyle = '#3a2a1a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(320, 0);
    ctx.lineTo(320, 480);
    ctx.stroke();
    ctx.lineWidth = 1;
    for (let y = 0; y < 480; y += 10) {
      ctx.beginPath();
      ctx.moveTo(314, y);
      ctx.lineTo(326, y);
      ctx.stroke();
    }
    // roads to every location
    ctx.strokeStyle = 'rgba(90,60,30,0.55)';
    ctx.setLineDash([6, 5]);
    ctx.lineWidth = 2;
    for (const l of run.locality.locations) {
      ctx.beginPath();
      ctx.moveTo(320, 240);
      ctx.quadraticCurveTo(320 + (l.x * 640 - 320) * 0.5 + (rnd() - 0.5) * 60, 240 + (l.y * 480 - 240) * 0.5 + (rnd() - 0.5) * 60, l.x * 640, l.y * 480);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(40,20,10,0.6)';
    ctx.strokeRect(6, 6, 628, 468);
    ctx.fillStyle = '#5a3a20';
    ctx.font = '20px serif';
    ctx.fillText(run.locality.name, 14, 30);
  }

  regionalBody() {
    const g = this.game;
    const run = g.run;
    const opts = run.region.options;
    const here = CITY[run.city];
    const pct = (c) => {
      const [x, y] = mapXY(c.lat, c.lon);
      return `left:${((x / RMAP.W) * 100).toFixed(2)}%;top:${((y / RMAP.H) * 100).toFixed(2)}%`;
    };
    let markers = '';
    if (here) markers += `<div class="camp-dot here" style="${pct(here)}" title="${esc(run.locality.name)}">◉</div>`;
    opts.forEach((o, i) => {
      const c = CITY[o.city];
      markers += `<button class="loc city s${o.size} ${this.panel.sel === 'r' + i ? 'sel' : ''}" style="${pct(c)}" data-act="rsel" data-i="${i}">${BIOMES[o.biome].icon}<span class="lbl">${esc(c.name)}</span></button>`;
    });
    const left = `<div class="mapwrap us"><canvas id="regionMapCanvas" width="${RMAP.W}" height="${RMAP.H}"></canvas>${markers}</div>`;
    let right = `<div class="box"><h3>Move the train</h3>`;
    const busy = run.survivors.some((s) => s.status === 'away');
    const i = this.panel.sel && String(this.panel.sel).startsWith('r') ? +String(this.panel.sel).slice(1) : null;
    const cityLine = (c) => `${SIZE_NAMES[citySize(c)]} · pop. ${c.pop >= 1000 ? (c.pop / 1000).toFixed(1) + 'M' : c.pop + 'k'}${c.tags.length ? ' · ' + c.tags.map((t) => TAG_NAMES[t]).join(', ') : ''}`;
    if (i != null) {
      const o = opts[i];
      const c = CITY[o.city];
      const b = BIOMES[o.biome];
      right += `<h3 style="margin-top:8px">${b.icon} ${esc(o.name)}</h3><div class="muted">${b.name} · ${cityLine(c)}</div>`;
      right += `<div class="appraisal">${this.appraisalHtml(o.profile)}</div>`;
      right += `<div><b>${o.miles}</b> miles by rail · coal needed: <b class="${run.coal >= tripCoal(run, o) ? 'good' : 'bad'}">${tripCoal(run, o)}</b> (you have ${run.coal})</div><div>Takes ${TRAVEL_HOURS} hours of daylight.</div>`;
      const can = run.coal >= tripCoal(run, o) && run.phase === 'day' && run.hours >= TRAVEL_HOURS && !busy;
      right += `<button class="pbtn big" data-act="travel" data-i="${i}" ${can ? '' : 'disabled'}>Fire up the engine</button>`;
      if (busy) right += `<div class="bad">Wait for the survivors you sent out to come back.</div>`;
      else if (run.phase !== 'day' || run.hours < TRAVEL_HOURS) right += `<div class="bad">Not enough daylight to travel today.</div>`;
    } else {
      right += `<div class="muted">Moving on means new buildings and new survivors. Untriggered traps are packed up and come with you; keys don't open anything in the next town.</div>`;
      right += `<div style="margin-top:8px">Pick a destination. You have <b>${run.coal}</b> coal.</div><div class="ropts">`;
      opts.forEach((o, k) => (right += `<div class="appraisal small" data-act="rsel" data-i="${k}"><b>${BIOMES[o.biome].icon} ${esc(o.name)}</b> · ${o.miles} mi · ◼ ${tripCoal(run, o)}<br>${this.appraisalHtml(o.profile)}</div>`));
      right += `</div>`;
    }
    if (here) right += `<div class="muted" style="margin-top:8px;font-size:17px">Here: <b>${esc(run.locality.name)}</b> (${cityLine(here)}) — ${this.appraisalHtml(run.locality.profile)}</div>`;
    right += `<div class="muted" style="font-size:16px">${run.route.length} ${run.route.length === 1 ? 'stop' : 'stops'} · ${(run.stats.miles || 0).toLocaleString()} miles travelled</div>`;
    right += `</div>`;
    return `<div class="cols2 regional"><div>${left}</div><div>${right}</div></div>`;
  }

  drawRegionalMap() {
    const c = $('regionMapCanvas');
    if (!c) return;
    const ctx = c.getContext('2d');
    const run = this.game.run;
    const { W, H } = RMAP;
    // the sea
    ctx.fillStyle = '#7d8f8c';
    ctx.fillRect(0, 0, W, H);
    for (let y = 0; y < H; y += 6) {
      ctx.fillStyle = `rgba(255,255,255,${0.02 + 0.02 * Math.sin(y * 0.21)})`;
      ctx.fillRect(0, y, W, 2);
    }
    const path = (pts) => {
      ctx.beginPath();
      pts.forEach(([lon, lat], k) => {
        const [x, y] = mapXY(lat, lon);
        if (k) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      });
      ctx.closePath();
    };
    // the land, tinted by climate around each city
    ctx.save();
    path(US_OUTLINE);
    ctx.fillStyle = '#d6c49a';
    ctx.fill();
    ctx.clip();
    for (const ct of CITIES) {
      const [x, y] = mapXY(ct.lat, ct.lon);
      const r = 120;
      const gr = ctx.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, `rgba(${CLIMATE_TINT[ct.biome]},0.34)`);
      gr.addColorStop(1, `rgba(${CLIMATE_TINT[ct.biome]},0)`);
      ctx.fillStyle = gr;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
    // the Rockies
    ctx.strokeStyle = 'rgba(90,70,50,0.28)';
    ctx.lineWidth = 1.4;
    for (let k = 0; k < 150; k++) {
      const lat = 32 + ((k * 37) % 170) / 10;
      const lon = -114 + 6 * Math.sin(lat * 0.45) + ((k * 53) % 70) / 10 - 2;
      const [x, y] = mapXY(lat, lon);
      ctx.beginPath();
      ctx.moveTo(x - 6, y + 4);
      ctx.lineTo(x, y - 4);
      ctx.lineTo(x + 6, y + 4);
      ctx.stroke();
    }
    // parallels and meridians
    ctx.strokeStyle = 'rgba(70,50,30,0.12)';
    ctx.lineWidth = 1;
    for (let lat = 25; lat <= 50; lat += 5) {
      ctx.beginPath();
      ctx.moveTo(...mapXY(lat, -126));
      ctx.lineTo(...mapXY(lat, -66));
      ctx.stroke();
    }
    for (let lon = -125; lon <= -65; lon += 5) {
      ctx.beginPath();
      ctx.moveTo(...mapXY(24, lon));
      ctx.lineTo(...mapXY(50, lon));
      ctx.stroke();
    }
    ctx.restore();
    for (const lake of LAKES) {
      path(lake);
      ctx.fillStyle = '#7d8f8c';
      ctx.fill();
    }
    path(US_OUTLINE);
    ctx.strokeStyle = '#3a2a1a';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    for (const lake of LAKES) {
      path(lake);
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
    const here = CITY[run.city];
    // rail lines to the next stops
    ctx.setLineDash([10, 6]);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = 'rgba(58,36,16,0.85)';
    if (here)
      for (const o of run.region.options) {
        const c = CITY[o.city];
        ctx.beginPath();
        ctx.moveTo(...mapXY(here.lat, here.lon));
        ctx.lineTo(...mapXY(c.lat, c.lon));
        ctx.stroke();
      }
    ctx.setLineDash([]);
    // the way the train came
    if (run.route.length > 1) {
      ctx.strokeStyle = '#a3170f';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      run.route.forEach((id, k) => {
        const c = CITY[id];
        const [x, y] = mapXY(c.lat, c.lon);
        if (k) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      });
      ctx.stroke();
    }
    // every city, sized by population
    const visited = new Set(run.route);
    const optIds = new Set(run.region.options.map((o) => o.city));
    ctx.font = '15px serif';
    ctx.textAlign = 'left';
    for (const ct of CITIES) {
      const [x, y] = mapXY(ct.lat, ct.lon);
      const r = 2.5 + citySize(ct) * 1.4;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = visited.has(ct.id) ? '#a3170f' : '#3a2a1a';
      ctx.fill();
      if (optIds.has(ct.id) || ct.id === run.city) continue;
      if (citySize(ct) >= 3 || visited.has(ct.id)) {
        ctx.fillStyle = visited.has(ct.id) ? 'rgba(120,20,10,0.9)' : 'rgba(40,26,12,0.75)';
        ctx.fillText(ct.name, x + r + 3, y + 5);
      }
    }
    if (here) {
      const [x, y] = mapXY(here.lat, here.lon);
      ctx.font = 'bold 17px serif';
      const tw = ctx.measureText(here.name).width;
      ctx.fillStyle = 'rgba(240,226,184,0.85)';
      ctx.fillRect(x - tw / 2 - 4, y + 13, tw + 8, 20);
      ctx.fillStyle = '#8a1208';
      ctx.textAlign = 'center';
      ctx.fillText(here.name, x, y + 29);
      ctx.textAlign = 'left';
    }
    ctx.fillStyle = '#3a2410';
    ctx.font = 'bold 26px serif';
    ctx.fillText('THE UNITED STATES', RMAP.ox + 18, RMAP.oy + RMAP.mh - 14);
    ctx.font = '17px serif';
    ctx.fillText(`${run.route.length} stops · ${(run.stats.miles || 0).toLocaleString()} miles`, RMAP.ox + 18, RMAP.oy + RMAP.mh + 8);
    // compass
    const cx = W - 70;
    const cy = H - 90;
    ctx.strokeStyle = '#3a2410';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 34);
    ctx.lineTo(cx, cy + 34);
    ctx.moveTo(cx - 34, cy);
    ctx.lineTo(cx + 34, cy);
    ctx.stroke();
    ctx.fillStyle = '#3a2410';
    ctx.textAlign = 'center';
    ctx.font = 'bold 18px serif';
    ctx.fillText('N', cx, cy - 40);
    ctx.textAlign = 'left';
  }

  // ------------------------------------------------------------ screens
  showTitle(on, best, cont) {
    this.el.title.classList.toggle('show', on);
    this.el.bestLine.textContent = best || '';
    this.el.continueBtn.style.display = cont ? '' : 'none';
    if (cont) this.el.continueBtn.textContent = cont;
  }
  showPause(on) {
    this.el.pause.classList.toggle('show', on);
  }
  showHud(on) {
    this.el.hud.classList.toggle('show', on);
  }
  showDeath(cause) {
    this.el.deathCause.textContent = DEATH_TEXT[cause] || 'The dark takes you.';
    this.el.deathSub.textContent = 'There is no one left to carry on.';
    this.el.death.classList.add('show');
  }
  hideDeath() {
    this.el.death.classList.remove('show');
  }
  showGameOver(stats, on = true) {
    this.el.gameover.classList.toggle('show', on);
    if (!on) return;
    this.el.goStats.innerHTML = `
      <div><span>Nights survived</span><b>${stats.nights}</b></div>
      <div><span>Hordes repelled</span><b>${stats.waves}</b></div>
      <div><span>Zombies killed</span><b>${stats.kills}</b></div>
      <div><span>Places searched</span><b>${stats.searched}</b></div>
      <div><span>Localities visited</span><b>${stats.localities}</b></div>
      <div><span>Survivors recruited / lost</span><b>${stats.recruited} / ${stats.lost}</b></div>
      <div><span>Your level</span><b>${stats.level}</b></div>
      <div class="best"><span>Best ever</span><b>${stats.best} ${stats.best === 1 ? 'night' : 'nights'}</b></div>`;
  }

  bindSettings() {
    const g = this.game;
    const s = g.settings;
    const bind = (id, key, apply) => {
      const el = $(id);
      if (!el) return;
      el.value = s[key];
      el.addEventListener('input', () => {
        s[key] = parseFloat(el.value);
        apply(s[key]);
        g.saveSettings();
      });
    };
    bind('setSens', 'sens', (v) => (g.input.sensitivity = v));
    bind('setMaster', 'master', (v) => g.audio.setVolume('master', v));
    bind('setMusic', 'music', (v) => g.audio.setVolume('music', v));
    bind('setSfx', 'sfx', (v) => g.audio.setVolume('sfx', v));
    const quality = $('setQuality');
    if (quality) {
      quality.value = s.quality;
      quality.addEventListener('change', () => {
        s.quality = quality.value;
        g.applyResolution();
        g.saveSettings();
      });
    }
  }
}

