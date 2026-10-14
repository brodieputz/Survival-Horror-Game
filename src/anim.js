// Procedural character animation for every humanoid: the living and the
// dead share one rig (hips, torso, head, arms with wrists, legs with ankles)
// and one locomotion system, tuned per gait.
//
// Locomotion is a real walk cycle rather than a pendulum: the stride length
// sets the cadence so feet don't skate; hips flex and extend, knees bend
// through the swing and absorb the landing, ankles strike with the heel and
// push off with the toes and stay flat through the stance; the pelvis rises
// over the planted leg (worked out from the legs, so feet stay on the
// ground), sways over it, twists and dips; the shoulders counter-rotate; the
// arms swing against the legs with elbows that bend more as they come
// forward; the head steadies itself. Walk blends into run (longer stride,
// more lean, bent pumping arms, a flight phase). Moving backwards or
// sideways plays the cycle backwards or adds a side lean; turning on the
// spot shuffles the feet.
//
// Each zombie is given quirks: a dragging, stiff-kneed leg, a lolling
// head, arms reaching or dangling, a lurch. On top of that sit attacks
// (wind-up, strike, recovery in four variants), hit reactions on springs
// (the body is knocked away from the shot; a headshot snaps the head back)
// and deaths that buckle, topple and settle in the direction of the blow.
import * as THREE from 'three';
import { solveIK } from './hands.js';

const TAU = Math.PI * 2;
const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
const lerp = (a, b, k) => a + (b - a) * k;
const sstep = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const damp = (a, b, k, dt) => a + (b - a) * (1 - Math.exp(-k * dt));
const wrap = (a) => ((((a + Math.PI) % TAU) + TAU) % TAU) - Math.PI;
// a soft pulse centred on phase c
const bump = (x, c, w) => {
  const d = wrap(x - c) / w;
  return Math.exp(-d * d);
};

// ---------------------------------------------------------------- gaits
// Pairs are [walking, running]. stride: metres per full cycle (two steps).
const BASE = {
  stride: [1.36, 2.5],
  runAt: [2.3, 4.2],
  hip: [0.38, 0.74],
  knee: [1.0, 1.8],
  load: [0.14, 0.32],
  arm: [0.32, 0.9],
  elbow: [0.25, 1.35],
  elbowSwing: [0.25, 0.5],
  lean: [0.04, 0.2],
  bounce: [0.0, 0.045],
  sway: [0.024, 0.012],
  yaw: [0.11, 0.16],
  twist: [0.2, 0.32],
  roll: [0.045, 0.03],
  armOut: 0.07,
  headStab: 0.75,
  shuffle: 0.55,
};
export const GAITS = {
  human: { ...BASE },
  raider: { ...BASE, lean: [0.08, 0.24] },
  walker: { ...BASE, stride: [1.0, 1.7], hip: [0.3, 0.55], knee: [0.7, 1.2], arm: [0.18, 0.4], sway: [0.05, 0.03], roll: [0.09, 0.06], yaw: [0.16, 0.2], lean: [0.0, 0.1], limp: 0.7, loll: 0.35, upper: 'zombie' },
  rotter: { ...BASE, stride: [0.85, 1.3], hip: [0.24, 0.4], knee: [0.55, 0.9], arm: [0.12, 0.3], sway: [0.06, 0.04], roll: [0.11, 0.08], lean: [0.0, 0.06], limp: 0.9, loll: 0.45, upper: 'zombie' },
  runner: { ...BASE, stride: [1.4, 2.6], hip: [0.45, 0.85], knee: [1.1, 2.0], lean: [0.12, 0.42], arm: [0.5, 1.1], elbow: [0.4, 0.9], sway: [0.03, 0.02], limp: 0.2, loll: 0.15, upper: 'flail' },
  fat: { ...BASE, stride: [0.9, 1.4], hip: [0.26, 0.42], knee: [0.6, 1.0], sway: [0.085, 0.06], roll: [0.12, 0.09], yaw: [0.08, 0.1], arm: [0.25, 0.4], armOut: 0.45, lean: [-0.05, 0.05], limp: 0.25, loll: 0.15, upper: 'zombie' },
  armored: { ...BASE, stride: [1.25, 2.1], hip: [0.36, 0.6], sway: [0.03, 0.02], roll: [0.05, 0.04], lean: [0.04, 0.16], limp: 0.15, loll: 0.1, upper: 'zombie' },
  spitter: { ...BASE, stride: [1.1, 1.9], hip: [0.32, 0.6], lean: [0.08, 0.2], arm: [0.2, 0.5], limp: 0.3, loll: 0.25, upper: 'zombie' },
  lurker: { ...BASE, stride: [1.2, 2.4], hip: [0.36, 0.8], lean: [0.08, 0.36], limp: 0.25, loll: 0.25, upper: 'flail' },
  grunt: { ...BASE, stride: [1.3, 2.5], hip: [0.36, 0.7], knee: [0.9, 1.6], bounce: [0.0, 0.06], sway: [0.04, 0.025], arm: [0.35, 0.8], lean: [0.0, 0.18], limp: 0, loll: 0, upper: 'swing' },
  brute: { ...BASE, stride: [1.8, 3.2], hip: [0.32, 0.6], knee: [0.8, 1.4], bounce: [0.02, 0.08], sway: [0.06, 0.04], roll: [0.06, 0.05], arm: [0.3, 0.6], armOut: 0.25, lean: [0.0, 0.15], limp: 0, loll: 0, upper: 'swing' },
};

// ---------------------------------------------------------------- state
// Everything one character's animation remembers. seed gives zombies their
// individual quirks.
export function animState(seed = Math.random()) {
  let x = Math.floor(seed * 2 ** 31) || 1;
  const rnd = () => {
    x = (x * 16807) % 2147483647;
    return x / 2147483647;
  };
  const s = () => {
    const sp = { x: 0, v: 0 };
    return sp;
  };
  return {
    phase: rnd() * TAU,
    gait: 0,
    moveW: 0,
    spd: 0,
    t: rnd() * 100,
    yaw0: null,
    turn: 0,
    last: null,
    vf: 0,
    vl: 0,
    q: {
      limpSide: rnd() < 0.5 ? -1 : 1,
      limp: rnd(),
      tilt: (rnd() - 0.5) * 2,
      reach: 0.75 + rnd() * 0.5,
      armDiff: (rnd() - 0.5) * 0.5,
      jerk: rnd() * 10,
    },
    // hit springs: torso pitch / roll / twist, head, a stagger of the hips
    hp: s(),
    hr: s(),
    ht: s(),
    hh: s(),
    hz: s(),
    recoil: s(),
    lastHit: { lx: 0, lz: -1, head: false, big: false, melee: false },
    death: null,
    atkVar: 0,
  };
}

// a damped spring, sub-stepped so it behaves the same at any frame rate
function spring(o, k, c, dt) {
  const n = Math.min(8, Math.ceil(dt * 120));
  const h = dt / n;
  for (let i = 0; i < n; i++) {
    o.v += (-o.x * k - o.v * c) * h;
    o.x += o.v * h;
  }
}

