// The first-person weapon: the gun in your hands, your hands on it, and how
// it all moves. Hip carry and aiming down the sights (the rear sight lines up
// with the eye, scopes zoom), recoil on springs (the gun kicks back and up,
// the slide or bolt cycles, a pump is racked, a revolver's cylinder turns),
// reloads played out by both hands (magazine out, a fresh one in, the slide
// or charging handle racked), a lowered carry when sprinting, sway and bob.
import * as THREE from 'three';
import { tex } from './textures.js';
import { lambert as L } from './models.js';
import { makeGunModel, hand, limb } from './gunModels.js';
import { damp, clamp } from './util.js';

const vmSkin = () => L({ color: 0xb08068, emissive: 0x1e140e, roughness: 0.62 });
const vmSleeve = (c = 0x2a2620) => L({ color: c, emissive: new THREE.Color(c).multiplyScalar(0.25), roughness: 0.95, map: tex('fabric', 40) });

// hip position of the grip in view space, model scale, where the support hand
// holds it (model space z), how far the rear sight sits from the eye when
// aiming, the zoomed field of view and how fast it comes up
const POSE = {
  pistol: { pos: [0.19, -0.2, -0.46], scale: 1.4, fore: null, eye: -0.24, fov: 60, ads: 9 },
  smg: { pos: [0.17, -0.19, -0.37], scale: 1.25, fore: -0.22, eye: -0.16, fov: 56, ads: 8 },
  shotgun: { pos: [0.16, -0.2, -0.31], scale: 1.1, fore: -0.3, eye: -0.15, fov: 60, ads: 7 },
  rifle: { pos: [0.16, -0.2, -0.31], scale: 1.12, fore: -0.3, eye: -0.13, fov: 50, ads: 7 },
  sniper: { pos: [0.16, -0.2, -0.3], scale: 1.05, fore: -0.34, eye: -0.09, fov: 18, ads: 5 },
  lmg: { pos: [0.17, -0.23, -0.32], scale: 1.0, fore: -0.36, eye: -0.15, fov: 56, ads: 5 },
  launcher: { pos: [0.18, -0.2, -0.3], scale: 1.0, fore: -0.2, eye: -0.16, fov: 56, ads: 6 },
  bow: { pos: [0.1, -0.12, -0.42], scale: 0.9, fore: -0.12, eye: -0.32, fov: 58, ads: 7 },
  thrown: { pos: [0.22, -0.2, -0.42], scale: 1.6, fore: null, eye: null, fov: 72, ads: 8 },
  flame: { pos: [0.2, -0.24, -0.38], scale: 0.95, fore: -0.3, eye: null, fov: 72, ads: 6 },
  melee: { pos: [0.24, -0.26, -0.36], scale: 1.0, fore: null, eye: null, fov: 72, ads: 8 },
};
// how each kind of gun kicks: camera climb and punch (rad), sideways wander,
// the gun's slide back and rise
export const RECOIL = {
  pistol: { climb: 0.02, punch: 0.04, side: 0.008, back: 0.06, rise: 0.28 },
  smg: { climb: 0.007, punch: 0.012, side: 0.007, back: 0.022, rise: 0.07 },
  shotgun: { climb: 0.05, punch: 0.075, side: 0.012, back: 0.11, rise: 0.38 },
  rifle: { climb: 0.011, punch: 0.02, side: 0.008, back: 0.035, rise: 0.11 },
  sniper: { climb: 0.055, punch: 0.085, side: 0.01, back: 0.11, rise: 0.32 },
  lmg: { climb: 0.008, punch: 0.012, side: 0.011, back: 0.028, rise: 0.08 },
  launcher: { climb: 0.04, punch: 0.06, side: 0.01, back: 0.1, rise: 0.25 },
  bow: { climb: 0.004, punch: 0.01, side: 0.002, back: 0.02, rise: 0.04 },
  thrown: { climb: 0, punch: 0.01, side: 0, back: 0, rise: 0 },
  flame: { climb: 0.001, punch: 0.002, side: 0.002, back: 0.004, rise: 0.01 },
  melee: { climb: 0, punch: 0, side: 0, back: 0, rise: 0 },
};
export const canAim = (def) => def && POSE[def.cat]?.eye != null;
export const isScoped = (def) => def && (def.look?.scope || def.cat === 'sniper');
export const aimFov = (def) => (def?.look?.scope && def.cat !== 'sniper' ? 32 : POSE[def?.cat]?.fov ?? 72);

