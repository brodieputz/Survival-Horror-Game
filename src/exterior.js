// Building exteriors. Wraps a generated interior in a proper building: a
// facade with windows (some boarded, some smashed), a door, a roof and
// signage; dresses the street-front lot for what the place is (a driveway
// and lawn for a house, a parking lot for an office, pumps under a canopy
// at a gas station...) and lays out the street and the far side of it.
import * as THREE from 'three';
import { TILE, WALL_H, T } from './config.js';
import { tex } from './textures.js';
import { box, lambert as L, mergeStatic, makeDoorFrame, glowSprite } from './models.js';
import * as P from './props.js';
import * as LP from './lotprops.js';
import { makeTrainCar } from './train.js';
import { macroVary, makeGrass } from './atmos.js';

const DOOR_TOP = 3.0;

export const EXTERIOR = {
  gas: { floors: 1, story: 4.4, roof: 'flat', facade: 'facadeShop', ground: 'facadeShop', seed: 78, fence: 'bollards', trim: 0x6a3a2a },
  home: { floors: 2, story: 3.3, roof: 'pitched', facade: 'facadeSiding', ground: 'facadeSiding', seed: 60, fence: 'picket', trim: 0xe8e4d8 },
  apartment: { floors: 5, story: 3.2, roof: 'flat', facade: 'facadeBrick', ground: 'facadeShop', seed: 63, fence: 'railing', trim: 0x4a3a32 },
  office: { floors: 5, story: 3.6, roof: 'flat', facade: 'facadeGlass', ground: 'facadeGlass', seed: 66, glass: true, fence: 'planter', trim: 0x2a2e34 },
  warehouse: { floors: 1, story: 8.0, roof: 'lowslope', facade: 'facadeMetal', ground: 'facadeMetal', seed: 75, fence: 'chain', trim: 0x3a3e40 },
  police: { floors: 2, story: 3.8, roof: 'flat', facade: 'facadeConcrete', ground: 'facadeConcrete', seed: 69, fence: 'jersey', trim: 0x2a3a5a },
  hospital: { floors: 4, story: 3.6, roof: 'flat', facade: 'facadeHospital', ground: 'facadeHospital', seed: 72, fence: 'hedge', trim: 0x8a9294 },
  military: { floors: 1, story: 4.6, roof: 'flat', facade: 'facadeBunker', ground: 'facadeBunker', seed: 81, fence: 'barbed', trim: 0x4a4a3a },
  skyscraper: { floors: 18, story: 3.8, roof: 'flat', facade: 'facadeTower', ground: 'facadeGlass', seed: 90, glass: true, fence: 'planter', trim: 0x3a3e44 },
  stadium: { floors: 1, story: 11, roof: 'open', facade: 'facadeConcrete', ground: 'facadeConcrete', seed: 93, fence: 'chain', trim: 0x8a8e90 },
  railyard: { floors: 1, story: 7.5, roof: 'lowslope', facade: 'facadeBrick', ground: 'facadeBrick', seed: 96, fence: 'chain', trim: 0x4a2a20 },
  mall: { floors: 2, story: 5, roof: 'flat', facade: 'facadeShop', ground: 'facadeGlass', seed: 99, glass: true, fence: 'planter', trim: 0x8a7a6a },
  grain: { floors: 1, story: 7, roof: 'lowslope', facade: 'facadeMetal', ground: 'facadeMetal', seed: 102, fence: 'chain', trim: 0x8a8a80 },
  mine: { floors: 1, story: 6, roof: 'pitched', facade: 'facadeMetal', ground: 'facadeMetal', seed: 105, fence: 'barbed', trim: 0x3a3430 },
};

// ---------------------------------------------------------------- landmark lot props
function makeRails(len) {
  const g = new THREE.Group();
  const steel = L({ color: 0x5a5450, roughness: 0.45, metalness: 0.8 });
  const wood = L({ map: tex('wood', 5), color: 0x6a5a48, roughness: 0.95 });
  g.add(LP.makeGroundPatch('dirt', 3.4, len, 1, { y: 0.012 }));
  for (const s of [-1, 1]) g.add(box(0.08, 0.16, len, steel, s * 0.72, 0.2, 0));
  for (let z = -len / 2 + 0.3; z < len / 2; z += 0.65) g.add(box(2.4, 0.12, 0.24, wood, 0, 0.06, z));
  return mergeStatic(g);
}
function makeLightTower(h = 16) {
  const g = new THREE.Group();
  const steel = L({ color: 0x6a6e70, roughness: 0.5, metalness: 0.7 });
  g.add(box(0.45, h, 0.45, steel, 0, h / 2, 0));
  g.add(box(3.2, 1.6, 0.35, steel, 0, h + 0.6, 0));
  const lens = L({ color: 0xd8dcc8, emissive: 0x2a2a20, roughness: 0.2 });
  for (let i = 0; i < 6; i++) g.add(box(0.42, 0.42, 0.08, lens, -1.2 + (i % 3) * 1.2, h + 0.25 + Math.floor(i / 3) * 0.7, 0.2));
  return g;
}
function makeSilo(r, h) {
  const g = new THREE.Group();
  const metal = L({ map: tex('sheetMetal', 25), color: 0xc8c8c0, roughness: 0.55, metalness: 0.5 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 20), metal);
  body.position.y = h / 2;
  const cap = new THREE.Mesh(new THREE.ConeGeometry(r * 1.04, r * 0.7, 20), metal);
  cap.position.y = h + r * 0.35;
  for (const m of [body, cap]) {
    m.castShadow = true;
    m.receiveShadow = true;
  }
  g.add(body, cap);
  for (let y = 2; y < h; y += 2.4) g.add(new THREE.Mesh(new THREE.TorusGeometry(r + 0.02, 0.04, 4, 24), L({ color: 0x7a7a74, metalness: 0.6 })).rotateX(Math.PI / 2).translateZ(-y));
  return g;
}
function makeHeadframe(h = 16) {
  const g = new THREE.Group();
  const steel = L({ color: 0x4a3a30, roughness: 0.7, metalness: 0.5 });
  const w = 4;
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const leg = box(0.3, h, 0.3, steel, (x * w) / 2 * 0.6, h / 2, (z * w) / 2 * 0.6);
    leg.rotation.z = -x * 0.06;
    leg.rotation.x = z * 0.06;
    g.add(leg);
  }
  for (let y = 2.5; y < h; y += 3) {
    const k = 1 - (y / h) * 0.35;
    for (const z of [-1, 1]) g.add(box(w * k, 0.18, 0.18, steel, 0, y, (z * w * k) / 2 * 0.6));
    for (const x of [-1, 1]) g.add(box(0.18, 0.18, w * k, steel, (x * w * k) / 2 * 0.6, y, 0));
  }
  const wheel = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.12, 6, 20), steel);
  wheel.position.set(0, h + 0.6, 0);
  wheel.castShadow = true;
  g.add(wheel, box(0.3, 0.3, 2.6, steel, 0, h + 0.6, 0));
  return g;
}
function makeCoalPile(r, h) {
  const m = new THREE.Mesh(new THREE.ConeGeometry(r, h, 14), L({ map: tex('coal'), color: 0x3a3836, roughness: 0.95 }));
  m.position.y = h / 2;
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

// ---------------------------------------------------------------- geometry helpers
class Quads {
  constructor() {
    this.pos = [];
    this.nor = [];
    this.uv = [];
    this.idx = [];
  }
  // a, b, c, d: bottom-left, bottom-right, top-right, top-left seen from the front
  quad(a, b, c, d, uv = [0, 0, 1, 1]) {
    const i = this.pos.length / 3;
    this.pos.push(...a, ...b, ...c, ...d);
    const e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const e2 = [d[0] - a[0], d[1] - a[1], d[2] - a[2]];
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const l = Math.hypot(n[0], n[1], n[2]) || 1;
    for (let k = 0; k < 4; k++) this.nor.push(n[0] / l, n[1] / l, n[2] / l);
    const [u0, v0, u1, v1] = uv;
    this.uv.push(u0, v0, u1, v0, u1, v1, u0, v1);
    this.idx.push(i, i + 1, i + 2, i, i + 2, i + 3);
  }
  tri(a, b, c, uvs) {
    const i = this.pos.length / 3;
    this.pos.push(...a, ...b, ...c);
    const e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const e2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const l = Math.hypot(n[0], n[1], n[2]) || 1;
    for (let k = 0; k < 3; k++) this.nor.push(n[0] / l, n[1] / l, n[2] / l);
    this.uv.push(...uvs);
    this.idx.push(i, i + 1, i + 2);
  }
  build() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nor, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
    g.setIndex(this.idx);
    g.computeBoundingSphere();
    return g;
  }
}

