// Things that happen on the line between cities. The train stops partway
// through the journey and the player picks what to do; the outcome is
// applied to the run straight away and listed again on arrival.
import { RNG } from './util.js';
import { MAX_SURVIVORS } from './config.js';
import { season, makeSurvivor, makeDog, playerMaxHp, survivorMaxHp, grantXp, ownedAmmoTypes } from './run.js';

const aboard = (run) => run.survivors.filter((s) => s.status === 'camp' && s.hp > 0);
const roomAboard = (run) => run.survivors.filter((s) => s.status !== 'dead').length < MAX_SURVIVORS;

// Everyone aboard loses a share of their health (never killed outright).
function hurtAll(run, frac, lines, why) {
  run.player.hp = Math.max(1, Math.round(run.player.hp - playerMaxHp(run.player.level) * frac));
  for (const s of aboard(run)) s.hp = Math.max(1, Math.round(s.hp - survivorMaxHp(s) * frac));
  lines.push({ kind: 'bad', text: why });
}

// One person (the player or a survivor) takes a hit.
function hurtOne(run, rng, amount, lines, verb) {
  const list = aboard(run);
  if (list.length && rng.chance(0.65)) {
    const s = rng.pick(list);
    s.hp = Math.max(1, s.hp - amount);
    lines.push({ kind: 'bad', text: `${s.name} was ${verb} (−${amount} HP).` });
  } else {
    run.player.hp = Math.max(1, run.player.hp - amount);
    lines.push({ kind: 'bad', text: `You were ${verb} (−${amount} HP).` });
  }
}

function spendHours(run, h, lines) {
  run.hours = Math.max(0, run.hours - h);
  lines.push({ kind: 'muted', text: `${h} ${h === 1 ? 'hour' : 'hours'} lost.` });
}

function spendAmmo(run, rng, n) {
  const owned = ownedAmmoTypes(run).filter((k) => (run.ammo[k] || 0) > 0);
  if (!owned.length) return 0;
  const k = owned.sort((a, b) => run.ammo[b] - run.ammo[a])[0];
  const used = Math.min(run.ammo[k], n);
  run.ammo[k] -= used;
  return used;
}

function xpAll(run, n) {
  grantXp(run.player, n);
  for (const s of aboard(run)) grantXp(s, n);
}

