// Procedural buildings. Produces a pure-data description of one location:
// one plan per floor, all sharing the same footprint and stairwell. Each
// floor is a real floor plan (rooms divided by thin walls with doorways,
// corridors, a lobby) whose rooms have a purpose (kitchen, bedroom, ward,
// cells...) that decides their finishes, furniture and what's in them.
// The ground floor also has the street-front lot where the player arrives
// and leaves. Nothing here touches three.js.
import { RNG } from './util.js';
import { T, TILE, EDGE, DOOR_W } from './config.js';
import { LOCATION_TYPES, BIOMES } from './run.js';
import { CONTAINER_DEPTH, CONTAINER_WIDTH } from './props.js';
import { FURN } from './furniture.js';

const DIRS4 = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];
const HALF = 0.1; // half a thin wall's thickness

// footprint size in tiles [w range, h range] and how the plan is laid out
const PLAN = {
  gas: { w: [5, 6], h: [3, 4], style: 'shop' },
  home: { w: [4, 6], h: [3, 5], style: 'house' },
  apartment: { w: [8, 11], h: [6, 8], style: 'corridor', room: [2, 3], lobby: 3 },
  office: { w: [8, 11], h: [6, 8], style: 'corridor', room: [2, 4], lobby: 3 },
  warehouse: { w: [8, 11], h: [6, 8], style: 'hall' },
  police: { w: [7, 10], h: [6, 7], style: 'corridor', room: [2, 3], lobby: 3 },
  hospital: { w: [9, 12], h: [7, 8], style: 'corridor', room: [2, 4], lobby: 4 },
  military: { w: [8, 11], h: [6, 7], style: 'corridor', room: [3, 4], lobby: 3 },
  skyscraper: { w: [8, 10], h: [7, 8], style: 'corridor', room: [2, 4], lobby: 5 },
  stadium: { w: [11, 13], h: [8, 9], style: 'hall', hall: 'arena', openHall: true },
  railyard: { w: [10, 12], h: [7, 8], style: 'hall', hall: 'trainShed' },
  mall: { w: [10, 12], h: [7, 8], style: 'corridor', room: [2, 4], lobby: 4 },
  grain: { w: [8, 10], h: [6, 7], style: 'hall', hall: 'grainFloor' },
  mine: { w: [8, 10], h: [6, 8], style: 'hall', hall: 'minehead' },
};

