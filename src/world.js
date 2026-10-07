// Turns the dungeon grid into renderable geometry, and answers spatial
// queries: collision, line of sight, raycasts and A* path-finding.
import * as THREE from 'three';
import { TILE, WALL_H, PIT_DEPTH, T } from './config.js';
import { tex } from './textures.js';
import { macroVary } from './atmos.js';
import { MinHeap } from './util.js';

class QuadBatch {
  constructor() {
    this.pos = [];
    this.nor = [];
    this.uv = [];
    this.idx = [];
  }
  // a,b,c,d counter-clockwise when seen from the front; uv rect u0..u1, v0..v1
  quad(a, b, c, d, n, u0 = 0, v0 = 0, u1 = 1, v1 = 1) {
    const i = this.pos.length / 3;
    this.pos.push(...a, ...b, ...c, ...d);
    for (let k = 0; k < 4; k++) this.nor.push(n[0], n[1], n[2]);
    this.uv.push(u0, v0, u1, v0, u1, v1, u0, v1);
    // Make the winding agree with the requested normal so faces are never culled wrongly.
    const e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const e2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    const cx = e1[1] * e2[2] - e1[2] * e2[1];
    const cy = e1[2] * e2[0] - e1[0] * e2[2];
    const cz = e1[0] * e2[1] - e1[1] * e2[0];
    if (cx * n[0] + cy * n[1] + cz * n[2] >= 0) this.idx.push(i, i + 1, i + 2, i, i + 2, i + 3);
    else this.idx.push(i, i + 2, i + 1, i, i + 3, i + 2);
  }
  build() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nor, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
    g.setIndex(this.idx);
    g.computeBoundingSphere();
    return g;
  }
}

// Wall quad on the boundary of tile (tx,ty) toward direction (fx,fz), facing back into the tile.
function wallQuad(batch, tx, ty, fx, fz, y0, y1, vScale = 1 / TILE) {
  const cx = (tx + 0.5) * TILE + (fx * TILE) / 2;
  const cz = (ty + 0.5) * TILE + (fz * TILE) / 2;
  const rx = -fz;
  const rz = fx; // right vector when facing (fx,fz)
  const h = TILE / 2;
  const A = [cx - rx * h, y0, cz - rz * h];
  const B = [cx + rx * h, y0, cz + rz * h];
  const C = [cx + rx * h, y1, cz + rz * h];
  const D = [cx - rx * h, y1, cz - rz * h];
  batch.quad(A, B, C, D, [-fx, 0, -fz], 0, y0 * vScale, 1, y1 * vScale);
}

export class World {
  // d: { W, H, tiles, blocked, roomOf?, theme? }
  // opts.render=false builds no geometry (the camp draws its own terrain).
  // opts.outdoor=true means there is no ceiling anywhere.
  constructor(d, opts = {}) {
    this.d = d;
    this.W = d.W;
    this.H = d.H;
    this.tiles = d.tiles;
    this.outdoor = !!opts.outdoor;
    this.group = new THREE.Group();
    this.props = new Map(); // tile index -> array of AABB colliders
    this.materials = {};
    if (opts.render !== false) this.buildGeometry();
  }

  t(x, y) {
    if (x < 0 || y < 0 || x >= this.W || y >= this.H) return T.ROCK;
    return this.tiles[y * this.W + x];
  }
  tileOf(x, z) {
    return [Math.floor(x / TILE), Math.floor(z / TILE)];
  }
  isOpenSky(x, z) {
    if (this.outdoor) return true;
    return this.t(Math.floor(x / TILE), Math.floor(z / TILE)) === T.YARD;
  }
  walkableForMonster(x, y) {
    const t = this.t(x, y);
    return (t === T.FLOOR || t === T.YARD) && !this.d.blocked[y * this.W + x];
  }

