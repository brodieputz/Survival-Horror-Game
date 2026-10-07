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
| **Sleeping area** | Your tent (sleep to end the day), the map table, the weapon rack and workbench, the campfire, and a bedroll for each survivor. |
| **The barricade** | The only thing between the camp and the horde. A gate in the middle stands open by day and is closed at night. |
| **The field** | A long stretch with trees, rocks and wrecks for cover. The horde crosses it at night, and your traps go here. |

## A day

You have **12 hours of daylight**. Only scavenging and moving the train use hours. Everything you do in camp is free:

* **Map table: local map.** This shows the places around you: gas stations, houses, apartment blocks, offices, warehouses, police stations, hospitals and military bases. Each has a danger rating, a search cost in hours, and its own likely loot.
  * **Search it yourself.** You arrive outside the entrance and explore a procedurally generated interior that matches the kind of building. Leave by returning to where you came in.
  * **Bring survivors along.** They follow you, fight, and level up. If they die, their weapon is lost.
  * **Send a survivor alone.** Their odds are shown before you commit, based on their level, weapon and health and the location's danger. If they make it, they come back at dusk with everything inside. If not, they never come back.
* **Map table: regional map.** Spend coal and 4 hours to move the train. Everything around you is rerolled: the buildings, the survivors and the terrain. The biome changes too (forest with rain, desert with dust, tundra with snow).
* **Weapon rack and workbench.** Equip a primary and a secondary weapon, hand weapons to survivors, and spend scrap upgrading magazine size, range, damage, fire rate or accuracy. Each weapon can only be held by one person.
* **Talk to a survivor.** See their level and stats, heal them with a med kit, or change their weapon.
* **Barricade.** Spend scrap to repair it, or reinforce it for more maximum strength.
* **Train cars.** Build a turret with scrap and a blueprint: machine gun (common), missile or artillery (rare). Turrets never run out of ammo, can't be destroyed, and only fire beyond the barricade.
* **Traps** (press **T**, or use the crate by the gate). Place bear traps, land mines, tripwire spikes and kerosene tanks anywhere beyond the barricade. A kerosene tank explodes when shot. You can pick unused traps back up.

When your hours run out it's **dusk**. You get one last chance to prepare, then sleep in your tent.

## A night

On the first night there is a 50% chance of a wave, and the chance rises by 1% every night. If a wave comes:

* Zombies cross the field and batter the barricade. Once it breaks, they come for you and your survivors.
* You can't go beyond the barricade at night. Survivors hold positions behind it and fight with whatever you gave them. **Survivors never run out of ammo, but you do.** With launchers, grenades, molotovs or the flamethrower they're slow and careful: one shot every 6–8 seconds, flamethrower bursts with long pauses, and they won't fire where the blast would catch you or another survivor.
* Each wave is bigger than the last and brings tougher, faster types.
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

Ranged weapons draw from shared ammo pools: pistol, magnum, shells, rifle, sniper, arrows, rockets, 40mm, grenades, molotovs and fuel.

## The dead

| Zombie | Where | Behaviour |
| --- | --- | --- |
| **Walker** | everywhere | Slow and common. |
| **Runner** | wave 2+, buildings | Sprints at you. |
| **Grunt** | everywhere | Hunts by sight in buildings and marches with the horde. |
| **Bloater / Rotter** | wave 3–4+ | Slow, with huge health. |
| **Riot Zombie** | wave 5+, police and military | Armour halves body shots. Aim for the head. |
| **Crawler** | after explosions | Explosions sometimes leave half a zombie still crawling. |
| **Blood Hound** | wave 3+, buildings | Its shriek whips the horde into a frenzy. In buildings it calls the others, and hiding won't fool it. |
| **Blind Brute** | wave 7+, dangerous buildings | Hunts by sound and smashes barricades. Shoot it and it charges. |
| **Angel** | dangerous buildings only | Moves only when unseen. Can't be killed. Never joins a night raid. |

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

## Tech notes

* Everything is procedural: there are no image or sound files. Textures are painted on canvases, and the music and sound effects are synthesised with the Web Audio API.
* The run state is plain JSON (`src/run.js`) and is saved to `localStorage` each morning and whenever you're back in camp by day.
* Source layout:
  * `src/run.js`: the run state, survivors, XP, localities and locations with their pre-rolled loot, waves, the regional map, save/load
  * `src/weapons.js`: the weapon catalog, ammo, rarity, upgrades and loot rolls
  * `src/camp.js`: the camp scene (layout, barricade, flow field for the horde, traps, turrets, waves, weather)
  * `src/building.js` and `src/dungeon.js`: building interiors generated per location type
  * `src/enemies.js`: zombie AI (roaming in buildings, wave mode in camp)
  * `src/survivors.js`: survivor NPCs (camp, defend, follow)
  * `src/combat.js`: hitscan, projectiles, explosions, fire, melee and tracers
  * `src/player.js`: the player controller and weapons
  * `src/ui.js`: the HUD, minimaps and management panels
  * `src/actors.js`, `src/gunModels.js`, `src/props.js`, `src/models.js`: low-poly models
  * `src/world.js`: geometry, collision, line of sight and A* pathfinding