export function makeViewModel(def) {
  const g = new THREE.Group();
  const skin = vmSkin();
  const sleeveMat = vmSleeve();
  const metal = L({ color: 0x3a3a3e, emissive: 0x0e0e10, roughness: 0.4, metalness: 0.7 });
  const pose = POSE[def.cat] || POSE.pistol;
  const gun = new THREE.Group();
  gun.position.set(...pose.pos);
  g.add(gun);
  const model = makeGunModel(def, true);
  const scale = pose.scale * 0.62;
  model.group.scale.setScalar(scale);
  gun.add(model.group);
  if (def.cat === 'melee') {
    model.group.rotation.set(0.9, 0.25, 0.15);
    model.group.position.set(0, -0.02, 0.02);
  }
  // right hand on the grip, forearm and sleeve running back out of view
  const right = new THREE.Group();
  right.add(hand(skin, 0, -0.055, 0.055));
  right.add(limb(0.028, 0.1, skin, 0, -0.07, 0.13));
  right.add(limb(0.04, 0.16, sleeveMat, 0, -0.085, 0.24, 1.05, 1));
  gun.add(right);
  let left = null;
  let leftBase = null;
  let lens = null;
  let torch = null;
  if (pose.fore != null) {
    // the support hand under the handguard (or on the pump)
    left = new THREE.Group();
    // the palm cups the handguard from below, fingers curling up its far side
    const lh = hand(skin, 0, 0, 0);
    lh.rotation.z = 0.9;
    left.add(lh);
    const fore = limb(0.027, 0.12, skin, -0.035, -0.035, 0.1);
    fore.rotation.y = 0.35;
    left.add(fore);
    const sleeve = limb(0.04, 0.2, sleeveMat, -0.085, -0.065, 0.24);
    sleeve.rotation.y = 0.35;
    left.add(sleeve);
    // palm under the handguard, fingers wrapping up its left side
    leftBase = new THREE.Vector3(def.cat === 'bow' ? 0 : -0.004, def.cat === 'bow' ? 0 : -0.024, pose.fore * scale);
    left.position.copy(leftBase);
    gun.add(left);
  } else {
    // a flashlight in the left hand
    torch = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.24, 10), metal);
    body.rotation.x = Math.PI / 2;
    torch.add(body);
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.07, 10), metal);
    head.rotation.x = Math.PI / 2;
    head.position.z = -0.15;
    torch.add(head);
    for (let k = 0; k < 4; k++) {
      const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.008, 10), L({ color: 0x1a1a1c, roughness: 0.8 }));
      ring.rotation.x = Math.PI / 2;
      ring.position.z = 0.02 + k * 0.025;
      torch.add(ring);
    }
    lens = new THREE.Mesh(new THREE.CircleGeometry(0.044, 12), new THREE.MeshBasicMaterial({ color: 0xfff2cc }));
    lens.position.z = -0.187;
    lens.rotation.y = Math.PI;
    torch.add(lens);
    torch.add(hand(skin, 0, -0.025, 0.05, 1.3));
    torch.add(limb(0.036, 0.12, skin, 0, -0.04, 0.15));
    torch.add(limb(0.052, 0.2, sleeveMat, 0, -0.05, 0.3));
    torch.position.set(-0.22, -0.22, -0.5);
    torch.scale.setScalar(0.65);
    g.add(torch);
  }
  const flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex('glow'), color: 0xffcc66, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0 }));
  flash.scale.set(0.35, 0.35, 0.35);
  model.muzzle.add(flash);
  if (def.cat === 'melee' || def.cat === 'bow' || def.cat === 'thrown') flash.visible = false;
  g.traverse((o) => {
    if (o.isMesh || o.isSprite) {
      o.castShadow = false;
      o.renderOrder = 10;
    }
  });
  // aiming: the rear sight on the eye line, a hand's breadth away
  let adsPos = null;
  const sg = model.sight;
  if (pose.eye != null && sg) adsPos = new THREE.Vector3(0, -sg.y * scale, pose.eye - sg.rear * scale);
  // remember where the moving parts sit
  const P = model.parts;
  const base = {};
  for (const k of ['slide', 'mag', 'pump', 'bolt', 'cyl', 'lever', 'cover']) if (P[k]) base[k] = P[k].position.clone();
  return { group: g, gun, model, flash, lens, torch, def, basePos: pose.pos.slice(), adsPos, scale, left, leftBase, right, base, pose, recoil: RECOIL[def.cat] || RECOIL.pistol };
}

