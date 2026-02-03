// src/game/enemy.js
(function () {
  window.MWD = window.MWD || {};

  function getDamageTypeMultiplier(tags, type) {
    const t = Array.isArray(tags) ? tags : [];
    // Simple, readable affinities (tune later)
    if (type === "physical") {
      if (t.includes("ARMORED")) return 0.7;
      if (t.includes("MOAB")) return 0.6;
    } else if (type === "chemical") {
      if (t.includes("SWARM")) return 1.2;
      if (t.includes("MOAB")) return 0.85;
    } else if (type === "biological") {
      if (t.includes("SHIELDED")) return 0.8;
      if (t.includes("MOAB")) return 0.75;
    } else if (type === "immune") {
      if (t.includes("ELITE") || t.includes("BOSS")) return 1.1;
    }
    return 1;
  }

  const COLOR_PRESETS = {
    "#ff5a5a": {
      id: "basic_virus",
      name: "Basic Virus",
      hp: 18,
      speed: 130,
      armor: 0,
      shield: 0,
      bounty: 4,
      leakDamage: 1,
      tags: ["FAST"],
      radius: 14
    },
    "#a0a0a0": {
      id: "bacterium",
      name: "Bacterium",
      hp: 60,
      speed: 85,
      armor: 2,
      shield: 0,
      bounty: 8,
      leakDamage: 2,
      tags: ["ARMORED"],
      radius: 15
    },
    "#7d5cff": {
      id: "encapsulated_bacterium",
      name: "Encapsulated Bacterium",
      hp: 75,
      speed: 75,
      armor: 3,
      shield: 25,
      bounty: 11,
      leakDamage: 3,
      tags: ["ARMORED", "SHIELDED"],
      radius: 15
    },
    "#ffb347": {
      id: "protozoan",
      name: "Protozoan Parasite",
      hp: 220,
      speed: 55,
      armor: 1,
      shield: 0,
      bounty: 20,
      leakDamage: 5,
      tags: ["ELITE"],
      radius: 18
    },
    "#8a5cff": {
      id: "toxin",
      name: "Toxin Droplet",
      hp: 28,
      speed: 150,
      armor: 0,
      shield: 0,
      bounty: 7,
      leakDamage: 2,
      tags: ["FAST", "STEALTH"],
      radius: 12
    },
    "#67d46b": {
      id: "spore_cluster",
      name: "Spore Cluster",
      hp: 90,
      speed: 70,
      armor: 0,
      shield: 0,
      bounty: 14,
      leakDamage: 3,
      tags: ["SWARM", "SPAWNER"],
      radius: 16,
      onDeathSpawn: { count: 3, enemy: { color: "#a6f07a" } }
    },
    "#a6f07a": {
      id: "sporeling",
      name: "Sporeling",
      hp: 12,
      speed: 125,
      armor: 0,
      shield: 0,
      bounty: 2,
      leakDamage: 1,
      tags: ["SWARM", "FAST"],
      radius: 10
    },
    // MOAB-class analogs (immune lore: encapsulated cysts / biofilm clumps)
    "#3aa3ff": {
      id: "cyst",
      name: "Parasite Cyst",
      hp: 350,
      speed: 50,
      armor: 2,
      shield: 60,
      bounty: 30,
      leakDamage: 8,
      tags: ["MOAB", "SHIELDED"],
      radius: 22,
      onDeathSpawn: { count: 6, enemy: { color: "#ff5a5a" } }
    },
    "#2f7ad1": {
      id: "macro_cyst",
      name: "Macro Cyst",
      hp: 900,
      speed: 42,
      armor: 3,
      shield: 120,
      bounty: 60,
      leakDamage: 14,
      tags: ["MOAB", "SHIELDED", "ELITE"],
      radius: 26,
      onDeathSpawn: { count: 2, enemy: { color: "#3aa3ff" } }
    },
    "#1e4b8f": {
      id: "titan_cyst",
      name: "Titan Cyst",
      hp: 2200,
      speed: 36,
      armor: 4,
      shield: 220,
      bounty: 140,
      leakDamage: 25,
      tags: ["MOAB", "SHIELDED", "BOSS"],
      radius: 30,
      onDeathSpawn: { count: 2, enemy: { color: "#2f7ad1" } }
    }
  };

  function normalizeColor(c) {
    if (!c) return "";
    return String(c).trim().toLowerCase();
  }

  function applyColorPreset(config) {
    const c = normalizeColor(config.color);
    if (!c) return config;
    const preset = COLOR_PRESETS[c];
    if (!preset) return config;

    return {
      ...preset,
      ...config,
      hp: config.hp != null ? config.hp : preset.hp,
      speed: config.speed != null ? config.speed : preset.speed,
      armor: config.armor != null ? config.armor : preset.armor,
      shield: config.shield != null ? config.shield : preset.shield,
      radius: config.radius != null ? config.radius : preset.radius,
      tags: Array.isArray(config.tags) ? config.tags : preset.tags,
      onDeathSpawn: config.onDeathSpawn != null ? config.onDeathSpawn : preset.onDeathSpawn,
      color: config.color || c,
    };
  }

  function createEnemy(config, waypoints) {
    const cfg = applyColorPreset(config || {});
    const hpMax = cfg.hp || 30;
    const armor = cfg.armor || 0;
    const shieldMax = cfg.shield || 0;
    const tags = Array.isArray(cfg.tags) ? cfg.tags.slice() : [];

    return {
      x: waypoints[0].x,
      y: waypoints[0].y,
      r: cfg.radius || 14,
      color: cfg.color || "#ff5a5a",

      speed: cfg.speed || 90,
      baseSpeed: cfg.speed || 90,

      hpMax: hpMax,
      hp: hpMax,
      armor: armor,
      shieldMax: shieldMax,
      shield: shieldMax,
      tags: tags,
      bounty: cfg.bounty || 0,
      leakDamage: cfg.leakDamage || 1,
      onDeathSpawn: cfg.onDeathSpawn || null,
      onDeathTriggered: false,

      wp: waypoints,
      wpIndex: 0,

      alive: true,
      reachedGoal: false,
      slowPct: 0,
      slowTimer: 0,
      markPct: 0,
      markTimer: 0,
      armorDebuff: 0,
      armorDebuffTimer: 0,
      revealBonusPct: 0,
      revealBonusTimer: 0,
      revealedTimer: 0,
      stunTimer: 0,
      phase: 1,
      phaseSpeedMult: 1,
      addSpawnTimer: 0,

      update(dt) {
        if (!this.alive || this.reachedGoal) return;

        if (this.stunTimer > 0) {
          this.stunTimer = Math.max(0, this.stunTimer - dt);
          return;
        }

        if (this.slowTimer > 0) {
          this.slowTimer = Math.max(0, this.slowTimer - dt);
          if (this.slowTimer <= 0) this.slowPct = 0;
        }

        if (this.markTimer > 0) {
          this.markTimer = Math.max(0, this.markTimer - dt);
          if (this.markTimer <= 0) this.markPct = 0;
        }

        if (this.armorDebuffTimer > 0) {
          this.armorDebuffTimer = Math.max(0, this.armorDebuffTimer - dt);
          if (this.armorDebuffTimer <= 0) this.armorDebuff = 0;
        }

        if (this.revealBonusTimer > 0) {
          this.revealBonusTimer = Math.max(0, this.revealBonusTimer - dt);
          if (this.revealBonusTimer <= 0) this.revealBonusPct = 0;
        }

        if (this.revealedTimer > 0) {
          this.revealedTimer = Math.max(0, this.revealedTimer - dt);
        }

        // Boss phases + adds
        if (Array.isArray(this.tags) && this.tags.includes("BOSS")) {
          const hpPct = this.hpMax > 0 ? (this.hp / this.hpMax) : 0;
          if (this.phase < 2 && hpPct <= 0.6) this.phase = 2;
          if (this.phase < 3 && hpPct <= 0.3) {
            this.phase = 3;
            this.phaseSpeedMult = 1.2; // phase 3 speed boost
          }

          if (this.phase >= 2) {
            this.addSpawnTimer += dt;
            if (this.addSpawnTimer >= 4.0) {
              this.addSpawnTimer = 0;
              if (MWD && MWD.enemy && MWD.enemy.create) {
                const add = MWD.enemy.create({ color: "#ff5a5a" }, MWD.levelWaypoints || []);
                add.x = this.x;
                add.y = this.y;
                if (MWD.enemies) MWD.enemies.push(add);
              }
            }
          }
        }

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

        const slowFactor = 1 - this.slowPct;
        const step = this.baseSpeed * (this.phaseSpeedMult || 1) * Math.max(0.05, slowFactor) * dt;
        if (step >= dist) {
          this.x = next.x;
          this.y = next.y;
          this.wpIndex++;
        } else {
          this.x += (dx / dist) * step;
          this.y += (dy / dist) * step;
        }
      },

      damage(amount, damageType) {
        if (!this.alive) return;
        const type = damageType || "physical";
        const typeMult = getDamageTypeMultiplier(this.tags || [], type);
        let typedDmg = amount * typeMult;

        const effectiveArmor = Math.max(0, this.armor - (this.armorDebuff || 0));
        const dmgAfterArmor = Math.max(0, typedDmg - effectiveArmor);
        const markMult = 1 + (this.markPct || 0) + (this.revealBonusPct || 0);
        let finalDmg = dmgAfterArmor * markMult;

        if (this.shield > 0) {
          const shieldHit = Math.min(this.shield, finalDmg);
          this.shield -= shieldHit;
          finalDmg -= shieldHit;
        }

        if (finalDmg > 0) this.hp -= finalDmg;
        if (this.hp <= 0) {
          this.hp = 0;
          this.alive = false;
        }
      },

      applySlow(pct, dur) {
        if (!pct || !dur) return;
        if (pct > this.slowPct) this.slowPct = pct;
        if (dur > this.slowTimer) this.slowTimer = dur;
      },

      applyMark(pct, dur) {
        if (!pct || !dur) return;
        if (pct > this.markPct) this.markPct = pct;
        if (dur > this.markTimer) this.markTimer = dur;
      },

      applyArmorDebuff(amount, dur) {
        if (!amount || !dur) return;
        if (amount > this.armorDebuff) this.armorDebuff = amount;
        if (dur > this.armorDebuffTimer) this.armorDebuffTimer = dur;
      },

      reveal(dur) {
        if (!dur) return;
        this.revealedTimer = Math.max(this.revealedTimer, dur);
      },

      applyRevealBonus(pct, dur) {
        if (!pct || !dur) return;
        if (pct > this.revealBonusPct) this.revealBonusPct = pct;
        if (dur > this.revealBonusTimer) this.revealBonusTimer = dur;
      },

      applyStun(dur) {
        if (!dur) return;
        if (dur > this.stunTimer) this.stunTimer = dur;
      }
    };
  }

  function updateAll(dt) {
    const enemies = MWD.enemies || [];
    for (let i = 0; i < enemies.length; i++) enemies[i].update(dt);

    // Track kills for UI stats
    if (!MWD.stats) MWD.stats = { kills: 0 };
    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      if (e && e.alive === false && !e.countedKill) {
        MWD.stats.kills += 1;
        e.countedKill = true;
      }
    }

    // Handle on-death spawns before removal
    const initialLen = enemies.length;
    for (let i = 0; i < initialLen; i++) {
      const e = enemies[i];
      if (!e || e.alive !== false || e.onDeathTriggered || e.reachedGoal) continue;
      if (e.onDeathSpawn && MWD.enemy && MWD.enemy.create) {
        const spawn = e.onDeathSpawn;
        const count = spawn.count || 0;
        for (let s = 0; s < count; s++) {
          const child = MWD.enemy.create(spawn.enemy || {}, MWD.levelWaypoints || []);
          child.x = e.x;
          child.y = e.y;
          enemies.push(child);
        }
      }
      e.onDeathTriggered = true;
    }

    // Award bounty once per enemy death
    const econ = MWD.economy;
    if (econ) {
      for (let i = 0; i < enemies.length; i++) {
        const e = enemies[i];
        if (e && e.alive === false && !e.reachedGoal && !e.gaveBounty) {
          const bounty = e.bounty || 0;
          econ.cash = (econ.cash || 0) + bounty;
          e.gaveBounty = true;
        }
      }
    }

    // Leak damage when enemies reach the goal
    if (MWD.player) {
      for (let i = 0; i < enemies.length; i++) {
        const e = enemies[i];
        if (e && e.reachedGoal && !e.gaveLeak) {
          MWD.player.hp -= (e.leakDamage || 1);
          e.gaveLeak = true;
        }
      }
    }

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
