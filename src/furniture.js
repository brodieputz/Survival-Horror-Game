// Furniture and clutter that make a building's rooms look lived in: living
// rooms, kitchens, bedrooms, bathrooms, offices, wards, cells, barracks,
// shop aisles and warehouse racking. Every piece stands on the floor with its
// back to -z and its front facing +z; FURN gives its footprint so the
// generator can lay rooms out. Materials are shared, so a whole floor's
// furniture merges down to a handful of draw calls.
import * as THREE from 'three';
import { tex } from './textures.js';
import { box } from './models.js';

const mats = new Map();
function M(key, make) {
  if (!mats.has(key)) mats.set(key, make());
  return mats.get(key);
}
const std = (o) => new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0, ...o });
const C = (hex, rough = 0.85, metal = 0) => M(`c${hex}:${rough}:${metal}`, () => std({ color: hex, roughness: rough, metalness: metal }));
const T = (name, seed, color = 0xffffff, rough = 0.85) => M(`t${name}:${seed}:${color}`, () => std({ map: tex(name, seed), color, roughness: rough }));
const wood = () => T('wood', 5, 0x8a6a4a, 0.7);
const darkWood = () => T('wood', 5, 0x4a3020, 0.65);
const fabric = (hex) => M(`f${hex}`, () => std({ map: tex('fabric', 40), color: hex, roughness: 0.95 }));
const metal = () => C(0x8a8e92, 0.4, 0.6);
const chrome = () => C(0xc8ccd0, 0.25, 0.9);
const white = () => C(0xe0ddd4, 0.45);
const black = () => C(0x16181a, 0.5);
const screen = () => M('screen', () => std({ color: 0x0a0e12, roughness: 0.15, metalness: 0.3 }));

function cyl(rt, rb, h, mat, x, y, z, seg = 10) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  return m;
}
const legs4 = (g, w, d, h, mat, t = 0.05, inset = 0.05) => {
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) g.add(box(t, h, t, mat, sx * (w / 2 - inset), h / 2, sz * (d / 2 - inset)));
};

// ---------------------------------------------------------------- living
function sofa(rng) {
  const g = new THREE.Group();
  const f = fabric(rng.pick([0x6a4a3a, 0x3a4a5a, 0x5a5a4a, 0x7a3a2a, 0x4a5a3a]));
  g.add(box(2.1, 0.42, 0.9, f, 0, 0.29, 0));
  g.add(box(2.1, 0.5, 0.22, f, 0, 0.72, -0.34));
  for (const s of [-1, 1]) g.add(box(0.2, 0.62, 0.9, f, s * 0.95, 0.31, 0));
  for (let i = -1; i <= 1; i += 2) g.add(box(0.82, 0.14, 0.66, f, i * 0.43, 0.56, 0.08)); // cushions
  if (rng.chance(0.5)) g.add(box(0.4, 0.34, 0.12, fabric(0xc8b890), rng.range(-0.6, 0.6), 0.74, -0.18).rotateZ(0.3)); // a throw pillow
  return g;
}
function armchair(rng) {
  const g = new THREE.Group();
  const f = fabric(rng.pick([0x6a4a3a, 0x3a4a5a, 0x7a6a4a]));
  g.add(box(0.9, 0.42, 0.85, f, 0, 0.29, 0));
  g.add(box(0.9, 0.55, 0.2, f, 0, 0.75, -0.33));
  for (const s of [-1, 1]) g.add(box(0.16, 0.6, 0.85, f, s * 0.37, 0.3, 0));
  return g;
}
function coffeeTable() {
  const g = new THREE.Group();
  g.add(box(1.1, 0.06, 0.6, wood(), 0, 0.42, 0));
  legs4(g, 1.1, 0.6, 0.4, wood());
  g.add(box(0.3, 0.03, 0.22, T('poster', 108), -0.2, 0.46, 0.05)); // a magazine
  return g;
}
function tvStand(rng) {
  const g = new THREE.Group();
  g.add(box(1.6, 0.5, 0.45, darkWood(), 0, 0.25, 0));
  const tvW = rng.range(0.9, 1.3);
  g.add(box(tvW, tvW * 0.58, 0.06, black(), 0, 0.5 + tvW * 0.3 + 0.08, -0.05));
  g.add(box(tvW - 0.06, tvW * 0.58 - 0.06, 0.01, screen(), 0, 0.5 + tvW * 0.3 + 0.08, -0.015));
  g.add(box(0.3, 0.08, 0.2, black(), 0, 0.54, -0.05));
  return g;
}
function bookshelf(rng) {
  const g = new THREE.Group();
  const w = darkWood();
  g.add(box(1.0, 1.9, 0.04, w, 0, 0.95, -0.15));
  for (const s of [-1, 1]) g.add(box(0.04, 1.9, 0.34, w, s * 0.48, 0.95, 0));
  for (let i = 0; i < 5; i++) {
    g.add(box(0.96, 0.03, 0.32, w, 0, 0.05 + i * 0.44, 0));
    if (i < 4 && rng.chance(0.85)) g.add(box(0.9, 0.3, 0.24, T('books', 106 + i), 0, 0.22 + i * 0.44, 0.02));
  }
  return g;
}
function floorLamp() {
  const g = new THREE.Group();
  g.add(cyl(0.16, 0.18, 0.03, black(), 0, 0.015, 0));
  g.add(cyl(0.015, 0.015, 1.5, chrome(), 0, 0.77, 0));
  g.add(cyl(0.14, 0.22, 0.28, C(0xd8c8a0, 0.9), 0, 1.6, 0, 12));
  return g;
}
function sideTable(rng) {
  const g = new THREE.Group();
  g.add(box(0.5, 0.05, 0.45, wood(), 0, 0.58, 0));
  legs4(g, 0.5, 0.45, 0.56, wood(), 0.04);
  if (rng.chance(0.6)) {
    g.add(cyl(0.08, 0.1, 0.22, C(0x8a6a4a), 0, 0.72, 0));
    g.add(cyl(0.1, 0.16, 0.18, C(0xd8c8a0, 0.9), 0, 0.92, 0, 12));
  }
  return g;
}
function fireplace() {
  const g = new THREE.Group();
  const brick = T('brick', 3, 0xc8a090);
  g.add(box(1.7, 1.15, 0.45, brick, 0, 0.575, 0));
  g.add(box(0.9, 0.7, 0.05, C(0x0a0806, 1), 0, 0.4, 0.21));
  g.add(box(1.9, 0.08, 0.55, darkWood(), 0, 1.19, 0.02));
  g.add(box(0.3, 0.22, 0.03, T('painting', 107), -0.5, 1.34, -0.05)); // framed photo on the mantel
  return g;
}
function plant(rng) {
  const g = new THREE.Group();
  g.add(cyl(0.2, 0.15, 0.4, C(0x8a4a2a), 0, 0.2, 0));
  const dead = C(0x5a4a2a, 0.95);
  for (let i = 0; i < 6; i++) {
    const s = box(0.04, rng.range(0.4, 0.9), 0.04, dead, rng.range(-0.08, 0.08), 0.6, rng.range(-0.08, 0.08));
    s.rotation.set(rng.range(-0.6, 0.6), 0, rng.range(-0.6, 0.6));
    g.add(s);
  }
  return g;
}