// Each event: when it can happen, its text, and its choices. A choice's
// `need` says what it costs up front (and greys it out when unaffordable).
export const RAIL_EVENTS = {
  blocked: {
    title: 'WRECKAGE ON THE LINE',
    text: 'A jack-knifed tanker truck lies across the rails. The brakes scream and the train shudders to a stop a few yards short.',
    weight: () => 1.2,
    options: [
      {
        label: 'Clear it by hand',
        note: '2 hours. The dead may come.',
        go(run, rng, lines) {
          spendHours(run, 2, lines);
          const scrap = rng.int(2, 5);
          run.scrap += scrap;
          lines.push({ kind: 'gold', text: `You strip the wreck as you clear it: ${scrap} scrap.` });
          if (rng.chance(0.35)) hurtOne(run, rng, rng.int(12, 24), lines, 'bitten by something under the truck');
        },
      },
      {
        label: 'Ram it at full steam',
        note: '1 coal. Risky.',
        need: { coal: 1 },
        go(run, rng, lines) {
          run.coal -= 1;
          lines.push({ kind: 'muted', text: 'The locomotive hits the wreck at full steam and shoves it off the line.' });
          if (rng.chance(0.4)) {
            const s = Math.min(run.scrap, rng.int(3, 6));
            run.scrap -= s;
            lines.push({ kind: 'bad', text: `The cowcatcher buckled. Repairs cost ${s} scrap.` });
          }
        },
      },
    ],
  },
  ambush: {
    title: 'THE DEAD ON THE TRACKS',
    text: 'At an old water stop a crowd of the dead is shambling along the rails. More are coming out of the tall grass.',
    weight: (run) => 1 + Math.min(1, run.day / 15),
    options: [
      {
        label: 'Fight them off',
        note: 'Costs ammo and blood. Everyone learns something.',
        go(run, rng, lines) {
          const n = 15 + rng.int(0, 10) + aboard(run).length * 4;
          const used = spendAmmo(run, rng, n);
          lines.push({ kind: 'good', text: `You fight from the cars until the tracks are clear${used ? ` (${used} rounds spent)` : ''}.` });
          hurtAll(run, used ? 0.08 : 0.18, lines, used ? 'Everyone took a few scratches.' : 'With no ammo it came down to clubs and knives. Everyone is hurt.');
          xpAll(run, 6);
          run.stats.kills += 6 + rng.int(0, 6);
        },
      },
      {
        label: 'Full steam through them',
        note: '1 coal. Someone might be dragged off the step.',
        need: { coal: 1 },
        go(run, rng, lines) {
          run.coal -= 1;
          lines.push({ kind: 'muted', text: 'The train ploughs through the crowd in a spray of black blood.' });
          if (rng.chance(0.3)) hurtOne(run, rng, rng.int(10, 20), lines, 'clawed by a hand reaching up from the tracks');
        },
      },
    ],
  },
  stranded: {
    title: 'SOMEONE WAVING',
    text: 'A figure on the embankment is waving a red shirt over their head and shouting for you to stop.',
    weight: (run) => (roomAboard(run) ? 1 : 0.2),
    options: [
      {
        label: 'Stop and take them aboard',
        note: 'Could be a trap.',
        go(run, rng, lines) {
          if (rng.chance(0.2)) {
            lines.push({ kind: 'bad', text: 'It was bait. Raiders open up from the trees before you pull away.' });
            hurtOne(run, rng, rng.int(15, 30), lines, 'shot');
            const s = Math.min(run.food, rng.int(2, 5));
            run.food -= s;
            if (s) lines.push({ kind: 'bad', text: `They got away with ${s} food.` });
            return;
          }
          if (!roomAboard(run)) {
            lines.push({ kind: 'muted', text: `There's no room on the train. You give them food and water and wish them luck (−2 food).` });
            run.food = Math.max(0, run.food - 2);
            return;
          }
          const rec = makeSurvivor(run, rng, Math.max(1, Math.min(8, Math.round(run.day / 4) + rng.int(0, 2))));
          rec.status = 'camp';
          run.survivors.push(rec);
          run.stats.recruited++;
          lines.push({ kind: 'good', text: `${rec.name} (level ${rec.level}) climbs aboard, close to tears.` });
        },
      },
      { label: 'Keep going', note: 'Not worth the risk.', go: (run, rng, lines) => lines.push({ kind: 'muted', text: 'You watch them get smaller behind the train.' }) },
    ],
  },
  axle: {
    title: 'A HOT BOX',
    text: 'Smoke is pouring from a wheel bearing on the tender. Run it much further and the axle will seize.',
    weight: () => 0.8,
    options: [
      {
        label: 'Repair it properly',
        note: '5 scrap.',
        need: { scrap: 5 },
        go(run, rng, lines) {
          run.scrap -= 5;
          lines.push({ kind: 'muted', text: 'You repack the bearing with parts from the scrap pile.' });
        },
      },
      {
        label: 'Limp on at walking pace',
        note: '3 hours.',
        go(run, rng, lines) {
          spendHours(run, 3, lines);
        },
      },
    ],
  },
  supply: {
    title: 'AN ABANDONED FREIGHT TRAIN',
    text: 'A freight train sits on a siding, doors hanging open. Nobody has been near it in months.',
    weight: () => 1,
    options: [
      {
        label: 'Search the boxcars',
        note: '1 hour. Something may be inside.',
        go(run, rng, lines) {
          spendHours(run, 1, lines);
          const coal = rng.int(1, 4);
          const food = rng.int(2, 7);
          const scrap = rng.int(2, 6);
          run.coal += coal;
          run.food += food;
          run.scrap += scrap;
          lines.push({ kind: 'gold', text: `Found ${coal} coal, ${food} food and ${scrap} scrap.` });
          const owned = ownedAmmoTypes(run);
          if (owned.length && rng.chance(0.6)) {
            const k = rng.pick(owned);
            const n = rng.int(12, 30);
            run.ammo[k] = (run.ammo[k] || 0) + n;
            lines.push({ kind: 'gold', text: `And a crate of ammunition (${n} rounds).` });
          }
          if (rng.chance(0.3)) hurtOne(run, rng, rng.int(12, 22), lines, 'grabbed by a corpse in a dark boxcar');
        },
      },
      { label: 'Leave it', note: '', go: (run, rng, lines) => lines.push({ kind: 'muted', text: 'You leave the freight train to the crows.' }) },
    ],
  },
  bridge: {
    title: 'THE BRIDGE IS OUT',
    text: 'Half the trestle ahead has fallen into the river. A rusty branch line curves away to the north.',
    weight: (run, opt) => ((opt.miles || 0) > 150 ? 0.9 : 0),
    options: [
      {
        label: 'Take the branch line',
        note: '2 coal, 1 hour.',
        need: { coal: 2 },
        go(run, rng, lines) {
          run.coal -= 2;
          spendHours(run, 1, lines);
          lines.push({ kind: 'muted', text: 'The detour adds thirty miles of weeds and rust.' });
        },
      },
      {
        label: 'Creep across what is left',
        note: 'Free, if it holds.',
        go(run, rng, lines) {
          if (rng.chance(0.55)) {
            lines.push({ kind: 'good', text: 'The trestle groans, sags... and holds.' });
            return;
          }
          const s = Math.min(run.scrap, rng.int(4, 8));
          run.scrap -= s;
          hurtAll(run, 0.08, lines, 'A span gives way under the last car. Everyone is thrown about.');
          lines.push({ kind: 'bad', text: `Shoring the car back up cost ${s} scrap.` });
          spendHours(run, 1, lines);
        },
      },
    ],
  },
  dog: {
    title: 'A DOG ON THE LINE',
    text: 'A dog is running alongside the train, ribs showing, barking at the cars.',
    weight: (run) => (roomAboard(run) ? 0.6 : 0),
    options: [
      {
        label: 'Stop and call it over',
        note: '1 food.',
        need: { food: 1 },
        go(run, rng, lines) {
          run.food -= 1;
          const rec = makeDog(run, rng, Math.max(1, Math.min(6, Math.round(run.day / 5) + 1)));
          rec.status = 'camp';
          run.survivors.push(rec);
          run.stats.recruited++;
          lines.push({ kind: 'good', text: `${rec.name}, a ${rec.look.breed.toLowerCase()}, wolfs down the food and jumps aboard.` });
        },
      },
      { label: 'Keep going', note: '', go: (run, rng, lines) => lines.push({ kind: 'muted', text: 'The dog falls behind and is gone.' }) },
    ],
  },
  frozen: {
    title: 'FROZEN POINTS',
    text: 'Snow has drifted over the junction and the switch is frozen solid.',
    weight: (run) => (season(run) === 'winter' ? 1.6 : 0),
    options: [
      {
        label: 'Burn coal to thaw it',
        note: '1 coal.',
        need: { coal: 1 },
        go(run, rng, lines) {
          run.coal -= 1;
          lines.push({ kind: 'muted', text: 'A shovel of burning coal on the points and the lever comes free.' });
        },
      },
      {
        label: 'Chip the ice by hand',
        note: '2 hours in the cold.',
        go(run, rng, lines) {
          spendHours(run, 2, lines);
          hurtAll(run, 0.06, lines, 'Everyone is chilled to the bone.');
        },
      },
    ],
  },
  traders: {
    title: 'A CAMP BY THE LINE',
    text: 'Smoke rises from a fortified camp beside the tracks. Someone with a rifle waves you in to trade.',
    weight: () => 0.7,
    options: [
      {
        label: 'Trade 6 scrap for 6 food',
        note: '',
        need: { scrap: 6 },
        go(run, rng, lines) {
          run.scrap -= 6;
          run.food += 6;
          lines.push({ kind: 'good', text: 'You trade scrap for sacks of potatoes and tinned meat.' });
        },
      },
      {
        label: 'Trade 5 food for 3 coal',
        note: '',
        need: { food: 5 },
        go(run, rng, lines) {
          run.food -= 5;
          run.coal += 3;
          lines.push({ kind: 'good', text: 'They have a coal pile and empty bellies. A fair trade.' });
        },
      },
      { label: 'Move on', note: '', go: (run, rng, lines) => lines.push({ kind: 'muted', text: 'You wave and keep rolling.' }) },
    ],
  },
};

