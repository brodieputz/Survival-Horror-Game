// Procedural building interiors. Produces a pure-data description of one
// location: the tile grid (rooms + corridors), an open-air street-front lot where
// the player arrives and leaves, and placements for loot containers,
// survivors, hiding spots, hazards and zombies. Nothing here touches three.js.
import { RNG, MinHeap } from './util.js';
import { T, TILE } from './config.js';
import { LOCATION_TYPES, BIOMES } from './run.js';
import { CONTAINER_DEPTH } from './props.js';

const DIRS4 = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

const CONTAINER_KINDS = {
  gas: ['shelf', 'crate', 'fridge', 'toolbox', 'cabinet'],
  home: ['cabinet', 'fridge', 'desk', 'footlocker', 'crate'],
  apartment: ['cabinet', 'fridge', 'desk', 'footlocker'],
  office: ['desk', 'cabinet', 'desk', 'shelf'],
  warehouse: ['crate', 'shelf', 'toolbox', 'crate'],
  police: ['gunlocker', 'cabinet', 'desk', 'footlocker'],
  hospital: ['medcab', 'cabinet', 'medcab', 'desk'],
  military: ['footlocker', 'gunlocker', 'crate', 'toolbox'],
  skyscraper: ['desk', 'cabinet', 'desk', 'shelf', 'fridge'],
};

function pickWeighted(rng, w) {
  let total = 0;
  for (const k in w) total += Math.max(0, w[k]);
  let x = rng.next() * total;
  for (const k in w) {
    x -= Math.max(0, w[k]);
    if (x <= 0) return k;
  }
  return 'walker';
}

export function enemyRoster(loc, rng, roomCount) {
  const d = loc.difficulty;
  const count = Math.round(2 + d * 2.2 + roomCount * 0.3);
  const lawful = loc.type === 'police' || loc.type === 'military';
  const w = {
    walker: 3,
    grunt: 2,
    runner: d >= 2 ? 0.8 + 0.3 * d : 0,
    hound: d >= 2 ? 0.5 + 0.2 * d : 0,
    fat: d >= 3 ? 0.7 : 0,
    armored: lawful ? (d >= 3 ? 1.6 : 0.6) : d >= 4 ? 0.4 : 0,
    rotter: d >= 4 ? 0.6 : 0,
  };
  const out = [];
  for (let i = 0; i < count; i++) out.push(pickWeighted(rng, w));
  const brutes = d >= 3 ? Math.min(3, 1 + Math.floor((d - 3) / 2)) : 0;
  for (let i = 0; i < brutes; i++) out.push('brute');
  return out;
}

