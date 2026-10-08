// The persistent state of one run (camp, inventory, survivors, the local and
// regional maps) plus the generators that create it. Pure data: everything
// here is JSON-serialisable so the run can be saved between sessions.
import { RNG } from './util.js';
import { BARRICADE, MAX_SURVIVORS } from './config.js';
import { WEAPONS, AMMO, AMMO_ORDER, weaponStats, weaponPower, rollWeapon, ammoPickup, upgradeCost } from './weapons.js';
import { CITIES, CITY, cityLabel, miles, citySize } from './cities.js';
import { mul as perkMul, add as perkAdd } from './perks.js';

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
  plains: {
    name: 'Plains',
    icon: '≋',
    ground: 'prairie',
    weather: 'dust',
    clouds: 0.35,
    cover: ['rock', 'bush', 'bush', 'car', 'stump', 'barrel', 'log', 'deadtree'],
    backdrop: 0x6a6448,
    tod: {
      day: { zen: 0x4a78b0, sky: 0xa8b8c8, fog: 0xb8b4a0, hemiS: 0xe8ecf0, hemiG: 0x7a6a40, sun: 0xfff0d4, sunI: 1.8, hemiI: 1.05, fogD: 0.006 },
      dusk: { zen: 0x2e2c56, sky: 0xc06a44, fog: 0x8a5038, hemiS: 0xffa070, hemiG: 0x4a2c1a, sun: 0xff8040, sunI: 1.05, hemiI: 0.6, fogD: 0.009 },
      night: { zen: 0x02030a, sky: 0x06070e, fog: 0x05060a, hemiS: 0x3e4a6e, hemiG: 0x10100c, sun: 0x8a96c8, sunI: 0.18, hemiI: 0.3, fogD: 0.017 },
    },
  },
  swamp: {
    name: 'Swamp',
    icon: '♒',
    ground: 'marsh',
    weather: 'rain',
    clouds: 0.7,
    cover: ['deadtree', 'deadtree', 'bush', 'bush', 'log', 'stump', 'car', 'rock'],
    backdrop: 0x24301e,
    tod: {
      day: { zen: 0x5a7480, sky: 0x92a098, fog: 0x8a9488, hemiS: 0xc8d0c4, hemiG: 0x3a4628, sun: 0xfff0d0, sunI: 1.45, hemiI: 1.05, fogD: 0.011 },
      dusk: { zen: 0x2c2c40, sky: 0x7a5a52, fog: 0x5a4a44, hemiS: 0xc89880, hemiG: 0x26241a, sun: 0xff9050, sunI: 0.85, hemiI: 0.6, fogD: 0.015 },
      night: { zen: 0x020406, sky: 0x05080a, fog: 0x050806, hemiS: 0x3a4a5a, hemiG: 0x0a0c08, sun: 0x8090b0, sunI: 0.15, hemiI: 0.3, fogD: 0.024 },
    },
  },
};
export const BIOME_KEYS = Object.keys(BIOMES);

