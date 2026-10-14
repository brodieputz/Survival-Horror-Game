// The first-person weapon: the gun, both hands on it, the arms they hang
// from, and every way it all moves.
//
// The view model is drawn as if through its own, narrower lens (VM_FOV) so
// real-sized guns sit naturally at the edge of the screen without the
// stretching a wide game camera gives them. Gloved hands with jointed
// fingers grip each kind of weapon properly; the arms are solved with IK
// from shoulders behind the camera, so forearms and elbows follow the hands
// through every reload and swing.
//
// Motion is layered: hip carry and aiming down the sights; equip and
// holster; a sprint carry; walking bob and idle breathing; inertia on
// springs when you turn, strafe, jump and land; recoil on springs (kick,
// climb, roll and a little shake), the action cycling and trigger finger
// squeezing; reloads played out by both hands; melee swings with wind-up,
// strike and follow-through; and the muzzle pulled in when you stand
// against a wall.
import * as THREE from 'three';
import { tex } from './textures.js';
import { lambert as L } from './models.js';
import { makeGunModel } from './gunModels.js';
import { makeHand, makeArm, updateArm, setHandPose, lerpPose, handMats, POSES } from './hands.js';
import { damp, clamp } from './util.js';

const VM_FOV = 56;
const D = Math.PI / 180;

// hip position of the grip (view space, as seen through VM_FOV), model
// scale, where the support hand holds it (model z), how far the rear sight
// sits from the eye when aiming, the zoomed field of view and how fast the
// sights come up, and how heavy it feels (sway and lag)
// (rot: the hip carry's turn toward the crosshair and its cant)
const POSE = {
  pistol: { pos: [0.1, -0.088, -0.4], rot: [0.03, 0.085, 0.06], scale: 1.0, fore: null, eye: -0.3, fov: 60, ads: 9, weight: 0.6 },
  smg: { pos: [0.098, -0.112, -0.3], rot: [0.02, 0.06, 0.05], scale: 0.96, fore: -0.22, eye: -0.19, fov: 56, ads: 8, weight: 0.8 },
  shotgun: { pos: [0.095, -0.118, -0.27], rot: [0.02, 0.055, 0.05], scale: 0.92, fore: -0.3, eye: -0.18, fov: 60, ads: 7, weight: 1.05 },
  rifle: { pos: [0.095, -0.118, -0.27], rot: [0.02, 0.055, 0.05], scale: 0.92, fore: -0.3, eye: -0.16, fov: 50, ads: 7, weight: 1 },
  sniper: { pos: [0.095, -0.118, -0.26], rot: [0.02, 0.05, 0.05], scale: 0.9, fore: -0.34, eye: -0.11, fov: 18, ads: 5, weight: 1.2 },
  lmg: { pos: [0.105, -0.138, -0.27], rot: [0.02, 0.05, 0.05], scale: 0.86, fore: -0.36, eye: -0.17, fov: 56, ads: 5, weight: 1.5 },
  launcher: { pos: [0.1, -0.1, -0.26], rot: [0.0, 0.04, 0.02], scale: 0.86, fore: -0.22, eye: -0.18, fov: 56, ads: 6, weight: 1.4 },
  bow: { pos: [-0.045, -0.06, -0.47], rot: [0.02, 0.06, 0.28], scale: 0.86, fore: -0.14, eye: -0.34, fov: 58, ads: 7, weight: 0.8 },
  thrown: { pos: [0.12, -0.1, -0.38], rot: [0, 0, 0], scale: 0.8, fore: null, eye: null, fov: 72, ads: 8, weight: 0.5 },
  flame: { pos: [0.11, -0.15, -0.3], rot: [0.02, 0.05, 0.04], scale: 0.86, fore: -0.3, eye: null, fov: 72, ads: 6, weight: 1.4 },
  melee: { pos: [0.13, -0.115, -0.36], rot: [0, 0, 0], scale: 0.92, fore: null, eye: null, fov: 72, ads: 8, weight: 0.8 },
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
// where a third-person character's off hand holds a long gun's handguard
export const supportZ = (def) => POSE[def?.cat]?.fore ?? -0.2;
export const canAim = (def) => def && POSE[def.cat]?.eye != null;
export const isScoped = (def) => def && (def.look?.scope || def.cat === 'sniper');
export const aimFov = (def) => (def?.look?.scope && def.cat !== 'sniper' ? 32 : POSE[def?.cat]?.fov ?? 72);

// ---------------------------------------------------------------- grips
// Rotations built from turns about the view axes, applied in order.
const Q = (...ops) => {
  const q = new THREE.Quaternion();
  const t = new THREE.Quaternion();
  const ax = { x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, 1, 0), z: new THREE.Vector3(0, 0, 1) };
  for (const [a, deg] of ops) q.premultiply(t.setFromAxisAngle(ax[a], deg * D));
  return q;
};
// Where each hand goes on each kind of weapon (model units, before the
// model's scale), how it's turned, and how the fingers sit.
// right hand round a pistol grip: palm on the grip's right flank, fingers
// wrapping its front strap, index finger on the trigger, thumb high on the left
const gripR = (gr) => ({
  pos: [0.036, -0.046 - (gr.ang - 0.28) * 0.06, gr.z + 0.052],
  rot: Q(['z', -90], ['x', 10 + (0.28 - gr.ang) * 35]),
  pose: 'pistol',
});
// support hand under a handguard: palm up, fingers curling over the far side,
// thumb along the near side pointing forward
const SUPPORT_L = (y = -0.04) => ({ pos: [-0.042, y, 0.012], rot: Q(['y', -90], ['x', 180], ['z', 28]), pose: 'support' });
// a left hand round a vertical fore grip, like a pistol grip
const FOREGRIP_L = (fg) => ({ pos: [-0.036, fg.y - 0.015, 0.05], rot: Q(['z', 90], ['x', 8]), pose: 'pistol', z: fg.z });
function grips(def, model) {
  const lk = def?.look || {};
  if (!def) return { right: { pos: [0.03, -0.02, 0.06], rot: Q(['z', -90], ['x', 25]), pose: 'fist' }, left: 'torch' };
  const GRIP_R = gripR(model.grip || { z: 0.06, ang: 0.28 });
  switch (def.cat) {
    case 'pistol':
    case 'thrown':
    case 'melee':
      break;
    default:
      if (def.cat === 'bow' && !lk.crossbow) {
        // the bow hand round the riser; the draw hand at the string
        return {
          right: { pos: [0.02, 0.0, 0.36], rot: Q(['z', -90], ['x', 15]), pose: 'pinch' },
          left: { pos: [-0.036, -0.015, 0.05], rot: Q(['z', 90], ['x', 6]), pose: 'pistol', z: -0.15 },
        };
      }
      if (model.foreGrip) return { right: GRIP_R, left: FOREGRIP_L(model.foreGrip) };
      return { right: GRIP_R, left: { ...SUPPORT_L(def.cat === 'lmg' ? -0.07 : -0.04), z: POSE[def.cat].fore } };
  }
  if (def.cat === 'pistol') return { right: GRIP_R, left: 'torch' };
  if (def.cat === 'thrown') return { right: { pos: [0.004, -0.004, 0.068], rot: Q(['z', 180], ['x', 30]), pose: 'ball' }, left: 'torch' };
  // melee: a fist round the handle
  return { right: { pos: [0.032, -0.07, 0.03], rot: Q(['z', -90], ['x', 90]), pose: 'handle' }, left: lk.saw ? 'saw' : 'torch' };
}

