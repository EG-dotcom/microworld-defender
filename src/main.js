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
      if (!M.levels) M.levels = {};
      if (!M.level || !M.level.path) {
        setStatus("MENU: select a map");
      }
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

      // Assets
      M.assets = M.assets || {};
      M.assets.towers = M.assets.towers || {};

      function preloadTowerSprites() {
        const defs = (M.towers && M.towers.TOWER_DEFS) ? M.towers.TOWER_DEFS : [];
        for (let i = 0; i < defs.length; i++) {
          const d = defs[i];
          const path = d.sprite || `assets/towers/${d.id}.png`;
          if (M.assets.towers[d.id]) continue;
          const img = new Image();
          img._loaded = false;
          img._error = false;
          img.onload = () => { img._loaded = true; };
          img.onerror = () => { img._error = true; };
          img.src = path;
          M.assets.towers[d.id] = img;
        }
      }

      preloadTowerSprites();

      // State
      M.enemies = M.enemies || [];
      M.spawner = M.spawner || { active: true, waveIndex: 0, spawnedInWave: 0, spawnTimer: 0 };
      // Starting immunomoney tuned so you can place 2 Neutrophils or 1 Macrophage + 1 Neutrophil.
      M.economy = M.economy || { cash: 140 };
      M.player = M.player || { hp: 150, maxHp: 150 };
      M.stats = M.stats || { kills: 0 };
      M.ui = M.ui || {};
      if (typeof M.ui.paletteVisible !== "boolean") M.ui.paletteVisible = true;
      M.state = M.state || "menu";

      // Menu items
      if (!M.menu) {
        const levels = M.levels || {};
        M.menu = {
          items: [
            { key: "bloodvessel", name: "Blood Vessel", theme: "bloodvessel", difficulty: "easy", subtitle: "gentle flow", level: levels.bloodvessel },
            { key: "lungs", name: "Lungs", theme: "lungs", difficulty: "medium", subtitle: "branching currents", level: levels.lungs },
            { key: "mouse", name: "Inside Mouse", theme: "mouse", difficulty: "medium", subtitle: "tight turns", level: levels.mouse },
            { key: "nose", name: "Nose", theme: "nose", difficulty: "medium", subtitle: "curved passage", level: levels.nose },
            { key: "brain", name: "Brain", theme: "brain", difficulty: "hard", subtitle: "steep difficulty", level: levels.brain },
          ].filter(i => i.level)
        };
      }

      function getLevelIndex(level) {
        if (!level) return 1;
        if (typeof level.levelIndex === "number") return Math.max(1, level.levelIndex);
        const diff = (level.difficulty || "").toLowerCase();
        if (diff === "hard") return 3;
        if (diff === "medium") return 2;
        return 1;
      }

      function getWaveScalar(waveIndex) {
        return 1 + 0.05 * Math.floor((waveIndex || 0) / 3);
      }

      function scaleEnemyConfig(config, levelIndex, waveScalar) {
        const base = { ...config };
        if (base.hp != null) base.hp = Math.round(base.hp * levelIndex * waveScalar);
        if (base.speed != null) base.speed = base.speed * (1 + 0.03 * (levelIndex - 1));
        if (base.onDeathSpawn && base.onDeathSpawn.enemy) {
          base.onDeathSpawn = {
            ...base.onDeathSpawn,
            enemy: scaleEnemyConfig(base.onDeathSpawn.enemy, levelIndex, waveScalar)
          };
        }
        return base;
      }

      function startLevel(level) {
        M.level = level;
        M.state = "playing";

        const waypoints = M.level.path.map(p => W.gridToPixelCenter(p.x, p.y));
        M.levelWaypoints = waypoints;

        M.enemies = [];
        M.spawner = { active: true, waveIndex: 0, spawnedInWave: 0, spawnTimer: 0 };
        M.economy = { cash: 140 };
        M.player = { hp: 150, maxHp: 150 };
        M.stats = { kills: 0 };
        M.ui = M.ui || {};
        if (typeof M.ui.paletteVisible !== "boolean") M.ui.paletteVisible = true;

        if (M.towers.initForLevel) M.towers.initForLevel(M.level);

        if (!M.level.waves || M.level.waves.length === 0) {
          setStatus("GAME STARTED (no waves). Grid should still render.");
        } else {
          setStatus("GAME STARTED. Good luck.");
        }
      }

      function getBossConfig(levelIndex) {
        return {
          color: "#1e4b8f", // Titan Cyst
          tags: ["MOAB", "SHIELDED", "BOSS"],
          hp: Math.round(2200 * levelIndex),
          speed: 36,
          armor: 4,
          shield: 220,
          bounty: 140,
          leakDamage: 25,
          radius: 30,
          onDeathSpawn: { count: 2, enemy: { color: "#2f7ad1" } }
        };
      }

      function updateSpawner(dt) {
        const level = M.level;
        if (!level.waves || level.waves.length === 0) return;

        const sp = M.spawner;
        if (!sp.active) return;
        if (sp.waveIndex >= level.waves.length) { sp.active = false; return; }

        const wave = level.waves[sp.waveIndex];
        sp.spawnTimer += dt;

        const levelIndex = getLevelIndex(M.level);

        // Boss wave every 10 waves (10, 20, 30...)
        const isBossWave = ((sp.waveIndex + 1) % 10 === 0);
        if (isBossWave && sp.spawnedInWave === 0 && sp.spawnTimer >= 0) {
          const bossCfg = scaleEnemyConfig(getBossConfig(levelIndex), levelIndex, getWaveScalar(sp.waveIndex));
          const boss = M.enemy.create(bossCfg, M.levelWaypoints || []);
          M.enemies.push(boss);
          sp.spawnedInWave = wave.count; // treat boss as the wave
          return;
        }

        while (sp.spawnedInWave < wave.count && sp.spawnTimer >= wave.interval) {
          sp.spawnTimer -= wave.interval;

          if (!M.enemy.create) fail("MWD.enemy.create missing (enemy.js must expose enemy.create(config, waypoints))");
          const waveScalar = getWaveScalar(sp.waveIndex);
          const scaled = scaleEnemyConfig(wave.enemy || {}, levelIndex, waveScalar);
          const e = M.enemy.create(scaled, M.levelWaypoints || []);
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
        if (M.state !== "playing") return;
        updateSpawner(dt);
        if (M.enemy.updateAll) M.enemy.updateAll(dt);
        if (M.towers.update) M.towers.update(dt);
        if (M.player && M.player.hp <= 0) {
          M.state = "gameover";
          setStatus("GAME OVER");
        }
      }

      function draw(dtMs) {
        if (M.state === "menu") {
          if (M.render.drawMenu) M.render.drawMenu();
          return;
        }

        // If any of these are missing, it will throw and show ERROR.
        M.render.drawGrid();
        M.render.drawPath(M.levelWaypoints);
        M.render.drawTowers();
        M.render.drawBullets();
        if (M.render.drawEnemies) M.render.drawEnemies();
        M.render.drawHoverPreview();
        M.render.drawUI(dtMs);

        if (M.state === "gameover") {
          const ctx = M.ctx;
          ctx.fillStyle = "rgba(0,0,0,0.6)";
          ctx.fillRect(0, 0, M.world.WIDTH, M.world.HEIGHT);
          ctx.fillStyle = "#ffffff";
          ctx.font = "28px Arial";
          ctx.fillText("Game Over", 20, 60);
          ctx.font = "14px Arial";
          ctx.fillText("Click Back to Menu to try another map.", 20, 86);
        }
      }

      // Draw once immediately so you can SEE screen even before first RAF tick
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
          if (M.state === "playing") {
            setStatus(
              "GAME LOOP ACTIVE | frames: " + frames +
              " | enemies: " + (M.enemies ? M.enemies.length : 0) +
              " | towers: " + (M.towers && M.towers.state ? M.towers.state.towers.length : 0)
            );
          }
        }
      });

      loop.start();

      // Menu + UI interaction
      M.canvas.addEventListener("click", (evt) => {
        const rect = M.canvas.getBoundingClientRect();
        const x = (evt.clientX - rect.left) * (M.canvas.width / rect.width);
        const y = (evt.clientY - rect.top) * (M.canvas.height / rect.height);

        if (M.state === "menu") {
          const menu = M.menu || {};
          const boxes = menu.hitboxes || [];
          for (let i = 0; i < boxes.length; i++) {
            const b = boxes[i];
            if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
              if (b.level) startLevel(b.level);
              return;
            }
          }
          return;
        }

        if (M.state === "playing") {
          const ui = M.ui || {};
          const b = ui.backButton;
          if (b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
            M.state = "menu";
            setStatus("MENU: select a map");
            return;
          }
          const p = ui.paletteToggle;
          if (p && x >= p.x && x <= p.x + p.w && y >= p.y && y <= p.y + p.h) {
            M.ui = M.ui || {};
            M.ui.paletteVisible = !M.ui.paletteVisible;
            return;
          }
        }
      });
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