// ---------------------------------------------------------------- locations
export const LOCATION_TYPES = {
  gas: {
    name: 'Gas Station', icon: '⛽', floors: [1, 1], diff: [1, 2], hours: 2, size: 18, band: 10, rooms: [3, 4], room: [3, 5], lot: [12, 7], containers: [4, 6], survivor: 0.15,
    theme: { wall: 'tile', wall2: 'concrete', floor: 'linoleum', ceil: 'ceiling' }, yard: 'asphalt',
    loot: { scrap: 3, coal: 2.5, medkit: 0.6, ammo: 1.6, weapon: 0.7, trap: 1.5, blueprint: 0.12, food: 2.2, battery: 1.4 },
    traps: { kerosene: 5, bear: 1, tripwire: 1, mine: 0 }, cats: ['melee', 'pistol', 'shotgun'], ammo: ['pistol', 'shells', 'fuel'],
    names: ['Gas-N-Go', 'Pump & Save', 'Route 9 Fuel', 'Stop-N-Fill', 'Last Chance Gas', 'Sunoco Mart', 'Hi-Way Fuel'],
  },
  home: {
    name: 'House', icon: '⌂', floors: [1, 2], diff: [1, 2], hours: 2, size: 18, band: 11, rooms: [4, 6], room: [2, 4], lot: [9, 6], containers: [5, 8], survivor: 0.3,
    theme: { wall: 'wallpaper', wall2: 'wood', floor: 'woodFloor', ceil: 'ceiling' }, yard: 'biome',
    loot: { scrap: 2, coal: 0.6, medkit: 2, ammo: 2, weapon: 1.4, trap: 0.7, blueprint: 0.08, food: 2.6, battery: 1.2 },
    traps: { bear: 3, kerosene: 1, tripwire: 1, mine: 0 }, cats: ['melee', 'pistol', 'shotgun', 'rifle', 'bow'], ammo: ['pistol', 'shells', 'arrows', 'rifle'],
    suffix: ['House', 'Farmhouse', 'Cottage', 'Residence', 'Cabin'],
  },
  apartment: {
    name: 'Apartment Block', icon: '▥', floors: [2, 3], diff: [2, 4], hours: 4, size: 32, rooms: [10, 14], room: [3, 6], lot: [12, 6], containers: [9, 14], survivor: 0.5,
    theme: { wall: 'wallpaper', wall2: 'brick', floor: 'carpet', ceil: 'ceiling' }, yard: 'asphalt',
    loot: { scrap: 2.2, coal: 0.7, medkit: 1.6, ammo: 2, weapon: 1.4, trap: 0.8, blueprint: 0.15, food: 2.4, battery: 1.0 },
    traps: { bear: 2, kerosene: 1, tripwire: 1, mine: 0 }, cats: ['melee', 'pistol', 'smg', 'shotgun', 'rifle', 'bow', 'thrown'], ammo: ['pistol', 'shells', 'rifle', 'fuel'],
    suffix: ['Apartments', 'Towers', 'Court', 'Flats'],
  },
  office: {
    name: 'Office Building', icon: '▤', floors: [2, 3], diff: [2, 3], hours: 3, size: 30, rooms: [7, 10], room: [4, 7], lot: [14, 7], containers: [7, 11], survivor: 0.25,
    theme: { wall: 'concrete', wall2: 'wallpaper', floor: 'carpet', ceil: 'ceiling' }, yard: 'asphalt',
    loot: { scrap: 3.6, coal: 0.5, medkit: 1, ammo: 1.2, weapon: 0.9, trap: 0.5, blueprint: 0.45, food: 0.8, battery: 1.1 },
    traps: { tripwire: 2, bear: 1, kerosene: 1, mine: 0 }, cats: ['melee', 'pistol', 'smg'], ammo: ['pistol', 'shells'],
    suffix: ['Offices', 'Tower', 'Plaza', 'Insurance', 'Tech Park'],
  },
  warehouse: {
    name: 'Warehouse', icon: '▦', floors: [1, 1], diff: [2, 4], hours: 3, size: 30, rooms: [3, 5], room: [6, 10], lot: [14, 7], containers: [8, 12], survivor: 0.2,
    theme: { wall: 'sheetMetal', wall2: 'concrete', floor: 'concrete', ceil: 'metal' }, yard: 'concreteSlab',
    loot: { scrap: 4.5, coal: 3, medkit: 0.6, ammo: 1.4, weapon: 0.9, trap: 2, blueprint: 0.7, food: 2.0, battery: 1.0 },
    traps: { bear: 2, tripwire: 2, kerosene: 3, mine: 1 }, cats: ['melee', 'shotgun', 'rifle', 'smg', 'thrown'], ammo: ['shells', 'rifle', 'fuel', 'pistol', 'explosives'],
    suffix: ['Warehouse', 'Depot', 'Storage', 'Freight', 'Distribution'],
  },
  police: {
    name: 'Police Station', icon: '★', floors: [1, 2], diff: [3, 4], hours: 3, size: 28, rooms: [7, 9], room: [3, 6], lot: [13, 7], containers: [7, 10], survivor: 0.3,
    theme: { wall: 'concrete', wall2: 'tile', floor: 'linoleum', ceil: 'ceiling' }, yard: 'asphalt',
    loot: { scrap: 1.6, coal: 0.4, medkit: 1.2, ammo: 3.6, weapon: 2.6, trap: 1.2, blueprint: 0.3, food: 0.8, battery: 0.8 },
    traps: { bear: 3, tripwire: 1, mine: 0.5, kerosene: 0.5 }, cats: ['pistol', 'smg', 'shotgun', 'rifle', 'sniper', 'melee', 'thrown'], ammo: ['pistol', 'shells', 'rifle', 'explosives'],
    suffix: ['Police Station', 'Precinct', 'Sheriff\'s Office', 'County Jail'],
  },
  hospital: {
    name: 'Hospital', icon: '✚', floors: [2, 3], diff: [3, 5], hours: 4, size: 34, rooms: [11, 15], room: [3, 6], lot: [14, 7], containers: [9, 14], survivor: 0.55,
    theme: { wall: 'tile', wall2: 'concrete', floor: 'linoleum', ceil: 'ceiling' }, yard: 'asphalt',
    loot: { scrap: 2, coal: 0.4, medkit: 4.5, ammo: 1.2, weapon: 0.9, trap: 0.6, blueprint: 0.25, food: 1.0, battery: 0.6 },
    traps: { bear: 1, tripwire: 2, kerosene: 1, mine: 0 }, cats: ['melee', 'pistol', 'smg'], ammo: ['pistol', 'shells'],
    suffix: ['Hospital', 'Medical Center', 'Clinic', 'General'],
  },
  military: {
    name: 'Military Base', icon: '✪', floors: [1, 2], diff: [4, 5], hours: 5, size: 36, rooms: [8, 11], room: [4, 8], lot: [14, 8], containers: [10, 14], survivor: 0.3,
    theme: { wall: 'concrete', wall2: 'sheetMetal', floor: 'concrete', ceil: 'metal' }, yard: 'dirt',
    loot: { scrap: 2.4, coal: 1.2, medkit: 1.4, ammo: 3.6, weapon: 2.8, trap: 2.2, blueprint: 1.4, food: 1.6, battery: 1.1 },
    traps: { mine: 4, bear: 1, tripwire: 1, kerosene: 1 }, cats: ['rifle', 'sniper', 'lmg', 'launcher', 'thrown', 'smg', 'shotgun'], ammo: ['rifle', 'explosives', 'shells', 'pistol'],
    names: ['Fort Vail', 'Camp Harlow', 'Outpost Kilo', 'Firebase Echo', 'Fort Tran', 'Depot 51', 'Camp Ridgeback'],
  },
  // only the downtowns of real cities have them
  skyscraper: {
    name: 'Skyscraper', icon: '▮', floors: [3, 4], diff: [3, 5], hours: 5, size: 30, rooms: [7, 10], room: [4, 7], lot: [16, 8], containers: [10, 15], survivor: 0.45,
    theme: { wall: 'concrete', wall2: 'wallpaper', floor: 'carpet', ceil: 'ceiling' }, yard: 'concreteSlab',
    loot: { scrap: 3.4, coal: 0.4, medkit: 1.6, ammo: 1.8, weapon: 1.5, trap: 0.6, blueprint: 0.6, food: 1.2, battery: 0.9 },
    traps: { tripwire: 2, bear: 1, kerosene: 1, mine: 0.3 }, cats: ['melee', 'pistol', 'smg', 'shotgun', 'rifle', 'sniper'], ammo: ['pistol', 'shells', 'rifle'],
    suffix: ['Tower', 'Center', 'Plaza', 'Building', 'Trust Tower', 'Financial Center'],
  },
  // ---- landmarks: one or two per city, where the city's character shows ----
  stadium: {
    name: 'Stadium', icon: '◎', landmark: true, floors: [1, 1], diff: [4, 6], hours: 5, size: 40, rooms: [6, 9], room: [3, 5], lot: [18, 9], containers: [12, 18], survivor: 0.85, horde: 1.6,
    theme: { wall: 'concrete', wall2: 'concrete', floor: 'concrete', ceil: 'metal' }, yard: 'asphalt',
    loot: { scrap: 2, coal: 0.6, medkit: 3, ammo: 2.4, weapon: 1.6, trap: 0.8, blueprint: 0.3, food: 4, battery: 1.4 },
    traps: { bear: 1, tripwire: 1, kerosene: 1, mine: 0.5 }, cats: ['pistol', 'shotgun', 'rifle', 'smg', 'melee'], ammo: ['pistol', 'shells', 'rifle'],
    blurb: 'The quarantine camp they set up on the field. Food, medicine and people, and a great many dead.',
  },
  railyard: {
    name: 'Rail Yard', icon: '⊞', landmark: true, floors: [1, 1], diff: [3, 5], hours: 4, size: 36, rooms: [4, 6], room: [6, 10], lot: [16, 8], containers: [10, 15], survivor: 0.3,
    theme: { wall: 'brick', wall2: 'sheetMetal', floor: 'concrete', ceil: 'metal' }, yard: 'dirt',
    loot: { scrap: 4.5, coal: 6, medkit: 0.5, ammo: 1.2, weapon: 0.8, trap: 1.6, blueprint: 1.6, food: 1.2, battery: 1.0 },
    traps: { kerosene: 3, bear: 1, tripwire: 1, mine: 1 }, cats: ['melee', 'shotgun', 'rifle', 'thrown'], ammo: ['shells', 'rifle', 'fuel', 'explosives'],
    blurb: 'Engine sheds full of coal, spares and turret plans.',
  },
  mall: {
    name: 'Shopping Mall', icon: '▣', landmark: true, floors: [2, 2], diff: [3, 5], hours: 5, size: 38, rooms: [12, 16], room: [2, 4], lot: [18, 8], containers: [14, 20], survivor: 0.6,
    theme: { wall: 'plaster', wall2: 'tile', floor: 'terrazzo', ceil: 'ceiling' }, yard: 'asphalt',
    loot: { scrap: 2.4, coal: 0.4, medkit: 1.6, ammo: 2, weapon: 1.8, trap: 0.8, blueprint: 0.3, food: 3, battery: 2.4 },
    traps: { tripwire: 2, bear: 1, kerosene: 1, mine: 0 }, cats: ['melee', 'pistol', 'shotgun', 'rifle', 'bow', 'smg'], ammo: ['pistol', 'shells', 'rifle', 'arrows'],
    blurb: 'Two floors of stores: groceries, sporting goods, batteries by the crate.',
  },
  grain: {
    name: 'Grain Co-op', icon: '⌸', landmark: true, floors: [1, 1], diff: [2, 4], hours: 3, size: 30, rooms: [4, 6], room: [6, 9], lot: [14, 8], containers: [9, 13], survivor: 0.4,
    theme: { wall: 'sheetMetal', wall2: 'wood', floor: 'concrete', ceil: 'metal' }, yard: 'dirt',
    loot: { scrap: 2, coal: 1.2, medkit: 0.5, ammo: 1, weapon: 0.6, trap: 1.4, blueprint: 0.2, food: 7, battery: 0.8 },
    traps: { bear: 3, kerosene: 1, tripwire: 1, mine: 0 }, cats: ['melee', 'shotgun', 'rifle', 'bow'], ammo: ['shells', 'rifle', 'arrows'],
    blurb: 'Sacks of grain and feed for a whole county, under the elevators.',
  },
  mine: {
    name: 'Coal Mine', icon: '⛏', landmark: true, floors: [1, 1], diff: [3, 5], hours: 4, size: 32, rooms: [4, 6], room: [6, 9], lot: [14, 8], containers: [9, 13], survivor: 0.3,
    theme: { wall: 'stoneBlocks', wall2: 'wood', floor: 'dirt', ceil: 'wood' }, yard: 'dirt',
    loot: { scrap: 2.6, coal: 8, medkit: 0.5, ammo: 0.8, weapon: 0.6, trap: 2.2, blueprint: 0.4, food: 0.8, battery: 1.8 },
    traps: { mine: 3, kerosene: 2, bear: 1, tripwire: 1 }, cats: ['melee', 'shotgun', 'thrown'], ammo: ['shells', 'explosives', 'fuel'],
    blurb: 'The pithead and its sheds. Coal by the ton, and blasting powder.',
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
  skyscraper: { scrap: 0.8, survivors: 0.5, weapons: 0.3 },
};
// Which profile entry scales each kind of loot.
const LOOT_KEY = { scrap: 'scrap', coal: 'coal', medkit: 'medicine', ammo: 'ammo', weapon: 'weapons', food: 'food', battery: 'scrap' };

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
  // the player (the only record without a name) gets a perk point a level
  if (gained && !rec.name) rec.perkPoints = (rec.perkPoints || 0) + gained;
  return gained;
}