function makeTorch(mats) {
  const torch = new THREE.Group();
  const metal = L({ color: 0x2c2c30, emissive: 0x0a0a0c, roughness: 0.35, metalness: 0.8 });
  const grip = L({ color: 0x18181a, roughness: 0.85 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.019, 0.019, 0.17, 14), metal);
  body.rotation.x = Math.PI / 2;
  torch.add(body);
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.019, 0.03, 0.06, 14), metal);
  head.rotation.x = Math.PI / 2;
  head.position.z = -0.11;
  torch.add(head);
  for (let k = 0; k < 5; k++) {
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.0205, 0.0205, 0.006, 14), grip);
    ring.rotation.x = Math.PI / 2;
    ring.position.z = 0.0 + k * 0.014;
    torch.add(ring);
  }
  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.013, 0.012, 12), grip);
  tail.rotation.x = Math.PI / 2;
  tail.position.z = 0.09;
  torch.add(tail);
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.027, 16), new THREE.MeshBasicMaterial({ color: 0xfff2cc }));
  lens.position.z = -0.141;
  lens.rotation.y = Math.PI;
  torch.add(lens);
  void mats;
  return { group: torch, lens };
}

// ---------------------------------------------------------------- the model
export function makeViewModel(def) {
  const g = new THREE.Group(); // sway, bob and the lens
  const rig = new THREE.Group(); // equip, sprint and wall motion, about a pivot near the hands
  rig.position.copy(RIG_PIVOT);
  g.add(rig);
  const body = new THREE.Group(); // everything else, back in view-model space
  body.position.copy(RIG_PIVOT).negate();
  rig.add(body);
  const mats = handMats();
  const pose = POSE[def?.cat] || POSE.melee;
  const gun = new THREE.Group();
  gun.position.set(...pose.pos);
  body.add(gun);
  let model;
  const scale = pose.scale;
  if (def) {
    model = makeGunModel(def, true);
    model.group.scale.setScalar(scale);
    if (def.cat === 'melee') {
      // the handle in the fist, the weapon angled forward, up and in, ready to swing
      model.group.rotation.set(0.62, 0.42, 0.25);
      model.group.position.set(0, 0, 0);
    }
  } else {
    model = { group: new THREE.Group(), muzzle: new THREE.Object3D(), port: new THREE.Object3D(), spin: null, flame: null, parts: {}, sight: null };
  }
  gun.add(model.group);
  // where the hands hold: a node that turns with the model but isn't scaled
  const holdNode = new THREE.Group();
  holdNode.quaternion.copy(model.group.quaternion);
  gun.add(holdNode);
  const G = grips(def, model);
  const right = makeHand(1, mats);
  const rp = G.right;
  right.basePos = new THREE.Vector3(...rp.pos).multiplyScalar(scale);
  right.baseRot = rp.rot.clone();
  right.root.position.copy(right.basePos);
  right.root.quaternion.copy(right.baseRot);
  right.basePose = POSES[rp.pose];
  setHandPose(right, right.basePose);
  holdNode.add(right.root);
  let left = null;
  let torch = null;
  let lens = null;
  if (G.left === 'torch' || G.left === 'saw') {
    // a flashlight in the left hand, thumb on the tail switch
    const t = makeTorch(mats);
    torch = t.group;
    lens = t.lens;
    left = makeHand(-1, mats);
    left.root.position.set(-0.04, -0.07, 0.018);
    left.root.quaternion.copy(Q(['z', 90], ['x', 90], ['y', -12]));
    left.basePose = POSES.torch;
    setHandPose(left, left.basePose);
    torch.add(left.root);
    torch.position.set(-0.12, -0.1, -0.4);
    body.add(torch);
    left.onTorch = true;
  } else if (G.left) {
    left = makeHand(-1, mats);
    const lp = G.left;
    left.basePos = new THREE.Vector3(lp.pos[0] * scale, lp.pos[1] * scale, (lp.z + lp.pos[2]) * scale);
    left.baseRot = lp.rot.clone();
    left.root.position.copy(left.basePos);
    left.root.quaternion.copy(left.baseRot);
    left.basePose = POSES[lp.pose];
    setHandPose(left, left.basePose);
    holdNode.add(left.root);
  }
  // the arms, from shoulders behind the camera
  const armR = makeArm(1, mats);
  const armL = makeArm(-1, mats);
  body.add(armR.group, armL.group);
  const flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex('glow'), color: 0xffcc66, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0 }));
  flash.scale.set(0.35, 0.35, 0.35);
  model.muzzle.add(flash);
  if (!def || def.cat === 'melee' || def.cat === 'bow' || def.cat === 'thrown') flash.visible = false;
  g.traverse((o) => {
    if (o.isMesh || o.isSprite) {
      o.castShadow = false;
      o.receiveShadow = false;
      o.renderOrder = 10;
      o.frustumCulled = false;
    }
  });
  // aiming: the rear sight on the eye line, a hand's breadth away
  let adsPos = null;
  const sg = model.sight;
  if (def && pose.eye != null && sg) adsPos = new THREE.Vector3(0, -sg.y * scale, pose.eye - sg.rear * scale);
  // remember where the moving parts sit
  const P = model.parts;
  const base = {};
  for (const k of ['slide', 'mag', 'pump', 'bolt', 'cyl', 'lever', 'cover']) if (P[k]) base[k] = P[k].position.clone();
  const style = !def ? 'fists' : def.cat === 'melee' ? meleeStyle(def) : def.cat;
  return {
    group: g,
    rig,
    body,
    gun,
    holdNode,
    model,
    flash,
    lens,
    torch,
    def,
    basePos: pose.pos.slice(),
    adsPos,
    scale,
    left,
    right,
    armR,
    armL,
    base,
    pose,
    style,
    recoil: RECOIL[def?.cat] || RECOIL.melee,
  };
}