// ---------------------------------------------------------------- kitchen
function counter(rng, w = 2.6) {
  const g = new THREE.Group();
  const cab = rng.chance(0.5) ? C(0xe0d8c4, 0.6) : wood();
  g.add(box(w, 0.86, 0.6, cab, 0, 0.43, 0));
  g.add(box(w + 0.04, 0.05, 0.64, T('concreteSlab', 86, 0xb8b0a0, 0.5), 0, 0.885, 0.01));
  for (let x = -w / 2 + 0.3; x < w / 2 - 0.1; x += 0.6) g.add(box(0.02, 0.6, 0.01, C(0x2a2420), x, 0.45, 0.305));
  // a sink
  g.add(box(0.6, 0.02, 0.4, chrome(), -w / 4, 0.915, 0.02));
  g.add(cyl(0.015, 0.015, 0.25, chrome(), -w / 4, 1.03, -0.2));
  // wall cabinets
  g.add(box(w, 0.7, 0.35, cab, 0, 1.85, -0.125));
  // clutter: a kettle, dishes, cans
  g.add(cyl(0.08, 0.09, 0.2, C(0xb83a2a, 0.4), w / 4, 1.01, 0));
  for (let i = 0; i < 3; i++) if (rng.chance(0.5)) g.add(cyl(0.04, 0.04, 0.11, C(rng.pick([0xc8a040, 0x8a2a1a, 0x2a5a8a]), 0.4, 0.5), rng.range(0, w / 2 - 0.2), 0.965, rng.range(-0.1, 0.15)));
  return g;
}
function stove() {
  const g = new THREE.Group();
  g.add(box(0.76, 0.9, 0.62, white(), 0, 0.45, 0));
  g.add(box(0.6, 0.4, 0.01, black(), 0, 0.4, 0.31));
  for (const [x, z] of [
    [-0.18, -0.13],
    [0.18, -0.13],
    [-0.18, 0.13],
    [0.18, 0.13],
  ])
    g.add(cyl(0.09, 0.09, 0.02, black(), x, 0.91, z, 12));
  g.add(box(0.76, 0.18, 0.06, white(), 0, 1.0, -0.28));
  g.add(cyl(0.12, 0.12, 0.12, metal(), 0.18, 0.98, 0.13, 12)); // a pot left on the hob
  return g;
}
function diningTable(rng, chairs = 4) {
  const g = new THREE.Group();
  const w = chairs > 4 ? 1.9 : 1.3;
  g.add(box(w, 0.06, 0.95, wood(), 0, 0.75, 0));
  legs4(g, w, 0.95, 0.73, wood(), 0.07);
  const per = chairs / 2;
  for (let i = 0; i < per; i++)
    for (const s of [-1, 1]) {
      const c = chair(rng, darkWood());
      c.position.set((i - (per - 1) / 2) * (w / per), 0, s * 0.62);
      c.rotation.y = s > 0 ? Math.PI : 0;
      if (rng.chance(0.15)) {
        c.rotation.z = Math.PI / 2; // knocked over
        c.position.y = 0.22;
        c.position.z += s * 0.35;
      } else c.rotation.y += rng.range(-0.3, 0.3);
      g.add(c);
    }
  if (rng.chance(0.6)) g.add(cyl(0.12, 0.1, 0.03, white(), rng.range(-0.3, 0.3), 0.795, rng.range(-0.2, 0.2), 14)); // a plate
  return g;
}
function chair(rng, mat) {
  const g = new THREE.Group();
  g.add(box(0.44, 0.05, 0.44, mat, 0, 0.46, 0));
  legs4(g, 0.44, 0.44, 0.45, mat, 0.04, 0.03);
  g.add(box(0.44, 0.5, 0.04, mat, 0, 0.72, 0.2));
  return g;
}
function trashCan() {
  const g = new THREE.Group();
  g.add(cyl(0.2, 0.17, 0.62, C(0x5a5e5a, 0.5, 0.4), 0, 0.31, 0, 12));
  g.add(cyl(0.21, 0.21, 0.04, C(0x4a4e4a, 0.5, 0.4), 0, 0.64, 0, 12));
  return g;
}

