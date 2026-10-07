// The persistent state of one run (camp, inventory, survivors, the local and
// regional maps) plus the generators that create it. Pure data: everything
// here is JSON-serialisable so the run can be saved between sessions.
import { RNG } from './util.js';
import { DAY_HOURS, BARRICADE, MAX_SURVIVORS } from './config.js';
import { WEAPONS, AMMO, AMMO_ORDER, weaponStats, weaponPower, rollWeapon, ammoPickup } from './weapons.js';

const SAVE_KEY = 'dreaddepths.run.v2';
const BEST_KEY = 'dreaddepths.bestNights';

// ---------------------------------------------------------------- biomes
export const BIOMES = {
  forest: {
    name: 'Forest',
    icon: '♣',
    ground: 'grass',
    weather: 'rain',
    clouds: 0.78,
    cover: ['pine', 'pine', 'pine', 'rock', 'log', 'car', 'stump', 'bush', 'bush'],
    backdrop: 0x1e2a1c,
    tod: {
      day: { zen: 0x5a7086, sky: 0x8b9ba6, fog: 0x7f8c91, hemiS: 0xc2ccd2, hemiG: 0x3c4a2c, sun: 0xfff0dc, sunI: 1.5, hemiI: 1.05, fogD: 0.0075 },
      dusk: { zen: 0x2e2a46, sky: 0x7a5462, fog: 0x5a4048, hemiS: 0xd09080, hemiG: 0x2a2028, sun: 0xff9a5a, sunI: 0.9, hemiI: 0.6, fogD: 0.011 },
      night: { zen: 0x020309, sky: 0x05070d, fog: 0x04060a, hemiS: 0x3a4a6a, hemiG: 0x0a0a10, sun: 0x8090c0, sunI: 0.16, hemiI: 0.3, fogD: 0.02 },
    },
  },
  desert: {
    name: 'Desert',
    icon: '☀',
    ground: 'sand',
    weather: 'dust',
    clouds: 0.18,
    cover: ['cactus', 'cactus', 'rock', 'rock', 'car', 'barrel', 'skull', 'bush'],
    backdrop: 0x8a5a3a,
    tod: {
      day: { zen: 0x5a82ae, sky: 0xc9b89a, fog: 0xc4ad88, hemiS: 0xfff0d0, hemiG: 0x8a6a40, sun: 0xfff2d0, sunI: 1.9, hemiI: 1.1, fogD: 0.0055 },
      dusk: { zen: 0x34305a, sky: 0xb2603a, fog: 0x8a4a30, hemiS: 0xffa070, hemiG: 0x4a2a1a, sun: 0xff7a3a, sunI: 1.0, hemiI: 0.65, fogD: 0.009 },
      night: { zen: 0x03030a, sky: 0x080610, fog: 0x07060c, hemiS: 0x4a4a7a, hemiG: 0x14100c, sun: 0x9aa0d0, sunI: 0.2, hemiI: 0.32, fogD: 0.016 },
    },
  },
  tundra: {
    name: 'Tundra',
    icon: '❄',
    ground: 'snow',
    weather: 'snow',
    clouds: 0.62,
    cover: ['deadtree', 'pineSnow', 'pineSnow', 'rock', 'car', 'log', 'ice'],
    backdrop: 0xa8b4c0,
    tod: {
      day: { zen: 0x6a86a6, sky: 0xb4c0cc, fog: 0xb0bcc6, hemiS: 0xe6eef6, hemiG: 0x8a96a2, sun: 0xf4f8ff, sunI: 1.4, hemiI: 1.15, fogD: 0.012 },
      dusk: { zen: 0x2e3456, sky: 0x7a6a8a, fog: 0x5e566e, hemiS: 0xc0a0c0, hemiG: 0x404050, sun: 0xffb090, sunI: 0.8, hemiI: 0.7, fogD: 0.014 },
      night: { zen: 0x03050c, sky: 0x070a12, fog: 0x080b12, hemiS: 0x4a5a80, hemiG: 0x181c28, sun: 0xa0b0e0, sunI: 0.24, hemiI: 0.38, fogD: 0.02 },
    },
  },
};
export const BIOME_KEYS = Object.keys(BIOMES);

