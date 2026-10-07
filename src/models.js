// Low-poly models for monsters, props and the first-person view model.
import * as THREE from 'three';
import { tex } from './textures.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const L = (o) => new THREE.MeshLambertMaterial(o);
const B = (o) => new THREE.MeshBasicMaterial(o);

function box(w, h, d, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  return m;
}
function pivot(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  parent.add(g);
  return g;
}
function glowSprite(color, size, opacity = 1) {
  const s = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: tex('glow'),
      color,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: true,
    })
  );
  s.scale.set(size, size, size);
  return s;
}

// Collapse a static prop into one mesh per material to save draw calls.
export function mergeStatic(group, castShadow = true) {
  group.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(group.matrixWorld).invert();
  const byMat = new Map();
  const keep = [];
  group.traverse((o) => {
    if (o.isMesh && !o.isInstancedMesh) {
      const geo = o.geometry.index ? o.geometry : null;
      if (!geo) return keep.push(o);
      const g = geo.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld));
      if (!byMat.has(o.material)) byMat.set(o.material, []);
      byMat.get(o.material).push(g);
    } else if (o.isSprite && o.parent === group) keep.push(o);
  });
  const out = new THREE.Group();
  for (const [mat, list] of byMat) {
    const m = new THREE.Mesh(mergeGeometries(list), mat);
    m.castShadow = castShadow;
    m.receiveShadow = true;
    out.add(m);
    list.forEach((g) => g.dispose());
  }
  for (const k of keep) out.add(k);
  return out;
}

// ---------------------------------------------------------------- Monsters

export function makeGrunt() {
  const skin = L({ color: 0x8c8676, map: tex('flesh', 11) });
  const dark = L({ color: 0x2a2018 });
  const eye = B({ color: 0xff2a00 });
  const bone = L({ color: 0xb8ae96 });
  const root = new THREE.Group();
  const hips = pivot(root, 0, 0.95, 0);
  const torso = pivot(hips, 0, 0, 0);
  torso.rotation.x = 0.45;
  torso.add(box(0.62, 0.8, 0.36, skin, 0, 0.42, 0));
  torso.add(box(0.5, 0.25, 0.3, dark, 0, -0.02, 0)); // rags
  // spine ridge
  for (let i = 0; i < 4; i++) torso.add(box(0.06, 0.06, 0.08, bone, 0, 0.15 + i * 0.18, -0.2));
  const head = pivot(torso, 0, 0.92, 0.14);
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), skin);
  skull.scale.set(1, 1.15, 1.05);
  skull.castShadow = true;
  head.add(skull);
  const jaw = pivot(head, 0, -0.1, 0.02);
  jaw.add(box(0.26, 0.08, 0.22, skin, 0, -0.04, 0.06));
  for (let i = -2; i <= 2; i++) {
    const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.015, 0.06, 4), bone);
    tooth.position.set(i * 0.045, 0.02, 0.16);
    jaw.add(tooth);
  }
  for (const s of [-1, 1]) {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 4), eye);
    e.position.set(s * 0.075, 0.03, 0.17);
    head.add(e);
  }
  const arms = [];
  for (const s of [-1, 1]) {
    const sh = pivot(torso, s * 0.38, 0.74, 0.02);
    sh.add(box(0.13, 0.72, 0.13, skin, 0, -0.36, 0));
    const fore = pivot(sh, 0, -0.72, 0);
    fore.add(box(0.11, 0.68, 0.11, skin, 0, -0.34, 0));
    for (let c = -1; c <= 1; c++) {
      const claw = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.2, 4), bone);
      claw.position.set(c * 0.035, -0.75, 0.02);
      claw.rotation.x = Math.PI;
      fore.add(claw);
    }
    arms.push({ sh, fore, s });
  }
  const legs = [];
  for (const s of [-1, 1]) {
    const hip = pivot(hips, s * 0.17, 0, 0);
    hip.add(box(0.17, 0.5, 0.17, skin, 0, -0.25, 0));
    const knee = pivot(hip, 0, -0.5, 0);
    knee.add(box(0.14, 0.45, 0.14, skin, 0, -0.22, 0));
    knee.add(box(0.16, 0.06, 0.28, dark, 0, -0.44, 0.06));
    legs.push({ hip, knee, s });
  }
  return { root, hips, torso, head, jaw, arms, legs, height: 1.85, baseLean: 0.45 };
}

