// Procedural weapon models. Every weapon is built pointing down -Z with the
// grip at the origin, so the same model serves the first-person view model
// (scaled up) and the third-person model in a survivor's hand.
//
// Guns are built from their real parts (frame, slide or receiver, barrel,
// handguard, magazine, stock, sights) and expose the parts that move: the
// slide, bolt or pump that cycles when it fires, the magazine that comes out
// on a reload, a revolver's cylinder and hammer, a lever. `sight` gives the
// line of sight (its height above the bore and where the rear sight and
// front post are) so the view model can line the sights up with the eye.
import * as THREE from 'three';
import { tex } from './textures.js';
import { box, pivot, glowSprite, lambert as L } from './models.js';

const cyl = (r0, r1, len, mat, x, y, z, seg = 10) => {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, len, seg), mat);
  m.rotation.x = Math.PI / 2;
  m.position.set(x, y, z);
  m.castShadow = true;
  return m;
};

// Gun-metal, polymer, wood, steel and brass. The first-person versions keep
// a faint glow of their own so they never vanish into the dark.
function mats(def, vm) {
  const e = vm ? 0.12 : 0;
  const mk = (c, roughness, metalness, map) => {
    const col = new THREE.Color(c);
    return L({ color: col, emissive: col.clone().multiplyScalar(e), roughness, metalness, map: map || null });
  };
  return {
    metal: mk(def.look.body ?? 0x2c2c30, 0.4, 0.75),
    dark: mk(0x161618, 0.6, 0.2),
    poly: mk(def.look.poly ?? 0x1e1e20, 0.7, 0.05),
    slide: mk(def.look.slide ?? def.look.body ?? 0x34343a, 0.32, 0.85),
    wood: mk(0x7a4a26, 0.55, 0, tex('wood', 5)),
    steel: mk(0xa4a8ae, 0.25, 0.95),
    brass: mk(0xc09a48, 0.3, 0.9),
    glass: L({ color: 0x18303a, emissive: vm ? 0x061218 : 0, roughness: 0.05, metalness: 0.6 }),
    olive: mk(0x4a5632, 0.75, 0.1),
    white: mk(0xe8e0c8, 0.5, 0),
    red: mk(0x8a1a10, 0.6, 0.1),
  };
}

// A hand gripping something: palm, a row of knuckles and the thumb.
function limb(r, len, mat, x, y, z, sx = 1, sy = 1) {
  const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 4, 10), mat);
  m.rotation.x = Math.PI / 2;
  m.position.set(x, y, z);
  m.scale.set(sx, 1, sy);
  return m;
}
export function hand(mat, x, y, z, s = 1) {
  const h = new THREE.Group();
  h.add(limb(0.03 * s, 0.045 * s, mat, 0, 0, 0, 1.15, 0.9));
  // four fingers wrapped round, then the thumb along the side
  for (let i = 0; i < 4; i++) h.add(limb(0.0115 * s, 0.022 * s, mat, -0.004 * s, -0.018 * s + i * 0.0035 * s, -0.03 * s + i * 0.018 * s, 1, 0.9).rotateX(0.5));
  h.add(limb(0.012 * s, 0.035 * s, mat, -0.026 * s, 0.022 * s, -0.022 * s));
  h.position.set(x, y, z);
  return h;
}
export { limb };

