// Procedurally painted textures. Each is painted small, then upscaled
// seamlessly with smoothing and a layer of fine grain so surfaces read as
// detailed materials up close rather than chunky pixels.
import * as THREE from 'three';
import { RNG } from './util.js';

const cache = new Map();
let ANISO = 4;

export function setAnisotropy(n) {
  ANISO = n;
  for (const t of cache.values()) {
    t.anisotropy = n;
    t.needsUpdate = true;
  }
}

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

let grainSeed = 1;
function addGrain(ctx, w, h, amount) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  let s = (grainSeed = (grainSeed * 16807) % 2147483647);
  for (let i = 0; i < d.length; i += 4) {
    s = (s * 16807) % 2147483647;
    const n = 1 + ((s / 2147483647) - 0.5) * amount;
    d[i] *= n;
    d[i + 1] *= n;
    d[i + 2] *= n;
  }
  ctx.putImageData(img, 0, 0);
}

// Upscale a small painted tile. Repeating tiles are sampled from a 3x3
// mosaic of themselves so the smoothing wraps around the edges seamlessly.
function upscale(c, repeat) {
  const k = c.width <= 32 ? 8 : c.width <= 64 ? 4 : 2;
  const W = c.width * k;
  const H = c.height * k;
  const big = canvas(W, H);
  const ctx = big.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  if (repeat) {
    const mosaic = canvas(c.width * 3, c.height * 3);
    const m = mosaic.getContext('2d');
    for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) m.drawImage(c, x * c.width, y * c.height);
    ctx.drawImage(mosaic, c.width, c.height, c.width, c.height, 0, 0, W, H);
  } else ctx.drawImage(c, 0, 0, W, H);
  addGrain(ctx, W, H, 0.1);
  return big;
}

function toTex(c, { repeat = true, srgb = true, detail = true } = {}) {
  const src = detail && c.width <= 128 ? upscale(c, repeat) : c;
  const t = new THREE.CanvasTexture(src);
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.anisotropy = ANISO;
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

// ---------------------------------------------------------------- facade helpers
function bricks(ctx, rng, w, h, base) {
  ctx.fillStyle = shade(base, 0.45);
  ctx.fillRect(0, 0, w, h);
  for (let row = 0; row * 6 < h; row++) {
    const off = row % 2 ? 7 : 0;
    for (let x = -14; x < w; x += 14) {
      ctx.fillStyle = shade(base, rng.range(0.78, 1.12));
      ctx.fillRect(x + off + 1, row * 6 + 1, 13, 5);
    }
  }
}

function cracks(ctx, rng, cx, cy, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let i = 0; i < 7; i++) {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    let x = cx;
    let y = cy;
    for (let k = 0; k < 4; k++) ctx.lineTo((x += rng.range(-12, 12)), (y += rng.range(-12, 12)));
    ctx.stroke();
  }
}

// A window with frame and sill. variant: 0 intact, 1 boarded, 2 broken.
function window_(ctx, rng, x, y, w, h, variant, frame, shutters) {
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(x - 3, y + h + 2, w + 6, 4); // sill shadow
  ctx.fillStyle = frame;
  ctx.fillRect(x - 4, y - 4, w + 8, h + 8);
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, '#5a6a78');
  g.addColorStop(0.5, '#1a2028');
  g.addColorStop(1, '#2a3038');
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = 'rgba(220,230,240,0.12)';
  ctx.fillRect(x + 4, y + 2, w * 0.25, h - 4);
  ctx.fillStyle = frame;
  ctx.fillRect(x + w / 2 - 1.5, y, 3, h);
  ctx.fillRect(x, y + h / 2 - 1.5, w, 3);
  if (rng.chance(0.4) && variant === 0) {
    ctx.fillStyle = rng.pick(['rgba(140,60,50,0.7)', 'rgba(200,190,150,0.6)', 'rgba(60,80,110,0.6)']);
    ctx.fillRect(x + 1, y + 1, w * 0.22, h - 2);
    ctx.fillRect(x + w * 0.78 - 1, y + 1, w * 0.22, h - 2);
  }
  if (shutters) {
    ctx.fillStyle = '#3a4a3a';
    ctx.fillRect(x - 16, y - 4, 10, h + 8);
    ctx.fillRect(x + w + 6, y - 4, 10, h + 8);
  }
  if (variant === 1) {
    ctx.fillStyle = '#7a5a3a';
    for (let i = 0; i < 4; i++) {
      ctx.save();
      ctx.translate(x + w / 2, y + 8 + i * (h / 4));
      ctx.rotate(rng.range(-0.15, 0.15));
      ctx.fillRect(-w / 2 - 4, -5, w + 8, 10);
      ctx.restore();
    }
  } else if (variant === 2) {
    ctx.fillStyle = '#06080a';
    ctx.beginPath();
    ctx.moveTo(x + w * 0.3, y);
    ctx.lineTo(x + w, y + h * 0.2);
    ctx.lineTo(x + w * 0.7, y + h * 0.8);
    ctx.lineTo(x + w * 0.2, y + h * 0.5);
    ctx.fill();
    cracks(ctx, rng, x + w * 0.5, y + h * 0.4, 'rgba(200,210,220,0.7)');
  }
}

