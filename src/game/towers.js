(function () {
  if (!window.MWD || typeof window.MWD !== "object") window.MWD = {};
  const M = window.MWD;

  const TOWER_RANGE = 140;
  const TOWER_FIRE_RATE = 2.0; // shots/sec
  const TOWER_DMG = 10;
  const BULLET_SPEED = 420;

  const state = {
    towers: [],
    bullets: [],
    hover: { gx: -1, gy: -1, valid: false },
  };

  let mouseAttached = false;

  function buildPathSet(path) {
    return new Set(path.map(p => `${p.x},${p.y}`));
  }

  function canPlaceTower(gx, gy) {
    const W = M.world;
    if (!W || !W.isInGrid(gx, gy)) return false;
    if (M._pathSet && M._pathSet.has(`${gx},${gy}`)) return false;
    for (const t of state.towers) if (t.gx === gx && t.gy === gy) return false;
    return true;
  }

  function placeTower(gx, gy) {
    if (!canPlaceTower(gx, gy)) return false;
    const c = M.world.gridToPixelCenter(gx, gy);
    state.towers.push({
      gx, gy,
      x: c.x, y: c.y,
      range: TOWER_RANGE,
      fireRate: TOWER_FIRE_RATE,
      cooldown: 0,
      dmg: TOWER_DMG,
    });
    return true;
  }

  // Pick a target from M.enemies (prefer further along path, then closer)
  function pickTargetInRange(t) {
    const enemies = M.enemies || [];
    if (enemies.length === 0) return null;

    let best = null;
    let bestScore = -Infinity;

    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      if (!e || e.alive === false || e.reachedGoal) continue;

      const dx = e.x - t.x;
      const dy = e.y - t.y;
      const d2 = dx * dx + dy * dy;

      if (d2 > t.range * t.range) continue;

      const wp = (typeof e.wpIndex === "number") ? e.wpIndex : 0;
      const score = (wp * 100000) - d2; // progress dominates, then distance
      if (score > bestScore) {
        bestScore = score;
        best = e;
      }
    }

    return best;
  }

  function towerTryShoot(t, dt) {
    t.cooldown = Math.max(0, t.cooldown - dt);

    const enemy = pickTargetInRange(t);
    if (!enemy) return;

    const dx = enemy.x - t.x;
    const dy = enemy.y - t.y;
    const dist = Math.hypot(dx, dy);

    if (dist > t.range) return;
    if (t.cooldown > 0) return;
    if (dist <= 0.0001) return;

    const nx = dx / dist;
    const ny = dy / dist;

    state.bullets.push({
      x: t.x,
      y: t.y,
      vx: nx * BULLET_SPEED,
      vy: ny * BULLET_SPEED,
      r: 4,
      dmg: t.dmg,
    });

    t.cooldown = 1 / t.fireRate;
  }

  // Bullets collide with ANY enemy
  function updateBullets(dt) {
    const W = M.world;
    const enemies = M.enemies || [];

    for (let i = state.bullets.length - 1; i >= 0; i--) {
      const b = state.bullets[i];
      b.x += b.vx * dt;
      b.y += b.vy * dt;

      // Try hit an enemy
      let hit = false;

      for (let j = 0; j < enemies.length; j++) {
        const e = enemies[j];
        if (!e || e.alive === false || e.reachedGoal) continue;

        // Support both `r` (new enemy.js) and `radius` (old enemy code)
        const er = (typeof e.r === "number") ? e.r : (e.radius || 14);

        const dx = e.x - b.x;
        const dy = e.y - b.y;
        const dist = Math.hypot(dx, dy);

        if (dist <= er + b.r) {
          // Support both APIs:
          // - new enemy.js: e.damage(amount)
          // - old enemy.js: M.enemy.damageEnemy(enemy, waypoints, dmg)
          if (e.damage) {
            e.damage(b.dmg);
          } else if (M.enemy && M.enemy.damageEnemy) {
            M.enemy.damageEnemy(e, M.levelWaypoints || [], b.dmg);
          }

          state.bullets.splice(i, 1);
          hit = true;
          break;
        }
      }

      if (hit) continue;

      // Out of bounds cleanup
      if (b.x < -50 || b.x > W.WIDTH + 50 || b.y < -50 || b.y > W.HEIGHT + 50) {
        state.bullets.splice(i, 1);
      }
    }
  }

  function update(dt) {
    for (let i = 0; i < state.towers.length; i++) towerTryShoot(state.towers[i], dt);
    updateBullets(dt);
  }

  // Mouse helpers
  function getMousePos(evt) {
    const rect = M.canvas.getBoundingClientRect();
    return {
      x: (evt.clientX - rect.left) * (M.canvas.width / rect.width),
      y: (evt.clientY - rect.top) * (M.canvas.height / rect.height),
    };
  }

  function updateHover(evt) {
    const W = M.world;
    const m = getMousePos(evt);
    const g = W.pixelToGrid(m.x, m.y);
    state.hover.gx = g.x;
    state.hover.gy = g.y;
    state.hover.valid = canPlaceTower(g.x, g.y);
  }

  function attachMouse() {
    if (mouseAttached) return;
    if (!M.canvas) return;
    mouseAttached = true;

    M.canvas.addEventListener("mousemove", (evt) => {
      updateHover(evt);
    });

    M.canvas.addEventListener("mouseleave", () => {
      state.hover.gx = -1;
      state.hover.gy = -1;
      state.hover.valid = false;
    });

    M.canvas.addEventListener("click", (evt) => {
      updateHover(evt);
      if (state.hover.valid) placeTower(state.hover.gx, state.hover.gy);
      state.hover.valid = canPlaceTower(state.hover.gx, state.hover.gy);
    });
  }

  function initForLevel(level) {
    state.towers = [];
    state.bullets = [];
    state.hover = { gx: -1, gy: -1, valid: false };
    M._pathSet = buildPathSet((level && level.path) ? level.path : []);
    attachMouse();
  }

  M.towers = {
    state,
    TOWER_RANGE,
    TOWER_FIRE_RATE,
    TOWER_DMG,
    BULLET_SPEED,
    canPlaceTower,
    placeTower,
    initForLevel,
    update,
  };
})();
