// The train: a steam locomotive and its tender, boxcars and flatcars, built
// from their real parts. Everything runs along z with the locomotive's
// front at -z; rails are 1.5 m apart (x = ±0.75), the rail head at y ≈ 0.25.
// `anim` on the locomotive (and `wheels` on the cars) turn the wheels and
// drive the rods when the train is moving.
import * as THREE from 'three';
import { tex } from './textures.js';
import { box, glowSprite, lambert as L } from './models.js';
import { makeSign } from './lotprops.js';

let M = null;
function mats() {
  if (M) return M;
  M = {
    black: L({ color: 0x1c1c1e, roughness: 0.45, metalness: 0.55 }),
    jacket: L({ color: 0x24282a, roughness: 0.4, metalness: 0.6 }),
    smoke: L({ color: 0x141414, roughness: 0.85, metalness: 0.3 }),
    red: L({ color: 0x7a1a12, roughness: 0.5, metalness: 0.3 }),
    steel: L({ color: 0x9aa0a6, roughness: 0.28, metalness: 0.95 }),
    rust: L({ map: tex('trainMetal'), roughness: 0.8, metalness: 0.3 }),
    brass: L({ color: 0xc8a048, roughness: 0.25, metalness: 0.95 }),
    glass: L({ color: 0x101820, roughness: 0.05, metalness: 0.5 }),
    wood: L({ map: tex('wood', 5), color: 0x8a6a4a, roughness: 0.85 }),
    coal: L({ map: tex('coal', 112), roughness: 0.6, metalness: 0.2 }),
    dark: L({ color: 0x0c0c0d, roughness: 0.9 }),
    lens: new THREE.MeshBasicMaterial({ color: 0xfff0c0 }),
    bag: L({ color: 0x8a7a56, roughness: 0.95 }),
    tarp: L({ color: 0x4a5236, roughness: 0.95, map: tex('canvasCloth', 35) }),
  };
  return M;
}

const cylZ = (r0, r1, len, mat, x, y, z, seg = 16) => {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, len, seg), mat);
  m.rotation.x = Math.PI / 2;
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
};
const cylY = (r0, r1, len, mat, x, y, z, seg = 14) => {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, len, seg), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
};
const B = (g, w, h, d, mat, x, y, z) => {
  const b = box(w, h, d, mat, x, y, z);
  b.receiveShadow = true;
  g.add(b);
  return b;
};

// A spoked driving wheel (or a plain disc for small wheels) facing ±x.
function wheel(r, spoked, mat, tire) {
  const g = new THREE.Group();
  const rim = new THREE.Mesh(new THREE.TorusGeometry(r - 0.05, 0.06, 6, 24), tire);
  rim.rotation.y = Math.PI / 2;
  g.add(rim);
  if (spoked) {
    for (let k = 0; k < 12; k++) {
      const s = box(0.05, r * 0.9, 0.04, mat, 0, 0, 0);
      s.rotation.x = (k / 12) * Math.PI;
      g.add(s);
    }
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.22, r * 0.22, 0.12, 12), mat);
    hub.rotation.z = Math.PI / 2;
    g.add(hub);
    // the counterweight opposite the crank
    const cw = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.75, r * 0.75, 0.09, 16, 1, false, Math.PI * 0.75, Math.PI * 0.5), mat);
    cw.rotation.z = Math.PI / 2;
    g.add(cw);
  } else {
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(r - 0.05, r - 0.05, 0.08, 16), mat);
    disc.rotation.z = Math.PI / 2;
    g.add(disc);
  }
  g.traverse((o) => {
    if (o.isMesh) o.castShadow = true;
  });
  return g;
}

// A freight truck (bogie): two axles in a cast side frame with springs.
function truck(z, wheels) {
  const m = mats();
  const g = new THREE.Group();
  for (const sx of [-1, 1]) {
    B(g, 0.12, 0.28, 2.3, m.black, sx * 0.86, 0.5, 0);
    B(g, 0.14, 0.16, 0.5, m.black, sx * 0.86, 0.66, 0); // bolster end
    for (const dz of [-0.12, 0.12]) g.add(cylY(0.05, 0.05, 0.18, m.steel, sx * 0.86, 0.44, dz, 8)); // springs
  }
  B(g, 1.7, 0.18, 0.4, m.black, 0, 0.72, 0); // bolster
  for (const dz of [-0.85, 0.85]) {
    const axle = new THREE.Group();
    axle.position.set(0, 0.42, dz);
    for (const sx of [-0.75, 0.75]) {
      const w = wheel(0.42, false, m.black, m.steel);
      w.position.x = sx;
      axle.add(w);
    }
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.6, 8), m.black);
    shaft.rotation.z = Math.PI / 2;
    axle.add(shaft);
    g.add(axle);
    wheels.push({ obj: axle, r: 0.42 });
  }
  g.position.z = z;
  return g;
}