// Track how fast a character is really moving, relative to where it faces.
export function trackMotion(st, pos, yaw, dt) {
  if (dt <= 0) return;
  if (!st.last) st.last = { x: pos.x, z: pos.z };
  const vx = (pos.x - st.last.x) / dt;
  const vz = (pos.z - st.last.z) / dt;
  st.last.x = pos.x;
  st.last.z = pos.z;
  const fx = Math.sin(yaw);
  const fz = Math.cos(yaw);
  // ignore teleports (stairs, spawns)
  if (vx * vx + vz * vz > 400) return;
  st.vf = damp(st.vf, vx * fx + vz * fz, 10, dt);
  st.vl = damp(st.vl, vx * fz - vz * fx, 10, dt);
  if (st.yaw0 != null) st.turn = damp(st.turn, Math.abs(wrap(yaw - st.yaw0)) / dt, 6, dt);
  st.yaw0 = yaw;
}

// ---------------------------------------------------------------- locomotion
// o: style (a GAITS entry), upper ('swing' arms, 'zombie' reach/dangle,
// 'flail', or 'none' when something else poses the arms), reach (0..1, how
// far a zombie's arms are up), speedMul for the cadence.
export function locomote(m, st, dt, o) {
  const G = o.style;
  st.t += dt;
  const t = st.t;
  // forward speed drives the cycle; mostly-sideways movement still steps
  let sv = st.vf;
  const lat = st.vl;
  const strafe = Math.abs(lat) > Math.abs(sv) * 1.2 ? clamp(lat / 2.5, -1, 1) : 0;
  if (strafe) sv = Math.hypot(sv, lat) * (sv < -0.1 ? -0.8 : 0.8);
  // turning on the spot: shuffle the feet round
  if (Math.abs(sv) < 0.4 && st.turn > 1.2) sv = G.shuffle * Math.min(1, st.turn / 3);
  const spd = Math.abs(sv);
  st.spd = damp(st.spd, spd, 8, dt);
  st.gait = damp(st.gait, sstep(G.runAt[0], G.runAt[1], st.spd), 5, dt);
  st.moveW = damp(st.moveW, sstep(0.04, 0.45, spd), 7, dt);
  const g = st.gait;
  const W = st.moveW;
  const P = (k) => lerp(G[k][0], G[k][1], g);
  const stride = P('stride');
  st.phase += (TAU * sv * dt) / stride;
  const ph = st.phase;
  // quirks: a dragging leg
  const limp = (G.limp || 0) * st.q.limp;
  const L1 = m.L1 || -(m.legs[0]?.knee.position.y ?? -0.46);
  const L2 = m.L2 || (m.legs[0]?.ankle ? -m.legs[0].ankle.position.y + 0.06 : (m.hipY ?? 0.94) - L1 - 0.02);
  m.L1 = L1;
  m.L2 = L2;
  let maxExt = 0;
  // ---- legs
  for (const leg of m.legs) {
    const s = leg.s;
    const bad = limp > 0.3 && s === st.q.limpSide;
    // the bad leg hurries its swing, the good one lingers
    const f = ph + (s > 0 ? Math.PI : 0) + (bad ? Math.sin(ph) * 0.25 * limp : 0);
    let hx = -P('hip') * Math.cos(f) * (bad ? 1 - 0.35 * limp : 1);
    let kx = P('knee') * bump(f, Math.PI * 1.35 - g * 0.15, 0.62 + g * 0.1) * (bad ? 1 - 0.65 * limp : 1) + P('load') * bump(f, 0.25, 0.42);
    // ankle: heel strike, flat through the stance, push off, toes up in the swing
    const stance = Math.pow(Math.max(0, Math.sin(f)), 0.6);
    const flat = -(hx + kx);
    let ax = 0.42 * bump(f, Math.PI * 0.92, 0.32) - 0.16 * bump(f, Math.PI * 1.55, 0.5) - 0.2 * bump(f, 0.02, 0.22);
    ax = lerp(ax, flat + 0.12 * bump(f, Math.PI * 0.85, 0.3), stance * 0.85);
    if (bad) ax += 0.4 * limp * (1 - stance); // the dragging foot's toes scrape
    // standing still: weight settles from one leg to the other
    const idleShift = Math.sin(t * 0.45 + s) * 0.03;
    hx = lerp(-0.02 + idleShift * s, hx, W);
    kx = lerp(0.06 + Math.max(0, idleShift * s) * 1.5, kx, W);
    ax = lerp(-(hx + kx) * 0.9, ax, W);
    if (strafe) leg.hip.rotation.z = s * Math.abs(strafe) * 0.18 * Math.max(0, Math.sin(f + (strafe * s > 0 ? 0 : Math.PI))) * W;
    else leg.hip.rotation.z = s * 0.02;
    leg.hip.rotation.x = hx;
    leg.knee.rotation.x = kx;
    if (leg.ankle) leg.ankle.rotation.x = ax;
    maxExt = Math.max(maxExt, L1 * Math.cos(hx) + L2 * Math.cos(hx + kx));
  }
  // ---- pelvis: over the planted leg
  const hipY = m.hipY ?? 0.94;
  const bounce = P('bounce') * Math.abs(Math.sin(ph)) * W;
  if (m.legs.length) m.hips.position.y = hipY - (L1 + L2 - maxExt) * 0.92 + bounce + Math.sin(t * 1.3) * 0.004 * (1 - W);
  else m.hips.position.y = hipY;
  m.hips.position.x = -P('sway') * Math.sin(ph) * W + Math.sin(t * 0.45) * 0.012 * (1 - W);
  m.hips.position.z = 0;
  m.hips.rotation.set(0, P('yaw') * Math.cos(ph) * W, -P('roll') * Math.sin(ph) * W + (limp > 0.3 ? st.q.limpSide * 0.05 * limp : 0));
  // ---- torso: lean into the speed, counter-twist, breathe
  const breath = Math.sin(t * 1.6) * 0.012;
  const lurch = G.loll ? Math.sin(ph * 0.5 + st.q.jerk) * 0.05 * W : 0;
  m.torso.rotation.set(
    (m.baseLean ?? 0) + P('lean') * W + breath + lurch + (strafe ? 0 : Math.abs(Math.cos(ph)) * 0.02 * W * g),
    -P('twist') * Math.cos(ph) * W,
    P('roll') * 0.8 * Math.sin(ph) * W - strafe * 0.12 + (G.loll ? st.q.tilt * 0.06 : 0)
  );
  // ---- head: steadied against the body's motion, or lolling
  const loll = G.loll || 0;
  m.head.rotation.set(
    -(m.torso.rotation.x - (m.baseLean ?? 0)) * G.headStab * 0.6 + loll * 0.25 + Math.sin(t * 0.9 + st.q.jerk) * 0.04 * loll,
    -m.torso.rotation.y * G.headStab + Math.sin(t * 0.37 + st.q.jerk) * 0.12 * loll,
    loll * st.q.tilt * 0.45 + Math.sin(t * 0.7) * 0.05 * loll - m.torso.rotation.z * 0.5
  );
  // ---- arms
  const upper = o.upper ?? G.upper ?? 'swing';
  if (upper === 'none') return;
  for (const arm of m.arms) {
    const s = arm.s;
    const f = ph + (s > 0 ? Math.PI : 0);
    const c = Math.cos(f);
    let sx;
    let sz = s * (G.armOut + 0.03 * Math.sin(t * 0.8 + s));
    let fx;
    let wx = 0.08;
    if (upper === 'zombie') {
      // reaching for prey, or arms hanging and swinging loose
      const r = (o.reach ?? 0) * st.q.reach;
      const dangle = 0.08 + c * P('arm') * W + Math.sin(t * 1.1 + s) * 0.04;
      const reachA = -1.25 - 0.18 * Math.sin(t * 1.4 + s * 1.7) + c * 0.12 * W + (s > 0 ? st.q.armDiff : -st.q.armDiff);
      sx = lerp(dangle, reachA, clamp(r, 0, 1));
      sz = lerp(sz, s * (0.05 + 0.08 * Math.sin(t * 0.9 + s)), r);
      fx = lerp(-0.12 - Math.max(0, -c) * 0.2 * W, -0.22 - 0.12 * Math.sin(t * 1.7 + s), r);
      wx = lerp(0.35, 0.45 + 0.15 * Math.sin(t * 2 + s), r);
    } else if (upper === 'flail') {
      // a sprinting corpse: arms thrown forward and back, out of time
      const j = Math.sin(f * 1.0 + Math.sin(t * 3 + s) * 0.6);
      sx = -0.5 * (o.reach ?? 0) + P('arm') * j * W * 1.1 + 0.1;
      sz = s * (0.18 + 0.15 * Math.abs(Math.sin(t * 2.3 + s)));
      fx = -P('elbow') - 0.3 * Math.sin(f + 1);
      wx = 0.3;
    } else {
      sx = 0.04 + c * P('arm') * W;
      fx = -(P('elbow') * W + 0.1 * (1 - W) + P('elbowSwing') * Math.max(0, -c) * W);
      wx = 0.05 + 0.1 * Math.max(0, c) * W;
    }
    arm.sh.rotation.set(sx, 0, sz);
    arm.fore.rotation.set(fx, 0, 0);
    if (arm.wrist) arm.wrist.rotation.set(wx, 0, 0);
  }
}