// ---------------------------------------------------------------- room purposes
// floor/wall: texture "name:seed" (a list picks one per room). wall: pieces
// against the walls [kind, chance, count]; mid: pieces in the middle;
// cont: container kinds that belong here; hide: hiding spots that do.
const PLASTER = ['plaster:100', 'plaster:101', 'plaster:102', 'plaster:103', 'plaster:104', 'plaster:105', 'plaster:106', 'plaster:107'];
const PAPER = ['wallpaper:22', 'wallpaper:23', 'wallpaper:26', 'wallpaper:27'];
const CARPET = ['carpet:24', 'carpet:25', 'carpet:26', 'carpet:27'];
const PURPOSE = {
  living: {
    floor: ['woodFloor:6', ...CARPET],
    wall: [...PAPER, ...PLASTER],
    items: [['sofa', 1], ['tvStand', 0.85], ['armchair', 0.6], ['bookshelf', 0.6], ['fireplace', 0.3], ['sideTable', 0.6], ['floorLamp', 0.5], ['plant', 0.4]],
    mid: [['rug', 0.8], ['coffeeTable', 0.8], ['clutter', 0.5]],
    cont: ['cabinet', 'desk'],
    hide: ['closet'],
    deco: 3,
  },
  kitchen: {
    floor: ['kitchenFloor:101', 'kitchenFloor:102', 'linoleum:21'],
    wall: PLASTER,
    items: [['counter', 1], ['stove', 1], ['counter', 0.5], ['trashCan', 0.7]],
    mid: [['kitchenTable', 0.6], ['clutter', 0.5]],
    cont: ['fridge', 'fridge', 'cabinet'],
    hide: [],
    deco: 1,
  },
  dining: {
    floor: ['woodFloor:6', 'woodFloor:7'],
    wall: [...PAPER, ...PLASTER],
    items: [['dresser', 0.5], ['plant', 0.4], ['bookshelf', 0.3]],
    mid: [['diningTable', 1], ['rug', 0.4]],
    cont: ['cabinet'],
    hide: ['closet'],
    deco: 2,
  },
  bedroom: {
    floor: [...CARPET, 'woodFloor:6'],
    wall: [...PAPER, ...PLASTER],
    items: [['bed', 1], ['nightstand', 0.8], ['nightstand', 0.5], ['dresser', 0.8], ['wardrobe', 0.4], ['writingDesk', 0.3], ['floorLamp', 0.3]],
    mid: [['rug', 0.5], ['clutter', 0.7]],
    cont: ['footlocker', 'desk', 'cabinet'],
    hide: ['closet', 'bed'],
    deco: 2,
  },
  kids: {
    floor: CARPET,
    wall: PAPER,
    items: [['singleBed', 1], ['toyBox', 0.9], ['dresser', 0.5], ['bookshelf', 0.4], ['nightstand', 0.5]],
    mid: [['rug', 0.7], ['clutter', 0.8]],
    cont: ['footlocker'],
    hide: ['closet', 'bed'],
    deco: 2,
  },
  study: {
    floor: ['woodFloor:6', ...CARPET],
    wall: [...PAPER, ...PLASTER],
    items: [['bookshelf', 1], ['bookshelf', 0.5], ['armchair', 0.5], ['floorLamp', 0.5], ['filing', 0.4]],
    mid: [['rug', 0.6], ['clutter', 0.5]],
    cont: ['desk', 'cabinet'],
    hide: ['closet'],
    deco: 2,
  },
  bath: {
    floor: ['tile:20', 'linoleum:21'],
    wall: ['bathTile:102', 'bathTile:103', 'bathTile:104'],
    items: [['toilet', 1], ['vanity', 1], ['bathtub', 0.7]],
    mid: [],
    cont: ['medcab'],
    hide: [],
    deco: 0,
  },
  laundry: {
    floor: ['linoleum:21', 'concrete:23'],
    wall: PLASTER,
    items: [['washer', 1], ['washer', 0.7], ['trashCan', 0.4]],
    mid: [['clutter', 0.6]],
    cont: ['shelf', 'cabinet', 'toolbox'],
    hide: ['locker'],
    deco: 0,
  },
  hall: { floor: ['woodFloor:6', ...CARPET], wall: [...PAPER, ...PLASTER], items: [['sideTable', 0.4], ['plant', 0.3]], mid: [['rug', 0.4]], cont: [], hide: [], deco: 2 },
  closetRoom: { floor: CARPET, wall: PLASTER, items: [['wardrobe', 0.6]], mid: [['clutter', 0.6]], cont: ['footlocker', 'shelf'], hide: ['closet'], deco: 0 },
  // apartments
  unit: {
    floor: ['woodFloor:6', ...CARPET, 'linoleum:21'],
    wall: [...PAPER, ...PLASTER],
    items: [['bed', 0.9], ['sofa', 0.7], ['counter', 0.8], ['tvStand', 0.6], ['dresser', 0.4], ['nightstand', 0.5]],
    mid: [['kitchenTable', 0.4], ['rug', 0.5], ['clutter', 0.8]],
    cont: ['fridge', 'cabinet', 'footlocker'],
    hide: ['closet', 'bed'],
    deco: 2,
  },
  lobby: {
    floor: ['terrazzo:103', 'tile:20'],
    wall: ['plaster:101', 'plaster:107', 'wallpaper:23'],
    items: [['mailboxes', 0.8], ['plant', 0.7], ['waitingChairs', 0.4]],
    mid: [['rug', 0.3], ['clutter', 0.4]],
    cont: ['desk'],
    hide: ['bench'],
    deco: 2,
  },
  corridor: { floor: ['carpet:25', 'linoleum:21', 'tile:20'], wall: ['plaster:101', 'plaster:107', 'plaster:104'], items: [['plant', 0.15], ['trashCan', 0.15], ['waterCooler', 0.1]], mid: [], cont: [], hide: [], deco: 1 },
  // offices
  office: {
    floor: CARPET,
    wall: ['plaster:101', 'plaster:107', 'plaster:104', 'plaster:103'],
    items: [['desk', 1], ['filing', 0.8], ['bookshelf', 0.5], ['plant', 0.5], ['whiteboard', 0.3], ['armchair', 0.3]],
    mid: [['clutter', 0.6]],
    cont: ['desk', 'cabinet'],
    hide: ['locker', 'closet'],
    deco: 2,
  },
  cubicles: {
    floor: CARPET,
    wall: ['plaster:101', 'plaster:107'],
    items: [['filing', 0.9], ['copier', 0.6], ['waterCooler', 0.5], ['plant', 0.5], ['filing', 0.5], ['whiteboard', 0.3]],
    mid: [['cubicles', 1, 4], ['clutter', 0.8]],
    cont: ['desk', 'cabinet', 'shelf'],
    hide: ['locker'],
    deco: 1,
  },
  conference: {
    floor: CARPET,
    wall: ['plaster:107', 'wallpaper:23'],
    items: [['whiteboard', 0.9], ['plant', 0.5], ['sideTable', 0.4]],
    mid: [['conferenceTable', 1]],
    cont: ['cabinet'],
    hide: [],
    deco: 1,
  },
  breakroom: {
    floor: ['linoleum:21', 'kitchenFloor:101'],
    wall: PLASTER,
    items: [['counter', 1], ['waterCooler', 0.6], ['trashCan', 0.7]],
    mid: [['kitchenTable', 0.8], ['clutter', 0.4]],
    cont: ['fridge', 'cabinet'],
    hide: ['locker'],
    deco: 1,
  },
  restroom: { floor: ['tile:20'], wall: ['bathTile:102', 'bathTile:104'], items: [['toilet', 1], ['toilet', 0.6], ['vanity', 1]], mid: [], cont: ['medcab'], hide: [], deco: 0 },
  executive: {
    floor: ['woodFloor:7', 'carpet:24'],
    wall: ['wallpaper:26', 'plaster:106'],
    items: [['bookshelf', 1], ['sofa', 0.8], ['plant', 0.6], ['bookshelf', 0.6], ['sideTable', 0.5]],
    mid: [['execDesk', 1], ['rug', 0.8]],
    cont: ['cabinet', 'desk'],
    hide: ['closet'],
    deco: 3,
  },
  lobbyGrand: {
    floor: ['terrazzo:103'],
    wall: ['plaster:107', 'plaster:101'],
    items: [['elevators', 1], ['plant', 0.8], ['plant', 0.6], ['waitingChairs', 0.6], ['sofa', 0.4]],
    mid: [['receptionDesk', 1], ['clutter', 0.4]],
    cont: ['desk'],
    hide: ['bench'],
    deco: 1,
  },
  // hospitals
  waiting: {
    floor: ['linoleum:21', 'terrazzo:103'],
    wall: ['plaster:101', 'plaster:102'],
    items: [['waitingChairs', 1], ['waitingChairs', 0.8], ['plant', 0.5], ['waterCooler', 0.5], ['wheelchair', 0.4]],
    mid: [['receptionDesk', 0.8], ['clutter', 0.5]],
    cont: ['desk', 'medcab'],
    hide: ['bench'],
    deco: 2,
  },
  ward: {
    floor: ['linoleum:21'],
    wall: ['plaster:101', 'plaster:102', 'bathTile:103'],
    items: [['hospitalBed', 1], ['hospitalBed', 0.9], ['hospitalBed', 0.6], ['curtain', 0.6], ['medCart', 0.5], ['wheelchair', 0.3]],
    mid: [['gurney', 0.5], ['clutter', 0.4]],
    cont: ['medcab', 'cabinet'],
    hide: ['bed'],
    deco: 1,
  },
  exam: {
    floor: ['linoleum:21', 'tile:20'],
    wall: ['plaster:101', 'bathTile:103'],
    items: [['hospitalBed', 1], ['medCart', 0.8], ['vanity', 0.5], ['writingDesk', 0.5]],
    mid: [],
    cont: ['medcab', 'medcab', 'cabinet'],
    hide: ['locker'],
    deco: 1,
  },
  pharmacy: {
    floor: ['linoleum:21'],
    wall: ['plaster:101'],
    items: [['checkout', 0.6], ['filing', 0.5]],
    mid: [],
    cont: ['medcab', 'medcab', 'shelf', 'medcab'],
    hide: [],
    deco: 1,
  },
  // police
  frontdesk: {
    floor: ['linoleum:21', 'tile:20'],
    wall: ['plaster:107', 'plaster:104'],
    items: [['waitingChairs', 0.9], ['plant', 0.4], ['waterCooler', 0.5]],
    mid: [['receptionDesk', 1]],
    cont: ['desk', 'cabinet'],
    hide: ['bench'],
    deco: 3,
  },
  bullpen: {
    floor: ['linoleum:21', 'carpet:25'],
    wall: ['plaster:104', 'plaster:107'],
    items: [['desk', 1], ['desk', 0.9], ['filing', 0.8], ['whiteboard', 0.6], ['waterCooler', 0.4], ['desk', 0.6]],
    mid: [['clutter', 0.8]],
    cont: ['desk', 'cabinet', 'gunlocker'],
    hide: ['locker'],
    deco: 3,
  },
  cells: {
    floor: ['concrete:23'],
    wall: ['concrete:23', 'plaster:104'],
    items: [['cellBunk', 1], ['toilet', 0.8], ['cellBunk', 0.5]],
    mid: [['clutter', 0.5]],
    cont: ['footlocker'],
    hide: ['bench'],
    deco: 0,
    bars: true,
  },
  interrogation: { floor: ['concrete:23'], wall: ['plaster:104'], items: [['filing', 0.4]], mid: [['kitchenTable', 1]], cont: ['cabinet'], hide: [], deco: 0 },
  lockerroom: {
    floor: ['tile:20'],
    wall: ['bathTile:102', 'plaster:104'],
    items: [['lockerRow', 1], ['lockerRow', 0.8], ['trashCan', 0.4]],
    mid: [['clutter', 0.6]],
    cont: ['gunlocker', 'footlocker'],
    hide: ['locker', 'bench'],
    deco: 0,
  },
  armory: { floor: ['concrete:23'], wall: ['concrete:23'], items: [['gunRack', 1], ['gunRack', 0.8], ['barrels', 0.4]], mid: [], cont: ['gunlocker', 'gunlocker', 'crate'], hide: [], deco: 0 },
  // military
  barracks: {
    floor: ['concrete:23', 'linoleum:21'],
    wall: ['plaster:105', 'concrete:23'],
    items: [['bunk', 1], ['bunk', 1], ['bunk', 0.8], ['bunk', 0.6], ['lockerRow', 0.5]],
    mid: [['clutter', 0.7]],
    cont: ['footlocker', 'footlocker', 'gunlocker'],
    hide: ['locker'],
    deco: 1,
  },
  mess: {
    floor: ['linoleum:21', 'concrete:23'],
    wall: ['plaster:105', 'plaster:104'],
    items: [['counter', 1], ['trashCan', 0.6], ['stove', 0.6]],
    mid: [['messTable', 1, 3], ['clutter', 0.5]],
    cont: ['fridge', 'crate', 'shelf'],
    hide: ['bench'],
    deco: 1,
  },
  command: {
    floor: ['linoleum:21', 'concrete:23'],
    wall: ['plaster:105', 'concrete:23'],
    items: [['radioDesk', 1], ['filing', 0.7], ['whiteboard', 0.6], ['desk', 0.6]],
    mid: [['mapTable', 1]],
    cont: ['desk', 'cabinet', 'gunlocker'],
    hide: ['locker'],
    deco: 2,
  },
  storage: {
    floor: ['concrete:23'],
    wall: ['concrete:23', 'plaster:104'],
    items: [['palletStack', 0.8], ['barrels', 0.6], ['palletStack', 0.5]],
    mid: [['clutter', 0.4]],
    cont: ['crate', 'shelf', 'toolbox', 'crate'],
    hide: ['locker'],
    deco: 0,
  },
  showers: { floor: ['tile:20'], wall: ['bathTile:102'], items: [['vanity', 1], ['toilet', 0.7], ['lockerRow', 0.5]], mid: [], cont: ['medcab'], hide: ['locker'], deco: 0 },
  // gas stations and warehouses
  shop: {
    floor: ['linoleum:21', 'tile:20'],
    wall: ['plaster:101', 'plaster:107'],
    items: [['drinkCooler', 1], ['drinkCooler', 0.6], ['trashCan', 0.5]],
    mid: [['gondola', 1, 4], ['checkout', 1], ['clutter', 0.6]],
    cont: ['shelf', 'shelf', 'fridge'],
    hide: [],
    deco: 2,
  },
  warehouseHall: {
    floor: ['concrete:23'],
    wall: ['sheetMetal:25', 'concrete:23'],
    items: [['palletStack', 1], ['barrels', 0.8], ['palletStack', 0.8], ['barrels', 0.5]],
    mid: [['palletRack', 1, 6], ['forklift', 0.6], ['clutter', 0.5]],
    cont: ['crate', 'shelf', 'toolbox', 'crate'],
    hide: ['locker'],
    deco: 0,
  },
  // ---- landmarks ----
  // the stadium field, turned into a quarantine camp
  arena: {
    floor: ['grass:3'],
    wall: ['concrete:23'],
    items: [['waitingChairs', 1, 3], ['barrels', 0.6], ['palletStack', 0.8], ['waitingChairs', 0.8, 2]],
    mid: [['hospitalBed', 1, 4], ['curtain', 0.8, 2], ['messTable', 0.8, 2], ['palletStack', 0.6, 2], ['clutter', 0.7]],
    cont: ['crate', 'medcab', 'crate', 'footlocker'],
    hide: ['locker'],
    deco: 0,
  },
  concession: {
    floor: ['tile:20'],
    wall: ['bathTile:102', 'plaster:101'],
    items: [['counter', 1], ['drinkCooler', 1], ['counter', 0.7], ['trashCan', 0.6]],
    mid: [['clutter', 0.5]],
    cont: ['fridge', 'shelf', 'cabinet'],
    hide: [],
    deco: 1,
  },
  trainShed: {
    floor: ['concrete:23'],
    wall: ['brick:3', 'sheetMetal:25'],
    items: [['barrels', 1], ['palletStack', 1], ['barrels', 0.8], ['lockerRow', 0.5]],
    mid: [['palletRack', 1, 4], ['forklift', 0.7], ['palletStack', 0.8, 2], ['clutter', 0.6]],
    cont: ['crate', 'toolbox', 'crate', 'shelf'],
    hide: ['locker'],
    deco: 0,
  },
  grainFloor: {
    floor: ['concrete:23'],
    wall: ['sheetMetal:25', 'wood:5'],
    items: [['palletStack', 1], ['palletStack', 1], ['barrels', 0.7]],
    mid: [['palletStack', 1, 4], ['forklift', 0.5], ['clutter', 0.5]],
    cont: ['crate', 'crate', 'shelf', 'toolbox'],
    hide: ['locker'],
    deco: 0,
  },
  minehead: {
    floor: ['dirt:4'],
    wall: ['stoneBlocks:6', 'wood:5'],
    items: [['barrels', 1], ['palletStack', 0.8], ['lockerRow', 0.7], ['barrels', 0.6]],
    mid: [['palletRack', 0.8, 3], ['forklift', 0.4], ['clutter', 0.7]],
    cont: ['crate', 'toolbox', 'crate', 'footlocker'],
    hide: ['locker'],
    deco: 0,
  },
  atrium: {
    floor: ['terrazzo:9'],
    wall: ['plaster:101', 'tile:20'],
    items: [['plant', 1], ['waitingChairs', 0.8], ['plant', 0.7], ['trashCan', 0.6]],
    mid: [['waitingChairs', 0.6], ['plant', 0.5], ['clutter', 0.5]],
    cont: [],
    hide: [],
    deco: 2,
  },
  storeGrocery: {
    floor: ['linoleum:21'],
    wall: ['plaster:107'],
    items: [['drinkCooler', 1], ['drinkCooler', 0.8], ['counter', 0.5]],
    mid: [['gondola', 1, 3], ['checkout', 0.8], ['clutter', 0.6]],
    cont: ['shelf', 'shelf', 'fridge'],
    hide: [],
    deco: 2,
  },
  storeSports: {
    floor: ['linoleum:21', 'carpet:25'],
    wall: ['plaster:104'],
    items: [['gunRack', 1], ['lockerRow', 0.6], ['gunRack', 0.5]],
    mid: [['gondola', 1, 2], ['checkout', 0.7], ['clutter', 0.4]],
    cont: ['gunlocker', 'shelf', 'crate'],
    hide: ['locker'],
    deco: 1,
  },
  storeClothes: {
    floor: ['carpet:24', 'woodFloor:7'],
    wall: [...PAPER],
    items: [['wardrobe', 1], ['dresser', 0.6], ['plant', 0.4]],
    mid: [['gondola', 0.8, 2], ['rug', 0.6], ['checkout', 0.6]],
    cont: ['shelf', 'cabinet'],
    hide: ['closet'],
    deco: 1,
  },
  storeHardware: {
    floor: ['concrete:23', 'linoleum:21'],
    wall: ['plaster:104'],
    items: [['palletStack', 0.8], ['barrels', 0.6], ['lockerRow', 0.4]],
    mid: [['gondola', 1, 3], ['checkout', 0.7], ['clutter', 0.5]],
    cont: ['toolbox', 'shelf', 'crate'],
    hide: [],
    deco: 1,
  },
  foodcourt: {
    floor: ['terrazzo:9', 'tile:20'],
    wall: ['plaster:101', 'bathTile:102'],
    items: [['counter', 1], ['stove', 0.8], ['counter', 0.8], ['drinkCooler', 0.6], ['trashCan', 0.6]],
    mid: [['kitchenTable', 1, 3], ['clutter', 0.6]],
    cont: ['fridge', 'cabinet'],
    hide: [],
    deco: 2,
  },
  stairs: { floor: ['concrete:23'], wall: ['plaster:104', 'concrete:23'], items: [], mid: [], cont: [], hide: [], deco: 0 },
  vault: { floor: ['concrete:23'], wall: ['concrete:23'], items: [['gunRack', 0.5], ['barrels', 0.3]], mid: [], cont: [], hide: [], deco: 0 },
};
// surfaces things can be left on (height of the top)
const SURFACE = { desk: 0.78, writingDesk: 0.78, counter: 0.91, coffeeTable: 0.46, nightstand: 0.56, dresser: 0.86, sideTable: 0.61, kitchenTable: 0.79, diningTable: 0.79, messTable: 0.78, receptionDesk: 1.16, checkout: 0.99, mapTable: 0.96, execDesk: 0.8, conferenceTable: 0.79, radioDesk: 0.78 };

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

export function enemyRoster(loc, rng, roomCount, scale = 1, brutesHere = true) {
  const d = loc.difficulty;
  const count = Math.max(2, Math.round((2 + d * 2.2 + roomCount * 0.3) * scale * (LOCATION_TYPES[loc.type]?.horde || 1)));
  const lawful = loc.type === 'police' || loc.type === 'military';
  const w = {
    walker: 3,
    grunt: 2,
    runner: d >= 2 ? 0.8 + 0.3 * d : 0,
    hound: d >= 2 ? 0.5 + 0.2 * d : 0,
    fat: d >= 3 ? 0.7 : 0,
    armored: lawful ? (d >= 3 ? 1.6 : 0.6) : d >= 4 ? 0.4 : 0,
    rotter: d >= 4 ? 0.6 : 0,
    spitter: d >= 2 ? 0.3 + 0.15 * d : 0,
    lurker: 0.4 + 0.15 * d,
  };
  const out = [];
  for (let i = 0; i < count; i++) out.push(pickWeighted(rng, w));
  const brutes = brutesHere && d >= 3 ? Math.min(3, 1 + Math.floor((d - 3) / 2)) : 0;
  for (let i = 0; i < brutes; i++) out.push('brute');
  return out;
}

