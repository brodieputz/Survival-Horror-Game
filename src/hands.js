// First-person hands and arms. Each hand is a jointed rig (palm, four
// three-jointed fingers and a thumb) in fingerless leather gloves, posed by
// curl values that animate (a trigger squeeze, fingers opening to take a
// magazine). The arms are solved every frame with two-bone IK from a
// shoulder behind the camera to the wrist, so whatever the hands do the
// forearms, elbows and sleeves follow.
//
// Hand frame: the wrist is at the origin, the fingers point down -Z, the
// palm faces -Y and the thumb is on the -X side for a right hand (+X for a
// left one).
import * as THREE from 'three';
import { tex } from './textures.js';
import { lambert as L } from './models.js';

const capGeo = new Map();
const capsule = (r, len) => {
  const k = r.toFixed(4) + ':' + len.toFixed(4);
  if (!capGeo.has(k)) {
    const g = new THREE.CapsuleGeometry(r, len, 4, 10);
    g.rotateX(Math.PI / 2); // along Z
    capGeo.set(k, g);
  }
  return capGeo.get(k);
};
const sphereGeo = new THREE.SphereGeometry(1, 14, 10);

export function handMats(opts = {}) {
  return {
    skin: L({ color: opts.skin ?? 0xc8987a, emissive: 0x24170f, roughness: 0.55 }),
    glove: L({ color: opts.glove ?? 0x4a3c30, emissive: 0x100c09, roughness: 0.42, metalness: 0.04, map: tex('fabric', 44) }),
    pad: L({ color: 0x1e1c1a, emissive: 0x060605, roughness: 0.7 }),
    nail: L({ color: 0xd8b8a8, emissive: 0x1a1210, roughness: 0.3 }),
    sleeve: L({ color: opts.sleeve ?? 0x5e5644, emissive: 0x13110d, roughness: 0.95, map: tex('fabric', 40) }),
    cuff: L({ color: 0x3a342a, emissive: 0x0b0a08, roughness: 0.9, map: tex('fabric', 41) }),
  };
}

// finger lengths (proximal, middle, distal) and radius; x across the knuckles
const FINGERS = [
  { len: [0.043, 0.026, 0.021], r: 0.0094, x: 0.027, z: 0.0 },
  { len: [0.047, 0.029, 0.023], r: 0.0097, x: 0.009, z: -0.003 },
  { len: [0.044, 0.027, 0.022], r: 0.0092, x: -0.009, z: -0.001 },
  { len: [0.035, 0.021, 0.019], r: 0.0082, x: -0.026, z: 0.006 },
];
const PALM_LEN = 0.084;

function seg(parent, r, len, mat, z = 0) {
  const j = new THREE.Group();
  j.position.z = z;
  parent.add(j);
  const m = new THREE.Mesh(capsule(r, Math.max(0.001, len - r * 1.1)), mat);
  m.position.z = -len / 2;
  j.add(m);
  return j;
}

// Build a hand. side: 1 right, -1 left.
export function makeHand(side, mats) {
  const root = new THREE.Group();
  const s = side; // thumb on -X for a right hand
  // palm: a flattened, slightly tapered slab
  const palm = new THREE.Mesh(sphereGeo, mats.glove);
  palm.scale.set(0.043, 0.016, 0.05);
  palm.position.set(0, 0, -0.045);
  root.add(palm);
  const heel = new THREE.Mesh(sphereGeo, mats.glove);
  heel.scale.set(0.036, 0.017, 0.03);
  heel.position.set(-s * 0.006, -0.002, -0.012);
  root.add(heel);
  // the back of the glove: knuckle guard and a strap at the wrist
  const guard = new THREE.Mesh(capsule(0.009, 0.05), mats.pad);
  guard.rotation.y = Math.PI / 2;
  guard.position.set(0, 0.013, -0.074);
  root.add(guard);
  const strap = new THREE.Mesh(capsule(0.006, 0.05), mats.pad);
  strap.rotation.y = Math.PI / 2;
  strap.scale.set(1, 2.2, 1);
  strap.position.set(0, 0.008, -0.006);
  root.add(strap);
  const fingers = [];
  for (const f of FINGERS) {
    const base = new THREE.Group();
    base.position.set(s * -f.x, 0.001, -PALM_LEN + f.z);
    root.add(base);
    const knuckle = new THREE.Mesh(sphereGeo, mats.glove);
    knuckle.scale.setScalar(f.r * 1.15);
    base.add(knuckle);
    const j0 = seg(base, f.r, f.len[0], mats.glove);
    const j1 = seg(j0, f.r * 0.93, f.len[1], mats.skin, -f.len[0]);
    const j2 = seg(j1, f.r * 0.86, f.len[2], mats.skin, -f.len[1]);
    const nail = new THREE.Mesh(sphereGeo, mats.nail);
    nail.scale.set(f.r * 0.7, f.r * 0.25, f.r * 0.9);
    nail.position.set(0, f.r * 0.62, -f.len[2] * 0.62);
    j2.add(nail);
    fingers.push({ base, j: [j0, j1, j2], spread: (f.x / 0.027) * 0.07 });
  }
  // the thumb: a metacarpal from the heel of the hand, then two joints
  const tb = new THREE.Group();
  tb.position.set(s * -0.03, -0.004, -0.022);
  root.add(tb);
  const t0 = seg(tb, 0.0125, 0.044, mats.glove);
  const t1 = seg(t0, 0.0112, 0.031, mats.glove, -0.044);
  const t2 = seg(t1, 0.0102, 0.026, mats.skin, -0.031);
  const tn = new THREE.Mesh(sphereGeo, mats.nail);
  tn.scale.set(0.0075, 0.0028, 0.009);
  tn.position.set(0, 0.0068, -0.016);
  t2.add(tn);
  const hand = { root, side: s, fingers, thumb: [tb, t0, t1, t2], pose: null };
  setHandPose(hand, POSES.relaxed);
  return hand;
}