// ---------------------------------------------------------------- crawling
// No legs: drag the body forward with alternating arm pulls.
export function crawl(m, st, dt) {
  st.t += dt;
  const sp = Math.abs(st.vf);
  st.phase += dt * (1.5 + sp * 3.2);
  st.moveW = damp(st.moveW, sstep(0.05, 0.4, sp), 6, dt);
  const ph = st.phase;
  const W = st.moveW;
  m.hips.position.set(0, m.hipY ?? 0.26, 0);
  m.hips.rotation.set(0, Math.sin(ph) * 0.12 * W, Math.sin(ph) * 0.1 * W);
  m.torso.rotation.set(m.baseLean ?? 1.45, -Math.sin(ph) * 0.15 * W, -Math.sin(ph) * 0.12 * W);
  m.head.rotation.set(-0.9 + Math.sin(ph * 2) * 0.08, Math.sin(st.t * 0.6) * 0.2, Math.sin(st.t * 0.8) * 0.1);
  for (const arm of m.arms) {
    const f = ph + (arm.s > 0 ? Math.PI : 0);
    // reach out ahead, plant, pull back under the chest
    const reach = 0.5 + 0.5 * Math.sin(f);
    arm.sh.rotation.set(-2.5 + reach * 0.9 * W - (1 - W) * 0.2, 0, arm.s * (0.25 + 0.15 * reach));
    arm.fore.rotation.set(-0.25 - (1 - reach) * 0.9 * W, 0, 0);
    if (arm.wrist) arm.wrist.rotation.set(0.6 - reach * 0.4, 0, 0);
  }
}

// ---------------------------------------------------------------- attacks
// windup: 0..1 while gathering. p: progress through the blow (0 = the arm
// starts to come through, ~0.25 = follow-through, 1 = recovered) or -1.
// variant: 0 a two-handed overhead slam, 1 / 2 a right / left raking swipe,
// 3 a lunging grab and bite.
export function attackPose(m, st, windup, p = -1) {
  const striking = p >= 0 && p < 1;
  const w = striking ? 1 : sstep(0, 1, windup);
  if (w < 0.001) return;
  // the blow whips through fast, then the body takes its time to recover
  const thru = striking ? sstep(0, 0.22, p) : 0;
  const k = striking ? 1 - sstep(0.35, 1, p) : w;
  const v = st.atkVar;
  const tor = m.torso.rotation;
  const set = (o, key, g, f) => {
    o[key] = lerp(o[key], lerp(g, f, thru), k);
  };
  // gather: rear back and sink; strike: lunge into it
  tor.x += k * lerp(-0.2, 0.42, thru);
  m.hips.position.z += k * lerp(-0.05, 0.12, thru);
  m.hips.position.y -= k * 0.03;
  for (const leg of m.legs) {
    leg.knee.rotation.x += k * 0.15;
    leg.hip.rotation.x -= k * 0.08;
  }
  for (const arm of m.arms) {
    const s = arm.s;
    const lead = v === 1 ? s < 0 : v === 2 ? s > 0 : true;
    const r = arm.sh.rotation;
    if (v === 0) {
      set(r, 'x', -2.75, -0.7);
      set(r, 'z', s * 0.32, s * 0.06);
      set(arm.fore.rotation, 'x', -1.05, -0.12);
    } else if (v === 3) {
      // arms flung wide, then clamping in to hold the prey for the bite
      set(r, 'x', -1.05, -1.5);
      set(r, 'z', s * 0.75, -s * 0.12);
      set(arm.fore.rotation, 'x', -0.7, -0.55);
    } else if (lead) {
      set(r, 'x', -1.6, -0.95);
      set(r, 'z', s * 1.2, -s * 0.5);
      set(arm.fore.rotation, 'x', -1.45, -0.08);
    } else {
      set(r, 'x', -0.75, -0.35);
      set(r, 'z', s * 0.25, s * 0.35);
      set(arm.fore.rotation, 'x', -0.9, -0.6);
    }
    if (arm.wrist) set(arm.wrist.rotation, 'x', 0.45, -0.25);
  }
  if (v === 1 || v === 2) tor.y += k * (v === 1 ? 1 : -1) * lerp(-0.45, 0.55, thru);
  if (v === 3) {
    m.head.rotation.x += k * lerp(-0.4, 0.55, thru);
    tor.x += k * 0.18 * thru;
  }
  if (v === 0) m.head.rotation.x += k * lerp(-0.25, 0.3, thru);
}

// A bellow: chest out, head thrown back, arms spread.
export function roarPose(m, st, a) {
  if (a < 0.001) return;
  const k = sstep(0, 1, a);
  m.torso.rotation.x -= 0.32 * k;
  m.head.rotation.x -= 0.55 * k;
  m.head.rotation.z += Math.sin(st.t * 23) * 0.05 * k;
  for (const arm of m.arms) {
    arm.sh.rotation.x = lerp(arm.sh.rotation.x, -0.55, k);
    arm.sh.rotation.z = lerp(arm.sh.rotation.z, arm.s * 0.85, k);
    arm.fore.rotation.x = lerp(arm.fore.rotation.x, -0.9, k);
    if (arm.wrist) arm.wrist.rotation.x = lerp(arm.wrist.rotation.x, -0.4, k);
  }
}