export const playerMaxHp = (lvl) => 100 + 10 * (lvl - 1);
export const playerMaxStamina = (lvl) => 100 + 8 * (lvl - 1);
export const playerSpeedMul = (lvl) => Math.min(1.25, 1 + 0.015 * (lvl - 1));

export const survivorMaxHp = (s) => s.hpBase + 10 * (s.level - 1) + (s.prof === 'soldier' ? soldierHp(s) : 0);

// ---------------------------------------------------------------- professions
// What a survivor did before. Citizens are most people; the others bring a
// skill that grows as they level up.
export const PROFS = {
  citizen: { name: 'Citizen', icon: '', weight: 0.55 },
  doctor: { name: 'Doctor', icon: '✚', weight: 0.15 },
  soldier: { name: 'Soldier', icon: '✪', weight: 0.15 },
  carpenter: { name: 'Carpenter', icon: '⚒', weight: 0.15 },
};
export const doctorHeal = (s) => 0.25 + 0.025 * (s.level - 1); // share of everyone's health each dawn
export const carpenterRepair = (s) => 0.25 + 0.025 * (s.level - 1); // share of the barricade each dawn
export const soldierHp = (s) => 25 + 5 * (s.level - 1);
export const soldierDmg = (s) => 1.2 + 0.03 * (s.level - 1);
export function profSkill(s) {
  switch (s.prof) {
    case 'doctor':
      return `Heals everyone ${Math.round(doctorHeal(s) * 100)}% each dawn.`;
    case 'carpenter':
      return `Repairs ${Math.round(carpenterRepair(s) * 100)}% of the barricade each dawn.`;
    case 'soldier':
      return `+${soldierHp(s)} health, +${Math.round((soldierDmg(s) - 1) * 100)}% damage.`;
    default:
      return s.dog ? '' : 'Nothing special, but a pair of hands.';
  }
}
export function rollProf(rng) {
  let r = rng.next();
  for (const [k, p] of Object.entries(PROFS)) {
    r -= p.weight;
    if (r <= 0) return k;
  }
  return 'citizen';
}
// A survivor's name with what they do, e.g. "Dr. Ann Lee" or "Sgt. Bo Hart".
export function survivorTitle(s) {
  if (s.dog) return s.name;
  const pre = { doctor: 'Dr. ', soldier: 'Sgt. ' }[s.prof] || '';
  return pre + s.name;
}

