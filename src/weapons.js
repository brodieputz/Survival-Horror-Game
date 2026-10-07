// Weapon catalog, ammo types, rarity, upgrades and loot rolls. Pure data.

export const RARITY = {
  common: { name: 'Common', color: '#c9c1af', weight: 60, mul: 1 },
  uncommon: { name: 'Uncommon', color: '#6fd05a', weight: 27, mul: 1.3 },
  rare: { name: 'Rare', color: '#4aa8ff', weight: 10, mul: 1.7 },
  epic: { name: 'Epic', color: '#c46aff', weight: 3, mul: 2.2 },
  legendary: { name: 'Legendary', color: '#ffae2a', weight: 0.8, mul: 3 },
};
export const RARITY_ORDER = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

export const AMMO = {
  pistol: { name: 'Pistol rounds', short: 'Pistol', pickup: [12, 26] },
  magnum: { name: 'Magnum rounds', short: 'Magnum', pickup: [5, 12] },
  shells: { name: 'Shotgun shells', short: 'Shells', pickup: [6, 14] },
  rifle: { name: 'Rifle rounds', short: 'Rifle', pickup: [18, 40] },
  sniper: { name: 'Sniper rounds', short: 'Sniper', pickup: [4, 9] },
  arrows: { name: 'Arrows & bolts', short: 'Arrows', pickup: [5, 12] },
  rockets: { name: 'Rockets', short: 'Rockets', pickup: [1, 3] },
  grenades40: { name: '40mm grenades', short: '40mm', pickup: [2, 5] },
  grenade: { name: 'Hand grenades', short: 'Grenades', pickup: [1, 3] },
  molotov: { name: 'Molotov cocktails', short: 'Molotovs', pickup: [1, 3] },
  fuel: { name: 'Fuel', short: 'Fuel', pickup: [30, 70] },
};
export const AMMO_ORDER = Object.keys(AMMO);

export const CATEGORY = {
  melee: 'Melee',
  pistol: 'Pistol',
  smg: 'SMG',
  shotgun: 'Shotgun',
  rifle: 'Rifle',
  sniper: 'Sniper rifle',
  lmg: 'Machine gun',
  launcher: 'Launcher',
  bow: 'Bow',
  thrown: 'Thrown',
  flame: 'Flamethrower',
};

