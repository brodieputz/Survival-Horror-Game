// Small math / random helpers shared across the game.

export function mulberry32(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class RNG {
  constructor(seed) {
    this.r = mulberry32(seed);
  }
  next() {
    return this.r();
  }
  range(a, b) {
    return a + (b - a) * this.r();
  }
  int(a, b) {
    return Math.floor(a + (b - a + 1) * this.r());
  }
  pick(arr) {
    return arr[Math.floor(this.r() * arr.length)];
  }
  chance(p) {
    return this.r() < p;
  }
  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.r() * (i + 1));
      const t = arr[i];
      arr[i] = arr[j];
      arr[j] = t;
    }
    return arr;
  }
}

export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
// Frame-rate independent exponential smoothing.
export const damp = (a, b, lambda, dt) => lerp(a, b, 1 - Math.exp(-lambda * dt));

export function angleDiff(a, b) {
  let d = b - a;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

export function dampAngle(a, b, lambda, dt) {
  return a + angleDiff(a, b) * (1 - Math.exp(-lambda * dt));
}

export const dist2D = (ax, az, bx, bz) => Math.hypot(ax - bx, az - bz);

// Minimal binary heap keyed on a numeric priority (used by A*).
export class MinHeap {
  constructor() {
    this.items = [];
    this.prio = [];
  }
  get size() {
    return this.items.length;
  }
  push(item, p) {
    const it = this.items;
    const pr = this.prio;
    it.push(item);
    pr.push(p);
    let i = it.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (pr[parent] <= pr[i]) break;
      [it[parent], it[i]] = [it[i], it[parent]];
      [pr[parent], pr[i]] = [pr[i], pr[parent]];
      i = parent;
    }
  }
  pop() {
    const it = this.items;
    const pr = this.prio;
    const top = it[0];
    const lastI = it.pop();
    const lastP = pr.pop();
    if (it.length > 0) {
      it[0] = lastI;
      pr[0] = lastP;
      let i = 0;
      const n = it.length;
      for (;;) {
        const l = i * 2 + 1;
        const r = l + 1;
        let m = i;
        if (l < n && pr[l] < pr[m]) m = l;
        if (r < n && pr[r] < pr[m]) m = r;
        if (m === i) break;
        [it[m], it[i]] = [it[i], it[m]];
        [pr[m], pr[i]] = [pr[i], pr[m]];
        i = m;
      }
    }
    return top;
  }
}