// Each dawn: doctors tend the wounded and carpenters patch the barricade
// (several of either stack), plus the Bedside Manner perk.
export function dawnCare(run) {
  const lines = [];
  const here = run.survivors.filter((s) => s.status !== 'dead' && s.hp > 0);
  const docs = here.filter((s) => s.prof === 'doctor');
  const heal = docs.reduce((a, s) => a + doctorHeal(s), 0) + perkAdd(run, 'squadHeal');
  if (heal > 0) {
    const pmax = playerMaxHp(run.player.level) + perkAdd(run, 'hp');
    run.player.hp = Math.min(pmax, run.player.hp + pmax * heal);
    for (const s of here) s.hp = Math.min(survivorMaxHp(s), s.hp + survivorMaxHp(s) * heal);
    if (docs.length) lines.push({ kind: 'good', text: `${docs.map(survivorTitle).join(' and ')} ${docs.length > 1 ? 'tend' : 'tends'} to everyone's wounds (+${Math.round(heal * 100)}% health).` });
    else lines.push({ kind: 'good', text: `You check on everyone at first light (+${Math.round(heal * 100)}% health).` });
  }
  const carps = here.filter((s) => s.prof === 'carpenter');
  const fix = carps.reduce((a, s) => a + carpenterRepair(s), 0);
  const b = run.barricade;
  const max = barricadeMax(run);
  if (fix > 0 && b.hp < max) {
    const before = b.hp;
    b.hp = Math.min(max, b.hp + max * fix);
    lines.push({ kind: 'good', text: `${carps.map(survivorTitle).join(' and ')} ${carps.length > 1 ? 'patch' : 'patches'} up the barricade (+${Math.round(b.hp - before)}).` });
  }
  return lines;
}
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
    prof: rollProf(rng),
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

const DOG_NAMES = ['Rex', 'Bear', 'Scout', 'Duke', 'Luna', 'Maggie', 'Rocco', 'Bandit', 'Ziggy', 'Sadie', 'Hank', 'Ghost', 'Tank', 'Juno', 'Biscuit', 'Ranger', 'Pepper', 'Moose'];
const DOG_BREEDS = [
  { breed: 'German Shepherd', coat: 0x6a4a2a, coat2: 0x1e1612, size: 1.0 },
  { breed: 'Labrador', coat: 0xc8a060, coat2: 0xb08850, size: 0.95 },
  { breed: 'Black Lab', coat: 0x1c1a18, coat2: 0x262220, size: 0.95 },
  { breed: 'Pit Bull', coat: 0x8a8078, coat2: 0xe0d8d0, size: 0.85 },
  { breed: 'Husky', coat: 0x7a7e86, coat2: 0xe8e8ea, size: 0.95 },
  { breed: 'Rottweiler', coat: 0x16120e, coat2: 0x8a4a20, size: 1.05 },
  { breed: 'Mutt', coat: 0x7a5a3a, coat2: 0xd0b890, size: 0.85 },
];

// A dog: fast, bites hard, can't carry a gun and won't go scavenging alone.
export function makeDog(run, rng, level) {
  const b = rng.pick(DOG_BREEDS);
  const s = {
    id: run.nextSurvivorId++,
    name: rng.pick(DOG_NAMES),
    dog: true,
    level,
    xp: 0,
    hpBase: Math.round(rng.int(42, 58) * b.size),
    speedBase: rng.range(5.2, 6.0),
    stamBase: rng.int(110, 140),
    weapon: null,
    status: 'found',
    kills: 0,
    look: { breed: b.breed, coat: b.coat, coat2: b.coat2, size: b.size },
  };
  s.hp = survivorMaxHp(s);
  return s;
}
export const DOG_BITE = (s) => 16 + 3 * (s.level - 1);

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
    version: 6,
    seed,
    startDoy: 70 + ((seed >>> 3) % 25),
    day: 1,
    hours: 12,
    phase: 'day',
    scrap: 60,
    coal: 2,
    medkits: 2,
    food: 6,
    batteries: 2,
    keys: [],
    notes: [],
    city: null,
    route: [],
    ammo: Object.fromEntries(AMMO_ORDER.map((k) => [k, 0])),
    traps: { bear: 2, mine: 0, tripwire: 0, kerosene: 0 },
    blueprints: { mg: 0, missile: 0, artillery: 0 },
    weapons: [],
    nextUid: 1,
    loadout: { primary: null, secondary: null },
    player: { level: 1, xp: 0, hp: playerMaxHp(1), kills: 0, battery: 1, perks: [], perkPoints: 0 },
    survivors: [],
    nextSurvivorId: 1,
    barricade: { level: 0, hp: BARRICADE.baseHp },
    turrets: [null, null, null, null, null],
    placedTraps: [],
    localityCount: 0,
    wavesFaced: 0,
    expeditions: [],
    report: [],
    stats: { kills: 0, waves: 0, quietNights: 0, localities: 1, searched: 0, recruited: 0, lost: 0, miles: 0 },
  };
  run.ammo.pistol = 60;
  const g = addWeapon(run, 'glock');
  const k = addWeapon(run, 'knife');
  run.loadout.primary = g.uid;
  run.loadout.secondary = k.uid;
  const rng = new RNG(seed);
  // the run starts somewhere small and fairly quiet
  const start = rng.pick(CITIES.filter((c) => c.pop <= 600 && !c.tags.includes('military')));
  arriveAt(run, start, cityProfile(start, rng));
  // enough coal for the nearest hop
  run.coal = Math.max(2, Math.min(...run.region.options.map((o) => o.coal)));
  return run;
}

