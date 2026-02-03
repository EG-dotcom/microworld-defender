(function () {
  const M = window.MWD;
  let bootAttempted = false;
  let towersLoadAttempted = false;

  function setStatus(msg) {
    const el = document.getElementById("status");
    if (el) el.textContent = msg;
  }

  function fail(msg, err) {
    setStatus("ERROR: " + msg);
    if (err) console.error(err);
    throw err || new Error(msg);
  }

  function loadScriptOnce(src, onload, onerror) {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing && existing.dataset.loaded === "true") {
      if (onload) onload();
      return;
    }

    const s = document.createElement("script");
    s.src = src;
    s.async = false;
    s.onload = () => {
      s.dataset.loaded = "true";
      if (onload) onload();
    };
    s.onerror = () => {
      if (onerror) onerror();
    };
    document.head.appendChild(s);
  }

  function boot() {
    if (bootAttempted) return;
    bootAttempted = true;

    try {
      setStatus("GAME BOOT…");

      if (!M) fail("window.MWD missing");
      if (!M.world) fail("MWD.world missing (world.js not loaded or didn't define it)");
      if (!M.loop || !M.loop.createLoop) fail("MWD.loop.createLoop missing (engine/loop.js problem)");
      if (!M.level || !M.level.path) fail("MWD.level.path missing (level selection problem)");
      if (!M.render) fail("MWD.render missing (render.js problem)");
      if (!M.towers) fail("MWD.towers missing (towers.js problem)");
      if (!M.enemy) fail("MWD.enemy missing (enemy.js problem)");

    // DOM
      M.canvas = document.getElementById("game");
      if (!M.canvas) fail("Canvas #game missing in index.html");
      M.ctx = M.canvas.getContext("2d");
      if (!M.ctx) fail("Could not get 2D context");

    const W = M.world;

    // Canvas size
      M.canvas.width = W.WIDTH;
      M.canvas.height = W.HEIGHT;

    // Waypoints
    const waypoints = M.level.path.map(p => W.gridToPixelCenter(p.x, p.y));
    M.levelWaypoints = waypoints;

    // State
      M.enemies = M.enemies || [];
      M.spawner = M.spawner || { active: true, waveIndex: 0, spawnedInWave: 0, spawnTimer: 0 };

      if (M.towers.initForLevel) M.towers.initForLevel(M.level);

    // Must have waves or you’ll see nothing moving (still should render grid/path)
      if (!M.level.waves || M.level.waves.length === 0) {
        setStatus("GAME BOOT OK (no waves). Grid should still render. Add waves in src/levels/level1.js");
      } else {
        setStatus("GAME BOOT OK. Starting loop…");
      }

      function updateSpawner(dt) {
        const level = M.level;
        if (!level.waves || level.waves.length === 0) return;

        const sp = M.spawner;
        if (!sp.active) return;
        if (sp.waveIndex >= level.waves.length) { sp.active = false; return; }

        const wave = level.waves[sp.waveIndex];
        sp.spawnTimer += dt;

        while (sp.spawnedInWave < wave.count && sp.spawnTimer >= wave.interval) {
          sp.spawnTimer -= wave.interval;

          if (!M.enemy.create) fail("MWD.enemy.create missing (enemy.js must expose enemy.create(config, waypoints))");
          const e = M.enemy.create(wave.enemy || {}, waypoints);
          M.enemies.push(e);

          sp.spawnedInWave++;
        }

        if (sp.spawnedInWave >= wave.count && M.enemies.length === 0) {
          sp.waveIndex++;
          sp.spawnedInWave = 0;
          sp.spawnTimer = 0;
        }
      }

      function update(dt) {
        updateSpawner(dt);
        if (M.enemy.updateAll) M.enemy.updateAll(dt);
        if (M.towers.update) M.towers.update(dt);
      }

      function draw(dtMs) {
        // If any of these are missing, it will throw and show ERROR.
        M.render.drawGrid();
        M.render.drawPath(waypoints);
        M.render.drawTowers();
        M.render.drawBullets();
        if (M.render.drawEnemies) M.render.drawEnemies();
        M.render.drawHoverPreview();
        M.render.drawUI(dtMs);
      }

    // Draw once immediately so you can SEE grid even before first RAF tick
      draw(16.7);

    // PROOF of life: frame counter
      let frames = 0;
      let acc = 0;

      const loop = M.loop.createLoop((dt, dtMs) => {
        frames++;
        acc += dt;

        update(dt);
        draw(dtMs);

        // Update status every ~0.5s so you know it’s not stuck
        if (acc >= 0.5) {
          acc = 0;
          setStatus(
            "GAME LOOP ACTIVE | frames: " + frames +
            " | enemies: " + (M.enemies ? M.enemies.length : 0) +
            " | towers: " + (M.towers && M.towers.state ? M.towers.state.towers.length : 0)
          );
        }
      });

      loop.start();
    } catch (err) {
      setStatus("ERROR: " + (err && err.message ? err.message : String(err)));
      console.error(err);
    }
  }

  // If towers didn't register, attempt a one-time dynamic load to recover.
  if (!M || !M.towers) {
    if (!towersLoadAttempted) {
      towersLoadAttempted = true;
      setStatus("Missing MWD.towers. Attempting to load src/game/towers.js …");
      loadScriptOnce("src/game/towers.js", () => {
        bootAttempted = false;
        boot();
      }, () => {
        setStatus("ERROR: Failed to load src/game/towers.js (check path or server root)");
      });
    } else {
      boot();
    }
  } else {
    boot();
  }
})();
