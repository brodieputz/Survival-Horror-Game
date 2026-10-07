// Camp and building props: the train, tent, barricade, turrets, traps,
// vegetation, loot containers and lights.
import * as THREE from 'three';
import { tex } from './textures.js';
import { box, pivot, glowSprite, lambert as L, basic as B, mergeStatic } from './models.js';

export const BARRICADE_H = 1.08; // three boards high

const cyl = (r0, r1, h, mat, x = 0, y = 0, z = 0, seg = 8) => {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, h, seg), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
};

// ---------------------------------------------------------------- train
// A flatbed / boxcar, long axis along Z. Roof deck at y = 3.1.
export function makeTrainCar(kind = 'box') {
  const g = new THREE.Group();
  const rust = L({ map: tex('trainMetal') });
  const dark = L({ color: 0x1a1816 });
  const len = 9.2;
  // wheels and bogies
  for (const z of [-len / 2 + 1.6, len / 2 - 1.6])
    for (const x of [-0.75, 0.75]) {
      for (const dz of [-0.55, 0.55]) {
        const w = cyl(0.42, 0.42, 0.14, dark, x, 0.42, z + dz, 10);
        w.rotation.z = Math.PI / 2;
        g.add(w);
      }
    }
  g.add(box(2.6, 0.35, len, dark, 0, 0.95, 0)); // chassis
  if (kind === 'box') {
    g.add(box(2.9, 2.0, len - 0.2, rust, 0, 2.1, 0));
    g.add(box(3.0, 0.12, len, dark, 0, 3.12, 0));
    // sliding door
    g.add(box(0.06, 1.7, 2.2, L({ color: 0x5a3a26 }), 1.47, 2.0, 0));
  } else {
    // flatbed with sandbags around the turret deck
    g.add(box(2.9, 0.4, len, rust, 0, 1.3, 0));
    const bag = L({ color: 0x8a7a56 });
    for (let i = 0; i < 8; i++) g.add(box(0.7, 0.32, 0.45, bag, i % 2 ? -1.1 : 1.1, 1.66, -len / 2 + 1 + i * 1.05));
  }
  // couplers
  g.add(box(0.3, 0.3, 0.6, dark, 0, 0.95, len / 2 + 0.2));
  return mergeStatic(g);
}

export function makeLocomotive() {
  const g = new THREE.Group();
  const black = L({ color: 0x18181a });
  const red = L({ color: 0x6a1a12 });
  const brass = L({ color: 0x9a7a3a });
  g.add(box(2.6, 0.4, 11, black, 0, 0.95, 0));
  const boiler = cyl(1.2, 1.2, 7, black, 0, 2.4, -1.2, 12);
  boiler.rotation.x = Math.PI / 2;
  g.add(boiler);
  g.add(box(2.9, 2.9, 3.0, black, 0, 2.6, 3.8)); // cab
  g.add(box(3.0, 0.15, 3.3, red, 0, 4.1, 3.8));
  g.add(cyl(0.35, 0.45, 1.6, black, 0, 4.1, -3.8)); // stack
  g.add(cyl(0.4, 0.4, 0.5, brass, 0, 3.7, -1.0)); // dome
  for (let i = 0; i < 4; i++) {
    const w = cyl(0.75, 0.75, 0.16, red, 0, 0.75, -3.4 + i * 1.7, 12);
    w.rotation.z = Math.PI / 2;
    w.position.x = -1.3;
    g.add(w);
    const w2 = w.clone();
    w2.position.x = 1.3;
    g.add(w2);
  }
  const cow = box(2.6, 0.8, 0.8, red, 0, 0.6, -5.6);
  cow.rotation.x = 0.6;
  g.add(cow);
  const lamp = glowSprite(0xffe0a0, 1.2, 0.7);
  lamp.position.set(0, 3.2, -4.9);
  g.add(lamp);
  return mergeStatic(g);
}

export function makeRails(length) {
  const g = new THREE.Group();
  const wood = L({ color: 0x3a2a1c });
  const steel = L({ color: 0x5a5a5e });
  for (let z = -length / 2; z < length / 2; z += 1.2) g.add(box(2.6, 0.12, 0.3, wood, 0, 0.06, z));
  for (const x of [-0.75, 0.75]) g.add(box(0.1, 0.14, length, steel, x, 0.18, 0));
  const m = mergeStatic(g, false);
  return m;
}