// Empty-handed: fists up.
export function makeFistsViewModel() {
  return makeViewModel(null);
}

function meleeStyle(def) {
  const lk = def.look || {};
  if (lk.saw) return 'saw';
  if (def.id === 'knife' || (lk.len ?? 0.5) < 0.3) return 'stab';
  if (lk.axe || lk.head || lk.spade || lk.big) return 'chop';
  return 'slash';
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
    K(0.12, { gun: [-0.03, 0.035, 0.03, 0.2, 0.3, -0.58], hand: 'mag', ho: [0, -0.02, 0] }),
    K(0.22, { gun: [-0.03, 0.035, 0.03, 0.18, 0.3, -0.6], hand: 'mag', ho: [0, -0.07, 0], mag: 0.05 }),
    K(0.33, { gun: [-0.03, 0.03, 0.03, 0.18, 0.32, -0.6], hand: 'out', mag: 0.6, magGone: true }),
    K(0.48, { gun: [-0.03, 0.03, 0.03, 0.19, 0.32, -0.6], hand: 'mag', ho: [0, -0.13, 0], mag: 0.12 }),
    K(0.62, { gun: [-0.03, 0.04, 0.025, 0.22, 0.3, -0.56], hand: 'mag', ho: [0, -0.02, 0], mag: 0 }),
    K(0.66, { gun: [-0.03, 0.055, 0.02, 0.1, 0.3, -0.54], hand: 'mag', mag: 0, slap: 1 }),
    K(0.78, { gun: [-0.01, 0.015, 0.01, 0.06, 0.2, -0.3], hand: 'bolt' }),
    K(0.86, { gun: [0, 0, 0.01, 0.06, 0.16, -0.22], hand: 'bolt', ho: [0, 0, 0.05], act: 1 }),
    K(0.92, { gun: [0, 0.006, 0, 0.0, 0.08, -0.1], hand: 'bolt', act: 0 }),
    K(1, { gun: [0, 0, 0, 0, 0, 0], hand: 'base' }),
  ],
  pistol: [
    K(0, { gun: [0, 0, 0, 0, 0, 0], torch: [0, 0, 0] }),
    K(0.14, { gun: [-0.03, 0.02, 0.03, 0.22, 0.2, -0.35], torch: [-0.03, -0.18, 0.1] }),
    K(0.24, { gun: [-0.03, 0.02, 0.03, 0.22, 0.2, -0.38], mag: 0.05, torch: [-0.05, -0.3, 0.13] }),
    K(0.32, { gun: [-0.03, 0.02, 0.03, 0.2, 0.2, -0.38], mag: 0.5, magGone: true, torch: [-0.05, -0.32, 0.13] }),
    K(0.5, { gun: [-0.03, 0.02, 0.03, 0.22, 0.2, -0.38], mag: 0.14, torch: [-0.05, -0.28, 0.13] }),
    K(0.62, { gun: [-0.02, 0.03, 0.02, 0.26, 0.18, -0.3], mag: 0, torch: [-0.04, -0.22, 0.1] }),
    K(0.66, { gun: [-0.02, 0.045, 0.02, 0.1, 0.15, -0.28], mag: 0, slap: 1 }),
    K(0.8, { gun: [-0.02, 0.02, 0.02, 0.08, 0.1, -0.2], act: 1, torch: [-0.03, -0.16, 0.07] }),
    K(0.88, { gun: [0, 0.01, 0.01, 0.04, 0.05, -0.1], act: 0, torch: [-0.02, -0.07, 0.03] }),
    K(1, { gun: [0, 0, 0, 0, 0, 0], torch: [0, 0, 0] }),
  ],
  revolver: [
    K(0, { gun: [0, 0, 0, 0, 0, 0], torch: [0, 0, 0] }),
    K(0.14, { gun: [-0.05, 0.03, 0.02, 0.1, 0.1, 0.65], torch: [-0.04, -0.2, 0.12], act: 1 }),
    K(0.3, { gun: [-0.05, 0.05, 0.02, -0.7, 0.1, 0.5], torch: [-0.05, -0.3, 0.14], act: 1 }),
    K(0.45, { gun: [-0.05, 0.02, 0.02, 0.6, 0.1, 0.6], torch: [-0.05, -0.3, 0.14], act: 1 }),
    K(0.75, { gun: [-0.05, 0.02, 0.02, 0.55, 0.1, 0.6], torch: [-0.04, -0.22, 0.1], act: 1 }),
    K(0.85, { gun: [-0.02, 0.01, 0.01, 0.1, 0.05, 0.2], act: 0, torch: [-0.02, -0.1, 0.05], slap: 1 }),
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
    K(0.85, { gun: [0, 0.015, 0.01, -0.12, 0.05, -0.05], hand: 'base', slap: 1 }),
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
    K(0.85, { gun: [0, 0.01, 0.02, 0.12, 0.2, -0.3], hand: 'bolt', cover: 0, slap: 1 }),
    K(1, { gun: [0, 0, 0, 0, 0, 0], hand: 'base' }),
  ],
  draw: [
    K(0, { gun: [0, 0, 0, 0, 0, 0], arrow: 0 }),
    K(0.4, { gun: [0, -0.04, 0.03, 0.1, 0, 0.1], arrow: 0 }),
    K(0.7, { gun: [0, -0.01, 0.02, 0.03, 0, 0.05], arrow: 1 }),
    K(1, { gun: [0, 0, 0, 0, 0, 0], arrow: 1 }),
  ],
  throw: [
    K(0, { gun: [0, -0.32, 0.08, 0.5, 0, 0] }),
    K(0.5, { gun: [0, -0.32, 0.08, 0.5, 0, 0] }),
    K(1, { gun: [0, 0, 0, 0, 0, 0] }),
  ],
};
// what the support hand is doing at each kind of keyframe target
const HAND_AT = { base: 'support', mag: 'grab', out: 'grab', bolt: 'pinch', port: 'pinch', muzzle: 'grab' };
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
// a cubic ease with a little anticipation and overshoot
const easeBack = (t) => {
  const c = 1.4;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};
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