// Empty-handed view model (no weapon equipped).
export function makeFistsViewModel() {
  const g = new THREE.Group();
  const skin = vmSkin();
  const gun = new THREE.Group();
  gun.position.set(0.2, -0.24, -0.4);
  gun.add(hand(skin, 0, 0, 0, 1.4));
  gun.add(limb(0.032, 0.12, skin, 0, -0.02, 0.1));
  gun.add(limb(0.045, 0.2, vmSleeve(), 0, -0.03, 0.26));
  g.add(gun);
  const flash = new THREE.Sprite(new THREE.SpriteMaterial({ opacity: 0, transparent: true }));
  flash.visible = false;
  g.add(flash);
  g.traverse((o) => {
    if (o.isMesh) o.renderOrder = 10;
  });
  return { group: g, gun, model: { group: gun, muzzle: gun, spin: null, flame: null, parts: {}, sight: null }, flash, lens: null, torch: null, def: null, basePos: [0.2, -0.24, -0.4], adsPos: null, scale: 1, base: {}, pose: POSE.melee, recoil: RECOIL.melee };
}

// ---------------------------------------------------------------- reloads
// Keyframes over the reload (t 0..1). gun: offset [x,y,z] and turn [rx,ry,rz];
// hand: where the support hand goes ('base', 'mag', 'bolt', 'port', 'out',
// 'muzzle') plus an offset; mag: how far the magazine has dropped (m) and
// whether it's there; act: slide / bolt / pump / cover / cylinder.
const K = (t, o) => ({ t, ...o });
const RELOADS = {
  mag: [
    K(0, { gun: [0, 0, 0, 0, 0, 0], hand: 'base' }),
    K(0.14, { gun: [0, -0.01, 0.02, 0.12, 0.22, -0.42], hand: 'mag', ho: [0, -0.02, 0] }),
    K(0.26, { gun: [0, -0.01, 0.02, 0.1, 0.22, -0.45], hand: 'mag', ho: [0, -0.07, 0], mag: 0.05 }),
    K(0.36, { gun: [0, -0.015, 0.02, 0.1, 0.24, -0.45], hand: 'out', mag: 0.6, magGone: true }),
    K(0.5, { gun: [0, -0.015, 0.02, 0.12, 0.24, -0.45], hand: 'mag', ho: [0, -0.13, 0], mag: 0.12 }),
    K(0.66, { gun: [0, 0.0, 0.015, 0.16, 0.22, -0.42], hand: 'mag', ho: [0, -0.02, 0], mag: 0 }),
    K(0.7, { gun: [0, 0.012, 0.01, 0.08, 0.22, -0.4], hand: 'mag', mag: 0 }),
    K(0.8, { gun: [0, 0, 0.01, 0.06, 0.18, -0.25], hand: 'bolt' }),
    K(0.88, { gun: [0, 0, 0.01, 0.06, 0.16, -0.22], hand: 'bolt', ho: [0, 0, 0.05], act: 1 }),
    K(0.93, { gun: [0, 0, 0, 0.03, 0.08, -0.1], hand: 'bolt', act: 0 }),
    K(1, { gun: [0, 0, 0, 0, 0, 0], hand: 'base' }),
  ],
  pistol: [
    K(0, { gun: [0, 0, 0, 0, 0, 0], torch: [0, 0, 0] }),
    K(0.14, { gun: [-0.03, 0.02, 0.03, 0.22, 0.2, -0.35], torch: [-0.04, -0.2, 0.12] }),
    K(0.24, { gun: [-0.03, 0.02, 0.03, 0.22, 0.2, -0.38], mag: 0.05, torch: [-0.06, -0.32, 0.15] }),
    K(0.32, { gun: [-0.03, 0.02, 0.03, 0.2, 0.2, -0.38], mag: 0.5, magGone: true, torch: [-0.06, -0.34, 0.15] }),
    K(0.5, { gun: [-0.03, 0.02, 0.03, 0.22, 0.2, -0.38], mag: 0.14, torch: [-0.06, -0.3, 0.15] }),
    K(0.64, { gun: [-0.02, 0.03, 0.02, 0.26, 0.18, -0.3], mag: 0, torch: [-0.05, -0.25, 0.12] }),
    K(0.7, { gun: [-0.02, 0.04, 0.02, 0.12, 0.15, -0.28], mag: 0 }),
    K(0.8, { gun: [-0.02, 0.02, 0.02, 0.08, 0.1, -0.2], act: 1, torch: [-0.03, -0.18, 0.08] }),
    K(0.88, { gun: [0, 0.01, 0.01, 0.04, 0.05, -0.1], act: 0, torch: [-0.02, -0.08, 0.04] }),
    K(1, { gun: [0, 0, 0, 0, 0, 0], torch: [0, 0, 0] }),
  ],
  revolver: [
    K(0, { gun: [0, 0, 0, 0, 0, 0], torch: [0, 0, 0] }),
    K(0.14, { gun: [-0.05, 0.03, 0.02, 0.1, 0.1, 0.65], torch: [-0.04, -0.2, 0.12], act: 1 }),
    K(0.3, { gun: [-0.05, 0.05, 0.02, -0.7, 0.1, 0.5], torch: [-0.05, -0.3, 0.14], act: 1 }),
    K(0.45, { gun: [-0.05, 0.02, 0.02, 0.6, 0.1, 0.6], torch: [-0.05, -0.3, 0.14], act: 1 }),
    K(0.75, { gun: [-0.05, 0.02, 0.02, 0.55, 0.1, 0.6], torch: [-0.04, -0.22, 0.1], act: 1 }),
    K(0.85, { gun: [-0.02, 0.01, 0.01, 0.1, 0.05, 0.2], act: 0, torch: [-0.02, -0.1, 0.05] }),
    K(1, { gun: [0, 0, 0, 0, 0, 0], torch: [0, 0, 0] }),
  ],
  shells: [
    K(0, { gun: [0, 0, 0, 0, 0, 0], hand: 'base' }),
    K(0.1, { gun: [0, 0.01, 0.02, 0.05, 0.25, -0.65], hand: 'port' }),
    K(0.2, { gun: [0, 0.01, 0.02, 0.05, 0.25, -0.65], hand: 'out' }),
    K(0.3, { gun: [0, 0.012, 0.02, 0.06, 0.25, -0.66], hand: 'port', ho: [0, 0, 0.03] }),
    K(0.4, { gun: [0, 0.01, 0.02, 0.05, 0.25, -0.65], hand: 'out' }),
    K(0.5, { gun: [0, 0.012, 0.02, 0.06, 0.25, -0.66], hand: 'port', ho: [0, 0, 0.03] }),
    K(0.6, { gun: [0, 0.01, 0.02, 0.05, 0.25, -0.65], hand: 'out' }),
    K(0.7, { gun: [0, 0.012, 0.02, 0.06, 0.25, -0.66], hand: 'port', ho: [0, 0, 0.03] }),
    K(0.8, { gun: [0, 0.005, 0.01, 0.04, 0.12, -0.25], hand: 'base' }),
    K(0.87, { gun: [0, 0, 0.01, 0.04, 0.08, -0.15], hand: 'base', act: 1 }),
    K(0.94, { gun: [0, 0, 0, 0.02, 0.04, -0.05], hand: 'base', act: 0 }),
    K(1, { gun: [0, 0, 0, 0, 0, 0], hand: 'base' }),
  ],
  breach: [
    K(0, { gun: [0, 0, 0, 0, 0, 0], hand: 'base' }),
    K(0.15, { gun: [0, -0.02, 0.03, 0.55, 0.15, -0.2], hand: 'port' }),
    K(0.35, { gun: [0, -0.03, 0.03, 0.6, 0.15, -0.2], hand: 'out' }),
    K(0.6, { gun: [0, -0.03, 0.03, 0.6, 0.15, -0.2], hand: 'port', ho: [0, 0.01, 0.02] }),
    K(0.75, { gun: [0, -0.02, 0.02, 0.5, 0.12, -0.15], hand: 'port' }),
    K(0.85, { gun: [0, 0.01, 0.01, -0.1, 0.05, -0.05], hand: 'base' }),
    K(1, { gun: [0, 0, 0, 0, 0, 0], hand: 'base' }),
  ],
  rocket: [
    K(0, { gun: [0, 0, 0, 0, 0, 0], hand: 'base' }),
    K(0.2, { gun: [0, -0.05, 0.05, -0.25, 0.3, -0.15], hand: 'out' }),
    K(0.55, { gun: [0, -0.05, 0.05, -0.25, 0.3, -0.15], hand: 'muzzle', ho: [0, 0, -0.08], warhead: 1 }),
    K(0.75, { gun: [0, -0.04, 0.04, -0.2, 0.25, -0.12], hand: 'muzzle', warhead: 1 }),
    K(1, { gun: [0, 0, 0, 0, 0, 0], hand: 'base', warhead: 1 }),
  ],
  lmg: [
    K(0, { gun: [0, 0, 0, 0, 0, 0], hand: 'base' }),
    K(0.12, { gun: [0, -0.02, 0.03, 0.15, 0.25, -0.35], hand: 'bolt', act: 0 }),
    K(0.22, { gun: [0, -0.02, 0.03, 0.15, 0.25, -0.35], hand: 'bolt', cover: 1 }),
    K(0.35, { gun: [0, -0.02, 0.03, 0.15, 0.25, -0.38], hand: 'mag', mag: 0.04, cover: 1 }),
    K(0.45, { gun: [0, -0.02, 0.03, 0.15, 0.25, -0.38], hand: 'out', mag: 0.6, magGone: true, cover: 1 }),
    K(0.62, { gun: [0, -0.02, 0.03, 0.15, 0.25, -0.38], hand: 'mag', ho: [0, -0.1, 0], mag: 0.1, cover: 1 }),
    K(0.74, { gun: [0, -0.01, 0.03, 0.15, 0.25, -0.35], hand: 'mag', mag: 0, cover: 1 }),
    K(0.85, { gun: [0, 0, 0.02, 0.12, 0.2, -0.3], hand: 'bolt', cover: 0 }),
    K(1, { gun: [0, 0, 0, 0, 0, 0], hand: 'base' }),
  ],
  draw: [
    K(0, { gun: [0, 0, 0, 0, 0, 0], arrow: 0 }),
    K(0.4, { gun: [0, -0.04, 0.03, 0.1, 0, 0.1], arrow: 0 }),
    K(0.7, { gun: [0, -0.01, 0.02, 0.03, 0, 0.05], arrow: 1 }),
    K(1, { gun: [0, 0, 0, 0, 0, 0], arrow: 1 }),
  ],
  throw: [
    K(0, { gun: [0, 0, 0, 0, 0, 0] }),
    K(0.4, { gun: [0, -0.3, 0.1, 0.4, 0, 0] }),
    K(1, { gun: [0, 0, 0, 0, 0, 0] }),
  ],
};
function reloadStyle(def) {
  if (!def) return null;
  const lk = def.look || {};
  if (def.cat === 'pistol') return lk.revolver ? 'revolver' : 'pistol';
  if (def.cat === 'shotgun') return lk.double ? 'breach' : lk.drum ? 'mag' : 'shells';
  if (def.cat === 'launcher') return lk.rpg ? 'rocket' : lk.drum ? 'shells' : 'breach';
  if (def.cat === 'lmg') return lk.gatling ? 'mag' : 'lmg';
  if (def.cat === 'rifle' && lk.lever) return 'shells';
  if (def.cat === 'bow') return 'draw';
  if (def.cat === 'thrown') return 'throw';
  if (def.cat === 'melee') return null;
  return 'mag';
}
const smooth = (t) => t * t * (3 - 2 * t);
function sample(keys, t) {
  let i = 0;
  while (i < keys.length - 2 && keys[i + 1].t <= t) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const k = smooth(clamp((t - a.t) / Math.max(1e-4, b.t - a.t), 0, 1));
  return { a, b, k };
}
const lerpArr = (a, b, k, n) => {
  const o = [];
  for (let i = 0; i < n; i++) o.push((a?.[i] ?? 0) + ((b?.[i] ?? 0) - (a?.[i] ?? 0)) * k);
  return o;
};

