// The sky dome: a horizon-to-zenith gradient with a sun disc and glow,
// drifting procedural clouds, stars and a moon at night. It is drawn first,
// behind everything, and follows the camera. The same material renders the
// environment map that metals and paint reflect.
import * as THREE from 'three';

const VERT = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = position;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

const FRAG = /* glsl */ `
uniform vec3 uZenith;
uniform vec3 uMid;
uniform vec3 uHorizon;
uniform vec3 uGround;
uniform vec3 uSunDir;
uniform vec3 uSunColor;
uniform vec3 uMoonDir;
uniform vec3 uMoonCol;
uniform vec3 uCloudLit;
uniform vec3 uCloudDark;
uniform float uSunVis;
uniform float uCloud;
uniform float uStars;
uniform float uTime;
varying vec3 vDir;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float hash3(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float a = 0.5;
  float s = 0.0;
  for (int i = 0; i < 5; i++) {
    s += a * noise(p);
    p = p * 2.03 + vec2(17.1, 9.3);
    a *= 0.5;
  }
  return s;
}

void main() {
  vec3 d = normalize(vDir);
  float h = d.y;
  vec3 col = mix(uHorizon, uMid, smoothstep(0.0, 0.3, h));
  col = mix(col, uZenith, smoothstep(0.22, 0.95, h));
  // a band of haze right on the horizon, and the ground below it
  col = mix(col, uHorizon * 1.06, exp(-abs(h) * 28.0) * 0.5);
  col = mix(col, uGround, smoothstep(0.0, -0.06, h));

  // sun: wide warm glow, tight halo and the disc itself (HDR, so it blooms)
  float sd = max(dot(d, uSunDir), 0.0);
  col += uSunColor * (pow(sd, 5.0) * 0.22 + pow(sd, 48.0) * 0.45) * uSunVis;
  float disc = smoothstep(0.99955, 0.99975, sd);
  col += uSunColor * disc * 14.0 * uSunVis * step(-0.02, h);

  // stars and the moon
  if (uStars > 0.001 && h > -0.02) {
    vec3 sp = d * 260.0;
    vec3 cell = floor(sp);
    float r = hash3(cell);
    if (r > 0.9965) {
      vec3 f = fract(sp) - 0.5;
      float tw = 0.65 + 0.35 * sin(uTime * (1.5 + r * 5.0) + r * 60.0);
      float b = smoothstep(0.45, 0.0, length(f)) * (r - 0.9965) / 0.0035;
      col += vec3(0.85, 0.9, 1.0) * b * tw * 2.2 * uStars * smoothstep(-0.02, 0.15, h);
    }
    float md = max(dot(d, uMoonDir), 0.0);
    float moon = smoothstep(0.99935, 0.9996, md);
    float crater = noise(d.xy * 900.0) * 0.25 + noise(d.yz * 380.0) * 0.2;
    col += uMoonCol * moon * (2.6 - crater * 2.0) * uStars;
    col += vec3(0.35, 0.42, 0.6) * pow(md, 90.0) * 0.35 * uStars;
  }

  // clouds: a noise layer projected onto a plane overhead, shaded toward the sun
  if (uCloud > 0.001 && h > -0.05) {
    float hh = max(h, 0.0);
    vec2 uv = d.xz / (hh + 0.14) * 0.9 + vec2(uTime * 0.006, uTime * 0.0025);
    float n = fbm(uv * 1.6);
    float t = mix(0.78, 0.28, uCloud);
    float dens = smoothstep(t, t + 0.22, n) * smoothstep(-0.02, 0.18, h);
    float n2 = fbm(uv * 1.6 + uSunDir.xz * 0.06);
    float lit = clamp((n - n2) * 5.0 + 0.55, 0.0, 1.0);
    vec3 cc = mix(uCloudDark, uCloudLit, lit);
    cc += uSunColor * pow(sd, 12.0) * 0.6 * uSunVis * (1.0 - dens * 0.5);
    col = mix(col, cc, dens * 0.96);
  }
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

export class Sky {
  constructor() {
    this.uniforms = {
      uZenith: { value: new THREE.Color(0x4a6a8a) },
      uMid: { value: new THREE.Color(0x8a9aa8) },
      uHorizon: { value: new THREE.Color(0x9aa8b4) },
      uGround: { value: new THREE.Color(0x9aa8b4) },
      uSunDir: { value: new THREE.Vector3(0.3, 0.6, -0.5).normalize() },
      uSunColor: { value: new THREE.Color(0xfff0dc) },
      uMoonDir: { value: new THREE.Vector3(-0.35, 0.7, 0.45).normalize() },
      uMoonCol: { value: new THREE.Color(0.82, 0.86, 0.95) },
      uCloudLit: { value: new THREE.Color(0xe8e8e8) },
      uCloudDark: { value: new THREE.Color(0x6a7078) },
      uSunVis: { value: 1 },
      uCloud: { value: 0.4 },
      uStars: { value: 0 },
      uTime: { value: 0 },
    };
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: VERT,
      fragmentShader: FRAG,
      side: THREE.BackSide,
      depthWrite: false,
      depthTest: false,
      fog: false,
    });
    this.mesh = new THREE.Mesh(new THREE.SphereGeometry(10, 48, 24), this.material);
    this.mesh.renderOrder = -1000;
    this.mesh.frustumCulled = false;
  }

  // p: { zenith, mid, horizon, sunColor, sunDir, sunVis, cloud, cloudLit, cloudDark, stars }
  set(p) {
    const u = this.uniforms;
    u.uZenith.value.copy(p.zenith);
    u.uMid.value.copy(p.mid);
    u.uHorizon.value.copy(p.horizon);
    u.uGround.value.copy(p.horizon);
    u.uSunColor.value.copy(p.sunColor);
    u.uSunDir.value.copy(p.sunDir);
    u.uSunVis.value = p.sunVis;
    u.uCloud.value = p.cloud;
    u.uCloudLit.value.copy(p.cloudLit);
    u.uCloudDark.value.copy(p.cloudDark);
    u.uStars.value = p.stars;
  }

  update(camera, time) {
    this.mesh.position.copy(camera.position);
    this.uniforms.uTime.value = time;
  }

  // A copy of the dome in its own little scene, for baking the environment map.
  envScene() {
    const s = new THREE.Scene();
    const m = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), this.material);
    s.add(m);
    return s;
  }
}