// ---------------------------------------------------------------- turrets
export function makeTurret(type) {
  const g = new THREE.Group();
  const olive = L({ color: type === 'artillery' ? 0x4a4a3a : type === 'missile' ? 0x3a4a3e : 0x3a3e3a });
  const dark = L({ color: 0x1a1a1c });
  g.add(cyl(0.7, 0.85, 0.35, dark, 0, 0.18, 0, 10));
  const yaw = pivot(g, 0, 0.35, 0);
  const pitch = pivot(yaw, 0, 0.7, 0);
  const muzzle = new THREE.Object3D();
  if (type === 'mg') {
    yaw.add(box(0.9, 0.7, 0.9, olive, 0, 0.35, 0));
    yaw.add(box(0.12, 0.8, 1.0, olive, -0.5, 0.6, 0));
    const b1 = cyl(0.06, 0.06, 1.4, dark, 0.1, 0, -0.8);
    b1.rotation.x = Math.PI / 2;
    const b2 = b1.clone();
    b2.position.x = -0.1;
    pitch.add(b1, b2, box(0.5, 0.35, 0.6, olive, 0, 0, 0.1));
    muzzle.position.set(0, 0, -1.5);
  } else if (type === 'missile') {
    yaw.add(box(1.0, 0.5, 1.0, olive, 0, 0.25, 0));
    pitch.add(box(1.3, 0.8, 1.2, olive, 0, 0.1, 0));
    const tubeMat = L({ color: 0x14161a });
    for (let r = 0; r < 2; r++)
      for (let c = 0; c < 3; c++) {
        const t = cyl(0.15, 0.15, 0.2, tubeMat, -0.4 + c * 0.4, -0.12 + r * 0.42, -0.62);
        t.rotation.x = Math.PI / 2;
        pitch.add(t);
      }
    muzzle.position.set(0, 0.1, -0.8);
  } else {
    yaw.add(box(1.4, 0.6, 1.6, olive, 0, 0.3, 0.1));
    yaw.add(box(1.5, 1.0, 0.2, olive, 0, 0.8, -0.5)); // shield
    const barrel = cyl(0.14, 0.18, 3.0, dark, 0, 0, -1.4);
    barrel.rotation.x = Math.PI / 2;
    pitch.add(barrel, box(0.7, 0.6, 1.0, olive, 0, 0, 0.3));
    pitch.position.y = 0.9;
    muzzle.position.set(0, 0, -2.9);
  }
  pitch.add(muzzle);
  const flash = glowSprite(0xffc070, type === 'artillery' ? 2.5 : 1.2, 0);
  muzzle.add(flash);
  return { group: g, yaw, pitch, muzzle, flash };
}

// ---------------------------------------------------------------- sleeping area
export function makeTent(big = true) {
  const g = new THREE.Group();
  const cloth = L({ map: tex('canvasCloth'), side: THREE.DoubleSide });
  const w = big ? 3.0 : 1.8;
  const len = big ? 3.4 : 2.2;
  const h = big ? 2.1 : 1.2;
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2, 0);
  shape.lineTo(0, h);
  shape.lineTo(w / 2, 0);
  shape.lineTo(-w / 2, 0);
  const geo = new THREE.ExtrudeGeometry(shape, { depth: len, bevelEnabled: false });
  geo.translate(0, 0, -len / 2);
  const body = new THREE.Mesh(geo, cloth);
  body.castShadow = true;
  body.receiveShadow = true;
  g.add(body);
  // open flap: dark doorway on the +z end
  const door = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.45, h * 0.7), B({ color: 0x060504 }));
  door.position.set(0, h * 0.35, len / 2 + 0.01);
  g.add(door);
  g.add(box(0.06, h + 0.2, 0.06, L({ color: 0x3a2a1a }), 0, (h + 0.2) / 2, len / 2 + 0.05));
  if (big) {
    // bedroll visible inside + lantern
    g.add(box(0.9, 0.1, 2.2, L({ color: 0x5a2a20 }), 0, 0.05, 0));
  }
  return g;
}

export function makeBedroll(color) {
  const g = new THREE.Group();
  g.add(box(0.85, 0.12, 2.0, L({ color }), 0, 0.06, 0));
  const pillow = cyl(0.16, 0.16, 0.8, L({ color: 0xc8b898 }), 0, 0.12, -0.85);
  pillow.rotation.z = Math.PI / 2;
  g.add(pillow);
  return mergeStatic(g, false);
}

