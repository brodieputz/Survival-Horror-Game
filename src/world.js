// Turns the dungeon grid into renderable geometry, and answers spatial
// queries: collision, line of sight, raycasts and A* path-finding.
import * as THREE from 'three';
import { TILE, WALL_H, PIT_DEPTH, T, EDGE, DOOR_W, DOOR_H } from './config.js';
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

// A thin interior wall on the edge of tile (tx,ty) toward (fx,fz), seen from
// inside the tile, set back half the wall's thickness. Doorways leave a gap
// with jambs, a lintel and a painted frame.
const HALF = 0.1;
function thinWall(batch, trim, tx, ty, fx, fz, door) {
  const cx = (tx + 0.5) * TILE + (fx * TILE) / 2 - fx * HALF;
  const cz = (ty + 0.5) * TILE + (fz * TILE) / 2 - fz * HALF;
  const rx = -fz;
  const rz = fx;
  const n = [-fx, 0, -fz];
  const seg = (s0, s1, y0, y1, b = batch) => {
    const A = [cx + rx * s0, y0, cz + rz * s0];
    const B = [cx + rx * s1, y0, cz + rz * s1];
    const C = [cx + rx * s1, y1, cz + rz * s1];
    const D = [cx + rx * s0, y1, cz + rz * s0];
    b.quad(A, B, C, D, n, (s0 + TILE / 2) / TILE, y0 / TILE, (s1 + TILE / 2) / TILE, y1 / TILE);
  };
  const h = TILE / 2;
  if (!door) return seg(-h, h, 0, WALL_H);
  const g = DOOR_W / 2;
  seg(-h, -g, 0, WALL_H);
  seg(g, h, 0, WALL_H);
  seg(-g, g, DOOR_H, WALL_H);
  // the opening's reveals (jamb sides and the lintel's underside)
  for (const s of [-g, g]) {
    const sx = cx + rx * s;
    const sz = cz + rz * s;
    const nn = [rx * -Math.sign(s), 0, rz * -Math.sign(s)];
    trim.quad([sx, 0, sz], [sx + fx * HALF, 0, sz + fz * HALF], [sx + fx * HALF, DOOR_H, sz + fz * HALF], [sx, DOOR_H, sz], nn, 0, 0, 0.1, 1);
  }
  const a = [cx - rx * g, DOOR_H, cz - rz * g];
  const b = [cx + rx * g, DOOR_H, cz + rz * g];
  trim.quad(a, b, [b[0] + fx * HALF, DOOR_H, b[2] + fz * HALF], [a[0] + fx * HALF, DOOR_H, a[2] + fz * HALF], [0, -1, 0], 0, 0, 1, 0.1);
  // a painted frame around the opening
  const f = 0.09;
  const fo = 0.012;
  const fcx = cx - fx * fo;
  const fcz = cz - fz * fo;
  const fq = (s0, s1, y0, y1) => {
    trim.quad([fcx + rx * s0, y0, fcz + rz * s0], [fcx + rx * s1, y0, fcz + rz * s1], [fcx + rx * s1, y1, fcz + rz * s1], [fcx + rx * s0, y1, fcz + rz * s0], n, 0, 0, 0.2, 1);
  };
  fq(-g - f, -g, 0, DOOR_H + f);
  fq(g, g + f, 0, DOOR_H + f);
  fq(-g, g, DOOR_H, DOOR_H + f);
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
    // thin interior walls on tile edges: edgeE[i] sits between tile i and
    // its east neighbour, edgeS[i] between tile i and its south neighbour
    this.edgeE = d.edgeE || null;
    this.edgeS = d.edgeS || null;
    this.outdoor = !!opts.outdoor;
    // smart: path-finding steers around furniture (inside buildings)
    this.smart = !!opts.smart;
    this.nav = null; // fine navigation grid, built on first use
    this.group = new THREE.Group();
    this.props = new Map(); // tile index -> array of AABB colliders
    this.materials = {};
    if (opts.render !== false) this.buildGeometry();
    if (this.edgeE) this.buildEdgeColliders();
  }

  // The edge code between tile (x, y) and its neighbour (x+dx, y+dy).
  edge(x, y, dx, dy) {
    if (!this.edgeE) return EDGE.NONE;
    const W = this.W;
    if (dx > 0) return this.edgeE[y * W + x];
    if (dx < 0) return x > 0 ? this.edgeE[y * W + x - 1] : EDGE.NONE;
    if (dy > 0) return this.edgeS[y * W + x];
    if (dy < 0) return y > 0 ? this.edgeS[(y - 1) * W + x] : EDGE.NONE;
    return EDGE.NONE;
  }
  // Can something walk straight from tile (x, y) into its neighbour?
  passable(x, y, dx, dy) {
    const e = this.edge(x, y, dx, dy);
    return e === EDGE.NONE || e === EDGE.DOOR;
  }

  // Thin walls and the jambs either side of every doorway are solid.
  buildEdgeColliders() {
    const W = this.W;
    const h = 0.12;
    const j = (TILE - DOOR_W) / 2;
    const add = (vertical, x, y, code) => {
      if (code === EDGE.NONE) return;
      if (vertical) {
        // the edge at x = (x+1)*TILE, from z = y*TILE to (y+1)*TILE
        const ex = (x + 1) * TILE;
        const z0 = y * TILE;
        if (code === EDGE.DOOR || code === EDGE.GATE) {
          this.addCollider(ex - h, z0, ex + h, z0 + j);
          this.addCollider(ex - h, z0 + TILE - j, ex + h, z0 + TILE);
        } else this.addCollider(ex - h, z0, ex + h, z0 + TILE);
      } else {
        const ez = (y + 1) * TILE;
        const x0 = x * TILE;
        if (code === EDGE.DOOR || code === EDGE.GATE) {
          this.addCollider(x0, ez - h, x0 + j, ez + h);
          this.addCollider(x0 + TILE - j, ez - h, x0 + TILE, ez + h);
        } else this.addCollider(x0, ez - h, x0 + TILE, ez + h);
      }
    };
    for (let y = 0; y < this.H; y++)
      for (let x = 0; x < W; x++) {
        add(true, x, y, this.edgeE[y * W + x]);
        add(false, x, y, this.edgeS[y * W + x]);
      }
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
    const tx = Math.floor(x / TILE);
    const ty = Math.floor(z / TILE);
    return this.t(tx, ty) === T.YARD || !!this.d.sky?.has(ty * this.W + tx);
  }
  walkableForMonster(x, y) {
    const t = this.t(x, y);
    return (t === T.FLOOR || t === T.YARD) && !this.d.blocked[y * this.W + x];
  }
  // A monster can step from (x, y) by (ox, oy), diagonals included.
  stepOk(x, y, ox, oy) {
    if (!this.edgeE) return true;
    if (!ox || !oy) return this.passable(x, y, ox, oy);
    // a diagonal needs both of the L-shaped routes around the corner open
    return this.passable(x, y, ox, 0) && this.passable(x + ox, y, 0, oy) && this.passable(x, y, 0, oy) && this.passable(x, y + oy, ox, 0);
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
      trim: new QuadBatch(),
    };
    // rooms can have their own wall and floor finishes ("name:seed" keys)
    const styled = {};
    const batchFor = (key) => {
      if (!batches[key]) {
        batches[key] = new QuadBatch();
        styled[key] = true;
      }
      return batches[key];
    };
    const style = (room) => (d.roomStyle && room >= 0 ? d.roomStyle[room] : null);
    // rock outside the building's outline is open ground (lawns, verges)
    const sh = d.shell;
    const inShell = (x, y) => sh && x >= sh.x0 && x <= sh.x1 && y >= sh.y0 && y <= sh.y1;
    const isOpen = (x, y) => this.t(x, y) !== T.ROCK;
    for (let y = 0; y < this.H; y++)
      for (let x = 0; x < this.W; x++) {
        const t = this.t(x, y);
        if (t === T.ROCK) {
          if (sh && !inShell(x, y) && !d.upper) {
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
        const st = style(room);
        const fb = yard ? batches.yard : t === T.PIT ? batches.pit : st?.floor ? batchFor(st.floor) : batches.floor;
        fb.quad([x0, fy, z0], [x0, fy, z1], [x1, fy, z1], [x1, fy, z0], [0, 1, 0]);
        if (!yard && !d.sky?.has(y * this.W + x)) batches.ceil.quad([x0, WALL_H, z0], [x1, WALL_H, z0], [x1, WALL_H, z1], [x0, WALL_H, z1], [0, -1, 0]);
        if (yard) continue; // the lot is open: fences and the facade are props
        const wb = st?.wall ? batchFor(st.wall) : room > 0 && room % 3 === 0 ? batches.wall2 : batches.wall;
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
        // thin walls and doorways on this tile's edges, faced from this side
        if (this.edgeE)
          for (const [fx, fz] of [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ]) {
            const e = this.edge(x, y, fx, fz);
            if (e === EDGE.NONE || this.t(x + fx, y + fz) === T.ROCK) continue;
            thinWall(wb, batches.trim, x, y, fx, fz, e !== EDGE.WALL);
          }
      }

    const mk = (texture, color = 0xffffff, rough = 0.9) => {
      const t2 = texture.clone();
      t2.needsUpdate = true;
      return new THREE.MeshStandardMaterial({ map: t2, color, roughness: rough, metalness: 0, shadowSide: THREE.DoubleSide });
    };
    const mats = {
      trim: mk(tex('wood', 5), 0x6a4a30, 0.7),
      wall: mk(tex(theme.wall || 'brick', 1)),
      wall2: mk(tex(theme.wall2 || 'stoneBlocks', 2)),
      floor: mk(tex(theme.floor || 'floor', 3)),
      ceil: mk(tex(theme.ceil || 'ceiling', 4)),
      yard: macroVary(mk(tex(theme.yard || 'asphalt', 30)), 0.8),
      outside: macroVary(mk(tex(theme.outside || 'grass', 31))),
      pit: mk(tex('stoneBlocks', 2), 0x664444),
    };
    for (const key in styled) {
      const [name, seed] = key.split(':');
      mats[key] = mk(tex(name, seed === undefined ? undefined : +seed));
    }
    this.materials = mats;
    for (const k in batches) {
      if (!batches[k].pos.length) continue;
      const mesh = new THREE.Mesh(batches[k].build(), mats[k]);
      mesh.receiveShadow = true;
      // walls and ceilings keep the sun out of the interior
      mesh.castShadow = k !== 'floor' && k !== 'yard' && k !== 'outside' && k !== 'pit' && !k.startsWith('floor');
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
    this.nav = null;
    return box;
  }
  removeCollider(box) {
    for (const arr of this.props.values()) {
      const i = arr.indexOf(box);
      if (i >= 0) arr.splice(i, 1);
    }
    this.nav = null;
  }

  // ---------- Fine navigation grid (buildings) ----------
  // Half-metre cells (as the generator lays rooms out). A cell is solid if it's rock, a pit or the
  // stairwell, or if any collider (grown by a body's radius) covers its
  // centre; crossing between cells respects thin walls and doorway jambs.
  buildNav() {
    const K = 6;
    const C = TILE / K;
    const GW = this.W * K;
    const GH = this.H * K;
    const occ = new Uint8Array(GW * GH);
    const skip = this.d.skipFloor;
    const st = this.d.stairs;
    const R = 0.3;
    for (let cy = 0; cy < GH; cy++)
      for (let cx = 0; cx < GW; cx++) {
        const tx = (cx / K) | 0;
        const ty = (cy / K) | 0;
        const t = this.t(tx, ty);
        const ti = ty * this.W + tx;
        if (t === T.ROCK || t === T.PIT || (skip && skip.has(ti) && !(st && st.landing.x === tx && st.landing.y === ty))) {
          occ[cy * GW + cx] = 1;
          continue;
        }
        const px = (cx + 0.5) * C;
        const pz = (cy + 0.5) * C;
        const list = this.props.get(ti);
        if (list)
          for (const b of list)
            if (px > b.minX - R && px < b.maxX + R && pz > b.minZ - R && pz < b.maxZ + R) {
              occ[cy * GW + cx] = 1;
              break;
            }
        // colliders from the neighbouring tiles reach in too
        if (!occ[cy * GW + cx] && (cx % K === 0 || cx % K === K - 1 || cy % K === 0 || cy % K === K - 1))
          for (let oy = -1; oy <= 1 && !occ[cy * GW + cx]; oy++)
            for (let ox = -1; ox <= 1; ox++) {
              if (!ox && !oy) continue;
              const l2 = this.props.get((ty + oy) * this.W + tx + ox);
              if (l2 && l2.some((b) => px > b.minX - R && px < b.maxX + R && pz > b.minZ - R && pz < b.maxZ + R)) {
                occ[cy * GW + cx] = 1;
                break;
              }
            }
      }
    const half = DOOR_W / 2 - 0.3;
    // can you step from cell c across to its neighbour (dx, dy)?
    const cross = (cx, cy, dx, dy) => {
      const tx = (cx / K) | 0;
      const ty = (cy / K) | 0;
      const ux = ((cx + dx) / K) | 0;
      const uy = ((cy + dy) / K) | 0;
      if (tx === ux && ty === uy) return true;
      const e = this.edge(tx, ty, ux - tx, uy - ty);
      if (e === EDGE.NONE) return true;
      if (e !== EDGE.DOOR) return false;
      const along = ux !== tx ? (cy + 0.5) * C - (ty + 0.5) * TILE : (cx + 0.5) * C - (tx + 0.5) * TILE;
      return Math.abs(along) < half;
    };
    const passE = new Uint8Array(GW * GH);
    const passS = new Uint8Array(GW * GH);
    for (let cy = 0; cy < GH; cy++)
      for (let cx = 0; cx < GW; cx++) {
        if (cx + 1 < GW && cross(cx, cy, 1, 0)) passE[cy * GW + cx] = 1;
        if (cy + 1 < GH && cross(cx, cy, 0, 1)) passS[cy * GW + cx] = 1;
      }
    this.nav = { K, C, GW, GH, occ, passE, passS };
    return this.nav;
  }

  navFree(cx, cy) {
    const n = this.nav;
    return cx >= 0 && cy >= 0 && cx < n.GW && cy < n.GH && !n.occ[cy * n.GW + cx];
  }
  navStep(cx, cy, dx, dy) {
    const n = this.nav;
    const GW = n.GW;
    const o = (x, y, ddx, ddy) => (ddx > 0 ? n.passE[y * GW + x] : ddx < 0 ? n.passE[y * GW + x - 1] : ddy > 0 ? n.passS[y * GW + x] : n.passS[(y - 1) * GW + x]);
    if (!dx || !dy) return !!o(cx, cy, dx, dy);
    return !!(o(cx, cy, dx, 0) && o(cx + dx, cy, 0, dy) && o(cx, cy, 0, dy) && o(cx, cy + dy, dx, 0) && this.navFree(cx + dx, cy) && this.navFree(cx, cy + dy));
  }

  // A* over the fine grid. Returns world-space waypoints or null.
  findPathFine(sx, sz, gx, gz, maxNodes = 24000) {
    const n = this.nav || this.buildNav();
    const { C, GW } = n;
    let scx = Math.floor(sx / C);
    let scy = Math.floor(sz / C);
    const gcx = Math.floor(gx / C);
    const gcy = Math.floor(gz / C);
    if (!this.navFree(scx, scy)) {
      // step off whatever we're brushing against
      let best = null;
      let bd = Infinity;
      for (let oy = -2; oy <= 2; oy++)
        for (let ox = -2; ox <= 2; ox++) {
          if (!this.navFree(scx + ox, scy + oy)) continue;
          const d = ox * ox + oy * oy;
          if (d < bd) {
            bd = d;
            best = [scx + ox, scy + oy];
          }
        }
      if (!best) return null;
      [scx, scy] = best;
    }
    const start = scy * GW + scx;
    const goal = gcy * GW + gcx;
    const g = new Map();
    const came = new Map();
    const closed = new Set();
    const heap = new MinHeap();
    g.set(start, 0);
    heap.push(start, 0);
    let count = 0;
    let found = false;
    while (heap.size && count++ < maxNodes) {
      const cur = heap.pop();
      if (cur === goal) {
        found = true;
        break;
      }
      if (closed.has(cur)) continue;
      closed.add(cur);
      const cx = cur % GW;
      const cy = (cur - cx) / GW;
      const gc = g.get(cur);
      for (let oy = -1; oy <= 1; oy++)
        for (let ox = -1; ox <= 1; ox++) {
          if (!ox && !oy) continue;
          const nx = cx + ox;
          const ny = cy + oy;
          const ni = ny * GW + nx;
          if (ni !== goal && !this.navFree(nx, ny)) continue;
          if (nx < 0 || ny < 0 || nx >= GW || ny >= n.GH) continue;
          if (!this.navStep(cx, cy, ox, oy)) continue;
          const ng = gc + (ox && oy ? 1.414 : 1);
          if (ng < (g.get(ni) ?? Infinity)) {
            g.set(ni, ng);
            came.set(ni, cur);
            const hx = Math.abs(nx - gcx);
            const hy = Math.abs(ny - gcy);
            heap.push(ni, ng + Math.max(hx, hy) + 0.414 * Math.min(hx, hy));
          }
        }
    }
    if (!found && goal !== start) return null;
    const cells = [];
    let c = goal;
    while (c !== undefined && c !== start) {
      cells.push(c);
      c = came.get(c);
    }
    cells.reverse();
    // keep only the turns
    const path = [];
    for (let i = 0; i < cells.length; i++) {
      const a = cells[i];
      const prev = i > 0 ? cells[i - 1] : start;
      const next = cells[i + 1];
      if (next !== undefined && a - prev === next - a) continue;
      path.push({ x: ((a % GW) + 0.5) * C, z: (((a / GW) | 0) + 0.5) * C });
    }
    if (path.length) path[path.length - 1] = { x: gx, z: gz };
    else path.push({ x: gx, z: gz });
    return path;
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
  rayDist(ax, az, bx, bz, margin = 0) {
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
    const edges = !!this.edgeE;
    const half = DOOR_W / 2 - margin;
    for (let i = 0; i < 256; i++) {
      if (this.t(x, y) === T.ROCK) return t;
      if (tMaxX < tMaxY) {
        t = tMaxX;
        if (t > len) return len;
        if (edges) {
          const e = this.edge(x, y, stepX, 0);
          if (e === EDGE.WALL || e === EDGE.GATE) return t;
          if (e === EDGE.DOOR && Math.abs(az + uz * t - (y + 0.5) * TILE) > half) return t;
        }
        tMaxX += tDeltaX;
        x += stepX;
      } else {
        t = tMaxY;
        if (t > len) return len;
        if (edges) {
          const e = this.edge(x, y, 0, stepY);
          if (e === EDGE.WALL || e === EDGE.GATE) return t;
          if (e === EDGE.DOOR && Math.abs(ax + ux * t - (x + 0.5) * TILE) > half) return t;
        }
        tMaxY += tDeltaY;
        y += stepY;
      }
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
    if (this.smart) return this.findPathFine(sx, sz, gx, gz, maxNodes * 6);
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
          if (!this.stepOk(cx, cy, ox, oy)) continue;
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
    if (this.edgeE && this.rayDist(ax, az, bx, bz, r) < len - 1e-3) return false;
    if (this.smart) {
      // and no furniture in the way (the goal itself may be beside some)
      const n = this.nav || this.buildNav();
      const steps = Math.ceil(len / 0.3);
      const gcx = Math.floor(bx / n.C);
      const gcy = Math.floor(bz / n.C);
      for (let i = 1; i < steps; i++) {
        const t = i / steps;
        const cx = Math.floor((ax + (bx - ax) * t) / n.C);
        const cy = Math.floor((az + (bz - az) * t) / n.C);
        if (Math.abs(cx - gcx) + Math.abs(cy - gcy) <= 1) break;
        if (!this.navFree(cx, cy)) return false;
      }
    }
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
