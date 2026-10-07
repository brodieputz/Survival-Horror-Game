// Procedural dungeon generation. Produces a pure-data description of a level:
// the tile grid, rooms, the safe room, and placements for every prop, trap,
// pickup and monster. Nothing here touches three.js.
import { RNG, MinHeap } from './util.js';
import { T, TILE } from './config.js';

const DIRS4 = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

export function levelSize(level) {
  return Math.min(32 + (level - 1) * 6, 104);
}

export function enemyCounts(level) {
  return {
    grunt: Math.min(2 + level, 12),
    hound: level >= 2 ? Math.min(1 + Math.floor((level - 2) / 2), 6) : 0,
    brute: level >= 3 ? Math.min(1 + Math.floor((level - 3) / 3), 4) : 0,
    angel: level >= 4 ? Math.min(1 + Math.floor((level - 4) / 2), 6) : 0,
  };
}

export function generateDungeon(level, seed) {
  const rng = new RNG(seed);
  const W = levelSize(level);
  const H = W;
  const tiles = new Uint8Array(W * H); // ROCK
  const roomOf = new Int16Array(W * H).fill(-1);
  const forbidden = new Uint8Array(W * H); // corridors may not carve here
  const idx = (x, y) => y * W + x;
  const inb = (x, y) => x >= 1 && y >= 1 && x < W - 1 && y < H - 1;

  // ---------- Safe room ----------
  const SR = 6;
  const safe = { x: rng.int(3, W - SR - 4), y: rng.int(3, H - SR - 4), w: SR, h: SR, id: 0, safe: true };
  safe.cx = safe.x + (SR - 1) / 2;
  safe.cy = safe.y + (SR - 1) / 2;
  for (let y = safe.y - 1; y <= safe.y + SR; y++)
    for (let x = safe.x - 1; x <= safe.x + SR; x++) forbidden[idx(x, y)] = 1;
  for (let y = safe.y; y < safe.y + SR; y++)
    for (let x = safe.x; x < safe.x + SR; x++) {
      tiles[idx(x, y)] = T.SAFE;
      roomOf[idx(x, y)] = 0;
    }
  const rooms = [safe];

  // ---------- Rooms ----------
  const target = Math.floor((W * H) / 100);
  for (let a = 0; a < 900 && rooms.length < target + 1; a++) {
    const w = rng.int(4, 9);
    const h = rng.int(4, 9);
    const x = rng.int(2, W - w - 2);
    const y = rng.int(2, H - h - 2);
    let ok = true;
    for (const r of rooms) {
      const m = r.safe ? 4 : 2;
      if (x < r.x + r.w + m && x + w + m > r.x && y < r.y + r.h + m && y + h + m > r.y) {
        ok = false;
        break;
      }
    }
    if (!ok) continue;
    const room = { x, y, w, h, id: rooms.length, cx: x + (w - 1) / 2, cy: y + (h - 1) / 2 };
    rooms.push(room);
    for (let yy = y; yy < y + h; yy++)
      for (let xx = x; xx < x + w; xx++) {
        tiles[idx(xx, yy)] = T.FLOOR;
        roomOf[idx(xx, yy)] = room.id;
      }
  }

  // ---------- Safe room door ----------
  let nearest = rooms[1];
  let nd = Infinity;
  for (let i = 1; i < rooms.length; i++) {
    const d = Math.hypot(rooms[i].cx - safe.cx, rooms[i].cy - safe.cy);
    if (d < nd) {
      nd = d;
      nearest = rooms[i];
    }
  }
  const dx = nearest.cx - safe.cx;
  const dy = nearest.cy - safe.cy;
  let doorDir;
  if (Math.abs(dx) > Math.abs(dy)) doorDir = dx > 0 ? [1, 0] : [-1, 0];
  else doorDir = dy > 0 ? [0, 1] : [0, -1];
  const mid = Math.floor(SR / 2);
  const door = {
    x: doorDir[0] === 1 ? safe.x + SR : doorDir[0] === -1 ? safe.x - 1 : safe.x + mid,
    y: doorDir[1] === 1 ? safe.y + SR : doorDir[1] === -1 ? safe.y - 1 : safe.y + mid,
    dir: doorDir,
  };
  tiles[idx(door.x, door.y)] = T.DOOR;
  const outside = { x: door.x + doorDir[0], y: door.y + doorDir[1] };
  tiles[idx(outside.x, outside.y)] = T.FLOOR;

  // ---------- Corridors (MST + loops), carved with A* through rock ----------
  const nodes = rooms.map((r) =>
    r.safe ? { x: outside.x, y: outside.y } : { x: Math.round(r.cx), y: Math.round(r.cy) }
  );
  const edges = [];
  const inTree = new Set([0]);
  const edgeSet = new Set();
  while (inTree.size < rooms.length) {
    let best = null;
    let bd = Infinity;
    for (const a of inTree)
      for (let b = 0; b < rooms.length; b++) {
        if (inTree.has(b)) continue;
        const d = Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y);
        if (d < bd) {
          bd = d;
          best = [a, b];
        }
      }
    inTree.add(best[1]);
    edges.push(best);
    edgeSet.add(best[0] + ',' + best[1]);
    edgeSet.add(best[1] + ',' + best[0]);
  }
  // Extra loops so monsters can be escaped around corners.
  for (let a = 1; a < rooms.length; a++) {
    if (!rng.chance(0.35)) continue;
    const others = [];
    for (let b = 1; b < rooms.length; b++)
      if (b !== a && !edgeSet.has(a + ',' + b))
        others.push([b, Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y)]);
    others.sort((p, q) => p[1] - q[1]);
    if (!others.length) continue;
    const b = others[rng.int(0, Math.min(2, others.length - 1))][0];
    edges.push([a, b]);
    edgeSet.add(a + ',' + b);
    edgeSet.add(b + ',' + a);
  }

  const noise = new Float32Array(W * H);
  for (let i = 0; i < noise.length; i++) noise[i] = rng.next() * 1.5;

  function carve(a, b) {
    const start = idx(a.x, a.y);
    const goal = idx(b.x, b.y);
    const g = new Float32Array(W * H).fill(Infinity);
    const came = new Int32Array(W * H).fill(-1);
    const heap = new MinHeap();
    g[start] = 0;
    heap.push(start, 0);
    while (heap.size) {
      const cur = heap.pop();
      if (cur === goal) break;
      const cx = cur % W;
      const cy = (cur / W) | 0;
      for (const [ddx, ddy] of DIRS4) {
        const nx = cx + ddx;
        const ny = cy + ddy;
        if (!inb(nx, ny)) continue;
        const ni = idx(nx, ny);
        if (forbidden[ni] && ni !== goal) continue;
        let cost = tiles[ni] === T.FLOOR ? 1 : 3.2 + noise[ni];
        // keep corridors from running straight along room walls too much
        if (came[cur] >= 0) {
          const pd = cur - came[cur];
          if (pd !== ni - cur) cost += 0.6; // turning cost -> straighter halls
        }
        const ng = g[cur] + cost;
        if (ng < g[ni]) {
          g[ni] = ng;
          came[ni] = cur;
          heap.push(ni, ng + (Math.abs(nx - b.x) + Math.abs(ny - b.y)));
        }
      }
    }
    let c = goal;
    let guard = 0;
    while (c !== -1 && c !== start && guard++ < W * H) {
      if (tiles[c] === T.ROCK) tiles[c] = T.FLOOR;
      c = came[c];
    }
  }
  for (const [a, b] of edges) carve(nodes[a], nodes[b]);

  // Occasionally widen a straight corridor tile for variety.
  for (let y = 2; y < H - 2; y++)
    for (let x = 2; x < W - 2; x++) {
      const i = idx(x, y);
      if (tiles[i] !== T.FLOOR || roomOf[i] >= 0 || !rng.chance(0.04)) continue;
      const nx = x + 1;
      if (!forbidden[idx(nx, y)] && tiles[idx(nx, y)] === T.ROCK && inb(nx + 1, y)) tiles[idx(nx, y)] = T.FLOOR;
    }

  // ---------- Safe room window ----------
  let windowT = null;
  const ringSides = [
    { dir: [-1, 0], tiles: () => range(safe.y + 1, safe.y + SR - 2).map((y) => [safe.x - 1, y]) },
    { dir: [1, 0], tiles: () => range(safe.y + 1, safe.y + SR - 2).map((y) => [safe.x + SR, y]) },
    { dir: [0, -1], tiles: () => range(safe.x + 1, safe.x + SR - 2).map((x) => [x, safe.y - 1]) },
    { dir: [0, 1], tiles: () => range(safe.x + 1, safe.x + SR - 2).map((x) => [x, safe.y + SR]) },
  ];
  const cands = [];
  for (const side of ringSides)
    for (const [x, y] of side.tiles()) {
      if (Math.abs(x - door.x) + Math.abs(y - door.y) <= 1) continue;
      const ox = x + side.dir[0];
      const oy = y + side.dir[1];
      if (inb(ox, oy) && tiles[idx(ox, oy)] === T.FLOOR) cands.push({ x, y, dir: side.dir });
    }
  if (cands.length) windowT = rng.pick(cands);
  else {
    // carve a short alcove outward from the side opposite the door
    for (const side of rng.shuffle(ringSides.slice())) {
      if (side.dir[0] === doorDir[0] && side.dir[1] === doorDir[1]) continue;
      const [x, y] = side.tiles()[1];
      let ox = x + side.dir[0];
      let oy = y + side.dir[1];
      const path = [];
      while (inb(ox, oy) && tiles[idx(ox, oy)] !== T.FLOOR) {
        path.push([ox, oy]);
        ox += side.dir[0];
        oy += side.dir[1];
      }
      if (!inb(ox, oy)) continue;
      for (const [px, py] of path) tiles[idx(px, py)] = T.FLOOR;
      windowT = { x, y, dir: side.dir };
      break;
    }
  }

  // ---------- Placement helpers ----------
  const blocked = new Uint8Array(W * H); // big props (path-blocking for monsters)
  const used = new Uint8Array(W * H); // any prop/pickup on this tile
  const isFloor = (x, y) => tiles[idx(x, y)] === T.FLOOR;
  const isRock = (x, y) => !inb(x, y) || tiles[idx(x, y)] === T.ROCK;
  const center = (x, y) => ({ x: (x + 0.5) * TILE, z: (y + 0.5) * TILE });

  // Distance from the safe-room door (BFS over floor) for spacing hazards.
  const doorDist = new Int32Array(W * H).fill(-1);
  {
    const q = [idx(outside.x, outside.y)];
    doorDist[q[0]] = 0;
    for (let h = 0; h < q.length; h++) {
      const c = q[h];
      const cx = c % W;
      const cy = (c / W) | 0;
      for (const [ddx, ddy] of DIRS4) {
        const ni = idx(cx + ddx, cy + ddy);
        if (doorDist[ni] < 0 && (tiles[ni] === T.FLOOR || tiles[ni] === T.PIT)) {
          doorDist[ni] = doorDist[c] + 1;
          q.push(ni);
        }
      }
    }
  }
  const totalWalk = () => {
    let n = 0;
    for (let i = 0; i < tiles.length; i++) if (tiles[i] === T.FLOOR && !blocked[i]) n++;
    return n;
  };
  function connected() {
    const seen = new Uint8Array(W * H);
    const q = [idx(outside.x, outside.y)];
    seen[q[0]] = 1;
    let n = 0;
    for (let h = 0; h < q.length; h++) {
      const c = q[h];
      n++;
      const cx = c % W;
      const cy = (c / W) | 0;
      for (const [ddx, ddy] of DIRS4) {
        const ni = idx(cx + ddx, cy + ddy);
        if (!seen[ni] && tiles[ni] === T.FLOOR && !blocked[ni]) {
          seen[ni] = 1;
          q.push(ni);
        }
      }
    }
    return n === totalWalk();
  }
  // Is this room tile next to a corridor opening? (don't block doorways)
  function nearOpening(x, y, room) {
    for (let oy = -1; oy <= 1; oy++)
      for (let ox = -1; ox <= 1; ox++) {
        const nx = x + ox;
        const ny = y + oy;
        if (!inb(nx, ny)) continue;
        const ni = idx(nx, ny);
        if (tiles[ni] === T.FLOOR && roomOf[ni] !== room.id) return true;
      }
    return false;
  }
  function wallDirs(x, y) {
    return DIRS4.filter(([ddx, ddy]) => isRock(x + ddx, y + ddy) && !(windowT && x + ddx === windowT.x && y + ddy === windowT.y));
  }
  function roomTiles(room) {
    const out = [];
    for (let y = room.y; y < room.y + room.h; y++)
      for (let x = room.x; x < room.x + room.w; x++) if (tiles[idx(x, y)] === T.FLOOR) out.push([x, y]);
    return out;
  }
  const normalRooms = rooms.filter((r) => !r.safe);

  // Try to place a blocking prop on a wall tile in a room.
  function placeWallProp(room, kind, depth) {
    const tl = rng.shuffle(roomTiles(room));
    for (const [x, y] of tl) {
      const i = idx(x, y);
      if (used[i] || nearOpening(x, y, room)) continue;
      const wd = wallDirs(x, y);
      if (!wd.length) continue;
      const [wx, wy] = rng.pick(wd);
      blocked[i] = 1;
      if (!connected()) {
        blocked[i] = 0;
        continue;
      }
      used[i] = 1;
      const c = center(x, y);
      const off = TILE / 2 - depth / 2 - 0.05;
      return {
        kind,
        tx: x,
        ty: y,
        x: c.x + wx * off,
        z: c.z + wy * off,
        // facing = direction away from the wall
        fx: -wx,
        fz: -wy,
        angle: Math.atan2(-wx, -wy),
      };
    }
    return null;
  }

  const out = {
    level,
    seed,
    W,
    H,
    tiles,
    roomOf,
    rooms,
    safe,
    door,
    outside,
    window: windowT,
    blocked,
    hiding: [],
    crates: [],
    gold: [],
    diamonds: [],
    ammo: [],
    pits: [],
    bearTraps: [],
    tripwires: [],
    glass: [],
    torches: [],
    decor: [],
    enemies: [],
  };

  // ---------- Spike pits (before props so props avoid them) ----------
  const pitChance = Math.min(0.12 + level * 0.03, 0.45);
  for (const room of normalRooms) {
    if (room.w < 5 || room.h < 5 || !rng.chance(pitChance)) continue;
    const n = rng.int(1, room.w * room.h > 40 ? 3 : 1);
    for (let k = 0; k < n; k++) {
      const x = rng.int(room.x + 1, room.x + room.w - 2);
      const y = rng.int(room.y + 1, room.y + room.h - 2);
      let clear = true;
      for (let oy = -1; oy <= 1; oy++)
        for (let ox = -1; ox <= 1; ox++) if (tiles[idx(x + ox, y + oy)] === T.PIT) clear = false;
      if (!clear || nearOpening(x, y, room)) continue;
      tiles[idx(x, y)] = T.PIT;
      if (!connected()) {
        tiles[idx(x, y)] = T.FLOOR;
        continue;
      }
      used[idx(x, y)] = 1;
      out.pits.push({ tx: x, ty: y });
    }
  }

  // ---------- Hiding spots ----------
  const hideKinds = ['locker', 'closet', 'bed', 'bench'];
  const depthOf = { locker: 0.65, closet: 0.75, bed: 1.15, bench: 0.6 };
  for (const room of normalRooms) {
    const n = room.w * room.h >= 36 ? rng.int(1, 3) : rng.int(0, 2);
    for (let k = 0; k < n; k++) {
      const kind = rng.pick(hideKinds);
      const p = placeWallProp(room, kind, depthOf[kind]);
      if (p) out.hiding.push(p);
    }
  }

  // ---------- Crates ----------
  const crateCount = 5 + Math.floor(level * 1.6);
  for (let k = 0; k < crateCount; k++) {
    const room = rng.pick(normalRooms);
    const p = placeWallProp(room, 'crate', 1.0);
    if (!p) continue;
    p.locked = k === 0 || rng.chance(0.25);
    p.angle += rng.range(-0.3, 0.3);
    out.crates.push(p);
  }

  // ---------- Free floor tile picker ----------
  const allFloor = [];
  for (let y = 1; y < H - 1; y++)
    for (let x = 1; x < W - 1; x++) if (tiles[idx(x, y)] === T.FLOOR) allFloor.push([x, y]);
  const roomFloor = allFloor.filter(([x, y]) => roomOf[idx(x, y)] > 0);
  const corridorFloor = allFloor.filter(([x, y]) => roomOf[idx(x, y)] < 0);
  function freeTile(list, minDoor = 0, mark = true) {
    for (let a = 0; a < 60; a++) {
      const [x, y] = rng.pick(list);
      const i = idx(x, y);
      if (used[i] || blocked[i] || doorDist[i] < minDoor) continue;
      if (mark) used[i] = 1;
      return [x, y];
    }
    return null;
  }

  // ---------- Diamonds ----------
  const far = normalRooms
    .map((r) => ({ r, d: doorDist[idx(Math.round(r.cx), Math.round(r.cy))] }))
    .sort((a, b) => b.d - a.d);
  const pool = far.slice(0, Math.max(level, Math.ceil(far.length * 0.6)));
  rng.shuffle(pool);
  for (let k = 0; k < level; k++) {
    const room = pool[k % pool.length].r;
    const tl = rng.shuffle(roomTiles(room));
    let placed = false;
    for (const [x, y] of tl) {
      const i = idx(x, y);
      if (used[i] || blocked[i]) continue;
      used[i] = 1;
      const c = center(x, y);
      out.diamonds.push({ x: c.x, z: c.z });
      placed = true;
      break;
    }
    if (!placed) {
      const t = freeTile(allFloor, 8);
      if (t) out.diamonds.push(center(t[0], t[1]));
    }
  }

  // ---------- Gold ----------
  const goldCount = 16 + level * 5;
  for (let k = 0; k < goldCount; k++) {
    const t = freeTile(rng.chance(0.72) ? roomFloor : corridorFloor, 2);
    if (!t) continue;
    const c = center(t[0], t[1]);
    out.gold.push({
      x: c.x + rng.range(-0.9, 0.9),
      z: c.z + rng.range(-0.9, 0.9),
      value: rng.int(8, 18) + level * 2,
    });
  }

  // ---------- Ammo ----------
  const ammoCount = 2 + Math.floor(level / 2);
  for (let k = 0; k < ammoCount; k++) {
    const t = freeTile(roomFloor, 4);
    if (!t) continue;
    const c = center(t[0], t[1]);
    out.ammo.push({ x: c.x + rng.range(-0.7, 0.7), z: c.z + rng.range(-0.7, 0.7) });
  }

  // ---------- Traps ----------
  const bearCount = 1 + Math.floor(level * 0.8);
  for (let k = 0; k < bearCount; k++) {
    const t = freeTile(allFloor, 5);
    if (!t) continue;
    const c = center(t[0], t[1]);
    out.bearTraps.push({ x: c.x + rng.range(-0.6, 0.6), z: c.z + rng.range(-0.6, 0.6) });
  }
  const wireCands = corridorFloor.filter(([x, y]) => {
    const h = isFloor(x - 1, y) && isFloor(x + 1, y) && isRock(x, y - 1) && isRock(x, y + 1);
    const v = isFloor(x, y - 1) && isFloor(x, y + 1) && isRock(x - 1, y) && isRock(x + 1, y);
    return (h || v) && doorDist[idx(x, y)] > 5;
  });
  const wireCount = Math.min(Math.floor(level * 0.7) + 1, wireCands.length);
  rng.shuffle(wireCands);
  for (let k = 0, placed = 0; k < wireCands.length && placed < wireCount; k++) {
    const [x, y] = wireCands[k];
    const i = idx(x, y);
    if (used[i]) continue;
    used[i] = 1;
    placed++;
    const c = center(x, y);
    // axis: the direction the corridor runs (the wire spans across it)
    const alongX = isFloor(x - 1, y) && isFloor(x + 1, y);
    out.tripwires.push({ tx: x, ty: y, x: c.x, z: c.z, alongX });
  }
  const glassCount = 2 + level;
  for (let k = 0; k < glassCount; k++) {
    const t = freeTile(allFloor, 3);
    if (!t) continue;
    out.glass.push({ tx: t[0], ty: t[1] });
  }

  // ---------- Torches ----------
  for (const room of normalRooms) {
    if (!rng.chance(0.55)) continue;
    const tl = rng.shuffle(roomTiles(room));
    for (const [x, y] of tl) {
      const wd = wallDirs(x, y);
      if (!wd.length) continue;
      const [wx, wy] = rng.pick(wd);
      const c = center(x, y);
      out.torches.push({ x: c.x + wx * (TILE / 2 - 0.12), z: c.z + wy * (TILE / 2 - 0.12), fx: -wx, fz: -wy });
      break;
    }
  }

  // ---------- Decor (blood, bones, chains) ----------
  const decorCount = 25 + level * 6;
  for (let k = 0; k < decorCount; k++) {
    const [x, y] = rng.pick(allFloor);
    const c = center(x, y);
    out.decor.push({
      kind: rng.pick(['blood', 'blood', 'bones', 'skull', 'blood', 'chain']),
      x: c.x + rng.range(-1, 1),
      z: c.z + rng.range(-1, 1),
      rot: rng.range(0, Math.PI * 2),
      s: rng.range(0.7, 1.4),
      tx: x,
      ty: y,
    });
  }

  // ---------- Monsters ----------
  const counts = enemyCounts(level);
  const spawnTiles = rng.shuffle(
    allFloor.filter(([x, y]) => doorDist[idx(x, y)] > 14 && !blocked[idx(x, y)] && roomOf[idx(x, y)] > 0)
  );
  const fallback = rng.shuffle(allFloor.filter(([x, y]) => doorDist[idx(x, y)] > 8 && !blocked[idx(x, y)]));
  const spawnList = spawnTiles.length > 6 ? spawnTiles : fallback;
  let si = 0;
  const taken = [];
  for (const type of ['grunt', 'hound', 'brute', 'angel'])
    for (let k = 0; k < counts[type]; k++) {
      let chosen = null;
      for (let a = 0; a < spawnList.length; a++) {
        const t = spawnList[(si + a) % spawnList.length];
        if (taken.every(([x, y]) => Math.abs(x - t[0]) + Math.abs(y - t[1]) > 5)) {
          chosen = t;
          si += a + 1;
          break;
        }
      }
      if (!chosen) chosen = spawnList[si++ % spawnList.length];
      taken.push(chosen);
      const c = center(chosen[0], chosen[1]);
      out.enemies.push({ type, x: c.x, z: c.z });
    }

  // Safe room layout (world coords)
  const sc = center(safe.x, safe.y);
  out.safeWorld = {
    x0: safe.x * TILE,
    z0: safe.y * TILE,
    x1: (safe.x + SR) * TILE,
    z1: (safe.y + SR) * TILE,
    cx: (safe.x + SR / 2) * TILE,
    cz: (safe.y + SR / 2) * TILE,
  };
  out.spawn = { x: out.safeWorld.cx, z: out.safeWorld.cz, yaw: Math.atan2(-door.dir[0], -door.dir[1]) };
  void sc;
  return out;
}

function range(a, b) {
  const r = [];
  for (let i = a; i <= b; i++) r.push(i);
  return r;
}