// A building held by raiders: a few armed people, and a straggler or two
// of the dead they haven't cleared.
function raiderRoster(loc, rng, nF) {
  const n = Math.max(2, Math.round((2 + loc.difficulty * 0.6) * (nF > 1 ? 0.7 : 1)));
  const out = [];
  for (let i = 0; i < n; i++) out.push('raider');
  if (rng.chance(0.5)) out.push('walker');
  return out;
}
const RAIDER_GUNS = [
  ['glock', 'm1911', 'revolver', 'doublebarrel', 'lever'],
  ['pump', 'uzi', 'sks', 'beretta', 'hunting'],
  ['ak47', 'm4a1', 'mp5', 'pump', 'spas12'],
];
function raiderGun(loc, rng) {
  return rng.pick(RAIDER_GUNS[Math.min(2, Math.floor((loc.difficulty - 1) / 2))]);
}

// ---------------------------------------------------------------- the building
export function generateBuilding(loc, biome) {
  const L = LOCATION_TYPES[loc.type];
  const P = PLAN[loc.type] || PLAN.home;
  const rng = new RNG(loc.seed);
  const nF = Math.max(1, loc.floors || 1);
  const fw = rng.int(P.w[0], P.w[1]) + (P.style === 'corridor' || P.style === 'hall' ? Math.floor(loc.difficulty / 3) : 0);
  const fh = rng.int(P.h[0], P.h[1]);
  const YW = Math.max(Math.min(L.lot[0], fw + 6), 6);
  const YH = L.lot[1];
  const W = Math.max(fw, YW) + 6;
  const fy0 = 2;
  const lotTop = fy0 + fh;
  const H = lotTop + YH + 1;
  const fx0 = Math.floor((W - fw) / 2);
  const fp = { x0: fx0, y0: fy0, x1: fx0 + fw - 1, y1: fy0 + fh - 1, w: fw, h: fh };
  const mid = fx0 + Math.floor(fw / 2);
  const doorX = P.style === 'corridor' ? Math.max(fx0 + 1, Math.min(fp.x1 - 1, mid + rng.int(-1, 1))) : rng.int(fx0 + 1, fp.x1 - 1);
  const lotX0 = Math.max(1, Math.min(W - 1 - YW, doorX - Math.floor(YW / 2) + rng.int(-1, 1)));
  const shared = { L, P, rng, nF, W, H, fp, lotTop, YW, YH, lotX0, doorX, loc, biome };

  // corridor buildings keep the same bands of rooms on every floor
  if (P.style === 'corridor') {
    const a = fh >= 7 ? rng.int(2, 3) : 2;
    const back = fh - a - 1;
    const bands = [{ y: fy0 + fh - a, h: a, kind: 'rooms', front: true }];
    const c1 = fy0 + fh - a - 1;
    bands.push({ y: c1, h: 1, kind: 'corridor' });
    if (back >= 5) {
      bands.push({ y: c1 - 2, h: 2, kind: 'rooms' });
      bands.push({ y: c1 - 3, h: 1, kind: 'corridor' });
      bands.push({ y: fy0, h: c1 - 3 - fy0, kind: 'rooms' });
    } else bands.push({ y: fy0, h: back, kind: 'rooms' });
    shared.bands = bands;
  }
  // the stairwell (one tile wide, two long), the same on every floor
  if (nF > 1) shared.stairs = placeStairs(shared);
  // which floor the vault is on
  shared.vaultFloor = loc.lock ? (nF > 1 && rng.chance(0.7) ? nF - 1 : rng.int(0, nF - 1)) : -1;
  shared.keyFloor = loc.key ? rng.int(0, nF - 1) : -1;
  const floors = [];
  for (let f = 0; f < nF; f++) floors.push(makeFloor(shared, f));
  return { floors, nFloors: nF, stairs: shared.stairs || null };
}

function placeStairs(S) {
  const { fp, rng, bands, doorX } = S;
  if (bands) {
    // at one end of the corridor, running back from it
    const corr = bands.find((b) => b.kind === 'corridor');
    const left = rng.chance(0.5);
    const x = left ? fp.x0 : fp.x1;
    return { x0: x, y0: corr.y - 2, w: 1, h: 2, landing: { x, y: corr.y - 1 }, far: { x, y: corr.y - 2 }, door: { x, y: corr.y } };
  }
  // a house: somewhere inside, never on the front door
  for (let a = 0; a < 60; a++) {
    const vert = rng.chance(0.5);
    const w = vert ? 1 : 2;
    const h = vert ? 2 : 1;
    const x0 = rng.int(fp.x0, fp.x1 - w + 1);
    const y0 = rng.int(fp.y0, fp.y1 - h + 1);
    if (x0 <= doorX && doorX < x0 + w && y0 + h - 1 === fp.y1) continue;
    // the landing end must open onto the rest of the house
    const ends = vert
      ? [
          { landing: { x: x0, y: y0 + 1 }, far: { x: x0, y: y0 }, door: { x: x0, y: y0 + 2 } },
          { landing: { x: x0, y: y0 }, far: { x: x0, y: y0 + 1 }, door: { x: x0, y: y0 - 1 } },
        ]
      : [
          { landing: { x: x0 + 1, y: y0 }, far: { x: x0, y: y0 }, door: { x: x0 + 2, y: y0 } },
          { landing: { x: x0, y: y0 }, far: { x: x0 + 1, y: y0 }, door: { x: x0 - 1, y: y0 } },
        ];
    const ok = ends.filter((e) => e.door.x >= fp.x0 && e.door.x <= fp.x1 && e.door.y >= fp.y0 && e.door.y <= fp.y1);
    if (!ok.length) continue;
    return { x0, y0, w, h, ...rng.pick(ok) };
  }
  return { x0: fp.x0, y0: fp.y0, w: 1, h: 2, landing: { x: fp.x0, y: fp.y0 + 1 }, far: { x: fp.x0, y: fp.y0 }, door: { x: fp.x0, y: fp.y0 + 2 } };
}