// ---------------------------------------------------------------- four legs
// Walk / trot (diagonal pairs) blending into a rotary gallop with a flexing
// spine. Works for the hound and for dogs. size scales the stride.
export function quadGait(m, st, dt, o = {}) {
  st.t += dt;
  const body = m.torso || m.body;
  const sv = st.vf;
  const spd = Math.abs(sv);
  const size = o.size ?? 1;
  st.spd = damp(st.spd, spd, 8, dt);
  st.gait = damp(st.gait, sstep(2.2 * size, 4.4 * size, st.spd), 5, dt);
  st.moveW = damp(st.moveW, sstep(0.05, 0.5, spd + (st.turn > 1.2 ? 0.6 : 0)), 7, dt);
  const g = st.gait;
  const W = st.moveW;
  const stride = lerp(0.85, 2.3, g) * size;
  st.phase += (TAU * (Math.abs(sv) < 0.3 && st.turn > 1.2 ? 0.4 : sv) * dt) / stride;
  const ph = st.phase;
  const t = st.t;
  for (const leg of m.legs) {
    const front = leg.front ?? leg.hip.position.z > 0;
    const right = leg.hip.position.x > 0;
    const diag = front === right;
    const off = lerp(diag ? 0 : Math.PI, (front ? 0 : Math.PI * 1.1) + (right ? 0.35 : 0), g);
    const f = ph + off;
    const A = lerp(0.42, 0.85, g) * W;
    leg.hip.rotation.x = -A * Math.cos(f) + (front ? 0 : 0.08 * g);
    // fold the leg through the swing (front legs bend back, hind legs forward)
    const lift = bump(f, Math.PI * 1.3, 0.7) * lerp(0.7, 1.4, g) * W;
    leg.knee.rotation.x = (front ? 1 : -1) * lift * (front ? 1 : 0.8);
  }
  const base = o.baseY ?? m.hipY ?? 0.5;
  const node = m.torso ? m.hips : m.body;
  node.position.y = base + (Math.abs(Math.sin(ph)) * 0.05 * g + Math.abs(Math.sin(ph * 2)) * 0.012 * (1 - g)) * W * size + Math.sin(t * 2.1) * 0.004 * (1 - W);
  // the spine rocks and flexes in the gallop
  body.rotation.x = (m.torso ? m.baseLean ?? 0 : 0) + Math.sin(ph) * 0.1 * g * W;
  body.rotation.z = Math.sin(ph) * 0.03 * (1 - g) * W;
  body.rotation.y = 0;
  // panting breath
  if (m.head && m.torso) m.head.rotation.x = -Math.sin(ph) * 0.12 * g * W + Math.sin(t * 7) * 0.02;
}

// ---------------------------------------------------------------- hits
// Knock the body away from a blow. lx / lz: the push direction in the
// character's own frame (+z forward), power ~0.3..1.5.
export function hitImpulse(st, lx, lz, power, head = false) {
  st.hp.v += lz * 9 * power;
  st.hr.v += -lx * 8 * power;
  st.ht.v += (Math.random() - 0.5) * 6 * power;
  st.hz.v += lz * 1.2 * power;
  if (head) st.hh.v -= 16 * power;
  else st.hh.v += lz * 5 * power;
}
export function hitPose(m, st, dt) {
  spring(st.hp, 150, 11, dt);
  spring(st.hr, 150, 11, dt);
  spring(st.ht, 120, 10, dt);
  spring(st.hh, 190, 12, dt);
  spring(st.hz, 90, 10, dt);
  m.torso.rotation.x += st.hp.x;
  m.torso.rotation.z += st.hr.x;
  m.torso.rotation.y += st.ht.x;
  m.head.rotation.x += st.hh.x;
  m.hips.position.z += st.hz.x * 0.15;
  // a hard hit buckles the knees for a moment
  const buckle = Math.max(0, Math.abs(st.hp.x) - 0.05) * 1.5;
  for (const leg of m.legs) leg.knee.rotation.x += buckle * 0.6;
  m.hips.position.y -= buckle * 0.06;
  for (const arm of m.arms) arm.sh.rotation.z += arm.s * Math.abs(st.hp.x) * 0.8;
}

// ---------------------------------------------------------------- deaths
// Choose how to go down from the killing blow.
export function startDeath(st, info = {}, m = null) {
  const h = st.lastHit;
  let kind = 'back';
  if (m?.quad || m?.dog) kind = 'side';
  else if (m?.crawl) kind = 'slump';
  else if (info.explosive) kind = 'blast';
  else if (h.lz > 0.4) kind = 'front';
  else if (Math.abs(h.lx) > 0.6) kind = 'side';
  else if (info.melee || Math.random() < 0.3) kind = 'crumple';
  st.death = { kind, t: 0, side: h.lx >= 0 ? 1 : -1, twist: (Math.random() - 0.5) * 0.8 };
}

