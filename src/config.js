// Global tuning constants.

export const TILE = 3; // world units per grid tile
export const WALL_H = 3.6;
export const PIT_DEPTH = 2.4;

// Tile types
export const T = {
  ROCK: 0,
  FLOOR: 1,
  SAFE: 2, // safe-room interior (monsters may not enter)
  DOOR: 3, // safe-room doorway (monsters may not enter)
  PIT: 4, // spike pit
};

export const PLAYER = {
  radius: 0.35,
  eye: 1.62,
  crouchEye: 1.0,
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
  startLives: 3,
};

export const GUN = {
  clip: 6,
  damage: 34,
  fireDelay: 0.42,
  reloadTime: 1.7,
  range: 45,
  noise: 38,
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
};

export const SHOP_ITEMS = [
  { id: 'life', name: 'Extra Life', desc: 'One more chance when the dark takes you.', base: 480, grow: 1.35, icon: '☠' },
  { id: 'medkit', name: 'Med Kit', desc: 'Restores 50 health. Use with [H].', base: 120, icon: '✚' },
  { id: 'health', name: 'Vitality', desc: '+20 maximum health.', base: 260, upgrade: true, max: 6, icon: '♥' },
  { id: 'speed', name: 'Swiftness', desc: '+7% movement speed.', base: 300, upgrade: true, max: 6, icon: '»' },
  { id: 'stamina', name: 'Endurance', desc: '+25 max stamina and faster recovery.', base: 230, upgrade: true, max: 6, icon: '≈' },
  { id: 'greed', name: "Midas' Touch", desc: '+25% gold from every pickup.', base: 290, upgrade: true, max: 6, icon: '$' },
  { id: 'map', name: "Cartographer's Map", desc: 'Reveals this level and every diamond on it.', base: 170, perLevel: true, icon: '▦' },
  { id: 'key', name: 'Skeleton Key', desc: 'Opens one locked crate. Single use.', base: 140, icon: '⚷' },
  { id: 'beartrap', name: 'Bear Trap', desc: 'Place with [T]. Snares and wounds a monster.', base: 115, icon: '⊗' },
  { id: 'ammo', name: 'Revolver Rounds', desc: 'Six bullets. Gunfire is loud.', base: 95, icon: '⁍' },
];

export function itemPrice(item, level, state) {
  let p = item.base * (1 + 0.18 * (level - 1));
  if (item.upgrade) p *= Math.pow(1.6, state.upgrades[item.id] || 0);
  if (item.id === 'life') p *= Math.pow(item.grow, state.livesBought || 0);
  return Math.round(p / 5) * 5;
}
