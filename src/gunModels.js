// Procedural weapon models. Every weapon is built pointing down -Z with the
// grip at the origin, so the same model serves the first-person view model
// (scaled up) and the third-person model in a survivor's hand.
import * as THREE from 'three';
import { tex } from './textures.js';
import { box, pivot, glowSprite, lambert as L } from './models.js';

const cyl = (r0, r1, len, mat, x, y, z, seg = 8) => {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, len, seg), mat);
  m.rotation.x = Math.PI / 2;
  m.position.set(x, y, z);
  m.castShadow = true;
  return m;
};

function mats(def, vm) {
  const e = vm ? 0.55 : 0;
  const mk = (c) => {
    const col = new THREE.Color(c);
    return L({ color: col, emissive: col.clone().multiplyScalar(e) });
  };
  return {
    metal: mk(def.look.body ?? 0x2c2c30),
    dark: mk(0x18181a),
    slide: mk(def.look.slide ?? def.look.body ?? 0x3a3a40),
    wood: mk(0x6a3e20),
    steel: mk(0x9a9ea4),
    brass: mk(0xb08a3a),
  };
}

export function makeGunModel(def, vm = false) {
  const g = new THREE.Group();
  const m = mats(def, vm);
  const lk = def.look;
  const muzzle = new THREE.Object3D();
  let spin = null;
  let flame = null;
  const stockMat = lk.wood ? m.wood : m.dark;

  const grip = (z = 0.06, h = 0.13) => {
    const gp = box(0.04, h, 0.06, lk.wood && def.cat !== 'pistol' ? m.wood : m.dark, 0, -h / 2 + 0.01, z);
    gp.rotation.x = 0.3;
    g.add(gp);
  };
  const stock = (len = 0.26) => g.add(box(0.05, 0.1, len, stockMat, 0, -0.01, 0.06 + len / 2));
  const scope = (z = -0.2) => {
    g.add(cyl(0.025, 0.025, 0.22, m.dark, 0, 0.09, z));
    g.add(box(0.015, 0.035, 0.03, m.dark, 0, 0.055, z - 0.05));
    g.add(box(0.015, 0.035, 0.03, m.dark, 0, 0.055, z + 0.05));
  };
  const mag = (z, kind, h = 0.14) => {
    if (kind === 'drum') {
      const d = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.06, 10), m.dark);
      d.rotation.z = Math.PI / 2;
      d.position.set(0, -0.08, z);
      g.add(d);
    } else if (kind === 'curved') {
      const a = box(0.035, h, 0.05, m.dark, 0, -h / 2, z);
      a.rotation.x = -0.35;
      g.add(a);
    } else if (kind === 'box') {
      g.add(box(0.12, 0.12, 0.12, L({ color: 0x3a4a2a }), 0.02, -0.07, z));
    } else g.add(box(0.035, h, 0.05, m.dark, 0, -h / 2, z));
  };

  switch (def.cat) {
    case 'pistol': {
      const s = lk.big ? 1.25 : 1;
      if (lk.revolver) {
        const blen = lk.long ? 0.26 : 0.18;
        g.add(box(0.04 * s, 0.045 * s, blen, m.metal, 0, 0.04, -0.06 - blen / 2));
        g.add(cyl(0.045, 0.045, 0.08, m.metal, 0, 0.03, -0.03));
        g.add(box(0.045, 0.07, 0.08, m.metal, 0, 0.02, 0.03));
        muzzle.position.set(0, 0.04, -0.07 - blen);
      } else {
        g.add(box(0.04 * s, 0.05 * s, 0.22 * s, m.slide, 0, 0.04, -0.07));
        g.add(box(0.036 * s, 0.035 * s, 0.17 * s, m.metal, 0, 0.005, -0.06));
        muzzle.position.set(0, 0.04, -0.07 - 0.11 * s);
        if (lk.extMag) g.add(box(0.03, 0.12, 0.045, m.dark, 0, -0.16, 0.05));
      }
      grip(0.04, 0.12 * s);
      break;
    }
    case 'smg': {
      g.add(box(0.05, 0.08, 0.3, m.metal, 0, 0.03, -0.1));
      g.add(cyl(0.015, 0.015, 0.12, m.dark, 0, 0.04, -0.3));
      mag(lk.drum ? -0.12 : -0.03, lk.drum ? 'drum' : lk.curved ? 'curved' : 'straight', 0.17);
      grip(0.06);
      if (lk.stock) stock(0.2);
      if (lk.wood) g.add(box(0.045, 0.05, 0.14, m.wood, 0, -0.015, -0.2));
      muzzle.position.set(0, 0.04, -0.37);
      break;
    }
    case 'shotgun': {
      const len = lk.short ? 0.32 : 0.62;
      if (lk.double) {
        g.add(cyl(0.018, 0.018, len, m.metal, -0.018, 0.05, -len / 2 - 0.04));
        g.add(cyl(0.018, 0.018, len, m.metal, 0.018, 0.05, -len / 2 - 0.04));
      } else {
        g.add(cyl(0.02, 0.02, len, m.metal, 0, 0.055, -len / 2 - 0.04));
        g.add(cyl(0.017, 0.017, len * 0.8, m.dark, 0, 0.02, -len * 0.4 - 0.04));
      }
      g.add(box(0.06, 0.08, 0.16, m.metal, 0, 0.03, 0.0));
      if (lk.pump) g.add(box(0.055, 0.05, 0.14, lk.wood ? m.wood : m.dark, 0, 0.015, -len * 0.55));
      else g.add(box(0.055, 0.04, 0.2, m.wood, 0, 0.015, -0.16));
      if (lk.drum) mag(-0.1, 'drum');
      grip(0.1);
      if (!lk.short || lk.stock) stock(0.3);
      muzzle.position.set(0, 0.05, -len - 0.05);
      break;
    }
    case 'rifle':
    case 'sniper': {
      const len = def.cat === 'sniper' ? (lk.big ? 0.8 : 0.66) : 0.48;
      const th = lk.big ? 1.4 : 1;
      g.add(box(0.055 * th, 0.085 * th, 0.36, m.metal, 0, 0.03, -0.08));
      g.add(cyl(0.015 * th, 0.015 * th, len, m.dark, 0, 0.05, -0.26 - len / 2));
      if (lk.wood) g.add(box(0.06, 0.055, 0.32, m.wood, 0, 0.0, -0.3));
      else g.add(box(0.06, 0.06, 0.24, m.dark, 0, 0.02, -0.32));
      if (!lk.lever && def.cat === 'rifle' && def.mag > 10) mag(-0.06, lk.curved ? 'curved' : 'straight', 0.17);
      if (def.cat === 'sniper' && def.mag > 5) mag(-0.04, 'straight', 0.1);
      if (lk.lever) g.add(box(0.02, 0.06, 0.1, m.steel, 0, -0.06, 0.02));
      grip(0.08);
      stock(0.3);
      if (lk.scope) scope(-0.12);
      if (lk.big) {
        g.add(box(0.1, 0.05, 0.06, m.dark, 0, 0.05, -0.26 - len)); // muzzle brake
      }
      muzzle.position.set(0, 0.05, -0.27 - len);
      break;
    }
    case 'lmg': {
      if (lk.gatling) {
        g.add(box(0.12, 0.14, 0.3, m.metal, 0, 0.02, 0.0));
        spin = pivot(g, 0, 0.03, -0.15);
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          spin.add(cyl(0.012, 0.012, 0.5, m.dark, Math.cos(a) * 0.035, Math.sin(a) * 0.035, -0.25));
        }
        spin.add(cyl(0.05, 0.05, 0.04, m.metal, 0, 0, -0.45));
        g.add(box(0.14, 0.12, 0.14, L({ color: 0x3a4a2a }), 0.1, -0.05, 0.05));
        g.add(box(0.03, 0.12, 0.03, m.dark, 0, 0.12, -0.05)); // carry handle
        muzzle.position.set(0, 0.03, -0.66);
      } else {
        g.add(box(0.07, 0.1, 0.4, m.metal, 0, 0.03, -0.08));
        g.add(cyl(0.02, 0.02, 0.55, m.dark, 0, 0.05, -0.55));
        g.add(box(0.07, 0.06, 0.22, m.dark, 0, 0.0, -0.36));
        mag(-0.02, 'box');
        grip(0.1);
        stock(0.28);
        for (const s of [-1, 1]) {
          const leg = box(0.012, 0.2, 0.012, m.dark, s * 0.03, -0.06, -0.62);
          leg.rotation.z = s * 0.3;
          g.add(leg);
        }
        muzzle.position.set(0, 0.05, -0.83);
      }
      break;
    }
    case 'launcher': {
      if (lk.rpg) {
        g.add(cyl(0.04, 0.04, 0.95, L({ color: 0x4a5a32 }), 0, 0.05, -0.2));
        const war = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.24, 8), L({ color: 0x3a4a2a }));
        war.rotation.x = -Math.PI / 2;
        war.position.set(0, 0.05, -0.82);
        g.add(war);
        g.add(cyl(0.07, 0.07, 0.12, L({ color: 0x3a4a2a }), 0, 0.05, -0.66));
        g.add(cyl(0.055, 0.04, 0.12, m.dark, 0, 0.05, 0.32));
        grip(0.02);
        g.add(box(0.03, 0.05, 0.08, m.dark, 0.05, 0.12, -0.12)); // sight
        muzzle.position.set(0, 0.05, -0.95);
      } else {
        g.add(cyl(0.045, 0.045, 0.36, m.metal, 0, 0.05, -0.22));
        if (lk.drum) {
          const d = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.14, 8), m.dark);
          d.rotation.x = Math.PI / 2;
          d.position.set(0, 0.0, -0.05);
          g.add(d);
          stock(0.24);
        } else g.add(box(0.06, 0.1, 0.36, m.wood, 0, -0.01, 0.16));
        grip(0.06);
        muzzle.position.set(0, 0.05, -0.41);
      }
      break;
    }
    case 'bow': {
      const wood = lk.compound ? m.dark : m.wood;
      if (lk.crossbow) {
        g.add(box(0.05, 0.06, 0.6, m.wood, 0, 0.02, -0.12));
        const arc = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.015, 4, 12, Math.PI * 0.7), m.dark);
        arc.rotation.set(Math.PI / 2, 0, Math.PI * 0.15 + Math.PI);
        arc.position.set(0, 0.04, -0.2);
        g.add(arc);
        grip(0.1);
        g.add(box(0.012, 0.012, 0.36, m.steel, 0, 0.065, -0.2)); // bolt
        muzzle.position.set(0, 0.06, -0.42);
      } else {
        const arc = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.015, 4, 16, Math.PI * 0.8), wood);
        arc.rotation.set(0, Math.PI / 2, Math.PI / 2 + Math.PI * 0.1);
        arc.position.set(0, 0.0, 0.25);
        g.add(arc);
        g.add(box(0.035, 0.12, 0.04, m.dark, 0, 0.0, -0.12));
        if (lk.compound)
          for (const s of [-1, 1]) g.add(cyl(0.04, 0.04, 0.02, m.steel, 0, s * 0.38, -0.08));
        g.add(box(0.006, 0.006, 0.6, m.steel, 0, 0.0, 0.08)); // arrow
        muzzle.position.set(0, 0.0, -0.24);
      }
      break;
    }
    case 'thrown': {
      if (lk.molotov) {
        g.add(cyl(0.035, 0.035, 0.12, L({ color: 0x3a6a3a, transparent: true, opacity: 0.85 }), 0, 0.06, 0, 8).rotateX(-Math.PI / 2));
        g.add(cyl(0.012, 0.012, 0.06, L({ color: 0x3a6a3a }), 0, 0.15, 0).rotateX(-Math.PI / 2));
        g.add(box(0.03, 0.05, 0.03, L({ color: 0xc8b890 }), 0, 0.2, 0));
        flame = glowSprite(0xff8a30, 0.25, 0.9);
        flame.position.set(0, 0.24, 0);
        g.add(flame);
      } else {
        const b = new THREE.Mesh(new THREE.SphereGeometry(0.05, 7, 6), L({ color: 0x3a4a2a }));
        b.scale.y = 1.2;
        b.position.y = 0.06;
        g.add(b);
        g.add(box(0.015, 0.08, 0.02, m.steel, 0.03, 0.1, 0));
        g.add(cyl(0.012, 0.012, 0.03, m.steel, 0, 0.13, 0).rotateX(-Math.PI / 2));
      }
      muzzle.position.set(0, 0.06, -0.06);
      break;
    }
    case 'flame': {
      g.add(cyl(0.035, 0.035, 0.5, m.metal, 0, 0.04, -0.2));
      g.add(cyl(0.05, 0.03, 0.08, m.dark, 0, 0.04, -0.48));
      g.add(cyl(0.06, 0.06, 0.28, L({ color: 0x8a1a10 }), 0, -0.06, -0.06));
      grip(0.1);
      stock(0.18);
      flame = glowSprite(0x4a8aff, 0.08, 0.9);
      flame.position.set(0, 0.04, -0.53);
      g.add(flame);
      muzzle.position.set(0, 0.04, -0.54);
      break;
    }
    case 'melee':
    default: {
      const bladeMat = L({ color: lk.blade ?? 0x9a9ea4, emissive: vm ? new THREE.Color(lk.blade ?? 0x9a9ea4).multiplyScalar(0.4) : 0 });
      const handleMat = L({ color: lk.handle ?? 0x3a2414, emissive: vm ? new THREE.Color(lk.handle ?? 0x3a2414).multiplyScalar(0.4) : 0 });
      const len = lk.len ?? 0.5;
      if (lk.saw) {
        g.add(box(0.14, 0.16, 0.28, handleMat, 0, 0.02, 0.0));
        g.add(box(0.02, 0.07, len, bladeMat, 0, 0.02, -0.14 - len / 2));
        g.add(box(0.1, 0.03, 0.12, L({ color: 0x1a1a1a }), 0, 0.12, 0.02));
        muzzle.position.set(0, 0.02, -0.14 - len);
      } else if (lk.round) {
        const bat = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.018, len, 8), handleMat);
        bat.rotation.x = -Math.PI / 2;
        bat.position.z = -len / 2 + 0.1;
        g.add(bat);
        muzzle.position.set(0, 0, -len + 0.1);
      } else {
        // handle
        const hl = lk.blade === lk.handle ? len : Math.min(len * 0.45, 0.35);
        g.add(cyl(0.018, 0.018, hl, handleMat, 0, 0, -hl / 2 + 0.08));
        const tip = -len + 0.08;
        if (lk.axe) {
          if (lk.blade !== lk.handle) g.add(cyl(0.016, 0.016, len, handleMat, 0, 0, -len / 2 + 0.08));
          g.add(box(0.025, 0.12, 0.08, bladeMat, 0, 0.06, tip + 0.04));
        } else if (lk.head) {
          if (lk.blade !== lk.handle) g.add(cyl(0.018, 0.018, len, handleMat, 0, 0, -len / 2 + 0.08));
          const s = lk.big ? 1.6 : 1;
          g.add(box(0.08 * s, 0.07 * s, 0.1 * s, bladeMat, 0, 0.02, tip + 0.03));
        } else if (lk.spade) {
          g.add(cyl(0.016, 0.016, len, handleMat, 0, 0, -len / 2 + 0.08));
          g.add(box(0.14, 0.012, 0.18, bladeMat, 0, 0, tip - 0.06));
        } else if (lk.hook) {
          g.add(cyl(0.012, 0.012, len, bladeMat, 0, 0, -len / 2 + 0.08));
          const h = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.012, 4, 8, Math.PI), bladeMat);
          h.position.set(0, 0.04, tip);
          h.rotation.y = Math.PI / 2;
          g.add(h);
        } else {
          // blade
          g.add(box(0.012, 0.045, len - hl, bladeMat, 0, 0.01, -hl - (len - hl) / 2 + 0.08));
          g.add(box(0.06, 0.012, 0.015, handleMat, 0, 0, -hl + 0.08)); // guard
        }
        muzzle.position.set(0, 0, tip);
      }
      break;
    }
  }
  g.add(muzzle);
  g.traverse((o) => {
    if (o.isMesh) o.castShadow = !vm;
  });
  return { group: g, muzzle, spin, flame };
}