// ---------------------------------------------------------------- seasons
// The calendar moves on four days with every day of the run, starting in
// early spring. Seasons change the light, the land and the dead.
export const CAL_STEP = 4;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTH_START = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
export const SEASONS = {
  spring: { name: 'Spring', icon: '❀', hours: 12, wave: 1.0, spd: 1.0, note: 'Rain and mud. The dead are restless.' },
  summer: { name: 'Summer', icon: '☀', hours: 14, wave: 1.25, spd: 1.08, note: 'Long days, and the dead come in great numbers.' },
  autumn: { name: 'Autumn', icon: '❦', hours: 11, wave: 1.08, spd: 1.0, note: 'Harvest time: farms are full of food.' },
  winter: { name: 'Winter', icon: '❄', hours: 10, wave: 0.9, spd: 0.85, note: 'Short days, bitter nights. Keep coal for the stove.' },
};
export function dayOfYear(run) {
  return ((run.startDoy ?? 80) + (run.day - 1) * CAL_STEP) % 365;
}
export function calendar(run) {
  const d = dayOfYear(run);
  let m = 11;
  while (m > 0 && MONTH_START[m] > d) m--;
  return { month: MONTHS[m], date: d - MONTH_START[m] + 1, m };
}
export function season(run) {
  const { m } = calendar(run);
  return m === 11 || m <= 1 ? 'winter' : m <= 4 ? 'spring' : m <= 7 ? 'summer' : 'autumn';
}
export const dayHours = (run) => SEASONS[season(run)].hours;
// How a city looks in a season: snow lies in the north in winter, and the
// cold north thaws in summer.
export function seasonalBiome(city, seasonKey) {
  const b = city.biome;
  if (seasonKey === 'winter' && city.lat >= 36.5 && b !== 'desert') return 'tundra';
  if (seasonKey === 'winter' && city.lat >= 34 && (b === 'forest' || b === 'plains')) return 'tundra';
  if (seasonKey === 'summer' && b === 'tundra') return city.lon < -100 ? 'plains' : 'forest';
  if (seasonKey === 'autumn' && b === 'tundra' && city.lat < 44) return city.lon < -100 ? 'plains' : 'forest';
  return b;
}
// A night is cold enough to need the stove where there's snow on the ground.
export const coldNight = (run) => season(run) === 'winter' && run.locality.biome === 'tundra';

// Every seventh night the moon rises red and the dead come for certain.
export const bloodMoon = (run) => run.day % 7 === 0;

export const barricadeMax = (run) => BARRICADE.baseHp + BARRICADE.perLevel * run.barricade.level + perkAdd(run, 'barricade');
// Perk-adjusted costs and times.
export const searchHours = (run, loc) => Math.max(1, loc.hours - perkAdd(run, 'searchCut'));
export const tripCoal = (run, opt) => Math.max(1, opt.coal - perkAdd(run, 'coalCut'));
export const hpPerScrap = (run) => BARRICADE.hpPerScrap / perkMul(run, 'repairMul');
export const upgCost = (run, def, lv) => Math.ceil(upgradeCost(def, lv) * perkMul(run, 'upgradeMul'));
export const reinforceCost = (run) => Math.ceil(BARRICADE.improveCost(run.barricade.level) * perkMul(run, 'reinforceMul'));
export const waveChance = (run) => (bloodMoon(run) ? 1 : Math.min(1, 0.55 + 0.015 * (run.day - 1)));

// ---------------------------------------------------------------- cities
// What a city is likely to hold follows from what it really is: its size
// (metro population), what it's known for (farms, coal, industry, hospitals,
// bases, a port) and a reputation of its own, plus a little luck per visit.
const SIZE_MULT = {
  survivors: [0.7, 0.95, 1.2, 1.5],
  weapons: [0.85, 1, 1.12, 1.25],
  ammo: [0.9, 1, 1.1, 1.2],
  food: [1.5, 1.15, 0.9, 0.7],
  medicine: [0.6, 0.9, 1.15, 1.4],
  coal: [1.4, 1.1, 0.9, 0.75],
  scrap: [0.8, 1, 1.2, 1.45],
};
const TAG_MULT = {
  farm: { food: 1.7 },
  coal: { coal: 2.0 },
  industry: { scrap: 1.6, coal: 1.15 },
  medical: { medicine: 1.8 },
  military: { weapons: 1.7, ammo: 1.7 },
  port: { food: 1.2, scrap: 1.2 },
};
export const TAG_NAMES = { farm: 'farm country', coal: 'coal country', industry: 'industrial', medical: 'hospitals', military: 'military bases', port: 'port' };

function hashStr(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
}

// Danger follows the size of the place: more people, more dead.
export const cityDanger = (c) => (c.pop < 250 ? 0 : c.pop < 1000 ? 1 : c.pop < 4000 ? 2 : 3);

