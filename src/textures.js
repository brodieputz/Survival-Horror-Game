// Procedurally painted low-resolution textures (Doom-style pixel look).
import * as THREE from 'three';
import { RNG } from './util.js';

const cache = new Map();

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function toTex(c, { repeat = true, nearest = true, srgb = true } = {}) {
  const t = new THREE.CanvasTexture(c);
  if (nearest) {
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestMipmapLinearFilter;
  }
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.generateMipmaps = true;
  return t;
}

function shade(rgb, f) {
  return `rgb(${Math.max(0, Math.min(255, rgb[0] * f)) | 0},${Math.max(0, Math.min(255, rgb[1] * f)) | 0},${
    Math.max(0, Math.min(255, rgb[2] * f)) | 0
  })`;
}

function speckle(ctx, w, h, rng, amount, dark = 0.25) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = 1 + (rng.next() - 0.5) * amount;
    d[i] *= n;
    d[i + 1] *= n;
    d[i + 2] *= n;
    if (rng.next() < 0.02) {
      d[i] *= dark;
      d[i + 1] *= dark;
      d[i + 2] *= dark;
    }
  }
  ctx.putImageData(img, 0, 0);
}

function grime(ctx, w, h, rng, n, color) {
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = color;
    ctx.globalAlpha = rng.range(0.08, 0.25);
    ctx.beginPath();
    ctx.ellipse(rng.range(0, w), rng.range(0, h), rng.range(2, 10), rng.range(2, 10), 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drips(ctx, w, h, rng, n) {
  for (let i = 0; i < n; i++) {
    const x = rng.int(0, w - 2);
    const len = rng.int(6, h * 0.7);
    ctx.fillStyle = shade([90, 6, 6], rng.range(0.6, 1));
    ctx.fillRect(x, 0, rng.int(1, 2), len);
    ctx.fillRect(x - 1, len - 1, 3, 2);
  }
}

const builders = {
  brick(seed = 1) {
    const rng = new RNG(seed);
    const w = 64;
    const h = 64;
    const c = canvas(w, h);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#1b1816';
    ctx.fillRect(0, 0, w, h);
    const bh = 8;
    for (let row = 0; row < h / bh; row++) {
      const off = row % 2 ? 8 : 0;
      for (let bx = -16; bx < w; bx += 16) {
        const base = [70 + rng.int(-12, 12), 64 + rng.int(-12, 10), 56 + rng.int(-10, 10)];
        ctx.fillStyle = shade(base, rng.range(0.75, 1.1));
        ctx.fillRect(bx + off + 1, row * bh + 1, 15, bh - 1);
        ctx.fillStyle = shade(base, 1.25);
        ctx.fillRect(bx + off + 1, row * bh + 1, 15, 1);
        ctx.fillStyle = shade(base, 0.6);
        ctx.fillRect(bx + off + 1, row * bh + bh - 1, 15, 1);
      }
    }
    speckle(ctx, w, h, rng, 0.35);
    grime(ctx, w, h, rng, 14, '#0a0806');
    grime(ctx, w, h, rng, 4, '#2a3a1a');
    if (rng.chance(0.5)) drips(ctx, w, h, rng, rng.int(1, 3));
    return toTex(c);
  },
  stoneBlocks(seed = 2) {
    const rng = new RNG(seed);
    const w = 64;
    const h = 64;
    const c = canvas(w, h);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#141414';
    ctx.fillRect(0, 0, w, h);
    for (let y = 0; y < 2; y++)
      for (let x = 0; x < 2; x++) {
        const base = [58 + rng.int(-8, 8), 58 + rng.int(-8, 8), 62 + rng.int(-8, 8)];
        ctx.fillStyle = shade(base, 1);
        ctx.fillRect(x * 32 + 1, y * 32 + 1, 30, 30);
        ctx.fillStyle = shade(base, 1.3);
        ctx.fillRect(x * 32 + 1, y * 32 + 1, 30, 1);
        ctx.fillRect(x * 32 + 1, y * 32 + 1, 1, 30);
        ctx.fillStyle = shade(base, 0.55);
        ctx.fillRect(x * 32 + 1, y * 32 + 30, 30, 1);
        ctx.fillRect(x * 32 + 30, y * 32 + 1, 1, 30);
      }
    speckle(ctx, w, h, rng, 0.4);
    grime(ctx, w, h, rng, 18, '#050505');
    // cracks
    ctx.strokeStyle = '#0c0c0c';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      let x = rng.range(0, w);
      let y = rng.range(0, h);
      ctx.moveTo(x, y);
      for (let k = 0; k < 5; k++) {
        x += rng.range(-6, 6);
        y += rng.range(-6, 6);
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    if (rng.chance(0.4)) drips(ctx, w, h, rng, 2);
    return toTex(c);
  },
  floor(seed = 3) {
    const rng = new RNG(seed);
    const w = 64;
    const h = 64;
    const c = canvas(w, h);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#121010';
    ctx.fillRect(0, 0, w, h);
    // irregular flagstones
    const cells = [
      [0, 0, 26, 20],
      [26, 0, 38, 20],
      [0, 20, 18, 24],
      [18, 20, 28, 24],
      [46, 20, 18, 24],
      [0, 44, 34, 20],
      [34, 44, 30, 20],
    ];
    for (const [x, y, cw, ch] of cells) {
      const base = [52 + rng.int(-8, 8), 48 + rng.int(-6, 6), 44 + rng.int(-6, 6)];
      ctx.fillStyle = shade(base, 1);
      ctx.fillRect(x + 1, y + 1, cw - 2, ch - 2);
      ctx.fillStyle = shade(base, 1.2);
      ctx.fillRect(x + 1, y + 1, cw - 2, 1);
      ctx.fillStyle = shade(base, 0.6);
      ctx.fillRect(x + 1, y + ch - 2, cw - 2, 1);
    }
    speckle(ctx, w, h, rng, 0.45);
    grime(ctx, w, h, rng, 20, '#060404');
    grime(ctx, w, h, rng, 3, '#3a0505');
    return toTex(c);
  },
  ceiling(seed = 4) {
    const rng = new RNG(seed);
    const w = 64;
    const h = 64;
    const c = canvas(w, h);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#1a1817';
    ctx.fillRect(0, 0, w, h);
    speckle(ctx, w, h, rng, 0.8, 0.4);
    grime(ctx, w, h, rng, 30, '#050403');
    ctx.fillStyle = '#0a0908';
    for (let i = 0; i < 4; i++) ctx.fillRect(0, i * 16, w, 1);
    return toTex(c);
  },
  wood(seed = 5) {
    const rng = new RNG(seed);
    const w = 64;
    const h = 64;
    const c = canvas(w, h);
    const ctx = c.getContext('2d');
    for (let i = 0; i < 8; i++) {
      const base = [92 + rng.int(-14, 10), 58 + rng.int(-10, 8), 34 + rng.int(-8, 6)];
      ctx.fillStyle = shade(base, 1);
      ctx.fillRect(i * 8, 0, 8, h);
      ctx.fillStyle = shade(base, 0.55);
      ctx.fillRect(i * 8, 0, 1, h);
      // grain
      for (let g = 0; g < 6; g++) {
        ctx.fillStyle = shade(base, rng.range(0.7, 0.9));
        ctx.fillRect(i * 8 + rng.int(2, 6), rng.int(0, h), 1, rng.int(6, 20));
      }
      // nails
      ctx.fillStyle = '#222';
      ctx.fillRect(i * 8 + 3, 4, 1, 1);
      ctx.fillRect(i * 8 + 3, 59, 1, 1);
    }
    speckle(ctx, w, h, rng, 0.2);
    return toTex(c);
  },
  woodFloor(seed = 6) {
    const rng = new RNG(seed);
    const w = 64;
    const h = 64;
    const c = canvas(w, h);
    const ctx = c.getContext('2d');
    for (let i = 0; i < 4; i++) {
      const off = (i % 2) * 16;
      for (let s = -1; s < 2; s++) {
        const base = [80 + rng.int(-10, 10), 50 + rng.int(-8, 8), 30 + rng.int(-6, 6)];
        const x = s * 32 + off;
        ctx.fillStyle = shade(base, 1);
        ctx.fillRect(x, i * 16, 32, 16);
        ctx.fillStyle = shade(base, 0.5);
        ctx.fillRect(x, i * 16, 1, 16);
      }
      ctx.fillStyle = '#1a0f08';
      ctx.fillRect(0, i * 16, w, 1);
    }
    speckle(ctx, w, h, rng, 0.25);
    return toTex(c);
  },
  metal(seed = 7) {
    const rng = new RNG(seed);
    const w = 32;
    const h = 64;
    const c = canvas(w, h);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#4a5050';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#2a2e2e';
    ctx.fillRect(0, 0, w, 1);
    ctx.fillRect(0, 0, 1, h);
    ctx.fillRect(w - 1, 0, 1, h);
    // vent slats
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = '#0c0d0d';
      ctx.fillRect(8, 6 + i * 3, 16, 1);
    }
    ctx.fillStyle = '#8a8a7a';
    ctx.fillRect(25, 30, 2, 6); // handle
    speckle(ctx, w, h, rng, 0.25);
    grime(ctx, w, h, rng, 10, '#3a1c08'); // rust
    grime(ctx, w, h, rng, 2, '#400000');
    return toTex(c, { repeat: false });
  },
  closet(seed = 8) {
    const rng = new RNG(seed);
    const w = 32;
    const h = 64;
    const c = canvas(w, h);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#3c2416';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#24140a';
    ctx.fillRect(15, 0, 2, h);
    for (const x of [2, 18]) {
      ctx.strokeStyle = '#4e3020';
      ctx.strokeRect(x + 1.5, 4.5, 10, 24);
      ctx.strokeRect(x + 1.5, 34.5, 10, 24);
    }
    ctx.fillStyle = '#a08040';
    ctx.fillRect(13, 30, 1, 3);
    ctx.fillRect(18, 30, 1, 3);
    speckle(ctx, w, h, rng, 0.3);
    return toTex(c, { repeat: false });
  },
  crate(seed = 9) {
    const rng = new RNG(seed);
    const w = 32;
    const h = 32;
    const c = canvas(w, h);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#6b4a28';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = '#4a3018';
      ctx.fillRect(0, i * 8, w, 1);
    }
    ctx.fillStyle = '#3e2810';
    ctx.fillRect(0, 0, w, 3);
    ctx.fillRect(0, h - 3, w, 3);
    ctx.fillRect(0, 0, 3, h);
    ctx.fillRect(w - 3, 0, 3, h);
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-22, -1.5, 44, 3);
    ctx.restore();
    speckle(ctx, w, h, rng, 0.3);
    return toTex(c, { repeat: false });
  },
  lockedCrate(seed = 10) {
    const rng = new RNG(seed);
    const w = 32;
    const h = 32;
    const c = canvas(w, h);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#3a2814';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#555a5a';
    ctx.fillRect(0, 0, w, 3);
    ctx.fillRect(0, h - 3, w, 3);
    ctx.fillRect(0, 0, 3, h);
    ctx.fillRect(w - 3, 0, 3, h);
    ctx.fillRect(0, 14, w, 4);
    ctx.fillStyle = '#9a9a8a';
    for (const [x, y] of [
      [1, 1],
      [w - 2, 1],
      [1, h - 2],
      [w - 2, h - 2],
      [8, 15],
      [24, 15],
    ])
      ctx.fillRect(x, y, 1, 1);
    speckle(ctx, w, h, rng, 0.3);
    return toTex(c, { repeat: false });
  },
  flesh(seed = 11) {
    const rng = new RNG(seed);
    const w = 32;
    const h = 32;
    const c = canvas(w, h);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    speckle(ctx, w, h, rng, 0.5, 0.6);
    grime(ctx, w, h, rng, 12, '#704040');
    ctx.strokeStyle = 'rgba(80,20,30,0.5)';
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(rng.range(0, w), rng.range(0, h));
      ctx.lineTo(rng.range(0, w), rng.range(0, h));
      ctx.stroke();
    }
    return toTex(c);
  },
  stone(seed = 12) {
    const rng = new RNG(seed);
    const w = 32;
    const h = 32;
    const c = canvas(w, h);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#bbbbb4';
    ctx.fillRect(0, 0, w, h);
    speckle(ctx, w, h, rng, 0.35, 0.7);
    grime(ctx, w, h, rng, 14, '#555550');
    grime(ctx, w, h, rng, 5, '#3a4a30');
    return toTex(c);
  },
  blood(seed = 13) {
    const rng = new RNG(seed);
    const w = 64;
    const h = 64;
    const c = canvas(w, h);
    const ctx = c.getContext('2d');
    ctx.fillStyle = 'rgba(80,0,0,0.95)';
    ctx.beginPath();
    ctx.ellipse(32, 32, rng.range(12, 18), rng.range(10, 16), rng.range(0, 3), 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < 14; i++) {
      const a = rng.range(0, Math.PI * 2);
      const r = rng.range(10, 28);
      ctx.fillStyle = `rgba(${rng.int(60, 100)},0,0,${rng.range(0.6, 0.95)})`;
      ctx.beginPath();
      ctx.arc(32 + Math.cos(a) * r, 32 + Math.sin(a) * r, rng.range(1, 5), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = 'rgba(30,0,0,0.6)';
    ctx.beginPath();
    ctx.ellipse(30, 34, 8, 6, 0.4, 0, Math.PI * 2);
    ctx.fill();
    return toTex(c, { repeat: false });
  },
  glow() {
    const c = canvas(64, 64);
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.25, 'rgba(255,255,255,0.45)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return toTex(c, { repeat: false, nearest: false });
  },
  flame() {
    const c = canvas(16, 32);
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(8, 22, 1, 8, 20, 14);
    g.addColorStop(0, 'rgba(255,250,200,1)');
    g.addColorStop(0.3, 'rgba(255,170,40,0.95)');
    g.addColorStop(0.7, 'rgba(200,50,0,0.5)');
    g.addColorStop(1, 'rgba(100,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(8, 0);
    ctx.quadraticCurveTo(16, 18, 13, 26);
    ctx.quadraticCurveTo(8, 33, 3, 26);
    ctx.quadraticCurveTo(0, 18, 8, 0);
    ctx.fill();
    return toTex(c, { repeat: false });
  },
  rug() {
    const rng = new RNG(77);
    const c = canvas(32, 48);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#4a1010';
    ctx.fillRect(0, 0, 32, 48);
    ctx.strokeStyle = '#a07020';
    ctx.strokeRect(2.5, 2.5, 27, 43);
    ctx.strokeStyle = '#2a0808';
    ctx.strokeRect(5.5, 5.5, 21, 37);
    ctx.fillStyle = '#a07020';
    ctx.beginPath();
    ctx.moveTo(16, 12);
    ctx.lineTo(24, 24);
    ctx.lineTo(16, 36);
    ctx.lineTo(8, 24);
    ctx.closePath();
    ctx.fill();
    speckle(ctx, 32, 48, rng, 0.3);
    return toTex(c, { repeat: false });
  },
  rune() {
    const c = canvas(64, 64);
    const ctx = c.getContext('2d');
    ctx.strokeStyle = 'rgba(120,255,170,1)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(32, 32, 28, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(32, 32, 22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i * 4 * Math.PI) / 5;
      const x = 32 + Math.cos(a) * 22;
      const y = 32 + Math.sin(a) * 22;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    return toTex(c, { repeat: false, nearest: false });
  },
  hatch() {
    const rng = new RNG(5);
    const c = canvas(32, 32);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#3a2614';
    ctx.fillRect(0, 0, 32, 32);
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = '#24160a';
      ctx.fillRect(i * 8, 0, 1, 32);
    }
    ctx.fillStyle = '#505555';
    ctx.fillRect(0, 5, 32, 3);
    ctx.fillRect(0, 24, 32, 3);
    speckle(ctx, 32, 32, rng, 0.3);
    return toTex(c, { repeat: false });
  },
  // ---------------------------------------------------------------- buildings
  tile(seed = 20) {
    const rng = new RNG(seed);
    const c = canvas(64, 64);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#5a5a56';
    ctx.fillRect(0, 0, 64, 64);
    for (let y = 0; y < 4; y++)
      for (let x = 0; x < 4; x++) {
        const v = rng.int(150, 182);
        ctx.fillStyle = shade([v, v, v - 6], 1);
        ctx.fillRect(x * 16 + 1, y * 16 + 1, 15, 15);
        ctx.fillStyle = shade([v, v, v - 6], 1.12);
        ctx.fillRect(x * 16 + 1, y * 16 + 1, 15, 1);
      }
    speckle(ctx, 64, 64, rng, 0.25);
    grime(ctx, 64, 64, rng, 16, '#3a3020');
    grime(ctx, 64, 64, rng, 3, '#4a0606');
    if (rng.chance(0.7)) drips(ctx, 64, 64, rng, rng.int(1, 3));
    return toTex(c);
  },
  linoleum(seed = 21) {
    const rng = new RNG(seed);
    const c = canvas(64, 64);
    const ctx = c.getContext('2d');
    for (let y = 0; y < 4; y++)
      for (let x = 0; x < 4; x++) {
        const dark = (x + y) % 2 === 0;
        ctx.fillStyle = dark ? '#3c4038' : '#8a8a78';
        ctx.fillRect(x * 16, y * 16, 16, 16);
      }
    speckle(ctx, 64, 64, rng, 0.3);
    grime(ctx, 64, 64, rng, 24, '#14100a');
    grime(ctx, 64, 64, rng, 3, '#3a0404');
    return toTex(c);
  },
  wallpaper(seed = 22) {
    const rng = new RNG(seed);
    const c = canvas(64, 64);
    const ctx = c.getContext('2d');
    const base = rng.pick([
      [96, 82, 58],
      [70, 84, 72],
      [90, 70, 76],
      [76, 76, 92],
    ]);
    ctx.fillStyle = shade(base, 1);
    ctx.fillRect(0, 0, 64, 64);
    for (let x = 0; x < 64; x += 8) {
      ctx.fillStyle = shade(base, 0.8);
      ctx.fillRect(x, 0, 2, 64);
      for (let y = 4; y < 64; y += 12) {
        ctx.fillStyle = shade(base, 1.2);
        ctx.fillRect(x + 4, y, 2, 2);
      }
    }
    // peeling patches and a dark skirting board
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = '#4a4238';
      ctx.fillRect(rng.int(0, 56), rng.int(0, 50), rng.int(3, 9), rng.int(4, 12));
    }
    ctx.fillStyle = '#2a1a10';
    ctx.fillRect(0, 58, 64, 6);
    speckle(ctx, 64, 64, rng, 0.25);
    grime(ctx, 64, 64, rng, 18, '#1a120a');
    if (rng.chance(0.6)) drips(ctx, 64, 64, rng, rng.int(1, 2));
    return toTex(c);
  },
  concrete(seed = 23) {
    const rng = new RNG(seed);
    const c = canvas(64, 64);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#6a6862';
    ctx.fillRect(0, 0, 64, 64);
    speckle(ctx, 64, 64, rng, 0.45, 0.6);
    grime(ctx, 64, 64, rng, 26, '#2a2824');
    ctx.fillStyle = '#4a4844';
    ctx.fillRect(0, 31, 64, 1);
    ctx.fillRect(31, 0, 1, 64);
    for (const [x, y] of [
      [8, 8],
      [56, 8],
      [8, 56],
      [56, 56],
    ])
      ctx.fillRect(x, y, 2, 2);
    if (rng.chance(0.5)) drips(ctx, 64, 64, rng, 1);
    return toTex(c);
  },
  carpet(seed = 24) {
    const rng = new RNG(seed);
    const c = canvas(32, 32);
    const ctx = c.getContext('2d');
    const base = rng.pick([
      [70, 34, 34],
      [40, 52, 70],
      [66, 60, 44],
    ]);
    ctx.fillStyle = shade(base, 1);
    ctx.fillRect(0, 0, 32, 32);
    speckle(ctx, 32, 32, rng, 0.5, 0.5);
    grime(ctx, 32, 32, rng, 10, '#120a06');
    return toTex(c);
  },
  sheetMetal(seed = 25) {
    const rng = new RNG(seed);
    const c = canvas(64, 64);
    const ctx = c.getContext('2d');
    for (let x = 0; x < 64; x += 4) {
      ctx.fillStyle = x % 8 ? '#5a6062' : '#454a4c';
      ctx.fillRect(x, 0, 4, 64);
    }
    speckle(ctx, 64, 64, rng, 0.3);
    grime(ctx, 64, 64, rng, 18, '#5a2a0a');
    grime(ctx, 64, 64, rng, 10, '#1a1a1a');
    return toTex(c);
  },
  // ---------------------------------------------------------------- outdoors
  asphalt(seed = 30) {
    const rng = new RNG(seed);
    const c = canvas(64, 64);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#34363a';
    ctx.fillRect(0, 0, 64, 64);
    speckle(ctx, 64, 64, rng, 0.6, 0.5);
    ctx.strokeStyle = '#1c1c1e';
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      let x = rng.range(0, 64);
      let y = rng.range(0, 64);
      ctx.moveTo(x, y);
      for (let k = 0; k < 6; k++) ctx.lineTo((x += rng.range(-8, 8)), (y += rng.range(-8, 8)));
      ctx.stroke();
    }
    return toTex(c);
  },
  grass(seed = 31) {
    const rng = new RNG(seed);
    const c = canvas(64, 64);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#3a4a26';
    ctx.fillRect(0, 0, 64, 64);
    for (let i = 0; i < 700; i++) {
      const g = rng.int(50, 95);
      ctx.fillStyle = `rgb(${g - 18},${g},${g - 40})`;
      ctx.fillRect(rng.int(0, 63), rng.int(0, 63), 1, rng.int(1, 3));
    }
    grime(ctx, 64, 64, rng, 12, '#2a2414');
    return toTex(c);
  },
  sand(seed = 32) {
    const rng = new RNG(seed);
    const c = canvas(64, 64);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#b8945e';
    ctx.fillRect(0, 0, 64, 64);
    speckle(ctx, 64, 64, rng, 0.3, 0.8);
    ctx.strokeStyle = 'rgba(120,90,50,0.5)';
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      const y = rng.range(0, 64);
      ctx.moveTo(0, y);
      ctx.quadraticCurveTo(32, y + rng.range(-6, 6), 64, y);
      ctx.stroke();
    }
    return toTex(c);
  },
  snow(seed = 33) {
    const rng = new RNG(seed);
    const c = canvas(64, 64);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#d4dce6';
    ctx.fillRect(0, 0, 64, 64);
    speckle(ctx, 64, 64, rng, 0.12, 0.85);
    grime(ctx, 64, 64, rng, 14, '#9aa6b6');
    return toTex(c);
  },
  dirt(seed = 34) {
    const rng = new RNG(seed);
    const c = canvas(64, 64);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#4a3a2a';
    ctx.fillRect(0, 0, 64, 64);
    speckle(ctx, 64, 64, rng, 0.5, 0.6);
    grime(ctx, 64, 64, rng, 20, '#2a1e12');
    return toTex(c);
  },
  canvasCloth(seed = 35) {
    const rng = new RNG(seed);
    const c = canvas(32, 32);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#6a6448';
    ctx.fillRect(0, 0, 32, 32);
    for (let i = 0; i < 32; i += 2) {
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.fillRect(i, 0, 1, 32);
      ctx.fillRect(0, i, 32, 1);
    }
    speckle(ctx, 32, 32, rng, 0.2);
    grime(ctx, 32, 32, rng, 8, '#2a2418');
    return toTex(c);
  },
  bark(seed = 36) {
    const rng = new RNG(seed);
    const c = canvas(32, 64);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#3a2a1c';
    ctx.fillRect(0, 0, 32, 64);
    for (let i = 0; i < 14; i++) {
      ctx.fillStyle = shade([40, 28, 18], rng.range(0.5, 1.3));
      ctx.fillRect(rng.int(0, 30), 0, rng.int(1, 3), 64);
    }
    speckle(ctx, 32, 64, rng, 0.3);
    return toTex(c);
  },
  trainMetal(seed = 37) {
    const rng = new RNG(seed);
    const c = canvas(64, 32);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#4a2e22';
    ctx.fillRect(0, 0, 64, 32);
    for (let x = 0; x < 64; x += 16) {
      ctx.fillStyle = '#2a1a12';
      ctx.fillRect(x, 0, 1, 32);
      ctx.fillStyle = '#8a8478';
      for (let y = 3; y < 32; y += 6) ctx.fillRect(x + 2, y, 1, 1);
    }
    speckle(ctx, 64, 32, rng, 0.3);
    grime(ctx, 64, 32, rng, 16, '#6a3a12');
    grime(ctx, 64, 32, rng, 10, '#141010');
    return toTex(c);
  },
  mapPaper(seed = 38) {
    const rng = new RNG(seed);
    const c = canvas(64, 48);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#c8b48a';
    ctx.fillRect(0, 0, 64, 48);
    ctx.strokeStyle = '#6a5030';
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(rng.range(0, 64), rng.range(0, 48));
      ctx.lineTo(rng.range(0, 64), rng.range(0, 48));
      ctx.stroke();
    }
    ctx.fillStyle = '#8a2a1a';
    for (let i = 0; i < 6; i++) ctx.fillRect(rng.int(4, 58), rng.int(4, 42), 3, 3);
    speckle(ctx, 64, 48, rng, 0.2);
    return toTex(c, { repeat: false });
  },
};

export function tex(name, seed) {
  const key = name + ':' + (seed ?? '');
  if (!cache.has(key)) cache.set(key, builders[name](seed));
  return cache.get(key);
}
