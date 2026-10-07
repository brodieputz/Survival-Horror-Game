// Low-poly humanoid rigs: zombie variants and human survivors. Every rig
// exposes the same joints (hips, torso, head, jaw, arms, legs) so the
// animation code can drive them all the same way.
import * as THREE from 'three';
import { tex } from './textures.js';
import { box, pivot, lambert as L, basic as B } from './models.js';

function humanoid(o) {
  const skin = L({ color: o.skin, map: tex('flesh', o.fleshSeed ?? 11) });
  const shirt = L({ color: o.shirt });
  const pants = L({ color: o.pants });
  const boots = L({ color: o.boots ?? 0x1a1410 });
  const root = new THREE.Group();
  const hips = pivot(root, 0, o.hipY, 0);
  const torso = pivot(hips, 0, 0, 0);
  torso.rotation.x = o.lean;
  const tw = o.torsoW;
  const th = o.torsoH;
  const td = o.torsoD ?? 0.32;
  torso.add(box(tw, th, td, o.shirtless ? skin : shirt, 0, th / 2 + 0.05, 0));
  torso.add(box(tw * 0.92, 0.2, td * 0.95, pants, 0, 0.02, 0)); // belt line
  if (o.shirtless) torso.add(box(tw * 0.9, 0.08, td * 1.02, shirt, 0, 0.18, 0)); // rag
  const neckY = th + 0.08;
  const head = pivot(torso, 0, neckY + 0.06, o.headFwd ?? 0.04);
  const skull = new THREE.Mesh(new THREE.SphereGeometry(o.headR ?? 0.18, 8, 6), skin);
  skull.scale.set(1, 1.12, 1.05);
  skull.position.y = 0.1;
  skull.castShadow = true;
  head.add(skull);
  const jaw = pivot(head, 0, 0.0, 0.02);
  jaw.add(box(0.22, 0.07, 0.18, skin, 0, -0.03, 0.06));
  const eyeMat = B({ color: o.eyes ?? 0xd8d8b0 });
  for (const s of [-1, 1]) {
    const e = new THREE.Mesh(new THREE.SphereGeometry(o.eyeR ?? 0.028, 5, 4), eyeMat);
    e.position.set(s * 0.068, 0.13, 0.165);
    head.add(e);
  }
  if (o.hair != null) {
    const hair = L({ color: o.hair });
    const cap = new THREE.Mesh(new THREE.SphereGeometry((o.headR ?? 0.18) * 1.06, 8, 5, 0, Math.PI * 2, 0, Math.PI * 0.5), hair);
    cap.position.set(0, 0.13, -0.01);
    cap.rotation.x = -0.25;
    head.add(cap);
    if (o.longHair) head.add(box(0.3, 0.3, 0.08, hair, 0, -0.02, -0.15));
  }
  const arms = [];
  const armLen = o.armLen ?? 0.66;
  for (const s of [-1, 1]) {
    const sh = pivot(torso, s * (tw / 2 + 0.07), th - 0.04, 0);
    sh.add(box(0.13, armLen * 0.52, 0.13, o.sleeves === false ? skin : shirt, 0, -armLen * 0.26, 0));
    const fore = pivot(sh, 0, -armLen * 0.52, 0);
    fore.add(box(0.11, armLen * 0.5, 0.11, skin, 0, -armLen * 0.25, 0));
    fore.add(box(0.1, 0.1, 0.1, skin, 0, -armLen * 0.52, 0.01));
    arms.push({ sh, fore, s });
  }
  const legs = [];
  if (!o.noLegs) {
    const ul = o.hipY * 0.52;
    const ll = o.hipY * 0.48;
    for (const s of [-1, 1]) {
      const hip = pivot(hips, s * tw * 0.26, 0, 0);
      hip.add(box(0.17, ul, 0.17, pants, 0, -ul / 2, 0));
      const knee = pivot(hip, 0, -ul, 0);
      knee.add(box(0.15, ll, 0.15, pants, 0, -ll / 2, 0));
      knee.add(box(0.16, 0.08, 0.27, boots, 0, -ll + 0.04, 0.05));
      legs.push({ hip, knee, s });
    }
  }
  return { root, hips, torso, head, jaw, arms, legs, hipY: o.hipY, height: o.hipY + th + 0.45, baseLean: o.lean, mats: { skin, shirt, pants } };
}

const ZSKIN = [0x8c8676, 0x7a8470, 0x8a7a72, 0x6e7a6a, 0x9a8e80];
const ZCLOTH = [0x3a3a44, 0x4a2e22, 0x2e3a2e, 0x5a4a3a, 0x3a2a3a, 0x6a6458, 0x2a3442, 0x5a2420];