// Finger poses: curl per finger (0 straight .. 1 a tight fist), the thumb's
// direction (out to its side, toward the palm, along the fingers; mirrored
// for a left hand) and its curl, and how far the fingers spread.
export const POSES = {
  relaxed: { curl: [0.25, 0.3, 0.35, 0.4], thumb: [0.7, -0.25, -0.62, 0.2], spread: 0.4 },
  open: { curl: [0.06, 0.08, 0.1, 0.12], thumb: [0.85, -0.12, -0.5, 0.05], spread: 1 },
  fist: { curl: [1, 1, 1, 1], thumb: [-0.35, -0.75, -0.55, 0.5], spread: 0 },
  pistol: { curl: [0.12, 0.92, 0.95, 0.98], thumb: [0.12, -0.5, -0.86, 0.12], spread: 0.1 },
  trigger: { curl: [0.42, 0.92, 0.95, 0.98], thumb: [0.12, -0.5, -0.86, 0.12], spread: 0.1 },
  support: { curl: [0.62, 0.66, 0.7, 0.74], thumb: [0.82, -0.22, -0.52, 0.05], spread: 0.2 },
  cup: { curl: [0.5, 0.55, 0.6, 0.65], thumb: [0.55, -0.5, -0.6, 0.3], spread: 0.3 },
  grab: { curl: [0.72, 0.76, 0.8, 0.84], thumb: [0.35, -0.6, -0.65, 0.45], spread: 0.15 },
  pinch: { curl: [0.55, 0.85, 0.92, 0.95], thumb: [0.3, -0.45, -0.85, 0.3], spread: 0.1 },
  torch: { curl: [0.86, 0.9, 0.92, 0.95], thumb: [0.9, -0.15, 0.25, 0.2], spread: 0 },
  handle: { curl: [0.9, 0.94, 0.96, 0.98], thumb: [-0.3, -0.8, -0.5, 0.45], spread: 0 },
  ball: { curl: [0.55, 0.58, 0.62, 0.66], thumb: [0.5, -0.55, -0.62, 0.35], spread: 0.6 },
};

export function lerpPose(a, b, k) {
  const L2 = (x, y) => x + (y - x) * k;
  return { curl: a.curl.map((c, i) => L2(c, b.curl[i])), thumb: a.thumb.map((c, i) => L2(c, b.thumb[i])), spread: L2(a.spread, b.spread) };
}

