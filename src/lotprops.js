// Street and lot dressing for building exteriors: vehicles, pumps, canopies,
// signs, lamp posts, fences and the like. Every model faces +z / runs along z
// unless noted, and sits on y = 0.
import * as THREE from 'three';
import { tex } from './textures.js';
import { box, glowSprite, lambert as L, mergeStatic } from './models.js';

const cyl = (r0, r1, h, mat, x = 0, y = 0, z = 0, seg = 10) => {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, h, seg), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
};
const paint = (color, rough = 0.45) => L({ color, roughness: rough, metalness: 0.35 });
const glass = () => L({ color: 0x1a222a, roughness: 0.08, metalness: 0.4 });

// ---------------------------------------------------------------- text
const signCache = new Map();
export function signTexture(text, { w = 512, h = 128, bg = '#1a1612', fg = '#e8dcc0', font = 'bold 72px sans-serif', border = null } = {}) {
  const key = [text, w, h, bg, fg, font, border].join('|');
  if (signCache.has(key)) return signCache.get(key);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  if (border) {
    ctx.strokeStyle = border;
    ctx.lineWidth = h * 0.06;
    ctx.strokeRect(h * 0.05, h * 0.05, w - h * 0.1, h - h * 0.1);
  }
  ctx.fillStyle = fg;
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  let size = parseInt(font.match(/(\d+)px/)[1], 10);
  while (size > 12 && ctx.measureText(text).width > w * 0.9) {
    size -= 4;
    ctx.font = font.replace(/\d+px/, size + 'px');
  }
  ctx.fillText(text, w / 2, h / 2 + 2);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  signCache.set(key, t);
  return t;
}

// A flat sign facing +z. emissive: lit from within (neon / backlit).
export function makeSign(text, w, h, opts = {}) {
  const t = signTexture(text, opts);
  const mat = L({ map: t, roughness: 0.6, emissive: opts.lit ? 0xffffff : 0x000000, emissiveMap: opts.lit ? t : null, emissiveIntensity: opts.lit ? 0.12 : 0 });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  m.castShadow = false;
  return m;
}

// ---------------------------------------------------------------- vehicles
const CAR_COLORS = [0x6a1a14, 0x1c2a44, 0x3a3a3a, 0xb8b8b0, 0x2a4a3a, 0x8a7a5a, 0x5a5a62, 0x1a1a1c];

