// Humanoid rigs: zombie variants and human survivors. Everyone is built to
// the same real-world scale (about 1.8 m tall, eyes at ~1.68 m, matching the
// player's eye line). Every rig exposes the same joints (hips, torso, head,
// jaw, arms, legs) so the animation code can drive them all the same way.
import * as THREE from 'three';
import { tex } from './textures.js';
import { pivot, lambert as L, basic as B } from './models.js';

export const HUMAN_HEIGHT = 1.8;
export const HUMAN_EYE = 1.68;

const caps = new Map();
function capsule(r, len, mat, x = 0, y = 0, z = 0, sx = 1, sz = 1) {
  const key = r + ':' + len;
  if (!caps.has(key)) caps.set(key, new THREE.CapsuleGeometry(r, len, 4, 10));
  const m = new THREE.Mesh(caps.get(key), mat);
  m.position.set(x, y, z);
  m.scale.set(sx, 1, sz);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}
function ball(r, mat, x = 0, y = 0, z = 0, sx = 1, sy = 1, sz = 1) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), mat);
  m.position.set(x, y, z);
  m.scale.set(sx, sy, sz);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}
function block(w, h, d, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

// o: skin, shirt, pants, boots, build (1 = average), lean, eyes, hair...
function humanoid(o) {
  const build = o.build ?? 1;
  const skin = L({ color: o.skin, map: tex('flesh', o.fleshSeed ?? 11), roughness: 0.75 });
  const shirt = L({ color: o.shirt, map: tex('fabric', o.fabricSeed ?? 40), roughness: 0.95 });
  const pants = L({ color: o.pants, map: tex('denim', 41), roughness: 0.95 });
  const boots = L({ color: o.boots ?? 0x1a1410, roughness: 0.7 });
  const root = new THREE.Group();
  const hipY = o.hipY ?? 0.94;
  const hips = pivot(root, 0, hipY, 0);
  const torso = pivot(hips, 0, 0, 0);
  torso.rotation.x = o.lean;
  const sw = 0.2 * build; // half shoulder width
  const top = o.shirtless ? skin : shirt;
  // pelvis, belly, chest
  hips.add(capsule(0.13, 0.08, pants, 0, 0.04, 0, 1.25 * build, 0.85));
  torso.add(capsule(0.135, 0.1, top, 0, 0.2, 0, 1.15 * build, 0.82));
  torso.add(capsule(0.155, 0.12, top, 0, 0.37, 0.005, 1.28 * build, 0.82));
  if (o.belly) torso.add(ball(0.26, top, 0, 0.22, 0.09, 1.15, 1, 1.05));
  // neck & head
  torso.add(capsule(0.05, 0.06, skin, 0, 0.55, 0.01));
  const head = pivot(torso, 0, 0.6, o.headFwd ?? 0.02);
  head.add(ball(0.105, skin, 0, 0.1, 0, 0.92, 1.12, 1.0));
  head.add(block(0.03, 0.04, 0.03, skin, 0, 0.09, 0.1)); // nose
  for (const s of [-1, 1]) head.add(ball(0.022, skin, s * 0.1, 0.1, -0.005, 0.6, 1, 1)); // ears
  const jaw = pivot(head, 0, 0.04, 0.02);
  jaw.add(block(0.13, 0.04, 0.1, skin, 0, -0.01, 0.03));
  const eyeMat = B({ color: o.eyes ?? 0x1a1410 });
  for (const s of [-1, 1]) head.add(ball(o.eyeR ?? 0.014, eyeMat, s * 0.038, 0.12, 0.092));
  if (o.hair != null) {
    const hair = L({ color: o.hair, roughness: 0.9 });
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.112, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.55), hair);
    cap.position.set(0, 0.12, -0.008);
    cap.rotation.x = -0.2;
    cap.castShadow = true;
    head.add(cap);
    if (o.longHair) head.add(block(0.2, 0.22, 0.06, hair, 0, 0.04, -0.09));
  }
  const arms = [];
  for (const s of [-1, 1]) {
    const sh = pivot(torso, s * (sw + 0.035), 0.47, 0);
    sh.add(ball(0.06, top, 0, 0, 0)); // shoulder
    sh.add(capsule(0.05, 0.2, o.sleeves === false ? skin : top, 0, -0.15, 0));
    const fore = pivot(sh, 0, -0.29, 0);
    fore.add(capsule(0.042, 0.19, o.longSleeves ? top : skin, 0, -0.135, 0));
    fore.add(block(0.07, 0.09, 0.035, skin, 0, -0.3, 0.005)); // hand
    arms.push({ sh, fore, s });
  }
  const legs = [];
  if (!o.noLegs) {
    for (const s of [-1, 1]) {
      const hip = pivot(hips, s * 0.1 * build, 0, 0);
      hip.add(capsule(0.072 * Math.sqrt(build), 0.3, pants, 0, -0.23, 0));
      const knee = pivot(hip, 0, -0.46, 0);
      knee.add(capsule(0.056, 0.32, pants, 0, -0.22, 0));
      knee.add(block(0.1, 0.08, 0.25, boots, 0, -0.44, 0.045));
      legs.push({ hip, knee, s });
    }
  }
  return { root, hips, torso, head, jaw, arms, legs, hipY, height: HUMAN_HEIGHT, baseLean: o.lean, build, mats: { skin, shirt, pants } };
}

