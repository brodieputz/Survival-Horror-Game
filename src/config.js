// Global tuning constants.

export const TILE = 3; // world units per grid tile
export const WALL_H = 3.6;
export const PIT_DEPTH = 2.4;

// Tile types
export const T = {
  ROCK: 0,
  FLOOR: 1,
  YARD: 2, // open-air ground outside a building (no ceiling)
  DOOR: 3,
  PIT: 4, // spike pit
};

// Thin walls between rooms sit on tile edges
export const EDGE = {
  NONE: 0,
  WALL: 1,
  DOOR: 2, // an open doorway
  GATE: 3, // a locked gate (needs a key)
};
export const DOOR_W = 1.5; // doorway width (m)
export const DOOR_H = 2.3;

export const PLAYER = {
  radius: 0.35,
  eye: 1.68, // same eye line as survivors and zombies (1.8 m tall)
  crouchEye: 1.05,
  walk: 3.4,
  run: 6.4,
  crouch: 1.7,
  jumpV: 6.0,
  gravity: 18,
  baseHealth: 100,
  baseStamina: 100,
  runDrain: 20,
  jumpCost: 12,
  staminaRegen: 16,
};

// Noise radii (world units) for the player's actions
export const NOISE = {
  walk: 6,
  run: 14,
  crouch: 1.6,
  land: 9,
  glass: 22,
  glassCrouch: 9,
  crate: 7,
  hide: 4,
  bearTrap: 18,
  spikes: 14,
  pit: 12,
  melee: 5,
};

// ---------------------------------------------------------------- economy
export const DAY_HOURS = 12;
export const MAX_SURVIVORS = 8;
export const TRAVEL_HOURS = 4;
export const BATTERY_LIFE = 240; // seconds of flashlight per battery

export const BARRICADE = {
  baseHp: 300,
  perLevel: 150,
  maxLevel: 8,
  hpPerScrap: 4,
  improveCost: (lvl) => 50 + lvl * 45,
};

export const TURRETS = {
  mg: { name: 'Machine Gun Turret', short: 'Machine gun', cost: 220, range: 100, dmg: 15, rate: 7, spread: 0.035, rarity: 'Common' },
  missile: { name: 'Missile Turret', short: 'Missile', cost: 380, range: 115, dmg: 150, splash: 4.5, rate: 0.5, rarity: 'Uncommon' },
  artillery: { name: 'Artillery Turret', short: 'Artillery', cost: 560, range: 150, dmg: 280, splash: 7.5, rate: 0.22, minRange: 14, rarity: 'Rare' },
};
export const TURRET_ORDER = ['mg', 'missile', 'artillery'];

export const TRAPS = {
  bear: { name: 'Bear Trap', icon: '⊗', desc: 'Holds a zombie in place and chews on it.' },
  mine: { name: 'Land Mine', icon: '✸', desc: 'Explodes when stepped on.' },
  tripwire: { name: 'Tripwire Spikes', icon: '⋔', desc: 'Spikes impale everything along the wire.' },
  kerosene: { name: 'Kerosene Tank', icon: '♨', desc: 'Shoot it. Everything nearby burns.' },
};
export const TRAP_ORDER = ['bear', 'mine', 'tripwire', 'kerosene'];