// ---------------------------------------------------------------- melee
// Gun-group offsets [x, y, z, rx, ry, rz] through a swing: ready, wind-up,
// the strike (the hit lands at the end of it), follow-through, recovery.
const SWINGS = {
  slash: [
    [0, 0, 0, 0, 0, 0],
    [0.09, 0.09, 0.06, 0.55, -0.55, -0.55],
    [-0.2, -0.06, -0.08, -0.45, 0.95, 0.9],
    [-0.26, -0.12, -0.02, -0.75, 1.15, 1.1],
  ],
  backhand: [
    [0, 0, 0, 0, 0, 0],
    [-0.16, 0.05, 0.04, 0.35, 0.85, 0.75],
    [0.12, -0.04, -0.08, -0.35, -0.75, -0.5],
    [0.17, -0.1, -0.02, -0.6, -0.9, -0.65],
  ],
  chop: [
    [0, 0, 0, 0, 0, 0],
    [0.02, 0.17, 0.1, 1.1, -0.2, -0.25],
    [-0.05, -0.13, -0.14, -0.95, 0.2, 0.15],
    [-0.06, -0.22, -0.06, -1.25, 0.25, 0.2],
  ],
  stab: [
    [0, 0, 0, 0, 0, 0],
    [0.02, 0.03, 0.09, -0.2, 0.1, 0.0],
    [-0.04, 0.02, -0.2, -0.85, 0.25, 0.1],
    [-0.04, 0.0, -0.17, -0.8, 0.25, 0.1],
  ],
  fists: [
    [0, 0, 0, 0, 0, 0],
    [0.03, -0.02, 0.07, 0.1, -0.2, -0.3],
    [-0.08, 0.04, -0.2, -0.1, 0.25, 0.25],
    [-0.08, 0.03, -0.17, -0.1, 0.25, 0.25],
  ],
};
// time (s) of each phase
const SWING_T = [0.1, 0.08, 0.14, 0.32];