// ---------------------------------------------------------------- one floor
function makeFloor(S, f) {
  const { L, P, nF, W, H, fp, lotTop, YW, YH, lotX0, doorX, loc, biome } = S;
  const rng = new RNG((loc.seed + 7919 * (f + 1)) >>> 0);
  const ground = f === 0;
  const tiles = new Uint8Array(W * H);
  const roomOf = new Int16Array(W * H).fill(-1);
  const edgeE = new Uint8Array(W * H);
  const edgeS = new Uint8Array(W * H);
  const blocked = new Uint8Array(W * H);
  const idx = (x, y) => y * W + x;
  const inFp = (x, y) => x >= fp.x0 && x <= fp.x1 && y >= fp.y0 && y <= fp.y1;
  for (let y = fp.y0; y <= fp.y1; y++) for (let x = fp.x0; x <= fp.x1; x++) tiles[idx(x, y)] = T.FLOOR;

  // ---------- the lot ----------
  const rooms = [];
  let yard = null;
  if (ground) {
    yard = { x: lotX0, y: lotTop, w: YW, h: YH, id: 0, yard: true, purpose: 'yard' };
    yard.cx = yard.x + (YW - 1) / 2;
    yard.cy = yard.y + (YH - 1) / 2;
    for (let y = yard.y; y < yard.y + YH; y++)
      for (let x = yard.x; x < yard.x + YW; x++) {
        tiles[idx(x, y)] = T.YARD;
        roomOf[idx(x, y)] = 0;
      }
  }
  rooms.push(yard || { id: 0, x: 0, y: 0, w: 0, h: 0, yard: true, none: true });

  // ---------- rooms ----------
  const addRoom = (x, y, w, h, extra = {}) => {
    const r = { x, y, w, h, id: rooms.length, cx: x + (w - 1) / 2, cy: y + (h - 1) / 2, area: w * h, ...extra };
    rooms.push(r);
    for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) roomOf[idx(xx, yy)] = r.id;
    return r;
  };
  const st = S.stairs;
  const opens = []; // pairs of rooms with no wall between them
  if (P.style === 'corridor') planCorridor(S, f, rng, addRoom, opens);
  else if (P.style === 'shop') planShop(S, rng, addRoom);
  else if (P.style === 'hall') planHall(S, rng, addRoom);
  else planHouse(S, f, rng, addRoom);
  const stairRoom = st ? rooms.find((r) => r.stairs) : null;

  // ---------- walls between rooms, then doorways ----------
  const openSet = new Set(opens.map(([a, b]) => a + ',' + b).concat(opens.map(([a, b]) => b + ',' + a)));
  for (let y = fp.y0; y <= fp.y1; y++)
    for (let x = fp.x0; x <= fp.x1; x++) {
      const a = roomOf[idx(x, y)];
      if (x < fp.x1) {
        const b = roomOf[idx(x + 1, y)];
        if (a !== b && !openSet.has(a + ',' + b)) edgeE[idx(x, y)] = EDGE.WALL;
      }
      if (y < fp.y1) {
        const b = roomOf[idx(x, y + 1)];
        if (a !== b && !openSet.has(a + ',' + b)) edgeS[idx(x, y)] = EDGE.WALL;
      }
    }
  // the front wall, onto the lot
  if (ground) for (let x = fp.x0; x <= fp.x1; x++) if (tiles[idx(x, fp.y1 + 1)] === T.YARD) edgeS[idx(x, fp.y1)] = x === doorX ? EDGE.NONE : EDGE.WALL;
  const setEdge = (x, y, dx, dy, code) => {
    if (dx > 0) edgeE[idx(x, y)] = code;
    else if (dx < 0) edgeE[idx(x - 1, y)] = code;
    else if (dy > 0) edgeS[idx(x, y)] = code;
    else edgeS[idx(x, y - 1)] = code;
  };
  const getEdge = (x, y, dx, dy) => (dx > 0 ? edgeE[idx(x, y)] : dx < 0 ? edgeE[idx(x - 1, y)] : dy > 0 ? edgeS[idx(x, y)] : edgeS[idx(x, y - 1)]);
  // every place two rooms touch
  const touch = new Map();
  for (let y = fp.y0; y <= fp.y1; y++)
    for (let x = fp.x0; x <= fp.x1; x++)
      for (const [dx, dy] of [
        [1, 0],
        [0, 1],
      ]) {
        const nx = x + dx;
        const ny = y + dy;
        if (!inFp(nx, ny)) continue;
        const a = roomOf[idx(x, y)];
        const b = roomOf[idx(nx, ny)];
        if (a === b) continue;
        const key = Math.min(a, b) + ',' + Math.max(a, b);
        if (!touch.has(key)) touch.set(key, []);
        touch.get(key).push({ x, y, dx, dy });
      }
  const doors = [];
  const linked = new Set(opens.map(([a, b]) => Math.min(a, b) + ',' + Math.max(a, b)));
  const addDoor = (a, b) => {
    const key = Math.min(a, b) + ',' + Math.max(a, b);
    if (linked.has(key)) return true;
    let segs = touch.get(key);
    if (!segs) return false;
    // never through the stairwell's sides: only at its door
    if (stairRoom && (a === stairRoom.id || b === stairRoom.id)) segs = segs.filter((s) => isStairDoor(s, st));
    if (!segs.length) return false;
    // avoid the very ends of a shared wall, so the doorway isn't in a corner
    const inner = segs.length > 2 ? segs.slice(1, -1) : segs;
    const s = rng.pick(inner);
    setEdge(s.x, s.y, s.dx, s.dy, EDGE.DOOR);
    doors.push({ ...s, a, b });
    linked.add(key);
    return true;
  };
  // connect everything: union-find over the room graph
  const parent = rooms.map((r) => r.id);
  const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const join = (a, b) => (parent[find(a)] = find(b));
  for (const [a, b] of opens) join(a, b);
  const real = rooms.filter((r) => !r.yard);
  // hubs (corridors, lobbies, halls) first, then whatever is left
  const pref = (r) => (r.corridor ? 0 : r.lobby || r.hub ? 1 : 2);
  const order = rng.shuffle(real.slice()).sort((p, q) => pref(p) - pref(q));
  for (const r of order) {
    if (r.corridor || r.lobby || r.hub) continue;
    // ordinary rooms open onto a hub when they touch one
    const hubs = real.filter((h) => (h.corridor || h.lobby || h.hub) && touch.has(Math.min(r.id, h.id) + ',' + Math.max(r.id, h.id)));
    if (hubs.length && !r.noHub) {
      const h = hubs.find((x) => x.corridor) || rng.pick(hubs);
      if (addDoor(r.id, h.id)) join(r.id, h.id);
    }
  }
  // then join up the rest, preferring big rooms as pass-throughs
  const dead = new Set();
  for (let guard = 0; guard < 200; guard++) {
    const groups = new Set(real.map((r) => find(r.id)));
    if (groups.size <= 1) break;
    let best = null;
    let bestScore = Infinity;
    for (const [key] of touch) {
      const [a, b] = key.split(',').map(Number);
      if (a <= 0 || b <= 0 || find(a) === find(b) || dead.has(key)) continue;
      const ra = rooms[a];
      const rb = rooms[b];
      let score = rng.next();
      if (ra.area <= 1 || rb.area <= 1) score += 3;
      if (ra.stairs || rb.stairs) score += 1.5;
      if (score < bestScore) {
        bestScore = score;
        best = [a, b];
      }
    }
    if (!best) break;
    if (addDoor(best[0], best[1])) join(best[0], best[1]);
    else dead.add(Math.min(best[0], best[1]) + ',' + Math.max(best[0], best[1]));
  }
  // a few extra doorways between big neighbours make loops to run around
  for (const [key] of touch) {
    const [a, b] = key.split(',').map(Number);
    if (!a || !b || linked.has(key)) continue;
    const ra = rooms[a];
    const rb = rooms[b];
    if (ra.stairs || rb.stairs || ra.area < 3 || rb.area < 3) continue;
    if (rng.chance(P.style === 'house' ? 0.25 : 0.15)) addDoor(a, b);
  }
  if (ground) {
    // the front door's room is the entry
    const entryRoom = rooms[roomOf[idx(doorX, fp.y1)]];
    entryRoom.entry = true;
  }

  // ---------- what each room is for ----------
  assignPurposes(S, f, rng, rooms, doors);
  const degree = (r) => doors.filter((d) => d.a === r.id || d.b === r.id).length + opens.filter(([a, b]) => a === r.id || b === r.id).length;

  // ---------- the locked vault ----------
  let gate = null;
  if (loc.lock && S.vaultFloor === f) {
    const cands = real.filter((r) => !r.stairs && !r.corridor && !r.lobby && !r.entry && !r.hub && degree(r) === 1 && r.area <= 6);
    const pool = cands.length ? cands : real.filter((r) => !r.stairs && !r.corridor && !r.lobby && !r.entry && degree(r) === 1);
    const v = pool.length ? rng.pick(pool) : null;
    if (v) {
      const dd = doors.find((d) => d.a === v.id || d.b === v.id);
      if (dd) {
        v.purpose = 'vault';
        v.vault = true;
        setEdge(dd.x, dd.y, dd.dx, dd.dy, EDGE.GATE);
        // which way the gate faces: from the room outside into the vault
        const vaultIsA = roomOf[idx(dd.x, dd.y)] === v.id;
        const ox = vaultIsA ? dd.x + dd.dx : dd.x;
        const oy = vaultIsA ? dd.y + dd.dy : dd.y;
        const toVault = vaultIsA ? [-dd.dx, -dd.dy] : [dd.dx, dd.dy];
        const ex = (ox + 0.5) * TILE + (toVault[0] * TILE) / 2;
        const ez = (oy + 0.5) * TILE + (toVault[1] * TILE) / 2;
        gate = { room: v.id, tx: ox, ty: oy, dx: toVault[0], dy: toVault[1], x: ex, z: ez, angle: Math.atan2(toVault[0], toVault[1]) };
        gate.edge = { x: dd.x, y: dd.y, dx: dd.dx, dy: dd.dy };
      }
    }
  }

  // ---------- a boarded-up room with the dead shut inside ----------
  let boarded = null;
  if (!loc.empty && !loc.raiders && rng.chance(Math.min(0.7, 0.18 + 0.1 * loc.difficulty) / Math.sqrt(nF))) {
    const cands = real.filter((r) => !r.stairs && !r.vault && !r.corridor && !r.lobby && !r.entry && !r.hub && degree(r) === 1 && r.area >= 2 && r.area <= 9);
    for (const v of rng.shuffle(cands)) {
      const dd = doors.find((q) => q.a === v.id || q.b === v.id);
      if (!dd) continue;
      v.boarded = true;
      setEdge(dd.x, dd.y, dd.dx, dd.dy, EDGE.GATE);
      const inA = roomOf[idx(dd.x, dd.y)] === v.id;
      const ox = inA ? dd.x + dd.dx : dd.x;
      const oy = inA ? dd.y + dd.dy : dd.y;
      const into = inA ? [-dd.dx, -dd.dy] : [dd.dx, dd.dy];
      const ex = (ox + 0.5) * TILE + (into[0] * TILE) / 2;
      const ez = (oy + 0.5) * TILE + (into[1] * TILE) / 2;
      boarded = { room: v.id, tx: ox, ty: oy, dx: into[0], dy: into[1], x: ex, z: ez, angle: Math.atan2(into[0], into[1]), edge: { x: dd.x, y: dd.y, dx: dd.dx, dy: dd.dy } };
      break;
    }
  }

  // ---------- finishes ----------
  const roomStyle = {};
  for (const r of real) {
    const pu = PURPOSE[r.purpose] || PURPOSE.hall;
    roomStyle[r.id] = { floor: rng.pick(pu.floor), wall: rng.pick(pu.wall) };
  }
  // corridors on one floor match each other
  const corrs = real.filter((r) => r.corridor);
  for (const c of corrs) roomStyle[c.id] = roomStyle[corrs[0].id];

  // ---------- placement ----------
  const out = {
    W,
    H,
    tiles,
    roomOf,
    rooms,
    yard,
    edgeE,
    edgeS,
    blocked,
    floor: f,
    nFloors: nF,
    upper: !ground,
    theme: { ...L.theme, yard: L.yard === 'biome' ? BIOMES[biome].ground : L.yard, outside: BIOMES[biome].ground },
    roomStyle,
    hiding: [],
    containers: [],
    vaultBoxes: [],
    survivors: [],
    pits: [],
    bearTraps: [],
    tripwires: [],
    glass: [],
    lamps: [],
    decor: [],
    enemies: [],
    furniture: [],
    windows: [],
    pickups: [],
    gate,
    boarded,
    nest: null,
    stairs: st ? { ...st, up: f < nF - 1, down: f > 0, room: stairRoom.id } : null,
    skipFloor: new Set(),
  };
  if (st) for (let y = st.y0; y < st.y0 + st.h; y++) for (let x = st.x0; x < st.x0 + st.w; x++) out.skipFloor.add(idx(x, y));
  // rooms open to the sky (a stadium's field)
  out.sky = new Set();
  for (const r of real) if (r.open) for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) out.sky.add(idx(x, y));
  const center = (x, y) => ({ x: (x + 0.5) * TILE, z: (y + 0.5) * TILE });
  const roomTiles = (r) => {
    const o = [];
    for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) o.push([x, y]);
    return o;
  };

  // where you come in on this floor
  const entryTile = ground ? { x: doorX, y: fp.y1 } : { x: st.landing.x, y: st.landing.y };

  // ---------- fine walkability grid (0.5 m) to keep every doorway reachable ----------
  const R = 0.5;
  const K = TILE / R;
  const GW = W * K;
  const GH = H * K;
  const solid = new Uint8Array(GW * GH);
  const cellTile = (cx, cy) => [Math.floor(cx / K), Math.floor(cy / K)];
  for (let cy = 0; cy < GH; cy++)
    for (let cx = 0; cx < GW; cx++) {
      const [tx, ty] = cellTile(cx, cy);
      const t = tiles[idx(tx, ty)];
      if (t === T.ROCK || (st && out.skipFloor.has(idx(tx, ty)) && !(tx === st.landing.x && ty === st.landing.y))) solid[cy * GW + cx] = 1;
    }
  // the strip along a wall is as good as solid for a body 0.3 m wide (the
  // monsters' nav grid sees it that way too)
  {
    const reach = 0.12 + 0.3;
    const post = (TILE - DOOR_W) / 2 + 0.3;
    for (let cy = 0; cy < GH; cy++)
      for (let cx = 0; cx < GW; cx++) {
        if (solid[cy * GW + cx]) continue;
        const [tx, ty] = cellTile(cx, cy);
        const lx = (cx + 0.5) * R - tx * TILE;
        const lz = (cy + 0.5) * R - ty * TILE;
        for (const [dx, dy, dist, along] of [
          [-1, 0, lx, lz],
          [1, 0, TILE - lx, lz],
          [0, -1, lz, lx],
          [0, 1, TILE - lz, lx],
        ]) {
          if (dist >= reach) continue;
          const nt = tiles[idx(tx + dx, ty + dy)];
          if (nt === T.ROCK) {
            if (dist < 0.3) solid[cy * GW + cx] = 1;
            continue;
          }
          const e = getEdge(tx, ty, dx, dy);
          if (e === EDGE.WALL || ((e === EDGE.DOOR || e === EDGE.GATE) && (along < post || along > TILE - post))) solid[cy * GW + cx] = 1;
        }
      }
  }
  const cellOf = (x, z) => [Math.floor(x / R), Math.floor(z / R)];
  // stepping between cells across a tile edge (a locked gate counts as
  // open: the vault behind it must be usable once it's unlocked)
  const crossOk = (cx, cy, nx, ny) => {
    const [tx, ty] = cellTile(cx, cy);
    const [ux, uy] = cellTile(nx, ny);
    if (tx === ux && ty === uy) return true;
    const e = getEdge(tx, ty, ux - tx, uy - ty);
    if (e === EDGE.NONE) return true;
    if (e !== EDGE.DOOR && e !== EDGE.GATE) return false;
    // through the doorway gap only
    const along = ux !== tx ? (cy + 0.5) * R - (ty + 0.5) * TILE : (cx + 0.5) * R - (tx + 0.5) * TILE;
    return Math.abs(along) < DOOR_W / 2 - 0.3;
  };
  const passE = new Uint8Array(GW * GH);
  const passS = new Uint8Array(GW * GH);
  for (let cy = 0; cy < GH; cy++)
    for (let cx = 0; cx < GW; cx++) {
      if (cx + 1 < GW && crossOk(cx, cy, cx + 1, cy)) passE[cy * GW + cx] = 1;
      if (cy + 1 < GH && crossOk(cx, cy, cx, cy + 1)) passS[cy * GW + cx] = 1;
    }
  const occ = new Uint8Array(solid);
  const items = []; // AABBs of solid pieces {x0,z0,x1,z1}
  const keepClear = []; // doorway and stair approaches
  for (const d of doors) {
    const ex = (d.x + 0.5) * TILE + (d.dx * TILE) / 2;
    const ez = (d.y + 0.5) * TILE + (d.dy * TILE) / 2;
    const hw = DOOR_W / 2 + 0.25;
    const dep = 1.25;
    if (d.dx) keepClear.push({ x0: ex - dep, z0: ez - hw, x1: ex + dep, z1: ez + hw });
    else keepClear.push({ x0: ex - hw, z0: ez - dep, x1: ex + hw, z1: ez + dep });
  }
  for (const [a, b] of opens) {
    // open plans: keep the seam between the rooms clear
    for (const s of touch.get(Math.min(a, b) + ',' + Math.max(a, b)) || []) {
      const ex = (s.x + 0.5) * TILE + (s.dx * TILE) / 2;
      const ez = (s.y + 0.5) * TILE + (s.dy * TILE) / 2;
      if (s.dx) keepClear.push({ x0: ex - 1, z0: ez - 1.2, x1: ex + 1, z1: ez + 1.2 });
      else keepClear.push({ x0: ex - 1.2, z0: ez - 1, x1: ex + 1.2, z1: ez + 1 });
    }
  }
  if (ground) {
    const c = center(doorX, fp.y1);
    keepClear.push({ x0: c.x - 1.4, z0: c.z - 0.2, x1: c.x + 1.4, z1: c.z + TILE / 2 });
  }
  if (gate) keepClear.push({ x0: gate.x - 1.3, z0: gate.z - 1.3, x1: gate.x + 1.3, z1: gate.z + 1.3 });
  if (boarded) keepClear.push({ x0: boarded.x - 1.3, z0: boarded.z - 1.3, x1: boarded.x + 1.3, z1: boarded.z + 1.3 });
  if (st) {
    const c = center(st.landing.x, st.landing.y);
    keepClear.push({ x0: c.x - 1.5, z0: c.z - 1.5, x1: c.x + 1.5, z1: c.z + 1.5 });
  }
  const overlaps = (a, b, m = 0) => a.x0 < b.x1 + m && a.x1 > b.x0 - m && a.z0 < b.z1 + m && a.z1 > b.z0 - m;
  const mustReach = [];
  for (const d of doors) {
    const ex = (d.x + 0.5) * TILE + (d.dx * TILE) / 2;
    const ez = (d.y + 0.5) * TILE + (d.dy * TILE) / 2;
    mustReach.push([ex - d.dx * 0.5, ez - d.dy * 0.5], [ex + d.dx * 0.5, ez + d.dy * 0.5]);
  }
  const entryC = center(entryTile.x, entryTile.y);
  // cells covered by a box (grown by a body's radius)
  const cellsOf = (b, inflate = 0.3) => {
    const o = [];
    const [cx0, cy0] = cellOf(b.x0 - inflate, b.z0 - inflate);
    const [cx1, cy1] = cellOf(b.x1 + inflate, b.z1 + inflate);
    for (let cy = Math.max(0, cy0); cy <= Math.min(GH - 1, cy1); cy++)
      for (let cx = Math.max(0, cx0); cx <= Math.min(GW - 1, cx1); cx++) {
        const px = (cx + 0.5) * R;
        const pz = (cy + 0.5) * R;
        if (px > b.x0 - inflate && px < b.x1 + inflate && pz > b.z0 - inflate && pz < b.z1 + inflate) o.push(cy * GW + cx);
      }
    return o;
  };
  let marked = 0;
  const seen = new Int32Array(GW * GH);
  let stamp = 0;
  const q = new Int32Array(GW * GH);
  function reachableAll(extra = null) {
    // fold newly committed pieces into the occupancy grid
    for (; marked < items.length; marked++) for (const c of cellsOf(items[marked])) occ[c] = 1;
    const tmp = extra ? cellsOf(extra).filter((c) => !occ[c]) : [];
    for (const c of tmp) occ[c] = 1;
    stamp++;
    const [sx, sy] = cellOf(entryC.x, entryC.z);
    let qh = 0;
    let qt = 0;
    q[qt++] = sy * GW + sx;
    seen[sy * GW + sx] = stamp;
    while (qh < qt) {
      const c = q[qh++];
      const cx = c % GW;
      if (passE[c] && seen[c + 1] !== stamp && !occ[c + 1]) {
        seen[c + 1] = stamp;
        q[qt++] = c + 1;
      }
      if (cx > 0 && passE[c - 1] && seen[c - 1] !== stamp && !occ[c - 1]) {
        seen[c - 1] = stamp;
        q[qt++] = c - 1;
      }
      if (passS[c] && seen[c + GW] !== stamp && !occ[c + GW]) {
        seen[c + GW] = stamp;
        q[qt++] = c + GW;
      }
      if (c >= GW && passS[c - GW] && seen[c - GW] !== stamp && !occ[c - GW]) {
        seen[c - GW] = stamp;
        q[qt++] = c - GW;
      }
    }
    for (const [x, z] of mustReach) {
      const [cx, cy] = cellOf(x, z);
      // the cell itself may be marked; accept a reachable neighbour
      let ok = false;
      for (const [dx, dy] of [[0, 0], ...DIRS4]) if (seen[(cy + dy) * GW + cx + dx] === stamp) ok = true;
      if (!ok) {
        for (const c of tmp) occ[c] = 0;
        return false;
      }
    }
    // and no piece may wall off a pocket of floor (a corner of a room you
    // could only reach by climbing over the furniture)
    let cut = 0;
    for (let c = 0; c < GW * GH; c++) if (!solid[c] && !occ[c] && seen[c] !== stamp) cut++;
    for (const c of tmp) occ[c] = 0;
    if (pocket < 0) pocket = cut;
    if (cut > pocket + 3) return false;
    pocket = Math.max(pocket, cut);
    return true;
  }
  let pocket = -1;

  // wall slots: a tile's side that is solid wall (or a thin wall)
  function slotsOf(r) {
    const o = [];
    for (const [x, y] of roomTiles(r))
      for (const [dx, dy] of DIRS4) {
        const nx = x + dx;
        const ny = y + dy;
        const nt = tiles[idx(nx, ny)];
        let face;
        let exterior = false;
        if (nt === T.ROCK) {
          face = TILE / 2;
          exterior = true;
        } else if (roomOf[idx(nx, ny)] !== r.id) {
          const e = getEdge(x, y, dx, dy);
          if (e !== EDGE.WALL) continue;
          face = TILE / 2 - HALF;
          exterior = nt === T.YARD;
        } else continue;
        // a doorway on a neighbouring side limits what fits here
        let perpDoor = false;
        for (const [px, py] of DIRS4) {
          if (px === dx && py === dy) continue;
          if (px === -dx && py === -dy) continue;
          const e = inFp(x + px, y + py) || tiles[idx(x + px, y + py)] === T.YARD ? getEdge(x, y, px, py) : EDGE.WALL;
          if (e === EDGE.DOOR || e === EDGE.GATE || (e === EDGE.NONE && roomOf[idx(x + px, y + py)] !== r.id)) perpDoor = true;
        }
        o.push({ x, y, dx, dy, face, exterior, perpDoor, used: 0 });
      }
    return o;
  }
  const slotMap = new Map();
  const slotsFor = (r) => {
    if (!slotMap.has(r.id)) slotMap.set(r.id, rng.shuffle(slotsOf(r)));
    return slotMap.get(r.id);
  };
  // put a piece against a wall; returns the placement or null
  function wallPiece(r, kind, w, dp, opts = {}) {
    for (const s of slotsFor(r)) {
      if (s.used & 1) continue;
      if (opts.exteriorOnly && !s.exterior) continue;
      if (s.perpDoor && w > 1.7) continue;
      const c = center(s.x, s.y);
      const off = s.face - dp / 2 - 0.03;
      const room = TILE - (s.perpDoor ? 0.9 : 0.25) - w;
      const lat = room > 0 ? rng.range(-room / 2, room / 2) : 0;
      const px = -s.dy;
      const pz = s.dx;
      const x = c.x + s.dx * off + px * lat;
      const z = c.z + s.dy * off + pz * lat;
      const sx = s.dx ? dp : w;
      const sz = s.dx ? w : dp;
      const box = { x0: x - sx / 2, z0: z - sz / 2, x1: x + sx / 2, z1: z + sz / 2 };
      if (keepClear.some((k) => overlaps(box, k))) continue;
      if (items.some((b) => overlaps(box, b, 0.06))) continue;
      if (!opts.noCheck && !reachableAll(box)) continue;
      items.push(box);
      s.used |= 1;
      if (opts.tall) s.used |= 2;
      return { kind, tx: s.x, ty: s.y, x, z, fx: -s.dx, fz: -s.dy, angle: Math.atan2(-s.dx, -s.dy), w, dp, box, slot: s };
    }
    return null;
  }
  // a piece standing out in a room
  function midPiece(r, kind, w, dp, solidPiece, at = null) {
    const x0 = r.x * TILE + 0.45;
    const z0 = r.y * TILE + 0.45;
    const x1 = (r.x + r.w) * TILE - 0.45;
    const z1 = (r.y + r.h) * TILE - 0.45;
    for (let a = 0; a < 14; a++) {
      const rot = (w > dp) === (r.w >= r.h) ? 0 : Math.PI / 2;
      const sx = rot ? dp : w;
      const sz = rot ? w : dp;
      if (sx > x1 - x0 || sz > z1 - z0) return null;
      const cx = at && a === 0 ? at.x : rng.range(x0 + sx / 2, x1 - sx / 2);
      const cz = at && a === 0 ? at.z : rng.range(z0 + sz / 2, z1 - sz / 2);
      const box = { x0: cx - sx / 2, z0: cz - sz / 2, x1: cx + sx / 2, z1: cz + sz / 2 };
      if (box.x0 < x0 || box.x1 > x1 || box.z0 < z0 || box.z1 > z1) continue;
      if (solidPiece) {
        if (keepClear.some((k) => overlaps(box, k))) continue;
        if (items.some((b) => overlaps(box, b, 0.5))) continue;
        if (!reachableAll(box)) continue;
        items.push(box);
      }
      return { kind, x: cx, z: cz, angle: rot + (rng.chance(0.5) ? Math.PI : 0), box };
    }
    return null;
  }
  const surfaces = [];
  const addSurface = (p, kind) => {
    const h = SURFACE[kind];
    if (h) surfaces.push({ x: p.x, z: p.z, y: h, r: Math.min(p.w || 1, 1) * 0.3 });
  };

  // ---------- spike pits (where the floor gave way) ----------
  const d = loc.difficulty;
  const pitChance = Math.min(0.04 + d * 0.05, 0.35);
  for (const r of real) {
    if (r.stairs || r.vault || r.w < 2 || r.h < 2 || r.corridor || !rng.chance(pitChance)) continue;
    const [x, y] = rng.pick(roomTiles(r));
    const c = center(x, y);
    const box = { x0: c.x - TILE / 2, z0: c.z - TILE / 2, x1: c.x + TILE / 2, z1: c.z + TILE / 2 };
    if (keepClear.some((k) => overlaps(box, k))) continue;
    if (!reachableAll(box)) continue;
    tiles[idx(x, y)] = T.PIT;
    items.push(box);
    out.pits.push({ tx: x, ty: y });
  }

  // ---------- containers that belong on this floor ----------
  const mine = [];
  for (let k = 0; k < loc.containers.length; k++) if (k % nF === (nF - 1 - f + nF) % nF || nF === 1) mine.push(k);
  const holders = real.filter((r) => !r.stairs && !r.vault && (PURPOSE[r.purpose]?.cont || []).length);
  for (const k of mine) {
    let p = null;
    for (let a = 0; a < 8 && !p && holders.length; a++) {
      const r = rng.pick(holders);
      const kind = rng.pick(PURPOSE[r.purpose].cont);
      p = wallPiece(r, kind, CONTAINER_WIDTH[kind], CONTAINER_DEPTH[kind], { tall: true });
    }
    if (!p) {
      // anywhere at all, as a crate
      for (const r of rng.shuffle(real.filter((q) => !q.stairs && !q.vault))) {
        p = wallPiece(r, 'crate', CONTAINER_WIDTH.crate, CONTAINER_DEPTH.crate);
        if (p) break;
      }
    }
    if (!p) continue;
    p.idx = k;
    out.containers.push(p);
    if (p.kind === 'desk') addSurface(p, 'desk');
  }
  // the vault's boxes
  if (gate) {
    const v = rooms[gate.room];
    const kinds = { police: 'gunlocker', military: 'gunlocker', hospital: 'medcab', office: 'cabinet', skyscraper: 'cabinet', mall: 'gunlocker' }[loc.type] || 'crate';
    loc.lock.boxes.forEach((_, k) => {
      const kind = k === 0 ? kinds : rng.pick([kinds, 'crate', 'footlocker']);
      const p = wallPiece(v, kind, CONTAINER_WIDTH[kind], CONTAINER_DEPTH[kind], { tall: true }) || wallPiece(v, 'footlocker', CONTAINER_WIDTH.footlocker, CONTAINER_DEPTH.footlocker);
      if (!p) return;
      p.idx = k;
      p.vault = true;
      out.vaultBoxes.push(p);
    });
  }

  // ---------- hiding spots ----------
  const HIDE_DEPTH = { locker: 0.65, closet: 0.75, bed: 1.15, bench: 0.6 };
  const HIDE_W = { locker: 0.85, closet: 1.3, bed: 2.0, bench: 2.0 };
  for (const r of real) {
    const kinds = PURPOSE[r.purpose]?.hide || [];
    if (!kinds.length || r.stairs) continue;
    const n = r.area >= 4 ? rng.int(0, 2) : rng.int(0, 1);
    for (let k = 0; k < n; k++) {
      const kind = rng.pick(kinds);
      const p = wallPiece(r, kind, HIDE_W[kind], HIDE_DEPTH[kind], { tall: kind !== 'bed' && kind !== 'bench' });
      if (p) {
        out.hiding.push(p);
        if (kind === 'bed') r.hasBed = true;
      }
    }
  }

  // ---------- furniture ----------
  for (const r of real) {
    const pu = PURPOSE[r.purpose];
    if (!pu || r.stairs) continue;
    // middle pieces first (tables, aisles, racks), laid out on a grid in big rooms
    for (const [kind, chance, count = 1] of pu.mid) {
      const F = FURN[kind];
      if (F.decor) continue;
      // several of a kind stand in rows (aisles, racks, desks, tables)
      const anchors = [];
      if (count > 1) {
        // rows along the room's long axis, standing on the lines between
        // tiles so there's always a clear lane through the tile centres
        const wide = r.w >= r.h;
        const nLong = wide ? r.w : r.h;
        const nShort = wide ? r.h : r.w;
        const pw = Math.max(F.w, F.d);
        const square = F.w > 2.4 && F.d > 2.4;
        const rows = [];
        if (square) for (let a = 0; a < nShort; a++) rows.push((a + 0.5) * TILE);
        else for (let a = 1; a < nShort; a++) rows.push(a * TILE);
        if (!rows.length) rows.push((nShort * TILE) / 2);
        const step = square ? 2 : pw > TILE * 0.9 ? 2 : 1;
        for (const v of rows)
          for (let b2 = 0; b2 < nLong; b2 += step) {
            if (b2 === 0 && nLong > 2 && !square) continue; // keep the end aisle open
            const u = (b2 + 0.5) * TILE;
            anchors.push(wide ? { x: r.x * TILE + u, z: r.y * TILE + v } : { x: r.x * TILE + v, z: r.y * TILE + u });
          }
      } else anchors.push({ x: (r.x + r.w / 2) * TILE, z: (r.y + r.h / 2) * TILE });
      const n = Math.min(count, anchors.length);
      for (let i = 0; i < n; i++) {
        if (!rng.chance(chance)) continue;
        const at = anchors[i];
        const p = midPiece(r, kind, F.w, F.d, true, at);
        if (p) {
          out.furniture.push(p);
          addSurface(p, kind);
        }
      }
    }
    for (const [kind, chance] of pu.items) {
      if (kind === 'bed' && r.hasBed) continue;
      if (!rng.chance(chance)) continue;
      const F = FURN[kind];
      const p = wallPiece(r, kind, F.w, F.d, { tall: F.tall });
      if (p) {
        out.furniture.push(p);
        addSurface(p, kind);
      }
    }
    // cells: a line of bars across the room, its barred door hanging open
    if (pu.bars) {
      for (const s of slotsFor(r)) {
        if (s.used & 1) continue;
        const c = center(s.x, s.y);
        const off = s.face - 1.75;
        const x = c.x + s.dx * off;
        const z = c.z + s.dy * off;
        const px = -s.dy;
        const pz = s.dx;
        // solid either side of the open door (from -1.45..0.35 and 1.35..1.45 along the line)
        const seg = (a, b) => {
          const ax = x + px * a;
          const az = z + pz * a;
          const bx = x + px * b;
          const bz = z + pz * b;
          return { x0: Math.min(ax, bx) - 0.06, z0: Math.min(az, bz) - 0.06, x1: Math.max(ax, bx) + 0.06, z1: Math.max(az, bz) + 0.06 };
        };
        const boxes = [seg(-1.45, 0.35), seg(1.35, 1.45)];
        if (boxes.some((b) => keepClear.some((k) => overlaps(b, k)) || items.some((q) => overlaps(b, q)))) continue;
        if (!reachableAll(boxes[0]) || !reachableAll(boxes[1])) continue;
        items.push(...boxes);
        s.used |= 1;
        out.furniture.push({ kind: 'cellBars', x, z, angle: Math.atan2(-s.dx, -s.dy), boxes });
        break;
      }
    }
    // rugs, clutter, the ceiling light
    for (const [kind, chance] of pu.mid) {
      const F = FURN[kind];
      if (!F.decor || !rng.chance(chance)) continue;
      const p = midPiece(r, kind, Math.min(F.w, r.w * TILE - 1.2), Math.min(F.d, r.h * TILE - 1.2), false, kind === 'rug' ? { x: (r.x + r.w / 2) * TILE, z: (r.y + r.h / 2) * TILE } : null);
      if (p) out.furniture.push({ ...p, decorOnly: true });
    }
    if (!r.corridor || rng.chance(0.5)) out.furniture.push({ kind: 'ceilingLight', x: (r.x + r.w / 2) * TILE, z: (r.y + r.h / 2) * TILE, angle: r.w >= r.h ? 0 : Math.PI / 2, decorOnly: true });
    if (r.corridor && r.w > 3) for (let x = r.x + 2; x < r.x + r.w - 1; x += 3) out.furniture.push({ kind: 'ceilingLight', x: (x + 0.5) * TILE, z: (r.y + 0.5) * TILE, angle: 0, decorOnly: true });
    // pictures, posters and clocks on free walls
    for (let k = 0; k < (pu.deco || 0); k++) {
      const kind = r.purpose === 'bullpen' || r.purpose === 'frontdesk' || r.purpose === 'command' || r.purpose === 'corridor' ? rng.pick(['poster', 'clock', 'picture']) : rng.pick(['picture', 'picture', 'clock', 'poster']);
      const s = slotsFor(r).find((q) => !(q.used & 6));
      if (!s) break;
      s.used |= 4;
      const c = center(s.x, s.y);
      const off = s.face - 0.03;
      const lat = rng.range(-0.6, 0.6);
      out.furniture.push({ kind, x: c.x + s.dx * off - s.dy * lat, z: c.z + s.dy * off + s.dx * lat, angle: Math.atan2(-s.dx, -s.dy), decorOnly: true });
    }
  }

  // ---------- windows in the outside walls ----------
  for (const r of real) {
    if (r.stairs || r.vault) continue;
    for (const s of slotsFor(r)) {
      if (!s.exterior || s.used & 6) continue;
      if (!rng.chance(ground ? 0.35 : 0.45)) continue;
      s.used |= 8;
      const c = center(s.x, s.y);
      const off = s.face - 0.02;
      const wide = loc.type === 'skyscraper' || loc.type === 'office' || loc.type === 'mall';
      out.windows.push({ x: c.x + s.dx * off, z: c.z + s.dy * off, angle: Math.atan2(-s.dx, -s.dy), w: wide ? 2.5 : 1.3, h: wide ? 2.1 : 1.4, boarded: rng.chance(0.28), lowSill: !!(s.used & 1) });
    }
  }

  // ---------- emergency lamps ----------
  for (const r of real) {
    if (r.stairs ? !rng.chance(0.8) : !rng.chance(0.5)) continue;
    const s = slotsFor(r).find((q) => !(q.used & 12));
    if (!s) continue;
    const c = center(s.x, s.y);
    const off = s.face - 0.05;
    out.lamps.push({ x: c.x + s.dx * off, z: c.z + s.dy * off, fx: -s.dx, fz: -s.dy, red: rng.chance(0.35) });
  }

  // ---------- free floor spots ----------
  const doorDist = new Int32Array(W * H).fill(-1);
  {
    const q = [idx(entryTile.x, entryTile.y)];
    doorDist[q[0]] = 0;
    for (let h = 0; h < q.length; h++) {
      const c = q[h];
      const cx = c % W;
      const cy = (c - cx) / W;
      for (const [dx, dy] of DIRS4) {
        const nx = cx + dx;
        const ny = cy + dy;
        const ni = idx(nx, ny);
        if (doorDist[ni] >= 0 || !inFp(nx, ny) || tiles[ni] === T.ROCK) continue;
        const e = getEdge(cx, cy, dx, dy);
        if (e === EDGE.WALL || e === EDGE.GATE) continue;
        doorDist[ni] = doorDist[c] + 1;
        q.push(ni);
      }
    }
  }
  const taken = [];
  const freeSpot = (r, minDist = 0) => {
    for (let a = 0; a < 40; a++) {
      const [x, y] = rng.pick(roomTiles(r));
      if (tiles[idx(x, y)] !== T.FLOOR || out.skipFloor.has(idx(x, y))) continue;
      if (doorDist[idx(x, y)] < minDist) continue;
      const p = { x: (x + rng.range(0.25, 0.75)) * TILE, z: (y + rng.range(0.25, 0.75)) * TILE };
      const b = { x0: p.x - 0.45, z0: p.z - 0.45, x1: p.x + 0.45, z1: p.z + 0.45 };
      if (items.some((q) => overlaps(b, q))) continue;
      if (taken.some((t) => Math.hypot(t.x - p.x, t.z - p.z) < 1.2)) continue;
      taken.push(p);
      return { ...p, tx: x, ty: y };
    }
    return null;
  };
  const usable = real.filter((r) => !r.stairs && !r.vault && !r.boarded);
  const farRooms = usable
    .map((r) => ({ r, d: doorDist[idx(Math.round(r.cx), Math.round(r.cy))] }))
    .sort((a, b) => b.d - a.d)
    .map((e) => e.r);

  // ---------- survivors (and dogs) holed up far from the way in ----------
  loc.survivors.forEach((rec, k) => {
    if (nF - 1 - (k % nF) !== f) return;
    for (const r of farRooms.slice(0, 3).concat(farRooms)) {
      const p = freeSpot(r, 2);
      if (p) {
        out.survivors.push({ x: p.x, z: p.z, idx: k });
        return;
      }
    }
  });

  // ---------- batteries, the key, notes ----------
  const onSurfaceOrFloor = (minDist = 0) => {
    if (surfaces.length && rng.chance(0.65)) {
      const s = surfaces.splice(rng.int(0, surfaces.length - 1), 1)[0];
      return { x: s.x + rng.range(-s.r, s.r), z: s.z + rng.range(-s.r, s.r), y: s.y };
    }
    const r = rng.pick(farRooms.length ? farRooms : usable);
    const p = r && freeSpot(r, minDist);
    return p ? { x: p.x, z: p.z, y: 0 } : null;
  };
  const nb = loc.batteries || 0;
  for (let k = 0; k < nb; k++) if (k % nF === f) {
    const p = onSurfaceOrFloor();
    if (p) out.pickups.push({ kind: 'battery', ...p });
  }
  if (loc.key && S.keyFloor === f) {
    const p = onSurfaceOrFloor(3);
    if (p) out.pickups.push({ kind: 'key', ...p });
  }
  (loc.notes || []).forEach((n, k) => {
    if (k % nF !== f) return;
    const p = onSurfaceOrFloor();
    if (p) out.pickups.push({ kind: 'note', note: k, ...p });
  });
  // the hint pinned beside the gate
  if (gate && loc.lock.note) {
    const px = -gate.dy;
    const pz = gate.dx;
    out.pickups.push({ kind: 'gatenote', x: gate.x - gate.dx * 0.06 + px * 1.15, z: gate.z - gate.dy * 0.06 + pz * 1.15, y: 1.5, angle: gate.angle + Math.PI, pinned: true });
  }

  // ---------- hazards ----------
  const allFloor = [];
  for (let y = fp.y0; y <= fp.y1; y++) for (let x = fp.x0; x <= fp.x1; x++) if (tiles[idx(x, y)] === T.FLOOR && !out.skipFloor.has(idx(x, y)) && !rooms[roomOf[idx(x, y)]].vault) allFloor.push([x, y]);
  const bearCount = Math.max(0, Math.round((d - 1 + rng.int(0, 1)) * (nF > 1 ? 0.7 : 1)));
  for (let k = 0; k < bearCount; k++) {
    const r = rng.pick(usable);
    const p = r && freeSpot(r, 4);
    if (p) out.bearTraps.push({ x: p.x, z: p.z });
  }
  const corrTiles = allFloor.filter(([x, y]) => {
    const r = rooms[roomOf[idx(x, y)]];
    if (!r.corridor || doorDist[idx(x, y)] < 4) return false;
    if (keepClear.some((k) => overlaps({ x0: x * TILE, z0: y * TILE, x1: (x + 1) * TILE, z1: (y + 1) * TILE }, k))) return false;
    return true;
  });
  rng.shuffle(corrTiles);
  const wireCount = Math.min(Math.floor(d * 0.6 * (nF > 1 ? 0.7 : 1)), corrTiles.length);
  for (let k = 0; k < wireCount; k++) {
    const [x, y] = corrTiles[k];
    const r = rooms[roomOf[idx(x, y)]];
    const c = center(x, y);
    out.tripwires.push({ tx: x, ty: y, x: c.x, z: c.z, alongX: r.w >= r.h });
  }
  for (let k = 0; k < 1 + Math.floor(d / (nF > 1 ? 2 : 1)); k++) {
    const t = rng.pick(allFloor);
    if (t && doorDist[idx(t[0], t[1])] >= 2) out.glass.push({ tx: t[0], ty: t[1] });
  }
  for (let k = 0; k < Math.round((14 + d * 4) * (nF > 1 ? 0.8 : 1)); k++) {
    const [x, y] = rng.pick(allFloor);
    const c = center(x, y);
    out.decor.push({ kind: rng.pick(['blood', 'blood', 'debris', 'debris', 'bones', 'skull']), x: c.x + rng.range(-1, 1), z: c.z + rng.range(-1, 1), rot: rng.range(0, Math.PI * 2), s: rng.range(0.7, 1.4) });
  }

  // ---------- tiles monsters path around ----------
  for (const b of items) {
    const [tx, ty] = [Math.floor((b.x0 + b.x1) / 2 / TILE), Math.floor((b.z0 + b.z1) / 2 / TILE)];
    const c = center(tx, ty);
    if (c.x > b.x0 - 0.3 && c.x < b.x1 + 0.3 && c.z > b.z0 - 0.3 && c.z < b.z1 + 0.3 && tiles[idx(tx, ty)] === T.FLOOR) blocked[idx(tx, ty)] = 1;
  }
  // never wall off the way through: doorways stay open on both sides, and a
  // room the monsters can't path into gets its tiles back
  for (const dd of doors) {
    blocked[idx(dd.x, dd.y)] = 0;
    blocked[idx(dd.x + dd.dx, dd.y + dd.dy)] = 0;
  }
  blocked[idx(entryTile.x, entryTile.y)] = 0;
  if (st) blocked[idx(st.landing.x, st.landing.y)] = 0;
  for (let pass = 0; pass < 4; pass++) {
    const reach = new Uint8Array(W * H);
    const q = [idx(entryTile.x, entryTile.y)];
    reach[q[0]] = 1;
    for (let h = 0; h < q.length; h++) {
      const c = q[h];
      const cx = c % W;
      const cy = (c - cx) / W;
      for (const [dx, dy] of DIRS4) {
        const nx = cx + dx;
        const ny = cy + dy;
        const ni = idx(nx, ny);
        if (reach[ni] || !inFp(nx, ny) || tiles[ni] !== T.FLOOR || blocked[ni]) continue;
        const e = getEdge(cx, cy, dx, dy);
        if (e === EDGE.WALL || e === EDGE.GATE) continue;
        reach[ni] = 1;
        q.push(ni);
      }
    }
    let changed = false;
    for (const r of real) {
      if (r.vault || r.stairs || r.boarded) continue;
      // every open tile of the room must be reachable, or the room's
      // furniture stops counting as walls for the monsters
      let stranded = false;
      for (const [x, y] of roomTiles(r)) if (tiles[idx(x, y)] === T.FLOOR && !blocked[idx(x, y)] && !reach[idx(x, y)]) stranded = true;
      if (stranded)
        for (const [x, y] of roomTiles(r))
          if (blocked[idx(x, y)]) {
            blocked[idx(x, y)] = 0;
            changed = true;
          }
    }
    if (!changed) break;
  }

  // ---------- zombies ----------
  // some places are, by luck, empty of the dead
  const roster = loc.empty ? [] : loc.raiders ? raiderRoster(loc, rng, nF) : enemyRoster(loc, rng, real.length, nF > 1 ? 0.62 : 1, f === nF - 1);
  const spawnTiles = rng.shuffle(allFloor.filter(([x, y]) => doorDist[idx(x, y)] > 3 && !blocked[idx(x, y)]));
  const fallback = rng.shuffle(allFloor.filter(([x, y]) => doorDist[idx(x, y)] > 1 && !blocked[idx(x, y)]));
  const spawnList = spawnTiles.length > 4 ? spawnTiles : fallback.length ? fallback : allFloor;
  let si = 0;
  const taken2 = [];
  for (const type of roster) {
    let chosen = null;
    for (let a = 0; a < spawnList.length; a++) {
      const t = spawnList[(si + a) % spawnList.length];
      if (taken2.filter(([x, y]) => x === t[0] && y === t[1]).length < 2) {
        chosen = t;
        si += a + 1;
        break;
      }
    }
    if (!chosen) chosen = spawnList[si++ % spawnList.length];
    taken2.push(chosen);
    const c = center(chosen[0], chosen[1]);
    out.enemies.push({ type, x: c.x + rng.range(-0.7, 0.7), z: c.z + rng.range(-0.7, 0.7), gun: type === 'raider' ? raiderGun(loc, rng) : undefined });
    // a lurker lies in a pool of blood among the bones
    if (type === 'lurker') {
      const e = out.enemies[out.enemies.length - 1];
      out.decor.push({ kind: 'blood', x: e.x, z: e.z, rot: rng.range(0, Math.PI * 2), s: 1.4 });
      out.decor.push({ kind: rng.pick(['bones', 'skull']), x: e.x + rng.range(-1, 1), z: e.z + rng.range(-1, 1), rot: rng.range(0, Math.PI * 2), s: 1 });
    }
  }
  // the dead shut in behind the boards
  if (boarded) {
    const r = rooms[boarded.room];
    const tilesIn = roomTiles(r).filter(([x, y]) => tiles[idx(x, y)] === T.FLOOR && !out.skipFloor.has(idx(x, y)));
    const n = Math.min(tilesIn.length * 2, 2 + rng.int(0, 1 + Math.floor(d / 2)));
    for (let k = 0; k < n; k++) {
      const [x, y] = rng.pick(tilesIn);
      const c = center(x, y);
      out.enemies.push({ type: pickWeighted(rng, { walker: 3, grunt: 1.5, runner: 1, rotter: d >= 3 ? 0.6 : 0 }), x: c.x + rng.range(-0.6, 0.6), z: c.z + rng.range(-0.6, 0.6), trapped: true });
    }
  }
  // a nest: a mound of flesh the dead crawl out of until it's destroyed
  if (!loc.empty && !loc.raiders && d >= 2 && rng.chance(Math.min(0.6, 0.15 + 0.08 * d) / Math.sqrt(nF))) {
    const rs = rng.shuffle(usable.filter((r) => !r.corridor && !r.entry && r.area >= 4));
    for (const r of rs) {
      const p = freeSpot(r, 4);
      if (!p) continue;
      out.nest = { x: p.x, z: p.z, room: r.id, hp: 260 + 50 * d };
      out.decor.push({ kind: 'blood', x: p.x, z: p.z, rot: 0, s: 2.6 });
      break;
    }
  }

  // ---------- outline, lot, the way in and out ----------
  out.shell = { x0: fp.x0, x1: fp.x1, y0: fp.y0, y1: fp.y1 };
  out.front = lotTop;
  out.door = { x: doorX, y: fp.y1, dir: [0, -1] };
  out.outside = { x: doorX, y: fp.y1 };
  out.lotType = loc.type;
  if (ground) {
    out.lot = { x0: yard.x, x1: yard.x + YW - 1, y0: lotTop, y1: H - 2 };
    out.yardWorld = { x0: yard.x * TILE, z0: lotTop * TILE, x1: (yard.x + YW) * TILE, z1: (H - 1) * TILE };
    const doorWX = (doorX + 0.5) * TILE;
    out.spawn = { x: doorWX, z: (H - 1) * TILE - 2.2, yaw: 0 };
    out.exit = { x: doorWX + 2.6, z: (H - 1) * TILE - 1.0 };
  }
  if (st) {
    // arriving by the stairs: step off the landing, facing out of the stairwell
    const c = center(st.landing.x, st.landing.y);
    const ox = st.landing.x - st.far.x;
    const oy = st.landing.y - st.far.y;
    out.stairs.spot = { x: c.x + ox * 0.4, z: c.z + oy * 0.4, yaw: Math.atan2(-ox, -oy) };
    out.stairs.use = { x: c.x - ox * 0.6, z: c.z - oy * 0.6 };
    if (!ground) out.spawn = { x: c.x + ox * 0.6, z: c.z + oy * 0.6, yaw: Math.atan2(-ox, -oy) };
  }
  return out;
}