// dmg is per bullet / pellet / swing. rate = attacks per second.
// spread = cone half-angle in radians. range in world units (1 unit ≈ 1 m).
const W = [
  // ---------------------------------------------------------------- melee
  { id: 'knife', name: 'Kitchen Knife', cat: 'melee', rarity: 'common', dmg: 26, rate: 2.3, range: 1.7, arc: 0.8, stam: 5, look: { len: 0.24, blade: 0xb8bcc4, handle: 0x2a1a10 } },
  { id: 'bat', name: 'Baseball Bat', cat: 'melee', rarity: 'common', dmg: 38, rate: 1.4, range: 2.1, arc: 1.3, stam: 9, look: { len: 0.75, blade: 0x9a7448, handle: 0x9a7448, round: true } },
  { id: 'crowbar', name: 'Crowbar', cat: 'melee', rarity: 'common', dmg: 34, rate: 1.6, range: 2.0, arc: 1.1, stam: 8, look: { len: 0.7, blade: 0xa02418, handle: 0xa02418, hook: true } },
  { id: 'wrench', name: 'Pipe Wrench', cat: 'melee', rarity: 'common', dmg: 42, rate: 1.25, range: 1.9, arc: 1.1, stam: 10, look: { len: 0.5, blade: 0x6a6e74, handle: 0xa82a1a, head: true } },
  { id: 'shovel', name: 'Shovel', cat: 'melee', rarity: 'common', dmg: 36, rate: 1.3, range: 2.3, arc: 1.3, stam: 10, look: { len: 0.9, blade: 0x5a5e62, handle: 0x7a5432, spade: true } },
  { id: 'hatchet', name: 'Hatchet', cat: 'melee', rarity: 'common', dmg: 40, rate: 1.7, range: 1.8, arc: 0.9, stam: 7, look: { len: 0.42, blade: 0x8a9096, handle: 0x6a4428, axe: true } },
  { id: 'machete', name: 'Machete', cat: 'melee', rarity: 'uncommon', dmg: 50, rate: 1.75, range: 2.1, arc: 1.2, stam: 8, look: { len: 0.6, blade: 0xa8acb2, handle: 0x1a1a1a } },
  { id: 'axe', name: 'Fire Axe', cat: 'melee', rarity: 'uncommon', dmg: 72, rate: 1.0, range: 2.2, arc: 1.0, stam: 13, look: { len: 0.85, blade: 0xb02a1a, handle: 0xd8b060, axe: true } },
  { id: 'sledge', name: 'Sledgehammer', cat: 'melee', rarity: 'rare', dmg: 115, rate: 0.7, range: 2.3, arc: 1.5, stam: 18, cleave: 4, look: { len: 0.95, blade: 0x3a3a3c, handle: 0x7a5432, head: true, big: true } },
  { id: 'katana', name: 'Katana', cat: 'melee', rarity: 'epic', dmg: 88, rate: 1.9, range: 2.4, arc: 1.4, stam: 7, cleave: 3, look: { len: 0.95, blade: 0xdfe4ea, handle: 0x1a1020 } },
  { id: 'chainsaw', name: 'Chainsaw', cat: 'melee', rarity: 'rare', dmg: 16, rate: 12, range: 2.0, arc: 0.9, stam: 0, auto: true, cleave: 3, sound: 'chainsaw', look: { len: 0.6, blade: 0x9a9ea4, handle: 0xd86a10, saw: true } },

  // ---------------------------------------------------------------- pistols
  { id: 'glock', name: 'Glock 17', cat: 'pistol', rarity: 'common', ammo: 'pistol', mag: 17, dmg: 26, rate: 4.2, range: 45, spread: 0.018, reload: 1.4, noise: 34 },
  { id: 'beretta', name: 'Beretta M9', cat: 'pistol', rarity: 'common', ammo: 'pistol', mag: 15, dmg: 28, rate: 3.8, range: 45, spread: 0.017, reload: 1.5, noise: 34, look: { body: 0x2a2a2a, slide: 0x4a4a50 } },
  { id: 'revolver', name: 'Service Revolver', cat: 'pistol', rarity: 'common', ammo: 'magnum', mag: 6, dmg: 46, rate: 2.4, range: 50, spread: 0.014, reload: 2.0, noise: 38, sound: 'magnum', look: { revolver: true } },
  { id: 'm1911', name: 'M1911', cat: 'pistol', rarity: 'uncommon', ammo: 'pistol', mag: 8, dmg: 38, rate: 3.2, range: 48, spread: 0.015, reload: 1.5, noise: 36, look: { body: 0x5a5e66, slide: 0x6a6e76 } },
  { id: 'magnum', name: '.357 Magnum', cat: 'pistol', rarity: 'uncommon', ammo: 'magnum', mag: 6, dmg: 64, rate: 2.0, range: 55, spread: 0.012, reload: 2.1, noise: 42, pierce: 1, sound: 'magnum', look: { revolver: true, long: true, body: 0xb0b4ba } },
  { id: 'deagle', name: 'Desert Eagle', cat: 'pistol', rarity: 'rare', ammo: 'magnum', mag: 7, dmg: 88, rate: 1.8, range: 58, spread: 0.014, reload: 1.8, noise: 46, pierce: 1, sound: 'magnum', look: { body: 0x9a9ca0, slide: 0xb4b6ba, big: true } },
  { id: 'autopistol', name: 'Glock 18 Auto', cat: 'pistol', rarity: 'rare', ammo: 'pistol', mag: 33, dmg: 22, rate: 14, auto: true, range: 38, spread: 0.05, reload: 1.6, noise: 34, look: { extMag: true } },

  // ---------------------------------------------------------------- SMGs
  { id: 'mac10', name: 'MAC-10', cat: 'smg', rarity: 'uncommon', ammo: 'pistol', mag: 30, dmg: 18, rate: 15, auto: true, range: 32, spread: 0.07, reload: 1.7, noise: 34 },
  { id: 'uzi', name: 'Uzi', cat: 'smg', rarity: 'uncommon', ammo: 'pistol', mag: 32, dmg: 21, rate: 10, auto: true, range: 36, spread: 0.05, reload: 1.8, noise: 34 },
  { id: 'ump45', name: 'UMP45', cat: 'smg', rarity: 'uncommon', ammo: 'pistol', mag: 25, dmg: 27, rate: 9, auto: true, range: 40, spread: 0.035, reload: 2.0, noise: 34, look: { stock: true } },
  { id: 'mp5', name: 'MP5', cat: 'smg', rarity: 'rare', ammo: 'pistol', mag: 30, dmg: 25, rate: 11.5, auto: true, range: 42, spread: 0.026, reload: 1.9, noise: 32, look: { stock: true, curved: true } },
  { id: 'thompson', name: 'Thompson', cat: 'smg', rarity: 'rare', ammo: 'pistol', mag: 50, dmg: 28, rate: 10, auto: true, range: 40, spread: 0.045, reload: 2.6, noise: 36, look: { wood: true, drum: true, stock: true } },
  { id: 'vector', name: 'Kriss Vector', cat: 'smg', rarity: 'epic', ammo: 'pistol', mag: 33, dmg: 26, rate: 17, auto: true, range: 42, spread: 0.028, reload: 1.8, noise: 32, look: { stock: true, body: 0x1e1e20 } },

  // ---------------------------------------------------------------- shotguns
  { id: 'doublebarrel', name: 'Double Barrel', cat: 'shotgun', rarity: 'common', ammo: 'shells', mag: 2, dmg: 15, pellets: 8, rate: 2.6, range: 22, spread: 0.1, reload: 2.2, noise: 44, look: { wood: true, double: true } },
  { id: 'pump', name: 'Pump Shotgun', cat: 'shotgun', rarity: 'common', ammo: 'shells', mag: 6, dmg: 14, pellets: 8, rate: 1.15, range: 24, spread: 0.09, reload: 2.8, noise: 44, look: { pump: true } },
  { id: 'sawnoff', name: 'Sawn-Off', cat: 'shotgun', rarity: 'uncommon', ammo: 'shells', mag: 2, dmg: 17, pellets: 10, rate: 3.2, range: 14, spread: 0.17, reload: 1.8, noise: 46, look: { wood: true, double: true, short: true } },
  { id: 'spas12', name: 'SPAS-12', cat: 'shotgun', rarity: 'rare', ammo: 'shells', mag: 8, dmg: 15, pellets: 8, rate: 2.3, range: 26, spread: 0.085, reload: 3.0, noise: 44, look: { pump: true, stock: true, body: 0x1c1c1e } },
  { id: 'aa12', name: 'AA-12', cat: 'shotgun', rarity: 'epic', ammo: 'shells', mag: 20, dmg: 13, pellets: 8, rate: 5, auto: true, range: 24, spread: 0.1, reload: 3.2, noise: 44, look: { drum: true, stock: true } },

  // ---------------------------------------------------------------- rifles
  { id: 'lever', name: 'Lever-Action Rifle', cat: 'rifle', rarity: 'common', ammo: 'rifle', mag: 8, dmg: 56, rate: 1.4, range: 75, spread: 0.008, reload: 2.6, noise: 44, pierce: 1, look: { wood: true, lever: true } },
  { id: 'sks', name: 'SKS', cat: 'rifle', rarity: 'uncommon', ammo: 'rifle', mag: 10, dmg: 50, rate: 3, range: 75, spread: 0.012, reload: 2.4, noise: 44, look: { wood: true } },
  { id: 'garand', name: 'M1 Garand', cat: 'rifle', rarity: 'uncommon', ammo: 'rifle', mag: 8, dmg: 62, rate: 2.6, range: 80, spread: 0.01, reload: 2.2, noise: 46, pierce: 1, look: { wood: true } },
  { id: 'm4a1', name: 'M4A1', cat: 'rifle', rarity: 'rare', ammo: 'rifle', mag: 30, dmg: 34, rate: 11, auto: true, range: 70, spread: 0.022, reload: 2.1, noise: 42 },
  { id: 'ak47', name: 'AK-47', cat: 'rifle', rarity: 'rare', ammo: 'rifle', mag: 30, dmg: 41, rate: 9.5, auto: true, range: 70, spread: 0.03, reload: 2.3, noise: 44, look: { wood: true, curved: true } },
  { id: 'fal', name: 'FN FAL', cat: 'rifle', rarity: 'epic', ammo: 'rifle', mag: 20, dmg: 56, rate: 7, auto: true, range: 80, spread: 0.02, reload: 2.4, noise: 46, pierce: 1 },
  { id: 'scar', name: 'SCAR-H', cat: 'rifle', rarity: 'epic', ammo: 'rifle', mag: 20, dmg: 58, rate: 8, auto: true, range: 85, spread: 0.016, reload: 2.2, noise: 44, pierce: 1, look: { body: 0xb09a72, scope: true } },

  // ---------------------------------------------------------------- snipers
  { id: 'hunting', name: 'Hunting Rifle', cat: 'sniper', rarity: 'uncommon', ammo: 'sniper', mag: 5, dmg: 125, rate: 0.9, range: 120, spread: 0.003, reload: 2.8, noise: 50, pierce: 2, look: { wood: true, scope: true } },
  { id: 'dragunov', name: 'Dragunov', cat: 'sniper', rarity: 'epic', ammo: 'sniper', mag: 10, dmg: 115, rate: 2.2, range: 120, spread: 0.006, reload: 2.6, noise: 50, pierce: 2, look: { wood: true, scope: true, curved: true } },
  { id: 'barrett', name: 'Barrett M82', cat: 'sniper', rarity: 'legendary', ammo: 'sniper', mag: 10, dmg: 270, rate: 1.4, range: 150, spread: 0.004, reload: 3.2, noise: 60, pierce: 6, look: { scope: true, big: true } },

  // ---------------------------------------------------------------- machine guns
  { id: 'm249', name: 'M249 SAW', cat: 'lmg', rarity: 'epic', ammo: 'rifle', mag: 100, dmg: 34, rate: 13, auto: true, range: 75, spread: 0.045, reload: 4.6, noise: 46, look: { box: true, stock: true } },
  { id: 'm60', name: 'M60', cat: 'lmg', rarity: 'legendary', ammo: 'rifle', mag: 100, dmg: 48, rate: 10, auto: true, range: 80, spread: 0.04, reload: 4.8, noise: 48, pierce: 1, look: { box: true, stock: true } },
  { id: 'minigun', name: 'Minigun', cat: 'lmg', rarity: 'legendary', ammo: 'rifle', mag: 200, dmg: 30, rate: 30, auto: true, range: 70, spread: 0.07, reload: 6, noise: 52, spinUp: 0.55, look: { gatling: true } },

  // ---------------------------------------------------------------- launchers (player only)
  { id: 'm79', name: 'M79 Grenade Launcher', cat: 'launcher', rarity: 'rare', ammo: 'grenades40', mag: 1, dmg: 180, splash: 4.5, rate: 1.2, range: 60, spread: 0.01, reload: 1.9, noise: 30, proj: { kind: 'grenade', speed: 30, grav: 14, fuse: 0 }, look: { wood: true, tube: true } },
  { id: 'mgl', name: 'Milkor MGL', cat: 'launcher', rarity: 'legendary', ammo: 'grenades40', mag: 6, dmg: 180, splash: 4.5, rate: 1.7, range: 60, spread: 0.012, reload: 4.5, noise: 30, proj: { kind: 'grenade', speed: 30, grav: 14, fuse: 0 }, look: { drum: true, tube: true } },
  { id: 'rpg', name: 'RPG-7', cat: 'launcher', rarity: 'epic', ammo: 'rockets', mag: 1, dmg: 280, splash: 5.5, rate: 0.8, range: 120, spread: 0.008, reload: 3.0, noise: 55, proj: { kind: 'rocket', speed: 45, grav: 0 }, sound: 'rocket', look: { rpg: true } },

  // ---------------------------------------------------------------- bows
  { id: 'recurve', name: 'Recurve Bow', cat: 'bow', rarity: 'common', ammo: 'arrows', mag: 1, dmg: 72, rate: 1.1, range: 70, spread: 0.006, reload: 0.55, noise: 4, pierce: 1, proj: { kind: 'arrow', speed: 55, grav: 5 }, sound: 'bow' },
  { id: 'compound', name: 'Compound Bow', cat: 'bow', rarity: 'uncommon', ammo: 'arrows', mag: 1, dmg: 98, rate: 1.2, range: 80, spread: 0.004, reload: 0.5, noise: 4, pierce: 2, proj: { kind: 'arrow', speed: 70, grav: 4 }, sound: 'bow', look: { compound: true } },
  { id: 'crossbow', name: 'Crossbow', cat: 'bow', rarity: 'uncommon', ammo: 'arrows', mag: 1, dmg: 125, rate: 1.0, range: 85, spread: 0.003, reload: 1.6, noise: 6, pierce: 3, proj: { kind: 'arrow', speed: 80, grav: 3 }, sound: 'bow', look: { crossbow: true } },

  // ---------------------------------------------------------------- thrown & flame (player only)
  { id: 'grenades', name: 'Hand Grenades', cat: 'thrown', rarity: 'uncommon', ammo: 'grenade', mag: 1, dmg: 230, splash: 5.5, rate: 1.1, range: 30, reload: 0.4, noise: 0, proj: { kind: 'frag', speed: 17, grav: 14, fuse: 2.2 }, sound: 'throw', look: { frag: true } },
  { id: 'molotov', name: 'Molotov Cocktails', cat: 'thrown', rarity: 'uncommon', ammo: 'molotov', mag: 1, dmg: 60, splash: 4.5, rate: 1.1, range: 28, reload: 0.4, noise: 0, proj: { kind: 'molotov', speed: 16, grav: 14, fuse: 0 }, sound: 'throw', look: { molotov: true } },
  { id: 'flamethrower', name: 'Flamethrower', cat: 'flame', rarity: 'legendary', ammo: 'fuel', mag: 100, dmg: 9, rate: 20, auto: true, range: 10, spread: 0.18, reload: 3.5, noise: 20, sound: 'flame', look: { tank: true } },
];