// Pose a falling or fallen body. Writes the root's tilt and height too (call
// after setting its position and heading).
export function deathPose(m, st, dt) {
  const D = st.death;
  D.t += dt;
  const t = D.t;
  const root = m.root;
  root.rotation.order = 'YXZ';
  const kind = D.kind;
  const hipY = m.hipY ?? 0.94;
  if (kind === 'slump') {
    // a crawler just stops: the chest drops, the arms give out
    const f = sstep(0, 0.5, t);
    m.hips.position.set(0, hipY - 0.1 * f, 0);
    m.torso.rotation.set((m.baseLean ?? 1.45) + 0.12 * f, 0, 0.2 * D.side * f);
    m.head.rotation.set(-0.9 + 0.7 * f, 0.6 * D.side * f, 0.3 * f);
    if (m.jaw) m.jaw.rotation.x = 0.4 * f;
    for (const arm of m.arms) {
      arm.sh.rotation.set(lerp(-2.4, -2.9, f), 0, arm.s * lerp(0.3, 0.9, f));
      arm.fore.rotation.set(lerp(-0.4, -0.05, f), 0, 0);
    }
    root.rotation.x = 0;
    root.rotation.z = 0;
    root.position.y = 0;
    return;
  }
  // phase 1: the legs give; phase 2: topple (falling under gravity);
  // phase 3: hit the ground and settle with a bounce
  const buckleT = kind === 'crumple' ? 0.55 : kind === 'blast' ? 0.05 : 0.22;
  const fallT = kind === 'crumple' ? 0.55 : 0.5;
  const b = sstep(0, buckleT, t);
  const f = clamp((t - buckleT * 0.6) / fallT, 0, 1) ** 2;
  const land = t - buckleT * 0.6 - fallT;
  const bounce = land > 0 ? Math.exp(-land * 7) * Math.sin(land * 22) * 0.06 : 0;
  let rx = 0;
  let rz = 0;
  let lift = m.deadLift ?? 0.12;
  if (kind === 'back' || kind === 'blast') rx = -(Math.PI / 2) * f + bounce;
  else if (kind === 'front') rx = (Math.PI / 2) * f - bounce;
  else if (kind === 'side') {
    rz = -D.side * (Math.PI / 2) * f + bounce;
    lift *= 1.6;
  }
  else {
    // crumple: down onto the knees, then over to one side
    rx = (Math.PI / 2) * 0.35 * f;
    rz = -D.side * (Math.PI / 2) * 0.75 * f;
    lift *= 1.3;
  }
  root.rotation.x = rx;
  root.rotation.z = rz;
  root.rotation.y += D.twist * f;
  root.position.y = lift * f;
  if (kind === 'blast') root.position.y += Math.sin(clamp(t / 0.55, 0, 1) * Math.PI) * 0.35;
  if (m.quad || m.dog) {
    // legs kick out, then go limp
    for (const leg of m.legs) {
      leg.hip.rotation.x = lerp(0, (leg.s > 0 ? 0.5 : -0.3) + Math.sin(t * 9 + leg.s) * 0.25 * Math.exp(-t * 2), f);
      leg.knee.rotation.x = 0.3 * f;
    }
    if (m.jaw) m.jaw.rotation.x = 0.35 * f;
    return;
  }
  // the body: knees go, then the limbs flop out
  m.hips.position.set(0, hipY - (kind === 'crumple' ? 0.42 : 0.12) * b * (1 - f * 0.6), 0);
  m.hips.rotation.set(0, 0, 0);
  const tor = m.torso.rotation;
  const baseLean = m.baseLean ?? 0;
  if (kind === 'front') tor.set(baseLean * (1 - f) + 0.3 * b, 0, 0);
  else if (kind === 'crumple') tor.set(baseLean * (1 - f * 0.5) + 0.55 * b * (1 - f * 0.4), 0.2 * D.side, 0.1);
  else tor.set(baseLean * (1 - b) - 0.45 * b * (1 - f * 0.6), D.twist * 0.3, 0);
  m.head.rotation.set(kind === 'front' ? -0.4 * f : kind === 'back' || kind === 'blast' ? 0.35 * b - 0.2 * f : 0.5 * b, (kind === 'front' ? 0.9 : 0.4) * f * D.side, 0.3 * f * D.side);
  if (m.jaw) m.jaw.rotation.x = 0.4 * b;
  const back = kind === 'back' || kind === 'blast';
  for (const leg of m.legs) {
    const s = leg.s;
    const k = kind === 'crumple' ? 1.7 * b * (1 - f * 0.3) : 0.7 * b * (1 - f) + (s === D.side ? (back ? 0.45 : 0.18) : 0.08) * f;
    leg.hip.rotation.set(kind === 'crumple' ? -1.1 * b : (back ? -0.12 - (s === D.side ? 0.2 : 0) : 0.08) * f + 0.15 * s * b * (1 - f), 0, s * 0.16 * f);
    leg.knee.rotation.x = k;
    if (leg.ankle) leg.ankle.rotation.x = (back ? 0.5 : 0.2) * f;
  }
  for (const arm of m.arms) {
    const s = arm.s;
    const near = s === D.side;
    // flung out by the fall, then lying where they landed: one above the
    // head, one along the body
    let fx;
    let fz;
    if (back) {
      fx = near ? -3.0 : 0.12;
      fz = near ? 0.75 : 0.35;
    } else if (kind === 'front') {
      fx = near ? -2.85 : -0.25;
      fz = near ? 0.5 : 0.25;
    } else if (kind === 'side') {
      fx = near ? -1.5 : -0.7;
      fz = near ? 0.2 : 0.1;
    } else {
      fx = -0.4;
      fz = 0.2;
    }
    const fall = kind === 'front' ? -1.6 : kind === 'crumple' ? -0.4 : -1.9;
    const mid = Math.sin(clamp(f, 0, 1) * Math.PI);
    arm.sh.rotation.set(lerp(lerp(0, fall, b * 0.6), fx, f) + mid * (near ? -0.6 : 0.3), 0, s * (lerp(0.1, fz, f) + mid * 0.5));
    arm.fore.rotation.set(-0.25 - 0.6 * b * (1 - f) - (near ? 0.15 : 0.45) * f, 0, 0);
    if (arm.wrist) arm.wrist.rotation.set(0.3 * f, 0, 0);
  }
}

// ---------------------------------------------------------------- arms by IK
// Put a wrist at a point (in the character's root space) with the elbow
// bending toward a pole. Works for the shared humanoid rig.
const vS = new THREE.Vector3();
const vT = new THREE.Vector3();
const vE = new THREE.Vector3();
const vP = new THREE.Vector3();
const vU = new THREE.Vector3();
const vF = new THREE.Vector3();
const vX = new THREE.Vector3();
const vY = new THREE.Vector3();
const vZ = new THREE.Vector3();
const mB = new THREE.Matrix4();
const qA = new THREE.Quaternion();
export function armTo(m, arm, targetRoot, poleRoot) {
  const torso = arm.sh.parent;
  const L1 = -arm.fore.position.y;
  const L2 = -(arm.wrist?.position.y ?? -0.27);
  // into the torso's space
  vT.copy(targetRoot);
  m.root.localToWorld(vT);
  torso.worldToLocal(vT);
  vP.copy(poleRoot).add(targetRoot);
  m.root.localToWorld(vP);
  torso.worldToLocal(vP);
  vS.copy(arm.sh.position);
  vP.sub(vS);
  solveIK(vS, vT, L1, L2, vP, vE);
  vU.subVectors(vE, vS).normalize(); // upper arm
  vF.subVectors(vT, vE).normalize(); // forearm
  // the shoulder's frame: -Y down the upper arm, +Z toward the bend
  vY.copy(vU).negate();
  vZ.copy(vF).addScaledVector(vU, -vF.dot(vU));
  if (vZ.lengthSq() < 1e-8) vZ.set(0, 0, 1).addScaledVector(vY, -vY.z);
  vZ.normalize();
  vX.crossVectors(vY, vZ);
  arm.sh.quaternion.setFromRotationMatrix(mB.makeBasis(vX, vY, vZ));
  const bend = Math.acos(clamp(vU.dot(vF), -1, 1));
  arm.fore.rotation.set(-bend, 0, 0);
}

// Turn a held object so it points along dir (root space) with its top up.
export function pointHeld(m, node, dirRoot, upRoot = UP) {
  vZ.copy(dirRoot).normalize().negate(); // models point down -Z
  vY.copy(upRoot).addScaledVector(vZ, -upRoot.dot(vZ)).normalize();
  vX.crossVectors(vY, vZ);
  qA.setFromRotationMatrix(mB.makeBasis(vX, vY, vZ));
  // root space → the node's parent space
  const parentQ = node.parent.getWorldQuaternion(new THREE.Quaternion());
  const rootQ = m.root.getWorldQuaternion(new THREE.Quaternion());
  node.quaternion.copy(parentQ.invert().multiply(rootQ).multiply(qA));
}
const UP = new THREE.Vector3(0, 1, 0);