// ---------------------------------------------------------------- locations
export const LOCATION_TYPES = {
  gas: {
    name: 'Gas Station', icon: '⛽', diff: [1, 2], hours: 2, size: 18, band: 10, rooms: [3, 4], room: [3, 5], lot: [12, 7], containers: [4, 6], survivor: 0.15,
    theme: { wall: 'tile', wall2: 'concrete', floor: 'linoleum', ceil: 'ceiling' }, yard: 'asphalt',
    loot: { scrap: 3, coal: 2.5, medkit: 0.6, ammo: 1.6, weapon: 0.7, trap: 1.5, blueprint: 0.12, food: 2.2 },
    traps: { kerosene: 5, bear: 1, tripwire: 1, mine: 0 }, cats: ['melee', 'pistol', 'shotgun'], ammo: ['pistol', 'shells', 'fuel'],
    names: ['Gas-N-Go', 'Pump & Save', 'Route 9 Fuel', 'Stop-N-Fill', 'Last Chance Gas', 'Sunoco Mart', 'Hi-Way Fuel'],
  },
  home: {
    name: 'House', icon: '⌂', diff: [1, 2], hours: 2, size: 18, band: 11, rooms: [4, 6], room: [2, 4], lot: [9, 6], containers: [5, 8], survivor: 0.3,
    theme: { wall: 'wallpaper', wall2: 'wood', floor: 'woodFloor', ceil: 'ceiling' }, yard: 'biome',
    loot: { scrap: 2, coal: 0.6, medkit: 2, ammo: 2, weapon: 1.4, trap: 0.7, blueprint: 0.08, food: 2.6 },
    traps: { bear: 3, kerosene: 1, tripwire: 1, mine: 0 }, cats: ['melee', 'pistol', 'shotgun', 'rifle', 'bow'], ammo: ['pistol', 'shells', 'arrows', 'rifle'],
    suffix: ['House', 'Farmhouse', 'Cottage', 'Residence', 'Cabin'],
  },
  apartment: {
    name: 'Apartment Block', icon: '▥', diff: [2, 4], hours: 4, size: 32, rooms: [10, 14], room: [3, 6], lot: [12, 6], containers: [9, 14], survivor: 0.5,
    theme: { wall: 'wallpaper', wall2: 'brick', floor: 'carpet', ceil: 'ceiling' }, yard: 'asphalt',
    loot: { scrap: 2.2, coal: 0.7, medkit: 1.6, ammo: 2, weapon: 1.4, trap: 0.8, blueprint: 0.15, food: 2.4 },
    traps: { bear: 2, kerosene: 1, tripwire: 1, mine: 0 }, cats: ['melee', 'pistol', 'smg', 'shotgun', 'rifle', 'bow', 'thrown'], ammo: ['pistol', 'shells', 'rifle', 'fuel'],
    suffix: ['Apartments', 'Towers', 'Court', 'Flats'],
  },
  office: {
    name: 'Office Building', icon: '▤', diff: [2, 3], hours: 3, size: 30, rooms: [7, 10], room: [4, 7], lot: [14, 7], containers: [7, 11], survivor: 0.25,
    theme: { wall: 'concrete', wall2: 'wallpaper', floor: 'carpet', ceil: 'ceiling' }, yard: 'asphalt',
    loot: { scrap: 3.6, coal: 0.5, medkit: 1, ammo: 1.2, weapon: 0.9, trap: 0.5, blueprint: 0.45, food: 0.8 },
    traps: { tripwire: 2, bear: 1, kerosene: 1, mine: 0 }, cats: ['melee', 'pistol', 'smg'], ammo: ['pistol', 'shells'],
    suffix: ['Offices', 'Tower', 'Plaza', 'Insurance', 'Tech Park'],
  },
  warehouse: {
    name: 'Warehouse', icon: '▦', diff: [2, 4], hours: 3, size: 30, rooms: [3, 5], room: [6, 10], lot: [14, 7], containers: [8, 12], survivor: 0.2,
    theme: { wall: 'sheetMetal', wall2: 'concrete', floor: 'concrete', ceil: 'metal' }, yard: 'concreteSlab',
    loot: { scrap: 4.5, coal: 3, medkit: 0.6, ammo: 1.4, weapon: 0.9, trap: 2, blueprint: 0.7, food: 2.0 },
    traps: { bear: 2, tripwire: 2, kerosene: 3, mine: 1 }, cats: ['melee', 'shotgun', 'rifle', 'smg', 'thrown'], ammo: ['shells', 'rifle', 'fuel', 'pistol', 'explosives'],
    suffix: ['Warehouse', 'Depot', 'Storage', 'Freight', 'Distribution'],
  },
  police: {
    name: 'Police Station', icon: '★', diff: [3, 4], hours: 3, size: 28, rooms: [7, 9], room: [3, 6], lot: [13, 7], containers: [7, 10], survivor: 0.3,
    theme: { wall: 'concrete', wall2: 'tile', floor: 'linoleum', ceil: 'ceiling' }, yard: 'asphalt',
    loot: { scrap: 1.6, coal: 0.4, medkit: 1.2, ammo: 3.6, weapon: 2.6, trap: 1.2, blueprint: 0.3, food: 0.8 },
    traps: { bear: 3, tripwire: 1, mine: 0.5, kerosene: 0.5 }, cats: ['pistol', 'smg', 'shotgun', 'rifle', 'sniper', 'melee', 'thrown'], ammo: ['pistol', 'shells', 'rifle', 'explosives'],
    suffix: ['Police Station', 'Precinct', 'Sheriff\'s Office', 'County Jail'],
  },
  hospital: {
    name: 'Hospital', icon: '✚', diff: [3, 5], hours: 4, size: 34, rooms: [11, 15], room: [3, 6], lot: [14, 7], containers: [9, 14], survivor: 0.55,
    theme: { wall: 'tile', wall2: 'concrete', floor: 'linoleum', ceil: 'ceiling' }, yard: 'asphalt',
    loot: { scrap: 2, coal: 0.4, medkit: 4.5, ammo: 1.2, weapon: 0.9, trap: 0.6, blueprint: 0.25, food: 1.0 },
    traps: { bear: 1, tripwire: 2, kerosene: 1, mine: 0 }, cats: ['melee', 'pistol', 'smg'], ammo: ['pistol', 'shells'],
    suffix: ['Hospital', 'Medical Center', 'Clinic', 'General'],
  },
  military: {
    name: 'Military Base', icon: '✪', diff: [4, 5], hours: 5, size: 36, rooms: [8, 11], room: [4, 8], lot: [14, 8], containers: [10, 14], survivor: 0.3,
    theme: { wall: 'concrete', wall2: 'sheetMetal', floor: 'concrete', ceil: 'metal' }, yard: 'dirt',
    loot: { scrap: 2.4, coal: 1.2, medkit: 1.4, ammo: 3.6, weapon: 2.8, trap: 2.2, blueprint: 1.4, food: 1.6 },
    traps: { mine: 4, bear: 1, tripwire: 1, kerosene: 1 }, cats: ['rifle', 'sniper', 'lmg', 'launcher', 'thrown', 'smg', 'shotgun'], ammo: ['rifle', 'explosives', 'shells', 'pistol'],
    names: ['Fort Vail', 'Camp Harlow', 'Outpost Kilo', 'Firebase Echo', 'Fort Tran', 'Depot 51', 'Camp Ridgeback'],
  },
};
export const LOCATION_KEYS = Object.keys(LOCATION_TYPES);