export function makeBrute() {
  const skin = L({ color: 0x7a5244, map: tex('flesh', 21) });
  const metal = L({ color: 0x3a3a3a });
  const strap = L({ color: 0x1c140e });
  const root = new THREE.Group();
  const hips = pivot(root, 0, 1.3, 0);
  const torso = pivot(hips, 0, 0, 0);
  torso.rotation.x = 0.25;
  torso.add(box(1.25, 1.15, 0.8, skin, 0, 0.6, 0));
  torso.add(box(1.0, 0.5, 0.75, skin, 0, 0.05, 0.08)); // gut
  torso.add(box(1.3, 0.12, 0.85, strap, 0, 0.3, 0));
  torso.add(box(0.12, 1.2, 0.86, strap, 0.3, 0.6, 0));
  const head = pivot(torso, 0, 1.3, 0.25);
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.27, 8, 6), skin);
  skull.castShadow = true;
  head.add(skull);
  head.add(box(0.5, 0.18, 0.4, metal, 0, 0.04, 0.06)); // blindfold mask
  for (let i = -2; i <= 2; i++) head.add(box(0.02, 0.12, 0.02, strap, i * 0.05, -0.14, 0.24)); // stitched mouth
  const jaw = pivot(head, 0, -0.16, 0.05);
  jaw.add(box(0.32, 0.1, 0.25, skin, 0, -0.03, 0.06));
  const arms = [];
  for (const s of [-1, 1]) {
    const sh = pivot(torso, s * 0.78, 1.05, 0);
    sh.add(box(0.42, 0.42, 0.42, skin, 0, 0, 0));
    sh.add(box(0.32, 0.85, 0.32, skin, 0, -0.45, 0));
    const fore = pivot(sh, 0, -0.88, 0);
    fore.add(box(0.36, 0.8, 0.36, skin, 0, -0.38, 0));
    fore.add(box(0.44, 0.38, 0.44, skin, 0, -0.88, 0));
    fore.add(box(0.4, 0.1, 0.4, metal, 0, -0.15, 0));
    arms.push({ sh, fore, s });
  }
  const legs = [];
  for (const s of [-1, 1]) {
    const hip = pivot(hips, s * 0.33, 0, 0);
    hip.add(box(0.36, 0.68, 0.36, skin, 0, -0.34, 0));
    const knee = pivot(hip, 0, -0.66, 0);
    knee.add(box(0.32, 0.6, 0.32, skin, 0, -0.3, 0));
    knee.add(box(0.36, 0.08, 0.48, strap, 0, -0.62, 0.08));
    legs.push({ hip, knee, s });
  }
  return { root, hips, torso, head, jaw, arms, legs, height: 2.8, baseLean: 0.25 };
}

export function makeHound() {
  const skin = L({ color: 0x9a4a42, map: tex('flesh', 31) });
  const bone = L({ color: 0xd0c6b0 });
  const eye = B({ color: 0xffdd22 });
  const root = new THREE.Group();
  const hips = pivot(root, 0, 0.5, 0);
  const torso = pivot(hips, 0, 0, 0);
  torso.add(box(0.36, 0.32, 0.9, skin, 0, 0, 0));
  for (let i = 0; i < 5; i++) {
    const sp = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.14, 4), bone);
    sp.position.set(0, 0.2, -0.3 + i * 0.14);
    torso.add(sp);
  }
  for (let i = 0; i < 4; i++) torso.add(box(0.38, 0.03, 0.04, bone, 0, -0.05, -0.15 + i * 0.1)); // ribs
  const head = pivot(torso, 0, 0.12, 0.48);
  head.add(box(0.26, 0.2, 0.3, skin, 0, 0.02, 0.1));
  head.add(box(0.2, 0.08, 0.2, skin, 0, 0.06, 0.3));
  for (let i = -1; i <= 1; i += 2) {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 4), eye);
    e.position.set(i * 0.08, 0.08, 0.24);
    head.add(e);
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.16, 4), skin);
    ear.position.set(i * 0.1, 0.18, 0.02);
    ear.rotation.z = -i * 0.4;
    head.add(ear);
  }
  const jaw = pivot(head, 0, -0.06, 0.12);
  jaw.add(box(0.18, 0.06, 0.3, skin, 0, -0.03, 0.12));
  for (let i = -2; i <= 2; i++) {
    const t = new THREE.Mesh(new THREE.ConeGeometry(0.012, 0.05, 4), bone);
    t.position.set(i * 0.035, 0.02, 0.25);
    jaw.add(t);
  }
  const legs = [];
  for (const [x, z] of [
    [-0.14, 0.35],
    [0.14, 0.35],
    [-0.14, -0.35],
    [0.14, -0.35],
  ]) {
    const hip = pivot(torso, x, -0.08, z);
    hip.add(box(0.07, 0.25, 0.07, skin, 0, -0.12, 0));
    const knee = pivot(hip, 0, -0.24, 0);
    knee.add(box(0.05, 0.22, 0.05, skin, 0, -0.1, 0));
    legs.push({ hip, knee, s: x * z > 0 ? 1 : -1 });
  }
  const tail = pivot(torso, 0, 0.05, -0.45);
  tail.add(box(0.04, 0.04, 0.4, skin, 0, 0, -0.2));
  return { root, hips, torso, head, jaw, arms: [], legs, tail, height: 0.75, baseLean: 0, quad: true };
}

