// Fully procedural audio: three adaptive music layers (safe room / dungeon /
// chase) and positional sound effects, synthesised with the Web Audio API.

const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);

export class AudioSys {
  constructor() {
    this.ctx = null;
    this.volume = { master: 0.85, music: 0.7, sfx: 1.0 };
    this.mode = 'explore';
    this.occluded = null; // (pos) => bool, set by the game
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state !== 'running') this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = (this.ctx = new AC());
    this.master = ctx.createGain();
    this.master.gain.value = this.volume.master;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 6;
    this.master.connect(comp).connect(ctx.destination);
    this.musicBus = ctx.createGain();
    this.musicBus.gain.value = this.volume.music;
    this.musicBus.connect(this.master);
    this.sfxBus = ctx.createGain();
    this.sfxBus.gain.value = this.volume.sfx;
    this.sfxBus.connect(this.master);
    this.reverb = ctx.createConvolver();
    this.reverb.buffer = this.impulse(3.2, 2.2);
    this.reverbOut = ctx.createGain();
    this.reverbOut.gain.value = 0.55;
    this.reverb.connect(this.reverbOut).connect(this.master);
    this.noiseBuf = this.makeNoise(2);
    this.distCurve = this.makeDistortion(40);

    this.layers = {};
    for (const k of ['safe', 'explore', 'chase']) {
      const g = ctx.createGain();
      g.gain.value = 0;
      g.connect(this.musicBus);
      const send = ctx.createGain();
      send.gain.value = k === 'chase' ? 0.15 : 0.5;
      g.connect(send).connect(this.reverb);
      this.layers[k] = { gain: g, target: 0, next: ctx.currentTime + 0.1, step: 0 };
    }
    this.startDrone();
    this.startScreech();
    this.setMode(this.mode, true);
  }

  setVolume(kind, v) {
    this.volume[kind] = v;
    if (!this.ctx) return;
    const node = kind === 'master' ? this.master : kind === 'music' ? this.musicBus : this.sfxBus;
    node.gain.setTargetAtTime(v, this.ctx.currentTime, 0.05);
  }

  impulse(seconds, decay) {
    const ctx = this.ctx;
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }
  makeNoise(seconds) {
    const ctx = this.ctx;
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }
  makeDistortion(k) {
    const n = 1024;
    const curve = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1;
      curve[i] = ((3 + k) * x * 20 * (Math.PI / 180)) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  // ------------------------------------------------------------ listener
  setListener(pos, forward) {
    if (!this.ctx) return;
    const l = this.ctx.listener;
    const t = this.ctx.currentTime;
    if (l.positionX) {
      l.positionX.setTargetAtTime(pos.x, t, 0.02);
      l.positionY.setTargetAtTime(pos.y, t, 0.02);
      l.positionZ.setTargetAtTime(pos.z, t, 0.02);
      l.forwardX.setTargetAtTime(forward.x, t, 0.02);
      l.forwardY.setTargetAtTime(forward.y, t, 0.02);
      l.forwardZ.setTargetAtTime(forward.z, t, 0.02);
      l.upX.value = 0;
      l.upY.value = 1;
      l.upZ.value = 0;
    } else {
      l.setPosition(pos.x, pos.y, pos.z);
      l.setOrientation(forward.x, forward.y, forward.z, 0, 1, 0);
    }
  }

  // Returns an input node for a sound. pos = world position or null (2D).
  out(pos, vol = 1, { hrtf = false, reverb = 0.15, max = 60 } = {}) {
    const ctx = this.ctx;
    const g = ctx.createGain();
    g.gain.value = vol;
    let tail = g;
    if (pos) {
      const p = ctx.createPanner();
      p.panningModel = hrtf ? 'HRTF' : 'equalpower';
      p.distanceModel = 'inverse';
      p.refDistance = 2.5;
      p.rolloffFactor = 1.3;
      p.maxDistance = max;
      if (p.positionX) {
        p.positionX.value = pos.x;
        p.positionY.value = pos.y ?? 1;
        p.positionZ.value = pos.z;
      } else p.setPosition(pos.x, pos.y ?? 1, pos.z);
      tail.connect(p);
      tail = p;
      if (this.occluded && this.occluded(pos)) {
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 650;
        const og = ctx.createGain();
        og.gain.value = 0.65;
        tail.connect(lp).connect(og);
        tail = og;
      }
    }
    tail.connect(this.sfxBus);
    if (reverb > 0) {
      const s = ctx.createGain();
      s.gain.value = reverb;
      tail.connect(s).connect(this.reverb);
    }
    return g;
  }

  // ------------------------------------------------------------ primitives
  osc(type, f0, t, dur, dest, { gain = 0.3, attack = 0.005, f1 = null, curve = 'exp', detune = 0 } = {}) {
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    o.detune.value = detune;
    if (f1 !== null) {
      if (curve === 'exp') o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
      else o.frequency.linearRampToValueAtTime(f1, t + dur);
    }
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(dest);
    o.start(t);
    o.stop(t + dur + 0.05);
    return o;
  }
  noise(t, dur, dest, { type = 'bandpass', freq = 1000, Q = 1, gain = 0.3, attack = 0.003, f1 = null } = {}) {
    const ctx = this.ctx;
    const s = ctx.createBufferSource();
    s.buffer = this.noiseBuf;
    s.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.setValueAtTime(freq, t);
    if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    f.Q.value = Q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f).connect(g).connect(dest);
    s.start(t, Math.random() * 1.5);
    s.stop(t + dur + 0.05);
  }
  get now() {
    return this.ctx.currentTime;
  }
  ok() {
    return !!this.ctx && this.ctx.state === 'running';
  }

  // ------------------------------------------------------------ SFX
  playerStep(surface, vol = 1) {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(null, vol, { reverb: 0.12 });
    if (surface === 'wood') {
      this.noise(t, 0.08, o, { freq: 500, Q: 1.5, gain: 0.25 });
      this.osc('sine', 150, t, 0.1, o, { gain: 0.25, f1: 80 });
    } else if (surface === 'glass') {
      this.noise(t, 0.14, o, { type: 'highpass', freq: 3000, gain: 0.35 });
      for (let i = 0; i < 4; i++) this.osc('sine', 3000 + Math.random() * 4500, t + Math.random() * 0.06, 0.08, o, { gain: 0.08 });
      this.osc('sine', 90, t, 0.08, o, { gain: 0.2, f1: 50 });
    } else {
      this.noise(t, 0.09, o, { freq: 700 + Math.random() * 400, Q: 1.2, gain: 0.22 });
      this.osc('sine', 95, t, 0.09, o, { gain: 0.25, f1: 45 });
    }
  }

  monsterStep(type, pos) {
    if (!this.ok()) return;
    const t = this.now;
    if (type === 'brute') {
      const o = this.out(pos, 1.1, { reverb: 0.3, max: 80 });
      this.osc('sine', 60, t, 0.4, o, { gain: 0.9, f1: 28 });
      this.noise(t, 0.3, o, { type: 'lowpass', freq: 220, gain: 0.7 });
    } else if (type === 'hound') {
      const o = this.out(pos, 0.7, { reverb: 0.05 });
      this.noise(t, 0.03, o, { freq: 2600, Q: 4, gain: 0.5 });
      this.noise(t + 0.04, 0.03, o, { freq: 3100, Q: 4, gain: 0.35 });
    } else {
      const o = this.out(pos, 0.9, { reverb: 0.2 });
      this.noise(t, 0.13, o, { type: 'lowpass', freq: 500, gain: 0.5 });
      this.osc('sine', 75, t, 0.14, o, { gain: 0.45, f1: 38 });
      if (Math.random() < 0.3) this.noise(t + 0.05, 0.25, o, { freq: 1200, Q: 3, gain: 0.08 }); // dragging claws
    }
  }

  growl(type, pos, intensity = 1) {
    if (!this.ok()) return;
    const t = this.now;
    if (type === 'grunt') {
      const o = this.out(pos, 0.9 * intensity, { hrtf: true, reverb: 0.3 });
      const f = 85 + Math.random() * 30;
      const dur = 0.7 + Math.random() * 0.6;
      for (const [fq, q] of [
        [550, 5],
        [1150, 7],
      ]) {
        const bp = this.ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = fq;
        bp.Q.value = q;
        bp.connect(o);
        this.osc('sawtooth', f, t, dur, bp, { gain: 0.9, attack: 0.08, f1: f * 0.7 });
        this.osc('sawtooth', f * 1.02, t, dur, bp, { gain: 0.6, attack: 0.1, f1: f * 0.66 });
      }
      this.noise(t, dur, o, { freq: 400, Q: 1, gain: 0.15, attack: 0.1 });
    } else if (type === 'brute') {
      const o = this.out(pos, 1.3 * intensity, { hrtf: true, reverb: 0.45, max: 90 });
      const ws = this.ctx.createWaveShaper();
      ws.curve = this.distCurve;
      const lp = this.ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 520;
      ws.connect(lp).connect(o);
      const dur = 1.4;
      this.osc('sawtooth', 58, t, dur, ws, { gain: 0.9, attack: 0.15, f1: 40 });
      this.osc('square', 44, t, dur, ws, { gain: 0.5, attack: 0.2, f1: 32 });
      this.noise(t, dur, o, { type: 'lowpass', freq: 300, gain: 0.4, attack: 0.2 });
    } else if (type === 'hound') {
      const o = this.out(pos, 0.8 * intensity, { hrtf: true, reverb: 0.2 });
      this.osc('sawtooth', 420, t, 0.25, o, { gain: 0.25, f1: 220 });
      this.noise(t, 0.2, o, { freq: 1500, Q: 4, gain: 0.2 });
    }
  }

  shriek(pos) {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(pos, 1.0, { hrtf: true, reverb: 0.5, max: 100 });
    const ws = this.ctx.createWaveShaper();
    ws.curve = this.distCurve;
    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 2200;
    bp.Q.value = 1.2;
    ws.connect(bp).connect(o);
    const dur = 1.5;
    for (const [f, g] of [
      [1700, 0.5],
      [2390, 0.35],
      [1130, 0.3],
    ]) {
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, t);
      osc.frequency.linearRampToValueAtTime(f * 1.35, t + 0.25);
      osc.frequency.linearRampToValueAtTime(f * 0.9, t + dur);
      const lfo = this.ctx.createOscillator();
      lfo.frequency.value = 23 + Math.random() * 10;
      const lg = this.ctx.createGain();
      lg.gain.value = f * 0.08;
      lfo.connect(lg).connect(osc.frequency);
      const gg = this.ctx.createGain();
      gg.gain.setValueAtTime(0.0001, t);
      gg.gain.exponentialRampToValueAtTime(g, t + 0.06);
      gg.gain.setValueAtTime(g, t + dur * 0.6);
      gg.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gg).connect(ws);
      osc.start(t);
      lfo.start(t);
      osc.stop(t + dur + 0.1);
      lfo.stop(t + dur + 0.1);
    }
  }

  swipe(pos) {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(pos, 0.8, { reverb: 0.1 });
    this.noise(t, 0.25, o, { freq: 600, f1: 2400, Q: 2, gain: 0.5, attack: 0.05 });
  }

  impactPlayer(heavy = false) {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(null, 1, { reverb: 0.1 });
    this.osc('sine', heavy ? 70 : 110, t, 0.3, o, { gain: 0.9, f1: 35 });
    this.noise(t, 0.2, o, { type: 'lowpass', freq: 1200, gain: 0.6 });
    // player's pained grunt
    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 900;
    bp.Q.value = 3;
    bp.connect(o);
    this.osc('sawtooth', 190, t + 0.03, 0.3, bp, { gain: 0.5, f1: 120, attack: 0.02 });
  }

  gunshot() {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(null, 1.1, { reverb: 0.9 });
    this.noise(t, 0.45, o, { type: 'lowpass', freq: 5000, f1: 250, gain: 1.0, attack: 0.001 });
    this.osc('sine', 150, t, 0.25, o, { gain: 0.9, f1: 38, attack: 0.001 });
    this.osc('square', 80, t, 0.06, o, { gain: 0.4, f1: 40, attack: 0.001 });
  }
  click(vol = 0.4) {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(null, vol, { reverb: 0.05 });
    this.noise(t, 0.025, o, { type: 'highpass', freq: 2500, gain: 0.6 });
    this.osc('square', 1800, t, 0.02, o, { gain: 0.1 });
  }
  reload() {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(null, 0.5, { reverb: 0.05 });
    for (let i = 0; i < 6; i++) this.noise(t + 0.2 + i * 0.17, 0.03, o, { freq: 3000, Q: 3, gain: 0.4 });
    this.noise(t + 1.45, 0.06, o, { freq: 1600, Q: 2, gain: 0.6 });
  }
  ricochet(pos) {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(pos, 0.5, { reverb: 0.3 });
    this.osc('sine', 3200, t, 0.35, o, { gain: 0.2, f1: 1400 });
    this.noise(t, 0.05, o, { type: 'highpass', freq: 2000, gain: 0.4 });
  }
  flesh(pos) {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(pos, 0.8, { reverb: 0.1 });
    this.noise(t, 0.12, o, { type: 'lowpass', freq: 900, gain: 0.7 });
    this.osc('sine', 90, t, 0.12, o, { gain: 0.5, f1: 50 });
  }
  coin() {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(null, 0.5, { reverb: 0.25 });
    this.osc('sine', 1318, t, 0.25, o, { gain: 0.3 });
    this.osc('sine', 1760, t + 0.07, 0.35, o, { gain: 0.3 });
    this.osc('triangle', 2637, t + 0.07, 0.2, o, { gain: 0.08 });
  }
  pickup() {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(null, 0.5, { reverb: 0.2 });
    this.osc('triangle', 520, t, 0.15, o, { gain: 0.3, f1: 780 });
    this.noise(t, 0.08, o, { freq: 2000, Q: 2, gain: 0.2 });
  }
  diamond() {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(null, 0.7, { reverb: 0.7 });
    [76, 81, 83, 88, 93].forEach((n, i) => {
      this.osc('sine', midi(n), t + i * 0.08, 1.6, o, { gain: 0.22 });
      this.osc('triangle', midi(n + 12), t + i * 0.08, 0.8, o, { gain: 0.05 });
    });
  }
  allDiamonds() {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(null, 0.8, { reverb: 0.8 });
    [57, 64, 69, 72, 76].forEach((n, i) => this.osc('sawtooth', midi(n), t, 3.5, o, { gain: 0.06, attack: 0.4 + i * 0.1 }));
    this.osc('sine', 55, t, 3, o, { gain: 0.5, attack: 0.3 });
  }
  crate(locked) {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(null, 0.7, { reverb: 0.25 });
    if (locked) {
      for (let i = 0; i < 3; i++) this.osc('square', 900 + i * 230, t + i * 0.05, 0.25, o, { gain: 0.1 });
      this.noise(t, 0.15, o, { freq: 3000, Q: 4, gain: 0.3 });
    }
    this.osc('sawtooth', 140, t + 0.05, 0.6, o, { gain: 0.15, f1: 260, curve: 'lin' }); // creak
    this.noise(t + 0.55, 0.15, o, { type: 'lowpass', freq: 700, gain: 0.6 });
  }
  denied() {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(null, 0.5, { reverb: 0.1 });
    this.osc('square', 140, t, 0.15, o, { gain: 0.15 });
    this.osc('square', 110, t + 0.15, 0.2, o, { gain: 0.15 });
  }
  rattle() {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(null, 0.6, { reverb: 0.2 });
    for (let i = 0; i < 5; i++) this.noise(t + i * 0.06, 0.05, o, { freq: 2500 + Math.random() * 1500, Q: 6, gain: 0.4 });
  }
  locker(pos, kind) {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(pos, 0.7, { reverb: 0.3 });
    if (kind === 'locker') {
      this.osc('square', 300, t, 0.3, o, { gain: 0.08, f1: 220 });
      [523, 811, 1240].forEach((f) => this.osc('sine', f, t + 0.25, 0.6, o, { gain: 0.1 }));
      this.noise(t + 0.25, 0.08, o, { type: 'lowpass', freq: 900, gain: 0.5 });
    } else if (kind === 'closet') {
      this.osc('sawtooth', 120, t, 0.5, o, { gain: 0.12, f1: 210, curve: 'lin' });
      this.noise(t + 0.45, 0.1, o, { type: 'lowpass', freq: 600, gain: 0.5 });
    } else {
      this.noise(t, 0.35, o, { freq: 800, Q: 1, gain: 0.25, attack: 0.05 }); // shuffling
    }
  }
  bearSnap(pos) {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(pos, 1.0, { reverb: 0.5, max: 80 });
    [820, 1263, 1977, 2810].forEach((f) => this.osc('sine', f, t, 0.9, o, { gain: 0.18, attack: 0.001 }));
    this.noise(t, 0.08, o, { type: 'highpass', freq: 1500, gain: 0.9, attack: 0.001 });
    this.osc('sine', 120, t, 0.15, o, { gain: 0.6, f1: 50 });
  }
  spikes(pos) {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(pos, 1.0, { reverb: 0.4 });
    this.noise(t, 0.2, o, { freq: 800, f1: 3500, Q: 2, gain: 0.6 });
    [400, 610, 950].forEach((f) => this.osc('sine', f, t + 0.12, 0.5, o, { gain: 0.15 }));
  }
  glass(pos) {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(pos, 0.8, { reverb: 0.4 });
    this.noise(t, 0.2, o, { type: 'highpass', freq: 3500, gain: 0.5 });
    for (let i = 0; i < 6; i++) this.osc('sine', 3500 + Math.random() * 5000, t + Math.random() * 0.15, 0.1, o, { gain: 0.07 });
  }
  fallPit() {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(null, 1, { reverb: 0.6 });
    this.noise(t, 0.4, o, { freq: 400, f1: 150, Q: 1, gain: 0.4, attack: 0.1 });
    this.osc('sine', 80, t + 0.35, 0.4, o, { gain: 0.9, f1: 30 });
    this.noise(t + 0.35, 0.2, o, { type: 'lowpass', freq: 1500, gain: 0.8 });
  }
  jump() {
    if (!this.ok()) return;
    const o = this.out(null, 0.3, { reverb: 0 });
    this.noise(this.now, 0.12, o, { freq: 600, Q: 1, gain: 0.25, attack: 0.03 });
  }
  heartbeat(vol) {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(null, vol, { reverb: 0 });
    this.osc('sine', 55, t, 0.18, o, { gain: 0.9, f1: 35 });
    this.osc('sine', 50, t + 0.24, 0.2, o, { gain: 0.7, f1: 32 });
  }
  breath(vol) {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(null, vol, { reverb: 0.05 });
    this.noise(t, 0.55, o, { freq: 1100, Q: 0.8, gain: 0.18, attack: 0.25 });
    this.noise(t + 0.6, 0.6, o, { freq: 700, Q: 0.8, gain: 0.12, attack: 0.2 });
  }
  buy() {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(null, 0.6, { reverb: 0.3 });
    [1046, 1318, 1568].forEach((f, i) => this.osc('triangle', f, t + i * 0.06, 0.4, o, { gain: 0.15 }));
    for (let i = 0; i < 6; i++) this.osc('sine', 2000 + Math.random() * 1500, t + 0.1 + i * 0.03, 0.15, o, { gain: 0.06 });
  }
  uiClick() {
    if (!this.ok()) return;
    const o = this.out(null, 0.3, { reverb: 0 });
    this.osc('triangle', 660, this.now, 0.06, o, { gain: 0.2 });
  }
  flashlight() {
    this.click(0.5);
  }
  hatch() {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(null, 0.9, { reverb: 0.7 });
    for (let i = 0; i < 8; i++) this.noise(t + i * 0.05, 0.06, o, { freq: 2200 + Math.random() * 1500, Q: 5, gain: 0.3 });
    this.osc('sawtooth', 90, t + 0.4, 1.0, o, { gain: 0.15, f1: 160, curve: 'lin' });
    this.osc('sine', 45, t + 1.2, 1.2, o, { gain: 0.8, f1: 30 });
  }
  stinger() {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(null, 0.7, { reverb: 0.7 });
    [45, 46, 51, 57, 58].forEach((n) => this.osc('sawtooth', midi(n + 12), t, 1.6, o, { gain: 0.09, attack: 0.01 }));
    this.noise(t, 1.2, o, { freq: 3000, Q: 0.7, gain: 0.15, attack: 0.01 });
    this.osc('sine', 40, t, 1.0, o, { gain: 0.7, f1: 25 });
  }
  death() {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(null, 1.0, { reverb: 1.0 });
    [33, 34, 39, 45].forEach((n) => this.osc('sawtooth', midi(n), t, 4, o, { gain: 0.15, attack: 0.02 }));
    this.noise(t, 2.5, o, { type: 'lowpass', freq: 800, f1: 100, gain: 0.5 });
    this.osc('sine', 60, t, 3, o, { gain: 0.9, f1: 20 });
  }
  stoneGrind(pos) {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(pos, 0.9, { reverb: 0.3 });
    this.noise(t, 0.35, o, { freq: 260, Q: 3, gain: 0.7, attack: 0.04 });
    this.noise(t, 0.3, o, { freq: 1300, Q: 6, gain: 0.15, attack: 0.05 });
  }
  monsterDeath(type, pos) {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(pos, 1.0, { hrtf: true, reverb: 0.5 });
    const f = type === 'brute' ? 50 : type === 'hound' ? 500 : 110;
    this.osc('sawtooth', f, t, 1.4, o, { gain: 0.3, f1: f * 0.4, attack: 0.02 });
    this.noise(t + 0.6, 0.3, o, { type: 'lowpass', freq: 400, gain: 0.6 });
  }


  // ------------------------------------------------------------ weapons & camp
  // Gunfire for any weapon. pos = null for the player's own weapon.
  weaponFire(def, pos = null) {
    if (!this.ok()) return;
    const t = this.now;
    const k = def.sound;
    if (pos) {
      this.lastNpcShot = this.lastNpcShot || 0;
      if (t - this.lastNpcShot < 0.03) return;
      this.lastNpcShot = t;
    }
    const o = this.out(pos, pos ? 0.75 : 1.0, { reverb: pos ? 0.35 : 0.6, max: 140 });
    switch (k) {
      case 'magnum':
        this.noise(t, 0.5, o, { type: 'lowpass', freq: 5200, f1: 220, gain: 1.1, attack: 0.001 });
        this.osc('sine', 120, t, 0.3, o, { gain: 1.0, f1: 35, attack: 0.001 });
        this.osc('square', 70, t, 0.07, o, { gain: 0.4, f1: 35, attack: 0.001 });
        break;
      case 'smg':
        this.noise(t, 0.16, o, { type: 'lowpass', freq: 6000, f1: 600, gain: 0.6, attack: 0.001 });
        this.osc('sine', 220, t, 0.09, o, { gain: 0.45, f1: 60, attack: 0.001 });
        break;
      case 'rifle':
      case 'lmg':
        this.noise(t, k === 'lmg' ? 0.22 : 0.34, o, { type: 'lowpass', freq: 7000, f1: 300, gain: 0.85, attack: 0.001 });
        this.noise(t, 0.04, o, { type: 'highpass', freq: 3000, gain: 0.5, attack: 0.001 });
        this.osc('sine', 140, t, 0.18, o, { gain: 0.7, f1: 40, attack: 0.001 });
        break;
      case 'sniper':
        this.noise(t, 0.9, o, { type: 'lowpass', freq: 8000, f1: 150, gain: 1.2, attack: 0.001 });
        this.noise(t, 0.05, o, { type: 'highpass', freq: 2500, gain: 0.8, attack: 0.001 });
        this.osc('sine', 90, t, 0.5, o, { gain: 1.0, f1: 28, attack: 0.001 });
        break;
      case 'shotgun':
        this.noise(t, 0.6, o, { type: 'lowpass', freq: 3200, f1: 150, gain: 1.25, attack: 0.001 });
        this.osc('sine', 100, t, 0.35, o, { gain: 1.1, f1: 30, attack: 0.001 });
        break;
      case 'rocket':
        this.noise(t, 1.0, o, { freq: 900, f1: 220, Q: 0.7, gain: 0.9, attack: 0.02 });
        this.osc('sine', 60, t, 0.4, o, { gain: 0.8, f1: 30, attack: 0.005 });
        break;
      case 'launcher':
        this.osc('sine', 130, t, 0.16, o, { gain: 1.0, f1: 50, attack: 0.002 });
        this.noise(t, 0.12, o, { type: 'lowpass', freq: 1200, gain: 0.6, attack: 0.002 });
        break;
      case 'bow':
        this.osc('triangle', 230, t, 0.25, o, { gain: 0.25, f1: 170, attack: 0.002 });
        this.noise(t, 0.08, o, { type: 'highpass', freq: 2500, gain: 0.25 });
        break;
      case 'throw':
        this.noise(t, 0.28, o, { freq: 1000, f1: 400, Q: 1, gain: 0.3, attack: 0.08 });
        break;
      case 'flame':
        this.noise(t, 0.14, o, { freq: 500, Q: 0.5, gain: 0.35, attack: 0.02 });
        this.noise(t, 0.12, o, { type: 'highpass', freq: 3000, gain: 0.06 });
        break;
      case 'chainsaw':
        this.osc('sawtooth', 95 + Math.random() * 15, t, 0.1, o, { gain: 0.16, attack: 0.005 });
        this.noise(t, 0.09, o, { freq: 1600, Q: 1.5, gain: 0.12 });
        break;
      case 'melee':
        this.noise(t, 0.2, o, { freq: 1300, f1: 450, Q: 1.2, gain: 0.32, attack: 0.05 });
        break;
      case 'pistol':
      default:
        this.noise(t, 0.32, o, { type: 'lowpass', freq: 4600, f1: 280, gain: 0.85, attack: 0.001 });
        this.osc('sine', 170, t, 0.2, o, { gain: 0.75, f1: 42, attack: 0.001 });
        break;
    }
  }
  // a dog's bark (or a snarl as it bites)
  bark(pos, bite = false) {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(pos, bite ? 0.8 : 1.0, { reverb: 0.25 });
    const n = bite ? 1 : 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < n; i++) {
      const t0 = t + i * 0.22;
      const f = 380 + Math.random() * 120;
      this.osc('sawtooth', f, t0, 0.12, o, { gain: 0.22, f1: f * 0.55 });
      this.noise(t0, 0.1, o, { freq: 900, Q: 1.6, gain: 0.3, f1: 500 });
      if (bite) this.noise(t0 + 0.05, 0.25, o, { freq: 300, Q: 1, gain: 0.25 });
    }
  }

  swing(pos = null) {
    if (!this.ok()) return;
    const o = this.out(pos, 0.6, { reverb: 0.05 });
    this.noise(this.now, 0.2, o, { freq: 1300, f1: 450, Q: 1.2, gain: 0.32, attack: 0.05 });
  }
  meleeHit(pos) {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(pos, 0.9, { reverb: 0.1 });
    this.osc('sine', 110, t, 0.12, o, { gain: 0.7, f1: 45 });
    this.noise(t, 0.1, o, { type: 'lowpass', freq: 1400, gain: 0.6 });
  }
  explosion(pos, radius = 5) {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(pos, 1.4, { reverb: 0.8, max: 260 });
    this.noise(t, 1.6, o, { type: 'lowpass', freq: 2600, f1: 70, gain: 1.4, attack: 0.002 });
    this.osc('sine', 70, t, 1.3, o, { gain: 1.3, f1: 22, attack: 0.002 });
    this.noise(t + 0.05, 2.2, o, { type: 'lowpass', freq: 300, f1: 60, gain: 0.7 * Math.min(1.5, radius / 5), attack: 0.1 });
  }
  turretFire(type, pos) {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(pos, 0.7, { reverb: 0.3, max: 160 });
    if (type === 'mg') {
      this.noise(t, 0.12, o, { type: 'lowpass', freq: 6000, f1: 500, gain: 0.55, attack: 0.001 });
      this.osc('sine', 160, t, 0.08, o, { gain: 0.4, f1: 60, attack: 0.001 });
    } else if (type === 'missile') {
      this.noise(t, 0.8, o, { freq: 1100, f1: 300, Q: 0.8, gain: 0.7, attack: 0.03 });
    } else {
      this.noise(t, 1.2, o, { type: 'lowpass', freq: 2000, f1: 90, gain: 1.3, attack: 0.002 });
      this.osc('sine', 55, t, 0.9, o, { gain: 1.2, f1: 25, attack: 0.002 });
    }
  }
  barricadeHit(pos, heavy) {
    if (!this.ok()) return;
    const t = this.now;
    if (t - (this.lastBar || 0) < 0.08) return;
    this.lastBar = t;
    const o = this.out(pos, heavy ? 1 : 0.6, { reverb: 0.2, max: 90 });
    this.osc('sine', heavy ? 80 : 120, t, 0.15, o, { gain: 0.7, f1: 50 });
    this.noise(t, 0.12, o, { freq: 700, Q: 1.5, gain: 0.5 });
    if (Math.random() < 0.3) this.noise(t + 0.05, 0.15, o, { type: 'highpass', freq: 2500, gain: 0.25 });
  }
  barricadeBreak() {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(null, 1.1, { reverb: 0.6 });
    for (let i = 0; i < 7; i++) this.noise(t + i * 0.09, 0.25, o, { freq: 500 + Math.random() * 2000, Q: 1.2, gain: 0.6 });
    this.osc('sine', 60, t, 1.2, o, { gain: 1.0, f1: 25 });
  }
  hammer() {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(null, 0.7, { reverb: 0.2 });
    for (let i = 0; i < 3; i++) {
      this.osc('sine', 900, t + i * 0.22, 0.12, o, { gain: 0.2, f1: 600 });
      this.noise(t + i * 0.22, 0.06, o, { freq: 1800, Q: 2, gain: 0.5 });
    }
  }
  impactNpc(pos) {
    if (!this.ok()) return;
    const o = this.out(pos, 0.6, { reverb: 0.1 });
    this.noise(this.now, 0.1, o, { type: 'lowpass', freq: 800, gain: 0.6 });
    this.osc('sine', 200, this.now, 0.15, o, { gain: 0.25, f1: 120 });
  }
  horn() {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(null, 0.8, { reverb: 0.9 });
    [36, 43, 48].forEach((n) => this.osc('sawtooth', midi(n), t, 3.2, o, { gain: 0.12, attack: 0.8 }));
    this.osc('sine', 40, t, 3, o, { gain: 0.5, f1: 30, attack: 0.5 });
  }
  dawn() {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(null, 0.6, { reverb: 0.8 });
    [72, 76, 79, 84].forEach((n, i) => this.osc('triangle', midi(n), t + i * 0.18, 1.6, o, { gain: 0.12 }));
  }
  whistle() {
    if (!this.ok()) return;
    const t = this.now;
    const o = this.out(null, 0.7, { reverb: 0.9 });
    [523, 659, 784].forEach((f) => this.osc('sine', f, t, 1.8, o, { gain: 0.12, attack: 0.1 }));
    this.noise(t, 1.8, o, { freq: 2000, Q: 2, gain: 0.08, attack: 0.1 });
  }

  // ------------------------------------------------------------ music
  setMode(mode, instant = false) {
    this.mode = mode;
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const targets = {
      safe: { safe: 0.9, explore: 0, chase: 0 },
      explore: { safe: 0, explore: 0.85, chase: 0 },
      chase: { safe: 0, explore: 0.25, chase: 0.9 },
      dead: { safe: 0, explore: 0, chase: 0 },
    }[mode];
    for (const k in this.layers) {
      const L = this.layers[k];
      const tc = instant ? 0.01 : mode === 'chase' && k === 'chase' ? 0.25 : 1.6;
      L.gain.gain.cancelScheduledValues(t);
      L.gain.gain.setTargetAtTime(targets[k], t, tc);
      if (targets[k] > 0 && L.target === 0) L.next = Math.max(L.next, t + 0.05);
      L.target = targets[k];
    }
  }

  update() {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    for (const k in this.layers) {
      const L = this.layers[k];
      if (L.target === 0 && L.gain.gain.value < 0.002) {
        L.next = now + 0.05;
        continue;
      }
      let guard = 0;
      while (L.next < now + 0.25 && guard++ < 32) {
        if (L.next < now) L.next = now + 0.01;
        L.next += this['music_' + k](L.next, L);
      }
    }
    if (this.screech) {
      const v = this.layers.chase.target;
      this.screech.g.gain.setTargetAtTime(v * 0.022, now, 0.5);
      if (Math.random() < 0.01) this.screech.o.frequency.setTargetAtTime(1200 + Math.random() * 800, now, 0.6);
    }
  }

  pad(freqs, t, dur, dest, vol) {
    for (const f of freqs) {
      for (const [type, det] of [
        ['triangle', -5],
        ['sine', 6],
      ]) {
        const o = this.ctx.createOscillator();
        o.type = type;
        o.frequency.value = f;
        o.detune.value = det;
        const g = this.ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.35);
        g.gain.setValueAtTime(vol, t + dur * 0.65);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur * 1.15);
        o.connect(g).connect(dest);
        o.start(t);
        o.stop(t + dur * 1.2);
      }
    }
  }

  music_safe(t, L) {
    const chords = [
      [45, 57, 60, 64],
      [41, 57, 60, 65],
      [48, 55, 60, 64],
      [40, 56, 59, 64],
    ];
    const beat = 0.75;
    const ci = Math.floor(L.step / 12) % chords.length;
    if (L.step % 12 === 0) {
      if (!L.lp) {
        L.lp = this.ctx.createBiquadFilter();
        L.lp.type = 'lowpass';
        L.lp.frequency.value = 1100;
        L.lp.connect(L.gain);
      }
      this.pad(chords[ci].map(midi), t, beat * 12, L.lp, 0.035);
    }
    // music box
    if (Math.random() < 0.55) {
      const scale = [69, 71, 72, 74, 76, 77, 79, 80, 81, 84];
      L.mi = Math.max(0, Math.min(scale.length - 1, (L.mi ?? 4) + Math.floor(Math.random() * 5) - 2));
      const f = midi(scale[L.mi] + (ci === 3 && scale[L.mi] === 79 ? 1 : 0));
      this.osc('sine', f, t, 2.2, L.gain, { gain: 0.06, attack: 0.004 });
      this.osc('sine', f * 3, t, 0.5, L.gain, { gain: 0.012, attack: 0.004 });
    }
    L.step++;
    return beat;
  }

  startDrone() {
    const ctx = this.ctx;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 200;
    lp.Q.value = 5;
    const g = ctx.createGain();
    g.gain.value = 0.16;
    lp.connect(g).connect(this.layers.explore.gain);
    for (const [type, f] of [
      ['sawtooth', 55],
      ['sawtooth', 55.35],
      ['sine', 27.5],
      ['sawtooth', 82.6],
    ]) {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = f;
      const og = ctx.createGain();
      og.gain.value = f === 82.6 ? 0.25 : 0.6;
      o.connect(og).connect(lp);
      o.start();
    }
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.06;
    const lg = ctx.createGain();
    lg.gain.value = 120;
    lfo.connect(lg).connect(lp.frequency);
    lfo.start();
  }

  music_explore(t, L) {
    const dest = L.gain;
    const r = Math.random();
    if (r < 0.28) {
      // dissonant swell
      const base = midi(45 + Math.floor(Math.random() * 12));
      this.pad([base, base * 1.0595, base * 1.414], t, 6, dest, 0.02);
    } else if (r < 0.45) {
      // distant metallic clang
      const f = 70 + Math.random() * 120;
      [1, 2.76, 5.4, 8.93].forEach((m, i) => this.osc('sine', f * m, t, 3.5 - i * 0.6, dest, { gain: 0.05 / (i + 1), attack: 0.002 }));
    } else if (r < 0.62) {
      // whispers
      const p = this.ctx.createStereoPanner();
      p.pan.value = Math.random() * 2 - 1;
      p.connect(dest);
      for (let i = 0; i < 3; i++)
        this.noise(t + i * 0.35, 0.5 + Math.random() * 0.4, p, {
          freq: 900 + Math.random() * 1600,
          f1: 600 + Math.random() * 2400,
          Q: 9,
          gain: 0.12,
          attack: 0.12,
        });
    } else if (r < 0.75) {
      // low cello moan
      const f = midi(33 + Math.floor(Math.random() * 6));
      const lp = this.ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 500;
      lp.connect(dest);
      this.osc('sawtooth', f, t, 5, lp, { gain: 0.08, attack: 2.2, f1: f * 0.97 });
    } else if (r < 0.85) {
      this.osc('sine', 38, t, 1.8, dest, { gain: 0.25, attack: 0.02, f1: 30 }); // far thump
      this.osc('sine', 38, t + 0.9, 1.8, dest, { gain: 0.18, attack: 0.02, f1: 30 });
    }
    return 2.5 + Math.random() * 4;
  }

  startScreech() {
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = 1500;
    const vib = ctx.createOscillator();
    vib.frequency.value = 6.5;
    const vg = ctx.createGain();
    vg.gain.value = 35;
    vib.connect(vg).connect(o.frequency);
    const g = ctx.createGain();
    g.gain.value = 0;
    o.connect(g).connect(this.musicBus);
    o.start();
    vib.start();
    this.screech = { o, g };
  }

  music_chase(t, L) {
    const step = 60 / 172 / 4;
    const s = L.step % 16;
    const bar = Math.floor(L.step / 16);
    const dest = L.gain;
    if (s === 0 || s === 3 || s === 8 || s === 10 || (s === 14 && bar % 2)) {
      this.osc('sine', 130, t, 0.25, dest, { gain: 0.7, f1: 38, attack: 0.002 });
      this.noise(t, 0.03, dest, { type: 'lowpass', freq: 2000, gain: 0.25 });
    }
    if (s === 4 || s === 12) {
      this.noise(t, 0.16, dest, { freq: 1700, Q: 0.8, gain: 0.35 });
      this.osc('triangle', 210, t, 0.1, dest, { gain: 0.2, f1: 140 });
    }
    if (s % 2 === 0) this.noise(t, 0.03, dest, { type: 'highpass', freq: 7000, gain: 0.06 });
    if (s % 2 === 0) {
      const seq = [45, 45, 46, 45, 45, 51, 46, 44];
      const n = seq[(s / 2) % 8] - 12 + (bar % 4 === 3 ? 1 : 0);
      if (!L.bass) {
        L.bass = this.ctx.createBiquadFilter();
        L.bass.type = 'lowpass';
        L.bass.frequency.value = 420;
        L.bass.Q.value = 4;
        L.bass.connect(dest);
      }
      this.osc('sawtooth', midi(n), t, step * 1.8, L.bass, { gain: 0.35, attack: 0.004 });
    }
    if (s === 0 && bar % 2 === 0) {
      [57, 58, 63, 64].forEach((n) => this.osc('sawtooth', midi(n), t, 0.45, dest, { gain: 0.05, attack: 0.01 }));
    }
    if (s === 8 && bar % 4 === 3) {
      [69, 70, 75].forEach((n) => this.osc('sawtooth', midi(n), t, 0.7, dest, { gain: 0.04, attack: 0.3, f1: midi(n - 2) }));
    }
    L.step++;
    return step;
  }

  // ------------------------------------------------------------ loops
  // A looping positional noise.
  loop(freq, Q) {
    if (!this.ctx) return null;
    const ctx = this.ctx;
    const s = ctx.createBufferSource();
    s.buffer = this.noiseBuf;
    s.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = freq;
    f.Q.value = Q;
    const g = ctx.createGain();
    g.gain.value = 0;
    const p = ctx.createPanner();
    p.panningModel = 'HRTF';
    p.distanceModel = 'inverse';
    p.refDistance = 2.5;
    p.rolloffFactor = 1.2;
    s.connect(f).connect(g).connect(p).connect(this.sfxBus);
    s.start();
    return {
      set: (pos, vol) => {
        const t = ctx.currentTime;
        if (p.positionX) {
          p.positionX.setTargetAtTime(pos.x, t, 0.03);
          p.positionY.setTargetAtTime(1, t, 0.03);
          p.positionZ.setTargetAtTime(pos.z, t, 0.03);
        } else p.setPosition(pos.x, 1, pos.z);
        g.gain.setTargetAtTime(vol, t, 0.04);
      },
      stop: () => {
        try {
          s.stop();
        } catch (e) {
          /* already stopped */
        }
        s.disconnect();
        p.disconnect();
      },
    };
  }
}
