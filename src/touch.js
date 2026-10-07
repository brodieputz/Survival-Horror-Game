// On-screen controls for phones and tablets. A movement stick appears under
// the left thumb, dragging anywhere else turns the view, and buttons on the
// right do the rest. They drive the same Input state as the keyboard and
// mouse, so the rest of the game doesn't need to know which is in use.
export function isTouchDevice() {
  const mm = (q) => window.matchMedia && window.matchMedia(q).matches;
  return mm('(pointer: coarse)') || (navigator.maxTouchPoints > 0 && !mm('(pointer: fine)'));
}

const STICK_R = 54; // px the knob can travel
const LOOK_GAIN = 1.7; // touch drags turn faster than mouse movement (scaled by Look sensitivity)
const $ = (id) => document.getElementById(id);
// keep receiving a finger's moves even after it slides off the element
const capture = (el, e) => {
  try {
    el.setPointerCapture(e.pointerId);
  } catch (err) {
    /* not a live pointer (synthetic events); moves still arrive while over it */
  }
};

export class TouchControls {
  constructor(game) {
    this.game = game;
    this.input = game.input;
    this.active = false;
    this.root = $('touch');
    this.stickEl = $('tStick');
    this.knob = $('tKnob');
    this.stickId = null;
    this.lookId = null;
    this.fireId = null;
    this.stick = { x: 0, y: 0 };
    this.last = new Map(); // pointerId -> {x, y}
    this.bindLook();
    this.bindFire();
    this.bindButtons();
    this.bindHud();
    // A tap also makes the browser send a click a moment later. If the tap
    // opened something (a panel, the pause menu, the map), that click would
    // land on it; cancelling the touch stops it.
    for (const el of [this.root, $('inv'), $('trapHud'), $('minimap')])
      el.addEventListener(
        'touchstart',
        (e) => {
          if (this.active) e.preventDefault();
        },
        { passive: false }
      );
  }

  setActive(on) {
    this.active = on;
    this.input.touchMode = on;
    document.body.classList.toggle('touch', on);
    if (!on) this.release();
  }

  // Phones get the whole screen, held sideways, while a run is on.
  enterGame() {
    if (!this.active || this.game.settings.fullscreen === false) return;
    const el = document.documentElement;
    const req = el.requestFullscreen || el.webkitRequestFullscreen;
    if (!req || document.fullscreenElement || document.webkitFullscreenElement) return;
    try {
      const p = req.call(el, { navigationUI: 'hide' });
      const lock = () => screen.orientation?.lock?.('landscape').catch(() => {});
      if (p && p.then) p.then(lock).catch(() => {});
      else lock();
    } catch (e) {
      /* not allowed here; play in the browser window */
    }
  }
  exitGame() {
    this.release();
  }

  release() {
    const inp = this.input;
    this.stickId = this.lookId = this.fireId = null;
    this.stickEl.classList.remove('on');
    inp.stick = false;
    inp.moveX = inp.moveY = 0;
    inp.keys.delete('ShiftLeft');
    inp.mouseDown = false;
  }

  look(e) {
    const prev = this.last.get(e.pointerId);
    if (prev) {
      this.input.mouseDX += (e.clientX - prev.x) * LOOK_GAIN;
      this.input.mouseDY += (e.clientY - prev.y) * LOOK_GAIN;
    }
    this.last.set(e.pointerId, { x: e.clientX, y: e.clientY });
  }