// ---------------------------------------------------------------- animator
const vTmp = new THREE.Vector3();
const vA = new THREE.Vector3();
const vB = new THREE.Vector3();
export class ViewModelAnim {
  constructor() {
    this.ads = 0;
    this.sprint = 0;
    this.kz = 0; // the gun's slide back toward the shoulder (spring)
    this.kzV = 0;
    this.kr = 0; // the gun's rise (spring)
    this.krV = 0;
    this.kx = 0; // sideways twitch
    this.kxV = 0;
    this.slide = 0;
    this.cycle = -1; // 0..1 through a pump / bolt / lever cycle after a shot
    this.cycleKind = null;
    this.cylTurn = 0;
    this.cylTarget = 0;
    this.locked = false; // slide locked back on an empty mag
  }

  reset() {
    this.kz = this.kzV = this.kr = this.krV = this.kx = this.kxV = 0;
    this.slide = 0;
    this.cycle = -1;
    this.locked = false;
  }

  // A shot was fired: kick, cycle the action, eject brass.
  fire(vm, def, emptyNow) {
    if (!vm || !def) return;
    const r = vm.recoil;
    const k = 1 - this.ads * 0.35;
    this.kzV += r.back * 26 * k;
    this.krV += r.rise * 26 * k;
    this.kxV += (Math.random() - 0.5) * r.rise * 10;
    const P = vm.model.parts;
    if (P.slide) {
      this.slide = 1;
      this.locked = emptyNow;
    }
    if (P.cyl) this.cylTarget += Math.PI / 3;
    if (P.pump && !emptyNow) this.startCycle('pump', 0.12);
    else if (P.lever && !emptyNow) this.startCycle('lever', 0.08);
    else if (P.boltAction && !emptyNow) this.startCycle('bolt', 0.18);
    else if (P.bolt && !P.boltAction) this.slide = 1;
    if (P.warhead) P.warhead.visible = false;
    if (P.arrow) P.arrow.visible = false;
  }
  startCycle(kind, delay) {
    this.cycleKind = kind;
    this.cycle = -delay;
  }

