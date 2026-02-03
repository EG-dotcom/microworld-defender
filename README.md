# MicroWorld Defender

MicroWorld Defender is a small HTML/JS tower‑defense prototype that runs in the browser using classic script tags and a global `window.MWD` namespace.

**Quick Start**
1. Run a local server from the repo root:
   - `python -m http.server 8000`
2. Open this URL in your browser:
   - `http://localhost:8000/index.html`

**Expected Structure**
- `index.html` (entrypoint, script load order)
- `assets/` (static art/audio; currently unused by code)
- `docs/` (project documentation)
- `src/engine/` (engine loop)
- `src/game/` (world, render, enemy, towers)
- `src/levels/` (level data)

**Debugging**
- 404s or missing scripts:
  - Confirm the server root is the repo root.
  - Check the exact script paths in `index.html`.
  - Verify filenames and casing (macOS/Linux are case‑sensitive).
- `MWD.* is undefined`:
  - Check script load order in `index.html`.
  - `src/mwd.js` must load first and `src/main.js` must load last.
  - `src/game/world.js` must load before `src/main.js`.
- Console errors:
  - Open DevTools console to see the exact error message and stack trace.
  - If the status bar says “ERROR”, the console usually shows the cause.

**Definition of Done (DoD)**
- No console errors on load.
- Game starts and the loop updates the status text.
- Basic smoke test passes (grid renders, path renders, waves spawn, towers place and shoot).

**Docs**
- `docs/ARCHITECTURE.md`
- `docs/TASKS.md`
- `docs/BUG_REPORT_TEMPLATE.md`