// ---------------------------------------------------------------- bedroom
function bed(rng, double = true) {
  const g = new THREE.Group();
  const w = double ? 1.55 : 1.0;
  const fr = rng.chance(0.5) ? darkWood() : wood();
  g.add(box(w, 0.3, 2.05, fr, 0, 0.2, 0));
  g.add(box(w - 0.06, 0.22, 1.95, C(0xd8d0c0, 0.95), 0, 0.46, 0.02));
  g.add(box(w - 0.04, 0.1, 1.3, fabric(rng.pick([0x3a4a6a, 0x6a3a3a, 0x5a6a4a, 0x8a7a5a, 0x4a3a5a])), 0, 0.6, 0.3).rotateX(rng.range(-0.04, 0.04)));
  for (let i = 0; i < (double ? 2 : 1); i++) g.add(box(0.55, 0.13, 0.36, C(0xe8e4d8, 0.95), double ? (i - 0.5) * 0.7 : 0, 0.64, -0.75));
  g.add(box(w + 0.06, 1.05, 0.08, fr, 0, 0.52, -1.03)); // headboard
  if (rng.chance(0.25)) g.add(box(0.5, 0.02, 0.4, C(0x3a0000, 0.4), rng.range(-0.3, 0.3), 0.66, rng.range(0, 0.6))); // a stain
  return g;
}
function dresser(rng) {
  const g = new THREE.Group();
  const w = darkWood();
  g.add(box(1.2, 0.85, 0.5, w, 0, 0.425, 0));
  for (let i = 0; i < 3; i++) {
    g.add(box(1.12, 0.01, 0.01, C(0x1a120a), 0, 0.27 + i * 0.26, 0.255));
    for (const s of [-1, 1]) g.add(box(0.1, 0.03, 0.03, chrome(), s * 0.3, 0.17 + i * 0.26, 0.26));
  }
  if (rng.chance(0.6)) g.add(box(0.6, 0.75, 0.03, C(0x9aa8b0, 0.1, 0.8), 0, 1.25, -0.22)); // a mirror
  if (rng.chance(0.5)) g.add(box(0.2, 0.25, 0.03, T('painting', 106), 0.4, 0.98, -0.1).rotateX(-0.2));
  return g;
}
function nightstand(rng) {
  const g = new THREE.Group();
  g.add(box(0.45, 0.55, 0.4, darkWood(), 0, 0.275, 0));
  if (rng.chance(0.7)) {
    g.add(cyl(0.06, 0.08, 0.2, C(0xa08060), 0, 0.65, 0));
    g.add(cyl(0.09, 0.14, 0.16, C(0xe0d0b0, 0.9), 0, 0.83, 0, 12));
  }
  if (rng.chance(0.4)) g.add(box(0.14, 0.04, 0.2, T('books', 107), 0.1, 0.57, 0.05));
  return g;
}
function deskChair(rng) {
  const g = new THREE.Group();
  g.add(cyl(0.28, 0.28, 0.04, black(), 0, 0.06, 0, 5));
  g.add(cyl(0.03, 0.03, 0.4, chrome(), 0, 0.28, 0));
  g.add(box(0.5, 0.08, 0.48, fabric(0x2a2a30), 0, 0.5, 0));
  g.add(box(0.48, 0.55, 0.06, fabric(0x2a2a30), 0, 0.82, 0.22));
  g.rotation.y = rng.range(-0.6, 0.6);
  return g;
}
function desk(rng, computer = true) {
  const g = new THREE.Group();
  const top = rng.chance(0.5) ? wood() : C(0x8a8478, 0.6);
  g.add(box(1.5, 0.05, 0.75, top, 0, 0.75, 0));
  g.add(box(0.45, 0.72, 0.7, top, 0.5, 0.36, 0));
  for (const s of [-1, 1]) g.add(box(0.04, 0.72, 0.7, top, -0.7, 0.36, s * 0.3));
  if (computer) {
    g.add(box(0.55, 0.36, 0.04, black(), -0.1, 1.0, -0.2));
    g.add(box(0.5, 0.3, 0.01, screen(), -0.1, 1.0, -0.178));
    g.add(box(0.12, 0.2, 0.12, black(), -0.1, 0.87, -0.22));
    g.add(box(0.45, 0.02, 0.15, black(), -0.1, 0.785, 0.05));
  }
  for (let i = 0; i < 3; i++) if (rng.chance(0.5)) g.add(box(0.22, 0.005, 0.3, white(), rng.range(-0.6, 0.6), 0.78 + i * 0.006, rng.range(-0.2, 0.25)).rotateY(rng.range(-0.5, 0.5))); // papers
  const ch = deskChair(rng);
  ch.position.set(-0.1, 0, 0.6);
  g.add(ch);
  return g;
}
function wardrobeSmall() {
  const g = new THREE.Group();
  g.add(box(1.0, 1.9, 0.55, darkWood(), 0, 0.95, 0));
  g.add(box(0.01, 1.7, 0.01, C(0x1a120a), 0, 0.95, 0.28));
  return g;
}
function toyBox(rng) {
  const g = new THREE.Group();
  g.add(box(0.8, 0.45, 0.45, C(rng.pick([0x3a6aa8, 0xc83a2a, 0xe0b030])), 0, 0.225, 0));
  // a teddy bear sat on the lid
  const fur = C(0x8a5a30, 1);
  g.add(cyl(0.11, 0.13, 0.22, fur, 0, 0.56, 0));
  g.add(cyl(0.09, 0.09, 0.14, fur, 0, 0.73, 0.02));
  return g;
}

// ---------------------------------------------------------------- bathroom
function toilet() {
  const g = new THREE.Group();
  const p = C(0xe8e8e0, 0.25);
  g.add(cyl(0.18, 0.14, 0.4, p, 0, 0.2, 0.08, 14));
  g.add(cyl(0.2, 0.2, 0.04, p, 0, 0.42, 0.08, 14));
  g.add(box(0.42, 0.38, 0.18, p, 0, 0.62, -0.2));
  return g;
}
function bathtub() {
  const g = new THREE.Group();
  const p = C(0xe0e0d8, 0.25);
  g.add(box(1.7, 0.55, 0.75, p, 0, 0.275, 0));
  g.add(box(1.55, 0.06, 0.6, C(0x2a2018, 0.3), 0, 0.53, 0)); // grime inside
  g.add(cyl(0.015, 0.015, 0.3, chrome(), -0.7, 0.7, -0.3));
  return g;
}
function vanity(rng) {
  const g = new THREE.Group();
  g.add(box(0.8, 0.82, 0.5, white(), 0, 0.41, 0));
  g.add(box(0.5, 0.04, 0.36, C(0xe8e8e0, 0.25), 0, 0.85, 0.02));
  g.add(box(0.6, 0.8, 0.03, C(0x9aa8b0, 0.1, 0.8), 0, 1.45, -0.23));
  if (rng.chance(0.5)) g.add(box(0.16, 0.6, 0.02, C(0x0a0a0a, 0.1, 0.8), 0.1, 1.45, -0.21).rotateZ(0.6)); // a crack
  return g;
}
function washer() {
  const g = new THREE.Group();
  g.add(box(0.65, 0.88, 0.62, white(), 0, 0.44, 0));
  g.add(cyl(0.2, 0.2, 0.02, C(0x3a4048, 0.15, 0.5), 0, 0.46, 0.31, 18).rotateX(Math.PI / 2));
  return g;
}