function wingGeometry() {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.quadraticCurveTo(0.3, 0.55, 0.15, 1.15);
  s.lineTo(0.05, 0.9);
  s.lineTo(-0.1, 1.0);
  s.lineTo(-0.15, 0.7);
  s.lineTo(-0.32, 0.75);
  s.lineTo(-0.3, 0.45);
  s.lineTo(-0.48, 0.42);
  s.lineTo(-0.38, 0.15);
  s.lineTo(-0.55, 0.05);
  s.quadraticCurveTo(-0.2, -0.15, 0, 0);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.04, bevelEnabled: false });
  g.translate(0, 0, -0.02);
  return g;
}

export function makeAngel() {
  const stone = L({ color: 0x9a9a92, map: tex('stone', 12) });
  const dark = B({ color: 0x050505 });
  const root = new THREE.Group();
  const hips = pivot(root, 0, 1.15, 0);
  const robe = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.5, 1.2, 10), stone);
  robe.position.y = -0.55;
  robe.castShadow = true;
  hips.add(robe);
  const torso = pivot(hips, 0, 0, 0);
  const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.24, 0.62, 8), stone);
  chest.position.y = 0.3;
  chest.castShadow = true;
  torso.add(chest);
  const head = pivot(torso, 0, 0.78, 0);
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), stone);
  skull.scale.set(1, 1.15, 1);
  skull.castShadow = true;
  head.add(skull);
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.17, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), stone);
  hair.position.set(0, 0.03, -0.02);
  head.add(hair);
  // snarling face (only visible in aggressive poses)
  const face = new THREE.Group();
  face.add(box(0.12, 0.08, 0.02, dark, 0, -0.07, 0.15));
  for (let i = -2; i <= 2; i++) {
    const t = new THREE.Mesh(new THREE.ConeGeometry(0.01, 0.045, 4), stone);
    t.position.set(i * 0.022, -0.04, 0.16);
    t.rotation.x = Math.PI;
    face.add(t);
    const b = t.clone();
    b.position.y = -0.1;
    b.rotation.x = 0;
    face.add(b);
  }
  for (const s of [-1, 1]) face.add(box(0.04, 0.02, 0.02, dark, s * 0.06, 0.03, 0.15));
  head.add(face);
  const jaw = pivot(head, 0, -0.1, 0);
  const arms = [];
  for (const s of [-1, 1]) {
    const sh = pivot(torso, s * 0.27, 0.56, 0);
    const up = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.46, 6), stone);
    up.position.y = -0.23;
    up.castShadow = true;
    sh.add(up);
    const fore = pivot(sh, 0, -0.46, 0);
    const fa = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.42, 6), stone);
    fa.position.y = -0.21;
    fa.castShadow = true;
    fore.add(fa);
    const hand = box(0.08, 0.14, 0.04, stone, 0, -0.48, 0);
    fore.add(hand);
    for (let f = -1; f <= 1; f++) {
      const claw = new THREE.Mesh(new THREE.ConeGeometry(0.012, 0.09, 4), stone);
      claw.position.set(f * 0.025, -0.58, 0);
      claw.rotation.x = Math.PI;
      fore.add(claw);
    }
    arms.push({ sh, fore, s });
  }
  const wg = wingGeometry();
  const wings = [];
  for (const s of [-1, 1]) {
    const w = new THREE.Mesh(wg, stone);
    w.castShadow = true;
    w.position.set(s * 0.12, 0.25, -0.2);
    w.rotation.set(0.15, s * -0.5, 0);
    w.scale.set(-s, 1, 1);
    torso.add(w);
    wings.push(w);
  }
  return { root, hips, torso, head, jaw, arms, legs: [], face, wings, height: 2.0, baseLean: 0 };
}