  buildGeometry() {
    const d = this.d;
    const theme = d.theme || {};
    const batches = {
      wall: new QuadBatch(),
      wall2: new QuadBatch(),
      floor: new QuadBatch(),
      ceil: new QuadBatch(),
      yard: new QuadBatch(),
      outside: new QuadBatch(),
      pit: new QuadBatch(),
    };
    // rock outside the building's outline is open ground (lawns, verges)
    const sh = d.shell;
    const inShell = (x, y) => sh && x >= sh.x0 && x <= sh.x1 && y >= sh.y0 && y <= sh.y1;
    const isOpen = (x, y) => this.t(x, y) !== T.ROCK;
    for (let y = 0; y < this.H; y++)
      for (let x = 0; x < this.W; x++) {
        const t = this.t(x, y);
        if (t === T.ROCK) {
          if (sh && !inShell(x, y)) {
            const x0 = x * TILE;
            const z0 = y * TILE;
            batches.outside.quad([x0, 0, z0], [x0, 0, z0 + TILE], [x0 + TILE, 0, z0 + TILE], [x0 + TILE, 0, z0], [0, 1, 0]);
          }
          continue;
        }
        const yard = t === T.YARD;
        const room = d.roomOf ? d.roomOf[y * this.W + x] : -1;
        const x0 = x * TILE;
        const z0 = y * TILE;
        const x1 = x0 + TILE;
        const z1 = z0 + TILE;
        const fy = t === T.PIT ? -PIT_DEPTH : 0;
        const fb = yard ? batches.yard : t === T.PIT ? batches.pit : batches.floor;
        fb.quad([x0, fy, z0], [x0, fy, z1], [x1, fy, z1], [x1, fy, z0], [0, 1, 0]);
        if (!yard) batches.ceil.quad([x0, WALL_H, z0], [x1, WALL_H, z0], [x1, WALL_H, z1], [x0, WALL_H, z1], [0, -1, 0]);
        if (yard) continue; // the lot is open: fences and the facade are props
        const wb = room > 0 && room % 3 === 0 ? batches.wall2 : batches.wall;
        for (const [fx, fz] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          const nx = x + fx;
          const ny = y + fz;
          if (isOpen(nx, ny)) {
            if (t === T.PIT && this.t(nx, ny) !== T.PIT) wallQuad(batches.pit, x, y, fx, fz, -PIT_DEPTH, 0);
            continue;
          }
          wallQuad(wb, x, y, fx, fz, t === T.PIT ? -PIT_DEPTH : 0, WALL_H);
        }
      }

    const mk = (texture, color = 0xffffff, rough = 0.9) => {
      const t2 = texture.clone();
      t2.needsUpdate = true;
      return new THREE.MeshStandardMaterial({ map: t2, color, roughness: rough, metalness: 0, shadowSide: THREE.DoubleSide });
    };
    const mats = {
      wall: mk(tex(theme.wall || 'brick', 1)),
      wall2: mk(tex(theme.wall2 || 'stoneBlocks', 2)),
      floor: mk(tex(theme.floor || 'floor', 3)),
      ceil: mk(tex(theme.ceil || 'ceiling', 4)),
      yard: macroVary(mk(tex(theme.yard || 'asphalt', 30)), 0.8),
      outside: macroVary(mk(tex(theme.outside || 'grass', 31))),
      pit: mk(tex('stoneBlocks', 2), 0x664444),
    };
    this.materials = mats;
    for (const k in batches) {
      if (!batches[k].pos.length) continue;
      const mesh = new THREE.Mesh(batches[k].build(), mats[k]);
      mesh.receiveShadow = true;
      // walls and ceilings keep the sun out of the interior
      mesh.castShadow = k === 'wall' || k === 'wall2' || k === 'ceil';
      mesh.matrixAutoUpdate = false;
      mesh.updateMatrix();
      this.group.add(mesh);
    }
  }

  // ---------- Prop colliders ----------
  addCollider(minX, minZ, maxX, maxZ, ref) {
    const box = { minX, minZ, maxX, maxZ, ref };
    const tx0 = Math.floor(minX / TILE);
    const tx1 = Math.floor(maxX / TILE);
    const tz0 = Math.floor(minZ / TILE);
    const tz1 = Math.floor(maxZ / TILE);
    for (let y = tz0; y <= tz1; y++)
      for (let x = tx0; x <= tx1; x++) {
        const k = y * this.W + x;
        if (!this.props.has(k)) this.props.set(k, []);
        this.props.get(k).push(box);
      }
    return box;
  }
  removeCollider(box) {
    for (const arr of this.props.values()) {
      const i = arr.indexOf(box);
      if (i >= 0) arr.splice(i, 1);
    }
  }