// ---------------------------------------------------------------- animator
const RIG_PIVOT = new THREE.Vector3(0.02, -0.17, -0.22);
const vTmp = new THREE.Vector3();
const vA = new THREE.Vector3();
const vB = new THREE.Vector3();
const vS = new THREE.Vector3();
const vW = new THREE.Vector3();
const qTmp = new THREE.Quaternion();
const qA = new THREE.Quaternion();
const eTmp = new THREE.Euler();
const SHOULDER_R = new THREE.Vector3(0.2, -0.32, 0.12);
const SHOULDER_L = new THREE.Vector3(-0.26, -0.33, 0.1);
const POLE_R = new THREE.Vector3(0.9, -0.8, 0.2);
const POLE_L = new THREE.Vector3(-1, -0.45, 0.15);
// a damped spring: x toward 0, v its velocity
function spring(o, k, c, dt) {
  o.v += (-o.x * k - o.v * c) * dt;
  o.x += o.v * dt;
}
const S0 = () => ({ x: 0, v: 0 });

export class ViewModelAnim {
  constructor() {
    this.ads = 0;
    this.sprint = 0;
    // recoil springs: back, climb, yaw twitch, roll
    this.kz = S0();
    this.kr = S0();
    this.kx = S0();
    this.kroll = S0();
    // inertia: look sway (yaw, pitch), move sway, vertical (jump / land)
    this.lx = S0();
    this.ly = S0();
    this.mx = S0();
    this.mz = S0();
    this.vy = S0();
    this.slap = S0();
    this.slide = 0;
    this.cycle = -1; // 0..1 through a pump / bolt / lever cycle after a shot
    this.cycleKind = null;
    this.cylTurn = 0;
    this.cylTarget = 0;
    this.locked = false; // slide locked back on an empty mag
    this.trigger = 0;
    this.equip = 0;
    this.meleeT = -1;
    this.meleeFlip = false;
    this.throwT = -1;
    this.wall = 0;
    this.time = 0;
    this.wasSwing = 0;
    this.wasGround = true;
  }

  reset() {
    for (const s of [this.kz, this.kr, this.kx, this.kroll, this.slap]) s.x = s.v = 0;
    this.slide = 0;
    this.cycle = -1;
    this.locked = false;
    this.equip = 0; // the new weapon comes up from below
    this.meleeT = -1;
    this.throwT = -1;
  }