const add3 = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];

// ---------------------------------------------------------------- builder
export function buildExterior(scene) {
  const d = scene.d;
  const type = scene.loc.type;
  const S = EXTERIOR[type];
  const rngObj = scene.rng;
  const rng = () => rngObj.next();
  const group = new THREE.Group();
  const world = scene.world;
  const H = d.H;
  const F = d.front * TILE; // the building's front wall
  const SX0 = d.shell.x0 * TILE;
  const SX1 = (d.shell.x1 + 1) * TILE;
  const SZ0 = d.shell.y0 * TILE;
  const LX0 = d.lot.x0 * TILE;
  const LX1 = (d.lot.x1 + 1) * TILE;
  const LZ1 = (H - 1) * TILE; // the street-side edge of the lot
  const DX = (d.door.x + 0.5) * TILE;
  // the building is as tall as its floors inside (more for big blocks
  // whose upper storeys are long since gutted)
  const inside = scene.loc.floors || 1;
  const size = scene.game.run.locality.size ?? 1;
  let NF = type === 'home' ? inside : Math.max(S.floors, inside);
  if (type === 'skyscraper') NF = size >= 3 ? 22 + Math.floor(rngObj.next() * 16) : 12 + Math.floor(rngObj.next() * 7);
  const HB = NF * S.story;
  const biome = scene.game.run.locality.biome;

  // ---------- materials (one per facade variant) ----------
  const mats = new Map();
  const facadeMat = (name, seedBase, variant) => {
    const key = name + ':' + variant;
    if (!mats.has(key)) {
      mats.set(key, {
        mat: L({ map: tex(name, seedBase + variant), roughness: S.glass ? 0.22 : 0.88, metalness: S.glass ? 0.35 : 0, shadowSide: THREE.DoubleSide }),
        q: new Quads(),
      });
    }
    return mats.get(key).q;
  };
  const trim = { mat: L({ color: S.trim, map: tex('concreteSlab'), roughness: 0.85, shadowSide: THREE.DoubleSide }), q: new Quads() };
  const pickVariant = (ground) => {
    const r = rng();
    if (ground) return r < 0.45 ? 0 : r < 0.8 ? 1 : 2;
    return r < 0.72 ? 0 : r < 0.86 ? 1 : 2;
  };

  // A wall made of 3 m bays, starting at `o` and running along `right`.
  const wall = (o, right, bays, skipDoorBay = -1) => {
    for (let i = 0; i < bays; i++)
      for (let f = 0; f < NF; f++) {
        const ground = f === 0;
        const y0 = f * S.story;
        const y1 = (f + 1) * S.story;
        const a = add3(o, right, i * TILE);
        const b = add3(o, right, (i + 1) * TILE);
        if (ground && i === skipDoorBay) {
          // lintel over the door and slim jambs either side of the frame; the
          // lintel's back face closes the gap above the doorway from inside
          trim.q.quad([a[0], DOOR_TOP, a[2]], [b[0], DOOR_TOP, b[2]], [b[0], y1, b[2]], [a[0], y1, a[2]], [0, 0, 1, 0.3]);
          trim.q.quad([b[0], DOOR_TOP, b[2]], [a[0], DOOR_TOP, a[2]], [a[0], WALL_H + 0.05, a[2]], [b[0], WALL_H + 0.05, b[2]], [0, 0, 1, 0.3]);
          const j = 0.16;
          const a2 = add3(a, right, j);
          const b2 = add3(b, right, -j);
          trim.q.quad([a[0], 0, a[2]], [a2[0], 0, a2[2]], [a2[0], DOOR_TOP, a2[2]], [a[0], DOOR_TOP, a[2]], [0, 0, 0.1, 1]);
          trim.q.quad([b2[0], 0, b2[2]], [b[0], 0, b[2]], [b[0], DOOR_TOP, b[2]], [b2[0], DOOR_TOP, b2[2]], [0, 0, 0.1, 1]);
          continue;
        }
        const q = facadeMat(ground ? S.ground : S.facade, S.seed, pickVariant(ground));
        q.quad([a[0], y0, a[2]], [b[0], y0, b[2]], [b[0], y1, b[2]], [a[0], y1, a[2]]);
      }
  };
  const frontBays = (SX1 - SX0) / TILE;
  const depthBays = (F - SZ0) / TILE;
  wall([SX0, 0, F], [1, 0, 0], frontBays, d.door.x - d.shell.x0); // front, facing the lot
  wall([SX1, 0, F], [0, 0, -1], depthBays); // east side
  wall([SX0, 0, SZ0], [0, 0, 1], depthBays); // west side
  wall([SX1, 0, SZ0], [-1, 0, 0], frontBays); // back

  // ---------- roof ----------
  const roofQ = new Quads();
  let roofMat;
  const OV = 0.5;
  if (S.roof === 'open') {
    // a stadium: tiers of seats step up from the top of the field walls to
    // the rim, all the way round, with floodlights on the corners
    roofMat = L({ map: tex('roofGravel'), roughness: 1 });
    const conc = L({ map: tex('concreteSlab'), color: 0x9a9894, roughness: 0.9 });
    const seatCols = [0x1a3a7a, 0x8a1a1a];
    const seat = L({ color: seatCols[Math.floor(rng() * 2)], roughness: 0.6 });
    const sg = new THREE.Group();
    const steps = 6;
    const rise = (HB - WALL_H) / steps;
    const sides = [
      [SX0, SZ0, SX0, F, 1, 0],
      [SX1, SZ0, SX1, F, -1, 0],
      [SX0, SZ0, SX1, SZ0, 0, 1],
      [SX0, F, SX1, F, 0, -1],
    ];
    for (const [x0, z0, x1, z1, nx, nz] of sides) {
      const len = Math.hypot(x1 - x0, z1 - z0);
      for (let k = 0; k < steps; k++) {
        const deep = steps - k + 0.6;
        const y = WALL_H + k * rise;
        const cx = (x0 + x1) / 2 + (nx * deep) / 2;
        const cz = (z0 + z1) / 2 + (nz * deep) / 2;
        const w = nx ? deep : len;
        const dz = nx ? len : deep;
        sg.add(box(w, rise, dz, conc, cx, y + rise / 2, cz));
        // a row of seats along the tread
        const sx = (x0 + x1) / 2 + nx * (deep - 0.45);
        const sz = (z0 + z1) / 2 + nz * (deep - 0.45);
        sg.add(box(nx ? 0.5 : len - 2, 0.45, nx ? len - 2 : 0.5, seat, sx, y + rise + 0.22, sz));
      }
    }
    for (const [x, z] of [[SX0 + 1, SZ0 + 1], [SX1 - 1, SZ0 + 1], [SX0 + 1, F - 1], [SX1 - 1, F - 1]]) sg.add(makeLightTower(9).translateX(x).translateY(HB).translateZ(z));
    group.add(mergeStatic(sg));
  } else if (S.roof === 'flat') {
    roofMat = L({ map: tex('roofGravel'), roughness: 1 });
    roofQ.quad([SX0, HB, F], [SX1, HB, F], [SX1, HB, SZ0], [SX0, HB, SZ0], [0, 0, (SX1 - SX0) / 4, (F - SZ0) / 4]);
    // parapet and cornice
    const pm = L({ map: tex('concreteSlab'), color: S.trim, roughness: 0.9 });
    const pg = new THREE.Group();
    const ph = 0.9;
    pg.add(box(SX1 - SX0 + 0.3, ph, 0.3, pm, (SX0 + SX1) / 2, HB + ph / 2, F + 0.0));
    pg.add(box(SX1 - SX0 + 0.3, ph, 0.3, pm, (SX0 + SX1) / 2, HB + ph / 2, SZ0));
    pg.add(box(0.3, ph, F - SZ0, pm, SX0, HB + ph / 2, (F + SZ0) / 2));
    pg.add(box(0.3, ph, F - SZ0, pm, SX1, HB + ph / 2, (F + SZ0) / 2));
    pg.add(box(SX1 - SX0 + 0.5, 0.22, 0.45, pm, (SX0 + SX1) / 2, HB - 0.1, F + 0.15));
    for (let f = 1; f < NF; f++) pg.add(box(SX1 - SX0, 0.12, 0.14, pm, (SX0 + SX1) / 2, f * S.story, F + 0.06)); // floor lines
    // rooftop clutter
    const metal = L({ color: 0x8a8e90, roughness: 0.5, metalness: 0.5 });
    const n = 2 + Math.floor(rng() * 4);
    for (let i = 0; i < n; i++) {
      const x = SX0 + 3 + rng() * (SX1 - SX0 - 6);
      const z = SZ0 + 3 + rng() * (F - SZ0 - 6);
      pg.add(box(1.4 + rng(), 0.9 + rng() * 0.6, 1.2 + rng(), metal, x, HB + 0.5, z));
    }
    if (NF >= 3 && type !== 'skyscraper') pg.add(box(4, 2.6, 4, pm, SX0 + (SX1 - SX0) * 0.3, HB + 1.3, SZ0 + (F - SZ0) * 0.5)); // stair housing
    if (type === 'apartment') {
      const wood = L({ color: 0x5a4030, roughness: 0.9 });
      const tx = SX0 + (SX1 - SX0) * 0.72;
      const tz = SZ0 + (F - SZ0) * 0.45;
      for (const ox of [-1, 1]) for (const oz of [-1, 1]) pg.add(box(0.15, 3, 0.15, metal, tx + ox, HB + 1.5, tz + oz));
      const tank = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 2.6, 14), wood);
      tank.position.set(tx, HB + 4.3, tz);
      pg.add(tank);
      pg.add(new THREE.Mesh(new THREE.ConeGeometry(1.65, 0.9, 14), wood).translateX(tx).translateY(HB + 6.05).translateZ(tz));
    }
    if (type === 'military') for (let x = SX0 + 0.6; x < SX1; x += 0.65) pg.add(box(0.6, 0.3, 0.5, L({ color: 0x8a7a56 }), x, HB + 1.05, F));
    if (type === 'skyscraper') {
      // a crown, the machine floors and a mast with a warning light
      const crown = L({ color: 0x2a3036, roughness: 0.35, metalness: 0.7 });
      const w = SX1 - SX0;
      const dd = F - SZ0;
      pg.add(box(w - 4, 6, dd - 4, pm, (SX0 + SX1) / 2, HB + 3, (SZ0 + F) / 2));
      pg.add(box(w - 3.6, 0.6, dd - 3.6, crown, (SX0 + SX1) / 2, HB + 6.3, (SZ0 + F) / 2));
      pg.add(box(w * 0.4, 4, dd * 0.4, crown, (SX0 + SX1) / 2, HB + 8.6, (SZ0 + F) / 2));
      pg.add(box(0.5, 18, 0.5, metal, (SX0 + SX1) / 2, HB + 19.6, (SZ0 + F) / 2));
      for (let f = 6; f < NF; f += 6) pg.add(box(w + 0.4, 0.5, 0.35, crown, (SX0 + SX1) / 2, f * S.story, F + 0.1)); // mechanical bands
    }
    group.add(mergeStatic(pg));
  } else {
    // pitched (house) or low-slope (warehouse) roof, ridge running along x
    const rise = S.roof === 'pitched' ? Math.min(5.5, (F - SZ0) * 0.3) : 1.8;
    const zr = (SZ0 + F) / 2;
    roofMat = S.roof === 'pitched' ? L({ map: tex('roofShingle'), roughness: 0.95 }) : L({ map: tex('sheetMetal'), color: 0xb0b4b0, roughness: 0.6, metalness: 0.4 });
    const slope = Math.hypot(F + OV - zr, rise);
    const u = (SX1 - SX0 + 2 * OV) / 3;
    const v = slope / 3;
    roofQ.quad([SX0 - OV, HB - 0.15, F + OV], [SX1 + OV, HB - 0.15, F + OV], [SX1 + OV, HB + rise, zr], [SX0 - OV, HB + rise, zr], [0, 0, u, v]);
    roofQ.quad([SX1 + OV, HB - 0.15, SZ0 - OV], [SX0 - OV, HB - 0.15, SZ0 - OV], [SX0 - OV, HB + rise, zr], [SX1 + OV, HB + rise, zr], [0, 0, u, v]);
    // gable ends, clad like the walls
    const gq = facadeMat(S.facade, S.seed, 0);
    const span = (F - SZ0) / 3;
    gq.tri([SX1, HB, F], [SX1, HB, SZ0], [SX1, HB + rise, zr], [0, 0, span, 0, span / 2, rise / S.story]);
    gq.tri([SX0, HB, SZ0], [SX0, HB, F], [SX0, HB + rise, zr], [0, 0, span, 0, span / 2, rise / S.story]);
    // fascia boards under the eaves
    group.add(box(SX1 - SX0 + 2 * OV, 0.25, 0.08, trim.mat, (SX0 + SX1) / 2, HB - 0.2, F + OV));
    if (S.roof === 'pitched') {
      // a chimney
      const brick = L({ map: tex('brick', 3), roughness: 0.9 });
      group.add(box(1.1, rise + 1.6, 1.1, brick, SX0 + (SX1 - SX0) * 0.75, HB + (rise + 1.6) / 2, zr - 1.5));
    }
  }
  roofMat.shadowSide = THREE.DoubleSide;
  const roof = new THREE.Mesh(roofQ.build(), roofMat);
  roof.castShadow = true;
  roof.receiveShadow = true;
  group.add(roof);

  for (const { mat, q } of [...mats.values(), trim]) {
    if (!q.pos.length) continue;
    const m = new THREE.Mesh(q.build(), mat);
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
  }

  // ---------- door ----------
  const fr = makeDoorFrame(TILE - 0.32);
  fr.group.remove(fr.rune);
  fr.group.position.set(DX, 0, F);
  group.add(fr.group);
  for (const s of [-1, 1]) {
    const lamp = P.makeWallLamp(0xffe0b0);
    lamp.group.position.set(DX + s * 2.1, 0, F);
    lamp.glow.material.opacity = 0.15;
    group.add(lamp.group);
  }

  // ---------- placement helpers ----------
  const corridor = (x, w) => Math.abs(x - DX) < 3.0 + w / 2;
  const solid = (obj, x, z, w, dpt, rot = 0, block = true) => {
    obj.position.set(x, obj.position.y, z);
    obj.rotation.y = rot;
    group.add(obj);
    const swap = Math.abs(Math.sin(rot)) > 0.7;
    const hw = (swap ? dpt : w) / 2;
    const hd = (swap ? w : dpt) / 2;
    world.addCollider(x - hw, z - hd, x + hw, z + hd);
    if (block && hw * hd > 1) {
      const [tx, ty] = world.tileOf(x, z);
      if (Math.abs(x - DX) > 3) d.blocked[ty * d.W + tx] = 1;
    }
  };
  const deco = (obj, x, z, rot = 0) => {
    obj.position.set(x, obj.position.y, z);
    obj.rotation.y = rot;
    group.add(obj);
    return obj;
  };
  const zone = (side) => (side < 0 ? [LX0 + 1.2, DX - 3.6] : [DX + 3.6, LX1 - 1.2]);
  const zoneW = (side) => {
    const [a, b] = zone(side);
    return b - a;
  };
  const wide = zoneW(1) >= zoneW(-1) ? 1 : -1;
  const sign = (text, w, h, x, y, z, opts) => {
    const m = LP.makeSign(text, w, h, opts);
    m.position.set(x, y, z);
    group.add(m);
    return m;
  };
  const sidewalk = (depth) => group.add(LP.makeGroundPatch('concreteSlab', LX1 - LX0, depth, 1, { y: 0.01 }).translateX((LX0 + LX1) / 2).translateZ(F + depth / 2));
  // parking stalls (cars nose-in toward the building) across a zone
  const parking = (side, rowZ, kinds, fill = 0.6) => {
    const [a, b] = zone(side);
    if (b - a < 3) return;
    const n = Math.floor((b - a) / 2.8);
    const x0 = (a + b) / 2 - (n * 2.8) / 2;
    for (let i = 0; i <= n; i++) group.add(LP.makeLine(5.2).translateX(x0 + i * 2.8).translateZ(rowZ));
    for (let i = 0; i < n; i++) {
      if (rng() > fill) continue;
      const kind = kinds[Math.floor(rng() * kinds.length)];
      const car = LP.makeVehicle(kind, rng);
      solid(car.mesh, x0 + (i + 0.5) * 2.8 + (rng() - 0.5) * 0.3, rowZ + (rng() - 0.5) * 0.4, car.w, car.len, Math.PI + (rng() - 0.5) * 0.15);
    }
  };
  const lamps = (zs) => {
    for (const side of [-1, 1]) {
      if (zoneW(side) < 3) continue;
      const lp = LP.makeLampPost();
      const [a, b] = zone(side);
      deco(lp.group, (a + b) / 2, zs, Math.PI);
      world.addCollider((a + b) / 2 - 0.15, zs - 0.15, (a + b) / 2 + 0.15, zs + 0.15);
    }
  };
  const fenceSides = () => {
    const len = LZ1 - F;
    const zc = (F + LZ1) / 2;
    for (const x of [LX0, LX1]) {
      let f;
      switch (S.fence) {
        case 'picket':
          f = LP.makePicketFence(len);
          break;
        case 'railing':
          f = LP.makeRailing(len);
          break;
        case 'planter':
          f = LP.makePlanter(len);
          break;
        case 'chain':
          f = LP.makeChainFence(len, false);
          break;
        case 'barbed':
          f = LP.makeChainFence(len, true, 2.6);
          break;
        case 'jersey':
          f = LP.makeJersey(len);
          break;
        case 'hedge':
          f = LP.makeHedge(len);
          break;
        default: {
          f = new THREE.Group();
          for (let z = -len / 2 + 1; z < len / 2; z += 2.5) f.add(LP.makeBollard().translateZ(z));
        }
      }
      deco(f, x, zc);
    }
  };

  // ---------- the lot, dressed for the kind of place ----------
  const L_name = scene.loc.name.toUpperCase();
  const paths = []; // x ranges kept clear of lawn grass
  switch (type) {
    case 'home': {
      const gx = Math.max(LX0 + 2.5, Math.min(LX1 - 2.5, DX + wide * 7.5));
      paths.push([gx - 2.5, gx + 2.5], [DX - 1.1, DX + 1.1]);
      group.add(LP.makeGroundPatch('concreteSlab', 4.4, LZ1 - F, 1, { y: 0.012 }).translateX(gx).translateZ((F + LZ1) / 2)); // driveway
      group.add(LP.makeGroundPatch('concreteSlab', 1.6, LZ1 - F, 1, { y: 0.012 }).translateX(DX).translateZ((F + LZ1) / 2)); // front walk
      // garage door
      const gd = box(3.2, 2.5, 0.12, L({ map: tex('sheetMetal'), color: 0xe0dcd0, roughness: 0.6 }), gx, 1.25, F + 0.06);
      group.add(gd);
      const car = LP.makeVehicle(['sedan', 'suv', 'pickup'][Math.floor(rng() * 3)], rng);
      solid(car.mesh, gx, F + 4.2, car.w, car.len, Math.PI + (rng() - 0.5) * 0.1);
      // porch
      group.add(box(4.2, 0.2, 1.8, L({ map: tex('concreteSlab') }), DX, 0.1, F + 0.9));
      group.add(box(4.6, 0.15, 2.2, trim.mat, DX, 3.0, F + 1.1));
      for (const s of [-1, 1]) group.add(box(0.14, 2.9, 0.14, trim.mat, DX + s * 2.0, 1.45, F + 2.05));
      deco(LP.makeMailbox(), gx - wide * 3, LZ1 - 0.6);
      const ox = DX - wide * 6.5;
      if (ox > LX0 + 2 && ox < LX1 - 2) solid(LP.makeLeafyTree(rng, biome === 'tundra'), ox, F + 9, 0.6, 0.6);
      for (let x = LX0 + 1.5; x < LX1 - 1; x += 2.4) if (!corridor(x, 1) && Math.abs(x - gx) > 3) deco(P.makeBush(rng).mesh, x, F + 0.9);
      break;
    }
    case 'office': {
      sidewalk(2.6);
      parking(-1, F + 6.2, ['sedan', 'suv', 'sedan', 'van']);
      parking(1, F + 6.2, ['sedan', 'suv', 'pickup']);
      parking(-1, LZ1 - 3.4, ['sedan', 'suv'], 0.4);
      parking(1, LZ1 - 3.4, ['sedan', 'suv'], 0.4);
      lamps(F + 11);
      // entrance canopy
      group.add(box(6, 0.25, 3.2, L({ color: 0x2a2e34, roughness: 0.4, metalness: 0.6 }), DX, 3.4, F + 1.6));
      for (const s of [-1, 1]) group.add(box(0.16, 3.4, 0.16, L({ color: 0x8a8e94, roughness: 0.3, metalness: 0.8 }), DX + s * 2.8, 1.7, F + 3.0));
      sign(L_name, Math.min(14, (SX1 - SX0) * 0.6), 1.3, DX, HB - 1.0, F + 0.08, { bg: '#1a1e24', fg: '#e8eef4', font: 'bold 80px sans-serif', lit: true });
      deco(LP.makeBench(), DX + wide * 4.5, F + 1.3, Math.PI);
      const mx = DX - wide * 5;
      if (mx > LX0 + 2 && mx < LX1 - 2) {
        const mono = box(3.2, 1.2, 0.5, L({ map: tex('concreteSlab') }), 0, 0.6, 0);
        solid(mono, mx, LZ1 - 1.2, 3.2, 0.5);
        sign(L_name, 2.9, 0.7, mx, 0.7, LZ1 - 0.94, { bg: '#2a2e34', fg: '#e8eef4', font: 'bold 64px sans-serif' });
      }
      break;
    }
    case 'gas': {
      const cw = 11;
      const cx = Math.max(LX0 + cw / 2 + 0.5, Math.min(LX1 - cw / 2 - 0.5, DX + wide * 9.5));
      const cz = F + 10.5;
      const brand = scene.loc.name.toUpperCase();
      deco(LP.makeCanopy(cw, 7, 4.6, brand), cx, cz);
      for (const x of [cx - cw / 2 + 1.2, cx + cw / 2 - 1.2]) for (const z of [cz - 1.75, cz + 1.75]) world.addCollider(x - 0.2, z - 0.2, x + 0.2, z + 0.2);
      for (const s of [-1, 1]) solid(LP.makeGasPump(), cx + s * 2.3, cz, 1.2, 0.7, Math.PI / 2);
      const car = LP.makeVehicle(['sedan', 'pickup', 'suv'][Math.floor(rng() * 3)], rng);
      solid(car.mesh, cx + (rng() - 0.5) * 0.3, cz + (rng() - 0.5) * 0.8, car.w, car.len, (rng() < 0.5 ? 0 : Math.PI) + (rng() - 0.5) * 0.08);
      const px = Math.max(LX0 + 1.5, Math.min(LX1 - 1.5, cx + wide * (cw / 2 + 1)));
      const ps = LP.makePoleSign(brand, '3.79\n4.29', 5.5);
      solid(ps, px, LZ1 - 1.2, 0.3, 0.3);
      sign('FOOD MART', Math.min(10, SX1 - SX0 - 2), 0.8, DX, 3.85, F + 0.1, { bg: '#b8261a', fg: '#f4f0e0', font: 'bold 70px sans-serif', lit: true });
      sidewalk(2.2);
      const ice = box(1.6, 1.3, 0.8, L({ color: 0xe8e8f0, roughness: 0.5 }), 0, 0.65, 0);
      const ix = DX - wide * 4.5;
      if (ix > LX0 + 1 && ix < LX1 - 1) {
        solid(ice, ix, F + 0.7, 1.6, 0.8);
        sign('ICE', 1.0, 0.35, ix, 0.95, F + 1.12, { bg: '#2a6ac8', fg: '#ffffff', font: 'bold 90px sans-serif' });
      }
      break;
    }
    case 'apartment': {
      sidewalk(4.2);
      for (const side of [-1, 1]) {
        const [a, b] = zone(side);
        for (let x = a + 3; x < b - 2.2; x += 6.2) {
          if (rng() < 0.3) continue;
          const car = LP.makeVehicle(['sedan', 'suv', 'van', 'pickup'][Math.floor(rng() * 4)], rng);
          solid(car.mesh, x, LZ1 - 1.6, car.w, car.len, Math.PI / 2 + (rng() - 0.5) * 0.1);
        }
      }
      const [a, b] = zone(-wide);
      if (b - a > 4) for (let i = 0; i < 2; i++) solid(LP.makeDumpster(rng() < 0.5 ? 0x2a4a3a : 0x2a3a5a), a + 1.3 + i * 2.3, F + 0.9, 1.9, 1.2);
      lamps(LZ1 - 3.6);
      deco(LP.makeHydrant(), DX + 4.2, LZ1 - 0.8);
      group.add(box(4, 0.45, 1.6, L({ map: tex('concreteSlab') }), DX, 0.22, F + 0.8)); // stoop
      group.add(box(4.4, 0.12, 2.0, L({ color: 0x5a1a14, roughness: 0.8 }), DX, 3.05, F + 1.0)); // awning
      sign(`${L_name}`, Math.min(14, (SX1 - SX0) * 0.7), 1.2, DX, HB + 0.45, F + 0.2, { bg: '#2a1e18', fg: '#e8d8b0', font: 'bold 72px serif' });
      sign(`No. ${10 + Math.floor(rng() * 89)}`, 1.4, 0.4, DX, 3.4, F + 0.08, { bg: '#e8e0c8', fg: '#2a1a10', font: 'bold 70px serif' });
      break;
    }
    case 'warehouse': {
      const [a, b] = zone(wide);
      const dw = Math.min(b - a, 16);
      const dx = wide > 0 ? a + dw / 2 : b - dw / 2;
      if (dw > 6) {
        solid(LP.makeLoadingDock(dw), dx, F + 1.6, dw, 3.2);
        const doorMat = L({ map: tex('sheetMetal'), color: 0xc8c0a0, roughness: 0.6, metalness: 0.3 });
        for (let x = dx - dw / 2 + 2.2; x < dx + dw / 2 - 1.5; x += 4.4) group.add(box(3.2, 3.6, 0.1, doorMat, x, 1.2 + 1.8, F + 0.06));
        solid(LP.makeTrailer(), dx, F + 3.2 + 6.4, 2.6, 12.5);
      }
      const [c0, c1] = zone(-wide);
      for (let i = 0; i < 4 && c1 - c0 > 2.5; i++) {
        const x = c0 + 1.2 + rng() * (c1 - c0 - 2.4);
        const z = F + 3 + rng() * (LZ1 - F - 6);
        const stack = new THREE.Group();
        const crate = L({ map: tex('crate', 9) });
        const pallet = L({ map: tex('wood', 5) });
        stack.add(box(1.4, 0.15, 1.2, pallet, 0, 0.08, 0));
        const hgt = 1 + Math.floor(rng() * 3);
        for (let k = 0; k < hgt; k++) stack.add(box(1.2, 0.8, 1.0, crate, (rng() - 0.5) * 0.1, 0.55 + k * 0.82, 0));
        solid(mergeStatic(stack), x, z, 1.4, 1.2, rng() * 0.3);
      }
      sign(L_name, Math.min(16, (SX1 - SX0) * 0.6), 1.4, DX, HB - 1.4, F + 0.08, { bg: '#3a3e40', fg: '#e8c040', font: 'bold 80px sans-serif' });
      break;
    }
    case 'police': {
      sidewalk(2.6);
      parking(wide, F + 6.2, ['police', 'police', 'sedan']);
      parking(-wide, F + 6.2, ['police', 'suv'], 0.5);
      const fx = DX - wide * 5;
      if (fx > LX0 + 1 && fx < LX1 - 1) solid(LP.makeFlagpole(), fx, LZ1 - 2.5, 0.3, 0.3);
      lamps(LZ1 - 3);
      group.add(box(SX1 - SX0, 0.5, 0.1, L({ color: 0x2a4a8a, roughness: 0.6 }), (SX0 + SX1) / 2, 3.6, F + 0.05));
      sign('POLICE', 7, 1.4, DX, HB - 1.3, F + 0.1, { bg: '#e8e8e8', fg: '#1a2a5a', font: 'bold 110px sans-serif', lit: true });
      sign(L_name, 6, 0.5, DX, 3.3, F + 0.1, { bg: '#1a2a5a', fg: '#e8e8e8', font: 'bold 60px sans-serif' });
      break;
    }
    case 'hospital': {
      // ambulance bay canopy over the entrance
      const cwid = 10;
      group.add(box(cwid, 0.3, 7, L({ color: 0xe0e0dc, roughness: 0.6 }), DX, 3.9, F + 3.5));
      for (const s of [-1, 1]) {
        group.add(box(0.35, 3.9, 0.35, L({ color: 0xc8c8c4 }), DX + s * (cwid / 2 - 0.4), 1.95, F + 6.6));
        world.addCollider(DX + s * (cwid / 2 - 0.4) - 0.2, F + 6.4, DX + s * (cwid / 2 - 0.4) + 0.2, F + 6.8);
      }
      sign('EMERGENCY', 7, 0.7, DX, 3.9, F + 7.06, { bg: '#c01a14', fg: '#ffffff', font: 'bold 80px sans-serif', lit: true });
      const amb = LP.makeVehicle('ambulance', rng);
      solid(amb.mesh, DX + wide * 3.9, F + 3.8, amb.w, amb.len, Math.PI);
      parking(-wide, F + 9, ['sedan', 'suv', 'van']);
      parking(wide, LZ1 - 3.4, ['sedan', 'suv'], 0.5);
      lamps(LZ1 - 2.5);
      sign(L_name, Math.min(16, (SX1 - SX0) * 0.6), 1.3, DX, HB - 1.0, F + 0.1, { bg: '#e8e8e4', fg: '#2a4a6a', font: 'bold 80px sans-serif', lit: true });
      sign('+', 1.6, 1.6, DX + wide * Math.min(9, (SX1 - SX0) / 2 - 2), HB - 1.0, F + 0.1, { w: 128, h: 128, bg: '#e8e8e4', fg: '#c01a14', font: 'bold 120px sans-serif', lit: true });
      break;
    }
    case 'military': {
      for (const side of [-1, 1]) {
        const [a, b] = zone(side);
        if (b - a < 3) continue;
        deco(LP.makeSandbags(Math.min(6, b - a - 1), 3), (a + b) / 2, F + 3, Math.PI / 2);
        world.addCollider((a + b) / 2 - Math.min(3, (b - a - 1) / 2), F + 2.7, (a + b) / 2 + Math.min(3, (b - a - 1) / 2), F + 3.3);
      }
      const hv = LP.makeVehicle('humvee', rng);
      const [a, b] = zone(wide);
      if (b - a > 3) solid(hv.mesh, (a + b) / 2, F + 9, hv.w, hv.len, Math.PI + 0.2);
      const [c0, c1] = zone(-wide);
      if (c1 - c0 > 4) solid(LP.makeWatchtower(), (c0 + c1) / 2, LZ1 - 3.5, 2.4, 2.4);
      const gx = DX + wide * 4.6;
      if (gx > LX0 + 1.5 && gx < LX1 - 1.5) solid(LP.makeGuardBooth(), gx, LZ1 - 2, 2.2, 2.2);
      const fx = DX - wide * 4.5;
      if (fx > LX0 + 1 && fx < LX1 - 1) solid(LP.makeFlagpole(), fx, F + 1.2, 0.3, 0.3);
      sign(`${L_name} · RESTRICTED AREA`, 9, 0.9, DX, 3.9, F + 0.1, { bg: '#2a2c22', fg: '#e8e0c0', font: 'bold 60px sans-serif' });
      break;
    }
  }
  switch (type) {
    case 'stadium': {
      sidewalk(3);
      parking(wide, F + 7, ['sedan', 'suv', 'van', 'pickup'], 0.5);
      parking(-wide, F + 7, ['sedan', 'suv', 'van'], 0.4);
      parking(wide, LZ1 - 4, ['sedan', 'suv'], 0.3);
      for (const side of [-1, 1]) {
        const [a, b] = zone(side);
        if (b - a > 2) solid(makeLightTower(), side < 0 ? a + 0.6 : b - 0.6, F + 3.2, 0.5, 0.5);
      }
      for (let k = 0; k < 4; k++) {
        const jx = DX + (k < 2 ? -1 : 1) * (3.6 + (k % 2) * 3.2);
        if (jx > LX0 + 1.5 && jx < LX1 - 1.5) solid(LP.makeJersey(3), jx, LZ1 - 6, 3, 0.6);
      }
      sign(L_name, Math.min(22, (SX1 - SX0) * 0.7), 2.2, DX, HB - 2.2, F + 0.12, { bg: '#1a2a4a', fg: '#f0e8d0', font: 'bold 80px sans-serif', lit: true });
      sign('QUARANTINE ZONE · NO ENTRY', 7, 0.7, DX, 3.6, F + 0.12, { bg: '#e8e0c8', fg: '#a01810', font: 'bold 56px sans-serif' });
      break;
    }
    case 'railyard': {
      const [a, b] = zone(wide);
      const len = LZ1 - F - 2;
      for (let t = 0; t < 2; t++) {
        const tx = wide > 0 ? b - 2 - t * 4.2 : a + 2 + t * 4.2;
        if (Math.abs(tx - DX) < 4.5 || tx < LX0 + 1.5 || tx > LX1 - 1.5) continue;
        deco(makeRails(len), tx, F + 1 + len / 2);
        if (t === 0 || rng() < 0.6) {
          const car = mergeStatic(makeTrainCar(rng() < 0.7 ? 'box' : 'flat', Math.floor(rng() * 9)));
          solid(car, tx, F + 1 + len / 2 + (rng() - 0.5) * 4, 3, 9.4);
        }
      }
      const [c0, c1] = zone(-wide);
      if (c1 - c0 > 4) {
        solid(makeCoalPile(2.6, 2.4), (c0 + c1) / 2, F + 6, 4.4, 4.4);
        solid(LP.makeDumpster(0x3a3a2a), (c0 + c1) / 2, LZ1 - 3, 2, 1.2);
      }
      sign(L_name, Math.min(14, (SX1 - SX0) * 0.55), 1.2, DX, HB - 1.2, F + 0.1, { bg: '#2a1a14', fg: '#e8d8b0', font: 'bold 70px serif' });
      break;
    }
    case 'mall': {
      sidewalk(3.2);
      parking(wide, F + 7, ['sedan', 'suv', 'van', 'pickup'], 0.55);
      parking(-wide, F + 7, ['sedan', 'suv', 'pickup'], 0.5);
      parking(wide, LZ1 - 4.5, ['sedan', 'suv'], 0.35);
      parking(-wide, LZ1 - 4.5, ['sedan', 'van'], 0.3);
      lamps(F + 11.5);
      group.add(box(10, 0.3, 4, L({ color: 0x8a7a6a, roughness: 0.5 }), DX, 4.4, F + 2)); // entrance canopy
      sign(L_name, Math.min(18, (SX1 - SX0) * 0.6), 1.6, DX, HB - 1.6, F + 0.12, { bg: '#f0ece0', fg: '#7a1a40', font: 'bold 84px serif', lit: true });
      const px = DX + wide * Math.min(12, (LX1 - LX0) / 2 - 2);
      if (px > LX0 + 1 && px < LX1 - 1) solid(LP.makePoleSign(L_name, ['OPEN 10–9', 'FOOD COURT'], 8), px, LZ1 - 1.4, 0.6, 0.6);
      break;
    }
    case 'grain': {
      const [a, b] = zone(wide);
      const n = Math.min(3, Math.floor((b - a) / 5.8));
      for (let i = 0; i < n; i++) solid(makeSilo(2.5, 15 + rng() * 5), wide > 0 ? b - 2.8 - i * 5.8 : a + 2.8 + i * 5.8, F + 4.5, 5, 5);
      const [c0, c1] = zone(-wide);
      if (c1 - c0 > 4) {
        const tr = LP.makeVehicle('pickup', rng);
        solid(tr.mesh, (c0 + c1) / 2, F + 8, tr.w, tr.len, Math.PI + 0.3);
        solid(LP.makeTrailer(), (c0 + c1) / 2, LZ1 - 8, 2.6, 12.5);
      }
      sign(L_name, Math.min(14, (SX1 - SX0) * 0.6), 1.3, DX, HB - 1.3, F + 0.1, { bg: '#7a2a1a', fg: '#f0e0c0', font: 'bold 70px serif' });
      break;
    }
    case 'mine': {
      const [a, b] = zone(wide);
      if (b - a > 5) solid(makeHeadframe(14 + rng() * 4), (a + b) / 2, F + 6, 3.4, 3.4);
      const [c0, c1] = zone(-wide);
      if (c1 - c0 > 5) {
        solid(makeCoalPile(3.2, 3.2), (c0 + c1) / 2, F + 5.5, 5.4, 5.4);
        if (LZ1 - F > 16) solid(makeCoalPile(2.4, 2.2), (c0 + c1) / 2 + (rng() - 0.5) * 2, LZ1 - 5, 4, 4);
      }
      const cart = new THREE.Group();
      cart.add(box(1.2, 0.8, 1.8, L({ color: 0x4a3a30, roughness: 0.7, metalness: 0.5 }), 0, 0.7, 0));
      cart.add(box(1.0, 0.3, 1.6, L({ map: tex('coal'), roughness: 0.95 }), 0, 1.15, 0));
      const cx2 = DX + wide * 4.6;
      if (cx2 > LX0 + 1.5 && cx2 < LX1 - 1.5) solid(cart, cx2, LZ1 - 3, 1.2, 1.8, 0.2);
      sign(L_name, Math.min(12, (SX1 - SX0) * 0.6), 1.1, DX, HB - 1.0, F + 0.1, { bg: '#1a1612', fg: '#e8c070', font: 'bold 70px serif' });
      break;
    }
  }
  if (type === 'skyscraper') {
    // a paved plaza with a fountain, planters and flags
    group.add(LP.makeGroundPatch('concreteSlab', LX1 - LX0, LZ1 - F, 2, { y: 0.011 }).translateX((LX0 + LX1) / 2).translateZ((F + LZ1) / 2));
    group.add(box(8, 0.2, 4, L({ color: 0x1e2226, roughness: 0.3, metalness: 0.7 }), DX, 4.2, F + 2)); // entrance canopy
    for (const s of [-1, 1]) group.add(box(0.2, 4.2, 0.2, L({ color: 0x9aa0a6, roughness: 0.3, metalness: 0.8 }), DX + s * 3.8, 2.1, F + 3.8));
    const [a, b] = zone(wide);
    if (b - a > 7) {
      const fx = (a + b) / 2;
      const fz = F + 8.5;
      const stone = L({ map: tex('concreteSlab'), color: 0xc8c4bc, roughness: 0.8 });
      const basin = new THREE.Mesh(new THREE.CylinderGeometry(3, 3.1, 0.7, 24), stone);
      basin.position.set(0, 0.35, 0);
      const water = new THREE.Mesh(new THREE.CircleGeometry(2.75, 24), L({ color: 0x2a3a30, roughness: 0.15, metalness: 0.2 }));
      water.rotation.x = -Math.PI / 2;
      water.position.y = 0.6;
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 2.2, 10), stone);
      pillar.position.y = 1.1;
      const f = new THREE.Group();
      f.add(basin, water, pillar);
      solid(f, fx, fz, 6, 6);
    }
    const [c0, c1] = zone(-wide);
    for (let x = c0 + 1.5; x < c1 - 1.5; x += 5) {
      const pl = new THREE.Group();
      pl.add(box(1.6, 0.8, 1.6, L({ map: tex('concreteSlab'), color: 0x9a968e }), 0, 0.4, 0));
      const tr = LP.makeLeafyTree(rng, biome === 'tundra');
      tr.scale.setScalar(0.6);
      tr.position.y = 0.6;
      pl.add(tr);
      solid(pl, x, F + 6, 1.6, 1.6);
    }
    for (let k = -1; k <= 1; k++) {
      const fx = DX + wide * 6 + k * 2;
      if (fx > LX0 + 1 && fx < LX1 - 1) solid(LP.makeFlagpole(11), fx, LZ1 - 2.4, 0.3, 0.3);
    }
    lamps(LZ1 - 4.5);
    deco(LP.makeBench(), DX - wide * 4.2, F + 1.4, Math.PI);
    sign(L_name, Math.min(12, (SX1 - SX0) * 0.5), 1.0, DX, 5.2, F + 0.12, { bg: '#14181c', fg: '#e8eef4', font: 'bold 70px sans-serif', lit: true });
    const mx = DX + wide * 4.5;
    if (mx > LX0 + 2 && mx < LX1 - 2) {
      solid(box(3.6, 1.0, 0.6, L({ color: 0x2a2e34, roughness: 0.4, metalness: 0.5 }), 0, 0.5, 0), mx, LZ1 - 1.0, 3.6, 0.6);
      sign(L_name, 3.3, 0.6, mx, 0.55, LZ1 - 0.68, { bg: '#2a2e34', fg: '#d8c890', font: 'bold 60px sans-serif' });
    }
  }
  fenceSides();

  // ---------- the street ----------
  const W = d.W * TILE;
  const span = W + 200;
  const cx = W / 2;
  group.add(LP.makeGroundPatch('concreteSlab', span, 2.6, 1, { y: 0.02 }).translateX(cx).translateZ(LZ1 + 1.3));
  group.add(box(span, 0.15, 0.3, L({ map: tex('concreteSlab') }), cx, 0.075, LZ1 + 2.6));
  group.add(LP.makeGroundPatch('asphalt', span, 10, 1, { y: 0.008 }).translateX(cx).translateZ(LZ1 + 7.75));
  const dash = new THREE.Group();
  for (let x = -90; x < W + 90; x += 6) {
    const l = LP.makeLine(3, 0.15, 0xd8b830);
    l.rotation.z = Math.PI / 2;
    l.position.set(x, 0.014, LZ1 + 7.75);
    dash.add(l);
  }
  group.add(mergeStatic(dash, false));
  group.add(LP.makeGroundPatch('concreteSlab', span, 2.6, 1, { y: 0.02 }).translateX(cx).translateZ(LZ1 + 14.1));
  // abandoned cars on the road
  for (let i = 0; i < 3; i++) {
    const car = LP.makeVehicle(['sedan', 'suv', 'van', 'pickup'][Math.floor(rng() * 4)], rng);
    deco(car.mesh, cx + (rng() - 0.5) * W * 1.4, LZ1 + 5 + rng() * 5.5, Math.PI / 2 + (rng() - 0.5) * 0.8);
  }
  // street lights along the near kerb (dark now; the power's long gone)
  for (let x = -60; x < W + 60; x += 18) {
    if (Math.abs(x - DX) < 6) continue;
    const lp = LP.makeLampPost(7);
    deco(lp.group, x, LZ1 + 2.0, Math.PI);
  }
  // the far side of the street: a row of other buildings and trees
  const facades = ['facadeBrick', 'facadeSiding', 'facadeConcrete', 'facadeShop', 'facadeMetal'];
  for (let x = -80; x < W + 80; ) {
    const w = 10 + rng() * 14;
    if (rng() < 0.25) {
      deco(treeFor(biome, rng), x + w / 2, LZ1 + 18 + rng() * 4);
      x += w * 0.6;
      continue;
    }
    // downtowns tower over the street
    const tall = size >= 2 && rng() < (size >= 3 ? 0.55 : 0.3);
    const h = tall ? 20 + rng() * (size >= 3 ? 60 : 30) : 5 + rng() * 11;
    const fname = tall ? (rng() < 0.5 ? 'facadeTower' : 'facadeConcrete') : facades[Math.floor(rng() * facades.length)];
    const t = tex(fname, ({ facadeBrick: 63, facadeSiding: 60, facadeConcrete: 69, facadeShop: 78, facadeMetal: 75, facadeTower: 90 })[fname] + Math.floor(rng() * 3)).clone();
    t.needsUpdate = true;
    t.repeat.set(Math.max(1, Math.round(w / 3)), Math.max(1, Math.round(h / 3.4)));
    const bm = new THREE.Mesh(new THREE.BoxGeometry(w, h, 12), [L({ map: t }), L({ map: t }), L({ color: 0x3a3a38 }), L({ color: 0x3a3a38 }), L({ map: t }), L({ map: t })]);
    bm.position.set(x + w / 2, h / 2, LZ1 + 22 + rng() * 3);
    bm.castShadow = true;
    bm.receiveShadow = true;
    group.add(bm);
    x += w + rng() * 4;
  }
  // trees and fences around the sides of the building
  for (let i = 0; i < 14; i++) {
    const side = rng() < 0.5 ? -1 : 1;
    const x = side < 0 ? SX0 - 3 - rng() * 30 : SX1 + 3 + rng() * 30;
    const z = SZ0 + rng() * (LZ1 - SZ0);
    deco(treeFor(biome, rng), x, z);
  }
  // ground beyond the grid
  group.add(groundFrame(scene, d.W * TILE, d.H * TILE));
  // grass on the verges (and the lawn, at a house)
  const G = { grass: [5000, 0x5a7a3a, 0.48], prairie: [5000, 0xb8a060, 0.5], marsh: [4000, 0x4a6a34, 0.55], sand: [1200, 0xa89660, 0.36], snow: [400, 0xb4ac8c, 0.32] }[d.theme.outside];
  if (G) {
    group.add(
      makeGrass({
        count: G[0],
        color: G[1],
        height: G[2],
        x0: SX0 - 45,
        x1: SX1 + 45,
        z0: SZ0 - 25,
        z1: LZ1 - 0.2,
        rng,
        place: (x, z) => {
          if (x > SX0 - 0.6 && x < SX1 + 0.6 && z < F + 0.6) return false; // the building
          const tx = Math.floor(x / TILE);
          const ty = Math.floor(z / TILE);
          if (tx < 0 || ty < 0 || tx >= d.W || ty >= d.H) return true;
          if (d.tiles[ty * d.W + tx] !== T.YARD) return true;
          if (type !== 'home' || z < F + 2.2) return false;
          return !paths.some(([a, b]) => x > a && x < b);
        },
      })
    );
  }

  // ---------- the way back to camp ----------
  const post = new THREE.Group();
  post.add(box(0.12, 1.7, 0.12, L({ map: tex('wood', 5) }), 0, 0.85, 0));
  const arrow = LP.makeSign('◂ TO CAMP', 1.3, 0.38, { w: 256, h: 76, bg: '#5a4028', fg: '#f0e0b8', font: 'bold 54px serif' });
  arrow.position.set(0, 1.45, -0.07);
  arrow.rotation.y = Math.PI;
  post.add(arrow);
  const glow = glowSprite(0xffd080, 0.9, 0.6);
  glow.position.set(0, 1.85, 0);
  post.add(glow);
  deco(post, d.exit.x, d.exit.z);
  world.addCollider(d.exit.x - 0.1, d.exit.z - 0.1, d.exit.x + 0.1, d.exit.z + 0.1);

  (scene.fgroup || scene.group).add(group);
  return { exit: { x: d.exit.x, z: d.exit.z, glow } };
}