// ---------------------------------------------------------------- region profiles
// Every region has a profile: how much of each resource it tends to hold
// (multipliers around 1.0) and how dangerous it is (0-3).
export const RES_KEYS = ['survivors', 'weapons', 'ammo', 'food', 'medicine', 'coal', 'scrap'];
const RES_NAMES = { survivors: 'survivors', weapons: 'weapons', ammo: 'ammunition', food: 'food', medicine: 'medicine', coal: 'coal', scrap: 'scrap' };
const RES_VALUE = { survivors: 1.4, weapons: 1.2, ammo: 0.9, food: 1.2, medicine: 0.9, coal: 1.0, scrap: 1.0 };
export const DANGER_NAMES = ['FAIRLY SAFE', 'SOMEWHAT DANGEROUS', 'DANGEROUS', 'VERY DANGEROUS'];
// How strongly each building type responds to a region's resource leanings.
const AFFINITY = {
  gas: { food: 0.6, coal: 0.8, scrap: 0.3 },
  home: { survivors: 0.5, food: 0.7, medicine: 0.4, weapons: 0.2 },
  apartment: { survivors: 0.9, food: 0.6, medicine: 0.3 },
  office: { scrap: 0.9 },
  warehouse: { scrap: 0.7, coal: 1.0, food: 0.5 },
  police: { weapons: 1.0, ammo: 0.9 },
  hospital: { medicine: 1.2, survivors: 0.4 },
  military: { weapons: 1.1, ammo: 1.0 },
};
// Which profile entry scales each kind of loot.
const LOOT_KEY = { scrap: 'scrap', coal: 'coal', medkit: 'medicine', ammo: 'ammo', weapon: 'weapons', food: 'food' };

export function makeProfile(rng, index, opts = {}) {
  const mult = {};
  for (const k of RES_KEYS) {
    const g = (rng.next() + rng.next() + rng.next() - 1.5) * 0.7;
    mult[k] = Math.exp(g);
  }
  // most regions have something they're known for, and often something they lack
  const keys = rng.shuffle(RES_KEYS.slice());
  mult[keys[0]] = Math.max(mult[keys[0]], rng.range(1.5, 2.2));
  if (rng.chance(0.5)) mult[keys[1]] = Math.max(mult[keys[1]], rng.range(1.35, 1.8));
  if (rng.chance(0.65)) mult[keys[2]] = Math.min(mult[keys[2]], rng.range(0.35, 0.65));
  for (const k of RES_KEYS) mult[k] = Math.round(Math.max(0.3, Math.min(2.4, mult[k])) * 100) / 100;
  const late = Math.min(3, index * 0.22);
  const danger =
    opts.danger ?? +pickWeighted(rng, { 0: Math.max(0.4, 3 - late * 1.5), 1: 3, 2: 1.4 + late, 3: 0.5 + late });
  return { mult, danger };
}

export function profileValue(p) {
  let sum = 0;
  let w = 0;
  for (const k of RES_KEYS) {
    sum += RES_VALUE[k] * p.mult[k];
    w += RES_VALUE[k];
  }
  return sum / w;
}

function listWords(arr, conj) {
  if (arr.length <= 1) return arr.join('');
  if (arr.length === 2) return `${arr[0]} ${conj} ${arr[1]}`;
  return `${arr.slice(0, -1).join(', ')}, ${conj} ${arr[arr.length - 1]}`;
}

// e.g. "Likely to have survivors and weapons, unlikely to have food, coal, or scrap; VERY DANGEROUS"
export function appraisal(p) {
  const likely = RES_KEYS.filter((k) => p.mult[k] >= 1.3).sort((a, b) => p.mult[b] - p.mult[a]);
  const unlikely = RES_KEYS.filter((k) => p.mult[k] <= 0.75).sort((a, b) => p.mult[a] - p.mult[b]);
  const parts = [];
  if (likely.length) parts.push(`Likely to have ${listWords(likely.map((k) => RES_NAMES[k]), 'and')}`);
  if (unlikely.length) parts.push(`${likely.length ? 'unlikely' : 'Unlikely'} to have ${listWords(unlikely.map((k) => RES_NAMES[k]), 'or')}`);
  if (!parts.length) parts.push('Nothing in particular stands out');
  return `${parts.join(', ')}; ${DANGER_NAMES[p.danger]}`;
}

const STREETS = [
  'Maple', 'Birch', 'Hollis', 'Kessler', 'Cormac', 'Dockside', 'Ashford', 'Granger', 'Willow', 'Mercer', 'Bramble', 'Calder',
  'Harlan', 'Juniper', 'Lowell', 'Prescott', 'Quarry', 'Rook', 'Sterling', 'Tanner', 'Vance', 'Wexford', 'Elm', 'Oakridge',
];
const SAINTS = ['St. Agnes', 'Mercy', 'St. Jude', 'County', 'Riverside', 'Good Shepherd', 'Holy Cross'];