  // A shot was fired: kick, cycle the action, eject brass.
  fire(vm, def, emptyNow) {
    if (!vm || !def) return;
    const r = vm.recoil;
    const k = 1 - this.ads * 0.35;
    this.kz.v += r.back * 26 * k;
    this.kr.v += r.rise * 26 * k;
    this.kx.v += (Math.random() - 0.5) * r.rise * 10;
    this.kroll.v += (Math.random() - 0.3) * r.rise * 14 * k;
    this.trigger = 1;
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
    if (def.cat === 'thrown') this.throwT = 0;
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
    const pose = vm.pose;
    const weight = pose.weight;
    this.time += dt;
    // ---- aim and sprint
    const aimable = !!vm.adsPos && p.alive && !p.hidden && p.switchT <= 0 && p.reloading <= 0 && !p.running && this.meleeT < 0;
    const wantAds = aimWanted && aimable;
    this.ads = damp(this.ads, wantAds ? 1 : 0, wantAds ? pose.ads : pose.ads * 1.4, dt);
    if (this.ads < 0.001) this.ads = 0;
    this.sprint = damp(this.sprint, p.running && p.moving ? 1 : 0, 6, dt);
    const ads = smooth(clamp(this.ads, 0, 1));
    const hipK = 1 - ads;
    this.equip = Math.min(1, this.equip + dt / 0.42);
    // ---- springs: recoil
    spring(this.kz, 220, 20, dt);
    spring(this.kr, 170, 17, dt);
    spring(this.kx, 160, 16, dt);
    spring(this.kroll, 140, 14, dt);
    spring(this.slap, 260, 16, dt);
    if (!this.locked) this.slide = Math.max(0, this.slide - dt * 16);
    this.trigger = Math.max(0, this.trigger - dt * 9);
    // ---- springs: inertia. The gun lags the look a moment and overshoots
    // a little; heavier guns lag more.
    const tx = clamp(-(p.turnX || 0) * 0.012 * weight, -0.07, 0.07);
    const ty = clamp((p.turnY || 0) * 0.012 * weight, -0.05, 0.05);
    this.lx.v += ((tx - this.lx.x) * 90 - this.lx.v * 11) * dt;
    this.lx.x += this.lx.v * dt;
    this.ly.v += ((ty - this.ly.x) * 90 - this.ly.v * 11) * dt;
    this.ly.x += this.ly.v * dt;
    const cy = Math.cos(p.yaw);
    const sy = Math.sin(p.yaw);
    const lat = p.vel.x * cy - p.vel.z * sy;
    const fwd = -(p.vel.x * sy + p.vel.z * cy);
    this.mx.v += ((clamp(lat * 0.006, -0.03, 0.03) - this.mx.x) * 70 - this.mx.v * 12) * dt;
    this.mx.x += this.mx.v * dt;
    this.mz.v += ((clamp(-fwd * 0.004, -0.02, 0.02) - this.mz.x) * 60 - this.mz.v * 12) * dt;
    this.mz.x += this.mz.v * dt;
    // jumping and landing: the gun drops behind the camera and bounces back
    if (!p.onGround && this.wasGround) this.vy.v -= 0.5;
    if (p.landKickVm) {
      this.vy.v -= p.landKickVm * 1.4;
      p.landKickVm = 0;
    }
    this.wasGround = p.onGround;
    spring(this.vy, 120, 11, dt);
    // ---- walking bob, idle breathing
    const moving = p.onGround && p.moving && p.trapped <= 0;
    this.bobAmt = damp(this.bobAmt || 0, moving ? (p.running ? 1 : p.crouch ? 0.45 : 0.7) : 0, 7, dt);
    const b = p.bob;
    const bobK = this.bobAmt * (1 - ads * 0.85);
    const breathe = Math.sin(this.time * 1.55) * (1 - ads * 0.6);
    const noise = Math.sin(this.time * 0.73) * 0.6 + Math.sin(this.time * 1.31 + 1) * 0.4;
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
      const { a, b: kb, k } = sample(RELOADS[style], t);
      gOff = lerpArr(a.gun, kb.gun, k, 6);
      vm.handFrom = a.hand || 'base';
      vm.handTo = kb.hand || 'base';
      handK = k;
      handOff = lerpArr(a.ho, kb.ho, k, 3);
      magDrop = (a.mag ?? 0) + ((kb.mag ?? 0) - (a.mag ?? 0)) * k;
      magGone = !!(a.magGone && (kb.magGone || k < 0.5)) || (!!a.magGone && !kb.magGone && k < 0.35);
      if (a.act != null || kb.act != null) rAct = (a.act ?? 0) + ((kb.act ?? a.act ?? 0) - (a.act ?? 0)) * k;
      cover = (a.cover ?? 0) + ((kb.cover ?? 0) - (a.cover ?? 0)) * k;
      torchOff = lerpArr(a.torch, kb.torch, k, 3);
      if (kb.warhead) warhead = k > 0.2;
      if (a.arrow != null) arrow = (k < 0.5 ? a.arrow : kb.arrow) > 0;
      if (t > 0.6) this.locked = false;
      // a magazine seating or the cylinder snapping shut jolts the gun
      if (kb.slap && k > 0.85 && !this.slapped) {
        this.slapped = true;
        this.slap.v += 2.2;
      }
      if (!kb.slap) this.slapped = false;
    } else {
      vm.handFrom = vm.handTo = 'base';
    }
    // ---- melee: wind-up, strike, follow-through, recovery
    let mOff = null;
    const meleeLike = !def || def.cat === 'melee';
    if (meleeLike) {
      if (p.swing > this.wasSwing + 0.5) {
        this.meleeT = 0;
        this.meleeFlip = !this.meleeFlip;
      }
      this.wasSwing = p.swing;
      if (vm.style === 'saw') {
        // the chainsaw is held out and bucks while it runs
        const on = p.swing > 0 ? 1 : 0;
        mOff = [Math.sin(this.time * 47) * 0.004 * on, Math.sin(this.time * 61) * 0.005 * on - 0.02 * on, -0.04 * on, -0.15 * on, 0, 0];
      } else if (this.meleeT >= 0) {
        this.meleeT += dt;
        const key = vm.style === 'slash' && this.meleeFlip ? 'backhand' : vm.style;
        const S = SWINGS[key] || SWINGS.slash;
        const T = SWING_T;
        let tt = this.meleeT;
        let i = 0;
        while (i < T.length && tt > T[i]) tt -= T[i++];
        if (i >= T.length) this.meleeT = -1;
        else {
          const a = S[i] || S[0];
          const bb = i + 1 < 4 ? S[i + 1] : S[0];
          const f = tt / T[i];
          // fast through the strike, eased elsewhere
          const e = i === 1 ? f * f * (2 - f) : i === 3 ? easeBack(f) : smooth(f);
          mOff = lerpArr(a, bb, e, 6);
        }
      }
    }
    // ---- thrown: wind back and hurl
    if (this.throwT >= 0) {
      this.throwT += dt;
      const t = this.throwT;
      if (t > 0.5) this.throwT = -1;
      else {
        const w = t < 0.12 ? smooth(t / 0.12) : 1 - smooth(clamp((t - 0.12) / 0.14, 0, 1));
        const f = t < 0.12 ? 0 : smooth(clamp((t - 0.12) / 0.14, 0, 1)) * (1 - smooth(clamp((t - 0.3) / 0.2, 0, 1)));
        mOff = [0.07 * w - 0.1 * f, 0.13 * w - 0.05 * f, 0.03 * w - 0.22 * f, 0.9 * w - 0.6 * f, -0.2 * w + 0.2 * f, 0.3 * w];
      }
    }
    // ---- weapon against a wall: pull it in and point it away
    const near = game.flSurf ?? 6;
    this.wall = damp(this.wall, clamp((0.95 - near) / 0.5, 0, 1) * (1 - ads), 8, dt);
    // ---- where the gun sits: hip ↔ aim
    const hip = vA.set(...vm.basePos);
    const pos = vm.adsPos ? vB.copy(hip).lerp(vm.adsPos, ads) : vB.copy(hip);
    const recK = 1 - ads * 0.4;
    pos.x += gOff[0] + this.kx.x * 0.02;
    pos.y += gOff[1] - this.kr.x * 0.02 + this.slap.x * 0.01;
    pos.z += this.kz.x * recK + gOff[2];
    let rx = this.kr.x * (1 - ads * 0.5) + gOff[3] - this.slap.x * 0.05;
    let ry = gOff[4] + this.kx.x * 0.4;
    let rz = gOff[5] + this.kx.x * 0.6 + this.kroll.x * 0.25 * hipK;
    if (mOff) {
      pos.x += mOff[0];
      pos.y += mOff[1];
      pos.z += mOff[2];
      rx += mOff[3];
      ry += mOff[4];
      rz += mOff[5];
    }
    // fists stay up and in front, ready
    if (!def) {
      rx += 0.08;
      rz += 0.15;
    }
    // the hip carry angles the gun in toward the crosshair; aiming squares it
    const br = pose.rot || [0, 0, 0];
    gun.position.copy(pos);
    gun.rotation.set(rx + br[0] * hipK, ry + br[1] * hipK, rz + br[2] * hipK);
    // ---- the rig: equip, sprint carry, wall
    const rig = vm.rig;
    const eq = easeBack(this.equip);
    const lower = 1 - eq;
    const spr = this.sprint * hipK;
    const walk = Math.sin(b);
    const sway2 = Math.sin(b * 0.5);
    const pistolish = !def || ['pistol', 'melee', 'thrown'].includes(def.cat);
    // sprinting: a long gun swings across the chest, muzzle down; a pistol
    // drops low; both pump with the stride
    rig.position.set(
      RIG_PIVOT.x +
        spr * (pistolish ? -0.02 : -0.03) + sway2 * spr * 0.03 + this.wall * 0.03,
      RIG_PIVOT.y - lower * 0.22 + spr * (pistolish ? -0.025 : -0.02) - Math.abs(Math.cos(b * 0.5)) * spr * 0.03 - this.wall * 0.02,
      RIG_PIVOT.z + lower * 0.06 + spr * 0.03 + this.wall * 0.1
    );
    rig.rotation.set(
      -lower * 0.9 - spr * (pistolish ? 0.3 : 0.3) + walk * spr * 0.06 + this.wall * 0.55,
      lower * 0.3 + spr * (pistolish ? 0.12 : 0.62) + sway2 * spr * 0.12 + this.wall * 0.35,
      lower * 0.55 + spr * (pistolish ? 0.18 : 0.38) + sway2 * spr * 0.1
    );
    // ---- the whole view model: sway, bob, breath, lens
    const g = vm.group;
    const steady = 1 - ads * 0.85;
    g.position.set(
      (this.lx.x * 0.5 + this.mx.x + Math.sin(b * 0.5) * 0.011 * bobK + noise * 0.0012) * steady,
      (this.ly.x * 0.45 + walk * 0.006 * bobK - Math.abs(Math.cos(b * 0.5)) * 0.004 * bobK + breathe * 0.0022 + this.vy.x * 0.06 - (p.crouch ? 0.012 : 0)) * steady,
      this.mz.x * steady
    );
    g.rotation.set(
      (this.ly.x * 1.1 + Math.cos(b) * 0.008 * bobK + breathe * 0.004 - this.vy.x * 0.25) * steady,
      (this.lx.x * 1.5 + noise * 0.0025) * steady,
      (this.lx.x * 1.1 - this.mx.x * 3.5 + Math.sin(b * 0.5) * 0.02 * bobK + (p.crouch ? 0.04 : 0)) * steady
    );
    // drawn through its own lens: squeeze the view model's x and y so it
    // looks as it would at VM_FOV whatever the camera's field of view
    const cam = game.camera;
    const vmFov = VM_FOV - 12 * ads;
    const lensK = Math.tan((cam.fov * D) / 2) / Math.tan((vmFov * D) / 2);
    g.scale.set(lensK, lensK, 1);
    // ---- moving parts
    const s = vm.scale;
    if (P.slide) P.slide.position.z = vm.base.slide.z + 0.032 * Math.max(this.slide, this.locked ? 1 : 0, rAct ?? 0);
    if (P.bolt) {
      const bo = vm.base.bolt;
      if (P.boltAction) {
        // lift, pull back, push forward, lock down
        const c = this.cycleKind === 'bolt' && this.cycle > 0 ? this.cycle : rAct ?? 0;
        const lift = c < 0.25 ? c / 0.25 : c > 0.75 ? (1 - c) / 0.25 : 1;
        const back = c < 0.25 || c > 0.75 ? 0 : Math.sin(((c - 0.25) / 0.5) * Math.PI);
        P.bolt.rotation.z = lift * 1.1;
        P.bolt.position.z = bo.z + back * 0.08;
      } else P.bolt.position.z = bo.z + 0.05 * Math.max(rAct ?? 0, this.slide * 0.6);
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
    // a bow stays at full draw while an arrow is nocked; the draw hand rides the string
    if (P.draw) {
      this.drawK = damp(this.drawK ?? 1, P.arrow?.visible ? 1 : 0, P.arrow?.visible ? 5 : 30, dt);
      P.draw(this.drawK);
      if (vm.right) vm.right.root.position.z = vm.right.basePos.z - (1 - this.drawK) * 0.22 * s;
    }
    if (vm.model.group.visible !== (this.throwT < 0 || this.throwT < 0.26)) vm.model.group.visible = this.throwT < 0 || this.throwT < 0.26;
    // ---- the shooting hand: trigger squeeze; it works a bolt-action's bolt
    const R = vm.right;
    if (R) {
      let rp = R.basePose;
      if (rp === POSES.pistol) rp = lerpPose(POSES.pistol, POSES.trigger, Math.min(1, this.trigger * 1.4 + (ads > 0.5 && !meleeLike ? 0.25 : 0)));
      if (this.meleeT >= 0 || (!def && p.swing > 0)) rp = lerpPose(rp, POSES.fist, 0.6);
      R.root.position.copy(R.basePos);
      R.root.quaternion.copy(R.baseRot);
      const boltWork = P.boltAction && this.cycleKind === 'bolt' && this.cycle > 0 ? Math.sin(this.cycle * Math.PI) : 0;
      if (boltWork > 0 && vm.base.bolt) {
        const bo = vm.base.bolt;
        vTmp.set(bo.x * s + 0.03, bo.y * s - 0.02, bo.z * s + 0.07);
        R.root.position.lerp(vTmp, smooth(Math.min(1, boltWork * 1.6)));
        rp = lerpPose(rp, POSES.pinch, boltWork);
      }
      if (this.throwT > 0.2) rp = lerpPose(rp, POSES.open, smooth(clamp((this.throwT - 0.2) / 0.08, 0, 1)));
      setHandPose(R, rp);
    }
    // ---- the support hand: on the handguard, the magazine, the bolt...
    const Lh = vm.left;
    if (Lh && !Lh.onTorch) {
      const at = (name, out) => {
        out.copy(Lh.basePos);
        if (name === 'mag' && P.mag) out.set(-0.035, (vm.base.mag.y - 0.1) * s - 0.03, vm.base.mag.z * s + 0.05);
        else if (name === 'bolt') out.set(P.bolt ? vm.base.bolt.x * s - 0.05 : -0.06, (P.bolt ? vm.base.bolt.y : 0.05) * s - 0.01, (P.bolt ? vm.base.bolt.z : -0.05) * s + 0.06);
        else if (name === 'port') out.set(-0.05, -0.06, 0.02);
        else if (name === 'out') out.set(-0.12, -0.3, 0.14);
        else if (name === 'muzzle') out.set(-0.05, 0.0, vm.model.muzzle.position.z * s + 0.1);
        return out;
      };
      const from = at(vm.handFrom || 'base', vTmp.set(0, 0, 0));
      const to = at(vm.handTo || 'base', vW);
      from.lerp(to, handK);
      from.x += handOff[0];
      from.y += handOff[1];
      from.z += handOff[2];
      if (P.pump && p.reloading <= 0) from.z += 0.075 * s * (this.cycleKind === 'pump' ? act : 0);
      Lh.root.position.copy(from);
      // turn the hand for what it's doing: palm up on the guard, fingers
      // round the magazine, pinching the charging handle
      const rotFor = (name, q) => {
        if (name === 'mag' || name === 'out' || name === 'muzzle') return q.copy(Lh.baseRot).premultiply(qA.setFromEuler(eTmp.set(0.35, 0.6, -0.25)));
        if (name === 'bolt' || name === 'port') return q.copy(Lh.baseRot).premultiply(qA.setFromEuler(eTmp.set(-0.3, 0.9, 0.6)));
        return q.copy(Lh.baseRot);
      };
      const qf = rotFor(vm.handFrom || 'base', new THREE.Quaternion());
      const qt = rotFor(vm.handTo || 'base', qTmp);
      Lh.root.quaternion.copy(qf).slerp(qt, handK);
      const pf = POSES[HAND_AT[vm.handFrom || 'base']] || Lh.basePose;
      const pt = POSES[HAND_AT[vm.handTo || 'base']] || Lh.basePose;
      setHandPose(Lh, lerpPose(vm.handFrom === 'base' ? Lh.basePose : pf, vm.handTo === 'base' ? Lh.basePose : pt, handK));
    }
    // ---- the flashlight hand: tucks in under the gun when aiming
    if (vm.torch) {
      const t = vm.torch;
      const ax = -0.12 + 0.08 * ads;
      const ay = -0.1 - 0.045 * ads;
      t.position.set(ax + torchOff[0] - spr * 0.02, ay + torchOff[1] - spr * 0.03 - lower * 0.1, -0.4 + 0.07 * ads + torchOff[2]);
      t.rotation.set(-spr * 0.35 + (mOff && def?.cat === 'melee' ? -mOff[3] * 0.15 : 0), ads * 0.16 + spr * 0.2, ads * 0.25);
    }
    // ---- arms: shoulders behind the camera, wrists where the hands are
    rig.updateMatrixWorld(true);
    const body = vm.body;
    const solve = (arm, hand, S, pole) => {
      if (!hand) {
        arm.group.visible = false;
        return;
      }
      arm.group.visible = true;
      hand.root.getWorldPosition(vW);
      body.worldToLocal(vW);
      // the shoulder rides a little with the hand so the arm never locks out
      vS.copy(S);
      vS.y += (vW.y + 0.13) * 0.25;
      vS.x += (vW.x - S.x) * 0.15;
      updateArm(arm, vS, vW, pole);
    };
    solve(vm.armR, R, SHOULDER_R, POLE_R);
    solve(vm.armL, Lh, SHOULDER_L, POLE_L);
    // ---- muzzle flash and the torch's lens
    vm.flash.material.opacity = Math.max(0, vm.flash.material.opacity - dt * 14);
    if (vm.lens) vm.lens.material.color.setHex(p.flashlight ? 0xfff2cc : 0x222222);
    if (vm.model.spin) vm.model.spin.rotation.z += dt * (p.spin > 0 ? 40 * (p.spin / (def.spinUp || 1)) : 0);
  }
}