function isStairDoor(s, st) {
  // the shared edge s must be the one between the landing and st.door
  const a = { x: s.x, y: s.y };
  const b = { x: s.x + s.dx, y: s.y + s.dy };
  const eq = (p, q) => p.x === q.x && p.y === q.y;
  return (eq(a, st.landing) && eq(b, st.door)) || (eq(b, st.landing) && eq(a, st.door));
}

// ---------------------------------------------------------------- floor plans
// Corridor buildings: bands of rooms either side of one or two corridors,
// with a lobby at the front door on the ground floor.
function planCorridor(S, f, rng, addRoom, opens) {
  const { P, fp, bands, doorX, stairs } = S;
  const ground = f === 0;
  const corridors = [];
  for (const b of bands) if (b.kind === 'corridor') corridors.push(addRoom(fp.x0, b.y, fp.w, 1, { corridor: true }));
  if (stairs) addRoom(stairs.x0, stairs.y0, stairs.w, stairs.h, { stairs: true });
  for (const b of bands) {
    if (b.kind !== 'rooms') continue;
    const segs = [];
    let x = fp.x0;
    const blockedCol = (cx) => stairs && cx >= stairs.x0 && cx < stairs.x0 + stairs.w && b.y <= stairs.y0 + stairs.h - 1 && b.y + b.h - 1 >= stairs.y0;
    // the lobby, open to the corridor
    let lobby = null;
    if (ground && b.front) {
      const lw = Math.min(P.lobby, fp.w - 2);
      const lx = Math.max(fp.x0, Math.min(fp.x1 - lw + 1, doorX - Math.floor(lw / 2)));
      lobby = addRoom(lx, b.y, lw, b.h, { lobby: true });
      opens.push([lobby.id, corridors[0].id]);
    }
    let start = fp.x0;
    for (x = fp.x0; x <= fp.x1 + 1; x++) {
      const stop = x > fp.x1 || (lobby && x >= lobby.x && x < lobby.x + lobby.w) || blockedCol(x);
      if (stop) {
        if (x > start) segs.push([start, x - 1]);
        start = x + 1;
      }
    }
    // whatever the stairwell leaves of its column is a closet
    if (stairs && blockedCol(stairs.x0)) {
      if (stairs.y0 > b.y) addRoom(stairs.x0, b.y, 1, stairs.y0 - b.y, {});
      const below = b.y + b.h - (stairs.y0 + stairs.h);
      if (below > 0) addRoom(stairs.x0, stairs.y0 + stairs.h, 1, below, {});
    }
    for (const [s0, s1] of segs) {
      let cx = s0;
      const len = s1 - s0 + 1;
      // sometimes one big room (an open-plan office, barracks, a ward)
      const big = len >= 4 && rng.chance(P.room[1] >= 4 ? 0.35 : 0.15);
      if (big) {
        addRoom(s0, b.y, len, b.h, {});
        continue;
      }
      while (cx <= s1) {
        let w = rng.int(P.room[0], P.room[1]);
        if (s1 - (cx + w) + 1 < P.room[0]) w = s1 - cx + 1;
        addRoom(cx, b.y, w, b.h, {});
        cx += w;
      }
    }
  }
}