export function cityProfile(city, rng, seasonKey = null) {
  const size = citySize(city);
  const rep = new RNG(hashStr(city.id));
  const mult = {};
  for (const k of RES_KEYS) {
    let m = SIZE_MULT[k][size];
    for (const t of city.tags) m *= TAG_MULT[t][k] || 1;
    m *= Math.exp(rep.range(-0.18, 0.18)) * Math.exp(rng.range(-0.12, 0.12));
    // the harvest is in during autumn; winter larders run thin
    if (k === 'food' && seasonKey === 'autumn') m *= city.tags.includes('farm') ? 1.45 : 1.15;
    if (k === 'food' && seasonKey === 'winter') m *= 0.8;
    mult[k] = Math.round(Math.max(0.3, Math.min(2.4, m)) * 100) / 100;
  }
  return { mult, danger: cityDanger(city) };
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

// The kinds of buildings a place has, by size: towns are houses and gas
// stations, metropolises are apartment blocks, offices and skyscrapers.
const TYPE_BASE = [
  { gas: 4, home: 6, apartment: 0.6, office: 0.6, warehouse: 2, police: 1, hospital: 0.5, skyscraper: 0 },
  { gas: 3, home: 4, apartment: 2, office: 1.6, warehouse: 2, police: 1.4, hospital: 1.2, skyscraper: 0 },
  { gas: 2.4, home: 3, apartment: 3, office: 2.4, warehouse: 2, police: 1.6, hospital: 1.6, skyscraper: 0.7 },
  { gas: 1.6, home: 1.6, apartment: 3.6, office: 3, warehouse: 1.8, police: 1.8, hospital: 2, skyscraper: 2.4 },
];
const TAG_TYPES = { farm: { home: 1.3, gas: 1.2 }, industry: { warehouse: 1.6 }, medical: { hospital: 1.3 }, port: { warehouse: 1.3 } };

export function generateLocality(run, city, profile) {
  run.localityCount++;
  const index = run.localityCount;
  const seed = (Math.random() * 0xffffffff) >>> 0;
  const rng = new RNG(seed);
  const size = citySize(city);
  profile = profile || cityProfile(city, rng, season(run));
  const loc = { seed, biome: seasonalBiome(city, season(run)), city: city.id, size, index, profile, name: cityLabel(city), locations: [] };
  const n = [rng.int(5, 7), rng.int(7, 9), rng.int(9, 11), rng.int(11, 13)][size];
  const typeW = { ...TYPE_BASE[size] };
  typeW.military = city.tags.includes('military') ? 1.6 : Math.min(0.45, 0.1 + 0.03 * index);
  for (const t of city.tags) for (const k in TAG_TYPES[t] || {}) typeW[k] *= TAG_TYPES[t][k];
  for (const t in typeW) {
    for (const k in AFFINITY[t]) typeW[t] *= Math.pow(profile.mult[k], AFFINITY[t][k]);
    typeW[t] *= rng.range(0.8, 1.25);
  }
  const types = [];
  for (let i = 0; i < n; i++) types.push(pickWeighted(rng, typeW));
  // what a place is famous for is there to be found
  const ensure = (t, i) => {
    if (!types.includes(t)) types[i] = t;
  };
  if (size === 3) ensure('skyscraper', n - 1);
  if (city.tags.includes('military') && rng.chance(0.85)) ensure('military', n - 2);
  if (city.tags.includes('medical')) ensure('hospital', n - 3);
  // the first two of a run are quick, nearby searches so a fresh camp has options
  if (index === 1) {
    types[0] = 'home';
    types[1] = 'gas';
  }
  const placed = [];
  const gap = n > 10 ? 0.12 : 0.14;
  const used = new Set();
  for (let i = 0; i < n; i++) {
    let x = 0;
    let y = 0;
    for (let a = 0; a < 80; a++) {
      x = rng.range(0.08, 0.92);
      y = rng.range(0.1, 0.9);
      if (Math.hypot(x - 0.5, y - 0.5) < 0.16) continue;
      if (placed.every((p) => Math.hypot(p.x - x, p.y - y) > gap)) break;
    }
    placed.push({ x, y });
    loc.locations.push(generateLocation(run, rng, types[i], index, profile, x, y, used));
  }
  // landmarks: what the city is known for
  const marks = landmarksFor(city, size, rng);
  for (const t of marks) {
    let x = 0;
    let y = 0;
    for (let a = 0; a < 80; a++) {
      x = rng.range(0.1, 0.9);
      y = rng.range(0.12, 0.88);
      if (Math.hypot(x - 0.5, y - 0.5) < 0.2) continue;
      if (placed.every((p) => Math.hypot(p.x - x, p.y - y) > gap)) break;
    }
    placed.push({ x, y });
    const l = generateLocation(run, rng, t, index, profile, x, y, used);
    l.name = landmarkName(t, city, rng);
    l.landmark = true;
    loc.locations.push(l);
  }
  addLocksAndNotes(rng, loc);
  return loc;
}

// Which landmarks a city has: big cities their stadium and mall, railroad
// and industrial towns a yard, farm country a grain co-op, coal country a mine.
function landmarksFor(city, size, rng) {
  const c = [];
  const tags = city.tags;
  if (tags.includes('coal')) c.push(['mine', 0.95]);
  if (tags.includes('farm')) c.push(['grain', 0.85]);
  if (tags.includes('industry') || tags.includes('port') || tags.includes('coal') || size >= 2) c.push(['railyard', size >= 2 ? 0.55 : 0.75]);
  if (size >= 3) c.push(['stadium', 0.9]);
  else if (size === 2) c.push(['stadium', 0.35]);
  if (size >= 2) c.push(['mall', size >= 3 ? 0.7 : 0.45]);
  if (size === 1 && !c.length) c.push(['mall', 0.25]);
  const out = [];
  for (const [t, p] of rng.shuffle(c)) if (out.length < (size >= 3 ? 2 : 1) && rng.chance(p)) out.push(t);
  return out;
}

const STADIUM_NAMES = ['Memorial Stadium', 'Veterans Stadium', 'Municipal Stadium', 'Field', 'Coliseum', 'Bowl'];
const MINE_NAMES = ['Black Diamond Mine', 'Big Hollow Mine', 'Number Nine Mine', 'Consolidation No. 4', 'Red Ash Colliery', 'Bear Creek Mine'];
function landmarkName(type, city, rng) {
  const n = city.name;
  switch (type) {
    case 'stadium':
      return `${n} ${rng.pick(STADIUM_NAMES)}`;
    case 'railyard':
      return `${n} ${rng.pick(['Rail Yard', 'Union Yard', 'Freight Yard', 'Roundhouse'])}`;
    case 'mall':
      return rng.pick([`${n} Galleria`, `${n} Mall`, `${rng.pick(STREETS)} Square Mall`, `${rng.pick(STREETS)} Town Center`]);
    case 'grain':
      return `${n} ${rng.pick(['Grain Co-op', 'Farmers Elevator', 'Grain & Feed'])}`;
    case 'mine':
      return rng.pick(MINE_NAMES);
  }
  return n;
}

// ---------------------------------------------------------------- keys, locked gates, notes
const VAULTS = {
  gas: 'stockroom cage',
  home: 'gun safe room',
  apartment: 'super\'s storage cage',
  office: 'server room',
  warehouse: 'secure cage',
  police: 'evidence locker',
  hospital: 'pharmacy',
  military: 'armory',
  skyscraper: 'executive vault',
  stadium: 'quarantine supply cage',
  railyard: 'parts store',
  mall: 'gun counter',
  grain: 'seed vault',
  mine: 'powder magazine',
};
const KEY_HINTS = [
  (k, v) => `Whoever reads this — the key to the ${v} is at ${k}. I couldn't get back for it.`,
  (k, v) => `Locked the ${v} and ran. Spare key's at ${k}, top drawer. — M.`,
  (k, v) => `DON'T lose the key again. It stays at ${k}. The ${v} stays shut.`,
  (k, v) => `Dad hid the ${v} key at ${k}. Said nobody would think to look there.`,
  (k, v) => `Shift notes: ${v} key moved to ${k} after the evacuation order.`,
];
const FLAVOR_NOTES = [
  'Day 9. They come when the lights are on. Keep the lights off.',
  'Mom — we went to the train yard. Please follow us. Please.',
  'If you\'re reading this, the stairwell on the east side is clear. Was clear.',
  'Ran out of insulin today. Going to try the pharmacy downtown.',
  'They can smell blood. Don\'t bleed. Ha.',
  'Grocery list: bread, batteries, BATTERIES, shotgun shells, more batteries.',
  'Fire drill is cancelled until further notice. — Management',
  'The radio says the trains still run west. I don\'t believe it.',
  'Sorry about the door. We needed the wood.',
  'Dog food on the bottom shelf. Leave some for the next one.',
  'I heard them on the floor above all night. Scratching.',
  'Happy birthday Ellie. Daddy loves you. We\'ll celebrate when this is over.',
  'Quarantine checkpoint moved to the stadium. Bring ID.',
  'Don\'t go in the basement. Just don\'t.',
];

function addLocksAndNotes(rng, loc) {
  const L = loc.locations;
  const lockCount = loc.size >= 2 ? (rng.chance(0.75) ? 2 : 1) : rng.chance(0.75) ? 1 : 0;
  const cands = rng.shuffle(L.filter((l) => l.type !== 'gas'));
  for (let i = 0; i < lockCount && i < cands.length; i++) {
    const lock = cands[i];
    const keyAt = rng.pick(L.filter((l) => l !== lock && !l.key));
    if (!keyAt) break;
    const vault = VAULTS[lock.type];
    const LT = LOCATION_TYPES[lock.type];
    // the vault holds the good stuff
    const w = { weapon: 3, ammo: 2.2, medkit: 1.6, blueprint: 1.2, battery: 0.8, scrap: 1 };
    const boxes = [];
    for (let k = rng.int(2, 3); k > 0; k--) {
      const c = rollContainer(rng, LT, Math.min(6, lock.difficulty + 2), w, loc.profile);
      boxes.push(c.length ? c : [{ k: 'scrap', n: rng.int(20, 40) }]);
    }
    lock.lock = { id: lock.id, vault, keyAt: keyAt.id, boxes, opened: false, seen: false, hint: false };
    keyAt.key = { opens: lock.id, label: `${lock.name} key` };
    const text = rng.pick(KEY_HINTS)(keyAt.name, vault);
    // usually there's a note at the gate itself; sometimes it's somewhere else
    const r = rng.next();
    if (r < 0.7) lock.lock.note = text;
    else if (r < 0.92) {
      const other = rng.pick(L.filter((l) => l !== lock && l !== keyAt)) || keyAt;
      (other.notes = other.notes || []).push({ text, hint: lock.id });
    }
  }
  for (const l of L) if (rng.chance(0.45)) (l.notes = l.notes || []).push({ text: rng.pick(FLAVOR_NOTES) });
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
    else if (L.landmark) name = L.name; // named after its city by the caller
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
    floors: rng.int(L.floors[0], L.floors[1]),
    searched: false,
    containers: [],
    survivors: [],
    batteries: rng.chance(0.75) ? rng.int(1, 3) : 0,
    // now and then nobody (and nothing) is home; never a landmark
    empty: !LOCATION_TYPES[type].landmark && rng.chance(0.14),
    // rarely, armed raiders have claimed a place
    raiders: index >= 2 && difficulty >= 2 && rng.chance(0.06),
  };
  if (out.empty) out.raiders = false;
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
  // strays hole up in homes and garages; police and army dogs stay near their posts
  const dogChance = { home: 0.14, gas: 0.1, warehouse: 0.12, police: 0.2, military: 0.18 }[type] ?? 0.06;
  if (rng.chance(dogChance * 0.85 * Math.sqrt(profile.mult.survivors))) out.survivors.push(makeDog(run, rng, rng.int(1, 1 + Math.ceil(difficulty / 2))));
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
      case 'battery':
        items.push({ k: 'battery', n: rng.chance(0.3) ? 2 : 1 });
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
    case 'battery':
      return it.n > 1 ? `${it.n} batteries` : 'a battery';
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
    case 'battery':
      run.batteries += it.n;
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
  return open.length ? Math.min(...open.map((l) => searchHours(run, l))) : Infinity;
};