export function makeVehicle(kind, rng, color) {
  const g = new THREE.Group();
  const r = rng || Math.random;
  const col = color ?? CAR_COLORS[Math.floor(r() * CAR_COLORS.length)];
  const body = paint(kind === 'police' ? 0x16161a : kind === 'ambulance' ? 0xe8e8e0 : kind === 'humvee' ? 0x4a4c32 : col, kind === 'humvee' ? 0.85 : 0.42);
  const dark = L({ color: 0x141414, roughness: 0.8 });
  const tire = L({ color: 0x101010, roughness: 0.9 });
  const rim = L({ color: 0x8a8a8a, roughness: 0.4, metalness: 0.7 });
  const chrome = L({ color: 0xb0b0b0, roughness: 0.25, metalness: 0.9 });
  let w = 1.85;
  let len = 4.5;
  let h = 0.75;
  if (kind === 'van' || kind === 'ambulance') {
    w = 2.0;
    len = 5.4;
    g.add(box(w, 1.9, len - 1.2, body, 0, 1.4, -0.45));
    g.add(box(w - 0.04, 1.1, 1.2, body, 0, 1.0, len / 2 - 0.65));
    g.add(box(w - 0.1, 0.6, 0.06, glass(), 0, 1.75, len / 2 - 0.9).rotateX(-0.35));
    if (kind === 'ambulance') {
      const red = L({ color: 0xc01a14, roughness: 0.5 });
      for (const s of [-1, 1]) g.add(box(0.02, 0.22, len - 1.4, red, (s * (w + 0.01)) / 2, 1.2, -0.45));
      const cross = makeSign('+', 0.8, 0.8, { w: 128, h: 128, bg: '#e8e8e0', fg: '#c01a14', font: 'bold 120px sans-serif' });
      cross.position.set(0, 1.6, -len / 2 + 0.14);
      cross.rotation.y = Math.PI;
      g.add(cross);
      for (const s of [-1, 1]) {
        g.add(box(0.25, 0.12, 0.2, L({ color: s > 0 ? 0xc01a14 : 0x2a4ac8, emissive: s > 0 ? 0x400000 : 0x000a40 }), s * 0.5, 2.42, len / 2 - 1.4));
      }
    }
  } else if (kind === 'humvee') {
    w = 2.2;
    len = 4.8;
    g.add(box(w, 0.9, len, body, 0, 0.95, 0));
    g.add(box(w - 0.2, 0.7, 2.4, body, 0, 1.75, -0.3));
    for (const s of [-1, 1]) g.add(box(0.06, 0.4, 1.0, glass(), (s * (w - 0.18)) / 2, 1.8, 0.3));
    g.add(box(w - 0.3, 0.45, 0.06, glass(), 0, 1.85, 0.92));
    g.add(box(w, 0.1, 0.5, dark, 0, 0.6, len / 2 - 0.1));
  } else if (kind === 'pickup') {
    g.add(box(w, h, len + 0.6, body, 0, 0.75, 0));
    g.add(box(w - 0.1, 0.72, 1.7, body, 0, 1.45, 0.5));
    g.add(box(w - 0.16, 0.5, 0.06, glass(), 0, 1.5, 1.36).rotateX(-0.3));
    g.add(box(w - 0.1, 0.35, 1.9, dark, 0, 1.08, -1.4)); // bed
    len += 0.6;
  } else {
    // sedan / police / suv
    const suv = kind === 'suv';
    if (suv) h = 0.95;
    g.add(box(w, h, len, body, 0, 0.35 + h / 2, 0));
    const cab = box(w - 0.12, suv ? 0.75 : 0.62, suv ? 2.6 : 2.1, body, 0, 0.35 + h + (suv ? 0.37 : 0.31), suv ? -0.35 : -0.15);
    g.add(cab);
    g.add(box(w - 0.18, suv ? 0.58 : 0.5, 0.05, glass(), 0, 0.35 + h + 0.3, (suv ? 0.95 : 0.9) + 0.02).rotateX(-0.45));
    g.add(box(w - 0.18, 0.45, 0.05, glass(), 0, 0.35 + h + 0.3, suv ? -1.66 : -1.22).rotateX(0.4));
    for (const s of [-1, 1]) g.add(box(0.04, suv ? 0.5 : 0.42, suv ? 2.2 : 1.8, glass(), (s * (w - 0.1)) / 2, 0.35 + h + 0.32, suv ? -0.35 : -0.15));
    if (kind === 'police') {
      const white = paint(0xe8e8e8);
      for (const s of [-1, 1]) g.add(box(0.02, 0.5, 2.2, white, (s * (w + 0.01)) / 2, 0.35 + h / 2, 0));
      g.add(box(1.1, 0.12, 0.3, dark, 0, 0.35 + h + 0.66, -0.15));
      g.add(box(0.45, 0.1, 0.24, L({ color: 0xc01a14, emissive: 0x500000 }), -0.26, 0.35 + h + 0.74, -0.15));
      g.add(box(0.45, 0.1, 0.24, L({ color: 0x1a3ac8, emissive: 0x000a50 }), 0.26, 0.35 + h + 0.74, -0.15));
      const lbl = makeSign('POLICE', 1.4, 0.3, { w: 256, h: 56, bg: '#e8e8e8', fg: '#14161c', font: 'bold 44px sans-serif' });
      for (const s of [-1, 1]) {
        const m = lbl.clone();
        m.position.set((s * (w + 0.03)) / 2, 0.35 + h / 2, 0);
        m.rotation.y = (s * Math.PI) / 2;
        g.add(m);
      }
    }
  }
  // bumpers, lights and wheels
  g.add(box(w + 0.02, 0.18, 0.12, chrome, 0, 0.45, len / 2));
  g.add(box(w + 0.02, 0.18, 0.12, chrome, 0, 0.45, -len / 2));
  for (const s of [-1, 1]) {
    g.add(box(0.28, 0.12, 0.04, L({ color: 0xe8e4c8, emissive: 0x222018 }), s * (w / 2 - 0.25), 0.68, len / 2 + 0.01));
    g.add(box(0.28, 0.12, 0.04, L({ color: 0x8a1410, emissive: 0x200404 }), s * (w / 2 - 0.25), 0.7, -len / 2 - 0.01));
  }
  const wheelZ = len / 2 - 0.85;
  const wr = kind === 'humvee' ? 0.48 : 0.36;
  for (const x of [-1, 1])
    for (const z of [-1, 1]) {
      const flat = r() < 0.12;
      const t = cyl(wr, wr, 0.28, tire, (x * w) / 2 - x * 0.06, flat ? wr * 0.75 : wr, z * wheelZ, 14);
      t.rotation.z = Math.PI / 2;
      g.add(t);
      const hub = cyl(wr * 0.55, wr * 0.55, 0.3, rim, (x * w) / 2 - x * 0.05, flat ? wr * 0.75 : wr, z * wheelZ, 10);
      hub.rotation.z = Math.PI / 2;
      g.add(hub);
    }
  const m = mergeStatic(g);
  return { mesh: m, w, len };
}