export function generateBuilding(loc, biome) {
  const L = LOCATION_TYPES[loc.type];
  const rng = new RNG(loc.seed);
  const W = Math.min(L.size + loc.difficulty * 2, 56);
  const H = W;
  const tiles = new Uint8Array(W * H); // ROCK
  const roomOf = new Int16Array(W * H).fill(-1);
  const forbidden = new Uint8Array(W * H); // corridors may not carve here
  const idx = (x, y) => y * W + x;
  const inb = (x, y) => x >= 1 && y >= 1 && x < W - 1 && y < H - 1;

  // ---------- Street-front lot (open air) along the south edge ----------
  // The building's front wall runs straight along the north side of the lot;
  // the street lies beyond the last row.
  const YW = Math.min(L.lot[0], W - 4);
  const YH = L.lot[1];
  const lotTop = H - 1 - YH;
  const doorX = rng.int(Math.floor(W * 0.32), Math.ceil(W * 0.68) - 1);
  const lotX0 = Math.max(1, Math.min(W - 1 - YW, doorX - Math.floor(YW / 2) + rng.int(-1, 1)));
  const yard = { x: lotX0, y: lotTop, w: YW, h: YH, id: 0, yard: true };
  yard.cx = yard.x + (YW - 1) / 2;
  yard.cy = yard.y + (YH - 1) / 2;
  for (let y = lotTop - 1; y < H; y++) for (let x = 0; x < W; x++) forbidden[idx(x, y)] = 1;
  for (let y = yard.y; y < yard.y + YH; y++)
    for (let x = yard.x; x < yard.x + YW; x++) {
      tiles[idx(x, y)] = T.YARD;
      roomOf[idx(x, y)] = 0;
    }
  const rooms = [yard];
  // small places (a house, a gas station) keep their rooms in a band around
  // the door so the building has a believable footprint
  const bx0 = L.band ? Math.max(2, doorX - Math.floor(L.band / 2)) : 2;
  const bx1 = L.band ? Math.min(W - 2, bx0 + L.band) : W - 2;

  // ---------- Rooms ----------
  const target = rng.int(L.rooms[0], L.rooms[1]) + Math.floor(loc.difficulty / 2);
  for (let a = 0; a < 1400 && rooms.length < target + 1; a++) {
    const w = rng.int(L.room[0], L.room[1]);
    const h = rng.int(L.room[0], L.room[1]);
    const x = rng.int(bx0, bx1 - w);
    if (x < bx0) continue;
    const y = rng.int(2, lotTop - 3 - h);
    if (y < 2 || y + h > lotTop - 3) continue;
    let ok = true;
    for (const r of rooms) {
      const m = r.yard ? 3 : 2;
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

  // ---------- Front door (in the building's front wall) ----------
  const door = { x: doorX, y: lotTop - 1, dir: [0, -1] };
  tiles[idx(door.x, door.y)] = T.FLOOR;
  const outside = { x: door.x, y: door.y - 1 };
  tiles[idx(outside.x, outside.y)] = T.FLOOR;

  // ---------- Corridors (MST + loops), carved with A* through rock ----------
  const nodes = rooms.map((r) => (r.yard ? { x: outside.x, y: outside.y } : { x: Math.round(r.cx), y: Math.round(r.cy) }));
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
  for (let a = 1; a < rooms.length; a++) {
    if (!rng.chance(0.35)) continue;
    const others = [];
    for (let b = 1; b < rooms.length; b++)
      if (b !== a && !edgeSet.has(a + ',' + b)) others.push([b, Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y)]);
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
        if (came[cur] >= 0 && cur - came[cur] !== ni - cur) cost += 0.6;
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

  // ---------- Placement helpers ----------
  const blocked = new Uint8Array(W * H);
  const used = new Uint8Array(W * H);
  const isFloor = (x, y) => tiles[idx(x, y)] === T.FLOOR;
  const isRock = (x, y) => !inb(x, y) || tiles[idx(x, y)] === T.ROCK;
  const center = (x, y) => ({ x: (x + 0.5) * TILE, z: (y + 0.5) * TILE });
  for (let y = yard.y; y < yard.y + YH; y++) for (let x = yard.x; x < yard.x + YW; x++) used[idx(x, y)] = 1;
  used[idx(door.x, door.y)] = 1;
  used[idx(outside.x, outside.y)] = 1;

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
  function nearOpening(x, y, room) {
    for (let oy = -1; oy <= 1; oy++)
      for (let ox = -1; ox <= 1; ox++) {
        const nx = x + ox;
        const ny = y + oy;
        if (!inb(nx, ny)) continue;
        const ni = idx(nx, ny);
        if (tiles[ni] !== T.ROCK && roomOf[ni] !== room.id) return true;
      }
    return false;
  }
  const wallDirs = (x, y) => DIRS4.filter(([ddx, ddy]) => isRock(x + ddx, y + ddy));
  function roomTiles(room) {
    const out = [];
    for (let y = room.y; y < room.y + room.h; y++) for (let x = room.x; x < room.x + room.w; x++) if (tiles[idx(x, y)] === T.FLOOR) out.push([x, y]);
    return out;
  }
  const normalRooms = rooms.filter((r) => !r.yard);

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
      return { kind, tx: x, ty: y, x: c.x + wx * off, z: c.z + wy * off, fx: -wx, fz: -wy, angle: Math.atan2(-wx, -wy) };
    }
    return null;
  }

  const out = {
    W,
    H,
    tiles,
    roomOf,
    rooms,
    yard,
    door,
    outside,
    blocked,
    theme: { ...L.theme, yard: L.yard === 'biome' ? BIOMES[biome].ground : L.yard, outside: BIOMES[biome].ground },
    hiding: [],
    containers: [],
    survivors: [],
    pits: [],
    bearTraps: [],
    tripwires: [],
    glass: [],
    lamps: [],
    decor: [],
    enemies: [],
  };
  const d = loc.difficulty;

  // ---------- Spike pits ----------
  const pitChance = Math.min(0.04 + d * 0.05, 0.35);
  for (const room of normalRooms) {
    if (room.w < 5 || room.h < 5 || !rng.chance(pitChance)) continue;
    const x = rng.int(room.x + 1, room.x + room.w - 2);
    const y = rng.int(room.y + 1, room.y + room.h - 2);
    let clear = true;
    for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) if (tiles[idx(x + ox, y + oy)] === T.PIT) clear = false;
    if (!clear || nearOpening(x, y, room)) continue;
    tiles[idx(x, y)] = T.PIT;
    if (!connected()) {
      tiles[idx(x, y)] = T.FLOOR;
      continue;
    }
    used[idx(x, y)] = 1;
    out.pits.push({ tx: x, ty: y });
  }

  // ---------- Loot containers (one per pre-rolled container of the location) ----------
  const kinds = CONTAINER_KINDS[loc.type] || ['crate'];
  for (let k = 0; k < loc.containers.length; k++) {
    const kind = rng.pick(kinds);
    let p = null;
    for (let a = 0; a < 6 && !p; a++) p = placeWallProp(rng.pick(normalRooms), kind, CONTAINER_DEPTH[kind]);
    if (!p) continue;
    p.idx = k;
    out.containers.push(p);
  }

  // ---------- Hiding spots ----------
  const hideKinds = ['locker', 'closet', 'bed', 'bench'];
  const depthOf = { locker: 0.65, closet: 0.75, bed: 1.15, bench: 0.6 };
  for (const room of normalRooms) {
    const n = room.w * room.h >= 36 ? rng.int(0, 2) : rng.int(0, 1);
    for (let k = 0; k < n; k++) {
      const kind = rng.pick(hideKinds);
      const p = placeWallProp(room, kind, depthOf[kind]);
      if (p) out.hiding.push(p);
    }
  }

  // ---------- Free floor tile picker ----------
  const allFloor = [];
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) if (tiles[idx(x, y)] === T.FLOOR) allFloor.push([x, y]);
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

  // ---------- Survivors waiting to be found (far from the entrance) ----------
  const far = normalRooms.map((r) => ({ r, d: doorDist[idx(Math.round(r.cx), Math.round(r.cy))] })).sort((a, b) => b.d - a.d);
  for (let k = 0; k < loc.survivors.length; k++) {
    const room = far[Math.min(k, far.length - 1)]?.r;
    let placed = false;
    if (room)
      for (const [x, y] of rng.shuffle(roomTiles(room))) {
        const i = idx(x, y);
        if (used[i] || blocked[i]) continue;
        used[i] = 1;
        out.survivors.push({ ...center(x, y), idx: k });
        placed = true;
        break;
      }
    if (!placed) {
      const t = freeTile(roomFloor.length ? roomFloor : allFloor, 6);
      if (t) out.survivors.push({ ...center(t[0], t[1]), idx: k });
    }
  }

  // ---------- Hazards ----------
  const bearCount = Math.max(0, d - 1 + rng.int(0, 1));
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
  const wireCount = Math.min(Math.floor(d * 0.6), wireCands.length);
  rng.shuffle(wireCands);
  for (let k = 0, placed = 0; k < wireCands.length && placed < wireCount; k++) {
    const [x, y] = wireCands[k];
    const i = idx(x, y);
    if (used[i]) continue;
    used[i] = 1;
    placed++;
    const c = center(x, y);
    out.tripwires.push({ tx: x, ty: y, x: c.x, z: c.z, alongX: isFloor(x - 1, y) && isFloor(x + 1, y) });
  }
  for (let k = 0; k < 1 + d; k++) {
    const t = freeTile(allFloor, 3);
    if (t) out.glass.push({ tx: t[0], ty: t[1] });
  }

  // ---------- Lamps (some still flicker on emergency power) ----------
  for (const room of normalRooms) {
    if (!rng.chance(0.5)) continue;
    for (const [x, y] of rng.shuffle(roomTiles(room))) {
      const wd = wallDirs(x, y);
      if (!wd.length) continue;
      const [wx, wy] = rng.pick(wd);
      const c = center(x, y);
      out.lamps.push({ x: c.x + wx * (TILE / 2 - 0.05), z: c.z + wy * (TILE / 2 - 0.05), fx: -wx, fz: -wy, red: rng.chance(0.35) });
      break;
    }
  }

  // ---------- Decor ----------
  for (let k = 0; k < 20 + d * 5; k++) {
    const [x, y] = rng.pick(allFloor);
    const c = center(x, y);
    out.decor.push({ kind: rng.pick(['blood', 'blood', 'debris', 'debris', 'bones', 'skull']), x: c.x + rng.range(-1, 1), z: c.z + rng.range(-1, 1), rot: rng.range(0, Math.PI * 2), s: rng.range(0.7, 1.4) });
  }

  // ---------- Zombies ----------
  const roster = enemyRoster(loc, rng, normalRooms.length);
  const spawnTiles = rng.shuffle(allFloor.filter(([x, y]) => doorDist[idx(x, y)] > 9 && !blocked[idx(x, y)] && roomOf[idx(x, y)] > 0));
  const fallback = rng.shuffle(allFloor.filter(([x, y]) => doorDist[idx(x, y)] > 5 && !blocked[idx(x, y)]));
  const spawnList = spawnTiles.length > 6 ? spawnTiles : fallback.length ? fallback : allFloor;
  let si = 0;
  const taken = [];
  for (const type of roster) {
    let chosen = null;
    for (let a = 0; a < spawnList.length; a++) {
      const t = spawnList[(si + a) % spawnList.length];
      if (taken.every(([x, y]) => Math.abs(x - t[0]) + Math.abs(y - t[1]) > 3)) {
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

  // ---------- The building's outline, the lot and the way home ----------
  let minX = W;
  let maxX = 0;
  let minY = H;
  for (let y = 0; y < lotTop; y++)
    for (let x = 0; x < W; x++)
      if (tiles[idx(x, y)] !== T.ROCK) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
      }
  out.lot = { x0: yard.x, x1: yard.x + YW - 1, y0: lotTop, y1: H - 2 };
  out.shell = { x0: Math.max(0, Math.min(minX - 1, yard.x - 1)), x1: Math.min(W - 1, Math.max(maxX + 1, yard.x + YW)), y0: Math.max(0, minY - 1), y1: lotTop - 1 };
  out.front = lotTop;
  out.yardWorld = { x0: yard.x * TILE, z0: lotTop * TILE, x1: (yard.x + YW) * TILE, z1: (H - 1) * TILE };
  const doorWX = (door.x + 0.5) * TILE;
  out.spawn = { x: doorWX, z: (H - 1) * TILE - 2.2, yaw: 0 };
  out.exit = { x: doorWX + 2.6, z: (H - 1) * TILE - 1.0 };
  out.lotType = loc.type;
  return out;
}