// ---------------------------------------------------------------- offices
function cubicles(rng) {
  // four desks facing out from a cross of partitions
  const g = new THREE.Group();
  const panel = T('cubicle', 107 + (rng.int(0, 2)));
  g.add(box(2.9, 1.3, 0.05, panel, 0, 0.65, 0));
  g.add(box(0.05, 1.3, 2.9, panel, 0, 0.65, 0));
  for (const sx of [-1, 1])
    for (const sz of [-1, 1]) {
      g.add(box(0.05, 1.3, 1.45, panel, sx * 1.45, 0.65, sz * 0.72));
      const top = C(0x9a948a, 0.6);
      g.add(box(1.3, 0.04, 0.65, top, sx * 0.72, 0.74, sz * 0.36));
      g.add(box(0.45, 0.3, 0.03, black(), sx * 0.72, 0.95, sz * 0.12));
      g.add(box(0.41, 0.26, 0.01, screen(), sx * 0.72, 0.95, sz * 0.12 + sz * 0.018));
      if (rng.chance(0.7)) {
        const ch = deskChair(rng);
        ch.position.set(sx * 0.72 + rng.range(-0.2, 0.2), 0, sz * 1.0);
        ch.rotation.y = sz > 0 ? rng.range(-0.6, 0.6) : Math.PI + rng.range(-0.6, 0.6);
        g.add(ch);
      }
    }
  return g;
}
function conferenceTable(rng) {
  const g = new THREE.Group();
  g.add(box(2.6, 0.07, 1.1, darkWood(), 0, 0.75, 0));
  for (const s of [-1, 1]) g.add(box(0.3, 0.72, 0.6, darkWood(), s * 0.9, 0.36, 0));
  for (let i = 0; i < 3; i++)
    for (const s of [-1, 1]) {
      const ch = deskChair(rng);
      ch.position.set((i - 1) * 0.8, 0, s * 0.85);
      ch.rotation.y = (s > 0 ? 0 : Math.PI) + rng.range(-0.5, 0.5);
      g.add(ch);
    }
  return g;
}
function copier() {
  const g = new THREE.Group();
  g.add(box(1.0, 1.0, 0.65, C(0xd0ccc4, 0.5), 0, 0.5, 0));
  g.add(box(0.8, 0.08, 0.5, C(0x3a3e44, 0.4), 0, 1.04, 0));
  return g;
}
function waterCooler() {
  const g = new THREE.Group();
  g.add(box(0.36, 1.0, 0.36, white(), 0, 0.5, 0));
  g.add(cyl(0.15, 0.15, 0.45, C(0x7aa8c8, 0.1), 0, 1.23, 0));
  return g;
}
function filing() {
  const g = new THREE.Group();
  g.add(box(0.48, 1.32, 0.62, C(0x6a6e70, 0.5, 0.4), 0, 0.66, 0));
  for (let i = 0; i < 4; i++) g.add(box(0.12, 0.03, 0.03, chrome(), 0, 0.2 + i * 0.32, 0.32));
  return g;
}
function receptionDesk(rng) {
  const g = new THREE.Group();
  g.add(box(2.8, 1.1, 0.7, T('wood', 5, 0x6a5040, 0.5), 0, 0.55, 0));
  g.add(box(3.0, 0.06, 0.85, C(0x2a2a2a, 0.3, 0.3), 0, 1.13, 0.05));
  g.add(box(0.5, 0.33, 0.04, black(), 0.5, 1.33, -0.2));
  if (rng.chance(0.5)) g.add(box(0.3, 0.12, 0.2, black(), -0.6, 1.2, -0.1)); // a phone
  return g;
}
function execDesk(rng) {
  const g = new THREE.Group();
  g.add(box(2.0, 0.08, 0.95, darkWood(), 0, 0.76, 0));
  g.add(box(1.9, 0.72, 0.85, darkWood(), 0, 0.36, -0.03));
  g.add(box(0.6, 0.38, 0.04, black(), 0.3, 1.02, -0.3));
  const ch = deskChair(rng);
  ch.scale.setScalar(1.15);
  ch.position.set(0, 0, -0.95 + 1.7);
  ch.rotation.y = Math.PI + rng.range(-0.5, 0.5);
  g.add(ch);
  return g;
}
function elevators() {
  const g = new THREE.Group();
  const steel = C(0x9aa0a6, 0.3, 0.85);
  for (const s of [-1, 1]) {
    g.add(box(1.1, 2.2, 0.06, steel, s * 0.7, 1.1, 0));
    g.add(box(0.01, 2.2, 0.07, C(0x2a2e32), s * 0.7, 1.1, 0));
    g.add(box(1.3, 0.12, 0.1, C(0x3a3e42, 0.4, 0.6), s * 0.7, 2.3, 0));
  }
  g.add(box(0.12, 0.24, 0.04, C(0x2a2e32), 0, 1.2, 0.02));
  return g;
}
function whiteboard() {
  const g = new THREE.Group();
  g.add(box(2.0, 1.1, 0.04, C(0xf0f0ec, 0.2), 0, 1.5, 0));
  g.add(box(2.05, 0.04, 0.08, chrome(), 0, 0.93, 0.03));
  g.add(box(1.0, 0.03, 0.005, C(0x2a4a8a), -0.3, 1.7, 0.025).rotateZ(0.1));
  g.add(box(0.7, 0.03, 0.005, C(0xa02a1a), 0.2, 1.4, 0.025));
  return g;
}