export const WEAPONS = {};
for (const w of W) {
  w.mag = w.mag ?? 0;
  w.pellets = w.pellets ?? 1;
  w.pierce = w.pierce ?? 0;
  w.look = w.look || {};
  w.sound = w.sound || w.cat;
  WEAPONS[w.id] = w;
}
export const WEAPON_LIST = W;

export const isMelee = (def) => def.cat === 'melee';
// Weapons survivors handle slowly and carefully (long cooldowns, no firing near friends).
export const isExplosive = (def) => def.cat === 'launcher' || def.cat === 'thrown' || def.cat === 'flame';

// ---------------------------------------------------------------- upgrades
export const UPGRADES = {
  mag: { name: 'Magazine', desc: 'More rounds per reload' },
  range: { name: 'Range', desc: 'Reach further' },
  damage: { name: 'Damage', desc: 'Hit harder' },
  rate: { name: 'Fire rate', desc: 'Attack faster' },
  accuracy: { name: 'Accuracy', desc: 'Tighter spread' },
};
export const UPG_MAX = 5;

export function upgradeKeys(def) {
  if (def.cat === 'melee') return ['range', 'damage', 'rate'];
  if (def.cat === 'thrown') return ['range', 'damage'];
  return ['mag', 'range', 'damage', 'rate', 'accuracy'];
}

