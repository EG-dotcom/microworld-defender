# Tasks Backlog

Use this backlog to track bugs and roadmap items. Keep items concrete with reproduction steps and acceptance criteria.

## NOW (Critical Bugs)
1. **MWD.towers missing on boot**
   - Repro steps:
     - Start the game and open DevTools console.
     - Observe `ERROR: MWD.towers missing (towers.js problem)`.
   - Acceptance criteria:
     - `MWD.towers` is defined before `src/main.js` runs.
     - No console errors on boot.
   - Notes: Check `index.html` script order and `src/game/towers.js` load path.

2. **404 for script or asset paths**
   - Repro steps:
     - Load the game from a local server.
     - Open DevTools Network tab and filter for 404s.
   - Acceptance criteria:
     - All `src/*.js` and asset paths resolve with 200.
   - Notes: Verify server root and paths in `index.html`.

3. **Load order regression (world.js before main.js)**
   - Repro steps:
     - Reorder scripts in `index.html` so `src/main.js` loads before `src/game/world.js`.
     - Observe error `MWD.world missing`.
   - Acceptance criteria:
     - Script order enforced and documented.
   - Notes: Validate order in `index.html` and architecture docs.

4. **Game runs but nothing happens (“running…” with no enemies)**
   - Repro steps:
     - Start the game and wait 10 seconds.
     - Observe no enemies or waves.
   - Acceptance criteria:
     - Enemies spawn when `waves` exist in the level.
   - Notes: Check `src/levels/level1.js` for `waves` and `src/main.js` spawner logic. If uncertain, mark as TBD and verify.

5. **Towers place but never shoot**
   - Repro steps:
     - Place towers near the path.
     - Observe enemies pass without taking damage.
   - Acceptance criteria:
     - Towers acquire targets and bullets damage enemies.
   - Notes: Check `src/game/towers.js` targeting and `src/game/enemy.js` damage handling. **TBD** if this is currently reproducible.

## NEXT (Core Features)
1. **Start / Pause control**
   - User story: As a player, I want to pause and resume the game.
   - Acceptance criteria:
     - Pause stops update loop but keeps render.
     - Resume continues from the same state.
   - Notes: Likely touches `src/main.js` and a state flag in `window.MWD`.

2. **Multiple levels selection**
   - User story: As a player, I want to switch between different levels.
   - Acceptance criteria:
     - At least two levels registered in `MWD.levels`.
     - UI or query param selects the active level.

3. **Basic HUD stats**
   - User story: As a player, I want to see wave count and enemy count.
   - Acceptance criteria:
     - HUD displays wave number and enemies alive.
   - Notes: `src/game/render.js` already displays some stats; extend carefully.

## LATER (Polish / UX)
1. Improve visuals for path and towers.
2. Add sound effects for tower shots and enemy death.
3. Add a simple start screen before the loop begins.