// ---------------------------------------------------------------- locomotive
export function makeLocomotive(opts = {}) {
  const m = mats();
  const g = new THREE.Group();
  const wheels = [];
  // frame and running boards
  B(g, 1.9, 0.45, 11.4, m.black, 0, 1.15, -0.3);
  for (const sx of [-1, 1]) {
    B(g, 0.55, 0.05, 7.4, m.black, sx * 1.27, 1.85, -1.2); // running board
    B(g, 0.04, 0.16, 7.4, m.red, sx * 1.53, 1.78, -1.2); // its red edge
  }
  // boiler, smokebox and firebox
  const boiler = cylZ(1.0, 1.0, 6.4, m.jacket, 0, 2.6, -1.4, 24);
  g.add(boiler);
  for (let k = 0; k < 6; k++) g.add(cylZ(1.02, 1.02, 0.06, m.steel, 0, 2.6, -4.2 + k * 1.15, 24)); // boiler bands
  g.add(cylZ(1.04, 1.04, 1.3, m.smoke, 0, 2.6, -5.15, 24)); // smokebox
  const door = cylZ(0.86, 0.86, 0.08, m.smoke, 0, 2.6, -5.83, 24);
  g.add(door);
  g.add(cylZ(0.1, 0.06, 0.18, m.steel, 0, 2.6, -5.92, 10)); // dart handle
  for (const dy of [-0.5, 0.5]) B(g, 0.6, 0.06, 0.05, m.steel, 0.25, 2.6 + dy, -5.88); // hinges
  const plate = makeSign(String(opts.number ?? 4417), 0.6, 0.22, { w: 256, h: 96, bg: '#14141a', fg: '#e8c870', font: 'bold 70px serif' });
  plate.position.set(0, 3.1, -5.89);
  plate.rotation.y = Math.PI;
  g.add(plate);
  B(g, 2.0, 1.1, 1.6, m.black, 0, 1.75, 2.0); // firebox
  // stack, domes, bell, whistle, sand pipes
  g.add(cylY(0.3, 0.38, 1.05, m.smoke, 0, 3.95, -5.0, 16));
  g.add(cylY(0.44, 0.44, 0.12, m.smoke, 0, 4.5, -5.0, 16)); // cap
  for (const [z, r] of [
    [-1.6, 0.45],
    [0.3, 0.4],
  ]) {
    g.add(cylY(r, r * 1.08, 0.38, m.jacket, 0, 3.72, z, 18));
    const top = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 8, 0, Math.PI * 2, 0, Math.PI / 2), m.jacket);
    top.position.set(0, 3.9, z);
    top.castShadow = true;
    g.add(top);
  }
  const bell = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.22, 0.28, 14), m.brass);
  bell.position.set(0, 3.95, -3.1);
  bell.castShadow = true;
  g.add(bell);
  B(g, 0.05, 0.36, 0.42, m.black, 0, 3.86, -3.1); // yoke
  g.add(cylY(0.05, 0.05, 0.4, m.brass, 0.25, 3.8, 1.4, 8)); // whistle
  g.add(cylY(0.07, 0.04, 0.12, m.brass, 0.25, 4.05, 1.4, 8));
  for (const sx of [-1, 1]) {
    // handrails along the boiler
    g.add(cylZ(0.02, 0.02, 6.2, m.steel, sx * 0.98, 3.1, -1.4, 6));
    for (let k = 0; k < 5; k++) g.add(cylY(0.015, 0.015, 0.2, m.steel, sx * 0.95, 3.02, -4.2 + k * 1.4, 6));
    // steam pipe down to the cylinders and the sand pipe to the rails
    const sp = cylY(0.07, 0.07, 1.7, m.jacket, sx * 0.8, 2.6, -4.5, 8);
    sp.rotation.x = 0.25;
    g.add(sp);
  }
  // the air pump on the fireman's side
  g.add(cylY(0.2, 0.2, 0.9, m.black, 1.25, 2.4, -2.4, 12));
  g.add(cylY(0.13, 0.13, 0.5, m.black, 1.25, 3.0, -2.4, 12));
  // cylinders and steam chests
  for (const sx of [-1, 1]) {
    g.add(cylZ(0.34, 0.34, 1.0, m.black, sx * 1.08, 1.1, -3.6, 16));
    B(g, 0.5, 0.45, 1.0, m.black, sx * 1.08, 1.6, -3.6);
    B(g, 0.08, 0.08, 1.4, m.steel, sx * 1.08, 1.0, -2.6); // crosshead guide
  }
  // headlamp with its glow
  B(g, 0.5, 0.55, 0.5, m.black, 0, 3.95, -5.35);
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.2, 18), m.lens);
  lens.position.set(0, 3.95, -5.61);
  lens.rotation.y = Math.PI;
  g.add(lens);
  const glow = glowSprite(0xffe2a0, 1.6, 0.8);
  glow.position.set(0, 3.95, -5.8);
  g.add(glow);
  // the pilot (cowcatcher): a V of slats
  for (let k = 0; k < 9; k++) {
    const x = -0.95 + k * 0.24;
    const s = box(0.06, 0.08, 0.95, m.red, x, 0.55, -6.25 + Math.abs(x) * 0.6);
    s.rotation.x = -0.55;
    s.receiveShadow = true;
    g.add(s);
  }
  B(g, 2.0, 0.22, 0.3, m.red, 0, 0.92, -5.8); // buffer beam
  B(g, 0.3, 0.3, 0.5, m.black, 0, 0.9, -6.1); // coupler
  // the cab
  const cz = 3.9;
  B(g, 2.9, 0.12, 3.1, m.black, 0, 1.9, cz); // floor
  for (const sx of [-1, 1]) {
    B(g, 0.08, 1.0, 3.0, m.black, sx * 1.42, 2.45, cz); // lower side
    B(g, 0.08, 1.05, 0.5, m.black, sx * 1.42, 3.5, cz - 1.25);
    B(g, 0.08, 1.05, 0.9, m.black, sx * 1.42, 3.5, cz + 1.05);
    B(g, 0.04, 0.9, 0.9, m.glass, sx * 1.43, 3.45, cz - 0.45); // window
    const num = makeSign(String(opts.number ?? 4417), 1.0, 0.4, { w: 256, h: 100, bg: '#1c1c1e', fg: '#d8b860', font: 'bold 80px serif' });
    num.position.set(sx * 1.47, 2.5, cz);
    num.rotation.y = (sx * Math.PI) / 2;
    g.add(num);
  }
  B(g, 2.9, 2.1, 0.08, m.black, 0, 3.0, cz - 1.5); // front wall
  for (const sx of [-1, 1]) B(g, 0.6, 0.6, 0.05, m.glass, sx * 0.8, 3.5, cz - 1.54); // spectacle windows
  const roof = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 3.4, 20, 1, true, -0.72, 1.44), m.black);
  roof.rotation.x = Math.PI / 2;
  roof.position.set(0, 2.45, cz);
  roof.castShadow = true;
  const rmat = m.black.clone();
  rmat.side = THREE.DoubleSide;
  roof.material = rmat;
  g.add(roof);
  // driving wheels, the pilot truck, the trailing truck
  const anim = { cranks: [], rods: [], main: [], wheels };
  const drivers = [-1.6, 0.25, 2.1];
  for (const z of drivers) {
    const axle = new THREE.Group();
    axle.position.set(0, 0.85, z);
    for (const sx of [-0.78, 0.78]) {
      const w = wheel(0.85, true, m.red, m.steel);
      w.position.x = sx;
      axle.add(w);
    }
    g.add(axle);
    wheels.push({ obj: axle, r: 0.85 });
  }
  for (const z of [-4.6, -3.7]) {
    const axle = new THREE.Group();
    axle.position.set(0, 0.42, z);
    for (const sx of [-0.75, 0.75]) {
      const w = wheel(0.42, false, m.red, m.steel);
      w.position.x = sx;
      axle.add(w);
    }
    g.add(axle);
    wheels.push({ obj: axle, r: 0.42 });
  }
  {
    const axle = new THREE.Group();
    axle.position.set(0, 0.5, 4.6);
    for (const sx of [-0.75, 0.75]) {
      const w = wheel(0.5, false, m.red, m.steel);
      w.position.x = sx;
      axle.add(w);
    }
    g.add(axle);
    wheels.push({ obj: axle, r: 0.5 });
  }
  // side rods joining the drivers' crank pins, and the main rod to the piston
  for (const sx of [-1, 1]) {
    const rod = box(0.07, 0.12, drivers[2] - drivers[0] + 0.3, m.steel, sx * 1.0, 0, 0);
    rod.castShadow = true;
    g.add(rod);
    anim.rods.push({ obj: rod, sx, phase: sx > 0 ? 0 : Math.PI / 2 });
    const main = box(0.06, 0.1, 1.0, m.steel, sx * 1.04, 0, 0);
    main.castShadow = true;
    g.add(main);
    const xh = box(0.12, 0.16, 0.22, m.steel, sx * 1.08, 1.0, -2.6); // crosshead
    g.add(xh);
    anim.main.push({ obj: main, xh, sx, phase: sx > 0 ? 0 : Math.PI / 2 });
  }
  const crank = 0.36;
  const cy = 0.85;
  anim.update = (angle) => {
    for (const w of wheels) w.obj.rotation.x = (-angle * 0.85) / w.r;
    const a = -angle;
    for (const r of anim.rods) {
      const th = a + r.phase;
      r.obj.position.set(r.sx * 1.0, cy + Math.sin(th) * crank, (drivers[0] + drivers[2]) / 2 + Math.cos(th) * crank);
    }
    for (const r of anim.main) {
      const th = a + r.phase;
      const pz = drivers[1] + Math.cos(th) * crank;
      const py = cy + Math.sin(th) * crank;
      const xz = -2.6 + Math.cos(th) * crank * 0.9 - 0.4;
      r.xh.position.z = xz;
      const dz = pz - xz;
      const dy = py - 1.0;
      const len = Math.hypot(dz, dy);
      r.obj.scale.z = len;
      r.obj.position.set(r.sx * 1.04, (py + 1.0) / 2, (pz + xz) / 2);
      r.obj.rotation.x = -Math.atan2(dy, dz);
    }
  };
  anim.update(0);
  g.userData.anim = anim;
  g.userData.stack = new THREE.Vector3(0, 4.6, -5.0);
  g.userData.lamp = new THREE.Vector3(0, 3.95, -5.7);
  g.traverse((o) => {
    if (o.isMesh) o.receiveShadow = true;
  });
  return g;
}