// Poses for the angel (statue snaps into one each time it is seen again).
export function setAngelPose(m, pose) {
  const [L1, R1] = m.arms;
  const set = (a, sx, sz, fx) => {
    a.sh.rotation.set(sx, 0, sz);
    a.fore.rotation.set(fx, 0, 0);
  };
  m.face.visible = pose >= 2;
  m.torso.rotation.set(0, 0, 0);
  m.head.rotation.set(0, 0, 0);
  m.wings.forEach((w, i) => (w.rotation.y = (i ? 1 : -1) * -0.5));
  switch (pose) {
    case 0: // weeping, hands over face
      set(L1, -2.3, -0.5, -1.4);
      set(R1, -2.3, 0.5, -1.4);
      m.head.rotation.x = 0.35;
      m.torso.rotation.x = 0.15;
      break;
    case 1: // reaching
      set(L1, -1.4, -0.1, -0.2);
      set(R1, -1.5, 0.15, -0.1);
      m.head.rotation.x = 0.1;
      break;
    case 2: // lunging snarl
      set(L1, -2.2, -0.4, -0.5);
      set(R1, -1.2, 0.3, -0.3);
      m.torso.rotation.x = 0.3;
      m.head.rotation.x = -0.15;
      m.wings.forEach((w, i) => (w.rotation.y = (i ? 1 : -1) * -0.95));
      break;
    default: // clawing at the viewer
      set(L1, -1.7, -0.6, -0.9);
      set(R1, -2.6, 0.2, -0.4);
      m.torso.rotation.set(0.35, 0.2, 0);
      m.head.rotation.set(-0.2, -0.2, 0.15);
      m.wings.forEach((w, i) => (w.rotation.y = (i ? 1 : -1) * -1.1));
  }
}

// ---------------------------------------------------------------- Props

export function makeLocker() {
  const side = L({ color: 0x3e4444 });
  const front = L({ map: tex('metal', 7) });
  const g = new THREE.Group();
  const m = new THREE.Mesh(new THREE.BoxGeometry(0.85, 2.1, 0.6), [side, side, side, side, front, side]);
  m.position.y = 1.05;
  m.castShadow = m.receiveShadow = true;
  g.add(m);
  return g;
}

export function makeCloset() {
  const side = L({ color: 0x2e1a10 });
  const front = L({ map: tex('closet', 8) });
  const g = new THREE.Group();
  const m = new THREE.Mesh(new THREE.BoxGeometry(1.3, 2.2, 0.72), [side, side, side, side, front, side]);
  m.position.y = 1.1;
  m.castShadow = m.receiveShadow = true;
  g.add(m);
  g.add(box(1.4, 0.1, 0.8, side, 0, 2.25, 0));
  return g;
}

export function makeBed(clean = false) {
  const wood = L({ color: 0x3a2414, map: tex('wood', 5) });
  const sheet = L({ color: clean ? 0x8a7a6a : 0x6a6050, map: tex('flesh', clean ? 41 : 42) });
  const blood = L({ color: 0x3a0000 });
  const g = new THREE.Group();
  g.add(box(2.0, 0.1, 1.05, wood, 0, 0.42, 0));
  g.add(box(1.9, 0.16, 0.98, sheet, 0, 0.55, 0));
  g.add(box(0.4, 0.12, 0.7, sheet, -0.72, 0.68, 0));
  if (!clean) g.add(box(0.6, 0.02, 0.5, blood, 0.2, 0.64, 0.1));
  for (const [x, z] of [
    [-0.95, -0.48],
    [0.95, -0.48],
    [-0.95, 0.48],
    [0.95, 0.48],
  ])
    g.add(box(0.08, 0.42, 0.08, wood, x, 0.21, z));
  g.add(box(0.08, 1.0, 1.05, wood, -1.0, 0.5, 0)); // headboard
  return g;
}

export function makeBench() {
  const wood = L({ color: 0x4a3018, map: tex('wood', 5) });
  const g = new THREE.Group();
  g.add(box(2.0, 0.08, 0.56, wood, 0, 0.52, 0));
  for (const x of [-0.85, 0.85]) {
    g.add(box(0.08, 0.5, 0.5, wood, x, 0.25, 0));
  }
  g.add(box(1.7, 0.06, 0.06, wood, 0, 0.2, 0));
  return g;
}

