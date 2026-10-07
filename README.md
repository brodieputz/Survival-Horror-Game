# Dread Depths

A first-person survival horror game built with [three.js](https://threejs.org), inspired by *The Last Stand 2*. Your camp sits beside a stalled steam train somewhere in the United States. By day you scavenge the buildings around you, recruit survivors (and the odd dog), arm them and fortify the camp. By night the dead may come across the field. When you have enough coal, you take the train on to the next city. There is one life and no end. The score is how many nights you survive.

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
| **The train** (back) | A steam locomotive and its tender, then five cars (boxcars and flatcars). Each car can carry one auto turret. |
| **Sleeping area** | Your tent (sleep to end the day), the map table, the weapon rack and workbench, the campfire (sit by it to pass time), and a bedroll for each survivor. |
| **The barricade** | The only thing between the camp and the horde. A gate in the middle swings open by day so you can walk out into the field, and is barred shut at night. |
| **The field** | A long stretch with trees, rocks and wrecks for cover. The horde crosses it at night, and your traps go here. In a big city, its skyline stands on the horizon. |

## Across America

The regional map is the lower 48, drawn to scale, with about 75 real cities at their real positions. Every stop is a real city, and what you find there follows from what that city really is:

* **Climate** sets the land around the camp: temperate forest with rain (the Pacific Northwest, the East), desert with dust (the Southwest), cold country with snow (the northern tier and the mountains), golden prairie (the Great Plains) and wet swamp (the Gulf Coast and Florida).
* **Size**, from the metro population, decides how many places there are to search and what they are, and how dangerous it is. A small town is mostly houses and gas stations and is fairly safe. A metropolis is apartment blocks, offices, hospitals and skyscrapers, and very dangerous. Big cities have more survivors, weapons, medicine and scrap but less food and coal; small towns the other way round.
* **What a city is known for** tilts its loot: farm country has food, coal country has coal, industrial cities have scrap, hospital cities have medicine, cities with bases have weapons and ammunition (and a base to search), and ports have food and scrap.

Each destination still comes with an appraisal, for example *"Likely to have survivors and weapons, unlikely to have food, coal or scrap; VERY DANGEROUS"*, with a little luck per visit so no stop is a sure thing. The next stops on offer are the nearest cities you haven't been to, plus a longer haul to a bigger city. **Coal follows the real rail distance** (about one coal per hundred miles, at least two). Your route is drawn in red on the map.

Moving on takes 4 hours of daylight and plays a short film of the trip: the train steaming across open country, smoke rolling back off the stack, the rods driving the wheels and telegraph poles whipping past, while the land changes from the climate you left to the one you're heading for. Any key skips it.

### Trouble on the line

On most journeys (more often on long ones) something is waiting on the tracks. The train brakes to a stop partway through the film and you decide what to do. Every choice costs something: hours of daylight, coal, scrap, food, ammunition or blood. The outcome is applied at once and listed again when you pull in.

| Event | Choices |
| --- | --- |
| **Wreckage on the line** | Clear it by hand (2 hours, scrap from the wreck, something may bite), or ram it at full steam (1 coal, the cowcatcher may buckle). |
| **The dead on the tracks** | Fight them off from the cars (ammo and scratches, XP for everyone), or ram through (1 coal). |
| **Someone waving** | Stop and take them aboard (a new survivor, or raiders using bait), or keep going. |
| **A hot box** | Repair the bearing (5 scrap), or limp on at walking pace (3 hours). |
| **An abandoned freight train** | Search the boxcars (1 hour: coal, food, scrap, maybe ammo, maybe a corpse in the dark), or leave it. |
| **The bridge is out** | Take the branch line (2 coal), or creep across what's left. |
| **A dog on the line** | Stop and coax it aboard with food, or keep going. |
| **Frozen points** (winter) | Thaw the switch with burning coal, or chip the ice by hand in the cold. |
| **A camp by the line** | Trade scrap for food or food for coal, or move on. |

If you close the panel without choosing, you take the free option.

## Seasons

A run starts in early spring, and the calendar moves on four days with every day you survive. The HUD shows the date and the season.

| Season | Daylight | What changes |
| --- | --- | --- |
| **Spring** | 12 hours | Rain and mud. |
| **Summer** | 14 hours | Long days, but the hordes are a quarter bigger and a little faster. The northern snows have thawed. |
| **Autumn** | 11 hours | Harvest time: farm country has far more food. |
| **Winter** | 10 hours | Snow falls across the north and the mountains, and the land turns white. Food is scarcer, the dead are slower and the hordes a little smaller, but the nights are bitter: where there is snow, the stove burns **1 coal every night**. With no coal, everyone wakes up weaker from the cold. |

When the season turns, the dawn report says so; when snow falls or melts, the camp changes with it.

## A day

You have **10 to 14 hours of daylight**, depending on the season. Only scavenging and moving the train use hours. Everything you do in camp is free:

* **Map table: local map.** This shows the places around you, each with a danger rating, a search cost in hours, its number of floors and its likely loot. Locked vaults you know about and keys you've heard of are marked.
  * **Search it yourself.** You arrive on the street outside a building that looks like what it is (a house with a driveway, an office with a parking lot, a gas station with pumps, a skyscraper with a plaza and a fountain...). Leave by walking back to the signpost where you came in.
  * **Bring survivors (and dogs) along.** They follow you from floor to floor, fight, and level up. If they die, their weapon is lost.
  * **Send a survivor alone.** Their odds are shown before you commit, based on their level, weapon and health and the location's danger. If they make it, they come back at dusk with everything inside (and any key they found). If not, they never come back. Dogs won't go alone.
* **Map table: regional map.** Pick the next city (see above).
* **Weapon rack and workbench.** Equip a primary and a secondary weapon, hand weapons to survivors, and spend scrap upgrading magazine size, range, damage, fire rate or accuracy. Each weapon can only be held by one person.
* **Talk to a survivor.** See their level and stats, heal them with a med kit, or change their weapon.
* **Barricade.** Spend scrap to repair it, or reinforce it for more maximum strength.
* **Train cars.** Build a turret with scrap and a blueprint: machine gun (common), missile or artillery (rare). Turrets never run out of ammo, can't be destroyed, and only fire beyond the barricade.
* **Traps** (press **T**, or use the crate by the gate). Walk out through the gate and set bear traps, land mines, tripwire spikes and kerosene tanks within a few steps of where you stand. A kerosene tank explodes when shot. You can pick unused traps back up.
* **Campfire.** Sit by the fire to let a few hours pass, or wait until dusk.

When your hours run out it's **dusk**. You get one last chance to prepare, then sleep in your tent.

## Buildings

Every building is a real floor plan: rooms divided by walls with doorways, corridors, a lobby, and a stairwell up to more floors. Houses have one or two storeys, apartment blocks, offices and hospitals two or three, skyscrapers four (the rest of the tower is gutted). Take the stairs with **E** from the landing. Each floor keeps its state while you go up and down.

Every room has a purpose, and it looks it: living rooms with sofas, TVs, bookshelves and rugs; kitchens with counters, stoves and a table with a chair knocked over; bedrooms, kids' rooms and bathrooms; studio apartments; cubicle farms, private offices, conference and break rooms; wards and exam rooms; a police front desk, bullpen, holding cells, lockers and an armory; barracks, a mess hall and a command post; shop aisles and drink coolers; pallet racking and a forklift. Pictures, posters and clocks hang on the walls, clutter covers the floors, and daylight falls through dusty blinds or between boards nailed over windows. What's in the drawers follows the room: fridges in kitchens, medicine cabinets in bathrooms and wards, gun lockers in the armory.

Buildings keep the original hazards: spike pits where the floor gave way, bear traps, tripwires across corridors, broken glass, and wardrobes, lockers and beds to hide in or under. The dead path around the furniture.

### Landmarks

Some cities have landmarks, which are bigger, richer and more dangerous than anywhere else in town. They are marked in gold on the local map:

* **Stadium** (big cities): an open-air field turned into a quarantine camp, with field-hospital beds, supply pallets and mess tables under the stands, and concession stands and locker rooms underneath. It holds lots of food, medicine and survivors, and a horde.
* **Shopping mall** (bigger cities): two floors of stores (groceries, sporting goods with gun racks, clothing and hardware) around an atrium, with a food court upstairs. Batteries, weapons and food.
* **Rail yard** (railroad, industrial and port towns): engine sheds full of coal, spare parts and turret blueprints, with boxcars on sidings outside.
* **Grain co-op** (farm country): sacks of grain and feed under the silos, which hold enough food for weeks.
* **Coal mine** (coal country): a pithead with a headframe and coal heaps outside. It holds coal by the ton, and blasting powder.

### What's waiting inside

As well as the dead wandering the halls:

* **Boarded-up rooms.** Some doorways are nailed shut with *DEAD INSIDE* painted across the planks. Get close or make noise and whatever is shut inside starts battering the boards until they splinter. You can also pry them off yourself (**E**, loudly) and be ready when the dead come out.
* **Nests.** A pulsing mound of flesh that keeps disgorging crawlers, walkers and runners while you're near. Shoot it, burn it or blow it up to stop it; there's usually scrap and food in the remains.
* **Lurkers** lie still in pools of blood among the bones, looking like any other corpse, until someone walks within a few steps.
* **Spitters** keep their distance and lob globs of bile that burn on impact and leave a pool of acid on the floor. Keep moving.
* **Nothing is safe on the stairs.** Zombies hunting you follow you up or down to the next floor, arriving a few seconds behind you depending on how far back they were.

### Batteries

The flashlight runs on batteries, about four minutes each. A weak one dims and stutters. When it goes flat a spare goes in automatically; with none left, the light dies and you're in the dark. Batteries lie around on shelves, desks and floors, and turn up in containers. The HUD shows the charge and your spares.

### Keys, vaults and notes

Some places have a vault behind a locked gate: a gun safe room, an evidence locker, a pharmacy, an armory, a server room, an executive vault. It holds the good stuff. The key is in **another building in the same town**, and usually a note pinned beside the gate (or left somewhere else) says where. Read notes with **E**. The map marks a lock once you've found it or heard of it, and a key once a note points to it. A place whose vault is still locked can be searched again once you have the key. Keys don't work in the next city.

### Dogs

Strays hole up in houses and gas stations; police and army dogs stay near their posts. Call one over and it joins the camp. Dogs are fast, bite hard and bark when the dead come near. They eat like everyone else, but they can't carry a weapon and won't scavenge alone.

## Food

Food is scavenged like everything else: kitchens, fridges, gas station shelves and apartment pantries are the best bets. Every morning you and each survivor (dogs included) eat one ration. You eat first, then survivors in the order they joined. Anyone who goes without loses 30% of their maximum health that day. A survivor who starves to death leaves their weapon on the rack, and if you starve, the run is over.

## A night

On the first night there is a 55% chance of a wave, and the chance rises by 1.5% every night. **Every seventh night is a blood moon**: the night turns red, a wave is certain, and it is 60% bigger with tougher zombies. If a wave comes:

* Zombies cross the field and batter the barricade. Once it breaks, they come for you and your survivors.
* You can't go beyond the barricade at night. Survivors hold positions behind it and fight with whatever you gave them. **Survivors never run out of ammo, but you do.** With launchers, grenades, molotovs or the flamethrower they're slow and careful: one shot every 6–8 seconds, flamethrower bursts with long pauses, and they won't fire where the blast would catch you or another survivor.
* Waves start big and grow fast. Every wave is larger than the last, its zombies are tougher, hit harder and move faster, and tougher types join sooner: runners from the first night, blood hounds and bloaters from the second, rotters and spitters from the third, riot zombies from the fourth and brutes from the fifth. A dangerous city sends bigger waves, and so does summer.
* From the second wave on, the horde comes in **surges**: every few dozen zombies, a mass of them rushes the barricade along several lanes at once, in a frenzy.
* **Spitters** stop short of the barricade and lob bile over it at whoever is defending it.
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

Guns are built from their real parts: frames and slides, receivers and rails, handguards, iron sights, magazines, stocks, bolts, pumps and scopes. In your hands:

* **Aim down the sights** with the right mouse button. The rear sight comes up to your eye, the view narrows (and the mouse slows to match), and the spread tightens, but you walk slower. Scoped rifles fill the screen with the scope's reticle.
* **Recoil kicks on springs.** The muzzle climbs, the view punches, and the gun slides back and rises. Slides snap back (and lock open on an empty magazine), pumps are racked, bolt actions and levers cycle, revolver cylinders turn, and spent brass and shotgun hulls fly out and bounce on the floor.
* **Reloads are acted out by both hands**: the magazine drops out, a fresh one goes in, and the slide or charging handle is racked. Shotgun shells are fed one by one, a revolver is swung open, a rocket is pushed into the tube. Sprinting lowers the gun.

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

Anything hunting you in a building follows you up and down the stairs.

| Zombie | Where | Behaviour |
| --- | --- | --- |
| **Walker** | everywhere | Slow and common. |
| **Runner** | every wave, buildings | Sprints at you. |
| **Grunt** | everywhere | Hunts by sight in buildings and marches with the horde. |
| **Bloater / Rotter** | wave 2 / wave 3+ | Slow, with huge health. |
| **Riot Zombie** | wave 4+, police and military | Armour halves body shots. Aim for the head. |
| **Crawler** | after explosions | Explosions sometimes leave half a zombie still crawling. |
| **Blood Hound** | wave 2+, buildings | Its shriek whips the horde into a frenzy. In buildings it calls the others, and hiding won't fool it. |
| **Spitter** | wave 3+, buildings | Keeps its distance and lobs bile that burns and leaves an acid pool. At the camp it hangs back and spits over the barricade. |
| **Lurker** | buildings | Lies among the dead like a corpse and springs up when you come close. |
| **Blind Brute** | wave 5+, dangerous buildings | Hunts by sound and smashes barricades. Shoot it and it charges. |

Everyone, living or dead, is built to the same human scale as you: about 1.8 m tall.

## Controls

| Key | Action | Key | Action |
| --- | --- | --- | --- |
| WASD | Move | Mouse | Look / aim |
| Shift | Run | Space | Jump |
| C | Crouch | E | Interact (search, talk, read, take the stairs, unlock) |
| Left click | Attack (hold for automatic weapons) | Right mouse | Aim down the sights |
| R | Reload | H | Use a med kit |
| 1 / 2 / Q / wheel | Switch weapon | F | Flashlight (runs on batteries) |
| T | Place traps (camp, by day) | M / Tab | Map (in buildings) |
| Esc | Pause | | |

## Graphics

The **Graphics** setting on the pause screen has three levels:

* **Cinematic** (default): soft sun shadows that follow you, a sky with drifting clouds, a sun, stars and a moon, light shafts streaming from the sun through trees, fences and buildings, image-based reflections, multisampled HDR rendering with bloom, ACES tone mapping and a film grade (contrast, a warm/cool split, vignette, grain and a touch of lens fringing).
* **Balanced**: the same look without bloom, with lighter anti-aliasing and smaller shadow maps, for slower machines.
* **Retro (pixelated)**: the original low-resolution look.

The sun sits low, so shadows are long. Walking into a building, the daylight fades out over a few steps and your eyes take a moment to adjust. Indoors, the flashlight's beam hangs in the dusty air, with motes drifting through it. Grass sways in the wind, smoke curls up from the campfire, and rain falls in streaks. Short letterboxed shots open a building search, the start of an attack, the trip between cities and the arrival; any key or a click skips them.

## Tech notes

* Everything is procedural: there are no image or sound files. Textures are painted on canvases, and the music and sound effects are synthesised with the Web Audio API.
* The run state is plain JSON (`src/run.js`) and is saved to `localStorage` each morning, whenever you're back in camp by day, and on arrival in a new city.
* Source layout:
  * `src/run.js`: the run state, survivors and dogs, XP, the calendar and seasons, cities and their locations (landmarks included) with pre-rolled loot, keys and vaults, waves and the blood moon, the regional map, save/load
  * `src/cities.js`: the cities (positions, metro populations, climates, industries), distances, and the outline of the lower 48 and the Great Lakes for the map
  * `src/weapons.js`: the weapon catalog, ammo, rarity, upgrades and loot rolls
  * `src/camp.js`: the camp scene (layout, barricade, flow field for the horde, traps, turrets, waves, weather, skyline)
  * `src/dungeon.js`: building floor plans (rooms, corridors, stairs, vaults), room purposes and furnishing, and placements for everything inside
  * `src/building.js`: runs a building floor by floor (stairs and the dead that follow you on them, windows, pickups, the vault gate, boarded rooms, nests)
  * `src/furniture.js`: furniture and clutter models
  * `src/exterior.js` and `src/lotprops.js`: each building's facade, roof and signage, its street-front lot, and the street outside
  * `src/train.js` and `src/travel.js`: the locomotive, tender and cars, and the film of the trip between cities
  * `src/railevents.js`: the events on the line between cities and their outcomes
  * `src/env.js`, `src/sky.js`, `src/render.js`, `src/atmos.js` and `src/beam.js`: lighting and time of day, the sky dome, the post-processing pipeline (light shafts, bloom, grade), grass and smoke, and the flashlight beam and dust
  * `src/enemies.js`: zombie AI (roaming in buildings, wave mode in camp)
  * `src/survivors.js`: survivor and dog NPCs (camp, defend, follow)
  * `src/combat.js`: hitscan, projectiles, explosions, fire, melee and tracers
  * `src/player.js`: the player controller, weapons, recoil and the flashlight's battery
  * `src/gunModels.js` and `src/viewmodel.js`: weapon models, and the first-person hands and gun (aiming, recoil, reloads)
  * `src/ui.js`: the HUD, minimaps, the US map and management panels
  * `src/actors.js`, `src/props.js`, `src/models.js`: low-poly models
  * `src/world.js`: geometry (thin walls and doorways), collision, line of sight and path-finding
