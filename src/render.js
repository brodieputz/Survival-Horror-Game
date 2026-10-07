// The frame pipeline. The scene renders into an HDR buffer (multisampled on
// the higher settings), the brightest highlights bloom, ACES tone mapping
// brings it into display range, and a final pass grades it like film:
// contrast and saturation, a slight warm/cool split, a vignette, fine grain
// and a touch of lens fringing.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

const GradeShader = {
  uniforms: {
    tDiffuse: { value: null },
    uRes: { value: new THREE.Vector2(1, 1) },
    uTime: { value: 0 },
    uVignette: { value: 0.32 },
    uGrain: { value: 0.04 },
    uCA: { value: 0.006 },
    uSat: { value: 0.9 },
    uContrast: { value: 1.07 },
    uShadowTint: { value: new THREE.Vector3(0.0, 0.006, 0.018) },
    uHighTint: { value: new THREE.Vector3(1.02, 1.0, 0.96) },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 uRes;
    uniform float uTime;
    uniform float uVignette;
    uniform float uGrain;
    uniform float uCA;
    uniform float uSat;
    uniform float uContrast;
    uniform vec3 uShadowTint;
    uniform vec3 uHighTint;
    varying vec2 vUv;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main() {
      vec2 c = vUv - 0.5;
      float r2 = dot(c, c);
      vec2 off = c * r2 * uCA;
      vec3 col = vec3(texture2D(tDiffuse, vUv - off).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv + off).b);
      float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
      col = mix(vec3(l), col, uSat);
      col = (col - 0.5) * uContrast + 0.5;
      // cool the shadows, warm the highlights
      col += uShadowTint * (1.0 - smoothstep(0.0, 0.45, l));
      col *= mix(vec3(1.0), uHighTint, smoothstep(0.35, 1.0, l));
      vec2 vc = c * vec2(uRes.x / uRes.y, 1.0) * 0.82;
      col *= mix(1.0, smoothstep(0.95, 0.2, length(vc)), uVignette);
      float g = hash(vUv * uRes + fract(uTime * 7.31) * 113.0) - 0.5;
      col += g * uGrain * (1.15 - l);
      gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
    }`,
};

export const QUALITY = {
  cinematic: { label: 'Cinematic', post: true, msaa: 4, bloom: true, ratio: 1.5 },
  balanced: { label: 'Balanced', post: true, msaa: 2, bloom: false, ratio: 1 },
  retro: { label: 'Retro (pixelated)', post: false, msaa: 0, bloom: false, ratio: 0.5 },
};

export class Pipeline {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.composer = null;
    this.grade = null;
    this.quality = null;
  }

  setQuality(q) {
    const Q = QUALITY[q] || QUALITY.cinematic;
    this.quality = q in QUALITY ? q : 'cinematic';
    this.Q = Q;
    if (this.composer) {
      this.composer.renderTarget1.dispose();
      this.composer.renderTarget2.dispose();
      for (const p of this.composer.passes) p.dispose?.();
      this.composer = null;
    }
    if (!Q.post) return;
    const rt = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: Q.msaa });
    const c = (this.composer = new EffectComposer(this.renderer, rt));
    c.addPass(new RenderPass(this.scene, this.camera));
    if (Q.bloom) {
      this.bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.45, 0.55, 1.1);
      c.addPass(this.bloom);
    } else this.bloom = null;
    c.addPass(new OutputPass());
    this.grade = new ShaderPass(GradeShader);
    c.addPass(this.grade);
  }

  pixelRatio() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    return this.Q.post ? Math.min(dpr, this.Q.ratio) : this.Q.ratio;
  }

  setSize(w, h) {
    const pr = this.pixelRatio();
    this.renderer.setPixelRatio(pr);
    this.renderer.setSize(w, h, false);
    if (this.composer) {
      this.composer.setPixelRatio(pr);
      this.composer.setSize(w, h);
      this.grade.uniforms.uRes.value.set(w * pr, h * pr);
    }
  }

  render(dt, time) {
    if (!this.composer) {
      this.renderer.render(this.scene, this.camera);
      return;
    }
    this.grade.uniforms.uTime.value = time;
    this.composer.render(dt);
  }
}