export function upgradeCost(def, lvl) {
  return Math.round((14 * (lvl + 1) * (1 + 0.5 * lvl) * RARITY[def.rarity].mul) / 5) * 5;
}

// Effective stats for a weapon instance in the hands of someone of `level`.
export function weaponStats(inst, level = 1) {
  const def = WEAPONS[inst.id];
  const u = inst.up || {};
  const lv = Math.max(0, level - 1);
  const magBase = def.mag;
  let mag = magBase;
  if (magBase > 0) mag = Math.max(magBase + (u.mag || 0), Math.round(magBase * (1 + 0.2 * (u.mag || 0))));
  return {
    def,
    mag,
    dmg: def.dmg * (1 + 0.12 * (u.damage || 0)) * (1 + 0.02 * lv),
    rate: def.rate * (1 + 0.08 * (u.rate || 0)),
    range: def.range * (1 + (def.cat === 'melee' ? 0.08 : 0.15) * (u.range || 0)),
    spread: (def.spread || 0) * Math.pow(0.86, u.accuracy || 0) * Math.max(0.6, 1 - 0.03 * lv),
    reload: (def.reload || 0) * Math.max(0.7, 1 - 0.02 * lv),
    pellets: def.pellets,
    pierce: def.pierce,
    splash: def.splash || 0,
  };
}