// ---------------------------------------------------------------- hospital
function hospitalBed(rng) {
  const g = new THREE.Group();
  const frame = C(0xc8ccc8, 0.4, 0.5);
  g.add(box(1.0, 0.1, 2.05, frame, 0, 0.55, 0));
  g.add(box(0.94, 0.16, 1.95, C(0xc8d0d0, 0.9), 0, 0.68, 0));
  g.add(box(0.96, 0.08, 1.2, C(0x8aa0b0, 0.95), 0, 0.8, 0.3));
  legs4(g, 1.0, 2.0, 0.5, chrome(), 0.04);
  g.add(box(1.04, 0.7, 0.05, frame, 0, 0.85, -1.02));
  g.add(box(1.04, 0.4, 0.05, frame, 0, 0.75, 1.02));
  if (rng.chance(0.4)) g.add(box(0.5, 0.02, 0.6, C(0x3a0000, 0.4), 0.1, 0.85, 0.2));
  // IV stand
  g.add(cyl(0.012, 0.012, 1.8, chrome(), 0.65, 0.9, -0.7));
  g.add(box(0.12, 0.18, 0.04, C(0xd0e0e8, 0.2), 0.65, 1.7, -0.7));
  return g;
}
function curtain(rng) {
  const g = new THREE.Group();
  const cloth = M('curtain', () => std({ color: 0x8aa8a0, roughness: 0.95, side: THREE.DoubleSide }));
  g.add(cyl(0.015, 0.015, 2.4, chrome(), 0, 2.7, 0).rotateZ(Math.PI / 2));
  const c = new THREE.Mesh(new THREE.PlaneGeometry(rng.range(0.8, 2.2), 2.4), cloth);
  c.position.set(rng.range(-0.4, 0.4), 1.45, 0);
  g.add(c);
  return g;
}
function gurney(rng) {
  const g = new THREE.Group();
  g.add(box(0.7, 0.08, 1.9, chrome(), 0, 0.82, 0));
  g.add(box(0.66, 0.1, 1.8, C(0x3a4a5a, 0.8), 0, 0.9, 0));
  legs4(g, 0.7, 1.9, 0.8, chrome(), 0.03);
  if (rng.chance(0.5)) g.add(box(0.7, 0.18, 1.7, C(0xb8b8b0, 0.95), 0, 1.02, 0)); // a sheet over something
  g.rotation.y = rng.range(-0.4, 0.4);
  return g;
}
function medCart() {
  const g = new THREE.Group();
  g.add(box(0.6, 0.9, 0.45, C(0xd84030, 0.5), 0, 0.5, 0));
  for (let i = 0; i < 4; i++) g.add(box(0.5, 0.01, 0.01, C(0x2a1a14), 0, 0.25 + i * 0.18, 0.23));
  g.add(box(0.6, 0.03, 0.45, chrome(), 0, 0.97, 0));
  return g;
}
function waitingChairs(rng) {
  const g = new THREE.Group();
  const seat = C(rng.pick([0x2a4a6a, 0x6a2a2a, 0x3a3a3a]), 0.6);
  g.add(box(2.4, 0.05, 0.08, chrome(), 0, 0.3, 0));
  for (let i = 0; i < 4; i++) {
    g.add(box(0.52, 0.06, 0.5, seat, (i - 1.5) * 0.58, 0.45, 0));
    g.add(box(0.52, 0.45, 0.05, seat, (i - 1.5) * 0.58, 0.72, -0.24));
  }
  for (const s of [-1, 1]) g.add(box(0.05, 0.42, 0.4, chrome(), s * 1.1, 0.21, 0));
  return g;
}
function wheelchair() {
  const g = new THREE.Group();
  for (const s of [-1, 1]) g.add(cyl(0.3, 0.3, 0.03, black(), s * 0.3, 0.3, 0, 16).rotateZ(Math.PI / 2));
  g.add(box(0.5, 0.05, 0.45, C(0x2a2a30), 0, 0.5, 0));
  g.add(box(0.5, 0.45, 0.04, C(0x2a2a30), 0, 0.78, -0.22));
  return g;
}