const FIRST = [
  'Ada', 'Ben', 'Cass', 'Dmitri', 'Elena', 'Frank', 'Gus', 'Hana', 'Isaac', 'Jade', 'Kofi', 'Lena', 'Marcus', 'Nia', 'Owen',
  'Priya', 'Quinn', 'Rosa', 'Sam', 'Tomas', 'Uma', 'Vic', 'Wes', 'Ximena', 'Yusuf', 'Zoe', 'Abe', 'Bea', 'Cole', 'Dina',
  'Eli', 'Faye', 'Grant', 'Hugo', 'Iris', 'Jonah', 'Kira', 'Luis', 'Mae', 'Nate', 'Odile', 'Pete', 'Ruth', 'Saul', 'Tess',
];
const LAST = [
  'Abrams', 'Baker', 'Chen', 'Diaz', 'Ellis', 'Foster', 'Garcia', 'Hart', 'Ito', 'Jensen', 'Kowalski', 'Lopez', 'Moreau',
  'Nakamura', 'Okafor', 'Petrov', 'Reyes', 'Silva', 'Tran', 'Ueda', 'Vargas', 'Walsh', 'Young', 'Zimmer', 'Brennan', 'Holt',
];

const SKIN = [0xf0c8a8, 0xd8a888, 0xb07a58, 0x8a5a3a, 0x5e3a24, 0xe0b898];
const SHIRT = [0x3a5a7a, 0x7a2a2a, 0x2e5a3a, 0x6a5a3a, 0x4a4a52, 0x8a6a2a, 0x2a2a30, 0x5a3a6a, 0x9a8a6a, 0x305060];
const PANTS = [0x2a3040, 0x3a3226, 0x1e1e22, 0x4a4030, 0x2e3a2e];
const HAIR = [0x1a1410, 0x3a2614, 0x6a4422, 0xa07a3a, 0x8a8a8a, 0x2a1a10, 0xc8a050];

// ---------------------------------------------------------------- progression
export const xpToNext = (level) => Math.round(8 * Math.pow(level, 1.4));

export function grantXp(rec, n) {
  rec.xp = (rec.xp || 0) + n;
  let gained = 0;
  while (rec.xp >= xpToNext(rec.level)) {
    rec.xp -= xpToNext(rec.level);
    rec.level++;
    gained++;
  }
  return gained;
}

export const playerMaxHp = (lvl) => 100 + 10 * (lvl - 1);
export const playerMaxStamina = (lvl) => 100 + 8 * (lvl - 1);
export const playerSpeedMul = (lvl) => Math.min(1.25, 1 + 0.015 * (lvl - 1));

export const survivorMaxHp = (s) => s.hpBase + 10 * (s.level - 1);
export const survivorSpeed = (s) => s.speedBase * (1 + 0.02 * (s.level - 1));
export const survivorStamina = (s) => s.stamBase + 8 * (s.level - 1);
export const survivorAim = (s) => Math.min(0.93, 0.42 + 0.05 * s.level);

export function makeSurvivor(run, rng, level) {
  const s = {
    id: run.nextSurvivorId++,
    name: `${rng.pick(FIRST)} ${rng.pick(LAST)}`,
    level,
    xp: 0,
    hpBase: rng.int(55, 80),
    speedBase: rng.range(3.0, 3.8),
    stamBase: rng.int(70, 110),
    weapon: null,
    status: 'found',
    kills: 0,
    look: {
      skin: rng.pick(SKIN),
      shirt: rng.pick(SHIRT),
      pants: rng.pick(PANTS),
      hair: rng.pick(HAIR),
      hat: rng.chance(0.3),
      female: rng.chance(0.5),
    },
  };
  s.hp = survivorMaxHp(s);
  return s;
}

// ---------------------------------------------------------------- weapons inventory
export function addWeapon(run, id) {
  const inst = { uid: run.nextUid++, id, up: {}, mag: 0 };
  inst.mag = weaponStats(inst).mag;
  run.weapons.push(inst);
  return inst;
}
export const weaponByUid = (run, uid) => run.weapons.find((w) => w.uid === uid) || null;

export function holderOf(run, uid) {
  if (uid == null) return null;
  if (run.loadout.primary === uid || run.loadout.secondary === uid) return 'player';
  return run.survivors.find((s) => s.status !== 'dead' && s.weapon === uid) || null;
}

export function unassign(run, uid) {
  if (run.loadout.primary === uid) run.loadout.primary = null;
  if (run.loadout.secondary === uid) run.loadout.secondary = null;
  for (const s of run.survivors) if (s.weapon === uid) s.weapon = null;
}

export function removeWeapon(run, uid) {
  unassign(run, uid);
  run.weapons = run.weapons.filter((w) => w.uid !== uid);
}

// ---------------------------------------------------------------- new run
export function newRun(seed = (Math.random() * 0xffffffff) >>> 0) {
  const run = {
    version: 3,
    seed,
    day: 1,
    hours: DAY_HOURS,
    phase: 'day',
    scrap: 60,
    coal: 2,
    medkits: 2,
    food: 6,
    ammo: Object.fromEntries(AMMO_ORDER.map((k) => [k, 0])),
    traps: { bear: 2, mine: 0, tripwire: 0, kerosene: 0 },
    blueprints: { mg: 0, missile: 0, artillery: 0 },
    weapons: [],
    nextUid: 1,
    loadout: { primary: null, secondary: null },
    player: { level: 1, xp: 0, hp: playerMaxHp(1), kills: 0 },
    survivors: [],
    nextSurvivorId: 1,
    barricade: { level: 0, hp: BARRICADE.baseHp },
    turrets: [null, null, null, null, null],
    placedTraps: [],
    localityCount: 0,
    wavesFaced: 0,
    expeditions: [],
    report: [],
    stats: { kills: 0, waves: 0, quietNights: 0, localities: 1, searched: 0, recruited: 0, lost: 0 },
  };
  run.ammo.pistol = 60;
  const g = addWeapon(run, 'glock');
  const k = addWeapon(run, 'knife');
  run.loadout.primary = g.uid;
  run.loadout.secondary = k.uid;
  const rng = new RNG(seed);
  run.locality = generateLocality(run, rng.pick(BIOME_KEYS), makeProfile(rng, 0, { danger: rng.int(0, 1) }));
  run.region = { options: regionalOptions(run) };
  return run;
}