// ---------------------------------------------------------------- weapons
// A held weapon is posed in the character's own space - aimed, carried at
// the ready, lowered to reload, swung - and the hands are then put on it by
// IK, so it never floats beside the fist or clips through the arm. Weapons
// are held right-handed (the arm on the -x side, s = -1).
const GS = -1;
const V3 = THREE.Vector3;
// a hand on a weapon: c is the centre of the hand in the weapon model's
// space, fingers point from the wrist to the knuckles, palm is the way the
// palm faces
function handFrame(c, fingers, palm) {
  const Y = fingers.clone().normalize().negate();
  const Z = palm.clone().negate();
  Z.addScaledVector(Y, -Z.dot(Y)).normalize();
  const X = new V3().crossVectors(Y, Z);
  return { c, q: new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(X, Y, Z)) };
}

export function weaponKind(def, model) {
  if (!def) return 'fists';
  const c = def.cat;
  if (c === 'melee') return 'melee';
  if (c === 'thrown') return 'thrown';
  if (c === 'pistol') return 'pistol';
  if (c === 'bow' && !def.look?.crossbow) return 'bow';
  if (c === 'flame') return 'hip';
  if (c === 'launcher' && model?.parts?.warhead) return 'tube';
  return 'rifle';
}

// Put a weapon model in a character's hands (null for bare fists).
// supportZ: where the off hand holds a long gun's handguard.
export function mountWeapon(m, model, def, supportZ = -0.2) {
  unmountWeapon(m);
  const kind = weaponKind(def, model);
  const lk = def?.look || {};
  const hold = new THREE.Group();
  m.root.add(hold);
  const W = { hold, model, def, kind, gp: new V3(), main: null, off: null, base: null, mag: model?.parts?.mag || null, init: false };
  W.off0 = new V3();
  W.q0 = new THREE.Quaternion();
  if (model) {
    const gr = model.grip || { z: 0.06, ang: 0.28 };
    const a = 0.5 + gr.ang * 0.5;
    const trigger = handFrame(new V3(0.035, -0.058, gr.z + 0.012), new V3(0, -Math.sin(a), -Math.cos(a)), new V3(-1, 0, 0));
    switch (kind) {
      case 'melee': {
        W.gp.set(0, 0, 0.05);
        if (lk.saw) {
          W.gp.set(0, 0.13, 0.03);
          W.main = handFrame(new V3(0, 0.165, 0.03), new V3(0.15, -0.2, -1), new V3(0, -1, 0));
          W.off = handFrame(new V3(-0.035, 0.1, -0.1), new V3(0.8, 0, -0.4), new V3(1, 0, 0));
        } else {
          W.main = handFrame(new V3(-0.035, 0, 0.05), new V3(0, 1, 0), new V3(1, 0, 0));
          if (lk.round || lk.axe || lk.spade || lk.big || (lk.len ?? 0.5) > 0.75) W.off = handFrame(new V3(0.035, 0, -0.07), new V3(0, 1, 0), new V3(-1, 0, 0));
        }
        break;
      }
      case 'thrown':
        W.gp.set(0, 0.04, 0);
        W.main = handFrame(new V3(0, 0, 0.0), new V3(0, 0.2, -1), new V3(0, 1, 0));
        break;
      case 'bow':
        // the riser in the left hand, the right hand on the string
        W.gp.set(0, 0, -0.15);
        W.off = handFrame(new V3(-0.03, -0.01, -0.14), new V3(0.6, -0.2, -0.75), new V3(0.9, 0, 0.3));
        W.main = handFrame(new V3(0.0, 0.0, 0.15), new V3(0, -0.1, -1), new V3(-1, 0, 0));
        break;
      case 'pistol':
        W.gp.set(0, -0.03, gr.z);
        W.main = trigger;
        // the support hand cups the shooting hand
        W.off = handFrame(new V3(-0.03, -0.075, gr.z + 0.03), new V3(0.35, -0.75, -0.55), new V3(0.85, 0.1, 0));
        break;
      default: {
        W.gp.set(0, -0.03, gr.z);
        W.main = trigger;
        const fg = model.foreGrip;
        if (fg) W.off = handFrame(new V3(-0.033, fg.y - 0.06, fg.z), new V3(0, -0.5, -0.85), new V3(1, 0, 0));
        else W.off = handFrame(new V3(-0.004, def.cat === 'lmg' ? -0.078 : -0.048, supportZ), new V3(0.8, 0, -0.5), new V3(0, 1, 0));
      }
    }
    // where the off hand fetches and seats a fresh magazine or shell
    const mp = W.mag ? W.mag.position : new V3(0, -0.02, gr.z - 0.12);
    W.magwell =
      kind === 'pistol'
        ? handFrame(new V3(-0.01, -0.15, gr.z + 0.04), new V3(0.2, 1, -0.2), new V3(0.3, 1, 0))
        : handFrame(new V3(-0.03, mp.y - 0.09, mp.z), new V3(0.3, 0.5, -0.8), new V3(1, 0.3, 0));
    model.group.position.copy(W.gp).negate();
    model.group.rotation.set(0, 0, 0);
    hold.add(model.group);
  }
  m.weapon = W;
}
export function unmountWeapon(m) {
  if (!m.weapon) return;
  m.weapon.hold.parent?.remove(m.weapon.hold);
  m.weapon = null;
}