// Rough "power" score used by survivor expedition odds and loot balancing.
export function weaponPower(inst) {
  if (!inst) return 0.6;
  const s = weaponStats(inst);
  const dps = s.dmg * s.pellets * Math.min(s.rate, 12);
  return Math.min(4, 0.6 + dps / 90);
}

// ---------------------------------------------------------------- loot
export function rollRarity(rng, difficulty) {
  const shift = Math.max(0, difficulty - 1);
  let total = 0;
  const ws = RARITY_ORDER.map((r, i) => {
    const w = RARITY[r].weight * Math.pow(1 + 0.45 * shift, i);
    total += w;
    return w;
  });
  let x = rng.next() * total;
  for (let i = 0; i < ws.length; i++) {
    x -= ws[i];
    if (x <= 0) return RARITY_ORDER[i];
  }
  return 'common';
}

export function rollWeapon(rng, difficulty, cats = null) {
  const rarity = rollRarity(rng, difficulty);
  const idx = RARITY_ORDER.indexOf(rarity);
  for (let k = idx; k >= 0; k--) {
    const pool = W.filter((w) => w.rarity === RARITY_ORDER[k] && (!cats || cats.includes(w.cat)));
    if (pool.length) return rng.pick(pool).id;
  }
  return rng.pick(W.filter((w) => !cats || cats.includes(w.cat))).id;
}

export function ammoPickup(rng, type, mul = 1) {
  const [a, b] = AMMO[type].pickup;
  return Math.max(1, Math.round(rng.int(a, b) * mul));
}
