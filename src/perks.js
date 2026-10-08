// The perk tree. Every level the player gains is a perk point to spend on
// one perk; a perk needs the perks above it in its branch. Each perk adds
// modifiers: keys ending in "Mul" multiply together, the rest add up.

export const BRANCHES = [
  { id: 'marksman', name: 'Marksman', icon: '⌖', blurb: 'Guns: damage, accuracy, reloads and magazines.' },
  { id: 'brawler', name: 'Brawler', icon: '✊', blurb: 'Melee: harder, wider, faster swings.' },
  { id: 'survivor', name: 'Survivor', icon: '♥', blurb: 'Health, toughness and staying alive.' },
  { id: 'athlete', name: 'Athlete', icon: '➶', blurb: 'Speed, stamina and moving quietly.' },
  { id: 'scavenger', name: 'Scavenger', icon: '⚙', blurb: 'More from every search.' },
  { id: 'leader', name: 'Leader', icon: '⚑', blurb: 'Your survivors and dogs.' },
  { id: 'engineer', name: 'Engineer', icon: '⚒', blurb: 'The barricade, traps, turrets and the train.' },
  { id: 'demolitions', name: 'Demolitions', icon: '✸', blurb: 'Explosives and fire.' },
];

// tier: the row in its branch. req: perks needed first.
const P = (id, branch, tier, name, desc, mods, req = []) => ({ id, branch, tier, name, desc, mods, req });