// ---------------------------------------------------------------- police / military
function bars(width = 2.8) {
  const g = new THREE.Group();
  const m = C(0x4a4e50, 0.4, 0.8);
  for (let x = -width / 2 + 0.06; x <= width / 2; x += 0.14) g.add(cyl(0.018, 0.018, 3.4, m, x, 1.7, 0, 6));
  for (const y of [0.05, 1.2, 3.35]) g.add(box(width, 0.06, 0.05, m, 0, y, 0));
  return g;
}
// a run of cell bars with its barred door swung open
function cellBars() {
  const g = new THREE.Group();
  const m = C(0x4a4e50, 0.4, 0.8);
  const run = (a, b) => {
    for (let x = a; x <= b + 1e-3; x += 0.14) g.add(cyl(0.018, 0.018, 3.5, m, x, 1.75, 0, 6));
    for (const y of [0.05, 1.1, 3.45]) g.add(box(b - a + 0.04, 0.06, 0.05, m, (a + b) / 2, y, 0));
  };
  run(-1.45, 0.35);
  run(1.35, 1.45);
  // the door, open against the bars
  const door = new THREE.Group();
  for (let x = 0; x <= 0.95; x += 0.14) door.add(cyl(0.016, 0.016, 2.2, m, x, 1.15, 0, 6));
  for (const y of [0.1, 1.15, 2.2]) door.add(box(0.98, 0.05, 0.05, m, 0.48, y, 0));
  door.position.set(0.38, 0, 0.05);
  door.rotation.y = -2.2;
  g.add(door);
  return g;
}
function cellBunk() {
  const g = new THREE.Group();
  g.add(box(0.8, 0.06, 1.9, C(0x5a5e60, 0.5, 0.6), 0, 0.45, 0));
  g.add(box(0.72, 0.08, 1.8, C(0x5a6a4a, 0.95), 0, 0.52, 0));
  for (const s of [-1, 1]) g.add(box(0.04, 0.45, 0.04, C(0x5a5e60), 0.36, 0.22, s * 0.9));
  return g;
}
function bunk(rng) {
  const g = new THREE.Group();
  const f = C(0x3a4030, 0.5, 0.5);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) g.add(box(0.05, 1.75, 0.05, f, sx * 0.45, 0.875, sz * 0.97));
  for (const y of [0.4, 1.4]) {
    g.add(box(0.95, 0.06, 2.0, f, 0, y, 0));
    g.add(box(0.85, 0.12, 1.9, C(0x4a5a3a, 0.95), 0, y + 0.08, 0));
    if (rng.chance(0.7)) g.add(box(0.85, 0.06, 1.2, C(0x2e3a26, 0.95), 0, y + 0.17, 0.3));
  }
  return g;
}
function messTable(rng) {
  const g = new THREE.Group();
  g.add(box(2.4, 0.05, 0.85, C(0x8a8a80, 0.5, 0.3), 0, 0.75, 0));
  legs4(g, 2.4, 0.85, 0.73, metal(), 0.05);
  for (const s of [-1, 1]) {
    g.add(box(2.4, 0.05, 0.3, C(0x8a8a80, 0.5, 0.3), 0, 0.45, s * 0.65));
    legs4(g, 2.4, 0.3, 0.43, metal(), 0.04, 0.1);
  }
  for (let i = 0; i < 4; i++) if (rng.chance(0.5)) g.add(box(0.35, 0.03, 0.25, C(0x9a9e9a, 0.4, 0.6), rng.range(-1, 1), 0.79, rng.range(-0.25, 0.25)));
  return g;
}
function gunRack() {
  const g = new THREE.Group();
  g.add(box(1.4, 1.6, 0.12, darkWood(), 0, 1.1, -0.1));
  for (let i = 0; i < 4; i++) {
    g.add(box(0.06, 1.1, 0.08, black(), -0.5 + i * 0.33, 1.1, 0.0).rotateZ(0.05));
  }
  return g;
}
function mapTable(rng) {
  const g = new THREE.Group();
  g.add(box(2.0, 0.06, 1.3, C(0x5a5a4a, 0.6), 0, 0.92, 0));
  legs4(g, 2.0, 1.3, 0.9, metal(), 0.06);
  g.add(box(1.8, 0.005, 1.1, T('mapPaper', 38), 0, 0.955, 0).rotateY(rng.range(-0.1, 0.1)));
  return g;
}
function radioDesk() {
  const g = new THREE.Group();
  g.add(box(1.4, 0.05, 0.7, C(0x4a4e44, 0.6), 0, 0.75, 0));
  legs4(g, 1.4, 0.7, 0.73, metal(), 0.05);
  g.add(box(0.8, 0.35, 0.4, C(0x3a4030, 0.5, 0.4), 0, 0.95, -0.1));
  for (let i = 0; i < 5; i++) g.add(cyl(0.025, 0.025, 0.02, black(), -0.3 + i * 0.15, 0.98, 0.11, 8).rotateX(Math.PI / 2));
  g.add(cyl(0.008, 0.008, 0.8, chrome(), 0.35, 1.5, -0.2));
  return g;
}
function lockerRow() {
  const g = new THREE.Group();
  const m = C(0x5a6a72, 0.45, 0.5);
  for (let i = 0; i < 4; i++) {
    g.add(box(0.5, 1.9, 0.5, m, (i - 1.5) * 0.52, 0.95, 0));
    for (let k = 0; k < 3; k++) g.add(box(0.3, 0.02, 0.01, C(0x2a3034), (i - 1.5) * 0.52, 1.6 + k * 0.06, 0.255));
  }
  return g;
}

// ---------------------------------------------------------------- shops / warehouses
function gondola(rng) {
  // a double-sided shop aisle with what's left on it
  const g = new THREE.Group();
  const m = C(0xd8d4cc, 0.5, 0.3);
  g.add(box(2.6, 1.5, 0.08, m, 0, 0.75, 0));
  g.add(box(2.6, 0.12, 0.9, m, 0, 0.06, 0));
  for (let k = 0; k < 4; k++) {
    g.add(box(2.6, 0.03, 0.88, m, 0, 0.35 + k * 0.36, 0));
    for (const s of [-1, 1])
      for (let i = 0; i < 9; i++) {
        if (rng.chance(0.55)) continue; // looted
        g.add(box(0.2, rng.range(0.12, 0.28), 0.3, C(rng.pick([0xc83a2a, 0x2a6ab8, 0xe0c040, 0x3a8a3a, 0xe8e4d8, 0x8a4a2a]), 0.6), -1.15 + i * 0.29, 0.45 + k * 0.36, s * 0.24));
      }
  }
  return g;
}
function drinkCooler(rng) {
  const g = new THREE.Group();
  g.add(box(2.4, 2.1, 0.75, C(0x2a2e34, 0.4, 0.4), 0, 1.05, 0));
  const glass = M('coolerGlass', () => std({ color: 0x8ab0c0, roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.35 }));
  for (let i = 0; i < 3; i++) {
    g.add(box(0.74, 1.8, 0.02, glass, -0.8 + i * 0.8, 1.05, 0.38));
    for (let k = 0; k < 4; k++)
      for (let j = 0; j < 5; j++) if (rng.chance(0.35)) g.add(cyl(0.035, 0.035, 0.22, C(rng.pick([0xb8261a, 0x2a6a2a, 0xe0d040, 0x1a3a8a])), -1.05 + i * 0.8 + j * 0.13, 0.4 + k * 0.42, 0.2, 8));
  }
  return g;
}
function checkout() {
  const g = new THREE.Group();
  g.add(box(2.2, 0.95, 0.75, C(0x8a2a1a, 0.6), 0, 0.475, 0));
  g.add(box(2.3, 0.05, 0.85, C(0x2a2a2a, 0.3), 0, 0.97, 0));
  g.add(box(0.4, 0.25, 0.35, black(), 0.6, 1.12, 0.05));
  g.add(box(0.5, 1.2, 0.05, C(0x6a6a6a, 0.5), -0.7, 1.6, -0.3)); // cigarette rack
  return g;
}
function palletRack(rng) {
  const g = new THREE.Group();
  const up = C(0x2a4a8a, 0.5, 0.5);
  const beam = C(0xd86a1a, 0.5, 0.5);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) g.add(box(0.08, 3.4, 0.08, up, sx * 1.3, 1.7, sz * 0.5));
  for (const y of [0.15, 1.3, 2.45])
    for (const sz of [-1, 1]) {
      g.add(box(2.68, 0.1, 0.06, beam, 0, y, sz * 0.5));
    }
  for (const y of [0.2, 1.35, 2.5])
    for (const x of [-0.65, 0.65]) {
      if (rng.chance(0.3)) continue;
      g.add(box(1.1, 0.12, 1.0, T('wood', 5, 0xb89a70), x, y + 0.06, 0));
      const h = rng.range(0.4, 0.9);
      g.add(box(1.0, h, 0.9, rng.chance(0.5) ? T('crate', 9) : C(0xa88a60, 0.95), x, y + 0.12 + h / 2, 0));
    }
  return g;
}
function forklift() {
  const g = new THREE.Group();
  const y = C(0xd8a020, 0.5, 0.3);
  g.add(box(1.1, 0.9, 1.8, y, 0, 0.65, 0));
  g.add(box(1.0, 0.08, 0.9, black(), 0, 2.1, -0.2));
  for (const s of [-1, 1]) g.add(box(0.06, 1.9, 0.06, black(), s * 0.45, 1.15, -0.6));
  for (const s of [-1, 1]) g.add(box(0.1, 2.3, 0.1, C(0x3a3a3a, 0.4, 0.6), s * 0.35, 1.2, 0.95));
  for (const s of [-1, 1]) g.add(box(0.12, 0.05, 1.1, C(0x3a3a3a, 0.4, 0.6), s * 0.3, 0.1, 1.5));
  for (const sx of [-1, 1]) for (const sz of [-0.6, 0.55]) g.add(cyl(0.25, 0.25, 0.22, black(), sx * 0.55, 0.25, sz, 12).rotateZ(Math.PI / 2));
  return g;
}
function palletStack(rng) {
  const g = new THREE.Group();
  g.add(box(1.2, 0.14, 1.0, T('wood', 5, 0xb89a70), 0, 0.07, 0));
  const n = rng.int(1, 3);
  for (let i = 0; i < n; i++) g.add(box(1.1, 0.5, 0.9, C(0xa88a60, 0.95), rng.range(-0.04, 0.04), 0.39 + i * 0.5, rng.range(-0.04, 0.04)));
  return g;
}
function barrels(rng) {
  const g = new THREE.Group();
  for (let i = 0; i < 3; i++) g.add(cyl(0.29, 0.29, 0.88, C(rng.pick([0x2a4a8a, 0x8a2a1a, 0x3a5a2a])), (i - 1) * 0.62, 0.44, rng.range(-0.05, 0.05), 12));
  return g;
}

