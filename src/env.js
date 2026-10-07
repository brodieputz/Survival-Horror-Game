// Light, sky and air. Works out the palette for the biome, the scene and the
// hour, then drives the sky dome, fog, ambient light, the sun (whose shadow
// camera follows the player), image-based reflections and exposure.
// Walking into a building, daylight gives way to darkness over a few steps
// and exposure adapts more slowly, the way eyes do.
import * as THREE from 'three';
import { Sky } from './sky.js';
import { BIOMES } from './run.js';
import { DAY_HOURS } from './config.js';
import { clamp, damp, lerp } from './util.js';

const INDOOR = {
  fog: new THREE.Color(0x060504),
  fogD: 0.05,
  hemiS: new THREE.Color(0x4a4a60),
  hemiG: new THREE.Color(0x1c140e),
  hemiI: 0.55,
  env: 0.03,
  exposure: 1.35,
};
const SHADOW = { cinematic: [4096, 55], balanced: [2048, 45], performance: [1024, 36], retro: [1024, 40] };
const UP = new THREE.Vector3(0, 1, 0);
const vA = new THREE.Vector3();
const vB = new THREE.Vector3();
const vC = new THREE.Vector3();
const vD = new THREE.Vector3();

const C = (h) => new THREE.Color(h);
function palette(t) {
  return { zen: C(t.zen), sky: C(t.sky), fog: C(t.fog), hemiS: C(t.hemiS), hemiG: C(t.hemiG), sun: C(t.sun), sunI: t.sunI, hemiI: t.hemiI, fogD: t.fogD };
}
function mixPal(a, b, f) {
  const o = {};
  for (const k in a) o[k] = a[k].isColor ? a[k].clone().lerp(b[k], f) : lerp(a[k], b[k], f);
  return o;
}

// Direction toward the sun for s from 0 (sunrise, +x) to 1 (sunset, -x).
// The arc leans toward z = side so the sun never sits straight overhead.
export function sunArc(s, side) {
  const a = Math.PI * s;
  const up = Math.sin(a);
  return new THREE.Vector3(Math.cos(a), Math.max(0.02, up * 0.82), side * (0.3 + up * 0.55)).normalize();
}

export class Environment {
  constructor(game) {
    this.game = game;
    this.sky = new Sky();
    game.scene.add(this.sky.mesh);
    this.fog = new THREE.FogExp2(0x000000, 0.02);
    game.scene.fog = this.fog;
    game.scene.background = new THREE.Color(0x000000);
    this.pmrem = new THREE.PMREMGenerator(game.renderer);
    this.envRT = null;
    this.indoor = 0;
    this.adapt = 0;
    this.out = null;
    this.night = false;
    this.lightDir = new THREE.Vector3(0, 1, 0);
    this.key = '';
    this.setQuality('cinematic');
  }

  setQuality(q) {
    const [size, ext] = SHADOW[q] || SHADOW.cinematic;
    const sh = this.game.sun.shadow;
    if (sh.mapSize.x !== size) {
      sh.mapSize.set(size, size);
      if (sh.map) {
        sh.map.dispose();
        sh.map = null;
      }
    }
    this.ext = ext;
    Object.assign(sh.camera, { left: -ext, right: ext, top: ext, bottom: -ext, near: 1, far: 360 });
    sh.camera.updateProjectionMatrix();
    sh.bias = -0.00025;
    sh.normalBias = 0.035;
    sh.radius = 2.5;
  }