export const PERKS = [
  // ---------------------------------------------------------------- marksman
  P('steady', 'marksman', 1, 'Steady Hands', '15% tighter spread with every gun.', { spreadMul: 0.85 }),
  P('gunnut1', 'marksman', 1, 'Gun Nut', '+10% damage with guns and bows.', { rangedDmgMul: 1.1 }),
  P('quickhands', 'marksman', 2, 'Quick Hands', 'Reload 20% faster.', { reloadMul: 0.8 }, ['steady']),
  P('headhunter', 'marksman', 2, 'Headhunter', 'Headshots deal +40% more.', { headBonus: 0.4 }, ['steady']),
  P('gunnut2', 'marksman', 2, 'Gun Nut II', 'Another +10% damage with guns and bows.', { rangedDmgMul: 1.1 }, ['gunnut1']),
  P('extmags', 'marksman', 3, 'Extended Mags', 'Magazines hold 25% more.', { magMul: 1.25 }, ['quickhands']),
  P('trigger', 'marksman', 3, 'Trigger Discipline', 'Fire 12% faster.', { rateMul: 1.12 }, ['gunnut2']),
  P('longshot', 'marksman', 3, 'Long Shot', '+25% effective range.', { rangeMul: 1.25 }, ['headhunter']),
  P('speedloader', 'marksman', 4, 'Speed Loader', 'Reload another 20% faster.', { reloadMul: 0.8 }, ['extmags']),
  P('penetrator', 'marksman', 4, 'Penetrator', 'Bullets punch through one more body.', { pierce: 1 }, ['longshot']),
  P('hoarder', 'marksman', 4, 'Ammo Hoarder', '15% chance a shot costs no ammo.', { ammoSave: 0.15 }, ['trigger']),
  P('gunnut3', 'marksman', 5, 'Gun Nut III', '+15% damage with guns and bows.', { rangedDmgMul: 1.15 }, ['trigger', 'penetrator']),
  P('deadeye', 'marksman', 5, 'Deadeye', 'Headshots deal +60% more, and spread tightens another 20%.', { headBonus: 0.6, spreadMul: 0.8 }, ['penetrator', 'speedloader']),

  // ---------------------------------------------------------------- brawler
  P('heavy1', 'brawler', 1, 'Heavy Hitter', '+20% melee damage.', { meleeDmgMul: 1.2 }),
  P('secondwind', 'brawler', 1, 'Conditioning', 'Melee swings cost 35% less stamina.', { stamCostMul: 0.65 }),
  P('reach', 'brawler', 2, 'Long Reach', '+20% melee reach.', { meleeReachMul: 1.2 }, ['heavy1']),
  P('bloodlust', 'brawler', 2, 'Bloodlust', 'Melee kills restore 4 health.', { lifesteal: 4 }, ['secondwind']),
  P('heavy2', 'brawler', 2, 'Bone Breaker', 'Another +20% melee damage.', { meleeDmgMul: 1.2 }, ['heavy1']),
  P('cleaver', 'brawler', 3, 'Cleaver', 'Swings hit one more zombie.', { cleave: 1 }, ['reach']),
  P('frenzy', 'brawler', 3, 'Frenzy', 'Swing 15% faster.', { meleeRateMul: 1.15 }, ['bloodlust']),
  P('vampire', 'brawler', 4, 'Vampire', 'Melee kills restore 8 more health.', { lifesteal: 8 }, ['frenzy']),
  P('whirlwind', 'brawler', 4, 'Whirlwind', 'Swings hit two more zombies.', { cleave: 2 }, ['cleaver', 'heavy2']),
  P('executioner', 'brawler', 5, 'Executioner', '+30% melee damage.', { meleeDmgMul: 1.3 }, ['whirlwind']),

  // ---------------------------------------------------------------- survivor
  P('tough1', 'survivor', 1, 'Tough', '+20 maximum health.', { hp: 20 }),
  P('medic', 'survivor', 1, 'Field Medic', 'Med kits heal 50% more.', { medkitMul: 1.5 }),
  P('thickskin', 'survivor', 2, 'Thick Skin', 'Take 10% less damage.', { dmgTakenMul: 0.9 }, ['tough1']),
  P('tough2', 'survivor', 2, 'Tougher', '+20 maximum health.', { hp: 20 }, ['tough1']),
  P('ironstomach', 'survivor', 2, 'Iron Stomach', 'Going hungry costs half as much health.', { hungerMul: 0.5 }, ['medic']),
  P('regen', 'survivor', 3, 'Regeneration', 'Slowly heal (0.5/s) when nothing is hunting you.', { regen: 0.5 }, ['medic', 'tough1']),
  P('coldblood', 'survivor', 3, 'Cold Blooded', 'Bitter nights don\'t hurt you.', { coldProof: 1 }, ['ironstomach']),
  P('ironskin', 'survivor', 3, 'Iron Skin', 'Take another 10% less damage.', { dmgTakenMul: 0.9 }, ['thickskin']),
  P('fasthealer', 'survivor', 4, 'Fast Healer', 'Heal another 1/s when nothing is hunting you.', { regen: 1 }, ['regen']),
  P('tough3', 'survivor', 4, 'Toughest', '+30 maximum health.', { hp: 30 }, ['tough2', 'ironskin']),
  P('laststand', 'survivor', 5, 'Last Stand', 'Once a day, a killing blow leaves you on 1 health instead.', { lastStand: 1 }, ['tough3', 'fasthealer']),

  // ---------------------------------------------------------------- athlete
  P('marathon', 'athlete', 1, 'Marathon', '+25 stamina.', { stam: 25 }),
  P('sprinter', 'athlete', 1, 'Sprinter', 'Move 8% faster.', { speedMul: 1.08 }),
  P('breath', 'athlete', 2, 'Second Breath', 'Stamina comes back 35% faster.', { stamRegenMul: 1.35 }, ['marathon']),
  P('lightstep', 'athlete', 2, 'Light Step', 'Your footsteps carry 30% less far.', { noiseMul: 0.7 }, ['sprinter']),
  P('acrobat', 'athlete', 2, 'Acrobat', 'Jumping costs half the stamina.', { jumpCostMul: 0.5 }, ['marathon']),
  P('escape', 'athlete', 3, 'Escape Artist', 'Traps and grabs hold you half as long.', { trapTimeMul: 0.5 }, ['acrobat']),
  P('fleet', 'athlete', 3, 'Fleet-Footed', 'Move another 8% faster.', { speedMul: 1.08 }, ['sprinter', 'breath']),
  P('ghost', 'athlete', 4, 'Ghost', 'Your footsteps carry another 35% less far.', { noiseMul: 0.65 }, ['lightstep']),
  P('endurance', 'athlete', 4, 'Endurance', '+40 stamina.', { stam: 40 }, ['fleet']),
  P('freerunner', 'athlete', 5, 'Free Runner', 'Move 10% faster and stamina comes back 35% faster.', { speedMul: 1.1, stamRegenMul: 1.35 }, ['endurance', 'escape']),

  // ---------------------------------------------------------------- scavenger
  P('scrapper', 'scavenger', 1, 'Scrapper', '+25% scrap from searches.', { scrapMul: 1.25 }),
  P('forager', 'scavenger', 1, 'Forager', '+1 food whenever you find food.', { foodBonus: 1 }),
  P('ammofinder', 'scavenger', 2, 'Ammo Finder', '+30% ammunition from searches.', { ammoMul: 1.3 }, ['scrapper']),
  P('packrat', 'scavenger', 2, 'Pack Rat', 'Batteries last 35% longer.', { batteryMul: 1.35 }, ['forager']),
  P('medbag', 'scavenger', 2, 'Medicine Bag', '20% chance to find a bonus med kit in any container.', { medkitFind: 0.2 }, ['forager']),
  P('quicksearch', 'scavenger', 3, 'Quick Search', 'Searching a place takes an hour less.', { searchCut: 1 }, ['ammofinder', 'packrat']),
  P('salvager', 'scavenger', 3, 'Salvager', 'Another +25% scrap.', { scrapMul: 1.25 }, ['ammofinder']),
  P('lockpick', 'scavenger', 4, 'Lockpicking', 'Pick a vault\'s lock without its key.', { lockpick: 1 }, ['quicksearch']),
  P('treasure', 'scavenger', 4, 'Treasure Hunter', 'Another +30% ammo and +1 more food per find.', { ammoMul: 1.3, foodBonus: 1 }, ['salvager', 'medbag']),
  P('quicksearch2', 'scavenger', 5, 'In and Out', 'Searching takes another hour less (never under one).', { searchCut: 1 }, ['lockpick']),

  // ---------------------------------------------------------------- leader
  P('inspiring', 'leader', 1, 'Inspiring', 'Survivors and dogs deal +15% damage.', { squadDmgMul: 1.15 }),
  P('drill', 'leader', 1, 'Drill Sergeant', 'Survivors and dogs earn 30% more XP.', { squadXpMul: 1.3 }),
  P('dogwhisperer', 'leader', 2, 'Dog Whisperer', 'Dogs bite 35% harder.', { dogBiteMul: 1.35 }, ['inspiring']),
  P('scoutleader', 'leader', 2, 'Scout Leader', 'Survivors sent out alone are 10% likelier to come back.', { expedition: 0.1 }, ['drill']),
  P('recruiter', 'leader', 2, 'Recruiter', 'People you recruit join a level higher.', { recruitLv: 1 }, ['drill']),
  P('bedside', 'leader', 3, 'Bedside Manner', 'At dawn, everyone in camp heals 10%.', { squadHeal: 0.1 }, ['scoutleader']),
  P('rally', 'leader', 3, 'Rally', 'Survivors and dogs deal another +15% damage.', { squadDmgMul: 1.15 }, ['dogwhisperer']),
  P('mentor', 'leader', 4, 'Mentor', 'Survivors and dogs earn another 30% more XP.', { squadXpMul: 1.3 }, ['recruiter', 'bedside']),
  P('scoutleader2', 'leader', 4, 'Trailblazer', 'Lone survivors are another 10% likelier to come back.', { expedition: 0.1 }, ['bedside']),
  P('warband', 'leader', 5, 'Warband', 'Survivors and dogs deal +25% damage.', { squadDmgMul: 1.25 }, ['rally', 'mentor']),

  // ---------------------------------------------------------------- engineer
  P('carpentry', 'engineer', 1, 'Carpentry', 'Barricade repairs cost 25% less scrap.', { repairMul: 0.75 }),
  P('gunsmith', 'engineer', 1, 'Gunsmith', 'Weapon upgrades cost 20% less.', { upgradeMul: 0.8 }),
  P('fortify', 'engineer', 2, 'Fortify', '+100 maximum barricade strength.', { barricade: 100 }, ['carpentry']),
  P('trapper', 'engineer', 2, 'Trapper', 'Traps deal 50% more damage.', { trapDmgMul: 1.5 }, ['carpentry']),
  P('turrettech', 'engineer', 2, 'Turret Tech', 'Turrets deal 25% more damage.', { turretDmgMul: 1.25 }, ['gunsmith']),
  P('masterbuilder', 'engineer', 3, 'Master Builder', 'Reinforcing the barricade costs 25% less.', { reinforceMul: 0.75 }, ['fortify']),
  P('stoker', 'engineer', 3, 'Stoker', 'Every trip burns one less coal (never under one).', { coalCut: 1 }, ['turrettech']),
  P('gunsmith2', 'engineer', 3, 'Master Gunsmith', 'Weapon upgrades cost another 25% less.', { upgradeMul: 0.75 }, ['gunsmith']),
  P('fortify2', 'engineer', 4, 'Bulwark', '+150 maximum barricade strength.', { barricade: 150 }, ['masterbuilder']),
  P('turretrate', 'engineer', 4, 'Overclock', 'Turrets fire 25% faster.', { turretRateMul: 1.25 }, ['stoker', 'gunsmith2']),
  P('trapper2', 'engineer', 4, 'Deadfall', 'Traps deal another 50% more damage.', { trapDmgMul: 1.5 }, ['trapper']),
  P('siege', 'engineer', 5, 'Siege Engineer', 'Turrets +25% damage, barricade +100.', { turretDmgMul: 1.25, barricade: 100 }, ['fortify2', 'turretrate']),

  // ---------------------------------------------------------------- demolitions
  P('blaster', 'demolitions', 1, 'Blaster', '+20% explosive damage.', { blastDmgMul: 1.2 }),
  P('flak', 'demolitions', 1, 'Flak Jacket', 'Your own blasts hurt you 60% less.', { selfBlastMul: 0.4 }),
  P('wideblast', 'demolitions', 2, 'Wide Blast', 'Blasts are 25% wider.', { blastRadiusMul: 1.25 }, ['blaster']),
  P('firebug', 'demolitions', 2, 'Firebug', 'Fire burns 50% longer and hotter.', { fireMul: 1.5 }, ['flak']),
  P('blaster2', 'demolitions', 3, 'Shaped Charges', 'Another +25% explosive damage.', { blastDmgMul: 1.25 }, ['wideblast']),
  P('pyro', 'demolitions', 3, 'Pyromaniac', 'Fire burns another 50% hotter.', { fireMul: 1.5 }, ['firebug']),
  P('bombsuit', 'demolitions', 4, 'Bomb Suit', 'Your own blasts can\'t hurt you.', { selfBlastMul: 0 }, ['pyro', 'flak']),
  P('wideblast2', 'demolitions', 4, 'Shockwave', 'Blasts are another 25% wider.', { blastRadiusMul: 1.25 }, ['blaster2']),
  P('armageddon', 'demolitions', 5, 'Armageddon', '+35% explosive damage.', { blastDmgMul: 1.35 }, ['wideblast2', 'bombsuit']),

  // ---------------------------------------------------------------- general (any branch can reach)
  P('quicklearner', 'survivor', 1, 'Quick Learner', 'Earn 15% more XP.', { xpMul: 1.15 }),
];
export const PERK = Object.fromEntries(PERKS.map((p) => [p.id, p]));