export const barricadeMax = (run) => BARRICADE.baseHp + BARRICADE.perLevel * run.barricade.level;
export const waveChance = (run) => Math.min(1, 0.5 + 0.01 * (run.day - 1));

// ---------------------------------------------------------------- localities
const LOC_NAMES = {
  forest: { a: ['Pine', 'Elk', 'Cedar', 'Raven', 'Moss', 'Fern', 'Black Oak', 'Hemlock', 'Bear'], b: ['Hollow', 'Creek', 'Crossing', 'Junction', 'Ridge', 'Falls', 'Siding'] },
  desert: { a: ['Dust', 'Red Mesa', 'Sidewinder', 'Bone', 'Sun', 'Coyote', 'Scorch', 'Dry Gulch', 'Vulture'], b: ['Flats', 'Wells', 'Junction', 'Bluff', 'Station', 'Basin', 'Siding'] },
  tundra: { a: ['Frost', 'Whiteout', 'Ice', 'Wolf', 'Glacier', 'Pale', 'Rime', 'North', 'Caribou'], b: ['Point', 'Pass', 'Junction', 'Reach', 'Station', 'Ridge', 'Siding'] },
};

function localityName(rng, biome) {
  const n = LOC_NAMES[biome];
  return `${rng.pick(n.a)} ${rng.pick(n.b)}`;
}

function pickWeighted(rng, weights) {
  let total = 0;
  for (const k in weights) total += Math.max(0, weights[k]);
  let x = rng.next() * total;
  for (const k in weights) {
    x -= Math.max(0, weights[k]);
    if (x <= 0) return k;
  }
  return Object.keys(weights)[0];
}

export function generateLocality(run, biome, profile) {
  run.localityCount++;
  const index = run.localityCount;
  const seed = (Math.random() * 0xffffffff) >>> 0;
  const rng = new RNG(seed);
  profile = profile || makeProfile(rng, index);
  const loc = { seed, biome, index, profile, name: localityName(rng, biome), locations: [] };
  const n = rng.int(7, 10);
  const placed = [];
  const typeW = {};
  const base = { gas: 3, home: 4, apartment: 2.4, office: 2, warehouse: 2, police: 1.5, hospital: 1.4, military: 0.5 + 0.15 * index };
  for (const t in base) {
    let w = base[t];
    for (const k in AFFINITY[t]) w *= Math.pow(profile.mult[k], AFFINITY[t][k] * 1.6);
    typeW[t] = w * rng.range(0.8, 1.25);
  }
  const used = new Set();
  for (let i = 0; i < n; i++) {
    let x = 0;
    let y = 0;
    for (let a = 0; a < 60; a++) {
      x = rng.range(0.08, 0.92);
      y = rng.range(0.1, 0.9);
      if (Math.hypot(x - 0.5, y - 0.5) < 0.16) continue;
      if (placed.every((p) => Math.hypot(p.x - x, p.y - y) > 0.14)) break;
    }
    placed.push({ x, y });
    // the first two are always quick, nearby searches so a fresh camp has options
    const type = i === 0 && index === 1 ? 'home' : i === 1 && index === 1 ? 'gas' : pickWeighted(rng, typeW);
    loc.locations.push(generateLocation(run, rng, type, index, profile, x, y, used));
  }
  return loc;
}

function generateLocation(run, rng, type, index, profile, x, y, usedNames) {
  const L = LOCATION_TYPES[type];
  // the region's danger shifts difficulty, with a little noise per building
  let bonus = Math.floor((index - 1) / 3) + (profile.danger - 1);
  if (rng.chance(0.3)) bonus += rng.chance(0.5) ? 1 : -1;
  const difficulty = Math.max(1, Math.min(6, rng.int(L.diff[0], L.diff[1]) + bonus));
  let name = '';
  for (let a = 0; a < 8; a++) {
    if (L.names) name = rng.pick(L.names);
    else if (type === 'hospital') name = `${rng.pick(SAINTS)} ${rng.pick(L.suffix)}`;
    else name = `${rng.pick(STREETS)} ${rng.pick(L.suffix)}`;
    if (!usedNames.has(name)) break;
  }
  usedNames.add(name);
  const dist = Math.hypot(x - 0.5, y - 0.5);
  const hours = L.hours + (dist > 0.34 ? 1 : 0);
  const out = {
    id: Math.floor(rng.next() * 1e9),
    type,
    name,
    x,
    y,
    difficulty,
    hours,
    seed: (rng.next() * 0xffffffff) >>> 0,
    searched: false,
    containers: [],
    survivors: [],
  };
  // loot leans the way the region does, with noise so no building is a sure thing
  const weights = {};
  for (const k in L.loot) {
    const key = LOOT_KEY[k];
    weights[k] = L.loot[k] * (key ? Math.pow(profile.mult[key], 1.3) : 1) * rng.range(0.6, 1.4);
  }
  const nc = rng.int(L.containers[0], L.containers[1]);
  for (let c = 0; c < nc; c++) out.containers.push(rollContainer(rng, L, difficulty, weights, profile));
  const sChance = Math.min(0.9, L.survivor * profile.mult.survivors * rng.range(0.7, 1.3));
  if (rng.chance(sChance)) {
    const count = (type === 'apartment' || type === 'hospital') && rng.chance(0.3 * profile.mult.survivors) ? 2 : 1;
    for (let k = 0; k < count; k++) out.survivors.push(makeSurvivor(run, rng, rng.int(1, 1 + Math.ceil(difficulty / 2) + Math.floor(index / 4))));
  }
  return out;
}

