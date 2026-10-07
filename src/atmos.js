// Ground and air details: large-scale colour variation so tiled ground
// textures don't read as a grid, wind-blown grass tufts, and campfire smoke.
import * as THREE from 'three';
import { tex } from './textures.js';

export const WIND = { value: 0 }; // shared clock for everything the wind moves

const NOISE_GLSL = /* glsl */ `
float mvHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float mvNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(mvHash(i), mvHash(i + vec2(1.0, 0.0)), u.x), mix(mvHash(i + vec2(0.0, 1.0)), mvHash(i + vec2(1.0, 1.0)), u.x), u.y);
}`;

// Patch a ground material so its colour drifts in broad patches across the
// world (worn tracks, damp hollows, sun-bleached spots).
export function macroVary(mat, strength = 1) {
  const prev = mat.onBeforeCompile;
  mat.onBeforeCompile = (sh, r) => {
    if (prev) prev(sh, r);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec2 vMacroW;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvMacroW = (modelMatrix * vec4(transformed, 1.0)).xz;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec2 vMacroW;\n' + NOISE_GLSL)
      .replace(
        '#include <map_fragment>',
        `#include <map_fragment>
        {
          float n = mvNoise(vMacroW * 0.031) * 0.55 + mvNoise(vMacroW * 0.12 + 7.3) * 0.3 + mvNoise(vMacroW * 0.47 + 3.1) * 0.15;
          diffuseColor.rgb *= mix(1.0, mix(0.7, 1.2, n), ${strength.toFixed(2)});
        }`
      );
  };
  mat.customProgramCacheKey = () => 'macro' + strength;
  return mat;
}

// Tufts of grass (crossed alpha-tested quads) scattered by `place(x, z)`,
// which returns false where nothing should grow. They lean with the wind.
export function makeGrass({ count, x0, x1, z0, z1, color, height = 0.45, place, rng }) {
  const g = new THREE.BufferGeometry();
  const w = height * 1.3;
  const pos = [];
  const uv = [];
  const idx = [];
  for (let k = 0; k < 2; k++) {
    const a = k * (Math.PI / 2) + 0.4;
    const dx = (Math.cos(a) * w) / 2;
    const dz = (Math.sin(a) * w) / 2;
    const i = pos.length / 3;
    pos.push(-dx, 0, -dz, dx, 0, dz, dx, height, dz, -dx, height, -dz);
    uv.push(0, 0, 1, 0, 1, 1, 0, 1);
    idx.push(i, i + 1, i + 2, i, i + 2, i + 3);
  }
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  // normals straight up: tufts take the light like the ground under them
  g.setAttribute('normal', new THREE.Float32BufferAttribute(new Array(pos.length).fill(0).map((_, i) => (i % 3 === 1 ? 1 : 0)), 3));
  g.setIndex(idx);
  const mat = new THREE.MeshStandardMaterial({ map: tex('grassBlades'), color, alphaTest: 0.42, alphaToCoverage: true, side: THREE.DoubleSide, roughness: 0.92 });
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uWind = WIND;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uWind;')
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        {
          vec3 ip = instanceMatrix[3].xyz;
          float sway = sin(uWind * 1.7 + ip.x * 0.31 + ip.z * 0.23) * 0.6 + sin(uWind * 3.1 + ip.x * 0.9) * 0.25;
          transformed.x += sway * 0.08 * uv.y;
          transformed.z += sway * 0.03 * uv.y;
        }`
      );
  };
  mat.customProgramCacheKey = () => 'grass';
  const mesh = new THREE.InstancedMesh(g, mat, count);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3();
  const p = new THREE.Vector3();
  const c = new THREE.Color();
  let n = 0;
  for (let a = 0; a < count * 3 && n < count; a++) {
    const x = x0 + rng() * (x1 - x0);
    const z = z0 + rng() * (z1 - z0);
    if (place && !place(x, z)) continue;
    q.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, rng() * Math.PI * 2);
    const k = 0.6 + rng() * 0.8;
    s.set(k, k * (0.7 + rng() * 0.6), k);
    p.set(x, 0, z);
    m.compose(p, q, s);
    mesh.setMatrixAt(n, m);
    const v = 0.7 + rng() * 0.55;
    c.setRGB(v * (0.92 + rng() * 0.16), v, v * (0.9 + rng() * 0.12));
    mesh.setColorAt(n, c);
    n++;
  }
  mesh.count = n;
  mesh.receiveShadow = true;
  mesh.castShadow = false;
  mesh.frustumCulled = false;
  return mesh;
}

// Smoke curling up from a fire.
export class Smoke {
  constructor(x, y, z, n = 18) {
    this.group = new THREE.Group();
    this.origin = new THREE.Vector3(x, y, z);
    this.puffs = [];
    for (let i = 0; i < n; i++) {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex('smoke'), color: 0x8a8580, transparent: true, depthWrite: false, opacity: 0 }));
      sp.userData.t = i / n;
      sp.userData.r = Math.random();
      this.group.add(sp);
      this.puffs.push(sp);
    }
    this.tint = new THREE.Color(0x8a8580);
  }
  // light: a colour for the smoke to take on (the ambient sky colour)
  update(dt, light) {
    if (light) this.tint.copy(light);
    for (const sp of this.puffs) {
      const u = sp.userData;
      u.t += dt * 0.11;
      if (u.t > 1) {
        u.t -= 1;
        u.r = Math.random();
      }
      const t = u.t;
      sp.position.set(this.origin.x + t * t * 2.2 + Math.sin(t * 6 + u.r * 6) * 0.25, this.origin.y + t * 5.5, this.origin.z + Math.cos(t * 5 + u.r * 4) * 0.3 - t * 0.8);
      const sc = 0.5 + t * 3.2;
      sp.scale.set(sc, sc, sc);
      sp.material.rotation = u.r * 6 + t * 1.5;
      sp.material.opacity = Math.sin(Math.PI * Math.min(1, t * 1.4)) * 0.32 * (1 - t);
      sp.material.color.copy(this.tint);
    }
  }
}