export function makeMapTable() {
  const g = new THREE.Group();
  const wood = L({ map: tex('wood', 5) });
  g.add(box(2.2, 0.1, 1.3, wood, 0, 0.92, 0));
  for (const [x, z] of [
    [-1, -0.55],
    [1, -0.55],
    [-1, 0.55],
    [1, 0.55],
  ])
    g.add(box(0.08, 0.9, 0.08, wood, x, 0.45, z));
  const paper = L({ map: tex('mapPaper'), emissive: 0x201810 });
  const m1 = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.7), paper);
  m1.rotation.set(-Math.PI / 2, 0, 0.08);
  m1.position.set(-0.5, 0.98, 0);
  const m2 = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.7), paper);
  m2.rotation.set(-Math.PI / 2, 0, -0.1);
  m2.position.set(0.5, 0.98, 0.05);
  g.add(m1, m2);
  // lantern
  g.add(box(0.14, 0.22, 0.14, L({ color: 0x2a2a2a }), 0.85, 1.08, -0.4));
  const glow = glowSprite(0xffb050, 1.2, 0.8);
  glow.position.set(0.85, 1.12, -0.4);
  g.add(glow);
  return g;
}

export function makeWeaponRack() {
  const g = new THREE.Group();
  const wood = L({ map: tex('wood', 5) });
  g.add(box(2.4, 0.12, 0.5, wood, 0, 0.1, 0));
  g.add(box(2.4, 0.12, 0.3, wood, 0, 1.5, -0.12));
  for (const x of [-1.15, 1.15]) g.add(box(0.12, 1.8, 0.12, wood, x, 0.9, -0.15));
  g.add(box(2.4, 0.08, 0.1, wood, 0, 0.6, 0.1));
  return g;
}

export function makeCampfire() {
  const g = new THREE.Group();
  const stone = L({ color: 0x5a5650 });
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    const s = new THREE.Mesh(new THREE.DodecahedronGeometry(0.18, 0), stone);
    s.position.set(Math.cos(a) * 0.6, 0.1, Math.sin(a) * 0.6);
    g.add(s);
  }
  const log = L({ map: tex('bark') });
  for (let i = 0; i < 4; i++) {
    const l = cyl(0.07, 0.07, 0.9, log, 0, 0.15, 0);
    l.rotation.set(Math.PI / 2 - 0.3, (i / 4) * Math.PI, 0);
    g.add(l);
  }
  const flames = [];
  for (let i = 0; i < 3; i++) {
    const f = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex('flame'), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    f.scale.set(0.6, 1.0, 1);
    f.position.set((i - 1) * 0.15, 0.55, (i % 2) * 0.1);
    g.add(f);
    flames.push(f);
  }
  const glow = glowSprite(0xff8a30, 4, 0.5);
  glow.position.y = 0.6;
  g.add(glow);
  return { group: g, flames, glow };
}

export function makeTrapCrate() {
  const g = new THREE.Group();
  g.add(box(1.2, 0.7, 0.8, L({ color: 0x4a5a3a }), 0, 0.35, 0));
  g.add(box(1.25, 0.08, 0.85, L({ color: 0x3a4a2a }), 0, 0.74, 0));
  g.add(box(0.6, 0.02, 0.3, L({ color: 0xc8b070, emissive: 0x302810 }), 0, 0.5, 0.41));
  return g;
}

// ---------------------------------------------------------------- barricade
// One segment spanning `len` along Z. Better barricades get more layers.
export function makeBarricade(len, level, rng) {
  const g = new THREE.Group();
  const wood = L({ map: tex('wood', 5) });
  const dark = L({ color: 0x2a1c12 });
  const metal = L({ map: tex('sheetMetal') });
  const bag = L({ color: 0x8a7a56 });
  const h = BARRICADE_H + Math.min(level, 6) * 0.06;
  // posts
  for (let z = -len / 2; z <= len / 2 + 0.01; z += 2.2) g.add(box(0.22, h + 0.3, 0.22, dark, 0, (h + 0.3) / 2, z));
  // three planks
  for (let i = 0; i < 3; i++) {
    const p = box(0.12, 0.28, len, wood, 0.15, 0.22 + i * (h / 3), 0);
    p.rotation.x = (rng() - 0.5) * 0.05;
    g.add(p);
  }
  // crossed spikes facing the field
  for (let z = -len / 2 + 0.6; z < len / 2; z += 1.4) {
    const s = cyl(0.04, 0.07, 1.6, wood, 0.8, 0.5, z, 5);
    s.rotation.z = -1.0;
    g.add(s);
  }
  if (level >= 2) for (let z = -len / 2 + 0.5; z < len / 2; z += 1.0) g.add(box(0.5, 0.35, 0.95, bag, -0.3, 0.17, z));
  if (level >= 4) g.add(box(0.06, h * 0.85, len, metal, 0.24, h * 0.45, 0));
  if (level >= 6) for (let z = -len / 2 + 0.5; z < len / 2; z += 1.0) g.add(box(0.5, 0.35, 0.95, bag, -0.3, 0.52, z));
  return mergeStatic(g);
}