  // Does this shot throw out a casing right away (vs. on the pump/bolt)?
  static ejectsOnFire(def, vm) {
    const P = vm.model.parts;
    if (['bow', 'thrown', 'flame', 'melee', 'launcher'].includes(def.cat)) return false;
    if (def.look?.revolver || def.look?.double) return false;
    return !P.pump && !P.lever && !P.boltAction;
  }

  update(game, vm, p, dt, aimWanted) {
    const def = vm.def;
    const gun = vm.gun;
    const P = vm.model.parts;
    // ---- aim and sprint
    const aimable = !!vm.adsPos && p.alive && !p.hidden && p.switchT <= 0 && p.reloading <= 0 && !p.running;
    const wantAds = aimWanted && aimable;
    this.ads = damp(this.ads, wantAds ? 1 : 0, wantAds ? vm.pose.ads : vm.pose.ads * 1.4, dt);
    if (this.ads < 0.001) this.ads = 0;
    this.sprint = damp(this.sprint, p.running && p.moving ? 1 : 0, 7, dt);
    const ads = smooth(clamp(this.ads, 0, 1));
    // ---- recoil springs
    this.kzV += (-this.kz * 220 - this.kzV * 20) * dt;
    this.kz += this.kzV * dt;
    this.krV += (-this.kr * 170 - this.krV * 17) * dt;
    this.kr += this.krV * dt;
    this.kxV += (-this.kx * 160 - this.kxV * 16) * dt;
    this.kx += this.kxV * dt;
    if (!this.locked) this.slide = Math.max(0, this.slide - dt * 16);
    // ---- the action cycling after a shot
    let act = 0;
    if (this.cycle > -1) {
      this.cycle += dt / (this.cycleKind === 'bolt' ? 0.6 : 0.38);
      if (this.cycle >= 1) this.cycle = -1;
      else if (this.cycle > 0) act = Math.sin(this.cycle * Math.PI);
      if (this.cycle > 0.45 && !this.cycleEjected && vm.ejectNow) {
        this.cycleEjected = true;
        vm.ejectNow();
      }
      if (this.cycle < 0.2) this.cycleEjected = false;
    }
    // ---- reload choreography
    let gOff = [0, 0, 0, 0, 0, 0];
    let handAt = 'base';
    let handOff = [0, 0, 0];
    let handK = 0;
    let magDrop = 0;
    let magGone = false;
    let rAct = null;
    let cover = 0;
    let torchOff = [0, 0, 0];
    let warhead = null;
    let arrow = null;
    const style = reloadStyle(def);
    if (p.reloading > 0 && style) {
      const t = clamp(1 - p.reloading / p.reloadTotal, 0, 1);
      const { a, b, k } = sample(RELOADS[style], t);
      gOff = lerpArr(a.gun, b.gun, k, 6);
      handAt = k < 0.5 ? a.hand || 'base' : b.hand || 'base';
      // blend hand positions between keyframes
      vm.handFrom = a.hand || 'base';
      vm.handTo = b.hand || 'base';
      handK = k;
      handOff = lerpArr(a.ho, b.ho, k, 3);
      magDrop = (a.mag ?? 0) + ((b.mag ?? 0) - (a.mag ?? 0)) * k;
      magGone = !!(a.magGone && (b.magGone || k < 0.5)) || (!!a.magGone && !b.magGone && k < 0.35);
      if (a.act != null || b.act != null) rAct = (a.act ?? 0) + ((b.act ?? a.act ?? 0) - (a.act ?? 0)) * k;
      cover = (a.cover ?? 0) + ((b.cover ?? 0) - (a.cover ?? 0)) * k;
      torchOff = lerpArr(a.torch, b.torch, k, 3);
      if (b.warhead) warhead = k > 0.2;
      if (a.arrow != null) arrow = (k < 0.5 ? a.arrow : b.arrow) > 0;
      if (t > 0.6) this.locked = false;
    } else {
      vm.handFrom = vm.handTo = 'base';
    }
    // ---- where the gun sits: hip ↔ aim, then sprint, recoil, sway, reload
    const hip = vA.set(...vm.basePos);
    const pos = vm.adsPos ? vB.copy(hip).lerp(vm.adsPos, ads) : vB.copy(hip);
    const sw = p.switchT / 0.35;
    const spr = this.sprint * (1 - ads);
    pos.x += spr * -0.05 + gOff[0] + this.kx * 0.02;
    pos.y += spr * -0.06 - sw * 0.3 + gOff[1] - this.kr * 0.02;
    pos.z += this.kz * (1 - ads * 0.4) + gOff[2] + spr * 0.03;
    if (!def || def.cat === 'melee') {
      const k = p.swing;
      const arc = Math.sin(k * Math.PI);
      gun.rotation.set(-arc * 1.1 + k * 0.4 - spr * 0.3, arc * 0.5 + spr * 0.3, -arc * 0.5);
      gun.position.set(vm.basePos[0] - arc * 0.12 + spr * -0.04, vm.basePos[1] + arc * 0.05 - sw * 0.3 - spr * 0.04, vm.basePos[2] - arc * 0.1);
    } else {
      gun.position.copy(pos);
      gun.rotation.set(this.kr * (1 - ads * 0.5) + gOff[3] - spr * 0.42, gOff[4] + spr * 0.65 + this.kx * 0.4, gOff[5] + spr * 0.32 + this.kx * 0.6);
    }
    // ---- moving parts
    const s = vm.scale;
    if (P.slide) P.slide.position.z = vm.base.slide.z + 0.032 * Math.max(this.slide, this.locked ? 1 : 0, rAct ?? 0);
    if (P.bolt) {
      const b = vm.base.bolt;
      if (P.boltAction) {
        // lift, pull back, push forward, lock down
        const c = this.cycleKind === 'bolt' && this.cycle > 0 ? this.cycle : rAct ?? 0;
        const lift = c < 0.25 ? c / 0.25 : c > 0.75 ? (1 - c) / 0.25 : 1;
        const back = c < 0.25 || c > 0.75 ? 0 : Math.sin(((c - 0.25) / 0.5) * Math.PI);
        P.bolt.rotation.z = lift * 1.1;
        P.bolt.position.z = b.z + back * 0.08;
      } else P.bolt.position.z = b.z + 0.05 * Math.max(rAct ?? 0, this.slide * 0.6);
    }
    if (P.pump) {
      const c = this.cycleKind === 'pump' ? act : 0;
      P.pump.position.z = vm.base.pump.z + 0.075 * Math.max(c, rAct ?? 0);
    }
    if (P.lever) P.lever.rotation.x = 0.9 * Math.max(this.cycleKind === 'lever' ? act : 0, rAct ?? 0);
    if (P.cyl) {
      this.cylTurn = damp(this.cylTurn, this.cylTarget, 18, dt);
      P.cyl.rotation.z = this.cylTurn;
      if (def.look?.revolver) P.cyl.position.x = vm.base.cyl.x - 0.035 * (rAct ?? 0);
    }
    if (P.hammer) P.hammer.rotation.x = -0.6 * (1 - Math.min(1, this.slide * 3));
    if (P.cover) P.cover.rotation.x = -1.2 * cover;
    if (P.mag) {
      P.mag.position.y = vm.base.mag.y - magDrop / s;
      P.mag.visible = !magGone;
    }
    if (P.warhead && warhead != null) P.warhead.visible = warhead;
    if (P.warhead && p.reloading <= 0 && (game.player.weapon()?.mag ?? 0) > 0) P.warhead.visible = true;
    if (P.arrow) {
      if (arrow != null) P.arrow.visible = arrow;
      else if (p.reloading <= 0 && (game.player.weapon()?.mag ?? 0) > 0) P.arrow.visible = true;
    }
    // ---- the support hand
    if (vm.left) {
      const at = (name, out) => {
        out.copy(vm.leftBase);
        if (name === 'mag' && P.mag) out.set(-0.005, (vm.base.mag.y - 0.08) * s - 0.02, vm.base.mag.z * s + 0.01);
        else if (name === 'bolt') out.set(P.bolt ? vm.base.bolt.x * s - 0.035 : -0.04, (P.bolt ? vm.base.bolt.y : 0.05) * s, (P.bolt ? vm.base.bolt.z : -0.05) * s);
        else if (name === 'port') out.set(-0.02, -0.05, -0.02);
        else if (name === 'out') out.set(-0.1, -0.32, 0.12);
        else if (name === 'muzzle') out.set(-0.02, 0.02, vm.model.muzzle.position.z * s + 0.04);
        return out;
      };
      const from = at(vm.handFrom || 'base', vTmp.set(0, 0, 0));
      const to = at(vm.handTo || 'base', new THREE.Vector3());
      from.lerp(to, handK);
      from.x += handOff[0];
      from.y += handOff[1];
      from.z += handOff[2];
      if (P.pump && p.reloading <= 0) from.z += 0.075 * s * (this.cycleKind === 'pump' ? act : 0);
      vm.left.position.copy(from);
      void handAt;
    }
    // ---- the flashlight hand: tucks in under the gun when aiming
    if (vm.torch) {
      const t = vm.torch;
      const ax = -0.22 + 0.13 * ads;
      const ay = -0.22 - 0.02 * ads;
      t.position.set(ax + torchOff[0] + spr * -0.03, ay + torchOff[1] - sw * 0.2 - spr * 0.05, -0.5 + 0.12 * ads + torchOff[2]);
      t.rotation.set(spr * -0.3, ads * 0.12, 0);
    }
    // ---- muzzle flash and the torch's lens
    vm.flash.material.opacity = Math.max(0, vm.flash.material.opacity - dt * 14);
    if (vm.lens) vm.lens.material.color.setHex(p.flashlight ? 0xfff2cc : 0x222222);
    if (vm.model.spin) vm.model.spin.rotation.z += dt * (p.spin > 0 ? 40 * (p.spin / (def.spinUp || 1)) : 0);
  }
}