// A searched place is done with, unless a locked gate is still waiting for
// its key: then it can be searched again.
export function finishSearch(loc) {
  if (loc.lock && !loc.lock.opened) {
    loc.visited = true;
    loc.searched = false;
  } else loc.searched = true;
}

// ---------------------------------------------------------------- expeditions
export function expeditionChance(run, s, loc) {
  const inst = s.weapon != null ? weaponByUid(run, s.weapon) : null;
  const pw = weaponPower(inst);
  const hpf = 0.55 + 0.45 * (s.hp / survivorMaxHp(s));
  const p = (0.96 - 0.13 * loc.difficulty + 0.06 * (s.level - 1) + 0.09 * (pw - 0.6)) * hpf;
  return Math.max(0.06, Math.min(0.96, p + perkAdd(run, 'expedition')));
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
      if (loc.key && !run.keys.includes(loc.key.opens)) {
        run.keys.push(loc.key.opens);
        got.push(`the ${loc.key.label}`);
      }
      if (loc.lock && !loc.lock.opened && run.keys.includes(loc.lock.id)) {
        loc.lock.opened = true;
        for (const c of loc.lock.boxes) items.push(...grantLoot(run, c, L.ammo));
        got.length = 0;
        got.push(...summarizeItems(items));
      }
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
    finishSearch(loc);
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
    const loss = Math.round(playerMaxHp(run.player.level) * HUNGER_LOSS * perkMul(run, 'hungerMul'));
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
  const dangerMul = 1 + 0.15 * Math.max(0, danger - 1);
  const se = SEASONS[season(run)];
  const moon = bloodMoon(run);
  const total = Math.min(260, Math.round((14 + 8 * w + 0.6 * w * w + run.day * 0.8) * dangerMul * se.wave * (moon ? 1.6 : 1)));
  const weights = {
    walker: Math.max(0.2, 1.0 - 0.1 * (w - 1)),
    grunt: 0.45 + 0.04 * w,
    runner: 0.3 + 0.08 * w,
    hound: 0.08 + 0.04 * w,
    fat: w >= 2 ? 0.14 + 0.05 * w : 0,
    rotter: w >= 2 ? 0.08 + 0.04 * w : 0,
    spitter: w >= 3 ? 0.06 + 0.025 * w : 0,
    armored: w >= 3 ? 0.08 + 0.05 * w : 0,
    brute: w >= 4 ? 0.05 + 0.015 * w : 0,
  };
  const rng = new RNG((run.seed + run.day * 7919) >>> 0);
  const list = [];
  let brutes = 0;
  let spitters = 0;
  const bruteCap = w >= 4 ? 1 + Math.floor((w - 4) / 2) + (moon ? 1 : 0) : 0;
  const spitCap = 3 + Math.floor(w / 2);
  for (let i = 0; i < total; i++) {
    let t = pickWeighted(rng, weights);
    if (t === 'brute') {
      if (brutes >= bruteCap) t = 'fat';
      else brutes++;
    }
    if (t === 'spitter') {
      if (spitters >= spitCap) t = 'runner';
      else spitters++;
    }
    list.push(t);
  }
  // heavies arrive later in the night
  const heavy = new Set(['brute', 'armored', 'rotter', 'spitter']);
  list.sort((a, b) => (heavy.has(a) ? 1 : 0) - (heavy.has(b) ? 1 : 0) + (rng.next() - 0.5) * 0.9);
  return {
    wave: w,
    list,
    bloodMoon: moon,
    season: season(run),
    hpMul: (1 + 0.12 * (w - 1)) * (1 + 0.06 * Math.max(0, danger - 1)) * (moon ? 1.2 : 1),
    spdMul: Math.min(1.75, (1 + 0.04 * (w - 1)) * se.spd * (moon ? 1.1 : 1)),
    dmgMul: 1 + 0.1 * (w - 1),
  };
}