// Houses: carve the footprint into rooms, keeping the stairwell clear.
function planHouse(S, f, rng, addRoom) {
  const { fp, stairs, doorX } = S;
  let rects = [{ x: fp.x0, y: fp.y0, w: fp.w, h: fp.h }];
  if (stairs) {
    // guillotine cuts that leave the stairwell as its own piece
    const cut = (list, axis, at) => {
      const outL = [];
      for (const r of list) {
        if (axis === 'x' && at > r.x && at < r.x + r.w) outL.push({ ...r, w: at - r.x }, { ...r, x: at, w: r.x + r.w - at });
        else if (axis === 'y' && at > r.y && at < r.y + r.h) outL.push({ ...r, h: at - r.y }, { ...r, y: at, h: r.y + r.h - at });
        else outL.push(r);
      }
      return outL;
    };
    const s = stairs;
    // cut the column holding the stairs, then the stairs out of it
    rects = cut(rects, 'x', s.x0);
    rects = cut(rects, 'x', s.x0 + s.w);
    const col = rects.filter((r) => r.x === s.x0 && r.w === s.w);
    const rest = rects.filter((r) => !(r.x === s.x0 && r.w === s.w));
    let colParts = cut(col, 'y', s.y0);
    colParts = cut(colParts, 'y', s.y0 + s.h);
    rects = rest.concat(colParts.filter((r) => !(r.y === s.y0 && r.h === s.h)));
    addRoom(s.x0, s.y0, s.w, s.h, { stairs: true });
  }
  // split big pieces into rooms
  const leaves = [];
  const split = (r) => {
    const area = r.w * r.h;
    const target = rng.int(2, 6);
    if ((area <= target && r.w <= 3 && r.h <= 3) || (r.w === 1 && r.h <= 3) || (r.h === 1 && r.w <= 3)) return leaves.push(r);
    const alongX = r.w > r.h || (r.w === r.h && rng.chance(0.5));
    if (alongX && r.w >= 2) {
      const at = rng.int(1, r.w - 1);
      split({ x: r.x, y: r.y, w: at, h: r.h });
      split({ x: r.x + at, y: r.y, w: r.w - at, h: r.h });
    } else if (r.h >= 2) {
      const at = rng.int(1, r.h - 1);
      split({ x: r.x, y: r.y, w: r.w, h: at });
      split({ x: r.x, y: r.y + at, w: r.w, h: r.h - at });
    } else leaves.push(r);
  };
  rects.forEach(split);
  for (const r of leaves) {
    const hasDoor = f === 0 && r.y + r.h - 1 === fp.y1 && doorX >= r.x && doorX < r.x + r.w;
    // a long, thin room through the middle of the house is a hallway
    const hall = (r.w === 1 && r.h >= 3) || (r.h === 1 && r.w >= 3);
    addRoom(r.x, r.y, r.w, r.h, { hub: hall || hasDoor });
  }
}

