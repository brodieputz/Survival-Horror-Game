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

// Spent brass (and shotgun hulls) kicked out of the ejection port. They
// tumble, bounce once or twice on the floor and lie there a few seconds.
const CASINGS = 28;
export class Casings {
  constructor(scene) {
    const brass = new THREE.MeshStandardMaterial({ color: 0xc8a050, roughness: 0.3, metalness: 0.9, emissive: 0x2a1c08 });
    const hull = new THREE.MeshStandardMaterial({ color: 0x9a1a14, roughness: 0.5, metalness: 0.1 });
    const small = new THREE.CylinderGeometry(0.0055, 0.0055, 0.022, 6);
    const big = new THREE.CylinderGeometry(0.009, 0.009, 0.05, 7);
    this.list = [];
    for (let i = 0; i < CASINGS; i++) {
      const m = new THREE.Mesh(small, brass);
      m.visible = false;
      m.castShadow = false;
      scene.add(m);
      this.list.push({ m, v: new THREE.Vector3(), spin: new THREE.Vector3(), life: 0, bounces: 0 });
    }
    this.geo = { small, big };
    this.mat = { brass, hull };
    this.next = 0;
    this.onBounce = null;
  }

  eject(pos, right, up, fwd, shell = false) {
    const c = this.list[this.next];
    this.next = (this.next + 1) % CASINGS;
    c.m.geometry = shell ? this.geo.big : this.geo.small;
    c.m.material = shell ? this.mat.hull : this.mat.brass;
    c.m.position.copy(pos);
    c.m.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
    const s = shell ? 1.6 : 2.4;
    c.v.copy(right).multiplyScalar(s * (0.8 + Math.random() * 0.4)).addScaledVector(up, 1.4 + Math.random() * 0.8).addScaledVector(fwd, (Math.random() - 0.3) * 0.6);
    c.spin.set((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30);
    c.life = 4;
    c.bounces = 0;
    c.m.visible = true;
  }

  update(dt, floorY = 0) {
    for (const c of this.list) {
      if (c.life <= 0) continue;
      c.life -= dt;
      if (c.life <= 0) {
        c.m.visible = false;
        continue;
      }
      if (c.bounces > 2) continue;
      c.v.y -= 9.8 * dt;
      c.m.position.addScaledVector(c.v, dt);
      c.m.rotation.x += c.spin.x * dt;
      c.m.rotation.y += c.spin.y * dt;
      c.m.rotation.z += c.spin.z * dt;
      if (c.m.position.y < floorY + 0.006) {
        c.m.position.y = floorY + 0.006;
        c.bounces++;
        if (c.bounces === 1) this.onBounce?.(c.m.position);
        c.v.y = -c.v.y * 0.35;
        c.v.x *= 0.5;
        c.v.z *= 0.5;
        c.spin.multiplyScalar(0.4);
        if (c.bounces > 2) c.m.rotation.set(Math.PI / 2, c.m.rotation.y, 0);
      }
    }
  }

  clear() {
    for (const c of this.list) {
      c.life = 0;
      c.m.visible = false;
    }
  }
}
