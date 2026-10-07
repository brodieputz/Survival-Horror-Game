// DOM HUD, minimap, full map, shop and menu screens.
import { SHOP_ITEMS, itemPrice, TILE, GUN } from './config.js';

const $ = (id) => document.getElementById(id);

const DEATH_TEXT = {
  grunt: 'Torn apart by a Grunt.',
  hound: 'Mauled by a Blood Hound.',
  brute: 'Crushed by the Blind Brute.',
  angel: 'You looked away. The Angel did not.',
  spikes: 'Impaled on rusted spikes.',
  beartrap: 'Bled out in the jaws of a trap.',
};

export class UI {
  constructor(game) {
    this.game = game;
    this.el = {};
    for (const id of [
      'hud', 'lvl', 'dia', 'gold', 'lives', 'hpFill', 'hpText', 'stFill', 'inv', 'ammo', 'ammoSub', 'prompt', 'msgs',
      'banner', 'bannerT', 'bannerS', 'hurt', 'hideMask', 'fade', 'title', 'pause', 'shop', 'shopItems', 'shopGold',
      'mapScreen', 'bigmap', 'death', 'deathCause', 'deathSub', 'gameover', 'goStats', 'minimap', 'status', 'bestLine',
      'cross', 'vignette', 'mapLegend', 'shopLevel',
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
    this.buildShop();
    this.bindSettings();
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
    const lvl = g.level;
    if (!p || !lvl) return;

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
    this.hurtV = Math.max(0, this.hurtV - dt * 1.2);
    const lowHp = p.alive && p.health / p.maxHealth < 0.3 ? 0.25 + Math.sin(g.time * 5) * 0.08 : 0;
    this.el.hurt.style.opacity = Math.max(this.hurtV, lowHp).toFixed(3);
    if (this.fadeV !== this.fadeTarget) {
      const s = this.fadeSpeed * dt;
      this.fadeV = this.fadeV < this.fadeTarget ? Math.min(this.fadeTarget, this.fadeV + s) : Math.max(this.fadeTarget, this.fadeV - s);
      this.el.fade.style.opacity = this.fadeV.toFixed(3);
    }

    this.set('lvl', this.el.lvl, `LEVEL <span class="num">${g.levelNum}</span>`, 'innerHTML');
    this.set('dia', this.el.dia, `${lvl.found} / ${lvl.needed}`);
    this.set('gold', this.el.gold, String(p.gold));
    this.set('lives', this.el.lives, '☠'.repeat(Math.max(0, Math.min(p.lives, 12))) + (p.lives > 12 ? ` ×${p.lives}` : ''));
    const hp = Math.max(0, p.health / p.maxHealth);
    this.set('hpw', this.el.hpFill.style, (hp * 100).toFixed(1) + '%', 'width');
    this.set('hpt', this.el.hpText, `${Math.ceil(p.health)} / ${p.maxHealth}`);
    const st = p.stamina / p.maxStamina;
    this.set('stw', this.el.stFill.style, (st * 100).toFixed(1) + '%', 'width');
    this.set('stc', this.el.stFill, p.exhausted ? 'fill exhausted' : 'fill', 'className');
    this.set(
      'inv',
      this.el.inv,
      `<div class="slot ${p.inv.medkit ? '' : 'empty'}"><b>H</b><span class="ico">✚</span>${p.inv.medkit}<small>Med kit</small></div>` +
        `<div class="slot ${p.inv.beartrap ? '' : 'empty'}"><b>T</b><span class="ico">⊗</span>${p.inv.beartrap}<small>Bear trap</small></div>` +
        `<div class="slot ${p.inv.key ? '' : 'empty'}"><b>&nbsp;</b><span class="ico">⚷</span>${p.inv.key}<small>Skel. key</small></div>` +
        `<div class="slot ${lvl.mapOwned ? '' : 'empty'}"><b>M</b><span class="ico">▦</span>${lvl.mapOwned ? '✓' : '–'}<small>Map</small></div>`,
      'innerHTML'
    );
    this.set('ammo', this.el.ammo, p.reloading > 0 ? 'RELOADING' : `${p.clip} / ${GUN.clip}`);
    this.set('ammoSub', this.el.ammoSub, `${p.reserve} spare`);
    const status = [];
    if (p.hidden) status.push('HIDDEN');
    else if (p.crouch) status.push('CROUCHED');
    if (!p.flashlight) status.push('LIGHT OFF');
    if (p.trapped > 0) status.push('TRAPPED');
    if (p.inSafe) status.push('SANCTUARY');
    this.set('status', this.el.status, status.join(' · '));
    this.set('hideMask', this.el.hideMask, 'overlay mask' + (p.hidden ? ' ' + p.hidden.kind : ''), 'className');
    this.set('cross', this.el.cross.style, p.hidden || !p.alive ? 'none' : 'block', 'display');

    this.drawMinimap();
    if (this.mapOpen) this.drawBigMap();
  }

  setPrompt(text) {
    this.set('prompt', this.el.prompt, text || '', 'innerHTML');
    this.set('promptVis', this.el.prompt.style, text ? '1' : '0', 'opacity');
  }

  // ------------------------------------------------------------ maps
  drawMarkers(ctx, ox, oz, scale, big) {
    const g = this.game;
    const lvl = g.level;
    const p = g.player;
    const toX = (x) => (x / TILE - ox) * scale;
    const toY = (z) => (z / TILE - oz) * scale;
    // hatch
    const hs = Math.max(3, scale * 0.6);
    ctx.fillStyle = lvl.unlocked ? '#ff5a3a' : '#6a4a3a';
    ctx.fillRect(toX(lvl.hatch.x) - hs / 2, toY(lvl.hatch.z) - hs / 2, hs, hs);
    // diamonds
    for (const d of lvl.diamonds) {
      if (d.taken || !d.known) continue;
      const x = toX(d.x);
      const y = toY(d.z);
      const r = Math.max(3.5, scale * 0.55);
      ctx.fillStyle = '#5fd8ff';
      ctx.beginPath();
      ctx.moveTo(x, y - r);
      ctx.lineTo(x + r * 0.7, y);
      ctx.lineTo(x, y + r);
      ctx.lineTo(x - r * 0.7, y);
      ctx.closePath();
      ctx.fill();
      if (big) {
        ctx.strokeStyle = 'rgba(95,216,255,' + (0.4 + Math.sin(g.time * 4) * 0.3) + ')';
        ctx.beginPath();
        ctx.arc(x, y, r * 2, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    // player arrow
    const px = toX(p.pos.x);
    const py = toY(p.pos.z);
    const a = p.yaw;
    const fx = -Math.sin(a);
    const fz = -Math.cos(a);
    const s = Math.max(5, scale * 0.8);
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

  drawMinimap() {
    const g = this.game;
    const lvl = g.level;
    const p = g.player;
    const ctx = this.mini;
    const size = this.el.minimap.width;
    const view = 26; // tiles across
    const scale = size / view;
    const ox = p.pos.x / TILE - view / 2;
    const oz = p.pos.z / TILE - view / 2;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, size, size);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(lvl.mapCanvas, -ox * scale, -oz * scale, lvl.d.W * scale, lvl.d.H * scale);
    this.drawMarkers(ctx, ox, oz, scale, false);
  }

  drawBigMap() {
    const g = this.game;
    const lvl = g.level;
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
    this.drawMarkers(ctx, 0, 0, scale, true);
  }

  toggleMap(force) {
    this.mapOpen = force ?? !this.mapOpen;
    this.el.mapScreen.classList.toggle('show', this.mapOpen);
    const lvl = this.game.level;
    if (lvl)
      this.el.mapLegend.textContent = lvl.mapOwned
        ? "Cartographer's map — every diamond revealed."
        : 'Only what you have seen. Buy a map from the Keeper to reveal the level.';
  }

  // ------------------------------------------------------------ shop
  buildShop() {
    const box = this.el.shopItems;
    box.innerHTML = '';
    SHOP_ITEMS.forEach((item, i) => {
      const card = document.createElement('button');
      card.className = 'card';
      card.dataset.id = item.id;
      card.innerHTML = `<div class="key">${(i + 1) % 10}</div><div class="icon">${item.icon}</div>
        <div class="name">${item.name}</div><div class="desc">${item.desc}</div>
        <div class="tier"></div><div class="price"></div>`;
      card.addEventListener('click', () => this.game.buy(item.id));
      box.appendChild(card);
    });
  }

  refreshShop() {
    const g = this.game;
    const p = g.player;
    this.el.shopGold.textContent = p.gold;
    this.el.shopLevel.textContent = `Level ${g.levelNum}`;
    for (const card of this.el.shopItems.children) {
      const item = SHOP_ITEMS.find((it) => it.id === card.dataset.id);
      const price = itemPrice(item, g.levelNum, p);
      const st = g.shopState(item);
      card.querySelector('.price').textContent = st.maxed ? '—' : `${price} gold`;
      card.querySelector('.tier').textContent = st.info;
      card.disabled = st.maxed || p.gold < price;
      card.classList.toggle('poor', !st.maxed && p.gold < price);
      card.classList.toggle('maxed', st.maxed);
    }
  }

  showShop(on) {
    this.el.shop.classList.toggle('show', on);
    this.el.hud.classList.toggle('dim', on);
    if (on) this.refreshShop();
  }

  // ------------------------------------------------------------ screens
  showTitle(on, best) {
    this.el.title.classList.toggle('show', on);
    if (best) this.el.bestLine.textContent = best;
  }
  showPause(on) {
    this.el.pause.classList.toggle('show', on);
  }
  showHud(on) {
    this.el.hud.classList.toggle('show', on);
  }
  showDeath(cause, lives) {
    this.el.deathCause.textContent = DEATH_TEXT[cause] || 'The dark takes you.';
    this.el.deathSub.textContent =
      lives > 0 ? `${lives} ${lives === 1 ? 'life' : 'lives'} remaining. You will wake in the sanctuary.` : 'No lives remain.';
    this.el.death.classList.add('show');
  }
  hideDeath() {
    this.el.death.classList.remove('show');
  }
  showGameOver(stats, on = true) {
    this.el.gameover.classList.toggle('show', on);
    if (!on) return;
    this.el.goStats.innerHTML = `
      <div><span>Deepest level</span><b>${stats.level}</b></div>
      <div><span>Diamonds recovered</span><b>${stats.diamonds}</b></div>
      <div><span>Gold collected</span><b>${stats.gold}</b></div>
      <div><span>Monsters slain</span><b>${stats.kills}</b></div>
      <div class="best"><span>Best ever</span><b>Level ${stats.best}</b></div>`;
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
    const retro = $('setRetro');
    if (retro) {
      retro.checked = !!s.retro;
      retro.addEventListener('change', () => {
        s.retro = retro.checked;
        g.applyResolution();
        g.saveSettings();
      });
    }
  }
}
