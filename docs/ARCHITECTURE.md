# Architecture

This document describes how MicroWorld Defender is structured today. It reflects the current codebase and avoids assumptions. Where something is unclear, it is marked as **TBD** with a pointer to the file that should define it.

## High-Level Flow
- Entry point: `index.html`
- Global namespace: `window.MWD` initialized in `src/mwd.js`
- Boot sequence and game loop: `src/main.js`
  - Initializes canvas
  - Builds waypoints from level path
  - Spawns waves
  - Runs update + render on RAF loop

**Update/Render Loop** (see `src/main.js`)
1. `updateSpawner(dt)`
2. `MWD.enemy.updateAll(dt)`
3. `MWD.towers.update(dt)`
4. Render: grid, path, towers, bullets, enemies, hover, UI

## State Machine
There is no explicit state machine (menu/playing/paused/gameover) in the current code.
- Current behavior: the game starts immediately on load if `MWD.level` is set.
- **TBD**: If states are planned, add them here and implement in `src/main.js`.

## Core Modules
- `window.MWD` (global namespace; do not overwrite it)
- `MWD.world` in `src/game/world.js`
- `MWD.enemy` in `src/game/enemy.js`
- `MWD.towers` in `src/game/towers.js`
- `MWD.render` in `src/game/render.js`
- `MWD.loop` in `src/engine/loop.js`
- `MWD.level` (selected in `index.html`, data defined in `src/levels/level1.js`)

## Asset Loading
- Assets live in `assets/`.
- **TBD**: There is no asset loader in code right now. If assets are introduced, define the loading policy in `src/main.js` and document it here.

## Script Loading Policy
Classic scripts (not ES modules) are used. Order matters.

Expected order (see `index.html`):
1. `src/mwd.js` (creates `window.MWD`)
2. `src/engine/loop.js`
3. `src/game/world.js`
4. `src/game/enemy.js`
5. `src/game/towers.js`
6. `src/game/render.js`
7. `src/levels/level1.js`
8. `src/main.js` (boot)

**Important**: `world.js` must load before `main.js` or `MWD.world` will be missing. `towers.js` must load before `main.js` or `MWD.towers` will be missing.

## Common Failure Modes
- 404 / missing script
  - Cause: wrong server root or incorrect path in `index.html`.
  - Fix: run a local server from repo root and verify all script paths.
- Load order issues
  - Cause: moving `main.js` earlier or missing a required module.
  - Fix: restore the load order from `index.html` above.
- Global namespace overwritten
  - Cause: reassigning `window.MWD = {}` instead of extending it.
  - Fix: only mutate properties; do not overwrite the object (see `src/mwd.js`).
- “Running…” without gameplay
  - Cause: no waves in the active level or spawner disabled.
  - Fix: verify `src/levels/level1.js` contains `waves` and that `MWD.level` is set.