// Gas stations: the shop floor, with a stockroom, office and toilet behind.
function planShop(S, rng, addRoom) {
  const { fp } = S;
  const backH = 1;
  let x = fp.x0;
  const kinds = rng.shuffle(['storage', 'office', 'restroom']);
  let k = 0;
  while (x <= fp.x1) {
    const w = Math.min(fp.x1 - x + 1, kinds[k] === 'restroom' ? 1 : rng.int(1, 2));
    addRoom(x, fp.y0, w, backH, { want: kinds[k % kinds.length] });
    x += w;
    k++;
  }
  addRoom(fp.x0, fp.y0 + backH, fp.w, fp.h - backH, { hub: true, want: 'shop' });
}

// Warehouses: a big hall behind a strip of offices along the front.
function planHall(S, rng, addRoom) {
  const { fp, doorX } = S;
  const fh = 2;
  const fy = fp.y1 - fh + 1;
  const lw = 2;
  const lx = Math.max(fp.x0, Math.min(fp.x1 - lw + 1, doorX - rng.int(0, 1)));
  addRoom(lx, fy, lw, fh, { lobby: true, want: 'lobbySmall' });
  for (const [a, b] of [
    [fp.x0, lx - 1],
    [lx + lw, fp.x1],
  ]) {
    let x = a;
    while (x <= b) {
      const w = Math.min(b - x + 1, rng.int(2, 3));
      addRoom(x, fy, w, fh, { noHub: false });
      x += w;
    }
  }
  addRoom(fp.x0, fp.y0, fp.w, fp.h - fh, { hub: true, want: S.P.hall || 'warehouseHall', open: !!S.P.openHall });
}