// Stances, as the main hand's grip point relative to the chest, and how far
// the muzzle dips below the line to the target.
const STANCE = {
  rifle: { aim: [0.13, -0.01, 0.3, 0], ready: [0.12, -0.14, 0.27, 0.55], relaxed: [0.17, -0.3, 0.16, 1.0], reload: [0.1, -0.12, 0.26, 0.3] },
  tube: { aim: [0.16, 0.02, 0.2, 0], ready: [0.12, -0.16, 0.26, 0.5], relaxed: [0.17, -0.3, 0.16, 1.0], reload: [0.1, -0.12, 0.26, 0.3] },
  hip: { aim: [0.15, -0.24, 0.24, -0.1], ready: [0.15, -0.26, 0.24, 0.35], relaxed: [0.17, -0.32, 0.16, 0.9], reload: [0.12, -0.2, 0.26, 0.35] },
  pistol: { aim: [0.05, 0.06, 0.47, 0], ready: [0.07, -0.17, 0.3, 0.65], relaxed: [0.24, -0.5, 0.08, 1.25], reload: [0.05, -0.1, 0.3, 0.45] },
  bow: { aim: [-0.03, 0.08, 0.5, 0], ready: [-0.12, -0.26, 0.3, 0.8], relaxed: [-0.2, -0.42, 0.12, 1.2], reload: [-0.12, -0.2, 0.3, 0.8] },
};
// melee and throwing arcs: grip offset from the chest, blade direction, edge
const ARC = {
  melee: {
    ready: [[0.2, -0.28, 0.26], [0.15, 0.85, 0.5], [0, -0.4, 1]],
    wind: [[0.27, 0.14, -0.05], [0.4, 0.55, -0.75], [0, 1, 0.5]],
    hit: [[0.03, -0.02, 0.52], [-0.25, -0.12, 1], [-0.15, -1, 0]],
    thru: [[-0.2, -0.4, 0.26], [-0.75, -0.55, 0.2], [-0.3, -0.4, -1]],
  },
  thrown: {
    ready: [[0.22, -0.36, 0.14], [0, 0.3, 1], [0, 1, 0]],
    wind: [[0.3, 0.24, -0.2], [0, 1, -0.6], [0, 0.4, 1]],
    hit: [[0.08, 0.22, 0.45], [0, 0.4, 1], [0, 1, -0.4]],
    thru: [[-0.12, -0.3, 0.3], [0, -0.6, 1], [0, 1, 0.6]],
  },
};
const tC = new V3();
const tP = new V3();
const tD = new V3();
const tE = new V3();
const tH = new V3();
const tQ = new THREE.Quaternion();
const tQ2 = new THREE.Quaternion();
const tQw = new THREE.Quaternion();
const tQr = new THREE.Quaternion();
const tM = new THREE.Matrix4();
const tX = new V3();
const tY = new V3();
const tZ = new V3();
// orientation of a weapon pointing along D with its top toward E, rolled
function weaponQuat(out, D, E, roll = 0) {
  tZ.copy(D).normalize().negate();
  tY.copy(E).addScaledVector(tZ, -E.dot(tZ));
  if (tY.lengthSq() < 1e-6) tY.set(0, 1, 0).addScaledVector(tZ, -tZ.y);
  tY.normalize();
  tX.crossVectors(tY, tZ);
  out.setFromRotationMatrix(tM.makeBasis(tX, tY, tZ));
  if (roll) out.multiply(tQ2.setFromAxisAngle(tZ.set(0, 0, 1), roll));
  return out;
}
const arcPose = (key, pos, quat) => {
  pos.set(key[0][0] * -GS, key[0][1], key[0][2]);
  tD.set(key[1][0] * -GS, key[1][1], key[1][2]);
  tE.set(key[2][0] * -GS, key[2][1], key[2][2]);
  weaponQuat(quat, tD, tE);
};
const aP = new V3();
const aQ = new THREE.Quaternion();
const bP = new V3();
const bQ = new THREE.Quaternion();
// blend along a sequence of arc keys by u in 0..1 between keys a and b
function arcBlend(A, ka, kb, u, pos, quat) {
  arcPose(A[ka], aP, aQ);
  arcPose(A[kb], bP, bQ);
  const e = sstep(0, 1, u);
  pos.lerpVectors(aP, bP, e);
  quat.slerpQuaternions(aQ, bQ, e);
}

// Wrist target for a hand frame on the weapon, given the weapon's pose.
function handOn(W, frame, P, Q, outP, outQ) {
  outQ.copy(Q).multiply(frame.q);
  outP.copy(frame.c).sub(W.gp).applyQuaternion(Q).add(P);
  // back from the middle of the hand to the wrist joint
  outP.add(tH.set(0, 0.035, 0).applyQuaternion(outQ));
}
// Turn a wrist so the hand takes a root-space orientation.
function orientWrist(m, arm, qRoot) {
  if (!arm.wrist) return;
  arm.sh.updateMatrixWorld(true);
  arm.fore.getWorldQuaternion(tQw);
  m.root.getWorldQuaternion(tQr);
  arm.wrist.quaternion.copy(tQw.invert().multiply(tQr).multiply(qRoot));
}
const hP = new V3();
const hQ = new THREE.Quaternion();
const h2P = new V3();
const h2Q = new THREE.Quaternion();
const POLE_MAIN = new V3(GS * 0.8, -0.65, -0.25);
const POLE_OFF = new V3(-GS * 0.35, -1, -0.1);
function reach(m, arm, p, q, pole) {
  armTo(m, arm, p, pole);
  orientWrist(m, arm, q);
}