// ---------------------------------------------------------------- gas station
export function makeGasPump() {
  const g = new THREE.Group();
  const red = paint(0xb8261a, 0.5);
  const white = paint(0xe0ddd4, 0.5);
  g.add(box(1.2, 0.18, 0.7, L({ map: tex('concreteSlab') }), 0, 0.09, 0)); // island
  g.add(box(0.7, 1.55, 0.45, white, 0, 0.95, 0));
  g.add(box(0.72, 0.4, 0.47, red, 0, 1.6, 0));
  for (const s of [-1, 1]) g.add(box(0.36, 0.22, 0.02, L({ color: 0x101a10, emissive: 0x0a200a }), 0, 1.25, s * 0.235));
  for (const s of [-1, 1]) {
    const hose = cyl(0.025, 0.025, 0.9, L({ color: 0x141414 }), s * 0.38, 1.0, 0, 6);
    hose.rotation.z = s * 0.25;
    g.add(hose);
  }
  return mergeStatic(g);
}

export function makeCanopy(w, d, h, label) {
  const g = new THREE.Group();
  const roof = paint(0xe6e2d8, 0.6);
  const fascia = paint(0xb8261a, 0.5);
  g.add(box(w, 0.4, d, roof, 0, h, 0));
  for (const s of [-1, 1]) {
    g.add(box(w + 0.1, 0.7, 0.12, fascia, 0, h, (s * d) / 2));
    g.add(box(0.12, 0.7, d, fascia, (s * w) / 2, h, 0));
  }
  const colMat = paint(0xd8d4cc, 0.5);
  for (const x of [-w / 2 + 1.2, w / 2 - 1.2]) for (const z of [-d / 4, d / 4]) g.add(box(0.4, h, 0.4, colMat, x, h / 2, z));
  for (let x = -w / 2 + 2; x < w / 2 - 1; x += 3) {
    const lamp = box(0.8, 0.05, 0.8, L({ color: 0xf0f0e0, emissive: 0x303028 }), x, h - 0.23, 0);
    g.add(lamp);
  }
  const sign = makeSign(label, Math.min(w * 0.6, 6), 0.6, { w: 512, h: 64, bg: '#b8261a', fg: '#f4f0e0', font: 'bold 52px sans-serif' });
  sign.position.set(0, h, d / 2 + 0.08);
  const m = mergeStatic(g);
  m.add(sign);
  return m;
}