// Invisible hit hulls around the torso, head and legs. Bullets are tested
// against these rather than the slim limbs, so a shot that looks like it
// connects does. They move with the body as it leans and staggers.
const HULL = new THREE.MeshBasicMaterial({ visible: false });
function addHulls(m) {
  const b = m.build;
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.31 * b, 0.2, 2, 8), HULL);
  torso.position.y = 0.2;
  m.torso.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), HULL);
  head.position.y = 0.1;
  m.head.add(head);
  if (m.legs.length) {
    const legs = new THREE.Mesh(new THREE.BoxGeometry(0.5 * b, 0.9, 0.3), HULL);
    legs.position.y = -0.47;
    m.hips.add(legs);
  }
}

const ZSKIN = [0x8c8676, 0x7a8470, 0x8a7a72, 0x6e7a6a, 0x9a8e80];
const ZCLOTH = [0x3a3a44, 0x4a2e22, 0x2e3a2e, 0x5a4a3a, 0x3a2a3a, 0x6a6458, 0x2a3442, 0x5a2420];

export function makeZombie(type, rng) {
  const pick = (a) => a[Math.floor(rng() * a.length)];
  let m;
  switch (type) {
    case 'runner':
      m = humanoid({ skin: pick(ZSKIN), shirt: pick(ZCLOTH), pants: pick(ZCLOTH), build: 0.9, lean: 0.45, eyes: 0xff3010, eyeR: 0.016, shirtless: rng() < 0.6, sleeves: false, fleshSeed: 14 });
      break;
    case 'fat':
      m = humanoid({ skin: 0x9a8c7a, shirt: pick(ZCLOTH), pants: pick(ZCLOTH), build: 1.45, lean: 0.1, eyes: 0xffc020, belly: true, sleeves: false, fleshSeed: 15 });
      break;
    case 'rotter':
      m = humanoid({ skin: 0x5e7a4a, shirt: 0x2a2a1e, pants: 0x2a261a, build: 0.95, lean: 0.3, eyes: 0x9aff40, eyeR: 0.016, fleshSeed: 16, sleeves: false });
      {
        const bone = L({ color: 0xb8ae96 });
        for (let i = 0; i < 4; i++) m.torso.add(block(0.24, 0.022, 0.03, bone, 0, 0.26 + i * 0.06, 0.13));
      }
      break;
    case 'armored':
      m = humanoid({ skin: pick(ZSKIN), shirt: 0x1c2230, pants: 0x1a1e28, build: 1.08, lean: 0.18, eyes: 0xff4010, fleshSeed: 17, longSleeves: true });
      {
        const armor = L({ color: 0x14161c, roughness: 0.6 });
        m.torso.add(block(0.42, 0.36, 0.3, armor, 0, 0.33, 0));
        const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.125, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.55), armor);
        helmet.position.y = 0.12;
        helmet.castShadow = true;
        m.head.add(helmet);
        m.head.add(block(0.17, 0.05, 0.03, L({ color: 0x223040, emissive: 0x0a1018, roughness: 0.2, metalness: 0.4 }), 0, 0.12, 0.11));
        for (const a of m.arms) a.sh.add(block(0.12, 0.1, 0.12, armor, 0, -0.03, 0));
        m.armored = true;
      }
      break;
    case 'crawler':
      m = humanoid({ skin: pick(ZSKIN), shirt: pick(ZCLOTH), pants: pick(ZCLOTH), build: 0.95, lean: 1.45, hipY: 0.26, eyes: 0xff3010, noLegs: true, fleshSeed: 18 });
      m.hips.add(block(0.26, 0.1, 0.2, L({ color: 0x5a0a0a }), 0, -0.04, 0));
      m.crawl = true;
      m.height = 0.7;
      break;
    case 'walker':
    default:
      m = humanoid({
        skin: pick(ZSKIN),
        shirt: pick(ZCLOTH),
        pants: pick(ZCLOTH),
        build: 0.95 + rng() * 0.15,
        lean: 0.22,
        eyes: 0xe8e0a0,
        eyeR: 0.016,
        hair: rng() < 0.6 ? pick([0x1a1410, 0x3a2614, 0x6a6a6a]) : null,
        longHair: rng() < 0.3,
        fleshSeed: 11 + Math.floor(rng() * 4),
        fabricSeed: 40 + Math.floor(rng() * 3),
      });
      break;
  }
  // torn clothes and wounds
  const blood = L({ color: 0x3a0404, roughness: 0.35 });
  for (let i = 0; i < 3; i++) m.torso.add(block(0.06 + rng() * 0.08, 0.05 + rng() * 0.08, 0.02, blood, (rng() - 0.5) * 0.24, 0.15 + rng() * 0.3, 0.13));
  addHulls(m);
  return m;
}