function rollContainer(rng, L, d, weights, profile) {
  const items = [];
  if (rng.chance(0.08)) return items;
  const count = rng.chance(0.25 + d * 0.05) ? 2 : 1;
  const amt = (key) => Math.sqrt(profile.mult[key]) * rng.range(0.85, 1.15);
  for (let i = 0; i < count; i++) {
    const kind = pickWeighted(rng, weights);
    const m = 1 + 0.15 * (d - 1);
    switch (kind) {
      case 'scrap':
        items.push({ k: 'scrap', n: Math.max(2, Math.round(rng.int(6, 18) * m * amt('scrap'))) });
        break;
      case 'coal':
        items.push({ k: 'coal', n: Math.max(1, Math.round(rng.int(1, 3) * amt('coal'))) });
        break;
      case 'food':
        items.push({ k: 'food', n: Math.max(1, Math.round(rng.int(1, L === LOCATION_TYPES.warehouse ? 5 : 3) * amt('food'))) });
        break;
      case 'medkit':
        items.push({ k: 'medkit', n: rng.chance(0.2 * profile.mult.medicine) ? 2 : 1 });
        break;
      case 'ammo': {
        const t = rng.pick(L.ammo);
        items.push({ k: 'ammo', t, n: Math.max(1, Math.round(ammoPickup(rng, t, m) * amt('ammo'))) });
        break;
      }
      case 'weapon':
        items.push({ k: 'weapon', id: rollWeapon(rng, d, L.cats) });
        break;
      case 'trap':
        items.push({ k: 'trap', t: pickWeighted(rng, L.traps), n: rng.chance(0.3) ? 2 : 1 });
        break;
      case 'blueprint': {
        const mil = L === LOCATION_TYPES.military;
        items.push({ k: 'blueprint', t: pickWeighted(rng, { mg: mil ? 0.4 : 0.68, missile: mil ? 0.38 : 0.24, artillery: mil ? 0.22 : 0.08 }) });
        break;
      }
    }
  }
  return items;
}

// ---------------------------------------------------------------- loot helpers
export function describeItem(it) {
  switch (it.k) {
    case 'scrap':
      return `${it.n} scrap`;
    case 'coal':
      return `${it.n} coal`;
    case 'food':
      return `${it.n} food`;
    case 'medkit':
      return it.n > 1 ? `${it.n} med kits` : 'a med kit';
    case 'ammo':
      return `${it.n} ${AMMO[it.t].name.toLowerCase()}`;
    case 'weapon':
      return WEAPONS[it.id].name;
    case 'trap':
      return `${it.n} × ${{ bear: 'bear trap', mine: 'land mine', tripwire: 'tripwire spikes', kerosene: 'kerosene tank' }[it.t]}`;
    case 'blueprint':
      return `${{ mg: 'machine gun', missile: 'missile', artillery: 'artillery' }[it.t]} turret blueprint`;
  }
  return '';
}

// Merge a list of items into a short readable summary ("2 med kits, 30 scrap, Uzi").
export function summarizeItems(items) {
  const sum = new Map();
  const extra = [];
  for (const it of items) {
    if (it.k === 'weapon' || it.k === 'blueprint') {
      extra.push(describeItem(it));
      continue;
    }
    const key = it.k + ':' + (it.t || '');
    const cur = sum.get(key);
    if (cur) cur.n += it.n;
    else sum.set(key, { ...it });
  }
  return [...[...sum.values()].map(describeItem), ...extra];
}

// Ammo pools used by the weapons the camp owns.
export function ownedAmmoTypes(run) {
  return [...new Set(run.weapons.map((w) => WEAPONS[w.id].ammo).filter(Boolean))];
}

// Ammo only ever turns up for guns you have: anything else becomes ammo you
// can use (preferring what the building would stock), or scrap if you own no
// ranged weapons at all.
export function resolveAmmo(run, it, prefer = null) {
  if (it.k !== 'ammo') return it;
  const owned = ownedAmmoTypes(run);
  if (owned.includes(it.t)) return it;
  if (!owned.length) return { k: 'scrap', n: 4 + Math.floor(Math.random() * 9) };
  const pool = prefer ? owned.filter((t) => prefer.includes(t)) : [];
  const from = pool.length ? pool : owned;
  const t = from[Math.floor(Math.random() * from.length)];
  const avg = (k) => (AMMO[k] ? (AMMO[k].pickup[0] + AMMO[k].pickup[1]) / 2 : null);
  const scale = avg(it.t) ? it.n / avg(it.t) : 1;
  return { k: 'ammo', t, n: Math.max(1, Math.round(avg(t) * scale)) };
}