export function makePoleSign(title, lines, h = 6) {
  const g = new THREE.Group();
  const pole = paint(0x5a5a5e, 0.5);
  g.add(cyl(0.12, 0.12, h, pole, 0, h / 2, 0));
  const board = box(2.4, 2.2, 0.25, paint(0x1a1a1c, 0.6), 0, h + 0.6, 0);
  g.add(board);
  const top = makeSign(title, 2.3, 0.6, { w: 512, h: 128, bg: '#b8261a', fg: '#f4f0e0', font: 'bold 80px sans-serif' });
  top.position.set(0, h + 1.35, 0.14);
  g.add(top);
  const prices = makeSign(lines, 2.3, 1.2, { w: 512, h: 256, bg: '#101010', fg: '#f0c040', font: 'bold 110px monospace' });
  prices.position.set(0, h + 0.45, 0.14);
  g.add(prices);
  return g;
}

// ---------------------------------------------------------------- street furniture
export function makeLampPost(h = 6.5) {
  const g = new THREE.Group();
  const pole = paint(0x2a2c2e, 0.5);
  g.add(cyl(0.09, 0.12, h, pole, 0, h / 2, 0));
  const arm = box(0.08, 0.08, 1.4, pole, 0, h - 0.1, 0.65);
  g.add(arm);
  g.add(box(0.36, 0.14, 0.6, pole, 0, h - 0.2, 1.3));
  const lamp = box(0.3, 0.04, 0.5, L({ color: 0xf0e8d0, emissive: 0x000000 }), 0, h - 0.29, 1.3);
  g.add(lamp);
  const glow = glowSprite(0xffe0a0, 2.2, 0);
  glow.position.set(0, h - 0.5, 1.3);
  g.add(glow);
  return { group: g, lamp, glow, lampPos: new THREE.Vector3(0, h - 0.5, 1.3) };
}

export function makeFlagpole(h = 9) {
  const g = new THREE.Group();
  g.add(cyl(0.06, 0.09, h, L({ color: 0xc8c8c8, metalness: 0.7, roughness: 0.3 }), 0, h / 2, 0));
  g.add(cyl(0.12, 0.12, 0.12, L({ color: 0xd0b040, metalness: 0.8, roughness: 0.3 }), 0, h + 0.06, 0));
  const c = document.createElement('canvas');
  c.width = 96;
  c.height = 64;
  const ctx = c.getContext('2d');
  for (let i = 0; i < 7; i++) {
    ctx.fillStyle = i % 2 ? '#e8e4dc' : '#a8221a';
    ctx.fillRect(0, (i * 64) / 7, 96, 64 / 7 + 1);
  }
  ctx.fillStyle = '#2a3a6a';
  ctx.fillRect(0, 0, 40, 34);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.1, 8, 1), L({ map: t, side: THREE.DoubleSide, roughness: 0.9 }));
  flag.position.set(0, h - 0.7, 0.92);
  flag.rotation.y = Math.PI / 2;
  // a little droop
  const pos = flag.geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) pos.setZ(i, Math.sin((pos.getX(i) + 0.9) * 2.4) * 0.12);
  flag.geometry.computeVertexNormals();
  g.add(flag);
  return g;
}

export function makeDumpster(color = 0x2a4a3a) {
  const g = new THREE.Group();
  const m = paint(color, 0.7);
  g.add(box(1.9, 1.15, 1.2, m, 0, 0.7, 0));
  g.add(box(2.0, 0.08, 1.3, L({ color: 0x1a1a1a }), 0, 1.31, -0.05).rotateX(-0.12));
  for (const x of [-0.8, 0.8]) for (const z of [-0.45, 0.45]) g.add(cyl(0.08, 0.08, 0.14, L({ color: 0x111111 }), x, 0.07, z, 8));
  return mergeStatic(g);
}