const NEUTRAL = {};
let cacheKey = '';
let cache = NEUTRAL;

// The combined modifiers of every perk the player has.
export function perkMods(run) {
  const owned = run?.player?.perks || [];
  const key = owned.join(',');
  if (key === cacheKey && cache !== NEUTRAL) return cache;
  const m = {};
  for (const id of owned) {
    const p = PERK[id];
    if (!p) continue;
    for (const [k, v] of Object.entries(p.mods)) {
      if (k.endsWith('Mul')) m[k] = (m[k] ?? 1) * v;
      else m[k] = (m[k] ?? 0) + v;
    }
  }
  cacheKey = key;
  cache = m;
  return m;
}

// A multiplier (1 when no perk touches it) or an additive bonus (0).
export const mul = (run, k) => perkMods(run)[k] ?? 1;
export const add = (run, k) => perkMods(run)[k] ?? 0;

export const hasPerk = (run, id) => (run?.player?.perks || []).includes(id);
export const canTake = (run, p) => !hasPerk(run, p.id) && p.req.every((r) => hasPerk(run, r)) && (run.player.perkPoints || 0) > 0;

export function takePerk(run, id) {
  const p = PERK[id];
  if (!p || !canTake(run, p)) return false;
  run.player.perks = [...(run.player.perks || []), id];
  run.player.perkPoints--;
  return true;
}

// A weapon's stats in the player's hands, with their perks applied.
export function perkStats(st, run) {
  const m = perkMods(run);
  if (!m || !Object.keys(m).length) return st;
  const o = { ...st };
  const cat = st.def.cat;
  const g = (k) => m[k] ?? 1;
  if (cat === 'melee') {
    o.dmg *= g('meleeDmgMul');
    o.range *= g('meleeReachMul');
    o.rate *= g('meleeRateMul');
    return o;
  }
  if (cat === 'flame') o.dmg *= g('fireMul');
  else if (st.splash > 0 || cat === 'launcher' || cat === 'thrown') {
    o.dmg *= g('blastDmgMul');
    o.splash = (st.splash || 0) * g('blastRadiusMul');
  } else {
    o.dmg *= g('rangedDmgMul');
    o.pierce = (st.pierce || 0) + (m.pierce || 0);
  }
  o.spread *= g('spreadMul');
  o.reload *= g('reloadMul');
  o.rate *= g('rateMul');
  o.range *= g('rangeMul');
  if (st.mag > 1) o.mag = Math.round(st.mag * g('magMul'));
  return o;
}