// ---------------------------------------------------------------- tender
export function makeTender() {
  const m = mats();
  const g = new THREE.Group();
  const wheels = [];
  B(g, 2.6, 0.3, 6.6, m.black, 0, 1.15, 0);
  // the tank, the coal bunker and the coal heaped in it
  B(g, 2.9, 1.9, 4.6, m.black, 0, 2.25, 0.9);
  B(g, 2.9, 0.9, 2.0, m.black, 0, 1.75, -2.3);
  for (const sx of [-1, 1]) B(g, 0.08, 0.7, 2.0, m.black, sx * 1.42, 2.6, -2.3); // bunker sides
  const heap = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), m.coal);
  heap.scale.set(1.35, 0.55, 1.6);
  heap.position.set(0, 2.25, -1.7);
  heap.castShadow = true;
  heap.receiveShadow = true;
  g.add(heap);
  const flat = makeSign('DD&W', 1.4, 0.4, { w: 256, h: 76, bg: '#1c1c1e', fg: '#d8b860', font: 'bold 60px serif' });
  for (const sx of [-1, 1]) {
    const f = flat.clone();
    f.position.set(sx * 1.47, 2.4, 1.0);
    f.rotation.y = (sx * Math.PI) / 2;
    g.add(f);
    // a ladder up the back
    for (let k = 0; k < 5; k++) B(g, 0.4, 0.03, 0.03, m.steel, sx * 0.9, 1.4 + k * 0.32, 3.24);
  }
  g.add(cylY(0.32, 0.32, 0.12, m.black, 0.6, 3.25, 2.0, 14)); // water hatch
  B(g, 0.3, 0.3, 0.4, m.black, 0, 0.9, 3.4); // coupler
  B(g, 0.35, 0.3, 0.2, m.black, 0, 3.4, 3.2); // back-up lamp
  g.add(truck(-1.8, wheels));
  g.add(truck(2.0, wheels));
  g.userData.wheels = wheels;
  return g;
}