// ---------------------------------------------------------------- walls and floors
function picture(rng) {
  const g = new THREE.Group();
  const w = rng.range(0.4, 0.9);
  const h = w * 0.75;
  g.add(box(w + 0.08, h + 0.08, 0.03, darkWood(), 0, 1.6, 0.0));
  g.add(box(w, h, 0.005, T('painting', 105 + rng.int(0, 7)), 0, 1.6, 0.017));
  g.rotation.z = rng.range(-0.06, 0.06);
  return g;
}
function poster(rng) {
  const g = new THREE.Group();
  g.add(box(0.48, 0.64, 0.005, T('poster', 108 + rng.int(0, 2)), 0, 1.5, 0));
  g.rotation.z = rng.range(-0.08, 0.08);
  return g;
}
function clock() {
  const g = new THREE.Group();
  g.add(cyl(0.17, 0.17, 0.04, white(), 0, 2.4, 0, 18).rotateX(Math.PI / 2));
  g.add(box(0.012, 0.12, 0.005, black(), 0, 2.44, 0.025).rotateZ(-1.0));
  g.add(box(0.012, 0.08, 0.005, black(), 0, 2.42, 0.026));
  return g;
}
function mailboxes() {
  const g = new THREE.Group();
  g.add(box(1.8, 1.0, 0.25, C(0xb89a50, 0.35, 0.8), 0, 1.35, 0));
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) g.add(box(0.26, 0.2, 0.01, C(0x8a6a30, 0.35, 0.8), -0.75 + c * 0.3, 1.0 + r * 0.24, 0.13));
  return g;
}
function rug(rng, w = 2.2, d = 1.6) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), T('rugPattern', 104 + rng.int(0, 3), 0xffffff, 1));
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.006;
  m.receiveShadow = true;
  const g = new THREE.Group();
  g.add(m);
  return g;
}
// clutter that falls everywhere: papers, clothes, broken plates
function clutter(rng) {
  const g = new THREE.Group();
  const n = rng.int(2, 5);
  for (let i = 0; i < n; i++) {
    const k = rng.int(0, 3);
    let m;
    if (k === 0) m = box(0.22, 0.004, 0.3, white(), 0, 0.003, 0);
    else if (k === 1) m = box(rng.range(0.3, 0.6), 0.03, rng.range(0.3, 0.5), fabric(rng.pick([0x3a4a6a, 0x6a3a3a, 0x8a8a7a, 0x2a2a2a])), 0, 0.015, 0);
    else if (k === 2) m = box(0.12, 0.01, 0.08, C(0xe8e4d8, 0.3), 0, 0.006, 0);
    else m = box(0.18, 0.03, 0.26, T('books', 106 + rng.int(0, 3)), 0, 0.016, 0);
    m.position.x = rng.range(-0.6, 0.6);
    m.position.z = rng.range(-0.6, 0.6);
    m.rotation.y = rng.range(0, 6.28);
    m.castShadow = false;
    g.add(m);
  }
  return g;
}
function ceilingLight(rng) {
  const g = new THREE.Group();
  if (rng.chance(0.5)) {
    g.add(box(1.2, 0.08, 0.3, white(), 0, 3.55, 0));
    g.add(box(1.1, 0.02, 0.22, C(0xd8dcd0, 0.3), 0, 3.5, 0));
  } else {
    g.add(cyl(0.01, 0.01, 0.5, black(), 0, 3.35, 0));
    g.add(cyl(0.08, 0.28, 0.2, C(0x8a7a5a, 0.6, 0.4), 0, 3.05, 0, 14));
  }
  return g;
}