// A living survivor. `look` comes from the run's survivor record.
export function makeHuman(look) {
  const m = humanoid({
    skin: look.skin,
    shirt: look.shirt,
    pants: look.pants,
    build: look.female ? 0.88 : 1.0,
    lean: 0.03,
    eyes: 0x161210,
    hair: look.hair,
    longHair: look.female,
    longSleeves: !look.female,
    fleshSeed: 12,
    fabricSeed: 40 + (look.shirt % 3),
    boots: 0x2a1c10,
  });
  if (look.hat) {
    const hat = L({ color: 0x3a3a2a, roughness: 0.9 });
    m.head.add(block(0.28, 0.02, 0.28, hat, 0, 0.18, 0));
    m.head.add(block(0.17, 0.09, 0.17, hat, 0, 0.23, 0));
  }
  // backpack
  m.torso.add(block(0.28, 0.32, 0.12, L({ color: 0x3a3424, map: tex('fabric', 42) }), 0, 0.32, -0.17));
  const right = m.arms.find((a) => a.s === 1);
  m.gunMount = pivot(right.fore, 0, -0.3, 0.03);
  return m;
}

// A dog: a quadruped rig with the same kind of joints (legs with knees, a
// head with a jaw) plus a tail. look: coat, coat2 (muzzle, chest, socks),
// size (1 = a German shepherd, ~0.62 m at the shoulder).
export function makeDog(look) {
  const k = look.size ?? 1;
  const coat = L({ color: look.coat, map: tex('fabric', 42), roughness: 0.95 });
  const coat2 = L({ color: look.coat2, map: tex('fabric', 42), roughness: 0.95 });
  const dark = L({ color: 0x0e0c0a, roughness: 0.5 });
  const root = new THREE.Group();
  const shoulder = 0.5 * k;
  const body = pivot(root, 0, shoulder, 0);
  // barrel of the body runs along z (the dog faces +z)
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.14 * k, 0.42 * k, 4, 10), coat);
  torso.rotation.x = Math.PI / 2;
  torso.scale.set(1, 1, 1.12);
  torso.castShadow = true;
  body.add(torso);
  body.add(ball(0.15 * k, coat2, 0, -0.03 * k, 0.24 * k, 0.95, 1.05, 0.9)); // chest
  body.add(ball(0.13 * k, coat, 0, 0.01, -0.24 * k, 1, 0.95, 1)); // haunches
  // neck and head
  const neck = pivot(body, 0, 0.06 * k, 0.3 * k);
  neck.add(capsule(0.075 * k, 0.16 * k, coat, 0, 0.08 * k, 0.04 * k));
  neck.children[0].rotation.x = -0.7;
  const head = pivot(neck, 0, 0.19 * k, 0.1 * k);
  head.add(ball(0.095 * k, coat, 0, 0, 0, 1, 0.92, 1.1));
  head.add(block(0.09 * k, 0.07 * k, 0.15 * k, coat2, 0, -0.025 * k, 0.12 * k)); // muzzle
  head.add(ball(0.022 * k, dark, 0, -0.005 * k, 0.2 * k)); // nose
  const jaw = pivot(head, 0, -0.055 * k, 0.07 * k);
  jaw.add(block(0.075 * k, 0.025 * k, 0.12 * k, coat2, 0, 0, 0.05 * k));
  const eye = B({ color: 0x1a1008 });
  for (const s of [-1, 1]) {
    head.add(ball(0.014 * k, eye, s * 0.045 * k, 0.025 * k, 0.075 * k));
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.035 * k, 0.09 * k, 4), coat);
    ear.position.set(s * 0.055 * k, 0.09 * k, -0.01 * k);
    ear.rotation.z = -s * 0.25;
    ear.castShadow = true;
    head.add(ear);
  }
  // tail
  const tail = pivot(body, 0, 0.06 * k, -0.36 * k);
  const tl = capsule(0.03 * k, 0.26 * k, coat, 0, 0.1 * k, -0.08 * k);
  tl.rotation.x = -0.6;
  tail.add(tl);
  // legs: front at +z, back at -z
  const legs = [];
  for (const [fz, front] of [
    [0.24, true],
    [-0.26, false],
  ])
    for (const s of [-1, 1]) {
      const hip = pivot(body, s * 0.085 * k, -0.04 * k, fz * k);
      hip.add(capsule(0.045 * k, 0.16 * k, front ? coat2 : coat, 0, -0.12 * k, 0));
      const knee = pivot(hip, 0, -0.24 * k, 0);
      knee.add(capsule(0.032 * k, 0.17 * k, coat2, 0, -0.1 * k, 0));
      knee.add(block(0.06 * k, 0.03 * k, 0.08 * k, coat2, 0, -0.215 * k, 0.02 * k)); // paw
      legs.push({ hip, knee, s, front });
    }
  return { root, body, neck, head, jaw, tail, legs, shoulder, height: shoulder + 0.25 * k, dog: true };
}