export function makeCrate(locked) {
  const mat = L({ map: tex(locked ? 'lockedCrate' : 'crate', locked ? 10 : 9) });
  const g = new THREE.Group();
  const body = box(1.0, 0.86, 1.0, mat, 0, 0.43, 0);
  body.receiveShadow = true;
  g.add(body);
  const lidPivot = pivot(g, 0, 0.86, -0.5);
  lidPivot.add(box(1.02, 0.12, 1.02, mat, 0, 0.06, 0.5));
  if (locked) {
    const metal = L({ color: 0xb09030, emissive: 0x201000 });
    g.add(box(0.16, 0.18, 0.06, metal, 0, 0.72, 0.53));
    const sh = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.015, 4, 8, Math.PI), L({ color: 0x777777 }));
    sh.position.set(0, 0.81, 0.53);
    g.add(sh);
  }
  return { group: g, lid: lidPivot };
}

let goldGeo = null;
export function makeGold(value) {
  goldGeo ||= new THREE.CylinderGeometry(0.07, 0.07, 0.025, 8);
  const mat = L({ color: 0xffc23a, emissive: 0x4a3000 });
  const g = new THREE.Group();
  const n = Math.min(4 + Math.floor(value / 4), 12);
  for (let i = 0; i < n; i++) {
    const c = new THREE.Mesh(goldGeo, mat);
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() * 0.18;
    c.position.set(Math.cos(a) * r, 0.013 + (i % 4) * 0.025, Math.sin(a) * r);
    c.rotation.set((Math.random() - 0.5) * 0.4, 0, (Math.random() - 0.5) * 0.4);
    g.add(c);
  }
  const s = glowSprite(0xffaa22, 0.7, 0.35);
  s.position.y = 0.15;
  g.add(s);
  return g;
}

export function makeDiamond() {
  const g = new THREE.Group();
  const gem = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.26, 0),
    L({ color: 0x9fe8ff, emissive: 0x1a78c0, flatShading: true })
  );
  gem.scale.y = 1.5;
  gem.castShadow = false;
  g.add(gem);
  const s = glowSprite(0x44bbff, 2.0, 0.9);
  g.add(s);
  return { group: g, gem, glow: s };
}

export function makeAmmo() {
  const g = new THREE.Group();
  g.add(box(0.32, 0.16, 0.22, L({ color: 0x2c3a1c }), 0, 0.08, 0));
  const brass = L({ color: 0xc8a040, emissive: 0x201400 });
  for (let i = 0; i < 3; i++) {
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.1, 6), brass);
    b.position.set(-0.08 + i * 0.08, 0.2, 0);
    g.add(b);
  }
  const s = glowSprite(0xaa8833, 0.5, 0.25);
  s.position.y = 0.2;
  g.add(s);
  return g;
}

export function makeTorch() {
  const g = new THREE.Group();
  const iron = L({ color: 0x222222 });
  g.add(box(0.06, 0.06, 0.25, iron, 0, 1.95, 0.1));
  const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.45, 6), L({ color: 0x3a2410 }));
  stick.position.set(0, 2.1, 0.22);
  stick.rotation.x = 0.25;
  g.add(stick);
  const flame = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: tex('flame'), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  flame.scale.set(0.25, 0.45, 1);
  flame.position.set(0, 2.45, 0.28);
  g.add(flame);
  const glow = glowSprite(0xff8833, 1.6, 0.45);
  glow.position.copy(flame.position);
  g.add(glow);
  return { group: g, flame, glow };
}

export function makeBearTrap() {
  const g = new THREE.Group();
  const metal = L({ color: 0x5a5550, emissive: 0x0a0806 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.04, 8), metal);
  base.position.y = 0.02;
  g.add(base);
  const jaws = [];
  for (const s of [-1, 1]) {
    const p = pivot(g, 0, 0.03, 0);
    const arc = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.02, 4, 12, Math.PI), metal);
    arc.rotation.y = Math.PI / 2;
    arc.castShadow = true;
    p.add(arc);
    for (let i = 1; i < 8; i++) {
      const a = (i / 8) * Math.PI;
      const t = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.07, 4), metal);
      arc.add(t);
      // teeth live in the arc's local frame; point them toward the arc's center
      t.position.set(Math.cos(a) * 0.27, Math.sin(a) * 0.27, 0);
      t.rotation.set(0, 0, a + Math.PI / 2);
    }
    p.userData.side = s;
    jaws.push(p);
  }
  setBearTrapOpen(jaws, true);
  return { group: g, jaws };
}
export function setBearTrapOpen(jaws, open) {
  for (const p of jaws) p.rotation.z = open ? p.userData.side * (Math.PI / 2) : p.userData.side * 0.08;
}