// The camp gate: two tall posts with a sign, and two plank leaves that swing
// inward. Leaves are hinged on the posts; rotate leftLeaf to -PI/2 and
// rightLeaf to +PI/2 to open.
export function makeGate(width) {
  const g = new THREE.Group();
  const wood = L({ map: tex('wood', 5) });
  const dark = L({ color: 0x2a1c12 });
  const iron = L({ color: 0x2c2c2e, metalness: 0.6, roughness: 0.5 });
  for (const s of [-1, 1]) {
    g.add(box(0.3, 3.0, 0.3, dark, 0, 1.5, (s * width) / 2));
    g.add(box(0.5, 0.5, 0.5, dark, 0, 0.25, (s * width) / 2));
  }
  g.add(box(0.26, 0.26, width + 0.6, dark, 0, 2.9, 0));
  // painted sign over the gate
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 64;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#4a3420';
  ctx.fillRect(0, 0, 256, 64);
  ctx.fillStyle = '#d8c8a0';
  ctx.font = 'bold 38px serif';
  ctx.textAlign = 'center';
  ctx.fillText('GATE', 128, 46);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  for (const s of [1, -1]) {
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.45), L({ map: t }));
    sign.position.set(s * 0.16, 2.55, 0);
    sign.rotation.y = (s * Math.PI) / 2;
    g.add(sign);
  }
  const leaf = (side) => {
    const hinge = pivot(g, 0, 0, (side * width) / 2);
    const lw = width / 2 - 0.12;
    const dir = -side; // leaves extend toward the middle
    for (let i = 0; i < 3; i++) hinge.add(box(0.1, 0.28, lw, wood, 0, 0.3 + i * 0.36, (dir * lw) / 2 + dir * 0.06));
    const brace = box(0.08, 0.16, Math.hypot(lw, 0.8), wood, 0.04, 0.66, (dir * lw) / 2 + dir * 0.06);
    brace.rotation.x = dir * Math.atan2(0.8, lw);
    hinge.add(brace);
    hinge.add(box(0.12, 0.08, 0.3, iron, 0.02, 0.4, dir * 0.15));
    hinge.add(box(0.12, 0.08, 0.3, iron, 0.02, 1.0, dir * 0.15));
    return hinge;
  };
  return { group: g, left: leaf(-1), right: leaf(1) };
}

export function makeBarricadeRubble(len, rng) {
  const g = new THREE.Group();
  const wood = L({ map: tex('wood', 5) });
  for (let i = 0; i < Math.ceil(len * 1.5); i++) {
    const p = box(0.12, 0.2, 0.9 + rng() * 1.2, wood, (rng() - 0.5) * 1.6, 0.1, (rng() - 0.5) * len);
    p.rotation.set(rng() * 0.4, rng() * 3, rng() * 0.3);
    g.add(p);
  }
  return mergeStatic(g);
}

export function makeLantern() {
  const g = new THREE.Group();
  g.add(box(0.05, 2.2, 0.05, L({ color: 0x2a1c12 }), 0, 1.1, 0));
  g.add(box(0.16, 0.24, 0.16, L({ color: 0x2a2a2a }), 0, 2.3, 0));
  const glow = glowSprite(0xffb050, 1.4, 0.85);
  glow.position.y = 2.3;
  g.add(glow);
  return { group: g, glow };
}

