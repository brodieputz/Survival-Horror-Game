# Dread Depths

A first-person survival horror game built with [three.js](https://threejs.org). Every level is a procedurally generated dungeon. Each one is bigger than the last and has more monsters. The run never ends: the goal is to see how deep you can get before your last life runs out.

## Running it

The repo includes a prebuilt bundle (`dist/game.js`), so you can **open `index.html` in a browser**. No server is needed.

To work on the code:

```bash
npm install
npm run dev     # rebuilds on change and serves at http://localhost:8080
npm run build   # writes the minified bundle to dist/game.js
```

## How to play

* You start each level in the **sanctuary** (the safe room). Monsters cannot enter it. A small barred window lets you peek into the dungeon outside.
* Find every **diamond** on the level. Level 1 has one diamond, and each level after that adds one more. Then go back to the sanctuary and open the hatch to go down to the next level.
* **Gold** lies around the dungeon and inside crates. Spend it with **the Keeper** in the sanctuary. Prices are high and rise as you go deeper, so even if you collect carefully you'll only afford a few items per level:
  * Extra life, med kit, skeleton key (opens one locked crate), bear trap, revolver rounds
  * Upgrades: Vitality (max health), Swiftness (speed), Endurance (stamina), Midas' Touch (gold multiplier)
  * Cartographer's map: shows the whole level and every diamond on the map
* The **minimap** fills in as you explore. Press **M** or **Tab** to open the full map.
* You start with **3 lives**. Each death sends you back to the sanctuary and costs you a quarter of your gold.

### Controls

| Key | Action | Key | Action |
| --- | --- | --- | --- |
| WASD | Move | Mouse | Look |
| Shift | Run (uses stamina) | Space | Jump |
| C | Crouch (quiet) | E | Interact / hide / leave hiding spot |
| F | Flashlight on/off | Left click | Fire revolver |
| R | Reload | H / 1 | Use med kit |
| T / 2 | Place bear trap | M / Tab | Map |
| Esc | Pause and settings | | |

### Hiding

You can hide in **lockers**, **wardrobes**, and **under beds and benches**. What happens next depends on whether a monster saw you hide:

* If no monster saw you, a monster that was chasing you goes to where it last saw you, looks around for a moment, then moves on. A patrolling monster walks right past.
* If a monster saw you hide, it comes over and **drags you out**, which hurts.
* A **Blood Hound** that is already chasing you can't be fooled. It stands at your hiding spot and shrieks, and every monster that hears it comes to drag you out.

### The monsters

| Monster | Behaviour |
| --- | --- |
| **Grunt** | Patrols the halls and attacks on sight. Almost as fast as you, so you can outrun it. |
| **Angel** | Moves only when you aren't looking at it, and it moves very fast. Freezes the instant you look at it. In the dark it counts as unseen, so keep your flashlight on it. It can't be killed, and if it reaches you, you die. |
| **Blind Brute** | Can't see. It hunts by sound: footsteps, gunfire, broken glass. It is huge and takes many bullets to kill. Shooting it enrages it and it charges straight at you. It fights any Grunt it runs into and usually wins. |
| **Blood Hound** | Small and fast. When it spots you it shrieks, and every monster nearby comes. Hiding spots don't fool it. |

New monster types appear as you go deeper: Hounds from level 2, Brutes from level 3, Angels from level 4. Monster counts rise with every level.

### Hazards

* **Spike pits**: jump over them. If you fall in, you get impaled.
* **Bear traps**: they hold you in place and make a loud noise.
* **Tripwires**: spikes shoot out of the walls. Jump over the wire.
* **Broken glass**: very loud to walk on, especially for the Brute. Crouch to make less noise.
* **Crates**: some are locked and need a skeleton key. Locked crates hold better loot.

## Tech notes

* Everything is procedural: there are no image or sound files. Textures are painted on canvases. Music and sound effects are synthesized with the Web Audio API. There are three music layers that crossfade: a calm one in the sanctuary, an eerie one in the dungeon, and a frantic one during chases. Sounds are positioned in 3D and are muffled when a wall is in the way.
* The scene renders at reduced resolution for a retro look, with a shadow-casting flashlight. You can turn the retro look off in the pause menu.
* Source layout:
  * `src/dungeon.js`: level generation (rooms, corridors with loops, placement of props, traps and monsters)
  * `src/world.js`: geometry building, collision, line of sight, A* pathfinding
  * `src/enemies.js`: monster AI
  * `src/player.js`: player controller
  * `src/audio.js`: music and sound
  * `src/level.js`: per-level objects and logic
  * `src/ui.js`: HUD, minimap, shop and menus