// Grant a container's worth of loot: weapons first (so ammo for a gun found in
// the same box counts), then everything else. Returns the items as granted.
export function grantLoot(run, items, prefer = null) {
  const order = [...items.filter((i) => i.k === 'weapon'), ...items.filter((i) => i.k !== 'weapon')];
  const out = [];
  for (const raw of order) {
    const it = resolveAmmo(run, raw, prefer);
    const w = grantItem(run, it);
    out.push({ ...it, weapon: w });
  }
  return out;
}

// Add an item to the run's stockpile. Returns the created weapon (if any).
export function grantItem(run, it) {
  switch (it.k) {
    case 'scrap':
      run.scrap += it.n;
      break;
    case 'coal':
      run.coal += it.n;
      break;
    case 'food':
      run.food += it.n;
      break;
    case 'medkit':
      run.medkits += it.n;
      break;
    case 'ammo':
      run.ammo[it.t] = (run.ammo[it.t] || 0) + it.n;
      break;
    case 'weapon':
      return addWeapon(run, it.id);
    case 'trap':
      run.traps[it.t] += it.n;
      break;
    case 'blueprint':
      run.blueprints[it.t]++;
      break;
  }
  return null;
}

export const minSearchHours = (run) => {
  const open = run.locality.locations.filter((l) => !l.searched && !l.claimed);
  return open.length ? Math.min(...open.map((l) => l.hours)) : Infinity;
};

// ---------------------------------------------------------------- expeditions
export function expeditionChance(run, s, loc) {
  const inst = s.weapon != null ? weaponByUid(run, s.weapon) : null;
  const pw = weaponPower(inst);
  const hpf = 0.55 + 0.45 * (s.hp / survivorMaxHp(s));
  const p = (0.96 - 0.13 * loc.difficulty + 0.06 * (s.level - 1) + 0.09 * (pw - 0.6)) * hpf;
  return Math.max(0.06, Math.min(0.96, p));
}

// Resolve every survivor sent out today. Returns report lines.
export function resolveExpeditions(run) {
  const lines = [];
  for (const ex of run.expeditions) {
    const s = run.survivors.find((v) => v.id === ex.survivorId);
    const loc = run.locality.locations.find((l) => l.id === ex.locId);
    if (!s || !loc) continue;
    const p = expeditionChance(run, s, loc);
    if (Math.random() < p) {
      const items = [];
      const L = LOCATION_TYPES[loc.type];
      for (const c of loc.containers) items.push(...grantLoot(run, c, L.ammo));
      const got = summarizeItems(items);
      loc.containers = [];
      for (const ns of loc.survivors) {
        if (run.survivors.filter((v) => v.status !== 'dead').length >= MAX_SURVIVORS) break;
        ns.status = 'camp';
        run.survivors.push(ns);
        run.stats.recruited++;
        got.push(`survivor ${ns.name}`);
      }
      loc.survivors = [];
      grantXp(s, 4 + loc.difficulty * 3);
      s.hp = Math.max(1, Math.round(s.hp - Math.random() * survivorMaxHp(s) * 0.25 * loc.difficulty * 0.4));
      s.status = 'camp';
      lines.push({ kind: 'good', text: `${s.name} returned from ${loc.name} with ${got.length ? got.join(', ') : 'nothing'}.` });
    } else {
      const inst = s.weapon != null ? weaponByUid(run, s.weapon) : null;
      s.status = 'dead';
      s.hp = 0;
      run.stats.lost++;
      if (inst) removeWeapon(run, inst.uid);
      lines.push({ kind: 'bad', text: `${s.name} never came back from ${loc.name}${inst ? `. The ${WEAPONS[inst.id].name} is gone with them` : ''}.` });
    }
    loc.searched = true;
    loc.claimed = false;
    run.stats.searched++;
  }
  run.expeditions = [];
  return lines;
}

// ---------------------------------------------------------------- food
// Everyone eats one ration at dawn. Anyone who goes without loses 30% of
// their maximum health, and can starve to death.
export const HUNGER_LOSS = 0.3;
export const mouthsToFeed = (run) => 1 + run.survivors.filter((s) => s.status !== 'dead').length;

export function dailyRations(run) {
  const lines = [];
  const eaters = run.survivors.filter((s) => s.status !== 'dead');
  const need = 1 + eaters.length;
  let fed = 0;
  let playerDied = false;
  // the player eats first, then survivors in the order they joined
  if (run.food > 0) {
    run.food--;
    fed++;
  } else {
    const loss = Math.round(playerMaxHp(run.player.level) * HUNGER_LOSS);
    run.player.hp -= loss;
    lines.push({ kind: 'bad', text: `There was nothing for you to eat. You lost ${loss} health.` });
    if (run.player.hp <= 0) {
      run.player.hp = 0;
      playerDied = true;
    }
  }
  for (const s of eaters) {
    if (run.food > 0) {
      run.food--;
      fed++;
      continue;
    }
    const loss = Math.round(survivorMaxHp(s) * HUNGER_LOSS);
    s.hp -= loss;
    if (s.hp <= 0) {
      s.hp = 0;
      s.status = 'dead';
      run.stats.lost++;
      const w = s.weapon != null ? weaponByUid(run, s.weapon) : null;
      if (w) unassign(run, w.uid);
      lines.push({ kind: 'bad', text: `${s.name} starved to death.${w ? ` Their ${WEAPONS[w.id].name} is back on the rack.` : ''}` });
    } else lines.push({ kind: 'bad', text: `${s.name} went hungry and lost ${loss} health.` });
  }
  const left = mouthsToFeed(run);
  lines.unshift({
    kind: fed === need ? 'good' : 'bad',
    text: `Breakfast: ${fed} of ${need} fed. ${run.food} food left${run.food < left ? ` — not enough for tomorrow (${left} needed)` : ''}.`,
  });
  return { lines, playerDied };
}

