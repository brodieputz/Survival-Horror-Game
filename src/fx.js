// Tiny particle system for blood, sparks and dust.
import * as THREE from 'three';

const MAX = 400;

export class Particles {
  constructor(scene) {
    this.pos = new Float32Array(MAX * 3);
    this.col = new Float32Array(MAX * 3);
    this.vel = new Float32Array(MAX * 3);
    this.life = new Float32Array(MAX);
    this.next = 0;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(this.col, 3));
    this.geo = g;
    this.points = new THREE.Points(
      g,
      new THREE.PointsMaterial({ size: 0.07, vertexColors: true, sizeAttenuation: true, transparent: true, depthWrite: false })
    );
    this.points.frustumCulled = false;
    for (let i = 0; i < MAX; i++) this.pos[i * 3 + 1] = -999;
    scene.add(this.points);
  }

  burst(p, n, color, speed = 2.5, up = 1) {
    const c = new THREE.Color(color);
    for (let k = 0; k < n; k++) {
      const i = this.next;
      this.next = (this.next + 1) % MAX;
      this.pos[i * 3] = p.x;
      this.pos[i * 3 + 1] = p.y;
      this.pos[i * 3 + 2] = p.z;
      this.vel[i * 3] = (Math.random() - 0.5) * speed;
      this.vel[i * 3 + 1] = Math.random() * speed * up;
      this.vel[i * 3 + 2] = (Math.random() - 0.5) * speed;
      const v = 0.7 + Math.random() * 0.3;
      this.col[i * 3] = c.r * v;
      this.col[i * 3 + 1] = c.g * v;
      this.col[i * 3 + 2] = c.b * v;
      this.life[i] = 0.6 + Math.random() * 0.6;
    }
  }

  update(dt) {
    for (let i = 0; i < MAX; i++) {
      if (this.life[i] <= 0) continue;
      this.life[i] -= dt;
      if (this.life[i] <= 0) {
        this.pos[i * 3 + 1] = -999;
        continue;
      }
      this.vel[i * 3 + 1] -= 9 * dt;
      this.pos[i * 3] += this.vel[i * 3] * dt;
      this.pos[i * 3 + 1] += this.vel[i * 3 + 1] * dt;
      this.pos[i * 3 + 2] += this.vel[i * 3 + 2] * dt;
      if (this.pos[i * 3 + 1] < 0.02) {
        this.pos[i * 3 + 1] = 0.02;
        this.vel[i * 3] *= 0.3;
        this.vel[i * 3 + 1] = 0;
        this.vel[i * 3 + 2] *= 0.3;
      }
    }
    this.geo.attributes.position.needsUpdate = true;
    this.geo.attributes.color.needsUpdate = true;
  }
}