  // Work out the outdoor look for the current scene, phase and hour.
  refresh() {
    const g = this.game;
    const run = g.run;
    const lvl = g.level;
    if (!run || !lvl) return;
    const b = BIOMES[run.locality.biome];
    const T = b.tod;
    const side = lvl.kind === 'camp' ? -1 : 1;
    let pal;
    let s = 0.975;
    const night = run.phase === 'night';
    if (night) pal = palette(T.night);
    else if (run.phase === 'dusk') pal = palette(T.dusk);
    else {
      // a search takes hours; light it as it looks halfway through
      const hours = lvl.kind === 'building' ? run.hours + lvl.loc.hours * 0.5 : run.hours;
      pal = mixPal(palette(T.day), palette(T.dusk), clamp((4 - hours) / 4, 0, 1) * 0.8);
      s = 0.1 + 0.82 * clamp(1 - hours / DAY_HOURS, 0, 1);
    }
    const sunDir = sunArc(s, side);
    const moonDir = new THREE.Vector3(-0.35, 0.72, 0.42 * side).normalize();
    this.night = night;
    pal.exposure = night ? 1.5 : run.phase === 'dusk' ? 1.1 : 1.0;
    pal.env = night ? 0.12 : run.phase === 'dusk' ? 0.35 : 0.55;
    this.out = pal;
    // light comes from the sun, or the moon at night; never let it graze the
    // ground so shadows stay crisp enough to read
    this.lightDir.copy(night ? moonDir : sunDir);
    if (this.lightDir.y < 0.16) {
      this.lightDir.y = 0.16;
      this.lightDir.normalize();
    }
    const cloud = b.clouds;
    const dusk = run.phase === 'dusk';
    this.sky.set({
      zenith: pal.zen,
      mid: pal.sky,
      horizon: pal.fog,
      sunColor: pal.sun,
      sunDir,
      sunVis: night ? 0 : 1 - cloud * 0.45,
      cloud,
      cloudLit: pal.sun.clone().lerp(C(0xffffff), 0.45).multiplyScalar(night ? 0.05 : dusk ? 0.6 : 0.95),
      cloudDark: pal.fog.clone().lerp(pal.zen, 0.35).multiplyScalar(night ? 0.45 : 0.6),
      stars: night ? 1 : 0,
    });
    this.sky.uniforms.uMoonDir.value.copy(moonDir);
    const key = [run.locality.biome, run.phase, Math.round(s * 12), lvl.kind].join(':');
    if (key !== this.key) {
      this.key = key;
      this.bake();
    }
    this.indoor = this.adapt = lvl.kind === 'building' && g.player ? lvl.indoorAt(g.player.pos.x, g.player.pos.z) : 0;
    this.apply();
  }

  // Render the sky into a prefiltered environment map for reflections.
  bake() {
    if (!this.envScene) this.envScene = this.sky.envScene();
    const rt = this.pmrem.fromScene(this.envScene, 0, 0.1, 100);
    if (this.envRT) this.envRT.dispose();
    this.envRT = rt;
    this.game.scene.environment = rt.texture;
  }

  apply() {
    const g = this.game;
    const out = this.out;
    const k = this.indoor;
    this.fog.color.copy(out.fog).lerp(INDOOR.fog, k);
    this.fog.density = lerp(out.fogD, INDOOR.fogD, k);
    g.hemi.color.copy(out.hemiS).lerp(INDOOR.hemiS, k);
    g.hemi.groundColor.copy(out.hemiG).lerp(INDOOR.hemiG, k);
    g.hemi.intensity = lerp(out.hemiI * 1.3, INDOOR.hemiI, k);
    g.scene.environmentIntensity = lerp(out.env, INDOOR.env, k);
    g.sun.visible = true;
    g.sun.color.copy(out.sun);
    g.sun.intensity = out.sunI * (this.night ? 3.4 : 2.1);
    g.renderer.toneMappingExposure = out.exposure * lerp(1, INDOOR.exposure, this.adapt);
  }

  update(dt) {
    const g = this.game;
    const lvl = g.level;
    if (!lvl || !this.out) return;
    const p = g.player;
    const target = lvl.kind === 'building' && p ? lvl.indoorAt(p.pos.x, p.pos.z) : 0;
    this.indoor = damp(this.indoor, target, 5, dt);
    // eyes take longer to adjust to the dark than to the light
    this.adapt = damp(this.adapt, target, target > this.adapt ? 0.8 : 2.2, dt);
    this.apply();
    this.followShadow();
    this.sky.update(g.camera, g.time);
  }

  // Keep the sun's shadow map centred just ahead of the camera, snapped to
  // whole shadow texels so edges don't shimmer as the player moves.
  followShadow() {
    const g = this.game;
    const sun = g.sun;
    const cam = g.camera;
    const fwd = vA.set(0, 0, -1).applyQuaternion(cam.quaternion);
    fwd.y = 0;
    if (fwd.lengthSq() < 1e-4) fwd.set(0, 0, -1);
    fwd.normalize();
    const c = vB.copy(cam.position).addScaledVector(fwd, this.ext * 0.4);
    c.y = 0;
    const z = this.lightDir;
    const x = vC.crossVectors(UP, z).normalize();
    const y = vD.crossVectors(z, x);
    const texel = (2 * this.ext) / sun.shadow.mapSize.x;
    const cx = c.dot(x);
    const cy = c.dot(y);
    c.addScaledVector(x, Math.round(cx / texel) * texel - cx).addScaledVector(y, Math.round(cy / texel) * texel - cy);
    sun.target.position.copy(c);
    sun.position.copy(c).addScaledVector(z, 170);
    sun.target.updateMatrixWorld();
    sun.updateMatrixWorld();
  }
}