  // ---------- the open screen: move stick on the left, look everywhere else
  bindLook() {
    const area = $('tLook');
    area.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      const g = this.game;
      if (g.cine) {
        this.input.clicked = true; // tap to skip a cut-scene
        return;
      }
      capture(area, e);
      const W = window.innerWidth;
      const H = window.innerHeight;
      if (this.stickId == null && e.clientX < W * 0.42 && e.clientY > H * 0.22) {
        this.stickId = e.pointerId;
        this.stick.x = Math.max(STICK_R + 14, Math.min(W * 0.42, e.clientX));
        this.stick.y = Math.max(STICK_R + 14, Math.min(H - STICK_R - 14, e.clientY));
        this.stickEl.style.left = this.stick.x + 'px';
        this.stickEl.style.top = this.stick.y + 'px';
        this.stickEl.classList.add('on');
        this.moveStick(e.clientX, e.clientY);
      } else if (this.lookId == null) {
        this.lookId = e.pointerId;
        this.last.set(e.pointerId, { x: e.clientX, y: e.clientY });
      }
    });
    area.addEventListener('pointermove', (e) => {
      if (e.pointerId === this.stickId) this.moveStick(e.clientX, e.clientY);
      else if (e.pointerId === this.lookId) this.look(e);
    });
    const up = (e) => {
      if (e.pointerId === this.stickId) {
        this.stickId = null;
        this.stickEl.classList.remove('on');
        const inp = this.input;
        inp.stick = false;
        inp.moveX = inp.moveY = 0;
        inp.keys.delete('ShiftLeft');
      }
      if (e.pointerId === this.lookId) this.lookId = null;
      this.last.delete(e.pointerId);
    };
    area.addEventListener('pointerup', up);
    area.addEventListener('pointercancel', up);
  }

  moveStick(x, y) {
    let dx = x - this.stick.x;
    let dy = y - this.stick.y;
    const d = Math.hypot(dx, dy);
    if (d > STICK_R) {
      dx *= STICK_R / d;
      dy *= STICK_R / d;
    }
    this.knob.style.transform = `translate(${dx}px, ${dy}px)`;
    const inp = this.input;
    const m = Math.min(1, d / STICK_R);
    inp.stick = m > 0.12;
    inp.moveX = dx / STICK_R;
    inp.moveY = dy / STICK_R;
    // push the stick all the way to sprint
    if (m > 0.94) inp.keys.add('ShiftLeft');
    else inp.keys.delete('ShiftLeft');
  }

  // ---------- fire: hold to shoot, and drag on it to aim while shooting
  bindFire() {
    const b = $('tFire');
    b.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      capture(b, e);
      this.fireId = e.pointerId;
      this.last.set(e.pointerId, { x: e.clientX, y: e.clientY });
      this.input.mouseDown = true;
      this.input.clicked = true;
      b.classList.add('down');
    });
    b.addEventListener('pointermove', (e) => {
      if (e.pointerId === this.fireId) this.look(e);
    });
    const up = (e) => {
      if (e.pointerId !== this.fireId) return;
      this.fireId = null;
      this.last.delete(e.pointerId);
      this.input.mouseDown = false;
      b.classList.remove('down');
    };
    b.addEventListener('pointerup', up);
    b.addEventListener('pointercancel', up);
  }

  // ---------- one-tap buttons
  bindButtons() {
    const tap = (id, fn) => {
      const b = $(id);
      b.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        b.classList.add('down');
        fn();
      });
      const up = () => b.classList.remove('down');
      b.addEventListener('pointerup', up);
      b.addEventListener('pointercancel', up);
      b.addEventListener('pointerleave', up);
    };
    const key = (code) => () => this.input.tap(code);
    // while setting traps, reload and jump become "next trap" and "done"
    tap('tReload', () => (this.game.placing ? (this.input.wheel = 1) : this.input.tap('KeyR')));
    tap('tJump', () => this.input.tap(this.game.placing ? 'KeyT' : 'Space'));
    tap('tCrouch', key('KeyC'));
    tap('tUse', key('KeyE'));
    tap('tLight', key('KeyF'));
    tap('tPause', () => {
      if (this.game.state === 'playing') this.input.unlock();
    });
  }

  // ---------- parts of the HUD that are buttons on a touch screen
  bindHud() {
    $('inv').addEventListener('pointerdown', (e) => {
      if (!this.active) return;
      const slot = e.target.closest('.slot');
      if (!slot) return;
      e.preventDefault();
      const i = [...slot.parentNode.children].indexOf(slot);
      this.input.tap(['Digit1', 'Digit2', 'KeyH', 'KeyT'][i]);
    });
    $('trapHud').addEventListener('pointerdown', (e) => {
      if (!this.active) return;
      const t = e.target.closest('[data-k]');
      if (!t) return;
      e.preventDefault();
      this.input.tap('Digit' + t.dataset.k);
    });
    $('minimap').addEventListener('pointerdown', (e) => {
      if (!this.active || this.game.level?.kind !== 'building') return;
      e.preventDefault();
      this.input.tap('KeyM');
    });
  }

  // Per frame: show the controls that make sense right now.
  update() {
    if (!this.active) return;
    const g = this.game;
    const show = g.run && ['playing', 'dying', 'transition', 'sleeping'].includes(g.state);
    this.root.classList.toggle('show', !!show);
    if (!show) {
      if (this.stickId != null || this.fireId != null || this.lookId != null) this.release();
      return;
    }
    const p = g.player;
    const prompt = g.ui.cache.prompt || '';
    const use = $('tUse');
    const label = p?.hidden ? 'Leave' : prompt.replace(/<b>[^<]*<\/b>\s*/, '').replace(/<[^>]+>/g, '');
    use.classList.toggle('on', !!label);
    if (label && use.textContent !== label) use.textContent = label;
    const placing = !!g.placing;
    const set = (id, text) => {
      const el = $(id);
      if (el.textContent !== text) el.textContent = text;
    };
    set('tFire', placing ? 'SET' : 'FIRE');
    set('tReload', placing ? 'NEXT' : 'RELOAD');
    set('tJump', placing ? 'DONE' : 'JUMP');
    $('tCrouch').classList.toggle('hide', placing);
    $('tCrouch').classList.toggle('lit', !!p?.crouch);
    $('tLight').classList.toggle('lit', !!p?.flashlight);
  }
}