// A horizontal ribbon window (offices, police, military).
function ribbon(ctx, rng, x, y, w, h, variant) {
  ctx.fillStyle = '#3a3a38';
  ctx.fillRect(x - 3, y - 3, w + 6, h + 6);
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, '#506070');
  g.addColorStop(1, '#161c22');
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#3a3a38';
  for (let i = 1; i < 4; i++) ctx.fillRect(x + (w / 4) * i - 1, y, 2, h);
  if (variant === 1) {
    ctx.fillStyle = '#6a5038';
    for (let i = 0; i < 3; i++) ctx.fillRect(x - 2, y + 2 + i * 11, w + 4, 8);
  } else if (variant === 2) cracks(ctx, rng, x + w * 0.6, y + h * 0.5, 'rgba(200,210,220,0.7)');
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
    return toTex(c, { repeat: false, detail: false });
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
    return toTex(c, { repeat: false, detail: false });
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
  // ---------------------------------------------------------------- lived-in interiors
  // painted plaster: the colour comes from the seed; a skirting board,
  // scuffs, damp and old picture outlines
  plaster(seed = 100) {
    const rng = new RNG(seed);
    const c = canvas(64, 64);
    const ctx = c.getContext('2d');
    const base = [
      [176, 164, 140],
      [150, 166, 160],
      [168, 150, 136],
      [140, 150, 170],
      [186, 178, 150],
      [130, 140, 116],
      [176, 140, 130],
      [158, 158, 152],
    ][seed % 8];
    ctx.fillStyle = shade(base, 0.9);
    ctx.fillRect(0, 0, 64, 64);
    speckle(ctx, 64, 64, rng, 0.18, 0.5);
    if (seed % 3 === 0) {
      // wainscoting below a chair rail
      ctx.fillStyle = shade(base, 0.62);
      ctx.fillRect(0, 40, 64, 24);
      ctx.fillStyle = shade(base, 0.5);
      for (let x = 0; x < 64; x += 16) ctx.fillRect(x, 40, 1, 24);
      ctx.fillStyle = shade(base, 1.1);
      ctx.fillRect(0, 39, 64, 2);
    }
    ctx.fillStyle = '#3a2a1c';
    ctx.fillRect(0, 59, 64, 5);
    ctx.fillStyle = '#5a4430';
    ctx.fillRect(0, 59, 64, 1);
    grime(ctx, 64, 64, rng, 10, '#2a1e14');
    if (rng.chance(0.5)) drips(ctx, 64, 64, rng, 1);
    return toTex(c);
  },
  kitchenFloor(seed = 101) {
    const rng = new RNG(seed);
    const c = canvas(64, 64);
    const ctx = c.getContext('2d');
    for (let y = 0; y < 4; y++)
      for (let x = 0; x < 4; x++) {
        ctx.fillStyle = (x + y) % 2 ? '#d8d2c0' : seed % 2 ? '#2a2c2a' : '#7a3a2a';
        ctx.fillRect(x * 16, y * 16, 16, 16);
      }
    speckle(ctx, 64, 64, rng, 0.25, 0.4);
    grime(ctx, 64, 64, rng, 20, '#2a2014');
    grime(ctx, 64, 64, rng, 2, '#3a0606');
    return toTex(c);
  },
  bathTile(seed = 102) {
    const rng = new RNG(seed);
    const c = canvas(64, 64);
    const ctx = c.getContext('2d');
    const tint = [
      [214, 214, 206],
      [180, 206, 196],
      [190, 200, 220],
    ][seed % 3];
    ctx.fillStyle = '#6a6a64';
    ctx.fillRect(0, 0, 64, 64);
    for (let y = 0; y < 8; y++)
      for (let x = 0; x < 8; x++) {
        const f = rng.range(0.92, 1.04);
        ctx.fillStyle = shade(tint, f);
        ctx.fillRect(x * 8 + 1, y * 8 + 1, 7, 7);
      }
    // a darker band of tiles at waist height
    ctx.fillStyle = 'rgba(30,40,40,0.35)';
    ctx.fillRect(0, 32, 64, 8);
    grime(ctx, 64, 64, rng, 18, '#3a3224');
    if (rng.chance(0.7)) drips(ctx, 64, 64, rng, rng.int(1, 3));
    return toTex(c);
  },
  terrazzo(seed = 103) {
    const rng = new RNG(seed);
    const c = canvas(64, 64);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#a8a49a';
    ctx.fillRect(0, 0, 64, 64);
    for (let i = 0; i < 260; i++) {
      ctx.fillStyle = rng.pick(['#e0dcd0', '#6a665e', '#8a7a68', '#c8c0b0', '#4a4844']);
      ctx.fillRect(rng.int(0, 63), rng.int(0, 63), rng.int(1, 2), rng.int(1, 2));
    }
    ctx.fillStyle = 'rgba(60,56,50,0.5)';
    ctx.fillRect(0, 0, 64, 1);
    ctx.fillRect(0, 0, 1, 64);
    grime(ctx, 64, 64, rng, 14, '#2a2620');
    return toTex(c);
  },
  rugPattern(seed = 104) {
    const rng = new RNG(seed);
    const c = canvas(128, 128);
    const ctx = c.getContext('2d');
    const pal = [
      ['#6a1e1a', '#c8a060', '#1e2a3a'],
      ['#1e3a4a', '#d8c8a0', '#6a2a1a'],
      ['#4a3a20', '#a87a40', '#2a1a10'],
      ['#3a4a2a', '#c8b890', '#5a2020'],
    ][seed % 4];
    ctx.fillStyle = pal[0];
    ctx.fillRect(0, 0, 128, 128);
    ctx.strokeStyle = pal[1];
    ctx.lineWidth = 5;
    ctx.strokeRect(8, 8, 112, 112);
    ctx.lineWidth = 2;
    ctx.strokeRect(18, 18, 92, 92);
    ctx.fillStyle = pal[2];
    ctx.beginPath();
    ctx.moveTo(64, 30);
    ctx.lineTo(98, 64);
    ctx.lineTo(64, 98);
    ctx.lineTo(30, 64);
    ctx.fill();
    ctx.fillStyle = pal[1];
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(64, 64, 6 + i * 6, 0, Math.PI * 2);
      ctx.globalAlpha = 0.25;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    speckle(ctx, 128, 128, rng, 0.35, 0.5);
    grime(ctx, 128, 128, rng, 10, '#1a100a');
    return toTex(c, { repeat: false });
  },
  painting(seed = 105) {
    const rng = new RNG(seed);
    const c = canvas(64, 48);
    const ctx = c.getContext('2d');
    const kind = seed % 4;
    if (kind === 0) {
      // a landscape
      const g = ctx.createLinearGradient(0, 0, 0, 48);
      g.addColorStop(0, '#7a9ab0');
      g.addColorStop(0.6, '#d8c8a0');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 48);
      ctx.fillStyle = '#4a5a3a';
      ctx.beginPath();
      ctx.moveTo(0, 34);
      for (let x = 0; x <= 64; x += 8) ctx.lineTo(x, 26 + rng.range(-6, 6));
      ctx.lineTo(64, 48);
      ctx.lineTo(0, 48);
      ctx.fill();
    } else if (kind === 1) {
      // a portrait
      ctx.fillStyle = '#2a2018';
      ctx.fillRect(0, 0, 64, 48);
      ctx.fillStyle = '#c89a78';
      ctx.beginPath();
      ctx.ellipse(32, 20, 9, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#3a2a40';
      ctx.fillRect(18, 32, 28, 16);
    } else if (kind === 2) {
      // a family photo
      ctx.fillStyle = '#c8c0a8';
      ctx.fillRect(0, 0, 64, 48);
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = rng.pick(['#e0b090', '#a07050', '#704a30']);
        ctx.beginPath();
        ctx.arc(12 + i * 13, 20 + rng.range(-3, 3), 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = rng.pick(['#3a5a8a', '#8a3a3a', '#4a6a3a', '#5a4a6a']);
        ctx.fillRect(7 + i * 13, 26, 10, 16);
      }
    } else {
      // abstract office art
      ctx.fillStyle = '#e0dcd0';
      ctx.fillRect(0, 0, 64, 48);
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = rng.pick(['#c03a2a', '#2a4a8a', '#e0b030', '#1a1a1a']);
        ctx.fillRect(rng.int(0, 50), rng.int(0, 36), rng.int(8, 24), rng.int(6, 16));
      }
    }
    grime(ctx, 64, 48, rng, 6, '#2a1a10');
    return toTex(c, { repeat: false });
  },
  books(seed = 106) {
    const rng = new RNG(seed);
    const c = canvas(64, 16);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#1a120c';
    ctx.fillRect(0, 0, 64, 16);
    for (let x = 0; x < 64; ) {
      const w = rng.int(2, 5);
      if (rng.chance(0.12)) {
        x += w + 2;
        continue;
      }
      ctx.fillStyle = rng.pick(['#6a1e1a', '#1e3a5a', '#2a4a2a', '#8a6a3a', '#3a2a4a', '#c8b890', '#2a2a2a', '#8a3a1a']);
      const h = rng.int(10, 16);
      ctx.fillRect(x, 16 - h, w, h);
      ctx.fillStyle = 'rgba(255,230,180,0.25)';
      ctx.fillRect(x, 16 - h + 3, w, 1);
      x += w;
    }
    return toTex(c, { detail: false });
  },
  cubicle(seed = 107) {
    const rng = new RNG(seed);
    const c = canvas(32, 32);
    const ctx = c.getContext('2d');
    ctx.fillStyle = ['#5a6070', '#6a6458', '#4e5a5a'][seed % 3];
    ctx.fillRect(0, 0, 32, 32);
    speckle(ctx, 32, 32, rng, 0.5, 0.5);
    grime(ctx, 32, 32, rng, 5, '#1a1a1a');
    return toTex(c);
  },
  poster(seed = 108) {
    const rng = new RNG(seed);
    const c = canvas(48, 64);
    const ctx = c.getContext('2d');
    const kind = seed % 3;
    ctx.fillStyle = kind === 0 ? '#e8e0c8' : kind === 1 ? '#f0f0e8' : '#2a3a5a';
    ctx.fillRect(0, 0, 48, 64);
    ctx.fillStyle = kind === 2 ? '#e8e0c8' : '#1a1a1a';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(kind === 0 ? 'MISSING' : kind === 1 ? 'EVACUATE' : 'STAY CALM', 24, 11);
    if (kind === 0) {
      ctx.fillStyle = '#8a7a68';
      ctx.fillRect(12, 16, 24, 26);
      ctx.fillStyle = '#c89a78';
      ctx.beginPath();
      ctx.arc(24, 26, 6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = kind === 1 ? '#b81a12' : '#e8c040';
      ctx.fillRect(8, 18, 32, 4);
      ctx.fillRect(8, 26, 26, 2);
    }
    ctx.fillStyle = kind === 2 ? 'rgba(232,224,200,0.6)' : 'rgba(26,26,26,0.6)';
    for (let y = 46; y < 60; y += 3) ctx.fillRect(8, y, rng.int(18, 32), 1);
    grime(ctx, 48, 64, rng, 8, '#3a2a14');
    return toTex(c, { repeat: false });
  },
  // daylight through dusty slatted blinds (painted bright: the glow is in
  // the material colour)
  blinds(seed = 109) {
    const rng = new RNG(seed);
    const c = canvas(32, 64);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 32, 64);
    for (let y = 0; y < 64; y += 4) {
      ctx.fillStyle = `rgba(40,36,30,${rng.range(0.55, 0.8)})`;
      ctx.fillRect(0, y, 32, 2);
    }
    if (seed % 2) {
      // a few slats bent or missing
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(rng.int(4, 20), rng.int(10, 50), 8, 6);
    }
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
  // golden, wind-dried prairie grass (Great Plains, Midwest, Texas)
  prairie(seed = 87) {
    const rng = new RNG(seed);
    const c = canvas(64, 64);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#7a6a3e';
    ctx.fillRect(0, 0, 64, 64);
    for (let i = 0; i < 800; i++) {
      const g = rng.int(95, 165);
      ctx.fillStyle = `rgb(${g},${g - 14},${g - 70})`;
      ctx.fillRect(rng.int(0, 63), rng.int(0, 63), 1, rng.int(1, 4));
    }
    grime(ctx, 64, 64, rng, 10, '#4a3a20');
    return toTex(c);
  },
  // wet, dark ground with standing water (Gulf Coast, Florida)
  marsh(seed = 88) {
    const rng = new RNG(seed);
    const c = canvas(64, 64);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#2e3a22';
    ctx.fillRect(0, 0, 64, 64);
    for (let i = 0; i < 600; i++) {
      const g = rng.int(40, 85);
      ctx.fillStyle = `rgb(${g - 12},${g + 4},${g - 30})`;
      ctx.fillRect(rng.int(0, 63), rng.int(0, 63), 1, rng.int(1, 3));
    }
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = 'rgba(40,52,48,0.55)';
      ctx.beginPath();
      ctx.ellipse(rng.range(0, 64), rng.range(0, 64), rng.range(4, 10), rng.range(2, 5), rng.range(0, 3), 0, Math.PI * 2);
      ctx.fill();
    }
    grime(ctx, 64, 64, rng, 14, '#1a2014');
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
  // a boxcar's side: steel ribs over weathered paint, a stencilled reporting mark
  boxcar(seed = 111) {
    const rng = new RNG(seed);
    const c = canvas(128, 64);
    const ctx = c.getContext('2d');
    const base = [
      [118, 52, 34],
      [96, 70, 48],
      [62, 66, 58],
    ][seed % 3];
    ctx.fillStyle = shade(base, 1);
    ctx.fillRect(0, 0, 128, 64);
    // vertical sheets with ribs
    for (let x = 0; x < 128; x += 16) {
      ctx.fillStyle = shade(base, 0.62);
      ctx.fillRect(x, 0, 3, 64);
      ctx.fillStyle = shade(base, 1.18);
      ctx.fillRect(x + 3, 0, 1, 64);
      ctx.fillStyle = '#2a1a12';
      for (let y = 4; y < 64; y += 8) ctx.fillRect(x + 1, y, 1, 1);
    }
    ctx.fillStyle = shade(base, 0.7);
    ctx.fillRect(0, 0, 128, 3);
    ctx.fillRect(0, 61, 128, 3);
    ctx.fillStyle = 'rgba(230,224,200,0.75)';
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText(['DD&W', 'B&O', 'UP', 'ATSF', 'CB&Q'][seed % 5], 8, 20);
    ctx.font = 'bold 7px sans-serif';
    ctx.fillText(String(4000 + ((seed * 37) % 5000)), 8, 30);
    ctx.font = '5px sans-serif';
    ctx.fillText('CAPY 100000  LD LMT 128500', 8, 54);
    speckle(ctx, 128, 64, rng, 0.3);
    grime(ctx, 128, 64, rng, 30, '#3a2010');
    grime(ctx, 128, 64, rng, 12, '#141010');
    drips(ctx, 128, 64, rng, 4);
    return toTex(c);
  },
  coal(seed = 112) {
    const rng = new RNG(seed);
    const c = canvas(64, 64);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#0c0c0e';
    ctx.fillRect(0, 0, 64, 64);
    for (let i = 0; i < 220; i++) {
      const v = rng.int(12, 46);
      ctx.fillStyle = `rgb(${v},${v},${v + 4})`;
      const r = rng.range(1, 3.5);
      ctx.beginPath();
      ctx.arc(rng.range(0, 64), rng.range(0, 64), r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(160,170,190,0.25)';
      ctx.fillRect(rng.range(0, 64), rng.range(0, 64), 1, 1);
    }
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
  // ---------------------------------------------------------------- cloth
  fabric(seed = 40) {
    const rng = new RNG(seed);
    const c = canvas(64, 64);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#d8d8d8';
    ctx.fillRect(0, 0, 64, 64);
    for (let y = 0; y < 64; y += 2) {
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.fillRect(0, y, 64, 1);
    }
    for (let x = 0; x < 64; x += 2) {
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.fillRect(x, 0, 1, 64);
    }
    // folds and wear
    for (let i = 0; i < 7; i++) {
      ctx.strokeStyle = `rgba(0,0,0,${rng.range(0.06, 0.16)})`;
      ctx.lineWidth = rng.range(1, 3);
      ctx.beginPath();
      const x = rng.range(0, 64);
      ctx.moveTo(x, 0);
      ctx.quadraticCurveTo(x + rng.range(-12, 12), 32, x + rng.range(-8, 8), 64);
      ctx.stroke();
    }
    grime(ctx, 64, 64, rng, 10, '#3a2a1a');
    grime(ctx, 64, 64, rng, 3, '#4a0606');
    return toTex(c);
  },
  denim(seed = 41) {
    const rng = new RNG(seed);
    const c = canvas(64, 64);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#cfcfcf';
    ctx.fillRect(0, 0, 64, 64);
    for (let i = -64; i < 64; i += 3) {
      ctx.strokeStyle = 'rgba(0,0,0,0.09)';
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 64, 64);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(30, 0, 2, 64); // seam
    grime(ctx, 64, 64, rng, 12, '#2a2010');
    return toTex(c);
  },
  // ---------------------------------------------------------------- foliage & atmosphere
  grassBlades(seed = 50) {
    const rng = new RNG(seed);
    const c = canvas(64, 64);
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 64, 64);
    for (let i = 0; i < 26; i++) {
      const x = rng.range(4, 60);
      const h = rng.range(24, 62);
      const lean = rng.range(-10, 10);
      const g = rng.int(150, 230);
      ctx.strokeStyle = `rgb(${g},${g},${g})`;
      ctx.lineWidth = rng.range(1.2, 2.6);
      ctx.beginPath();
      ctx.moveTo(x, 64);
      ctx.quadraticCurveTo(x + lean * 0.3, 64 - h * 0.6, x + lean, 64 - h);
      ctx.stroke();
    }
    return toTex(c, { repeat: false, detail: false });
  },
  smoke() {
    const c = canvas(64, 64);
    const ctx = c.getContext('2d');
    const rng = new RNG(51);
    for (let i = 0; i < 9; i++) {
      const x = 32 + rng.range(-10, 10);
      const y = 32 + rng.range(-10, 10);
      const r = rng.range(12, 22);
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(255,255,255,0.35)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
    }
    return toTex(c, { repeat: false, detail: false });
  },
  // ---------------------------------------------------------------- building exteriors
  // One "bay" of a facade (3 m wide, one storey tall). seed % 3 picks a
  // variant: 0 intact, 1 boarded up, 2 broken.
  facadeSiding(seed = 60) {
    const rng = new RNG(seed);
    const c = canvas(128, 128);
    const ctx = c.getContext('2d');
    const base = rng.pick([
      [196, 190, 172],
      [150, 166, 172],
      [168, 176, 150],
      [186, 168, 140],
    ]);
    for (let y = 0; y < 128; y += 8) {
      ctx.fillStyle = shade(base, rng.range(0.92, 1.04));
      ctx.fillRect(0, y, 128, 8);
      ctx.fillStyle = shade(base, 0.62);
      ctx.fillRect(0, y + 7, 128, 1);
    }
    window_(ctx, rng, 34, 26, 60, 64, seed % 3, '#f0ece0', true);
    grime(ctx, 128, 128, rng, 22, '#2a2418');
    return toTex(c);
  },
  facadeBrick(seed = 63) {
    const rng = new RNG(seed);
    const c = canvas(128, 128);
    const ctx = c.getContext('2d');
    bricks(ctx, rng, 128, 128, [128, 64, 48]);
    window_(ctx, rng, 30, 22, 68, 72, seed % 3, '#c8c0b0', false);
    grime(ctx, 128, 128, rng, 20, '#140c08');
    return toTex(c);
  },
  facadeGlass(seed = 66) {
    const rng = new RNG(seed);
    const c = canvas(128, 128);
    const ctx = c.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 0, 128);
    g.addColorStop(0, '#5a7088');
    g.addColorStop(0.55, '#2a3848');
    g.addColorStop(1, '#3a4a58');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    // sky reflections
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = `rgba(200,220,240,${rng.range(0.05, 0.14)})`;
      ctx.fillRect(rng.int(0, 120), 0, rng.int(6, 22), 128);
    }
    ctx.fillStyle = '#20242a';
    ctx.fillRect(0, 0, 128, 6);
    ctx.fillRect(0, 122, 128, 6);
    ctx.fillRect(0, 0, 4, 128);
    ctx.fillRect(62, 0, 4, 128);
    ctx.fillRect(124, 0, 4, 128);
    ctx.fillRect(0, 62, 128, 3);
    const v = seed % 3;
    if (v === 1) {
      ctx.fillStyle = '#6a5038';
      for (let i = 0; i < 5; i++) ctx.fillRect(8, 70 + i * 11, 112, 8);
    } else if (v === 2) {
      ctx.fillStyle = '#0a0c10';
      ctx.beginPath();
      ctx.moveTo(70, 10);
      ctx.lineTo(118, 18);
      ctx.lineTo(104, 58);
      ctx.lineTo(80, 40);
      ctx.fill();
      cracks(ctx, rng, 90, 30, '#c8d8e8');
    }
    return toTex(c);
  },
  // a skyscraper's curtain wall: two floors of tinted glass panels
  facadeTower(seed = 90) {
    const rng = new RNG(seed);
    const c = canvas(128, 128);
    const ctx = c.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 128, 128);
    g.addColorStop(0, '#46596a');
    g.addColorStop(0.5, '#1c2630');
    g.addColorStop(1, '#2e3c48');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = `rgba(210,226,240,${rng.range(0.04, 0.12)})`;
      ctx.beginPath();
      const x = rng.int(-20, 120);
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 18, 0);
      ctx.lineTo(x - 12, 128);
      ctx.lineTo(x - 30, 128);
      ctx.fill();
    }
    // panels left lit, blinds drawn, glass gone
    for (let py = 0; py < 2; py++)
      for (let px = 0; px < 4; px++) {
        const r = rng.next();
        const x = px * 32 + 3;
        const y = py * 64 + 8;
        if (r < 0.12) {
          ctx.fillStyle = '#c8b890';
          ctx.fillRect(x, y, 26, 26 + rng.int(0, 22));
        } else if (r < 0.2) {
          ctx.fillStyle = '#07090c';
          ctx.fillRect(x, y, 26, 50);
        } else if (r < 0.24) {
          cracks(ctx, rng, x + 13, y + 22, '#c8d8e8');
        }
      }
    ctx.fillStyle = '#9aa2aa';
    for (let x = 0; x <= 128; x += 32) ctx.fillRect(x - 1, 0, 3, 128);
    ctx.fillStyle = '#5a646c';
    ctx.fillRect(0, 0, 128, 7);
    ctx.fillRect(0, 64, 128, 7);
    grime(ctx, 128, 128, rng, 10, '#10141a');
    return toTex(c);
  },
  facadeConcrete(seed = 69) {
    const rng = new RNG(seed);
    const c = canvas(128, 128);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#8a8680';
    ctx.fillRect(0, 0, 128, 128);
    speckle(ctx, 128, 128, rng, 0.25, 0.7);
    ctx.fillStyle = '#5a5650';
    ctx.fillRect(0, 0, 128, 2);
    ctx.fillRect(0, 0, 2, 128);
    // strip window
    ribbon(ctx, rng, 10, 40, 108, 34, seed % 3);
    grime(ctx, 128, 128, rng, 26, '#2a2824');
    drips(ctx, 128, 128, rng, rng.int(0, 2));
    return toTex(c);
  },
  facadeHospital(seed = 72) {
    const rng = new RNG(seed);
    const c = canvas(128, 128);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#d8d8d0';
    ctx.fillRect(0, 0, 128, 128);
    speckle(ctx, 128, 128, rng, 0.12, 0.8);
    ctx.fillStyle = '#a8aaa8';
    ctx.fillRect(0, 0, 128, 3);
    ctx.fillStyle = '#3a6a8a';
    ctx.fillRect(0, 100, 128, 6); // blue band
    window_(ctx, rng, 22, 24, 84, 58, seed % 3, '#e8e8e4', false);
    grime(ctx, 128, 128, rng, 18, '#3a3a30');
    return toTex(c);
  },
  facadeMetal(seed = 75) {
    const rng = new RNG(seed);
    const c = canvas(128, 128);
    const ctx = c.getContext('2d');
    const base = rng.pick([
      [104, 110, 112],
      [120, 96, 70],
      [80, 96, 104],
    ]);
    for (let x = 0; x < 128; x += 8) {
      ctx.fillStyle = shade(base, 1.08);
      ctx.fillRect(x, 0, 4, 128);
      ctx.fillStyle = shade(base, 0.78);
      ctx.fillRect(x + 4, 0, 4, 128);
    }
    grime(ctx, 128, 128, rng, 24, '#5a2a0a');
    grime(ctx, 128, 128, rng, 10, '#1a1a1a');
    if (seed % 3 === 2) {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(rng.int(10, 80), rng.int(60, 100), rng.int(16, 30), rng.int(10, 24));
    }
    return toTex(c);
  },
  facadeShop(seed = 78) {
    const rng = new RNG(seed);
    const c = canvas(128, 128);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#7a4a34';
    ctx.fillRect(0, 0, 128, 128);
    bricks(ctx, rng, 128, 30, [120, 70, 50]);
    // big storefront window
    const g = ctx.createLinearGradient(0, 30, 0, 118);
    g.addColorStop(0, '#4a5a68');
    g.addColorStop(1, '#141820');
    ctx.fillStyle = g;
    ctx.fillRect(6, 32, 116, 86);
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = rng.pick(['#c83a2a', '#e8c040', '#3a7ac8', '#f0f0e0']);
      ctx.fillRect(rng.int(10, 96), rng.int(40, 90), rng.int(12, 22), rng.int(14, 26));
    }
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 30, 128, 3);
    ctx.fillRect(62, 32, 3, 86);
    ctx.fillRect(0, 118, 128, 10);
    if (seed % 3 === 1) {
      ctx.fillStyle = '#6a5038';
      for (let i = 0; i < 6; i++) ctx.fillRect(4, 40 + i * 13, 120, 9);
    } else if (seed % 3 === 2) cracks(ctx, rng, 40, 70, '#c8d8e8');
    return toTex(c);
  },
  facadeBunker(seed = 81) {
    const rng = new RNG(seed);
    const c = canvas(128, 128);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#6e6c62';
    ctx.fillRect(0, 0, 128, 128);
    speckle(ctx, 128, 128, rng, 0.35, 0.6);
    ctx.fillStyle = '#4e4c44';
    for (let y = 0; y < 128; y += 32) ctx.fillRect(0, y, 128, 2);
    ctx.fillStyle = '#121210';
    ctx.fillRect(24, 44, 80, 10); // firing slit
    ctx.fillStyle = '#3a3a2a';
    ctx.fillRect(0, 100, 128, 28);
    for (let x = 0; x < 128; x += 16) {
      ctx.fillStyle = '#7a6e50';
      ctx.fillRect(x + 1, 102, 14, 11);
      ctx.fillRect(x + 9, 114, 14, 11);
    }
    grime(ctx, 128, 128, rng, 24, '#2a2a1a');
    return toTex(c);
  },
  roofShingle(seed = 84) {
    const rng = new RNG(seed);
    const c = canvas(64, 64);
    const ctx = c.getContext('2d');
    const base = rng.pick([
      [70, 60, 56],
      [58, 62, 66],
      [86, 52, 40],
    ]);
    for (let row = 0; row < 8; row++)
      for (let x = (row % 2) * 4; x < 64; x += 8) {
        ctx.fillStyle = shade(base, rng.range(0.75, 1.15));
        ctx.fillRect(x, row * 8, 7, 7);
      }
    grime(ctx, 64, 64, rng, 14, '#1a1a14');
    return toTex(c);
  },
  roofGravel(seed = 85) {
    const rng = new RNG(seed);
    const c = canvas(64, 64);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#5a5850';
    ctx.fillRect(0, 0, 64, 64);
    speckle(ctx, 64, 64, rng, 0.7, 0.5);
    grime(ctx, 64, 64, rng, 18, '#2a2a26');
    return toTex(c);
  },
  concreteSlab(seed = 86) {
    const rng = new RNG(seed);
    const c = canvas(64, 64);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#8e8a82';
    ctx.fillRect(0, 0, 64, 64);
    speckle(ctx, 64, 64, rng, 0.25, 0.7);
    ctx.fillStyle = '#6a665e';
    ctx.fillRect(0, 0, 64, 1);
    ctx.fillRect(0, 0, 1, 64);
    grime(ctx, 64, 64, rng, 16, '#4a4438');
    return toTex(c);
  },
};

export function tex(name, seed) {
  const key = name + ':' + (seed ?? '');
  if (!cache.has(key)) cache.set(key, builders[name](seed));
  return cache.get(key);
}