const hX = new THREE.Vector3();
const hY = new THREE.Vector3();
const hZ = new THREE.Vector3();
const hM = new THREE.Matrix4();
// Bend every joint to match a pose (curling toward the palm, -Y).
export function setHandPose(hand, pose) {
  hand.pose = pose;
  const s = hand.side;
  hand.fingers.forEach((f, i) => {
    const c = pose.curl[i];
    f.j[0].rotation.x = -c * 1.45;
    f.j[1].rotation.x = -c * 1.65;
    f.j[2].rotation.x = -c * 1.15;
    f.base.rotation.y = s * f.spread * pose.spread * 2.2 * (1 - c);
  });
  const [a, b, c, cu] = pose.thumb;
  const [tb, t0, t1, t2] = hand.thumb;
  // aim the thumb, its nail turned away from the palm
  hZ.set(s * a, b, c).normalize().negate(); // the thumb runs down its local -Z
  hY.set(-s * 0.45, 1, 0.2);
  hY.addScaledVector(hZ, -hY.dot(hZ)).normalize();
  hX.crossVectors(hY, hZ);
  tb.quaternion.setFromRotationMatrix(hM.makeBasis(hX, hY, hZ));
  t0.rotation.x = -cu * 0.25;
  t1.rotation.x = -cu * 0.9;
  t2.rotation.x = -cu * 0.8;
}

// ---------------------------------------------------------------- arms
const UP = new THREE.Vector3(0, 1, 0);
const tA = new THREE.Vector3();
const tB = new THREE.Vector3();
const tC = new THREE.Vector3();
const tD = new THREE.Vector3();

// Two-bone IK: shoulder S, target T, bone lengths, a pole the elbow bends
// toward. Writes the elbow position into `elbow` and returns it.
export function solveIK(S, T, L1, L2, pole, elbow) {
  const d = tA.subVectors(T, S);
  let dist = d.length();
  const max = (L1 + L2) * 0.999;
  const min = Math.abs(L1 - L2) + 1e-3;
  dist = Math.min(max, Math.max(min, dist));
  const dn = d.normalize();
  const cosA = (L1 * L1 + dist * dist - L2 * L2) / (2 * L1 * dist);
  const a = Math.acos(Math.min(1, Math.max(-1, cosA)));
  const pp = tB.copy(pole).addScaledVector(dn, -pole.dot(dn));
  if (pp.lengthSq() < 1e-8) pp.set(0, -1, 0);
  pp.normalize();
  elbow.copy(S).addScaledVector(dn, Math.cos(a) * L1).addScaledVector(pp, Math.sin(a) * L1);
  return elbow;
}

// A tapered limb segment between two points (a cylinder with ball ends).
function limbSeg(r0, r1, len, mat) {
  const g = new THREE.Group();
  const geo = new THREE.CylinderGeometry(r1, r0, len, 14, 1, true);
  geo.translate(0, len / 2, 0);
  const m = new THREE.Mesh(geo, mat);
  g.add(m);
  // fabric folds: a couple of soft rings
  for (const t of [0.35, 0.68]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry((r0 + (r1 - r0) * t) * 1.02, 0.004, 4, 16), mat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = len * t;
    ring.rotation.y = t * 2;
    g.add(ring);
  }
  return g;
}
const orient = (obj, from, to) => {
  obj.position.copy(from);
  const dir = tC.subVectors(to, from).normalize();
  obj.quaternion.setFromUnitVectors(UP, dir);
};

// An arm from shoulder to wrist: sleeve, elbow, forearm and cuff. Lives in
// the view model's space.
export function makeArm(side, mats, L1 = 0.3, L2 = 0.285) {
  const g = new THREE.Group();
  const upper = limbSeg(0.048, 0.043, L1, mats.sleeve);
  const fore = limbSeg(0.042, 0.034, L2 - 0.03, mats.sleeve);
  const elbowBall = new THREE.Mesh(sphereGeo, mats.sleeve);
  elbowBall.scale.setScalar(0.045);
  const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.038, 0.03, 14), mats.cuff);
  g.add(upper, fore, elbowBall, cuff);
  const arm = { group: g, side, L1, L2, upper, fore, elbowBall, cuff, elbow: new THREE.Vector3() };
  return arm;
}

// Pose an arm: shoulder and wrist in the same space as the arm's group.
export function updateArm(arm, S, W, pole) {
  const E = solveIK(S, W, arm.L1, arm.L2, pole, arm.elbow);
  orient(arm.upper, S, E);
  // the forearm sleeve stops a cuff's width short of the wrist
  const fdir = tD.subVectors(W, E);
  const flen = fdir.length();
  const cuffAt = tB.copy(E).addScaledVector(fdir, (flen - 0.03) / flen);
  orient(arm.fore, E, cuffAt);
  arm.fore.scale.y = (flen - 0.03) / (arm.L2 - 0.03);
  arm.elbowBall.position.copy(E);
  orient(arm.cuff, cuffAt, W);
  arm.cuff.position.copy(cuffAt).addScaledVector(fdir, 0.012 / flen);
}