export function makeSpikeField(count, size) {
  const geo = new THREE.ConeGeometry(0.07, 0.8, 4);
  const mat = L({ color: 0x6a5a50 });
  const inst = new THREE.InstancedMesh(geo, mat, count);
  const m = new THREE.Matrix4();
  for (let i = 0; i < count; i++) {
    const h = 0.6 + Math.random() * 0.6;
    m.compose(
      new THREE.Vector3((Math.random() - 0.5) * size, h * 0.4, (Math.random() - 0.5) * size),
      new THREE.Quaternion().setFromEuler(new THREE.Euler((Math.random() - 0.5) * 0.3, 0, (Math.random() - 0.5) * 0.3)),
      new THREE.Vector3(1, h, 1)
    );
    inst.setMatrixAt(i, m);
  }
  return inst;
}

export function makeGlass(rng) {
  const g = new THREE.Group();
  const mat = L({ color: 0xbfe0ee, emissive: 0x0d1a1f, transparent: true, opacity: 0.85, side: THREE.DoubleSide });
  for (let i = 0; i < 26; i++) {
    const s = new THREE.Shape();
    const r = 0.04 + rng.next() * 0.12;
    s.moveTo(0, 0);
    s.lineTo(r, rng.next() * r * 0.5);
    s.lineTo(rng.next() * r, r);
    const m = new THREE.Mesh(new THREE.ShapeGeometry(s), mat);
    m.rotation.set(-Math.PI / 2 + (rng.next() - 0.5) * 0.3, 0, rng.next() * 6.28);
    m.position.set((rng.next() - 0.5) * 2.6, 0.012, (rng.next() - 0.5) * 2.6);
    g.add(m);
  }
  // a broken bottle neck / frame shards for silhouette
  return g;
}

export function makeTripwire(width) {
  const g = new THREE.Group();
  const wire = new THREE.Mesh(
    new THREE.CylinderGeometry(0.008, 0.008, width, 4),
    L({ color: 0x9a9a8a, emissive: 0x111111 })
  );
  wire.rotation.z = Math.PI / 2;
  wire.position.y = 0.22;
  g.add(wire);
  for (const s of [-1, 1]) g.add(box(0.05, 0.3, 0.05, L({ color: 0x2a2018 }), (s * width) / 2, 0.15, 0));
  // spikes that shoot from both walls
  const spikes = new THREE.Group();
  const metal = L({ color: 0x7a7066 });
  for (const s of [-1, 1])
    for (let i = 0; i < 6; i++) {
      const c = new THREE.Mesh(new THREE.ConeGeometry(0.05, 1.2, 4), metal);
      c.rotation.z = (s * Math.PI) / 2;
      c.position.set(s * (width / 2 - 0.6), 0.5 + (i % 3) * 0.45, -0.3 + Math.floor(i / 3) * 0.6);
      c.userData.s = s;
      spikes.add(c);
    }
  spikes.visible = false;
  g.add(spikes);
  return { group: g, wire, spikes };
}

export function makeBlood(rng) {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    L({
      map: tex('blood', 13 + rng.int(0, 3)),
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
    })
  );
  m.rotation.x = -Math.PI / 2;
  return m;
}

export function makeBones(rng, skull) {
  const g = new THREE.Group();
  const bone = L({ color: 0xa89c84 });
  const n = skull ? 3 : 5;
  for (let i = 0; i < n; i++) {
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.35 + rng.next() * 0.2, 5), bone);
    b.rotation.set(Math.PI / 2, 0, rng.next() * 6.28);
    b.position.set((rng.next() - 0.5) * 0.6, 0.03, (rng.next() - 0.5) * 0.6);
    g.add(b);
  }
  if (skull) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.12, 7, 6), bone);
    s.position.y = 0.11;
    s.scale.set(1, 0.9, 1.15);
    g.add(s);
    const dark = B({ color: 0x050505 });
    for (const x of [-0.04, 0.04]) g.add(box(0.035, 0.035, 0.02, dark, x, 0.13, 0.13));
    g.add(box(0.12, 0.05, 0.1, bone, 0, 0.03, 0.05));
  }
  return g;
}