// ---------------------------------------------------------------- waves
export function waveComposition(run) {
  const w = run.wavesFaced + 1;
  const danger = run.locality.profile?.danger ?? 1;
  const dangerMul = 1 + 0.12 * Math.max(0, danger - 1);
  const total = Math.min(170, Math.round((10 + 6 * w + 0.45 * w * w + run.day * 0.6) * dangerMul));
  const weights = {
    walker: Math.max(0.2, 1.1 - 0.1 * (w - 1)),
    grunt: 0.4 + 0.03 * w,
    runner: 0.2 + 0.07 * w,
    hound: w >= 2 ? 0.1 + 0.03 * w : 0,
    fat: w >= 2 ? 0.12 + 0.04 * w : 0,
    rotter: w >= 3 ? 0.08 + 0.03 * w : 0,
    armored: w >= 4 ? 0.08 + 0.04 * w : 0,
    brute: w >= 5 ? 0.04 + 0.01 * w : 0,
  };
  const rng = new RNG((run.seed + run.day * 7919) >>> 0);
  const list = [];
  let brutes = 0;
  const bruteCap = w >= 5 ? 1 + Math.floor((w - 5) / 3) : 0;
  for (let i = 0; i < total; i++) {
    let t = pickWeighted(rng, weights);
    if (t === 'brute') {
      if (brutes >= bruteCap) t = 'fat';
      else brutes++;
    }
    list.push(t);
  }
  // heavies arrive later in the night
  const heavy = new Set(['brute', 'armored', 'rotter']);
  list.sort((a, b) => (heavy.has(a) ? 1 : 0) - (heavy.has(b) ? 1 : 0) + (rng.next() - 0.5) * 0.9);
  return {
    wave: w,
    list,
    hpMul: (1 + 0.1 * (w - 1)) * (1 + 0.05 * Math.max(0, danger - 1)),
    spdMul: Math.min(1.6, 1 + 0.035 * (w - 1)),
    dmgMul: 1 + 0.08 * (w - 1),
  };
}

// ---------------------------------------------------------------- regional map
export function regionalOptions(run) {
  const rng = new RNG((Math.random() * 0xffffffff) >>> 0);
  const biomes = rng.shuffle(BIOME_KEYS.slice());
  const out = [];
  for (let i = 0; i < 3; i++) {
    const biome = i < biomes.length ? biomes[i] : rng.pick(BIOME_KEYS);
    const profile = makeProfile(rng, run.localityCount + 1);
    const value = profileValue(profile);
    let coal;
    if (rng.chance(0.15)) coal = rng.int(2, 9); // the odd bargain (or rip-off)
    else coal = Math.round(2 + 8 * (value - 0.75) + run.localityCount / 4) + rng.int(-1, 1);
    out.push({
      biome,
      name: localityName(rng, biome),
      coal: Math.max(2, coal),
      profile,
      appraisal: appraisal(profile),
      dx: (i - 1) * 0.28 + rng.range(-0.06, 0.06),
      dy: rng.range(-0.08, 0.08),
    });
  }
  return out;
}

export function travel(run, opt) {
  // untriggered traps are packed back into the stockpile
  for (const t of run.placedTraps) run.traps[t.type]++;
  run.placedTraps = [];
  run.coal -= opt.coal;
  run.locality = generateLocality(run, opt.biome, opt.profile);
  run.region = { options: regionalOptions(run) };
  run.stats.localities++;
  run.expeditions = [];
}

// ---------------------------------------------------------------- persistence
export function saveRun(run) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(run));
  } catch (e) {
    /* storage unavailable */
  }
}
export function loadRun() {
  try {
    const s = localStorage.getItem(SAVE_KEY);
    if (!s) return null;
    const run = JSON.parse(s);
    if (!run || (run.version !== 2 && run.version !== 3)) return null;
    return migrateRun(run);
  } catch (e) {
    return null;
  }
}
// Bring older saves up to date (shared ammo pools, food, region profiles).
function migrateRun(run) {
  if (run.version === 2) {
    const a = run.ammo;
    const move = (from, to, k = 1) => {
      if (a[from]) a[to] = (a[to] || 0) + a[from] * k;
      delete a[from];
    };
    move('magnum', 'pistol');
    move('sniper', 'rifle');
    move('rockets', 'explosives');
    move('grenades40', 'explosives');
    move('grenade', 'explosives');
    move('molotov', 'fuel', 10);
    for (const k of AMMO_ORDER) a[k] = a[k] || 0;
    const remap = { magnum: 'pistol', sniper: 'rifle', rockets: 'explosives', grenades40: 'explosives', grenade: 'explosives', molotov: 'fuel' };
    for (const l of run.locality.locations) for (const c of l.containers) for (const it of c) if (it.k === 'ammo' && remap[it.t]) it.t = remap[it.t];
    run.food = run.food ?? 6;
    run.locality.profile = run.locality.profile || makeProfile(new RNG(run.locality.seed), run.localityCount, { danger: 1 });
    run.region = { options: regionalOptions(run) };
    run.version = 3;
  }
  return run;
}

export function clearRun() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (e) {
    /* ignore */
  }
}
export function bestNights() {
  try {
    return parseInt(localStorage.getItem(BEST_KEY) || '0', 10) || 0;
  } catch (e) {
    return 0;
  }
}
export function recordBest(n) {
  const b = Math.max(bestNights(), n);
  try {
    localStorage.setItem(BEST_KEY, String(b));
  } catch (e) {
    /* ignore */
  }
  return b;
}
