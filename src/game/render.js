(function () {
  const M = window.MWD;

  function drawGrid() {
    const W = M.world;
    const ctx = M.ctx;

    ctx.fillStyle = "#ff00ff";
    ctx.fillRect(0, 0, W.WIDTH, W.HEIGHT);

    ctx.fillStyle = "#161616";
    ctx.fillRect(W.GRID_OFFSET_X, W.GRID_OFFSET_Y, W.COLS * W.TILE, W.ROWS * W.TILE);

    ctx.strokeStyle = "#262626";
    ctx.lineWidth = 1;

    for (let c = 0; c <= W.COLS; c++) {
      const x = W.GRID_OFFSET_X + c * W.TILE;
      ctx.beginPath();
      ctx.moveTo(x, W.GRID_OFFSET_Y);
      ctx.lineTo(x, W.GRID_OFFSET_Y + W.ROWS * W.TILE);
      ctx.stroke();
    }

    for (let r = 0; r <= W.ROWS; r++) {
      const y = W.GRID_OFFSET_Y + r * W.TILE;
      ctx.beginPath();
      ctx.moveTo(W.GRID_OFFSET_X, y);
      ctx.lineTo(W.GRID_OFFSET_X + W.COLS * W.TILE, y);
      ctx.stroke();
    }

    ctx.strokeStyle = "#333";
    ctx.strokeRect(W.GRID_OFFSET_X, W.GRID_OFFSET_Y, W.COLS * W.TILE, W.ROWS * W.TILE);
  }

  function drawPath(waypoints) {
    const W = M.world;
    const ctx = M.ctx;

    ctx.fillStyle = "#2a2a2a";
    for (const p of M.level.path) {
      const tl = W.gridToPixelTopLeft(p.x, p.y);
      ctx.fillRect(tl.x, tl.y, W.TILE, W.TILE);
    }

    ctx.strokeStyle = "#00ff88";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(waypoints[0].x, waypoints[0].y);
    for (let i = 1; i < waypoints.length; i++) ctx.lineTo(waypoints[i].x, waypoints[i].y);
    ctx.stroke();
  }

  // NEW: draw one enemy (internal helper)
  function drawEnemy(e) {
    const ctx = M.ctx;

    const r = (typeof e.r === "number") ? e.r : (e.radius || 14);

    ctx.fillStyle = "#ff5a5a";
    ctx.beginPath();
    ctx.arc(e.x, e.y, r, 0, Math.PI * 2);
    ctx.fill();

    // HP bar
    const barW = 34, barH = 6;
    const x = e.x - barW / 2;
    const y = e.y - r - 14;

    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(x, y, barW, barH);

    const hpMax = e.hpMax || 1;
    const pct = Math.max(0, e.hp) / hpMax;

    ctx.fillStyle = "#00ff88";
    ctx.fillRect(x, y, barW * pct, barH);
  }

  // NEW: draw all enemies from M.enemies
  function drawEnemies() {
    const enemies = M.enemies || [];
    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      if (!e || e.alive === false || e.reachedGoal) continue;
      drawEnemy(e);
    }
  }

  function drawTowers() {
    const ctx = M.ctx;
    const towers = M.towers.state.towers;

    // choose a simple "look-at" enemy for facing indicator (first alive enemy)
    const enemies = M.enemies || [];
    let lookEnemy = null;
    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      if (e && e.alive !== false && !e.reachedGoal) {
        lookEnemy = e;
        break;
      }
    }

    for (const t of towers) {
      ctx.fillStyle = "#4aa3ff";
      ctx.beginPath();
      ctx.arc(t.x, t.y, 12, 0, Math.PI * 2);
      ctx.fill();

      // facing indicator (toward first enemy if any)
      if (lookEnemy) {
        const dx = lookEnemy.x - t.x;
        const dy = lookEnemy.y - t.y;
        const dist = Math.hypot(dx, dy);

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(t.x, t.y);
        if (dist > 0) ctx.lineTo(t.x + (dx / dist) * 16, t.y + (dy / dist) * 16);
        ctx.stroke();
      }
    }
  }

  function drawBullets() {
    const ctx = M.ctx;
    ctx.fillStyle = "#ffe36e";
    for (const b of M.towers.state.bullets) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawHoverPreview() {
    const W = M.world;
    const ctx = M.ctx;
    const h = M.towers.state.hover;

    if (!W.isInGrid(h.gx, h.gy)) return;

    const tl = W.gridToPixelTopLeft(h.gx, h.gy);
    ctx.fillStyle = h.valid ? "rgba(0,255,136,0.15)" : "rgba(255,90,90,0.15)";
    ctx.fillRect(tl.x, tl.y, W.TILE, W.TILE);

    if (h.valid) {
      const c = W.gridToPixelCenter(h.gx, h.gy);
      ctx.strokeStyle = "rgba(0,255,136,0.35)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(c.x, c.y, M.towers.TOWER_RANGE, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function drawUI(dtMs) {
    const ctx = M.ctx;
    ctx.fillStyle = "#ffffff";
    ctx.font = "14px Arial";

    const enemies = M.enemies || [];
    const aliveCount = enemies.filter(e => e && e.alive !== false && !e.reachedGoal).length;

    const sp = M.spawner || { active: false, waveIndex: 0, spawnedInWave: 0 };
    const level = M.level || {};
    const totalWaves = (level.waves && level.waves.length) ? level.waves.length : 0;
    const waveNum = totalWaves > 0 ? Math.min(sp.waveIndex + 1, totalWaves) : 0;

    ctx.fillText("Click to place towers. Towers auto-shoot in range.", 12, 20);
    ctx.fillText(`towers: ${M.towers.state.towers.length}`, 12, 40);
    ctx.fillText(`bullets: ${M.towers.state.bullets.length}`, 12, 60);
    ctx.fillText(`enemies alive: ${aliveCount}`, 12, 80);

    if (totalWaves > 0) {
      ctx.fillText(`wave: ${waveNum}/${totalWaves} (${sp.active ? "active" : "stopped"})`, 12, 100);
      ctx.fillText(`spawned this wave: ${sp.spawnedInWave}`, 12, 120);
      ctx.fillText(`dt: ${dtMs.toFixed(1)} ms`, 12, 140);
    } else {
      ctx.fillText(`dt: ${dtMs.toFixed(1)} ms`, 12, 100);
    }
  }

  M.render = {
    drawGrid,
    drawPath,
    drawEnemies,       // NEW: call this instead of drawEnemy
    drawTowers,
    drawBullets,
    drawHoverPreview,
    drawUI,
  };
})();