export function makeTrailer() {
  const g = new THREE.Group();
  const side = L({ map: tex('sheetMetal'), color: 0xd8d8d0, roughness: 0.6, metalness: 0.3 });
  g.add(box(2.6, 2.8, 12.5, side, 0, 2.5, 0));
  g.add(box(2.4, 0.3, 12.5, L({ color: 0x1a1a1a }), 0, 1.0, 0));
  const tire = L({ color: 0x101010, roughness: 0.9 });
  for (const z of [-5.6, -4.4]) for (const x of [-1, 1]) g.add(cyl(0.5, 0.5, 0.35, tire, x * 1.05, 0.5, z, 12).rotateZ(Math.PI / 2));
  for (const x of [-0.9, 0.9]) g.add(box(0.12, 0.9, 0.12, L({ color: 0x2a2a2a }), x, 0.45, 4.4)); // landing legs
  return mergeStatic(g);
}

export function makeLoadingDock(w) {
  const g = new THREE.Group();
  const conc = L({ map: tex('concreteSlab'), roughness: 0.9 });
  g.add(box(w, 1.2, 3.2, conc, 0, 0.6, 0));
  const black = L({ color: 0x141414 });
  for (let x = -w / 2 + 1.5; x < w / 2; x += 3.5) g.add(box(0.5, 0.6, 0.2, black, x, 0.75, 1.65));
  const yel = L({ color: 0xd8b020, roughness: 0.6 });
  for (let x = -w / 2 + 0.3; x < w / 2; x += 0.6) g.add(box(0.3, 0.02, 0.15, yel, x, 1.21, 1.5));
  return mergeStatic(g);
}

export function makeGuardBooth() {
  const g = new THREE.Group();
  const wall = L({ color: 0x8a8670, roughness: 0.8 });
  g.add(box(2.2, 2.4, 2.2, wall, 0, 1.2, 0));
  for (const [x, z, ry] of [
    [0, 1.11, 0],
    [1.11, 0, Math.PI / 2],
    [-1.11, 0, Math.PI / 2],
  ]) {
    const w = box(1.6, 0.8, 0.04, glass(), x, 1.6, z);
    w.rotation.y = ry;
    g.add(w);
  }
  g.add(box(2.6, 0.15, 2.6, L({ color: 0x4a4a3a }), 0, 2.48, 0));
  return mergeStatic(g);
}

export function makeJersey(len = 3) {
  const g = new THREE.Group();
  const conc = L({ map: tex('concreteSlab'), roughness: 0.95 });
  const n = Math.max(1, Math.round(len / 3));
  for (let i = 0; i < n; i++) {
    const z = -len / 2 + (i + 0.5) * (len / n);
    g.add(box(0.6, 0.35, len / n - 0.05, conc, 0, 0.18, z));
    g.add(box(0.3, 0.5, len / n - 0.05, conc, 0, 0.6, z));
  }
  return mergeStatic(g);
}

const chainTex = () => {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext('2d');
  ctx.strokeStyle = 'rgba(170,175,180,1)';
  ctx.lineWidth = 2;
  for (let i = -64; i < 128; i += 10) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 64, 64);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(i + 64, 0);
    ctx.lineTo(i, 64);
    ctx.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};
let chainT = null;