export function makeZombie(type, rng) {
  const pick = (a) => a[Math.floor(rng() * a.length)];
  let m;
  switch (type) {
    case 'runner':
      m = humanoid({ skin: pick(ZSKIN), shirt: pick(ZCLOTH), pants: pick(ZCLOTH), torsoW: 0.48, torsoH: 0.72, hipY: 0.98, lean: 0.55, eyes: 0xff3010, shirtless: rng() < 0.6, sleeves: false, fleshSeed: 14 });
      break;
    case 'fat':
      m = humanoid({ skin: 0x9a8c7a, shirt: pick(ZCLOTH), pants: pick(ZCLOTH), torsoW: 0.92, torsoH: 0.8, torsoD: 0.62, hipY: 0.9, lean: 0.12, eyes: 0xffc020, headR: 0.2, armLen: 0.62, sleeves: false, fleshSeed: 15 });
      {
        const belly = new THREE.Mesh(new THREE.SphereGeometry(0.48, 9, 7), m.mats.skin);
        belly.position.set(0, 0.36, 0.14);
        belly.scale.set(1.05, 0.9, 0.9);
        belly.castShadow = true;
        m.torso.add(belly);
      }
      break;
    case 'rotter':
      m = humanoid({ skin: 0x5e7a4a, shirt: 0x2a2a1e, pants: 0x2a261a, torsoW: 0.6, torsoH: 0.8, hipY: 0.95, lean: 0.35, eyes: 0x101010, eyeR: 0.04, fleshSeed: 16, sleeves: false });
      {
        const bone = L({ color: 0xb8ae96 });
        for (let i = 0; i < 4; i++) m.torso.add(box(0.5, 0.035, 0.05, bone, 0, 0.3 + i * 0.12, 0.17));
        const glow = B({ color: 0x9aff40 });
        for (const s of [-1, 1]) m.head.add(box(0.03, 0.03, 0.02, glow, s * 0.068, 0.13, 0.18));
      }
      break;
    case 'armored':
      m = humanoid({ skin: pick(ZSKIN), shirt: 0x1c2230, pants: 0x1a1e28, torsoW: 0.62, torsoH: 0.8, hipY: 0.98, lean: 0.2, eyes: 0xff4010, fleshSeed: 17 });
      {
        const armor = L({ color: 0x14161c });
        const vest = box(0.72, 0.62, 0.44, armor, 0, 0.5, 0);
        m.torso.add(vest);
        const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 5, 0, Math.PI * 2, 0, Math.PI * 0.55), armor);
        helmet.position.y = 0.14;
        m.head.add(helmet);
        const visor = box(0.3, 0.09, 0.04, L({ color: 0x223040, emissive: 0x0a1018 }), 0, 0.14, 0.2);
        m.head.add(visor);
        for (const a of m.arms) a.sh.add(box(0.2, 0.18, 0.2, armor, 0, -0.05, 0));
        m.armored = true;
      }
      break;
    case 'crawler':
      m = humanoid({ skin: pick(ZSKIN), shirt: pick(ZCLOTH), pants: pick(ZCLOTH), torsoW: 0.5, torsoH: 0.7, hipY: 0.28, lean: 1.45, eyes: 0xff3010, noLegs: true, fleshSeed: 18 });
      {
        const gore = L({ color: 0x5a0a0a });
        m.hips.add(box(0.4, 0.14, 0.3, gore, 0, -0.04, 0));
        m.crawl = true;
        m.height = 0.75;
      }
      break;
    case 'walker':
    default:
      m = humanoid({ skin: pick(ZSKIN), shirt: pick(ZCLOTH), pants: pick(ZCLOTH), torsoW: 0.56, torsoH: 0.78, hipY: 0.95, lean: 0.3, eyes: 0xe8e0a0, hair: rng() < 0.6 ? pick([0x1a1410, 0x3a2614, 0x6a6a6a]) : null, longHair: rng() < 0.3, fleshSeed: 11 + Math.floor(rng() * 4) });
      break;
  }
  // torn clothes and wounds
  const blood = L({ color: 0x4a0606 });
  for (let i = 0; i < 2; i++) {
    const w = box(0.12 + rng() * 0.1, 0.1 + rng() * 0.1, 0.02, blood, (rng() - 0.5) * 0.3, 0.3 + rng() * 0.4, 0.17);
    m.torso.add(w);
  }
  return m;
}

// A living survivor. `look` comes from the run's survivor record.
export function makeHuman(look) {
  const m = humanoid({
    skin: look.skin,
    shirt: look.shirt,
    pants: look.pants,
    torsoW: look.female ? 0.48 : 0.56,
    torsoH: 0.74,
    torsoD: 0.28,
    hipY: 0.94,
    lean: 0.04,
    eyes: 0x161210,
    eyeR: 0.022,
    hair: look.hair,
    longHair: look.female,
    headR: 0.17,
    fleshSeed: 12,
    boots: 0x2a1c10,
  });
  if (look.hat) {
    const hat = L({ color: 0x3a3a2a });
    m.head.add(box(0.4, 0.04, 0.4, hat, 0, 0.24, 0));
    m.head.add(box(0.26, 0.14, 0.26, hat, 0, 0.3, 0));
  }
  // backpack
  m.torso.add(box(0.36, 0.42, 0.18, L({ color: 0x3a3424 }), 0, 0.45, -0.22));
  const right = m.arms.find((a) => a.s === 1);
  m.gunMount = pivot(right.fore, 0, -0.36, 0.06);
  return m;
}