// ---------------------------------------------------------------- vegetation & cover
export function makePine(rng, snow = false) {
  const g = new THREE.Group();
  const s = 0.8 + rng() * 0.7;
  g.add(cyl(0.18 * s, 0.25 * s, 1.6 * s, L({ map: tex('bark') }), 0, 0.8 * s, 0, 6));
  const leaf = L({ color: snow ? 0x2e4436 : 0x1e3a22 });
  const white = L({ color: 0xe8eef4 });
  for (let i = 0; i < 4; i++) {
    const r = (1.6 - i * 0.32) * s;
    const c = new THREE.Mesh(new THREE.ConeGeometry(r, 1.6 * s, 7), leaf);
    c.position.y = (1.6 + i * 0.95) * s;
    c.castShadow = true;
    g.add(c);
    if (snow) {
      const cap = new THREE.Mesh(new THREE.ConeGeometry(r * 0.7, 0.6 * s, 7), white);
      cap.position.y = (1.6 + i * 0.95 + 0.55) * s;
      g.add(cap);
    }
  }
  return { mesh: mergeStatic(g), r: 0.4 * s, h: 5 * s };
}

export function makeDeadTree(rng) {
  const g = new THREE.Group();
  const bark = L({ color: 0x3a3430 });
  const s = 0.9 + rng() * 0.6;
  g.add(cyl(0.12 * s, 0.22 * s, 4 * s, bark, 0, 2 * s, 0, 6));
  for (let i = 0; i < 5; i++) {
    const b = cyl(0.03 * s, 0.07 * s, 1.4 * s, bark, 0, (1.8 + i * 0.5) * s, 0, 5);
    b.rotation.set(rng() * 0.8 + 0.6, rng() * 6, 0);
    b.position.x = Math.sin(b.rotation.y) * 0.4 * s;
    b.position.z = Math.cos(b.rotation.y) * 0.4 * s;
    g.add(b);
  }
  return { mesh: mergeStatic(g), r: 0.3 * s, h: 4 * s };
}

export function makeCactus(rng) {
  const g = new THREE.Group();
  const green = L({ color: 0x3a6a34 });
  const s = 0.8 + rng() * 0.6;
  g.add(cyl(0.22 * s, 0.25 * s, 2.6 * s, green, 0, 1.3 * s, 0, 7));
  for (const side of [-1, 1]) {
    if (rng() < 0.3) continue;
    const y = (0.9 + rng() * 0.8) * s;
    const arm = cyl(0.14 * s, 0.14 * s, 0.6 * s, green, side * 0.4 * s, y, 0, 6);
    arm.rotation.z = Math.PI / 2;
    g.add(arm);
    g.add(cyl(0.14 * s, 0.14 * s, 0.8 * s, green, side * 0.66 * s, y + 0.35 * s, 0, 6));
  }
  return { mesh: mergeStatic(g), r: 0.35 * s, h: 2.8 * s };
}

export function makeRock(rng, color = 0x6a6660) {
  const s = 0.6 + rng() * 1.1;
  const m = new THREE.Mesh(new THREE.DodecahedronGeometry(s, 0), L({ color, flatShading: true }));
  m.scale.set(1 + rng() * 0.5, 0.6 + rng() * 0.4, 1 + rng() * 0.4);
  m.position.y = s * 0.35;
  m.rotation.set(rng(), rng() * 6, rng());
  m.castShadow = true;
  m.receiveShadow = true;
  const g = new THREE.Group();
  g.add(m);
  return { mesh: g, r: s * 1.1, h: s * 1.2 };
}

export function makeLog(rng) {
  const g = new THREE.Group();
  const len = 2.5 + rng() * 2;
  const l = cyl(0.3, 0.32, len, L({ map: tex('bark') }), 0, 0.3, 0, 8);
  l.rotation.z = Math.PI / 2;
  g.add(l);
  return { mesh: mergeStatic(g), r: len / 2, h: 0.6, long: len };
}

export function makeStump(rng) {
  const g = new THREE.Group();
  g.add(cyl(0.4, 0.5, 0.6, L({ map: tex('bark') }), 0, 0.3, 0, 8));
  g.add(cyl(0.38, 0.38, 0.02, L({ color: 0x9a7a4a }), 0, 0.61, 0, 8));
  void rng;
  return { mesh: mergeStatic(g), r: 0.5, h: 0.6 };
}

