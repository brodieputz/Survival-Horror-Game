// What makes a flashlight beam feel real indoors: the faint cone of light
// you can see in the dusty air, and the specks of dust that drift through it
// and sparkle only where the beam catches them.
import * as THREE from 'three';

const LEN = 9;
const MOTES = 260;

export class FlashlightBeam {
  constructor(camera) {
    const r = LEN * Math.tan(0.4);
    const geo = new THREE.ConeGeometry(r, LEN, 28, 6, true);
    geo.translate(0, -LEN / 2, 0);
    geo.rotateX(-Math.PI / 2); // apex at the lens, opening along +z (lookAt aims +z)
    const pos = geo.attributes.position;
    const fade = new Float32Array(pos.count);
    for (let i = 0; i < pos.count; i++) fade[i] = Math.pow(1 - Math.min(1, Math.max(0, pos.getZ(i)) / LEN), 1.6);
    geo.setAttribute('fade', new THREE.BufferAttribute(fade, 1));
    this.mat = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(0xfff0d0) }, uI: { value: 0 } },
      vertexShader: /* glsl */ `
        attribute float fade;
        varying float vFade;
        varying float vEdge;
        void main() {
          vFade = fade;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vec3 n = normalize(normalMatrix * normal);
          vEdge = 1.0 - abs(dot(n, normalize(-mv.xyz)));
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        uniform float uI;
        varying float vFade;
        varying float vEdge;
        void main() {
          float a = vFade * (0.25 + 0.75 * vEdge * vEdge) * uI;
          gl_FragColor = vec4(uColor * a, 1.0);
        }`,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    this.cone = new THREE.Mesh(geo, this.mat);
    this.cone.position.set(-0.2, -0.2, -0.75);
    this.cone.lookAt(0, -0.15 + 0.0, -8); // aim like the spot light
    this.cone.renderOrder = 5;
    this.cone.frustumCulled = false;
    camera.add(this.cone);

    // dust
    this.mpos = new Float32Array(MOTES * 3);
    this.mcol = new Float32Array(MOTES * 3);
    this.mvel = new Float32Array(MOTES * 3);
    for (let i = 0; i < MOTES; i++) {
      this.mpos[i * 3] = (Math.random() - 0.5) * 12;
      this.mpos[i * 3 + 1] = Math.random() * 3.4;
      this.mpos[i * 3 + 2] = (Math.random() - 0.5) * 12;
      this.mvel[i * 3] = (Math.random() - 0.5) * 0.05;
      this.mvel[i * 3 + 1] = (Math.random() - 0.5) * 0.03;
      this.mvel[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.mpos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(this.mcol, 3));
    this.motes = new THREE.Points(g, new THREE.PointsMaterial({ size: 0.025, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true }));
    this.motes.frustumCulled = false;
    this.mgeo = g;
    this.origin = new THREE.Vector3();
    this.dir = new THREE.Vector3();
  }

  attach(scene) {
    scene.add(this.motes);
  }

  // intensity: 0 (off / outdoors) .. 1 (on, indoors in still air)
  update(dt, camera, intensity) {
    this.mat.uniforms.uI.value = intensity * 0.075;
    this.cone.visible = intensity > 0.01;
    this.motes.visible = intensity > 0.01;
    if (!this.motes.visible) return;
    this.cone.getWorldPosition(this.origin);
    camera.getWorldDirection(this.dir);
    const cx = camera.position.x;
    const cy = camera.position.y;
    const cz = camera.position.z;
    const o = this.origin;
    const d = this.dir;
    const cosIn = Math.cos(0.3);
    const cosOut = Math.cos(0.44);
    for (let i = 0; i < MOTES; i++) {
      const k = i * 3;
      // drift, and stay in a box around the viewer
      this.mpos[k] += this.mvel[k] * dt;
      this.mpos[k + 1] += this.mvel[k + 1] * dt;
      this.mpos[k + 2] += this.mvel[k + 2] * dt;
      for (const [a, c] of [
        [0, cx],
        [2, cz],
      ]) {
        if (this.mpos[k + a] < c - 6) this.mpos[k + a] += 12;
        else if (this.mpos[k + a] > c + 6) this.mpos[k + a] -= 12;
      }
      if (this.mpos[k + 1] < 0.1) this.mpos[k + 1] = 3.3;
      else if (this.mpos[k + 1] > 3.4) this.mpos[k + 1] = 0.15;
      // lit only inside the beam
      const vx = this.mpos[k] - o.x;
      const vy = this.mpos[k + 1] - o.y;
      const vz = this.mpos[k + 2] - o.z;
      const len = Math.hypot(vx, vy, vz) || 1;
      const cos = (vx * d.x + vy * d.y + vz * d.z) / len;
      let b = cos <= cosOut ? 0 : cos >= cosIn ? 1 : (cos - cosOut) / (cosIn - cosOut);
      b *= Math.max(0, 1 - len / 8) * intensity;
      const tw = 0.6 + 0.4 * Math.sin(i * 12.9 + performance.now() * 0.003);
      const v = b * tw * 0.9;
      this.mcol[k] = v;
      this.mcol[k + 1] = v * 0.95;
      this.mcol[k + 2] = v * 0.85;
    }
    void cy;
    this.mgeo.attributes.position.needsUpdate = true;
    this.mgeo.attributes.color.needsUpdate = true;
  }
}