  // Push a circle (pos.x/pos.z, radius r) out of solid geometry.
  // opts.monster: also treat safe room / pits as solid.
  collide(pos, r, monster = false) {
    for (let iter = 0; iter < 2; iter++) {
      const tx = Math.floor(pos.x / TILE);
      const tz = Math.floor(pos.z / TILE);
      for (let y = tz - 1; y <= tz + 1; y++)
        for (let x = tx - 1; x <= tx + 1; x++) {
          const t = this.t(x, y);
          let solid = t === T.ROCK;
          if (monster && t === T.PIT) solid = true;
          if (solid) this.pushOut(pos, r, x * TILE, y * TILE, (x + 1) * TILE, (y + 1) * TILE);
          const list = this.props.get(y * this.W + x);
          if (list) for (const b of list) this.pushOut(pos, r, b.minX, b.minZ, b.maxX, b.maxZ);
        }
    }
  }
  pushOut(pos, r, minX, minZ, maxX, maxZ) {
    const cx = Math.max(minX, Math.min(pos.x, maxX));
    const cz = Math.max(minZ, Math.min(pos.z, maxZ));
    let dx = pos.x - cx;
    let dz = pos.z - cz;
    const d2 = dx * dx + dz * dz;
    if (d2 >= r * r) return false;
    if (d2 < 1e-8) {
      // center inside box: push along smallest axis
      const l = pos.x - minX;
      const rr = maxX - pos.x;
      const tp = pos.z - minZ;
      const bt = maxZ - pos.z;
      const m = Math.min(l, rr, tp, bt);
      if (m === l) pos.x = minX - r;
      else if (m === rr) pos.x = maxX + r;
      else if (m === tp) pos.z = minZ - r;
      else pos.z = maxZ + r;
      return true;
    }
    const d = Math.sqrt(d2);
    pos.x = cx + (dx / d) * r;
    pos.z = cz + (dz / d) * r;
    return true;
  }

  // Grid DDA: true if no rock tile between the two points.
  los(ax, az, bx, bz) {
    return this.rayDist(ax, az, bx, bz) >= Math.hypot(bx - ax, bz - az) - 1e-4;
  }

  // Distance along the ray (ax,az)->(bx,bz) until a rock tile is hit (capped at segment length).
  rayDist(ax, az, bx, bz) {
    const dx = bx - ax;
    const dz = bz - az;
    const len = Math.hypot(dx, dz);
    if (len < 1e-6) return 0;
    const ux = dx / len;
    const uz = dz / len;
    let x = Math.floor(ax / TILE);
    let y = Math.floor(az / TILE);
    const stepX = ux > 0 ? 1 : -1;
    const stepY = uz > 0 ? 1 : -1;
    const tDeltaX = ux !== 0 ? Math.abs(TILE / ux) : Infinity;
    const tDeltaY = uz !== 0 ? Math.abs(TILE / uz) : Infinity;
    let tMaxX = ux !== 0 ? ((ux > 0 ? (x + 1) * TILE : x * TILE) - ax) / ux : Infinity;
    let tMaxY = uz !== 0 ? ((uz > 0 ? (y + 1) * TILE : y * TILE) - az) / uz : Infinity;
    let t = 0;
    for (let i = 0; i < 256; i++) {
      if (this.t(x, y) === T.ROCK) return t;
      if (tMaxX < tMaxY) {
        t = tMaxX;
        tMaxX += tDeltaX;
        x += stepX;
      } else {
        t = tMaxY;
        tMaxY += tDeltaY;
        y += stepY;
      }
      if (t > len) return len;
    }
    return len;
  }

  // 3D ray vs world (walls, floor, ceiling). Returns distance.
  ray3D(origin, dir, maxDist) {
    const flat = Math.hypot(dir.x, dir.z);
    let d = maxDist;
    if (flat > 1e-5) {
      const hd = this.rayDist(origin.x, origin.z, origin.x + (dir.x / flat) * maxDist * flat, origin.z + (dir.z / flat) * maxDist * flat);
      d = Math.min(d, hd / flat);
    }
    if (dir.y < -1e-5) d = Math.min(d, -origin.y / dir.y);
    if (dir.y > 1e-5) {
      const tc = (WALL_H - origin.y) / dir.y;
      if (tc < d && !this.isOpenSky(origin.x + dir.x * tc, origin.z + dir.z * tc)) d = tc;
    }
    return Math.max(0, d);
  }