// Fence running along z, centred on the origin.
export function makeChainFence(len, barbed = false, h = 2.2) {
  const g = new THREE.Group();
  const post = L({ color: 0x8a8e90, metalness: 0.6, roughness: 0.4 });
  for (let z = -len / 2; z <= len / 2 + 0.01; z += 3) g.add(cyl(0.05, 0.05, h, post, 0, h / 2, z, 6));
  g.add(cyl(0.035, 0.035, len, post, 0, h - 0.05, 0, 6).rotateX(Math.PI / 2));
  chainT ||= chainTex();
  const t = chainT.clone();
  t.needsUpdate = true;
  t.repeat.set(len / 1.2, h / 1.2);
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(len, h), L({ map: t, transparent: true, alphaTest: 0.3, side: THREE.DoubleSide, metalness: 0.5, roughness: 0.5 }));
  mesh.rotation.y = Math.PI / 2;
  mesh.position.y = h / 2;
  g.add(mesh);
  if (barbed) {
    const wire = L({ color: 0x9a9a9a, metalness: 0.7, roughness: 0.4 });
    for (let z = -len / 2 + 0.3; z < len / 2; z += 0.6) {
      const coil = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.012, 4, 10), wire);
      coil.position.set(0, h + 0.25, z);
      coil.rotation.y = Math.PI / 2 + 0.3;
      g.add(coil);
    }
  }
  return g;
}

export function makePicketFence(len) {
  const g = new THREE.Group();
  const white = L({ color: 0xe8e4d8, roughness: 0.8 });
  for (let z = -len / 2; z <= len / 2; z += 0.22) {
    g.add(box(0.05, 0.95, 0.1, white, 0, 0.48, z));
    g.add(new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.12, 4), white).translateY(1.01).translateZ(z));
  }
  for (const y of [0.3, 0.75]) g.add(box(0.04, 0.08, len, white, -0.05, y, 0));
  return mergeStatic(g);
}

export function makeHedge(len, h = 1.3) {
  const g = new THREE.Group();
  const leaf = L({ color: 0x2a4a22, roughness: 1, flatShading: true });
  for (let z = -len / 2 + 0.5; z < len / 2; z += 0.9) {
    const b = new THREE.Mesh(new THREE.IcosahedronGeometry(0.65, 1), leaf);
    b.position.set(0, h * 0.55, z);
    b.scale.set(0.9, h / 1.3, 1);
    b.castShadow = true;
    g.add(b);
  }
  return mergeStatic(g);
}

export function makeRailing(len) {
  const g = new THREE.Group();
  const iron = L({ color: 0x1c1c1e, metalness: 0.6, roughness: 0.5 });
  for (let z = -len / 2; z <= len / 2; z += 0.15) g.add(box(0.025, 1.1, 0.025, iron, 0, 0.55, z));
  for (const y of [0.1, 1.08]) g.add(box(0.05, 0.05, len, iron, 0, y, 0));
  return mergeStatic(g);
}

export function makeMailbox() {
  const g = new THREE.Group();
  g.add(box(0.1, 1.0, 0.1, L({ color: 0x4a3420 }), 0, 0.5, 0));
  g.add(box(0.25, 0.25, 0.5, paint(0x2a3a5a, 0.5), 0, 1.1, 0));
  g.add(box(0.03, 0.2, 0.08, paint(0xc01a14), 0.14, 1.2, -0.1));
  return mergeStatic(g);
}

export function makeBollard() {
  const g = new THREE.Group();
  g.add(cyl(0.12, 0.12, 0.9, paint(0xd8b020, 0.6), 0, 0.45, 0, 10));
  return mergeStatic(g);
}

export function makePlanter(len) {
  const g = new THREE.Group();
  g.add(box(0.8, 0.6, len, L({ map: tex('concreteSlab') }), 0, 0.3, 0));
  const leaf = L({ color: 0x3a5a2a, roughness: 1, flatShading: true });
  for (let z = -len / 2 + 0.5; z < len / 2; z += 1) {
    const b = new THREE.Mesh(new THREE.IcosahedronGeometry(0.4, 0), leaf);
    b.position.set(0, 0.8, z);
    b.castShadow = true;
    g.add(b);
  }
  return mergeStatic(g);
}

export function makeSandbags(len, rows = 2) {
  const g = new THREE.Group();
  const bag = L({ color: 0x8a7a56, roughness: 1 });
  for (let r = 0; r < rows; r++)
    for (let z = -len / 2 + 0.35 + (r % 2) * 0.3; z < len / 2; z += 0.62) {
      const b = box(0.5, 0.26, 0.6, bag, 0, 0.13 + r * 0.25, z);
      b.rotation.y = (Math.random() - 0.5) * 0.15;
      g.add(b);
    }
  return mergeStatic(g);
}