// ---------------------------------------------------------------- cars
// kind 'box' (roof walk at 3.18) or 'flat' (deck at 1.5)
export function makeTrainCar(kind = 'box', seed = 0) {
  const m = mats();
  const g = new THREE.Group();
  const wheels = [];
  const len = 9.2;
  B(g, 2.5, 0.3, len, m.black, 0, 1.0, 0); // underframe
  B(g, 0.45, 0.45, len - 0.6, m.black, 0, 0.82, 0); // centre sill
  g.add(cylZ(0.18, 0.18, 0.6, m.black, 0.6, 0.7, 1.2, 10)); // brake cylinder
  if (kind === 'box') {
    const side = L({ map: tex('boxcar', 111 + (seed % 3)), roughness: 0.75, metalness: 0.3 });
    // the body's ends in rusty steel, its long sides in painted sheet
    B(g, 2.84, 1.95, len - 0.2, m.rust, 0, 2.12, 0);
    for (const sx of [-1, 1]) B(g, 0.04, 1.95, len - 0.2, side, sx * 1.44, 2.12, 0);
    B(g, 3.0, 0.1, len, m.rust, 0, 3.12, 0); // roof
    for (let z = -len / 2 + 0.5; z < len / 2; z += 0.9) B(g, 3.02, 0.05, 0.08, m.black, 0, 3.18, z); // roof seams
    // the roof walk
    for (let z = -len / 2 + 0.2; z < len / 2; z += 0.35) B(g, 0.55, 0.04, 0.3, m.wood, 0, 3.22, z);
    for (const sx of [-1, 1]) {
      // the sliding door on its tracks
      B(g, 0.06, 1.8, 2.0, L({ map: tex('boxcar', 111 + (seed % 3)), color: 0xd0c8c0, roughness: 0.75 }), sx * 1.48, 2.02, 0.2);
      B(g, 0.08, 0.06, 4.4, m.black, sx * 1.5, 3.0, 0.6);
      B(g, 0.08, 0.06, 4.4, m.black, sx * 1.5, 1.15, 0.6);
      B(g, 0.05, 0.4, 0.05, m.steel, sx * 1.52, 2.0, -0.75); // latch
      // corner ladders
      for (const ez of [-1, 1]) for (let k = 0; k < 6; k++) B(g, 0.05, 0.03, 0.42, m.steel, sx * 1.48, 1.35 + k * 0.3, ez * (len / 2 - 0.45));
      // grab irons and sill steps
      for (const ez of [-1, 1]) B(g, 0.06, 0.24, 0.3, m.black, sx * 1.32, 0.85, ez * (len / 2 - 0.4));
    }
    // a brake wheel up on one end
    const bw = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.025, 6, 16), m.black);
    bw.position.set(0.5, 3.0, len / 2 + 0.06);
    g.add(bw);
  } else {
    // a flatcar: plank deck, stake pockets, and what's been tied down on it
    B(g, 2.9, 0.22, len, m.rust, 0, 1.25, 0);
    for (let x = -1.35; x <= 1.35; x += 0.3) B(g, 0.28, 0.06, len - 0.1, m.wood, x, 1.42, 0);
    for (const sx of [-1, 1]) for (let z = -len / 2 + 0.6; z < len / 2; z += 1.2) B(g, 0.12, 0.18, 0.14, m.black, sx * 1.48, 1.22, z);
    for (let i = 0; i < 8; i++) B(g, 0.7, 0.32, 0.45, m.bag, i % 2 ? -1.1 : 1.1, 1.62, -len / 2 + 1 + i * 1.05);
    // a crate and a tarp-covered load at the ends
    B(g, 1.0, 0.9, 1.0, L({ map: tex('crate', 9) }), -0.6, 1.9, len / 2 - 0.9);
    const tarp = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), m.tarp);
    tarp.scale.set(0.9, 0.7, 1.1);
    tarp.position.set(0.3, 1.45, -len / 2 + 1.2);
    tarp.castShadow = true;
    g.add(tarp);
  }
  // knuckle couplers at both ends
  for (const ez of [-1, 1]) {
    B(g, 0.25, 0.25, 0.5, m.black, 0, 0.95, ez * (len / 2 + 0.15));
    B(g, 0.35, 0.3, 0.15, m.black, 0, 0.95, ez * (len / 2 + 0.42));
  }
  g.add(truck(-len / 2 + 1.7, wheels));
  g.add(truck(len / 2 - 1.7, wheels));
  g.userData.wheels = wheels;
  return g;
}