export function makeBush(rng, color = 0x2a4a22) {
  const g = new THREE.Group();
  const mat = L({ color, flatShading: true });
  for (let i = 0; i < 3; i++) {
    const s = new THREE.Mesh(new THREE.IcosahedronGeometry(0.5 + rng() * 0.3, 0), mat);
    s.position.set((rng() - 0.5) * 0.8, 0.4, (rng() - 0.5) * 0.8);
    s.castShadow = true;
    g.add(s);
  }
  return { mesh: mergeStatic(g), r: 0.7, h: 0.9, soft: true };
}

export function makeCarWreck(rng) {
  const g = new THREE.Group();
  const paint = L({ color: [0x5a2a22, 0x2a3a4a, 0x4a4a3a, 0x6a6a6a, 0x2a4a2a][Math.floor(rng() * 5)] });
  const rust = L({ color: 0x5a3018 });
  const dark = L({ color: 0x141414 });
  g.add(box(1.9, 0.8, 4.2, paint, 0, 0.6, 0));
  g.add(box(1.7, 0.6, 2.0, paint, 0, 1.3, -0.2));
  g.add(box(1.6, 0.5, 0.05, L({ color: 0x0a0c10 }), 0, 1.3, 0.81));
  g.add(box(1.92, 0.3, 1.2, rust, 0, 0.75, 1.4));
  for (const x of [-0.95, 0.95])
    for (const z of [-1.3, 1.3]) {
      const w = cyl(0.35, 0.35, 0.25, dark, x, 0.3, z, 8);
      w.rotation.z = Math.PI / 2;
      g.add(w);
    }
  const m = mergeStatic(g);
  m.rotation.z = (rng() - 0.5) * 0.12;
  return { mesh: m, r: 1.2, h: 1.6, box: [1.0, 2.15] };
}

export function makeBarrel(rng) {
  const g = new THREE.Group();
  g.add(cyl(0.35, 0.35, 1.0, L({ color: rng() < 0.5 ? 0x6a3a1a : 0x3a4a5a }), 0, 0.5, 0, 10));
  return { mesh: mergeStatic(g), r: 0.4, h: 1 };
}

export function makeIce(rng) {
  const m = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.9 + rng() * 0.8, 0),
    L({ color: 0xaad4ee, emissive: 0x14222c, transparent: true, opacity: 0.85, flatShading: true })
  );
  m.scale.y = 1.4;
  m.position.y = 0.6;
  m.rotation.set(rng(), rng() * 6, 0);
  const g = new THREE.Group();
  g.add(m);
  return { mesh: g, r: 1.0, h: 1.8 };
}

export function makeCowSkull() {
  const g = new THREE.Group();
  const bone = L({ color: 0xd8ccb0 });
  g.add(box(0.3, 0.22, 0.45, bone, 0, 0.11, 0));
  for (const s of [-1, 1]) {
    const h = cyl(0.03, 0.06, 0.5, bone, s * 0.3, 0.25, -0.1, 5);
    h.rotation.z = s * 1.2;
    g.add(h);
  }
  return { mesh: mergeStatic(g, false), r: 0.3, h: 0.3, soft: true };
}

// Distant mountain silhouettes around the scene.
export function makeBackdrop(color, rng, cx, cz, radius) {
  const g = new THREE.Group();
  const mat = new THREE.MeshBasicMaterial({ color, fog: true });
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * Math.PI * 2 + rng() * 0.1;
    const h = 18 + rng() * 34;
    const r = 18 + rng() * 26;
    const c = new THREE.Mesh(new THREE.ConeGeometry(r, h, 5), mat);
    c.position.set(cx + Math.cos(a) * radius, h / 2 - 2, cz + Math.sin(a) * radius);
    c.rotation.y = rng() * 3;
    g.add(c);
  }
  return g;
}

