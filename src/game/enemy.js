// src/game/enemy.js
(function () {
  window.MWD = window.MWD || {};

  function createEnemy(config, waypoints) {
    const hpMax = config.hp || 30;

    return {
      x: waypoints[0].x,
      y: waypoints[0].y,
      r: config.radius || 14,

      speed: config.speed || 90,

      hpMax: hpMax,
      hp: hpMax,

      wp: waypoints,
      wpIndex: 0,

      alive: true,
      reachedGoal: false,

      update(dt) {
        if (!this.alive || this.reachedGoal) return;

        const next = this.wp[this.wpIndex + 1];
        if (!next) {
          this.reachedGoal = true;
          return;
        }

        const dx = next.x - this.x;
        const dy = next.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 0.0001) {
          this.wpIndex++;
          return;
        }

        const step = this.speed * dt;
        if (step >= dist) {
          this.x = next.x;
          this.y = next.y;
          this.wpIndex++;
        } else {
          this.x += (dx / dist) * step;
          this.y += (dy / dist) * step;
        }
      },

      damage(amount) {
        if (!this.alive) return;
        this.hp -= amount;
        if (this.hp <= 0) {
          this.hp = 0;
          this.alive = false;
        }
      }
    };
  }

  function updateAll(dt) {
    const enemies = MWD.enemies || [];
    for (let i = 0; i < enemies.length; i++) enemies[i].update(dt);

    // Remove dead + reachedGoal enemies
    MWD.enemies = enemies.filter(e => e.alive && !e.reachedGoal);
  }

  function drawAll(ctx) {
    const enemies = MWD.enemies || [];
    for (let i = 0; i < enemies.length; i++) drawEnemy(ctx, enemies[i]);
  }

  function drawEnemy(ctx, e) {
    // Body
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
    ctx.fillStyle = "#b23b3b";
    ctx.fill();

    // HP bar
    const w = 34, h = 6;
    const x = e.x - w / 2;
    const y = e.y - e.r - 14;

    ctx.fillStyle = "#222";
    ctx.fillRect(x, y, w, h);

    const p = e.hpMax > 0 ? (e.hp / e.hpMax) : 0;
    ctx.fillStyle = "#4aa84a";
    ctx.fillRect(x + 1, y + 1, Math.max(0, (w - 2) * p), h - 2);
  }

  MWD.enemy = {
    create: createEnemy,
    updateAll: updateAll,
    drawAll: drawAll
  };
})();