function treeFor(biome, rng) {
  if (biome === 'desert') return rng() < 0.6 ? P.makeCactus(rng).mesh : P.makeDeadTree(rng).mesh;
  if (biome === 'tundra') return rng() < 0.7 ? P.makePine(rng, true).mesh : P.makeDeadTree(rng).mesh;
  return rng() < 0.5 ? P.makePine(rng, false).mesh : LP.makeLeafyTree(rng);
}

// A huge ground plane with a hole where the building's grid is.
function groundFrame(scene, w, h) {
  // ShapeGeometry lies in XY facing +z; rotateX(-PI/2) maps (x, y) to
  // (x, -y) on the ground facing up, so the shape is drawn with y = -z.
  const R = 400;
  const shape = new THREE.Shape();
  shape.moveTo(-R, R);
  shape.lineTo(-R, -(R + h));
  shape.lineTo(R + w, -(R + h));
  shape.lineTo(R + w, R);
  shape.lineTo(-R, R);
  const hole = new THREE.Path();
  hole.moveTo(0, 0);
  hole.lineTo(w, 0);
  hole.lineTo(w, -h);
  hole.lineTo(0, -h);
  hole.lineTo(0, 0);
  shape.holes.push(hole);
  const geo = new THREE.ShapeGeometry(shape);
  geo.rotateX(-Math.PI / 2);
  const uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / 3, uv.getY(i) / 3);
  const t = tex(scene.d.theme.outside || 'grass', 31).clone();
  t.needsUpdate = true;
  const m = new THREE.Mesh(geo, macroVary(L({ map: t, roughness: 1 })));
  m.position.y = -0.005;
  m.receiveShadow = true;
  return m;
}