// Towers on the horizon beyond the barricade, fading into the haze.
export function makeSkyline(color, rng, cx, cz, radius, size) {
  const g = new THREE.Group();
  const c = new THREE.Color(color).multiplyScalar(0.55);
  const mat = new THREE.MeshBasicMaterial({ color: c, fog: true });
  const n = [0, 10, 22, 40][size];
  const hMax = [0, 30, 70, 150][size];
  const geo = new THREE.BoxGeometry(1, 1, 1);
  geo.translate(0, 0.5, 0);
  for (let i = 0; i < n; i++) {
    // bunched toward the middle like a real downtown
    const t = (rng() + rng() + rng()) / 3 - 0.5;
    const a = t * 1.5;
    const r = radius + rng() * 50;
    const h = hMax * (0.2 + 0.8 * Math.pow(rng(), 1.6)) * (1 - Math.abs(t) * 0.9);
    const w = 12 + rng() * 22;
    const m = new THREE.Mesh(geo, mat);
    m.scale.set(w, h, 12 + rng() * 20);
    m.position.set(cx + Math.cos(a) * r, -2, cz + Math.sin(a) * r);
    m.rotation.y = -a + (rng() - 0.5) * 0.4;
    g.add(m);
    if (h > 60 && rng() < 0.5) {
      const mast = new THREE.Mesh(geo, mat);
      mast.scale.set(1.2, h * 0.25, 1.2);
      mast.position.set(m.position.x, h - 2, m.position.z);
      g.add(mast);
    }
  }
  return g;
}

// ---------------------------------------------------------------- traps
export function makeMine() {
  const g = new THREE.Group();
  g.add(cyl(0.22, 0.25, 0.08, L({ color: 0x3a4a2a }), 0, 0.04, 0, 10));
  g.add(cyl(0.05, 0.05, 0.05, L({ color: 0x8a8a7a }), 0, 0.1, 0, 6));
  const light = glowSprite(0xff2010, 0.25, 0.9);
  light.position.y = 0.14;
  g.add(light);
  return { group: g, light };
}

export function makeTripSpikes(width) {
  const g = new THREE.Group();
  const post = L({ color: 0x3a2a1c });
  for (const s of [-1, 1]) g.add(box(0.12, 0.7, 0.12, post, 0, 0.35, (s * width) / 2));
  const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, width, 4), L({ color: 0xb0b0a0, emissive: 0x202020 }));
  wire.rotation.x = Math.PI / 2;
  wire.position.y = 0.25;
  g.add(wire);
  const spikes = new THREE.Group();
  const metal = L({ color: 0x8a8076 });
  for (let i = 0; i < 9; i++) {
    const c = new THREE.Mesh(new THREE.ConeGeometry(0.07, 1.6, 4), metal);
    c.position.set(0, 0.0, -width / 2 + (i + 0.5) * (width / 9));
    c.userData.baseY = -0.9;
    spikes.add(c);
  }
  spikes.visible = false;
  g.add(spikes);
  return { group: g, wire, spikes };
}

export function makeKeroseneTank() {
  const g = new THREE.Group();
  const red = L({ color: 0xa02414 });
  const t = cyl(0.42, 0.42, 1.2, red, 0, 0.6, 0, 10);
  g.add(t);
  g.add(cyl(0.12, 0.12, 0.2, L({ color: 0x2a2a2a }), 0, 1.3, 0, 8));
  g.add(box(0.5, 0.18, 0.02, L({ color: 0xe8d040, emissive: 0x2a2400 }), 0, 0.75, 0.43));
  return g;
}

// ---------------------------------------------------------------- building props
const CONTAINER = {
  crate: { w: 1.0, h: 0.86, d: 1.0, tex: 'crate' },
  cabinet: { w: 0.9, h: 1.5, d: 0.55, color: 0x5a5e62 },
  desk: { w: 1.5, h: 0.78, d: 0.8, color: 0x6a4a2a },
  fridge: { w: 0.85, h: 1.8, d: 0.75, color: 0xc8c8c0 },
  toolbox: { w: 1.0, h: 0.9, d: 0.6, color: 0xa02a1a },
  medcab: { w: 0.9, h: 1.3, d: 0.45, color: 0xd8dcdc, cross: true },
  gunlocker: { w: 1.0, h: 1.9, d: 0.6, color: 0x2a3a2a },
  footlocker: { w: 1.1, h: 0.55, d: 0.6, color: 0x3a4a2a },
  shelf: { w: 1.6, h: 1.9, d: 0.6, color: 0x4a4a50, shelf: true },
};
export const CONTAINER_DEPTH = Object.fromEntries(Object.entries(CONTAINER).map(([k, v]) => [k, v.d]));
export const CONTAINER_WIDTH = Object.fromEntries(Object.entries(CONTAINER).map(([k, v]) => [k, v.w]));