export function makeGunModel(def, vm = false) {
  const g = new THREE.Group();
  const m = mats(def, vm);
  const lk = def.look;
  const muzzle = new THREE.Object3D();
  const parts = {};
  let spin = null;
  let flame = null;
  let sight = null; // { y, rear, front, kind }
  let scopeInfo = null;
  const port = new THREE.Object3D(); // where spent casings fly from
  const B = (w, h, d, mat, x, y, z, parent = g) => {
    const b = box(w, h, d, mat, x, y, z);
    parent.add(b);
    return b;
  };
  const C = (r0, r1, len, mat, x, y, z, parent = g, seg = 10) => {
    const c = cyl(r0, r1, len, mat, x, y, z, seg);
    parent.add(c);
    return c;
  };
  // trigger guard and trigger, just ahead of the grip
  const trigger = (z = -0.005, y = -0.005, s = 1) => {
    B(0.008 * s, 0.006, 0.07 * s, m.dark, 0, y - 0.03 * s, z - 0.01);
    B(0.008 * s, 0.032 * s, 0.006, m.dark, 0, y - 0.015 * s, z - 0.045 * s);
    const t = B(0.005, 0.022 * s, 0.006, m.steel, 0, y - 0.012 * s, z - 0.005);
    t.rotation.x = 0.25;
  };
  const pistolGrip = (z = 0.06, h = 0.12, mat = m.poly, ang = 0.28) => {
    const gp = B(0.036, h, 0.052, mat, 0, -h / 2 + 0.005, z);
    gp.rotation.x = ang;
    // finger grooves / stippling suggested by a slimmer front strap
    const fs = B(0.03, h * 0.85, 0.01, mat, 0, -h / 2 - 0.004, z - 0.03);
    fs.rotation.x = ang;
    return gp;
  };
  const rail = (len, y, z, w = 0.026) => {
    B(w, 0.008, len, m.dark, 0, y, z);
    for (let k = 0; k < Math.floor(len / 0.018); k++) B(w + 0.006, 0.006, 0.008, m.dark, 0, y + 0.006, z - len / 2 + 0.009 + k * 0.018);
  };
  // a front post (with protective ears) and a rear aperture / notch
  const irons = (front, rear, y, style = 'post') => {
    const fp = B(0.006, 0.026, 0.006, m.dark, 0, y - 0.006, front);
    if (style === 'ar') {
      B(0.024, 0.006, 0.02, m.dark, 0, y - 0.024, front);
      for (const s of [-1, 1]) B(0.005, 0.03, 0.012, m.dark, s * 0.01, y - 0.01, front);
    } else if (style === 'hood') {
      const hood = new THREE.Mesh(new THREE.TorusGeometry(0.014, 0.003, 4, 10, Math.PI * 1.2), m.dark);
      hood.position.set(0, y - 0.004, front);
      hood.rotation.z = -0.1 * Math.PI;
      g.add(hood);
    }
    if (style === 'ar' || style === 'aperture') {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.008, 0.0035, 4, 12), m.dark);
      ring.position.set(0, y, rear);
      g.add(ring);
      B(0.016, 0.02, 0.012, m.dark, 0, y - 0.016, rear);
    } else {
      // a notch: two blades either side of the line of sight
      for (const s of [-1, 1]) B(0.008, 0.016, 0.01, m.dark, s * 0.009, y - 0.004, rear);
      B(0.026, 0.008, 0.012, m.dark, 0, y - 0.014, rear);
    }
    sight = { y: y + 0.002, rear, front, kind: 'irons' };
    void fp;
  };
  // a telescopic sight on rings
  const scope = (z, y, len = 0.26, r = 0.019) => {
    const body = new THREE.Group();
    C(r, r, len, m.dark, 0, y, z, body, 14);
    C(r * 1.55, r, 0.06, m.dark, 0, y, z - len / 2 - 0.02, body, 14); // objective bell
    C(r * 1.25, r * 1.25, 0.05, m.dark, 0, y, z + len / 2 + 0.015, body, 14); // ocular
    const lensF = new THREE.Mesh(new THREE.CircleGeometry(r * 1.45, 14), m.glass);
    lensF.position.set(0, y, z - len / 2 - 0.05);
    lensF.rotation.y = Math.PI;
    body.add(lensF);
    const lensR = new THREE.Mesh(new THREE.CircleGeometry(r * 1.15, 14), m.glass);
    lensR.position.set(0, y, z + len / 2 + 0.041);
    body.add(lensR);
    B(0.012, 0.016, 0.016, m.dark, 0, y + r + 0.006, z, body); // elevation turret
    B(0.016, 0.012, 0.016, m.dark, r + 0.006, y, z, body); // windage
    for (const dz of [-len * 0.28, len * 0.28]) B(0.022, y - 0.02, 0.014, m.dark, 0, (y - 0.02) / 2 + 0.01, z + dz, body); // rings
    g.add(body);
    sight = { y, rear: z + len / 2 + 0.04, front: z - len / 2, kind: 'scope' };
    scopeInfo = { r, len };
  };
  const magBox = (z, h, curved = false, w = 0.03, d = 0.05, y0 = 0) => {
    const mg = pivot(g, 0, y0, z);
    const a = B(w, h, d, m.dark, 0, -h / 2, 0, mg);
    if (curved) {
      a.rotation.x = -0.3;
      a.position.z = -h * 0.12;
    }
    B(w + 0.006, 0.01, d + 0.008, m.dark, 0, -h + (curved ? 0.012 : 0), curved ? -h * 0.28 : 0, mg); // base plate
    parts.mag = mg;
    return mg;
  };
  const buttstock = (z0, len, mat, drop = 0.0) => {
    const st = B(0.045, 0.085, len, mat, 0, -0.012 - drop, z0 + len / 2);
    B(0.048, 0.11, 0.02, m.dark, 0, -0.02 - drop, z0 + len + 0.005); // butt pad
    B(0.038, 0.03, len * 0.6, mat, 0, -0.06 - drop, z0 + len * 0.55); // toe line
    return st;
  };

  switch (def.cat) {
    // ------------------------------------------------------------ handguns
    case 'pistol': {
      const s = lk.big ? 1.22 : 1;
      if (lk.revolver) {
        const blen = lk.long ? 0.24 : 0.16;
        // frame and top strap
        B(0.034, 0.05, 0.11, m.metal, 0, 0.022, -0.02);
        B(0.03, 0.012, 0.13, m.metal, 0, 0.056, -0.04);
        // barrel with an underlug and top rib
        C(0.012, 0.012, blen, m.metal, 0, 0.042, -0.08 - blen / 2);
        B(0.018, 0.016, blen * 0.95, m.metal, 0, 0.03, -0.08 - blen / 2);
        B(0.008, 0.008, blen, m.metal, 0, 0.056, -0.08 - blen / 2);
        // the cylinder (turns a chamber per shot, swings out to reload)
        const cy = pivot(g, 0, 0.032, -0.04);
        const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.055, 6), m.steel);
        drum.rotation.x = Math.PI / 2;
        drum.castShadow = true;
        cy.add(drum);
        for (let k = 0; k < 6; k++) {
          const a = (k / 6) * Math.PI * 2;
          C(0.007, 0.007, 0.057, m.dark, Math.cos(a) * 0.018, Math.sin(a) * 0.018, 0, cy, 6);
        }
        parts.cyl = cy;
        const ham = pivot(g, 0, 0.05, 0.035);
        B(0.008, 0.024, 0.012, m.steel, 0, 0.01, 0.004, ham);
        parts.hammer = ham;
        trigger(0.0, 0.0);
        pistolGrip(0.055, 0.1, m.wood, 0.4);
        irons(-0.075 - blen, 0.03, 0.068, 'notch');
        muzzle.position.set(0, 0.042, -0.08 - blen);
        port.position.set(0, 0.03, -0.04);
      } else {
        // polymer frame with an accessory rail and the trigger guard
        B(0.034 * s, 0.026 * s, 0.17 * s, def.look.body ? m.metal : m.poly, 0, 0.012, -0.055 * s);
        rail(0.05 * s, -0.003, -0.11 * s, 0.022);
        trigger(-0.01, 0.0, s);
        pistolGrip(0.045, 0.12 * s, def.look.body ? m.metal : m.poly, 0.26);
        // the slide: snaps back each shot, locks back when empty
        const sl = pivot(g, 0, 0.042 * s, -0.065 * s);
        B(0.034 * s, 0.034 * s, 0.205 * s, m.slide, 0, 0, 0, sl);
        B(0.03 * s, 0.006, 0.2 * s, m.slide, 0, 0.018 * s, 0, sl); // top flat
        for (let k = 0; k < 6; k++) for (const side of [-1, 1]) B(0.002, 0.024 * s, 0.004, m.dark, side * 0.0175 * s, 0, 0.07 * s + k * 0.006, sl); // serrations
        B(0.002, 0.014 * s, 0.04 * s, m.dark, 0.0175 * s, 0.008, -0.01 * s, sl); // ejection port
        B(0.006, 0.02 * s, 0.006, m.dark, 0, 0.026 * s, -0.095 * s, sl); // front sight
        for (const sd of [-1, 1]) B(0.007, 0.014, 0.008, m.dark, sd * 0.008, 0.024 * s, 0.092 * s, sl); // rear notch
        parts.slide = sl;
        C(0.008 * s, 0.008 * s, 0.01, m.dark, 0, 0.042 * s, -0.17 * s); // barrel crown
        sight = { y: 0.042 * s + 0.032 * s, rear: -0.065 * s + 0.092 * s, front: -0.065 * s - 0.095 * s, kind: 'irons' };
        const mg = magBox(0.05, lk.extMag ? 0.17 : 0.11, false, 0.026, 0.044, -0.0);
        mg.rotation.x = 0.26;
        muzzle.position.set(0, 0.042 * s, -0.175 * s);
        port.position.set(0.02, 0.05 * s, -0.06 * s);
      }
      break;
    }
    // ------------------------------------------------------------ SMGs
    case 'smg': {
      const uziLike = !lk.stock && !lk.wood;
      // receiver
      if (uziLike) B(0.05, 0.075, 0.26, m.metal, 0, 0.03, -0.08);
      else {
        C(0.028, 0.028, 0.3, m.metal, 0, 0.04, -0.1, g, 12);
        B(0.04, 0.03, 0.26, m.metal, 0, 0.012, -0.09);
      }
      // handguard / barrel
      if (lk.wood) B(0.045, 0.045, 0.14, m.wood, 0, 0.0, -0.22);
      else if (!uziLike) B(0.05, 0.04, 0.12, m.poly, 0, 0.022, -0.24);
      C(0.011, 0.011, 0.12, m.dark, 0, 0.04, -0.33);
      if (lk.body === 0x1e1e20) B(0.03, 0.03, 0.06, m.poly, 0, 0.04, -0.37); // a suppressor-ish shroud
      // the bolt's charging handle (yanked back on a reload)
      const bolt = pivot(g, -0.03, 0.055, -0.2);
      B(0.02, 0.01, 0.012, m.steel, -0.005, 0, 0, bolt);
      parts.bolt = bolt;
      // magazine in the grip (Uzi) or ahead of it
      magBox(lk.drum ? -0.13 : uziLike ? 0.05 : -0.03, lk.drum ? 0.02 : 0.17, lk.curved, 0.028, 0.045, -0.005);
      if (lk.drum) {
        const d = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.055, 16), m.dark);
        d.rotation.z = Math.PI / 2;
        d.position.set(0, -0.09, 0);
        d.castShadow = true;
        parts.mag.add(d);
      }
      trigger(0.0, 0.0);
      pistolGrip(0.06, 0.11, lk.wood ? m.wood : m.poly);
      if (lk.stock) {
        if (lk.wood) buttstock(0.11, 0.24, m.wood);
        else {
          for (const sd of [-1, 1]) B(0.008, 0.01, 0.2, m.dark, sd * 0.02, 0.02, 0.18);
          B(0.05, 0.09, 0.02, m.dark, 0, -0.005, 0.28);
        }
      }
      const sy = 0.085;
      if (!uziLike) rail(0.1, 0.07, -0.06);
      irons(-0.3, 0.02, sy, uziLike ? 'notch' : 'hood');
      if (!uziLike) B(0.024, 0.02, 0.014, m.dark, 0, sy - 0.016, 0.02);
      muzzle.position.set(0, 0.04, -0.4);
      port.position.set(0.03, 0.05, -0.08);
      break;
    }
    // ------------------------------------------------------------ shotguns
    case 'shotgun': {
      const len = lk.short ? 0.3 : 0.6;
      if (lk.double) {
        for (const sd of [-1, 1]) C(0.017, 0.017, len, m.metal, sd * 0.017, 0.05, -len / 2 - 0.05);
        B(0.008, 0.006, len, m.metal, 0, 0.07, -len / 2 - 0.05); // rib
        B(0.06, 0.06, 0.14, m.metal, 0, 0.035, -0.01); // action
        const fore = B(0.05, 0.035, 0.18, m.wood, 0, 0.02, -0.18);
        void fore;
        const bead = new THREE.Mesh(new THREE.SphereGeometry(0.005, 6, 4), m.brass);
        bead.position.set(0, 0.076, -len - 0.04);
        g.add(bead);
        sight = { y: 0.078, rear: 0.03, front: -len - 0.04, kind: 'bead' };
        // the barrels hinge down to load
        parts.breakAt = -0.08;
      } else {
        B(0.055, 0.075, 0.2, m.metal, 0, 0.03, -0.02); // receiver
        C(0.019, 0.019, len, m.metal, 0, 0.055, -len / 2 - 0.08);
        C(0.016, 0.016, len * 0.82, m.dark, 0, 0.02, -len * 0.41 - 0.08); // magazine tube
        if (lk.stock && lk.body === 0x1c1c1e) for (let k = 0; k < 5; k++) B(0.046, 0.004, 0.03, m.dark, 0, 0.075, -0.16 - k * 0.07); // heat shield
        // the pump: back and forward after every shot
        const pump = pivot(g, 0, 0.022, -len * 0.5);
        B(0.05, 0.045, 0.15, lk.wood ? m.wood : m.poly, 0, 0, 0, pump);
        for (let k = 0; k < 5; k++) B(0.052, 0.004, 0.006, m.dark, 0, -0.016, -0.06 + k * 0.03, pump);
        if (lk.pump) parts.pump = pump;
        if (lk.drum) {
          magBox(-0.06, 0.02, false, 0.03, 0.04, 0.0);
          parts.mag.add(box(0.12, 0.13, 0.12, m.dark, 0, -0.08, 0));
        }
        rail(0.12, 0.072, -0.03, 0.02);
        const bead = new THREE.Mesh(new THREE.SphereGeometry(0.005, 6, 4), m.brass);
        bead.position.set(0, 0.08, -len - 0.07);
        g.add(bead);
        sight = { y: 0.084, rear: 0.06, front: -len - 0.07, kind: 'bead' };
      }
      trigger(0.0, 0.0);
      pistolGrip(0.08, 0.1, lk.wood ? m.wood : m.poly, 0.6);
      if (!lk.short || lk.stock) buttstock(0.1, 0.3, lk.wood ? m.wood : m.poly, 0.01);
      muzzle.position.set(0, 0.055, -len - 0.08);
      port.position.set(0.03, 0.05, -0.02);
      break;
    }
    // ------------------------------------------------------------ rifles
    case 'rifle':
    case 'sniper': {
      const sniper = def.cat === 'sniper';
      const len = sniper ? (lk.big ? 0.78 : 0.62) : 0.46;
      const th = lk.big ? 1.35 : 1;
      const ak = lk.curved && lk.wood;
      const ar = !lk.wood && !lk.big && !sniper;
      // receiver
      B(0.05 * th, 0.06 * th, 0.34, m.metal, 0, 0.035, -0.07);
      B(0.044 * th, 0.035, 0.26, m.metal, 0, 0.0, -0.06);
      if (ar) {
        // flat-top upper with a rail, a forward assist and a vented handguard
        rail(0.2, 0.068, -0.08);
        C(0.026, 0.026, 0.22, m.poly, 0, 0.035, -0.33, g, 10);
        for (let k = 0; k < 6; k++) for (const sd of [-1, 1]) B(0.003, 0.008, 0.016, m.dark, sd * 0.026, 0.035, -0.25 - k * 0.032);
        B(0.012, 0.012, 0.02, m.metal, 0.028, 0.045, 0.02);
      } else if (lk.wood) {
        // a wooden handguard over the barrel
        B(0.05, 0.04, sniper ? 0.38 : 0.26, m.wood, 0, 0.018, -0.3);
        if (!sniper) B(0.04, 0.02, 0.2, m.wood, 0, 0.055, -0.3);
      } else B(0.056, 0.05, 0.28, m.poly, 0, 0.025, -0.33);
      C(0.012 * th, 0.012 * th, len, m.dark, 0, 0.045, -0.24 - len / 2);
      if (ak) C(0.01, 0.01, 0.22, m.metal, 0, 0.068, -0.33); // gas tube
      if (lk.big) B(0.09, 0.045, 0.07, m.dark, 0, 0.045, -0.24 - len); // muzzle brake
      else C(0.016, 0.014, 0.05, m.dark, 0, 0.045, -0.24 - len); // flash hider
      // the bolt / charging handle
      const bolt = pivot(g, ar ? 0 : 0.03, ar ? 0.065 : 0.05, ar ? 0.07 : -0.02);
      if (ar) B(0.03, 0.01, 0.012, m.dark, 0, 0, 0, bolt);
      else if (sniper && !lk.curved && !lk.big) {
        // a bolt-action handle with its knob
        B(0.04, 0.008, 0.008, m.steel, 0.018, 0, 0, bolt);
        const knob = new THREE.Mesh(new THREE.SphereGeometry(0.009, 8, 6), m.steel);
        knob.position.set(0.04, -0.004, 0);
        bolt.add(knob);
        parts.boltAction = true;
      } else B(0.024, 0.008, 0.012, m.steel, 0.012, 0, 0, bolt);
      parts.bolt = bolt;
      // magazine
      if (lk.lever) {
        C(0.01, 0.01, len * 0.85, m.metal, 0, 0.015, -0.24 - len * 0.42);
        const lever = pivot(g, 0, -0.02, 0.0);
        B(0.008, 0.008, 0.09, m.steel, 0, -0.02, 0.03, lever);
        B(0.008, 0.035, 0.008, m.steel, 0, -0.035, 0.075, lever);
        B(0.008, 0.008, 0.05, m.steel, 0, -0.05, 0.05, lever);
        parts.lever = lever;
      } else if (!sniper && def.mag > 10) magBox(-0.05, 0.17, lk.curved, 0.032, 0.055, -0.01);
      else if (def.mag > 5 || lk.big) magBox(-0.04, 0.1, false, 0.034, 0.06, -0.01);
      else magBox(-0.04, 0.045, false, 0.036, 0.06, -0.005); // internal box with a floor plate
      trigger(0.0, -0.01);
      if (!lk.lever) pistolGrip(0.07, 0.11, lk.wood && !ak ? m.wood : m.poly, ak ? 0.35 : 0.3);
      // stock
      if (lk.wood) buttstock(0.11, 0.3, m.wood, 0.01);
      else if (ar) {
        C(0.016, 0.016, 0.2, m.dark, 0, 0.02, 0.2);
        B(0.044, 0.085, 0.13, m.poly, 0, 0.0, 0.25);
        B(0.046, 0.1, 0.02, m.dark, 0, -0.005, 0.32);
      } else buttstock(0.11, 0.3, m.poly, 0.01);
      if (lk.big) {
        // a bipod folded under the barrel
        for (const sd of [-1, 1]) B(0.01, 0.01, 0.2, m.dark, sd * 0.015, -0.0, -0.45);
      }
      // sights
      if (lk.scope) scope(-0.1, lk.big ? 0.12 : 0.1, lk.big ? 0.3 : 0.26, lk.big ? 0.023 : 0.019);
      else if (ar) {
        // a folding rear aperture on the rail and the classic front sight
        const fy = 0.112;
        B(0.012, fy - 0.045, 0.012, m.dark, 0, (fy + 0.045) / 2 - 0.01, -0.42);
        irons(-0.42, 0.03, fy, 'ar');
        B(0.022, 0.03, 0.02, m.dark, 0, 0.087, 0.03);
      } else irons(-0.22 - len + 0.06, ak ? -0.12 : 0.0, 0.085, ak ? 'hood' : lk.lever ? 'notch' : 'aperture');
      muzzle.position.set(0, 0.045, -0.27 - len);
      port.position.set(0.03, 0.05, -0.04);
      break;
    }
    // ------------------------------------------------------------ machine guns
    case 'lmg': {
      if (lk.gatling) {
        B(0.12, 0.14, 0.3, m.metal, 0, 0.02, 0.0);
        spin = pivot(g, 0, 0.03, -0.15);
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          C(0.012, 0.012, 0.5, m.dark, Math.cos(a) * 0.035, Math.sin(a) * 0.035, -0.25, spin);
        }
        C(0.05, 0.05, 0.04, m.metal, 0, 0, -0.45, spin);
        C(0.05, 0.05, 0.03, m.metal, 0, 0, -0.1, spin);
        B(0.14, 0.12, 0.14, m.olive, 0.1, -0.05, 0.05);
        B(0.03, 0.12, 0.03, m.dark, 0, 0.12, -0.05); // carry handle
        B(0.12, 0.03, 0.03, m.dark, 0, 0.17, -0.05);
        const ham = pivot(g, 0, 0, 0.1);
        B(0.03, 0.08, 0.03, m.dark, 0, -0.06, 0.04, ham);
        sight = { y: 0.2, rear: 0.0, front: -0.4, kind: 'irons' };
        muzzle.position.set(0, 0.03, -0.66);
        port.position.set(0.06, 0.0, 0.0);
      } else {
        B(0.07, 0.1, 0.38, m.metal, 0, 0.03, -0.07);
        // feed cover (opened on a reload) and the ammo box
        const cover = pivot(g, 0, 0.082, 0.06);
        B(0.068, 0.012, 0.16, m.metal, 0, 0.0, -0.08, cover);
        parts.cover = cover;
        C(0.02, 0.02, 0.55, m.dark, 0, 0.05, -0.53);
        C(0.024, 0.024, 0.06, m.metal, 0, 0.05, -0.8); // flash hider
        B(0.07, 0.06, 0.22, m.poly, 0, 0.0, -0.34);
        rail(0.12, 0.09, -0.12);
        B(0.016, 0.06, 0.016, m.dark, 0, 0.1, -0.12); // carry handle post
        B(0.016, 0.012, 0.14, m.dark, 0, 0.13, -0.12);
        const mg = magBox(-0.02, 0.02, false, 0.03, 0.04, -0.02);
        mg.add(box(0.13, 0.12, 0.12, m.olive, 0.02, -0.07, 0));
        trigger(0.04, -0.02);
        pistolGrip(0.1, 0.11, m.poly);
        buttstock(0.13, 0.26, m.poly, 0.0);
        for (const sd of [-1, 1]) {
          const leg = B(0.012, 0.2, 0.012, m.dark, sd * 0.03, -0.06, -0.62);
          leg.rotation.z = sd * 0.3;
        }
        irons(-0.74, 0.08, 0.098, 'hood');
        muzzle.position.set(0, 0.05, -0.83);
        port.position.set(0.04, 0.04, -0.02);
      }
      break;
    }
    // ------------------------------------------------------------ launchers
    case 'launcher': {
      if (lk.rpg) {
        C(0.04, 0.04, 0.95, m.olive, 0, 0.05, -0.2, g, 14);
        C(0.05, 0.05, 0.16, m.wood, 0, 0.05, -0.08, g, 14); // heat guard
        const war = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.24, 10), m.olive);
        war.rotation.x = -Math.PI / 2;
        war.position.set(0, 0.05, -0.82);
        war.castShadow = true;
        g.add(war);
        parts.warhead = war;
        C(0.07, 0.07, 0.12, m.olive, 0, 0.05, -0.66, g, 12);
        C(0.055, 0.04, 0.12, m.dark, 0, 0.05, 0.32, g, 12);
        trigger(0.0, 0.01);
        pistolGrip(0.02, 0.11, m.wood, 0.2);
        B(0.03, 0.09, 0.03, m.wood, 0, -0.03, -0.2); // fore grip
        // an optic on the left side and flip-up irons
        B(0.03, 0.05, 0.12, m.dark, -0.06, 0.1, -0.08);
        irons(-0.3, 0.02, 0.128, 'post');
        muzzle.position.set(0, 0.05, -0.95);
      } else {
        C(0.045, 0.045, 0.36, m.metal, 0, 0.05, -0.22, g, 14);
        if (lk.drum) {
          const d = pivot(g, 0, 0.0, -0.05);
          const dr = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.14, 6), m.dark);
          dr.rotation.x = Math.PI / 2;
          d.add(dr);
          parts.cyl = d;
          buttstock(0.08, 0.22, m.poly, 0.01);
        } else {
          B(0.06, 0.1, 0.36, m.wood, 0, -0.01, 0.16);
          parts.breakAt = -0.04;
        }
        trigger(0.0, 0.0);
        pistolGrip(0.06, 0.1, lk.drum ? m.poly : m.wood);
        // a leaf sight
        B(0.03, 0.04, 0.008, m.dark, 0, 0.1, -0.05);
        irons(-0.38, -0.05, 0.11, 'notch');
        muzzle.position.set(0, 0.05, -0.41);
      }
      break;
    }
    // ------------------------------------------------------------ bows
    case 'bow': {
      const wood = lk.compound ? m.dark : m.wood;
      if (lk.crossbow) {
        B(0.05, 0.06, 0.6, m.wood, 0, 0.02, -0.12);
        const arc = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.015, 6, 14, Math.PI * 0.7), m.dark);
        arc.rotation.set(Math.PI / 2, 0, Math.PI * 0.15 + Math.PI);
        arc.position.set(0, 0.04, -0.2);
        g.add(arc);
        for (const sd of [-1, 1]) {
          const str = box(0.003, 0.003, 0.36, m.white, 0, 0, 0);
          str.position.set(sd * 0.13, 0.05, -0.03);
          str.rotation.y = sd * -0.75;
          g.add(str);
        }
        trigger(0.08, -0.01);
        pistolGrip(0.12, 0.1, m.wood);
        const bolt = B(0.008, 0.008, 0.36, m.steel, 0, 0.065, -0.2);
        parts.arrow = bolt;
        irons(-0.36, 0.05, 0.1, 'post');
        muzzle.position.set(0, 0.06, -0.42);
      } else {
        const arc = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.016, 6, 18, Math.PI * 0.8), wood);
        arc.rotation.set(0, Math.PI / 2, Math.PI / 2 + Math.PI * 0.1);
        arc.position.set(0, 0.0, 0.25);
        g.add(arc);
        B(0.035, 0.12, 0.04, m.dark, 0, 0.0, -0.12);
        if (lk.compound) for (const sd of [-1, 1]) C(0.04, 0.04, 0.02, m.steel, 0, sd * 0.38, -0.08);
        const str = box(0.003, 0.76, 0.003, m.white, 0, 0, 0.05);
        g.add(str);
        parts.string = str;
        const ar = B(0.006, 0.006, 0.6, m.steel, 0, 0.0, 0.08);
        parts.arrow = ar;
        sight = { y: 0.03, rear: 0.2, front: -0.12, kind: 'bow' };
        muzzle.position.set(0, 0.0, -0.24);
      }
      break;
    }
    // ------------------------------------------------------------ thrown
    case 'thrown': {
      if (lk.molotov) {
        g.add(cyl(0.035, 0.035, 0.12, L({ color: 0x3a6a3a, transparent: true, opacity: 0.85 }), 0, 0.06, 0, 8).rotateX(-Math.PI / 2));
        g.add(cyl(0.012, 0.012, 0.06, L({ color: 0x3a6a3a }), 0, 0.15, 0).rotateX(-Math.PI / 2));
        g.add(box(0.03, 0.05, 0.03, L({ color: 0xc8b890 }), 0, 0.2, 0));
        flame = glowSprite(0xff8a30, 0.25, 0.9);
        flame.position.set(0, 0.24, 0);
        g.add(flame);
      } else {
        const b = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), m.olive);
        b.scale.y = 1.2;
        b.position.y = 0.06;
        g.add(b);
        for (let k = 0; k < 3; k++) B(0.102, 0.004, 0.102, m.dark, 0, 0.03 + k * 0.03, 0);
        B(0.015, 0.08, 0.02, m.steel, 0.03, 0.1, 0);
        C(0.012, 0.012, 0.03, m.steel, 0, 0.13, 0).rotateX(-Math.PI / 2);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.012, 0.0025, 4, 10), m.steel);
        ring.position.set(-0.015, 0.14, 0);
        g.add(ring);
      }
      muzzle.position.set(0, 0.06, -0.06);
      break;
    }
    // ------------------------------------------------------------ flamethrower
    case 'flame': {
      C(0.035, 0.035, 0.5, m.metal, 0, 0.04, -0.2);
      C(0.05, 0.03, 0.08, m.dark, 0, 0.04, -0.48);
      C(0.06, 0.06, 0.28, m.red, 0, -0.06, -0.06, g, 14);
      C(0.012, 0.012, 0.3, m.dark, 0.05, -0.02, -0.12);
      trigger(0.04, 0.0);
      pistolGrip(0.1, 0.11, m.poly);
      B(0.03, 0.09, 0.03, m.poly, 0, -0.04, -0.3);
      buttstock(0.13, 0.18, m.poly);
      flame = glowSprite(0x4a8aff, 0.08, 0.9);
      flame.position.set(0, 0.04, -0.53);
      g.add(flame);
      sight = { y: 0.09, rear: 0.0, front: -0.45, kind: 'none' };
      muzzle.position.set(0, 0.04, -0.54);
      break;
    }
    // ------------------------------------------------------------ melee
    case 'melee':
    default: {
      const bladeMat = L({ color: lk.blade ?? 0x9a9ea4, emissive: vm ? new THREE.Color(lk.blade ?? 0x9a9ea4).multiplyScalar(0.3) : 0, roughness: 0.3, metalness: 0.8 });
      const handleMat = L({ color: lk.handle ?? 0x3a2414, emissive: vm ? new THREE.Color(lk.handle ?? 0x3a2414).multiplyScalar(0.3) : 0, roughness: 0.7 });
      const len = lk.len ?? 0.5;
      if (lk.saw) {
        B(0.14, 0.16, 0.28, handleMat, 0, 0.02, 0.0);
        B(0.02, 0.07, len, bladeMat, 0, 0.02, -0.14 - len / 2);
        for (let k = 0; k < Math.floor(len / 0.03); k++) B(0.024, 0.012, 0.012, m.dark, 0, 0.058, -0.15 - k * 0.03);
        B(0.1, 0.03, 0.12, m.dark, 0, 0.12, 0.02);
        B(0.03, 0.08, 0.03, m.dark, 0, 0.1, -0.1); // front handle
        muzzle.position.set(0, 0.02, -0.14 - len);
      } else if (lk.round) {
        const bat = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.018, len, 12), handleMat);
        bat.rotation.x = -Math.PI / 2;
        bat.position.z = -len / 2 + 0.1;
        g.add(bat);
        C(0.024, 0.024, 0.02, handleMat, 0, 0, 0.1); // knob
        C(0.02, 0.02, 0.12, m.dark, 0, 0, 0.03); // tape
        muzzle.position.set(0, 0, -len + 0.1);
      } else {
        const hl = lk.blade === lk.handle ? len : Math.min(len * 0.45, 0.35);
        C(0.018, 0.018, hl, handleMat, 0, 0, -hl / 2 + 0.08);
        const tip = -len + 0.08;
        if (lk.axe) {
          if (lk.blade !== lk.handle) C(0.016, 0.016, len, handleMat, 0, 0, -len / 2 + 0.08);
          B(0.025, 0.12, 0.08, bladeMat, 0, 0.06, tip + 0.04);
          B(0.02, 0.04, 0.05, bladeMat, 0, -0.03, tip + 0.04);
        } else if (lk.head) {
          if (lk.blade !== lk.handle) C(0.018, 0.018, len, handleMat, 0, 0, -len / 2 + 0.08);
          const s = lk.big ? 1.6 : 1;
          B(0.08 * s, 0.07 * s, 0.1 * s, bladeMat, 0, 0.02, tip + 0.03);
        } else if (lk.spade) {
          C(0.016, 0.016, len, handleMat, 0, 0, -len / 2 + 0.08);
          B(0.14, 0.012, 0.18, bladeMat, 0, 0, tip - 0.06);
          B(0.1, 0.02, 0.02, handleMat, 0, 0, 0.1); // D-grip
        } else if (lk.hook) {
          C(0.012, 0.012, len, bladeMat, 0, 0, -len / 2 + 0.08);
          const h = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.012, 6, 10, Math.PI), bladeMat);
          h.position.set(0, 0.04, tip);
          h.rotation.y = Math.PI / 2;
          g.add(h);
        } else {
          B(0.012, 0.045, len - hl, bladeMat, 0, 0.01, -hl - (len - hl) / 2 + 0.08);
          B(0.004, 0.012, len - hl, L({ color: 0xe8ecf0, roughness: 0.15, metalness: 1 }), 0, 0.032, -hl - (len - hl) / 2 + 0.08); // edge
          B(0.06, 0.012, 0.015, handleMat, 0, 0, -hl + 0.08); // guard
        }
        muzzle.position.set(0, 0, tip);
      }
      break;
    }
  }
  g.add(muzzle);
  g.add(port);
  g.traverse((o) => {
    if (o.isMesh) o.castShadow = !vm;
  });
  return { group: g, muzzle, port, spin, flame, parts, sight, scope: scopeInfo };
}