export function makeChain() {
  const g = new THREE.Group();
  const mat = L({ color: 0x3a3632 });
  const geo = new THREE.TorusGeometry(0.05, 0.012, 4, 8);
  const len = 6 + Math.floor(Math.random() * 8);
  for (let i = 0; i < len; i++) {
    const l = new THREE.Mesh(geo, mat);
    l.position.y = -i * 0.085;
    l.rotation.y = i % 2 ? Math.PI / 2 : 0;
    l.rotation.x = Math.PI / 2;
    l.rotation.z = 0;
    g.add(l);
  }
  const hook = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.015, 4, 8, Math.PI * 1.4), mat);
  hook.position.y = -len * 0.085 - 0.06;
  g.add(hook);
  return g;
}

export function makeShopkeeper() {
  const g = new THREE.Group();
  const robe = L({ color: 0x1a120e });
  const wood = L({ color: 0x4a2c16, map: tex('wood', 5) });
  const body = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.6, 10), robe);
  body.position.set(0, 0.8, -0.35);
  g.add(body);
  const hood = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 8), robe);
  hood.position.set(0, 1.65, -0.32);
  hood.scale.set(1, 1.2, 1);
  g.add(hood);
  const voidFace = new THREE.Mesh(new THREE.CircleGeometry(0.14, 10), B({ color: 0x000000 }));
  voidFace.position.set(0, 1.62, -0.1);
  g.add(voidFace);
  const eyes = [];
  for (const x of [-0.05, 0.05]) {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.014, 6, 4), B({ color: 0xffc070 }));
    e.position.set(x, 1.65, -0.08);
    g.add(e);
    eyes.push(e);
  }
  // counter
  g.add(box(1.8, 0.1, 0.7, wood, 0, 1.0, 0.2));
  g.add(box(1.7, 0.95, 0.08, wood, 0, 0.48, 0.5));
  for (const x of [-0.82, 0.82]) g.add(box(0.08, 0.95, 0.6, wood, x, 0.48, 0.2));
  // ledger & coins
  g.add(box(0.4, 0.05, 0.3, L({ color: 0x5a1010 }), -0.3, 1.08, 0.2));
  g.add(box(0.36, 0.01, 0.26, L({ color: 0xc8b890 }), -0.3, 1.11, 0.2));
  const coin = L({ color: 0xffc23a, emissive: 0x3a2200 });
  for (let i = 0; i < 5; i++) {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.02, 8), coin);
    c.position.set(0.35 + (i % 2) * 0.03, 1.07 + i * 0.02, 0.15);
    g.add(c);
  }
  const candle = makeCandle();
  candle.position.set(0.6, 1.05, 0.3);
  g.add(candle);
  return { group: g, eyes };
}

export function makeCandle() {
  const g = new THREE.Group();
  const c = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.2, 6), L({ color: 0xd8d0b0, emissive: 0x201a10 }));
  c.position.y = 0.1;
  g.add(c);
  const f = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: tex('flame'), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  f.scale.set(0.06, 0.12, 1);
  f.position.y = 0.25;
  g.add(f);
  const glow = glowSprite(0xffa040, 0.5, 0.4);
  glow.position.y = 0.25;
  g.add(glow);
  g.userData.flame = f;
  return g;
}

export function makeHatch() {
  const g = new THREE.Group();
  const iron = L({ color: 0x2a2a2a });
  const hole = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), B({ color: 0x000000 }));
  hole.rotation.x = -Math.PI / 2;
  hole.position.y = 0.01;
  g.add(hole);
  const glow = glowSprite(0xff3010, 2.2, 0.0);
  glow.position.y = 0.2;
  g.add(glow);
  for (const [x, z, w, d] of [
    [0, -0.8, 1.7, 0.1],
    [0, 0.8, 1.7, 0.1],
    [-0.8, 0, 0.1, 1.5],
    [0.8, 0, 0.1, 1.5],
  ])
    g.add(box(w, 0.06, d, iron, x, 0.03, z));
  const door = pivot(g, 0, 0.05, -0.75);
  door.add(box(1.5, 0.07, 1.5, L({ map: tex('hatch') }), 0, 0, 0.75));
  const chains = new THREE.Group();
  const chainMat = L({ color: 0x55504a });
  for (const r of [Math.PI / 4, -Math.PI / 4]) {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.0, 4), chainMat);
    c.rotation.set(Math.PI / 2, 0, 0);
    const p = new THREE.Group();
    p.rotation.y = r;
    p.position.y = 0.12;
    p.add(c);
    chains.add(p);
  }
  chains.add(box(0.2, 0.22, 0.1, L({ color: 0x8a7020, emissive: 0x1a1000 }), 0, 0.16, 0));
  g.add(chains);
  return { group: g, door, chains, glow };
}