// ---------------------------------------------------------------- purposes
function assignPurposes(S, f, rng, rooms, doors) {
  const { loc, nF } = S;
  const type = loc.type;
  const real = rooms.filter((r) => !r.yard);
  const top = f === nF - 1;
  const set = (r, p) => (r.purpose = r.purpose || p);
  for (const r of real) {
    if (r.stairs) r.purpose = 'stairs';
    else if (r.corridor) r.purpose = 'corridor';
    else if (r.want) r.purpose = r.want === 'lobbySmall' ? 'lobby' : r.want;
  }
  const free = () => rng.shuffle(real.filter((r) => !r.purpose));
  const bySize = (list) => list.slice().sort((a, b) => b.area - a.area);
  const smallest = (list) => list.slice().sort((a, b) => a.area - b.area)[0];
  const lobbies = real.filter((r) => r.lobby);
  switch (type) {
    case 'home': {
      const rest = free();
      const halls = rest.filter((r) => (r.w === 1 && r.h >= 3) || (r.h === 1 && r.w >= 3));
      halls.forEach((r) => set(r, 'hall'));
      let left = rest.filter((r) => !r.purpose);
      if (f === 0) {
        const entry = left.find((r) => r.hub) || bySize(left)[0];
        if (entry) set(entry, 'living');
        left = left.filter((r) => !r.purpose);
        const big = bySize(left);
        if (big[0]) set(big[0], 'kitchen');
        const bath = smallest(left.filter((r) => !r.purpose));
        if (bath) set(bath, 'bath');
        for (const r of left.filter((q) => !q.purpose)) set(r, r.area >= 4 ? (nF === 1 ? rng.pick(['bedroom', 'dining', 'bedroom']) : 'dining') : nF === 1 ? rng.pick(['bedroom', 'kids', 'laundry']) : rng.pick(['laundry', 'study', 'closetRoom']));
      } else {
        const big = bySize(left);
        if (big[0]) set(big[0], 'bedroom');
        const bath = smallest(left.filter((r) => !r.purpose));
        if (bath) set(bath, 'bath');
        for (const r of left.filter((q) => !q.purpose)) set(r, r.area >= 2 ? rng.pick(['bedroom', 'kids', 'study']) : 'closetRoom');
      }
      break;
    }
    case 'apartment': {
      lobbies.forEach((r) => set(r, 'lobby'));
      const left = free();
      if (f === 0 && left.length > 2) {
        set(left[0], 'laundry');
        set(left[1], 'storage');
      }
      for (const r of left.filter((q) => !q.purpose)) set(r, 'unit');
      break;
    }
    case 'office':
    case 'skyscraper': {
      lobbies.forEach((r) => set(r, type === 'skyscraper' ? 'lobbyGrand' : 'lobby'));
      const left = bySize(free());
      if (type === 'skyscraper' && top && left[0]) set(left[0], 'executive');
      for (const r of left.filter((q) => !q.purpose && q.area >= 8)) set(r, 'cubicles');
      const rest = free();
      if (rest[0]) set(smallest(rest), 'restroom');
      const rest2 = free();
      if (rest2[0]) set(rest2[0], 'breakroom');
      const rest3 = free().filter((r) => r.area >= 4);
      if (rest3[0]) set(rest3[0], 'conference');
      for (const r of free()) set(r, r.area >= 8 ? 'cubicles' : 'office');
      break;
    }
    case 'hospital': {
      lobbies.forEach((r) => set(r, 'waiting'));
      const left = free();
      if (f === 0 && left[0]) set(left[0], 'pharmacy');
      const rest = free();
      if (rest[0]) set(smallest(rest), 'restroom');
      for (const r of free()) set(r, r.area >= 6 ? 'ward' : r.area >= 3 ? rng.pick(['exam', 'ward', 'exam']) : rng.pick(['exam', 'office']));
      break;
    }
    case 'police': {
      lobbies.forEach((r) => set(r, 'frontdesk'));
      const big = bySize(free());
      if (big[0]) set(big[0], 'bullpen');
      const left = free();
      if (f === 0) {
        if (left[0]) set(left[0], 'cells');
        if (left[1]) set(left[1], 'cells');
        if (left[2]) set(left[2], 'interrogation');
      }
      const rest = free();
      if (rest[0]) set(rest[0], 'lockerroom');
      if (rest[1]) set(rest[1], 'armory');
      for (const r of free()) set(r, 'office');
      break;
    }
    case 'military': {
      lobbies.forEach((r) => set(r, 'command'));
      const big = bySize(free());
      if (big[0]) set(big[0], 'barracks');
      if (big[1] && f === 0) set(big[1], 'mess');
      const left = free();
      if (left[0]) set(left[0], 'armory');
      if (left[1]) set(left[1], 'showers');
      for (const r of free()) set(r, rng.pick(['barracks', 'storage', 'command', 'barracks']));
      break;
    }
    case 'stadium': {
      const left = free();
      if (left[0]) set(left[0], 'concession');
      if (left[1]) set(left[1], 'lockerroom');
      if (left[2]) set(left[2], 'exam');
      for (const r of free()) set(r, rng.pick(['concession', 'office', 'storage']));
      break;
    }
    case 'mall': {
      lobbies.forEach((r) => set(r, 'atrium'));
      const big = bySize(free());
      if (big[0] && f === nF - 1) set(big[0], 'foodcourt');
      const rest = free();
      if (rest[0]) set(smallest(rest), 'restroom');
      const stores = ['storeGrocery', 'storeSports', 'storeClothes', 'storeHardware'];
      free().forEach((r, i) => set(r, i < stores.length ? stores[(i + f * 2) % stores.length] : rng.pick(stores)));
      break;
    }
    case 'railyard':
    case 'grain':
    case 'mine':
    case 'warehouse': {
      const left = free();
      if (left[0]) set(left[0], 'breakroom');
      if (left[1]) set(smallest(left), 'restroom');
      for (const r of free()) set(r, 'office');
      break;
    }
    case 'gas':
    default:
      for (const r of free()) set(r, 'storage');
  }
  for (const r of real) if (!r.purpose) r.purpose = 'storage';
  void doors;
}