export function makeContainer(kind) {
  const c = CONTAINER[kind] || CONTAINER.crate;
  const g = new THREE.Group();
  const mat = c.tex ? L({ map: tex(c.tex, 9) }) : L({ color: c.color });
  if (c.shelf) {
    for (let i = 0; i < 4; i++) g.add(box(c.w, 0.05, c.d, mat, 0, 0.1 + i * 0.58, 0));
    for (const x of [-c.w / 2, c.w / 2]) g.add(box(0.05, c.h, c.d, mat, x, c.h / 2, 0));
    const boxes = L({ map: tex('crate', 9) });
    for (let i = 0; i < 3; i++) g.add(box(0.45, 0.35, 0.45, boxes, -0.4 + i * 0.4, 0.31 + (i % 2) * 0.58, 0));
    const lid = pivot(g, 0, 0, 0);
    return { group: g, lid, hinge: 'none' };
  }
  const body = box(c.w, c.h, c.d, mat, 0, c.h / 2, 0);
  body.receiveShadow = true;
  g.add(body);
  if (c.cross) {
    const red = B({ color: 0xc01010 });
    g.add(box(0.3, 0.08, 0.02, red, 0, c.h * 0.6, c.d / 2 + 0.01));
    g.add(box(0.08, 0.3, 0.02, red, 0, c.h * 0.6, c.d / 2 + 0.01));
  }
  const tall = c.h > 1.2;
  let lid;
  if (tall) {
    // door hinged on the left side, opening outward (+z is the front)
    lid = pivot(g, -c.w / 2, 0, c.d / 2);
    lid.add(box(c.w, c.h * 0.96, 0.04, L({ color: new THREE.Color(c.color ?? 0x888888).multiplyScalar(0.85) }), c.w / 2, c.h / 2, 0.02));
    lid.add(box(0.04, 0.12, 0.04, L({ color: 0x9a9a9a }), c.w - 0.1, c.h / 2, 0.06));
  } else {
    lid = pivot(g, 0, c.h, -c.d / 2);
    lid.add(box(c.w * 1.02, 0.08, c.d * 1.02, mat, 0, 0.04, c.d / 2));
  }
  return { group: g, lid, hinge: tall ? 'door' : 'lid' };
}

export function makeWallLamp(color = 0xd8e0ff) {
  const g = new THREE.Group();
  g.add(box(0.4, 0.14, 0.14, L({ color: 0x2a2a2a }), 0, 2.9, 0.07));
  const bulb = box(0.34, 0.06, 0.06, B({ color }), 0, 2.83, 0.1);
  g.add(bulb);
  const glow = glowSprite(color, 1.4, 0.55);
  glow.position.set(0, 2.82, 0.2);
  g.add(glow);
  return { group: g, bulb, glow };
}

export function makeExitMarker() {
  const g = new THREE.Group();
  const wood = L({ map: tex('wood', 5) });
  g.add(box(0.12, 1.6, 0.12, wood, 0, 0.8, 0));
  const sign = box(0.9, 0.35, 0.06, wood, 0.25, 1.35, 0);
  g.add(sign);
  g.add(box(0.5, 0.05, 0.02, L({ color: 0xd0c090, emissive: 0x302810 }), 0.25, 1.35, 0.04));
  // hand cart
  g.add(box(1.2, 0.35, 0.8, wood, 0, 0.55, -1.2));
  for (const x of [-0.6, 0.6]) {
    const w = cyl(0.32, 0.32, 0.08, L({ color: 0x2a1a10 }), x, 0.32, -1.2, 10);
    w.rotation.z = Math.PI / 2;
    g.add(w);
  }
  const glow = glowSprite(0xffd080, 1.2, 0.7);
  glow.position.set(0, 1.75, 0);
  g.add(glow);
  return { group: g, glow };
}

export function makeDebris(rng) {
  const g = new THREE.Group();
  const paper = L({ color: 0xc8c0b0 });
  const conc = L({ color: 0x5a5852 });
  for (let i = 0; i < 6; i++) {
    const p = box(0.18 + rng() * 0.2, 0.005, 0.24 + rng() * 0.1, paper, (rng() - 0.5) * 1.6, 0.01, (rng() - 0.5) * 1.6);
    p.rotation.y = rng() * 6;
    g.add(p);
  }
  for (let i = 0; i < 4; i++) {
    const r = new THREE.Mesh(new THREE.DodecahedronGeometry(0.08 + rng() * 0.12, 0), conc);
    r.position.set((rng() - 0.5) * 1.6, 0.05, (rng() - 0.5) * 1.6);
    g.add(r);
  }
  return mergeStatic(g, false);
}