export function makeDoorFrame(width) {
  const g = new THREE.Group();
  const wood = L({ color: 0x5a3a20, map: tex('wood', 5) });
  for (const s of [-1, 1]) g.add(box(0.25, 3.0, 0.4, wood, (s * width) / 2, 1.5, 0));
  g.add(box(width + 0.25, 0.3, 0.4, wood, 0, 3.0, 0));
  const door = pivot(g, -width / 2 + 0.1, 0, 0.1);
  door.add(box(width * 0.85, 2.85, 0.12, wood, (width * 0.85) / 2, 1.45, 0));
  door.rotation.y = -1.9;
  const rune = new THREE.Mesh(
    new THREE.PlaneGeometry(2.0, 2.0),
    B({ map: tex('rune'), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, color: 0x44ff99 })
  );
  rune.rotation.x = -Math.PI / 2;
  rune.position.y = 0.02;
  g.add(rune);
  return { group: g, rune };
}

// ---------------------------------------------------------------- View model

export function makeViewModel() {
  const g = new THREE.Group();
  // faint emissive so the hands read even outside the beam
  const metal = new THREE.MeshLambertMaterial({ color: 0x3a3a3e, emissive: 0x26262a });
  const grip = new THREE.MeshLambertMaterial({ color: 0x4a2a16, emissive: 0x2e1a0c });
  const skin = new THREE.MeshLambertMaterial({ color: 0x8a6a58, emissive: 0x3a2820 });
  const sleeveMat = new THREE.MeshLambertMaterial({ color: 0x1c1814, emissive: 0x141210 });
  // revolver (right hand)
  const gun = new THREE.Group();
  gun.add(box(0.045, 0.05, 0.32, metal, 0, 0.035, -0.2)); // barrel
  gun.add(box(0.012, 0.025, 0.02, metal, 0, 0.07, -0.34)); // front sight
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.1, 8), metal);
  drum.rotation.x = Math.PI / 2;
  drum.position.set(0, 0.0, -0.02);
  gun.add(drum);
  gun.add(box(0.05, 0.08, 0.1, metal, 0, 0.01, 0.06));
  const g2 = box(0.045, 0.15, 0.065, grip, 0, -0.08, 0.11);
  g2.rotation.x = 0.35;
  gun.add(g2);
  gun.add(box(0.075, 0.09, 0.12, skin, 0, -0.1, 0.14)); // hand
  gun.add(box(0.085, 0.085, 0.14, sleeveMat, 0, -0.12, 0.25)); // cuff
  gun.position.set(0.2, -0.2, -0.55);
  gun.scale.setScalar(0.65);
  g.add(gun);
  const flash = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: tex('glow'), color: 0xffcc66, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0 })
  );
  flash.scale.set(0.35, 0.35, 0.35);
  flash.position.set(0, 0.035, -0.42);
  gun.add(flash);
  // flashlight (left hand) — wide head pointing away from the camera
  const torch = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.24, 8), metal);
  body.rotation.x = Math.PI / 2;
  torch.add(body);
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.07, 8), metal);
  head.rotation.x = Math.PI / 2; // +y (narrow end) -> +z, wide end forward
  head.position.z = -0.15;
  torch.add(head);
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.044, 10), new THREE.MeshBasicMaterial({ color: 0xfff2cc }));
  lens.position.z = -0.187;
  lens.rotation.y = Math.PI; // face forward, hidden from the player's own view
  torch.add(lens);
  torch.add(box(0.07, 0.08, 0.1, skin, 0, -0.03, 0.06));
  torch.add(box(0.08, 0.08, 0.12, sleeveMat, 0, -0.05, 0.17));
  torch.position.set(-0.22, -0.22, -0.5);
  torch.scale.setScalar(0.65);
  g.add(torch);
  g.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = false;
      o.renderOrder = 10;
    }
  });
  return { group: g, gun, torch, flash, lens };
}