// ---------------------------------------------------------------- first-person
const VM_POSE = {
  pistol: { pos: [0.2, -0.2, -0.48], scale: 1.4 },
  smg: { pos: [0.19, -0.2, -0.42], scale: 1.1 },
  shotgun: { pos: [0.18, -0.21, -0.36], scale: 0.95 },
  rifle: { pos: [0.18, -0.21, -0.36], scale: 0.95 },
  sniper: { pos: [0.18, -0.21, -0.34], scale: 0.9 },
  lmg: { pos: [0.19, -0.24, -0.36], scale: 0.9 },
  launcher: { pos: [0.2, -0.2, -0.34], scale: 0.9 },
  bow: { pos: [0.12, -0.12, -0.42], scale: 0.9 },
  thrown: { pos: [0.22, -0.2, -0.42], scale: 1.6 },
  flame: { pos: [0.2, -0.24, -0.38], scale: 0.95 },
  melee: { pos: [0.24, -0.26, -0.36], scale: 1.0 },
};

export function makeViewModel(def) {
  const g = new THREE.Group();
  const skin = new THREE.MeshLambertMaterial({ color: 0x8a6a58, emissive: 0x3a2820 });
  const sleeveMat = new THREE.MeshLambertMaterial({ color: 0x2a2620, emissive: 0x161410 });
  const metal = new THREE.MeshLambertMaterial({ color: 0x3a3a3e, emissive: 0x26262a });
  const pose = VM_POSE[def.cat] || VM_POSE.pistol;
  const gun = new THREE.Group();
  gun.position.set(...pose.pos);
  g.add(gun);
  const model = makeGunModel(def, true);
  model.group.scale.setScalar(pose.scale * 0.62);
  gun.add(model.group);
  if (def.cat === 'melee') {
    model.group.rotation.set(0.9, 0.25, 0.15);
    model.group.position.set(0, -0.02, 0.02);
  }
  // right hand + cuff on the grip
  gun.add(box(0.06, 0.07, 0.09, skin, 0, -0.06, 0.06));
  gun.add(box(0.07, 0.07, 0.14, sleeveMat, 0, -0.08, 0.15));
  const twoHanded = !['pistol', 'melee', 'thrown'].includes(def.cat);
  let lens = null;
  let torch = null;
  if (twoHanded) {
    // left hand on the fore-grip
    const fx = def.cat === 'bow' ? 0 : -0.01;
    const fz = def.cat === 'bow' ? -0.08 : -0.24 * pose.scale;
    gun.add(box(0.06, 0.06, 0.08, skin, fx - 0.03, -0.04, fz));
    gun.add(box(0.07, 0.07, 0.2, sleeveMat, fx - 0.08, -0.09, fz + 0.12));
  } else {
    // flashlight in the left hand
    torch = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.24, 8), metal);
    body.rotation.x = Math.PI / 2;
    torch.add(body);
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.07, 8), metal);
    head.rotation.x = Math.PI / 2;
    head.position.z = -0.15;
    torch.add(head);
    lens = new THREE.Mesh(new THREE.CircleGeometry(0.044, 10), new THREE.MeshBasicMaterial({ color: 0xfff2cc }));
    lens.position.z = -0.187;
    lens.rotation.y = Math.PI;
    torch.add(lens);
    torch.add(box(0.07, 0.08, 0.1, skin, 0, -0.03, 0.06));
    torch.add(box(0.08, 0.08, 0.12, sleeveMat, 0, -0.05, 0.17));
    torch.position.set(-0.22, -0.22, -0.5);
    torch.scale.setScalar(0.65);
    g.add(torch);
  }
  const flash = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: tex('glow'), color: 0xffcc66, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0 })
  );
  flash.scale.set(0.35, 0.35, 0.35);
  model.muzzle.add(flash);
  if (def.cat === 'melee' || def.cat === 'bow' || def.cat === 'thrown') flash.visible = false;
  g.traverse((o) => {
    if (o.isMesh || o.isSprite) {
      o.castShadow = false;
      o.renderOrder = 10;
    }
  });
  return { group: g, gun, model, flash, lens, torch, def, basePos: pose.pos.slice() };
}

// Empty-handed view model (no weapon equipped).
export function makeFistsViewModel() {
  const g = new THREE.Group();
  const skin = new THREE.MeshLambertMaterial({ color: 0x8a6a58, emissive: 0x3a2820 });
  const gun = new THREE.Group();
  gun.position.set(0.2, -0.24, -0.4);
  gun.add(box(0.08, 0.08, 0.1, skin, 0, 0, 0));
  g.add(gun);
  const flash = new THREE.Sprite(new THREE.SpriteMaterial({ opacity: 0, transparent: true }));
  flash.visible = false;
  g.add(flash);
  g.traverse((o) => {
    if (o.isMesh) o.renderOrder = 10;
  });
  return { group: g, gun, model: { group: gun, muzzle: gun, spin: null, flame: null }, flash, lens: null, torch: null, def: null, basePos: [0.2, -0.24, -0.4] };
}
