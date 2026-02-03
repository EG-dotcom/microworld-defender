(function () {
  const M = window.MWD;
  let flowPhase = 0;

  function getTheme() {
    const level = M.level || {};
    const theme = level.theme || "default";
    const themes = {
      bloodvessel: {
        bg: "#2a0a0f",
        grid: "#3a1217",
        path: "#5a1e2a",
        pathLine: "#ff4d6d"
      },
      lungs: {
        bg: "#0b2330",
        grid: "#123342",
        path: "#1e3f4f",
        pathLine: "#7ce2ff"
      },
      nose: {
        bg: "#2a1f0f",
        grid: "#3a2a13",
        path: "#5a3a1d",
        pathLine: "#ffd36e"
      },
      mouse: {
        bg: "#241026",
        grid: "#3a163d",
        path: "#4a1f4e",
        pathLine: "#ff8bd1"
      },
      brain: {
        bg: "#120d2b",
        grid: "#1c1240",
        path: "#2a1b55",
        pathLine: "#b18cff"
      },
      default: {
        bg: "#0f0f0f",
        grid: "#161616",
        path: "#2a2a2a",
        pathLine: "#00ff88"
      }
    };
    return themes[theme] || themes.default;
  }

  function drawBloodVesselBackground(ctx, W) {
    // Deep red channel with soft gradients and subtle cell dots
    const g = ctx.createLinearGradient(0, 0, 0, W.HEIGHT);
    g.addColorStop(0, "#3a0c12");
    g.addColorStop(0.5, "#2a0a0f");
    g.addColorStop(1, "#1b070b");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W.WIDTH, W.HEIGHT);

    // Vessel walls
    ctx.fillStyle = "rgba(255, 120, 120, 0.12)";
    ctx.fillRect(0, 0, W.WIDTH, 18);
    ctx.fillRect(0, W.HEIGHT - 18, W.WIDTH, 18);

    // Floating cells
    ctx.fillStyle = "rgba(255, 160, 160, 0.18)";
    for (let i = 0; i < 18; i++) {
      const x = 20 + (i * 47) % (W.WIDTH - 40);
      const y = 30 + (i * 83) % (W.HEIGHT - 60);
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawLungsBackground(ctx, W) {
    const g = ctx.createRadialGradient(W.WIDTH * 0.3, W.HEIGHT * 0.3, 40, W.WIDTH * 0.5, W.HEIGHT * 0.5, W.WIDTH);
    g.addColorStop(0, "#15343f");
    g.addColorStop(1, "#0b1f26");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W.WIDTH, W.HEIGHT);

    // Alveoli bubbles
    ctx.strokeStyle = "rgba(140, 230, 240, 0.18)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 26; i++) {
      const x = 30 + (i * 53) % (W.WIDTH - 60);
      const y = 30 + (i * 71) % (W.HEIGHT - 60);
      const r = 10 + (i % 4) * 4;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function drawNoseBackground(ctx, W) {
    const g = ctx.createLinearGradient(0, 0, 0, W.HEIGHT);
    g.addColorStop(0, "#3a2a13");
    g.addColorStop(1, "#1f160b");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W.WIDTH, W.HEIGHT);

    // Wavy mucus bands
    ctx.strokeStyle = "rgba(255, 210, 140, 0.2)";
    ctx.lineWidth = 3;
    for (let k = 0; k < 5; k++) {
      ctx.beginPath();
      for (let x = 0; x <= W.WIDTH; x += 20) {
        const y = 30 + k * 30 + Math.sin((x + k * 40) * 0.05) * 8;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }

  function drawMouseBackground(ctx, W) {
    const g = ctx.createLinearGradient(0, 0, 0, W.HEIGHT);
    g.addColorStop(0, "#2a1230");
    g.addColorStop(1, "#1a0b1f");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W.WIDTH, W.HEIGHT);

    // Subtle lattice lines
    ctx.strokeStyle = "rgba(255, 160, 210, 0.12)";
    ctx.lineWidth = 1;
    for (let x = 20; x < W.WIDTH; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x - 10, W.HEIGHT - 20);
      ctx.stroke();
    }
  }

  function drawBrainBackground(ctx, W) {
    const g = ctx.createRadialGradient(W.WIDTH * 0.6, W.HEIGHT * 0.4, 40, W.WIDTH * 0.5, W.HEIGHT * 0.5, W.WIDTH);
    g.addColorStop(0, "#22164a");
    g.addColorStop(1, "#120b2a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W.WIDTH, W.HEIGHT);

    // Neuro lines
    ctx.strokeStyle = "rgba(180, 140, 255, 0.18)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 10; i++) {
      const x = 40 + i * 60;
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x + 20, W.HEIGHT - 20);
      ctx.stroke();
    }
  }

  function drawGrid() {
    const W = M.world;
    const ctx = M.ctx;
    const theme = getTheme();

    if ((M.level && M.level.theme) === "bloodvessel") drawBloodVesselBackground(ctx, W);
    else if ((M.level && M.level.theme) === "lungs") drawLungsBackground(ctx, W);
    else if ((M.level && M.level.theme) === "nose") drawNoseBackground(ctx, W);
    else if ((M.level && M.level.theme) === "mouse") drawMouseBackground(ctx, W);
    else if ((M.level && M.level.theme) === "brain") drawBrainBackground(ctx, W);
    else {
      ctx.fillStyle = theme.bg;
      ctx.fillRect(0, 0, W.WIDTH, W.HEIGHT);
    }

    // Soft rounded playfield instead of hard grid lines (cartoon vibe)
    const g = ctx.createLinearGradient(0, W.GRID_OFFSET_Y, 0, W.GRID_OFFSET_Y + W.ROWS * W.TILE);
    g.addColorStop(0, theme.grid);
    g.addColorStop(1, "rgba(8,10,12,0.4)");
    ctx.fillStyle = g;
    ctx.beginPath();
    const radius = 16;
    const x0 = W.GRID_OFFSET_X;
    const y0 = W.GRID_OFFSET_Y;
    const w = W.COLS * W.TILE;
    const h = W.ROWS * W.TILE;
    ctx.moveTo(x0 + radius, y0);
    ctx.lineTo(x0 + w - radius, y0);
    ctx.quadraticCurveTo(x0 + w, y0, x0 + w, y0 + radius);
    ctx.lineTo(x0 + w, y0 + h - radius);
    ctx.quadraticCurveTo(x0 + w, y0 + h, x0 + w - radius, y0 + h);
    ctx.lineTo(x0 + radius, y0 + h);
    ctx.quadraticCurveTo(x0, y0 + h, x0, y0 + h - radius);
    ctx.lineTo(x0, y0 + radius);
    ctx.quadraticCurveTo(x0, y0, x0 + radius, y0);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function drawPath(waypoints) {
    const W = M.world;
    const ctx = M.ctx;
    const theme = getTheme();

    // Draw a thick, rounded "flow ribbon" instead of tiles
    ctx.strokeStyle = theme.path;
    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(waypoints[0].x, waypoints[0].y);
    for (let i = 1; i < waypoints.length; i++) ctx.lineTo(waypoints[i].x, waypoints[i].y);
    ctx.stroke();

    // Inner highlight line for cartoon depth
    ctx.strokeStyle = theme.pathLine;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(waypoints[0].x, waypoints[0].y);
    for (let i = 1; i < waypoints.length; i++) ctx.lineTo(waypoints[i].x, waypoints[i].y);
    ctx.stroke();

    // Animated flow dots (theme-colored)
    flowPhase += 0.02;
    let flowColor = "rgba(255,255,255,0.25)";
    const themeKey = (M.level && M.level.theme) || "default";
    if (themeKey === "bloodvessel") flowColor = "rgba(255,120,120,0.35)";
    if (themeKey === "lungs") flowColor = "rgba(140,230,240,0.28)";
    if (themeKey === "nose") flowColor = "rgba(255,220,160,0.28)";
    if (themeKey === "mouse") flowColor = "rgba(255,160,210,0.28)";
    if (themeKey === "brain") flowColor = "rgba(180,140,255,0.28)";
    ctx.fillStyle = flowColor;
    for (let i = 0; i < waypoints.length - 1; i++) {
      const a = waypoints[i];
      const b = waypoints[i + 1];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const segLen = Math.hypot(dx, dy);
      const steps = Math.max(1, Math.floor(segLen / 24));
      for (let s = 0; s < steps; s++) {
        const t = (s / steps + (flowPhase % 1)) % 1;
        const x = a.x + dx * t;
        const y = a.y + dy * t;
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function isStealthed(e) {
    return Array.isArray(e.tags) && e.tags.includes("STEALTH");
  }

  // NEW: draw one enemy (internal helper)
  function drawEnemy(e) {
    const ctx = M.ctx;

    const r = (typeof e.r === "number") ? e.r : (e.radius || 14);

    if (isStealthed(e) && !(e.revealedTimer > 0)) return;

    const base = e.color || "#ff5a5a";
    const tags = Array.isArray(e.tags) ? e.tags : [];
    const t = performance.now() * 0.004;
    const wobble = Math.sin(t + e.x * 0.03 + e.y * 0.02) * 1.5;
    const ex = e.x + wobble;
    const ey = e.y + Math.cos(t * 1.3 + e.y * 0.02) * 1.2;

    // Enemies: spiky/squishy blobs to avoid "blood cell" look
    ctx.fillStyle = base;
    ctx.beginPath();
    if (tags.includes("FAST")) {
      // Spiky virus
      const spikes = 8;
      for (let i = 0; i <= spikes; i++) {
        const a = (i / spikes) * Math.PI * 2;
        const rr = (i % 2 === 0) ? r : r * 0.65;
        const x = ex + Math.cos(a) * rr;
        const y = ey + Math.sin(a) * rr;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
    } else if (tags.includes("MOAB")) {
      // Encapsulated cyst capsule
      const w = r * 1.6;
      const h = r * 1.1;
      ctx.moveTo(ex - w / 2 + h / 2, ey - h / 2);
      ctx.lineTo(ex + w / 2 - h / 2, ey - h / 2);
      ctx.arc(ex + w / 2 - h / 2, ey, h / 2, -Math.PI / 2, Math.PI / 2);
      ctx.lineTo(ex - w / 2 + h / 2, ey + h / 2);
      ctx.arc(ex - w / 2 + h / 2, ey, h / 2, Math.PI / 2, -Math.PI / 2);
      ctx.closePath();
    } else if (tags.includes("ARMORED")) {
      // Chunky hex cell
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const x = ex + Math.cos(a) * r;
        const y = ey + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
    } else {
      // Irregular blob
      ctx.arc(ex, ey, r, 0, Math.PI * 2);
    }
    ctx.fill();

    ctx.strokeStyle = "rgba(0,0,0,0.4)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Highlight
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.beginPath();
    ctx.arc(ex - r * 0.25, ey - r * 0.25, r * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Decals
    if (tags.includes("ARMORED")) {
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(ex + Math.cos(a) * (r * 0.6), ey + Math.sin(a) * (r * 0.6), 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (tags.includes("SPAWNER")) {
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + t;
        ctx.beginPath();
        ctx.arc(ex + Math.cos(a) * (r * 0.8), ey + Math.sin(a) * (r * 0.8), 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (tags.includes("MOAB")) {
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ex - r * 0.3, ey, r * 0.35, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (tags.includes("ELITE") || tags.includes("BOSS")) {
      ctx.fillStyle = "rgba(255, 210, 90, 0.9)";
      ctx.beginPath();
      ctx.moveTo(ex - 6, ey - r - 4);
      ctx.lineTo(ex - 2, ey - r - 10);
      ctx.lineTo(ex + 2, ey - r - 4);
      ctx.lineTo(ex + 6, ey - r - 10);
      ctx.lineTo(ex + 10, ey - r - 4);
      ctx.lineTo(ex + 10, ey - r + 2);
      ctx.lineTo(ex - 6, ey - r + 2);
      ctx.closePath();
      ctx.fill();
    }

    // Stealth shimmer ring
    if (tags.includes("STEALTH")) {
      ctx.strokeStyle = "rgba(180,140,255,0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ex, ey, r + 3, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (e.shield && e.shield > 0) {
      ctx.strokeStyle = "#7d5cff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ex, ey, r + 3, 0, Math.PI * 2);
      ctx.stroke();
    }

    // HP bar (slight follow)
    const barW = 34, barH = 6;
    const x = ex - barW / 2;
    const y = ey - r - 14;

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
    const selectedIdx = M.towers.getSelectedIndex ? M.towers.getSelectedIndex() : -1;

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

    function drawCellBase(x, y, r, fill, stroke) {
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.beginPath();
      ctx.arc(x - r * 0.25, y - r * 0.25, r * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < towers.length; i++) {
      const t = towers[i];
      const color = t.color || "#4aa3ff";

      if (t.type === "net_trap") {
        drawCellBase(t.x, t.y, 9, "#9af6d9", "rgba(0,0,0,0.35)");
        // Web rings
        ctx.strokeStyle = "rgba(255,255,255,0.7)";
        ctx.lineWidth = 1.5;
        for (let k = 0; k < 3; k++) {
          ctx.beginPath();
          ctx.arc(t.x, t.y, 5 + k * 5, 0, Math.PI * 2);
          ctx.stroke();
        }
        // Effect radius hint
        ctx.strokeStyle = "rgba(255,255,255,0.25)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.effectRadius || 40, 0, Math.PI * 2);
        ctx.stroke();
        if (i === selectedIdx) {
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(t.x, t.y, 14, 0, Math.PI * 2);
          ctx.stroke();
        }
        continue;
      }

      if (t.type === "dendritic") {
        drawCellBase(t.x, t.y, 12, "#c3b2ff", "rgba(0,0,0,0.35)");
        // Spiky dendrites
        ctx.strokeStyle = "rgba(255,255,255,0.55)";
        ctx.lineWidth = 2;
        for (let k = 0; k < 6; k++) {
          const a = (Math.PI * 2 * k) / 6;
          ctx.beginPath();
          ctx.moveTo(t.x + Math.cos(a) * 12, t.y + Math.sin(a) * 12);
          ctx.lineTo(t.x + Math.cos(a) * 18, t.y + Math.sin(a) * 18);
          ctx.stroke();
        }
        ctx.strokeStyle = "rgba(255,255,255,0.35)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.auraRadius || 120, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Base cell body
        drawCellBase(t.x, t.y, 11, color, "rgba(0,0,0,0.35)");

        if (t.type === "neutrophil") {
          ctx.strokeStyle = "rgba(255,255,255,0.8)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(t.x, t.y, 4, 0, Math.PI * 2);
          ctx.stroke();
        } else if (t.type === "macrophage") {
          ctx.strokeStyle = "rgba(0,0,0,0.4)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(t.x - 6, t.y + 2);
          ctx.lineTo(t.x + 6, t.y + 2);
          ctx.stroke();
        } else if (t.type === "antibody") {
          ctx.strokeStyle = "rgba(255,255,255,0.9)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(t.x, t.y - 6);
          ctx.lineTo(t.x - 5, t.y + 4);
          ctx.moveTo(t.x, t.y - 6);
          ctx.lineTo(t.x + 5, t.y + 4);
          ctx.stroke();
        } else if (t.type === "cytotoxic") {
          ctx.strokeStyle = "rgba(255,255,255,0.9)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(t.x - 6, t.y - 6);
          ctx.lineTo(t.x + 6, t.y + 6);
          ctx.moveTo(t.x + 6, t.y - 6);
          ctx.lineTo(t.x - 6, t.y + 6);
          ctx.stroke();
        }
      }

      // facing indicator (toward first enemy if any)
      if (lookEnemy && t.type !== "net_trap" && t.type !== "dendritic") {
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

      if (i === selectedIdx) {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(t.x, t.y, 16, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  function drawBullets() {
    const ctx = M.ctx;
    for (const b of M.towers.state.bullets) {
      ctx.fillStyle = "#ffe36e";
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
      const sel = M.towers.getSelected ? M.towers.getSelected() : null;
      const range = sel ? (sel.range || sel.effectRadius || sel.auraRadius || 0) : 0;
      const c = W.gridToPixelCenter(h.gx, h.gy);
      ctx.strokeStyle = "rgba(0,255,136,0.35)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (range > 0) ctx.arc(c.x, c.y, range, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function drawUI(dtMs) {
    const ctx = M.ctx;
    ctx.fillStyle = "#ffffff";
    ctx.font = "14px Arial";

    const sp = M.spawner || { active: false, waveIndex: 0, spawnedInWave: 0 };
    const level = M.level || {};
    const totalWaves = (level.waves && level.waves.length) ? level.waves.length : 0;
    const waveNum = totalWaves > 0 ? Math.min(sp.waveIndex + 1, totalWaves) : 0;

    const sel = M.towers.getSelected ? M.towers.getSelected() : null;
    const selName = sel ? sel.name : "Unknown";
    ctx.fillText("Drag a tower to the grid. Q/E upgrades, F targeting, X sell, P toggle.", 12, 20);
    ctx.fillText(`immunomoney: ${Math.floor((M.economy && M.economy.cash) || 0)}`, 12, 44);
    ctx.fillText(`HP: ${Math.max(0, Math.floor((M.player && M.player.hp) || 0))}/${(M.player && M.player.maxHp) || 0}`, 12, 64);
    ctx.fillText(`kills: ${Math.floor((M.stats && M.stats.kills) || 0)}`, 12, 84);
    ctx.fillText(`selected: ${selName}`, 12, 104);

    // Back to menu button
    const btn = { x: M.world.WIDTH - 140, y: 12, w: 120, h: 28 };
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(btn.x, btn.y, btn.w, btn.h);
    ctx.strokeStyle = "#2a2a2a";
    ctx.strokeRect(btn.x, btn.y, btn.w, btn.h);
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Back to Menu", btn.x + 10, btn.y + 19);
    M.ui = M.ui || {};
    M.ui.backButton = btn;

    // Tower palette (drag & drop)
    const paletteX = M.world.WIDTH - 200;
    const paletteY = 70;
    const cardW = 180;
    const cardH = 46;
    const gap = 10;
    const defs = (M.towers && M.towers.TOWER_DEFS) ? M.towers.TOWER_DEFS : [];
    M.ui = M.ui || {};
    M.ui.palette = [];

    const palVisible = M.ui.paletteVisible !== false;
    const toggle = { x: paletteX, y: 36, w: 180, h: 24 };
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(toggle.x, toggle.y, toggle.w, toggle.h);
    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    ctx.strokeRect(toggle.x, toggle.y, toggle.w, toggle.h);
    ctx.fillStyle = "#ffffff";
    ctx.font = "12px Arial";
    ctx.fillText(palVisible ? "Towers ▾" : "Towers ▸", toggle.x + 10, toggle.y + 16);
    M.ui.paletteToggle = toggle;

    if (palVisible) {
      ctx.fillText("Towers", paletteX, paletteY - 12);

      for (let i = 0; i < defs.length; i++) {
        const d = defs[i];
        const x = paletteX;
        const y = paletteY + i * (cardH + gap);

        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fillRect(x, y, cardW, cardH);
        ctx.strokeStyle = "rgba(255,255,255,0.22)";
        ctx.strokeRect(x, y, cardW, cardH);

        ctx.fillStyle = d.color || "#ffffff";
        ctx.beginPath();
        ctx.arc(x + 18, y + 23, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.4)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "12px Arial";
        ctx.fillText(d.name, x + 36, y + 18);
        ctx.fillStyle = "#f7c46a";
        ctx.fillText(`$${d.cost}`, x + 36, y + 34);

        M.ui.palette.push({ id: d.id, x, y, w: cardW, h: cardH });
      }
    }

    ctx.font = "14px Arial";

    const drag = M.towers.getDragState ? M.towers.getDragState() : null;
    if (drag && drag.active && drag.type) {
      const d = (M.towers.TOWER_DEFS || []).find(t => t.id === drag.type);
      if (d) {
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = d.color || "#ffffff";
        ctx.beginPath();
        ctx.arc(drag.x, drag.y, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.35)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    const selTower = M.towers.getSelectedTower ? M.towers.getSelectedTower() : null;
    if (selTower) {
      // Tooltip panel (selected only)
      const panelX = 240;
      const panelY = 20;
      const panelW = 260;
      const panelH = 190;
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillRect(panelX, panelY, panelW, panelH);
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.strokeRect(panelX, panelY, panelW, panelH);

      ctx.fillStyle = "#ffffff";
      ctx.font = "12px Arial";
      const lines = [];
      lines.push(`${selTower.name || selTower.type}`);
      lines.push(`Cost: $${selTower.totalCost || 0}`);
      if (selTower.range) lines.push(`Range: ${Math.round(selTower.range)} px`);
      if (selTower.fireRate) lines.push(`Rate: ${selTower.fireRate.toFixed(2)} /s`);
      if (selTower.dmg) lines.push(`Damage: ${Math.round(selTower.dmg)}`);
      if (selTower.onHit && selTower.onHit.slowPct) {
        lines.push(`Slow: ${Math.round(selTower.onHit.slowPct * 100)}% for ${selTower.onHit.slowDur || 0}s`);
      }
      if (selTower.onHit && selTower.onHit.markPct) {
        lines.push(`Mark: +${Math.round(selTower.onHit.markPct * 100)}% for ${selTower.onHit.markDur || 0}s`);
      }
      if (selTower.damageType) lines.push(`Damage: ${selTower.damageType}`);
      if (selTower.auraRadius) lines.push(`Aura: ${Math.round(selTower.auraRadius)} px`);
      if (selTower.effectRadius) lines.push(`Effect: ${Math.round(selTower.effectRadius)} px`);
      lines.push(`Upgrades: A${selTower.upgrades.pathA} / B${selTower.upgrades.pathB}`);
      lines.push(`Targeting: ${selTower.targetMode || "first"} (F to cycle)`);

      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], panelX + 10, panelY + 20 + i * 14);
      }

      if (M.towers.getUpgradeInfo) {
        const upA = M.towers.getUpgradeInfo(selTower, "pathA");
        const upB = M.towers.getUpgradeInfo(selTower, "pathB");
        const lockA = selTower.upgrades.pathB > 0;
        const lockB = selTower.upgrades.pathA > 0;
        const y = panelY + panelH - 48;
        ctx.fillText(`Upgrade (Q): ${lockA ? "LOCKED" : (upA ? ("$" + upA.cost) : "MAX")}`, panelX + 10, y);
        ctx.fillText(`Upgrade (E): ${lockB ? "LOCKED" : (upB ? ("$" + upB.cost) : "MAX")}`, panelX + 10, y + 18);
        if (M.towers.getRefundAmount) {
          ctx.fillText(`Sell (X): $${M.towers.getRefundAmount(selTower)}`, panelX + 10, y + 36);
        }
      }
      ctx.font = "14px Arial";
    }

    if (totalWaves > 0) {
      const bossWave = ((sp.waveIndex + 1) % 10 === 0);
      ctx.fillText(`wave: ${waveNum}/${totalWaves}${bossWave ? " (boss)" : ""}`, 12, 330);
    }
  }

  function getThemePalette(themeKey) {
    const saved = M.level;
    const level = { theme: themeKey };
    M.level = level;
    const pal = getTheme();
    M.level = saved;
    return pal;
  }

  function drawMenu() {
    const W = M.world;
    const ctx = M.ctx;
    const theme = getTheme();

    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, W.WIDTH, W.HEIGHT);

    ctx.fillStyle = "#ffffff";
    ctx.font = "24px Arial";
    ctx.fillText("MicroWorld Defender", 20, 36);
    ctx.font = "14px Arial";
    ctx.fillText("Select a map:", 20, 60);

    const menu = M.menu || { items: [] };
    const items = menu.items || [];
    const startX = 20;
    const startY = 90;
    const cardW = 210;
    const cardH = 90;
    const gap = 16;

    menu.hitboxes = [];

    for (let i = 0; i < items.length; i++) {
      const row = Math.floor(i / 2);
      const col = i % 2;
      const x = startX + col * (cardW + gap);
      const y = startY + row * (cardH + gap);

      const palette = items[i].palette || getThemePalette(items[i].theme) || theme;
      ctx.fillStyle = palette.bg;
      ctx.fillRect(x, y, cardW, cardH);
      ctx.strokeStyle = "#2a2a2a";
      ctx.strokeRect(x, y, cardW, cardH);

      ctx.fillStyle = palette.pathLine || "#ffffff";
      ctx.font = "16px Arial";
      ctx.fillText(items[i].name, x + 10, y + 26);

      ctx.fillStyle = "#ffffff";
      ctx.font = "12px Arial";
      ctx.fillText(items[i].difficulty || "normal", x + 10, y + 48);
      ctx.fillText(items[i].subtitle || items[i].theme, x + 10, y + 66);

      // tiny path line accent
      ctx.strokeStyle = palette.pathLine || "#ffffff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + 10, y + cardH - 16);
      ctx.lineTo(x + cardW - 10, y + cardH - 16);
      ctx.stroke();

      menu.hitboxes.push({ x, y, w: cardW, h: cardH, level: items[i].level });
    }

    M.menu = menu;
  }

  M.render = {
    drawGrid,
    drawPath,
    drawEnemies,       // NEW: call this instead of drawEnemy
    drawTowers,
    drawBullets,
    drawHoverPreview,
    drawUI,
    drawMenu,
  };
})();