// Pose the weapon and the arms holding it. Call after the body is posed.
// o.aim: the target point (root space) or null; o.stance: 'aim' | 'ready' |
// 'relaxed'; o.reload: 0..1 through a reload, or -1; o.wind / o.strike:
// a swing or throw (strike = progress 0..1, -1 when none); o.draw (bows).
export function holdWeapon(m, st, o, dt) {
  const W = m.weapon;
  if (!W) return;
  const mainArm = m.arms.find((a) => a.s === GS);
  const offArm = m.arms.find((a) => a.s === -GS);
  m.root.updateMatrixWorld(true);
  // the chest, where every stance is measured from
  tC.set(0, 0.42, 0);
  m.torso.localToWorld(tC);
  m.root.worldToLocal(tC);
  spring(st.recoil, 260, 20, dt);
  const rec = st.recoil.x;
  const k = 1 - Math.exp(-10 * dt);
  const kind = W.kind;
  let twoHand = !!W.off;
  if (kind === 'fists') return fists(m, st, o, mainArm, offArm);
  if (kind === 'melee' || kind === 'thrown') {
    const A = ARC[kind];
    const p = o.strike ?? -1;
    const striking = p >= 0 && p < 1;
    if (striking) {
      // the swing itself: wind → impact → follow-through → back to ready
      if (p < 0.12) arcBlend(A, 'wind', 'hit', p / 0.12, tP, tQ);
      else if (p < 0.3) arcBlend(A, 'hit', 'thru', (p - 0.12) / 0.18, tP, tQ);
      else arcBlend(A, 'thru', 'ready', (p - 0.3) / 0.7, tP, tQ);
      // the body turns and leans into the blow
      const turn = p < 0.3 ? lerp(0.4, -0.45, sstep(0, 0.3, p)) : lerp(-0.45, 0, sstep(0.3, 1, p));
      m.torso.rotation.y += GS * turn;
      m.torso.rotation.x += 0.18 * (p < 0.3 ? sstep(0, 0.2, p) : 1 - sstep(0.3, 1, p));
      W.off0.copy(tP);
      W.q0.copy(tQ);
      W.init = true;
    } else {
      const w = clamp(o.wind ?? 0, 0, 1);
      if (o.stance === 'relaxed' && w < 0.01) {
        // carried low at the side when there's nothing to fight
        tP.set(-GS * 0.24, -0.52, 0.1);
        weaponQuat(tQ, tD.set(-GS * 0.1, kind === 'thrown' ? 0 : 0.3, 1), tE.set(0, 1, 0));
      } else arcBlend(A, 'ready', 'wind', w, tP, tQ);
      m.torso.rotation.y += GS * 0.4 * sstep(0, 1, w);
      // gathering is quick, everything else eases
      const kk = w > 0.01 ? 1 - Math.exp(-30 * dt) : k;
      if (W.init) {
        W.off0.lerp(tP, kk);
        W.q0.slerp(tQ, kk);
      } else {
        W.off0.copy(tP);
        W.q0.copy(tQ);
        W.init = true;
      }
    }
    tP.copy(W.off0).add(tC);
    tQ.copy(W.q0);
    if (kind === 'thrown' && striking && p < 0.3) twoHand = false;
    if (o.stance === 'relaxed' && !striking && !(o.wind > 0.01) && !W.def?.look?.saw) twoHand = false;
  } else {
    const S = STANCE[kind] || STANCE.rifle;
    const r = o.reload ?? -1;
    const reloading = r >= 0 && r < 1;
    const s = reloading ? S.reload : S[o.stance] || S.ready;
    tP.set(s[0] * -GS, s[1], s[2]);
    // aim at the target; otherwise point where the body faces
    if (o.aim && !reloading) tD.subVectors(o.aim, tP.clone().add(tC));
    else if (o.aim) tD.set(o.aim.x, 0, o.aim.z);
    else tD.set(0, 0, 1);
    tD.y = o.stance === 'aim' && !reloading ? tD.y : 0;
    tD.normalize();
    if (s[3]) {
      // dip the muzzle
      const h = Math.hypot(tD.x, tD.z) || 1;
      tD.set((tD.x / h) * Math.cos(s[3]), -Math.sin(s[3]), (tD.z / h) * Math.cos(s[3]));
    }
    // a relaxed long gun crosses the body a little
    if (o.stance === 'relaxed' && kind !== 'pistol' && !reloading) {
      tD.x += -GS * 0.3;
      tD.normalize();
    }
    // walking sway
    tD.x += Math.sin(st.phase) * 0.02 * st.moveW;
    tD.y += Math.sin(st.phase * 2) * 0.015 * st.moveW;
    const roll = reloading ? GS * 0.55 * sstep(0, 0.12, r) * (1 - sstep(0.85, 1, r)) : 0;
    weaponQuat(tQ, tD, tE.set(0, 1, 0), roll);
    if (W.init) {
      W.off0.lerp(tP, k);
      W.q0.slerp(tQ, k);
    } else {
      W.off0.copy(tP);
      W.q0.copy(tQ);
      W.init = true;
    }
    tP.copy(W.off0).add(tC);
    tQ.copy(W.q0);
    // recoil: back into the shoulder and the muzzle climbs
    if (rec) {
      tD.set(0, 0, -1).applyQuaternion(tQ);
      tP.addScaledVector(tD, -rec * 0.08);
      tQ.multiply(tQ2.setFromAxisAngle(tX.set(1, 0, 0), rec * 0.35));
      m.torso.rotation.x -= rec * 0.06;
      m.head.rotation.x -= rec * 0.04;
    }
    // a relaxed pistol hangs in one hand
    if (kind === 'pistol' && o.stance === 'relaxed' && !reloading) twoHand = false;
    if (kind === 'bow') {
      const d = clamp(o.draw ?? 0, 0, 1);
      W.main.c.z = 0.15 + d * 0.22;
      W.model.parts.draw?.(d);
    }
    if (o.stance === 'aim') {
      // bladed stance; the head comes down to the sights
      const blade = kind === 'rifle' || kind === 'tube' ? 0.3 : kind === 'bow' ? 0.5 : 0.1;
      m.torso.rotation.y += GS * blade;
      m.head.rotation.y -= GS * blade;
      m.head.rotation.x += kind === 'rifle' ? 0.18 : 0.08;
      m.head.rotation.z += kind === 'rifle' ? -GS * 0.12 : 0;
    }
  }
  W.hold.position.copy(tP);
  W.hold.quaternion.copy(tQ);
  // the hands
  m.root.updateMatrixWorld(true);
  if (W.main) {
    handOn(W, W.main, tP, tQ, hP, hQ);
    reach(m, mainArm, hP, hQ, POLE_MAIN);
  }
  const r = o.reload ?? -1;
  if (W.off && twoHand) {
    handOn(W, W.off, tP, tQ, hP, hQ);
    if (r >= 0 && r < 1 && W.magwell) reloadHand(m, W, r, tP, tQ, hP, hQ);
    else if (W.mag) W.mag.visible = true;
    reach(m, offArm, hP, hQ, POLE_OFF);
  } else if (W.mag) W.mag.visible = true;
}

// The off hand through a reload: to the magazine, out, down to the belt for
// a fresh one, back in, a slap, back to the handguard. Shotguns feed shells
// one at a time instead.
function reloadHand(m, W, r, P, Q, outP, outQ) {
  handOn(W, W.magwell, P, Q, h2P, h2Q);
  // the belt pouch on the off side
  tE.set(-GS * 0.13, tC.y - 0.42, tC.z + 0.1);
  tQ2.copy(h2Q);
  const shells = W.def?.cat === 'shotgun';
  let toWell;
  let toBelt;
  if (shells) {
    const n = 3;
    const u = clamp((r - 0.08) / 0.84, 0, 1) * n;
    const c = u - Math.floor(u);
    toWell = r < 0.08 ? sstep(0, 0.08, r) : r > 0.92 ? 1 - sstep(0.92, 1, r) : 1;
    toBelt = r < 0.08 || r > 0.92 ? 0 : sstep(0, 0.35, c) * (1 - sstep(0.5, 0.85, c));
  } else {
    toWell = sstep(0.02, 0.15, r) * (1 - sstep(0.82, 0.98, r));
    toBelt = sstep(0.25, 0.42, r) * (1 - sstep(0.52, 0.68, r));
    if (W.mag) W.mag.visible = r < 0.24 || r > 0.62;
    // the slap that seats it
    if (r > 0.66 && r < 0.8) h2P.y += Math.sin(((r - 0.66) / 0.14) * Math.PI) * 0.03;
  }
  outP.lerp(h2P, toWell);
  outQ.slerp(h2Q, toWell);
  outP.lerp(tE, toBelt);
}

// Bare fists: a guard when there's a fight, jabs and crosses.
const FIST_GUARD = [new V3(GS * 0.13, 0.1, 0.3), new V3(-GS * 0.1, 0.15, 0.33)];
function fists(m, st, o, mainArm, offArm) {
  if (o.stance === 'relaxed' && !(o.strike >= 0 && o.strike < 1)) return;
  const p = o.strike ?? -1;
  const lead = st.punch ? offArm : mainArm;
  for (const arm of [mainArm, offArm]) {
    if (!arm) continue;
    const g = arm === mainArm ? FIST_GUARD[0] : FIST_GUARD[1];
    tP.copy(g).add(tC);
    if (arm === lead && p >= 0 && p < 1) {
      // out fast, back slower
      const e = p < 0.25 ? sstep(0, 0.25, p) : 1 - sstep(0.25, 1, p);
      tP.lerp(tH.set(arm.s * 0.03, 0.14, 0.62).add(tC), e);
      m.torso.rotation.y += -arm.s * 0.35 * e;
    }
    // knuckles forward, palm down
    tD.set(-arm.s * 0.15, 0.1, 1);
    tY.copy(tD).normalize().negate();
    tZ.set(0, 1, 0).addScaledVector(tY, -tY.y).normalize();
    tX.crossVectors(tY, tZ);
    tQ.setFromRotationMatrix(tM.makeBasis(tX, tY, tZ));
    tP.add(tH.set(0, 0.035, 0).applyQuaternion(tQ));
    reach(m, arm, tP, tQ, arm === mainArm ? POLE_MAIN : POLE_OFF);
  }
}