// ---------------------------------------------------------------- regional map
// The next stops are real cities near this one: the closest places the
// train hasn't been, plus a longer haul to a bigger city when there is one.
// Coal is set by the real distance.
export const coalFor = (mi) => Math.max(2, Math.round(mi / 100));

function cityOption(run, city, rng, from) {
  const mi = Math.round(miles(from, city));
  const profile = cityProfile(city, rng, season(run));
  return { city: city.id, biome: seasonalBiome(city, season(run)), name: cityLabel(city), miles: mi, coal: coalFor(mi), size: citySize(city), profile, appraisal: appraisal(profile) };
}

export function regionalOptions(run) {
  const rng = new RNG((Math.random() * 0xffffffff) >>> 0);
  const here = CITY[run.city];
  const seen = new Set(run.route);
  const byDist = CITIES.filter((c) => c !== here)
    .map((c) => ({ c, d: miles(here, c) }))
    .sort((a, b) => a.d - b.d);
  const fresh = byDist.filter((e) => !seen.has(e.c.id));
  const pool = fresh.length >= 3 ? fresh : byDist;
  const picks = pool.slice(0, 3).map((e) => e.c);
  const far = pool.find((e) => !picks.includes(e.c) && e.d > 250 && e.d < 750 && citySize(e.c) >= 2 && citySize(e.c) > citySize(here) - 1);
  if (far) picks.push(far.c);
  else if (pool[3]) picks.push(pool[3].c);
  return picks.map((c) => cityOption(run, c, rng, here));
}

function arriveAt(run, city, profile) {
  run.city = city.id;
  run.route.push(city.id);
  run.keys = [];
  run.locality = generateLocality(run, city, profile);
  run.region = { options: regionalOptions(run) };
}

export function travel(run, opt) {
  // untriggered traps are packed back into the stockpile
  for (const t of run.placedTraps) run.traps[t.type]++;
  run.placedTraps = [];
  run.coal -= tripCoal(run, opt);
  run.stats.miles = (run.stats.miles || 0) + (opt.miles || 0);
  arriveAt(run, CITY[opt.city], opt.profile);
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
    if (!run || run.version < 2 || run.version > 6) return null;
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
    run.version = 3;
  }
  if (run.version === 3) {
    // place the old run somewhere real
    const rng = new RNG(run.seed);
    const c = rng.pick(CITIES.filter((x) => x.biome === run.locality.biome && x.pop <= 1500)) || CITIES[0];
    run.city = c.id;
    run.route = [c.id];
    run.locality.city = c.id;
    run.locality.name = cityLabel(c);
    run.locality.size = citySize(c);
    run.batteries = 2;
    run.keys = [];
    run.notes = [];
    run.player.battery = 1;
    for (const l of run.locality.locations) l.floors = l.floors || 1;
    run.region = { options: regionalOptions(run) };
    run.version = 4;
  }
  if (run.version === 4) {
    run.startDoy = 80;
    run.version = 5;
  }
  if (run.version === 5) {
    // perks for the levels already earned; everyone already met is a citizen
    run.player.perks = [];
    run.player.perkPoints = Math.max(0, run.player.level - 1);
    for (const s of run.survivors) if (!s.dog) s.prof = s.prof || 'citizen';
    for (const l of run.locality.locations) for (const s of l.survivors || []) if (!s.dog) s.prof = s.prof || 'citizen';
    run.version = 6;
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