// ---------------------------------------------------------------- catalogue
// w: width along the wall, d: depth out from it, h: height (tall pieces
// stop windows going above them). center: stands in the middle of a room.
// solid: blocks movement.
export const FURN = {
  sofa: { w: 2.1, d: 0.9, h: 0.9, make: sofa },
  armchair: { w: 0.9, d: 0.85, h: 1.0, make: armchair },
  coffeeTable: { w: 1.1, d: 0.6, h: 0.45, make: coffeeTable, center: true },
  tvStand: { w: 1.6, d: 0.45, h: 1.3, make: tvStand },
  bookshelf: { w: 1.0, d: 0.36, h: 1.9, make: bookshelf, tall: true },
  floorLamp: { w: 0.4, d: 0.4, h: 1.8, make: floorLamp },
  sideTable: { w: 0.5, d: 0.45, h: 0.9, make: sideTable },
  fireplace: { w: 1.9, d: 0.55, h: 1.4, make: fireplace },
  plant: { w: 0.45, d: 0.45, h: 1.2, make: plant },
  counter: { w: 2.65, d: 0.65, h: 2.2, make: counter, tall: true },
  stove: { w: 0.76, d: 0.62, h: 1.1, make: stove },
  diningTable: { w: 1.9, d: 2.1, h: 1.0, make: (r) => diningTable(r, 6), center: true },
  kitchenTable: { w: 1.3, d: 2.1, h: 1.0, make: (r) => diningTable(r, 4), center: true },
  trashCan: { w: 0.45, d: 0.45, h: 0.66, make: trashCan },
  bed: { w: 1.6, d: 2.1, h: 1.1, make: (r) => bed(r, true) },
  singleBed: { w: 1.05, d: 2.1, h: 1.1, make: (r) => bed(r, false) },
  dresser: { w: 1.2, d: 0.5, h: 1.6, make: dresser },
  nightstand: { w: 0.45, d: 0.4, h: 0.9, make: nightstand },
  wardrobe: { w: 1.0, d: 0.55, h: 1.9, make: wardrobeSmall, tall: true },
  toyBox: { w: 0.8, d: 0.45, h: 0.8, make: toyBox },
  desk: { w: 1.5, d: 1.1, h: 1.2, make: (r) => desk(r, true) },
  writingDesk: { w: 1.5, d: 1.1, h: 1.0, make: (r) => desk(r, false) },
  toilet: { w: 0.45, d: 0.7, h: 0.8, make: toilet },
  bathtub: { w: 1.7, d: 0.75, h: 0.6, make: bathtub },
  vanity: { w: 0.8, d: 0.5, h: 1.9, make: vanity },
  washer: { w: 0.65, d: 0.62, h: 0.9, make: washer },
  cubicles: { w: 3.0, d: 3.0, h: 1.3, make: cubicles, center: true },
  conferenceTable: { w: 2.6, d: 2.4, h: 1.0, make: conferenceTable, center: true },
  copier: { w: 1.0, d: 0.65, h: 1.1, make: copier },
  waterCooler: { w: 0.4, d: 0.4, h: 1.5, make: waterCooler },
  filing: { w: 0.5, d: 0.62, h: 1.35, make: filing },
  receptionDesk: { w: 3.0, d: 0.85, h: 1.2, make: receptionDesk, center: true },
  execDesk: { w: 2.0, d: 1.9, h: 1.2, make: execDesk, center: true },
  elevators: { w: 2.6, d: 0.12, h: 2.4, make: elevators, flat: true, tall: true },
  whiteboard: { w: 2.0, d: 0.08, h: 2.1, make: whiteboard, flat: true, tall: true },
  hospitalBed: { w: 1.1, d: 2.1, h: 1.0, make: hospitalBed },
  curtain: { w: 2.4, d: 0.1, h: 2.8, make: curtain, flat: true },
  gurney: { w: 0.8, d: 1.9, h: 1.1, make: gurney, center: true },
  medCart: { w: 0.6, d: 0.45, h: 1.0, make: medCart },
  waitingChairs: { w: 2.4, d: 0.6, h: 0.95, make: waitingChairs },
  wheelchair: { w: 0.7, d: 0.6, h: 0.95, make: wheelchair },
  bars: { w: 2.8, d: 0.1, h: 3.4, make: () => bars(2.8), flat: true, tall: true },
  cellBunk: { w: 0.85, d: 1.95, h: 0.6, make: cellBunk },
  cellBars: { w: 2.9, d: 0.1, h: 3.5, make: cellBars, flat: true },
  bunk: { w: 1.0, d: 2.05, h: 1.8, make: bunk, tall: true },
  messTable: { w: 2.4, d: 1.6, h: 0.8, make: messTable, center: true },
  gunRack: { w: 1.4, d: 0.25, h: 1.9, make: gunRack, tall: true },
  mapTable: { w: 2.0, d: 1.3, h: 1.0, make: mapTable, center: true },
  radioDesk: { w: 1.4, d: 0.7, h: 1.9, make: radioDesk },
  lockerRow: { w: 2.1, d: 0.5, h: 1.9, make: lockerRow, tall: true },
  gondola: { w: 2.6, d: 0.9, h: 1.5, make: gondola, center: true },
  drinkCooler: { w: 2.4, d: 0.75, h: 2.1, make: drinkCooler, tall: true },
  checkout: { w: 2.3, d: 0.85, h: 1.6, make: checkout, center: true },
  palletRack: { w: 2.7, d: 1.1, h: 3.4, make: palletRack, center: true, tall: true },
  forklift: { w: 1.2, d: 2.6, h: 2.3, make: forklift, center: true },
  palletStack: { w: 1.2, d: 1.0, h: 1.6, make: palletStack },
  barrels: { w: 1.9, d: 0.62, h: 0.9, make: barrels },
  mailboxes: { w: 1.8, d: 0.26, h: 1.9, make: mailboxes, flat: true },
  // decor only (no collision)
  picture: { w: 0.9, d: 0.04, h: 2.0, make: picture, flat: true, decor: true, wall: true },
  poster: { w: 0.5, d: 0.02, h: 1.9, make: poster, flat: true, decor: true, wall: true },
  clock: { w: 0.35, d: 0.04, h: 2.6, make: clock, flat: true, decor: true, wall: true },
  rug: { w: 2.2, d: 1.6, h: 0, make: rug, center: true, decor: true },
  clutter: { w: 1.4, d: 1.4, h: 0, make: clutter, center: true, decor: true },
  ceilingLight: { w: 0.5, d: 0.5, h: 0, make: ceilingLight, center: true, decor: true },
};

export function makeFurniture(kind, rng) {
  const g = FURN[kind].make(rng);
  g.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = o.castShadow !== false && kind !== 'rug' && kind !== 'clutter';
      o.receiveShadow = true;
    }
  });
  return g;
}