  // ---------- A* path-finding for monsters ----------
  findPath(sx, sz, gx, gz, maxNodes = 4000) {
    const W = this.W;
    let [stx, sty] = this.tileOf(sx, sz);
    const [gtx, gty] = this.tileOf(gx, gz);
    if (!this.walkableForMonster(stx, sty)) {
      // find a walkable neighbor to start from
      let found = false;
      for (const [ox, oy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [-1, -1],
        [1, -1],
        [-1, 1],
      ])
        if (this.walkableForMonster(stx + ox, sty + oy)) {
          stx += ox;
          sty += oy;
          found = true;
          break;
        }
      if (!found) return null;
    }
    const goal = gty * W + gtx;
    const start = sty * W + stx;
    const goalOk = (x, y) => this.walkableForMonster(x, y) || y * W + x === goal;
    if (this.t(gtx, gty) === T.ROCK) return null;
    const g = new Map();
    const came = new Map();
    const closed = new Set();
    const heap = new MinHeap();
    g.set(start, 0);
    heap.push(start, 0);
    let n = 0;
    while (heap.size && n++ < maxNodes) {
      const cur = heap.pop();
      if (cur === goal) break;
      if (closed.has(cur)) continue;
      closed.add(cur);
      const cx = cur % W;
      const cy = (cur / W) | 0;
      const gc = g.get(cur);
      for (let oy = -1; oy <= 1; oy++)
        for (let ox = -1; ox <= 1; ox++) {
          if (!ox && !oy) continue;
          const nx = cx + ox;
          const ny = cy + oy;
          if (!goalOk(nx, ny)) continue;
          if (ox && oy && (!this.walkableForMonster(cx + ox, cy) || !this.walkableForMonster(cx, cy + oy))) continue;
          const ni = ny * W + nx;
          const ng = gc + (ox && oy ? 1.414 : 1);
          if (ng < (g.get(ni) ?? Infinity)) {
            g.set(ni, ng);
            came.set(ni, cur);
            const hx = Math.abs(nx - gtx);
            const hy = Math.abs(ny - gty);
            heap.push(ni, ng + Math.max(hx, hy) + 0.414 * Math.min(hx, hy));
          }
        }
    }
    if (!came.has(goal) && goal !== start) return null;
    const path = [];
    let c = goal;
    while (c !== undefined && c !== start) {
      path.push({ x: ((c % W) + 0.5) * TILE, z: (((c / W) | 0) + 0.5) * TILE });
      c = came.get(c);
    }
    path.reverse();
    if (path.length) {
      path[path.length - 1] = { x: gx, z: gz };
    } else path.push({ x: gx, z: gz });
    return path;
  }

  // Straight line is clear for a monster of radius r (samples tiles along the segment).
  clearLine(ax, az, bx, bz, r) {
    const len = Math.hypot(bx - ax, bz - az);
    const steps = Math.ceil(len / 0.5);
    for (let i = 0; i <= steps; i++) {
      const t = i / Math.max(1, steps);
      const x = ax + (bx - ax) * t;
      const z = az + (bz - az) * t;
      for (const [ox, oz] of [
        [r, 0],
        [-r, 0],
        [0, r],
        [0, -r],
      ]) {
        const [tx, ty] = this.tileOf(x + ox, z + oz);
        if (!this.walkableForMonster(tx, ty)) {
          // the destination tile may be a blocked prop tile (hiding spot approach)
          const [gx, gy] = this.tileOf(bx, bz);
          if (!(tx === gx && ty === gy && this.t(tx, ty) !== T.ROCK)) return false;
        }
      }
    }
    return true;
  }

  dispose() {
    this.group.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
    });
    for (const k in this.materials) {
      this.materials[k].map?.dispose();
      this.materials[k].dispose();
    }
    this.props.clear();
  }
}