// Roll whether something happens on this journey, and what.
export function rollRailEvent(run, opt) {
  const rng = new RNG((run.seed ^ (run.day * 2654435761) ^ (opt.miles || 0) * 97) >>> 0);
  const p = Math.min(0.8, 0.5 + (opt.miles || 0) / 2000);
  if (!rng.chance(p)) return null;
  const w = {};
  for (const [k, ev] of Object.entries(RAIL_EVENTS)) w[k] = ev.weight(run, opt);
  let total = 0;
  for (const k in w) total += w[k];
  let r = rng.next() * total;
  let key = 'blocked';
  for (const k in w) {
    r -= w[k];
    if (r <= 0) {
      key = k;
      break;
    }
  }
  return { key, seed: rng.int(1, 1e9), result: null };
}

export const canAfford = (run, need) => !need || Object.entries(need).every(([k, n]) => (run[k] ?? 0) >= n);

// Apply a choice. Returns the lines describing what happened.
export function resolveRailEvent(run, ev, i) {
  const def = RAIL_EVENTS[ev.key];
  let o = def.options[i];
  if (!o || !canAfford(run, o.need)) o = def.options.find((q) => !q.need || canAfford(run, q.need)) || def.options[def.options.length - 1];
  const lines = [];
  o.go(run, new RNG(ev.seed), lines);
  ev.result = lines;
  ev.choice = def.options.indexOf(o);
  return lines;
}

// The choice made if the player just closes the panel: the one that costs
// nothing up front, listed last.
export function defaultChoice(ev) {
  const def = RAIL_EVENTS[ev.key];
  for (let i = def.options.length - 1; i >= 0; i--) if (!def.options[i].need) return i;
  return 0;
}
