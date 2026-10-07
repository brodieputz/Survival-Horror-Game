# Dread Depths

A first-person survival horror game built with [three.js](https://threejs.org), inspired by *The Last Stand 2*. Your camp sits beside a stalled train. By day you scavenge the buildings around you, recruit and arm survivors, and fortify the camp. By night the dead may come across the field. When you have enough coal, you can move the train somewhere new. There is one life and no end. The score is how many nights you survive.

## Running it

The repo includes a prebuilt bundle (`dist/game.js`), so you can **open `index.html` in a browser**. No server is needed.

To work on the code:

```bash
npm install
npm run dev     # rebuilds on change and serves at http://localhost:8080
npm run build   # writes the minified bundle to dist/game.js
```

## The camp

The camp is a long strip beside the train:

| Area | What's there |
| --- | --- |
| **The train** (back) | Five cars. Each can carry one auto turret. |
| **Sleeping area** | Your tent (sleep to end the day), the map table, the weapon rack and workbench, the campfire (sit by it to pass time), and a bedroll for each survivor. |
| **The barricade** | The only thing between the camp and the horde. A gate in the middle swings open by day so you can walk out into the field, and is barred shut at night. |
| **The field** | A long stretch with trees, rocks and wrecks for cover. The horde crosses it at night, and your traps go here. |

## A day

You have **12 hours of daylight**. Only scavenging and moving the train use hours. Everything you do in camp is free:

* **Map table: local map.** This shows the places around you: gas stations, houses, apartment blocks, offices, warehouses, police stations, hospitals and military bases. Each has a danger rating, a search cost in hours, and its own likely loot. The map also repeats the area's appraisal (see below).
  * **Search it yourself.** You arrive on the street outside, in front of a building that looks like what it is, with an approach to match: a house has a lawn, a driveway and a car by the garage; an office or police station has a parking lot; a gas station has pumps under a canopy; a warehouse has loading docks and a trailer; a hospital has an ambulance bay; a military base has sandbags, a guard booth and a watchtower. Inside is a procedurally generated interior that matches the kind of building. Leave by walking back to the signpost where you came in.
  * **Bring survivors along.** They follow you, fight, and level up. If they die, their weapon is lost.
  * **Send a survivor alone.** Their odds are shown before you commit, based on their level, weapon and health and the location's danger. If they make it, they come back at dusk with everything inside. If not, they never come back.
* **Map table: regional map.** Spend coal and 4 hours to move the train. Everything around you is rerolled: the buildings, the survivors and the terrain. The biome changes too (forest with rain, desert with dust, tundra with snow). Each destination comes with an appraisal, for example *"Likely to have survivors and weapons, unlikely to have food, coal or scrap; VERY DANGEROUS"*. The appraisal covers survivors, weapons, ammunition, food, medicine, coal and scrap, and rates danger from *fairly safe* to *very dangerous*. The places you find there follow it, with enough noise that no building is a sure thing. Danger makes buildings harder and night waves bigger (about 12% more zombies per level above *somewhat dangerous*). Richer regions usually cost more coal to reach, but not always.
* **Weapon rack and workbench.** Equip a primary and a secondary weapon, hand weapons to survivors, and spend scrap upgrading magazine size, range, damage, fire rate or accuracy. Each weapon can only be held by one person.
* **Talk to a survivor.** See their level and stats, heal them with a med kit, or change their weapon.
* **Barricade.** Spend scrap to repair it, or reinforce it for more maximum strength.
* **Train cars.** Build a turret with scrap and a blueprint: machine gun (common), missile or artillery (rare). Turrets never run out of ammo, can't be destroyed, and only fire beyond the barricade.
* **Traps** (press **T**, or use the crate by the gate). Walk out through the gate and set bear traps, land mines, tripwire spikes and kerosene tanks within a few steps of where you stand. A kerosene tank explodes when shot. You can pick unused traps back up.
* **Campfire.** Sit by the fire to let a few hours pass, or wait until dusk.

When your hours run out it's **dusk**. You get one last chance to prepare, then sleep in your tent.

## Food

Food is scavenged like everything else: kitchens, fridges, gas station shelves and apartment pantries are the best bets. Every morning you and each survivor eat one ration. You eat first, then survivors in the order they joined. Anyone who goes without loses 30% of their maximum health that day. A survivor who starves to death leaves their weapon on the rack, and if you starve, the run is over.

## A night

On the first night there is a 50% chance of a wave, and the chance rises by 1% every night. If a wave comes:

* Zombies cross the field and batter the barricade. Once it breaks, they come for you and your survivors.
* You can't go beyond the barricade at night. Survivors hold positions behind it and fight with whatever you gave them. **Survivors never run out of ammo, but you do.** With launchers, grenades, molotovs or the flamethrower they're slow and careful: one shot every 6–8 seconds, flamethrower bursts with long pauses, and they won't fire where the blast would catch you or another survivor.
* Waves start big and grow fast. Every wave is larger than the last, its zombies hit harder and move faster, and tougher types join sooner: runners from the first night, blood hounds and bloaters from the second, rotters from the third, riot zombies from the fourth and brutes from the fifth.
* The dead don't pile up: bodies fade away a few seconds after they drop, in camp and in buildings.
* Clear the wave and dawn comes. You get a report, and the run is saved.

If you die at any point, the run is over.

## Leveling

You and every survivor gain XP from kills. Levels raise health, stamina, speed and weapon handling. Survivors also aim better as they level up.

## Weapons

There are 51 weapons in five rarity tiers: common, uncommon, rare, epic and legendary. Every weapon from *The Last Stand 2* is included, plus many more:

* **Melee** (never needs ammo): kitchen knife, bat, crowbar, pipe wrench, shovel, hatchet, machete, fire axe, sledgehammer, katana, chainsaw
* **Pistols:** Glock 17, Beretta, service revolver, M1911, .357 Magnum, Desert Eagle, Glock 18 auto
* **SMGs:** MAC-10, Uzi, UMP45, MP5, Thompson, Kriss Vector
* **Shotguns:** double barrel, pump, sawn-off, SPAS-12, AA-12
* **Rifles:** lever-action, SKS, M1 Garand, M4A1, AK-47, FN FAL, SCAR-H
* **Sniper rifles:** hunting rifle, Dragunov, Barrett M82
* **Machine guns:** M249 SAW, M60, minigun
* **Launchers:** M79, Milkor MGL, RPG-7
* **Bows:** recurve, compound bow, crossbow
* **Thrown:** hand grenades, molotov cocktails
* **Flamethrower**

Ranged weapons share six ammo types:

| Ammo | Used by |
| --- | --- |
| Pistol rounds | handguns, revolvers and SMGs |
| Shotgun shells | every shotgun |
| Rifle rounds | rifles, sniper rifles and machine guns |
| Arrows & bolts | bows and crossbows |
| Explosives | rockets, 40mm grenades and hand grenades |
| Fuel | the flamethrower, and molotovs (10 fuel per bottle) |

You only find ammunition for weapons you own. Ammo found for a type you have no gun for turns into a type you do use, or into scrap if you carry no ranged weapons at all.

## The dead

| Zombie | Where | Behaviour |
| --- | --- | --- |
| **Walker** | everywhere | Slow and common. |
| **Runner** | every wave, buildings | Sprints at you. |
| **Grunt** | everywhere | Hunts by sight in buildings and marches with the horde. |
| **Bloater / Rotter** | wave 2 / wave 3+ | Slow, with huge health. |
| **Riot Zombie** | wave 4+, police and military | Armour halves body shots. Aim for the head. |
| **Crawler** | after explosions | Explosions sometimes leave half a zombie still crawling. |
| **Blood Hound** | wave 2+, buildings | Its shriek whips the horde into a frenzy. In buildings it calls the others, and hiding won't fool it. |
| **Blind Brute** | wave 5+, dangerous buildings | Hunts by sound and smashes barricades. Shoot it and it charges. |

Everyone, living or dead, is built to the same human scale as you: about 1.8 m tall.

Buildings keep the original hazards: spike pits, bear traps, tripwires, broken glass, and lockers and beds to hide in.

## Controls

| Key | Action | Key | Action |
| --- | --- | --- | --- |
| WASD | Move | Mouse | Look / aim |
| Shift | Run | Space | Jump |
| C | Crouch | E | Interact |
| Click | Attack (hold for automatic weapons) | R | Reload |
| 1 / 2 / Q / wheel | Switch weapon | H | Use a med kit |
| T | Place traps (camp, by day) | F | Flashlight |
| M / Tab | Map (in buildings) | Esc | Pause |

## Graphics

The **Graphics** setting on the pause screen has three levels:

* **Cinematic** (default): soft sun shadows that follow you, a sky with drifting clouds, a sun, stars and a moon, image-based reflections, multisampled HDR rendering with bloom, ACES tone mapping and a film grade (contrast, a slight warm/cool split, vignette, grain and a touch of lens fringing).
* **Balanced**: the same look without bloom, with lighter anti-aliasing and smaller shadow maps, for slower machines.
* **Retro (pixelated)**: the original low-resolution look.

Walking into a building, the daylight fades out over a few steps and your eyes take a moment to adjust. Grass sways in the wind, smoke curls up from the campfire, and rain falls in streaks. Short letterboxed shots open a building search, the start of an attack and arrival in a new place; any key or a click skips them.

## Tech notes

* Everything is procedural: there are no image or sound files. Textures are painted on canvases, and the music and sound effects are synthesised with the Web Audio API.
* The run state is plain JSON (`src/run.js`) and is saved to `localStorage` each morning and whenever you're back in camp by day.
* Source layout:
  * `src/run.js`: the run state, survivors, XP, localities and locations with their pre-rolled loot, waves, the regional map, save/load
  * `src/weapons.js`: the weapon catalog, ammo, rarity, upgrades and loot rolls
  * `src/camp.js`: the camp scene (layout, barricade, flow field for the horde, traps, turrets, waves, weather)
  * `src/building.js` and `src/dungeon.js`: building interiors generated per location type
  * `src/exterior.js` and `src/lotprops.js`: each building's facade, roof and signage, its street-front lot dressed for its type, and the street outside
  * `src/env.js`, `src/sky.js`, `src/render.js` and `src/atmos.js`: lighting and time of day, the sky dome, the post-processing pipeline, and grass, ground variation and smoke
  * `src/enemies.js`: zombie AI (roaming in buildings, wave mode in camp)
  * `src/survivors.js`: survivor NPCs (camp, defend, follow)
  * `src/combat.js`: hitscan, projectiles, explosions, fire, melee and tracers
  * `src/player.js`: the player controller and weapons
  * `src/ui.js`: the HUD, minimaps and management panels
  * `src/actors.js`, `src/gunModels.js`, `src/props.js`, `src/models.js`: low-poly models
  * `src/world.js`: geometry, collision, line of sight and A* pathfinding