export function makeWatchtower() {
  const g = new THREE.Group();
  const wood = L({ map: tex('wood', 5) });
  for (const x of [-1, 1]) for (const z of [-1, 1]) g.add(box(0.2, 5, 0.2, wood, x, 2.5, z));
  g.add(box(2.6, 0.15, 2.6, wood, 0, 4.6, 0));
  for (const s of [-1, 1]) {
    g.add(box(2.6, 1, 0.08, wood, 0, 5.1, s * 1.3));
    g.add(box(0.08, 1, 2.6, wood, s * 1.3, 5.1, 0));
  }
  g.add(new THREE.Mesh(new THREE.ConeGeometry(2.1, 1.0, 4), L({ color: 0x3a3a2a })).translateY(6.6).rotateY(Math.PI / 4));
  return mergeStatic(g);
}

export function makeBench() {
  const g = new THREE.Group();
  const wood = L({ map: tex('wood', 5) });
  const iron = L({ color: 0x1c1c1e, metalness: 0.6, roughness: 0.5 });
  g.add(box(1.8, 0.06, 0.45, wood, 0, 0.45, 0));
  g.add(box(1.8, 0.4, 0.06, wood, 0, 0.75, -0.2));
  for (const x of [-0.8, 0.8]) g.add(box(0.06, 0.45, 0.45, iron, x, 0.22, 0));
  return mergeStatic(g);
}

export function makeHydrant() {
  const g = new THREE.Group();
  const red = paint(0xb02018, 0.55);
  g.add(cyl(0.13, 0.15, 0.6, red, 0, 0.3, 0));
  g.add(new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), red).translateY(0.6));
  for (const s of [-1, 1]) g.add(cyl(0.05, 0.05, 0.12, red, s * 0.16, 0.42, 0, 8).rotateZ(Math.PI / 2));
  return mergeStatic(g);
}

export function makeLeafyTree(rng, snow = false) {
  const g = new THREE.Group();
  const s = 0.8 + rng() * 0.6;
  g.add(cyl(0.14 * s, 0.22 * s, 3 * s, L({ map: tex('bark') }), 0, 1.5 * s, 0, 7));
  const leaf = L({ color: snow ? 0x4a5048 : [0x2e4a22, 0x3a5426, 0x4a5a2a][Math.floor(rng() * 3)], roughness: 1, flatShading: true });
  for (let i = 0; i < 5; i++) {
    const b = new THREE.Mesh(new THREE.IcosahedronGeometry((0.9 + rng() * 0.6) * s, 1), leaf);
    b.position.set((rng() - 0.5) * 1.6 * s, (3 + rng() * 1.4) * s, (rng() - 0.5) * 1.6 * s);
    b.castShadow = true;
    g.add(b);
  }
  return mergeStatic(g);
}

// A painted line on the ground (parking bays, road markings). Runs along z.
export function makeLine(len, w = 0.12, color = 0xe8e4d0) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, len), L({ color, roughness: 0.8, polygonOffset: true, polygonOffsetFactor: -2 }));
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.012;
  m.receiveShadow = true;
  return m;
}

export function makeGroundPatch(texName, w, d, repeat = 1, opts = {}) {
  const t = tex(texName, opts.seed).clone();
  t.needsUpdate = true;
  t.repeat.set((w / 3) * repeat, (d / 3) * repeat);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), L({ map: t, color: opts.color ?? 0xffffff, roughness: 0.95, polygonOffset: true, polygonOffsetFactor: opts.offset ?? -1 }));
  m.rotation.x = -Math.PI / 2;
  m.position.y = opts.y ?? 0.006;
  m.receiveShadow = true;
  return m;
}

