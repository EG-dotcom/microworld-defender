(function () {
  if (!window.MWD || typeof window.MWD !== "object") window.MWD = {};
  const M = window.MWD;

  const DEFAULT_BULLET_SPEED = 420;

  const TOWER_DEFS = [
    {
      id: "neutrophil",
      name: "Neutrophil",
      role: "Fast DPS",
      cost: 70,
      range: 120,
      damage: 4,
      rate: 2.6,
      projectileSpeed: 520,
      damageType: "physical",
      sprite: "assets/towers/neutrophil.png",
      color: "#cfe8ff",
      upgrades: {
        pathA: [
          { cost: 60, changes: { damageAdd: 2 } },            // A1
          { cost: 95, changes: { rateAdd: 0.8 } },            // A2
          { cost: 170, changes: { overdriveEvery: 4, overdriveBonus: 10 } } // A3
        ],
        pathB: [
          { cost: 70, changes: { pierceAdd: 1 } },            // B1
          { cost: 110, changes: { pierceAdd: 1 } },           // B2
          { cost: 190, changes: { splashRadius: 28, damageMult: 0.85 } } // B3
        ]
      }
    },
    {
      id: "macrophage",
      name: "Macrophage",
      role: "Crowd Control",
      cost: 100,
      range: 105,
      damage: 6,
      rate: 1.0,
      projectileSpeed: 360,
      onHit: { slowPct: 0.25, slowDur: 1.6 },
      damageType: "biological",
      sprite: "assets/towers/macrophage.png",
      color: "#7ad6ff",
      upgrades: {
        pathA: [
          { cost: 80, changes: { slowPctSet: 0.35 } },        // A1
          { cost: 120, changes: { engulfThreshold: 0.20, engulfCooldown: 4.0 } }, // A2
          { cost: 220, changes: { engulfThreshold: 0.35, engulfSplashRadius: 26 } } // A3
        ],
        pathB: [
          { cost: 85, changes: { rangeAdd: 25 } },            // B1
          { cost: 130, changes: { slowSplashRadius: 24, damageSplashRadius: 24 } },   // B2
          { cost: 210, changes: { stickySlowPct: 0.30, stickySlowDur: 2.5, stickyCooldown: 5.0 } } // B3
        ]
      }
    },
    {
      id: "antibody",
      name: "Antibody Tower",
      role: "Support / Mark",
      cost: 120,
      range: 170,
      damage: 1,
      rate: 1.2,
      projectileSpeed: 420,
      onHit: { markPct: 0.18, markDur: 3.0 },
      damageType: "immune",
      sprite: "assets/towers/antibody.png",
      color: "#ffd36e",
      upgrades: {
        pathA: [
          { cost: 100, changes: { markPctSet: 0.25 } },       // A1
          { cost: 160, changes: { markDurSet: 4.0 } },        // A2
          { cost: 260, changes: { armorDebuff: 2, armorDebuffDur: 4.0 } } // A3
        ],
        pathB: [
          { cost: 110, changes: { chainMarkEvery: 3, chainMarkCount: 1, chainMarkRadius: 45 } }, // B1
          { cost: 170, changes: { chainMarkCount: 2 } },      // B2
          { cost: 260, changes: { massTagCooldown: 7.0 } }    // B3
        ]
      }
    },
    {
      id: "cytotoxic",
      name: "Cytotoxic T Cell",
      role: "Single-Target",
      cost: 180,
      range: 150,
      damage: 22,
      rate: 0.55,
      projectileSpeed: 500,
      bonusTags: ["ELITE", "BOSS"],
      bonusMult: 0.35,
      damageType: "chemical",
      sprite: "assets/towers/cytotoxic.png",
      color: "#ff7a7a",
      upgrades: {
        pathA: [
          { cost: 150, changes: { damageAdd: 8 } },           // A1
          { cost: 240, changes: { bonusMultSet: 0.60 } },     // A2
          { cost: 340, changes: { finisherThreshold: 0.30, finisherBonus: 0.40 } } // A3
        ],
        pathB: [
          { cost: 150, changes: { weakenedSlowPct: 0.15, weakenedDur: 2.0 } }, // B1
          { cost: 230, changes: { weakenedSlowPct: 0.25, weakenedDur: 3.0, pierceAdd: 1 } }, // B2
          { cost: 330, changes: { stunEvery: 5, stunDur: 0.8, stunEliteDur: 0.35 } } // B3
        ]
      }
    },
    {
      id: "dendritic",
      name: "Dendritic Cell",
      role: "Utility / Reveal / Aura",
      cost: 160,
      range: 0,
      rate: 0,
      auraRadius: 140,
      auraRateBonus: 0.10,
      reveal: true,
      sprite: "assets/towers/dendritic.png",
      color: "#b9a3ff",
      upgrades: {
        pathA: [
          { cost: 140, changes: { auraRadiusAdd: 35 } },      // A1
          { cost: 210, changes: { auraRateBonusSet: 0.16 } }, // A2
          { cost: 300, changes: { burstRateBonus: 0.30, burstDur: 2.0, burstCooldown: 10.0 } } // A3
        ],
        pathB: [
          { cost: 140, changes: { auraRateBonusSet: 0.12, auraRangeBonus: 0.08 } }, // B1
          { cost: 220, changes: { revealBonusPct: 0.10, revealBonusDur: 2.0 } },    // B2
          { cost: 310, changes: { revealBonusPct: 0.12, autoMarkOnReveal: true, autoMarkDur: 2.0 } } // B3
        ]
      }
    },
    {
      id: "net_trap",
      name: "NET Trap",
      role: "Area Denial",
      cost: 70,
      range: 0,
      rate: 0,
      effectRadius: 55,
      slowPct: 0.35,
      slowDur: 3.0,
      cooldown: 8.0,
      placeOnPath: true,
      sprite: "assets/towers/net_trap.png",
      color: "#8df7d2",
      upgrades: {
        pathA: [
          { cost: 120, changes: { slowPctSet: 0.45 } },       // A1
          { cost: 190, changes: { slowDurSet: 4.0 } },        // A2
          { cost: 280, changes: { rootDur: 0.5, rootEliteDur: 0.2 } } // A3
        ],
        pathB: [
          { cost: 120, changes: { effectRadiusSet: 70 } },    // B1
          { cost: 200, changes: { cooldownSet: 6.5 } },       // B2
          { cost: 280, changes: { residualSlowPct: 0.25, residualSlowDur: 3.0 } } // B3
        ]
      }
    }
  ];

  const TOWER_DEF_BY_ID = Object.fromEntries(TOWER_DEFS.map(d => [d.id, d]));

  const state = {
    towers: [],
    bullets: [],
    zones: [],
    hover: { gx: -1, gy: -1, valid: false },
    selectedTowerIndex: -1,
    hoverTowerIndex: -1,
    drag: { active: false, type: null, x: 0, y: 0 },
  };

  let mouseAttached = false;
  let keyAttached = false;
  let selectedId = null;
  let hasSelection = false;
  const REFUND_RATE = 0.7;

  function getEconomy() {
    return M.economy || null;
  }

  function canAfford(cost) {
    const econ = getEconomy();
    if (!econ) return true;
    return (econ.cash || 0) >= cost;
  }

  function spend(cost) {
    const econ = getEconomy();
    if (!econ) return true;
    if ((econ.cash || 0) < cost) return false;
    econ.cash -= cost;
    return true;
  }

  function refund(amount) {
    const econ = getEconomy();
    if (!econ) return;
    econ.cash = (econ.cash || 0) + amount;
  }

  function buildPathSet(path) {
    return new Set(path.map(p => `${p.x},${p.y}`));
  }

  function canPlaceTower(gx, gy, def) {
    const W = M.world;
    if (!W || !W.isInGrid(gx, gy)) return false;
    if (def && def.placeOnPath) {
      if (!M._pathSet || !M._pathSet.has(`${gx},${gy}`)) return false;
    } else {
      if (M._pathSet && M._pathSet.has(`${gx},${gy}`)) return false;
    }
    for (const t of state.towers) if (t.gx === gx && t.gy === gy) return false;
    return true;
  }

  function placeTower(gx, gy, id) {
    const def = TOWER_DEF_BY_ID[id || selectedId];
    if (!def) return false;
    if (!canPlaceTower(gx, gy, def)) return false;
    if (!canAfford(def.cost || 0)) return false;
    const c = M.world.gridToPixelCenter(gx, gy);
    state.towers.push({
      gx, gy,
      x: c.x, y: c.y,
      type: def.id,
      name: def.name,
      color: def.color,
      range: def.range || 0,
      baseRange: def.range || 0,
      fireRate: def.rate || 0,
      baseRate: def.rate || 0,
      cooldown: 0,
      dmg: def.damage || 0,
      projectileSpeed: def.projectileSpeed || DEFAULT_BULLET_SPEED,
      damageType: def.damageType || "physical",
      onHit: def.onHit || null,
      bonusTags: def.bonusTags || null,
      bonusMult: def.bonusMult || 0,
      auraRadius: def.auraRadius || 0,
      auraRateBonus: def.auraRateBonus || 0,
      reveal: !!def.reveal,
      effectRadius: def.effectRadius || 0,
      slowPct: def.slowPct || 0,
      slowDur: def.slowDur || 0,
      cooldownMax: def.cooldown || 0,
      upgrades: { pathA: 0, pathB: 0 },
      shotCount: 0,
      pierce: 0,
      splashRadius: 0,
      damageMult: 1,
      engulfCooldown: 0,
      massTagCooldown: 0,
      burstCooldown: 0,
      burstTimer: 0,
      rateBonus: 0,
      rangeBonus: 0,
      totalCost: def.cost || 0,
      targetMode: "first",
    });
    state.selectedTowerIndex = state.towers.length - 1;
    spend(def.cost || 0);
    return true;
  }

  // Pick a target from M.enemies (first/strongest/closest)
  function pickTargetInRange(t) {
    const enemies = M.enemies || [];
    if (enemies.length === 0) return null;

    let best = null;
    let bestScore = -Infinity;

    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      if (!e || e.alive === false || e.reachedGoal) continue;
      if (Array.isArray(e.tags) && e.tags.includes("STEALTH") && !(e.revealedTimer > 0)) continue;

      const dx = e.x - t.x;
      const dy = e.y - t.y;
      const d2 = dx * dx + dy * dy;

      if (d2 > t.range * t.range) continue;

      const mode = t.targetMode || "first";
      let score = -Infinity;
      if (mode === "closest") {
        score = -d2;
      } else if (mode === "strongest") {
        const hp = typeof e.hp === "number" ? e.hp : 0;
        score = hp * 1000 - d2;
      } else {
        const wp = (typeof e.wpIndex === "number") ? e.wpIndex : 0;
        score = (wp * 100000) - d2; // progress dominates, then distance
      }
      if (score > bestScore) {
        bestScore = score;
        best = e;
      }
    }

    return best;
  }

  function chainMarkAroundTarget(t, target) {
    const enemies = M.enemies || [];
    const count = t.chainMarkCount || 0;
    const radius = t.chainMarkRadius || 0;
    if (!count || !radius || !target) return;

    const r2 = radius * radius;
    let applied = 0;
    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      if (!e || e === target || e.alive === false || e.reachedGoal) continue;
      const dx = e.x - target.x;
      const dy = e.y - target.y;
      if ((dx * dx + dy * dy) <= r2) {
        if (t.onHit && t.onHit.markPct && e.applyMark) {
          e.applyMark(t.onHit.markPct, t.onHit.markDur || 0);
          applied++;
        }
      }
      if (applied >= count) break;
    }
  }

  function addZone(x, y, r, slowPct, dur) {
    if (!r || !slowPct || !dur) return;
    state.zones.push({
      x, y,
      r,
      slowPct,
      expires: dur
    });
  }

  function applyUpgradeChanges(t, changes) {
    if (!changes) return;
    if (changes.damageAdd) t.dmg += changes.damageAdd;
    if (changes.rateAdd) { t.baseRate += changes.rateAdd; t.fireRate = t.baseRate; }
    if (changes.rangeAdd) { t.range += changes.rangeAdd; t.baseRange += changes.rangeAdd; }
    if (changes.slowPctSet && t.onHit) t.onHit.slowPct = changes.slowPctSet;
    if (changes.slowDurSet && t.onHit) t.onHit.slowDur = changes.slowDurSet;
    if (changes.markPctSet && t.onHit) t.onHit.markPct = changes.markPctSet;
    if (changes.markDurSet && t.onHit) t.onHit.markDur = changes.markDurSet;
    if (changes.pierceAdd) t.pierce += changes.pierceAdd;
    if (changes.splashRadius) t.splashRadius = changes.splashRadius;
    if (changes.damageMult) t.damageMult = (t.damageMult || 1) * changes.damageMult;

    if (changes.overdriveEvery) t.overdriveEvery = changes.overdriveEvery;
    if (changes.overdriveBonus) t.overdriveBonus = changes.overdriveBonus;

    if (changes.engulfThreshold) t.engulfThreshold = changes.engulfThreshold;
    if (changes.engulfCooldown) { t.engulfCooldownMax = changes.engulfCooldown; }
    if (changes.engulfSplashRadius) t.engulfSplashRadius = changes.engulfSplashRadius;

    if (changes.slowSplashRadius) t.slowSplashRadius = changes.slowSplashRadius;
    if (changes.damageSplashRadius) t.splashRadius = changes.damageSplashRadius;
    if (changes.stickySlowPct) t.stickySlowPct = changes.stickySlowPct;
    if (changes.stickySlowDur) t.stickySlowDur = changes.stickySlowDur;
    if (changes.stickyCooldown) t.stickyCooldownMax = changes.stickyCooldown;

    if (changes.armorDebuff) t.armorDebuff = changes.armorDebuff;
    if (changes.armorDebuffDur) t.armorDebuffDur = changes.armorDebuffDur;
    if (changes.chainMarkEvery) t.chainMarkEvery = changes.chainMarkEvery;
    if (changes.chainMarkCount) t.chainMarkCount = changes.chainMarkCount;
    if (changes.chainMarkRadius) t.chainMarkRadius = changes.chainMarkRadius;
    if (changes.massTagCooldown) t.massTagCooldownMax = changes.massTagCooldown;

    if (changes.bonusMultSet != null) t.bonusMult = changes.bonusMultSet;
    if (changes.finisherThreshold) t.finisherThreshold = changes.finisherThreshold;
    if (changes.finisherBonus) t.finisherBonus = changes.finisherBonus;

    if (changes.weakenedSlowPct) t.weakenedSlowPct = changes.weakenedSlowPct;
    if (changes.weakenedDur) t.weakenedDur = changes.weakenedDur;
    if (changes.stunEvery) t.stunEvery = changes.stunEvery;
    if (changes.stunDur) t.stunDur = changes.stunDur;
    if (changes.stunEliteDur) t.stunEliteDur = changes.stunEliteDur;

    if (changes.auraRadiusAdd) t.auraRadius += changes.auraRadiusAdd;
    if (changes.auraRateBonusSet != null) t.auraRateBonus = changes.auraRateBonusSet;
    if (changes.auraRangeBonus != null) t.auraRangeBonus = changes.auraRangeBonus;
    if (changes.burstRateBonus) t.burstRateBonus = changes.burstRateBonus;
    if (changes.burstDur) t.burstDur = changes.burstDur;
    if (changes.burstCooldown) t.burstCooldownMax = changes.burstCooldown;
    if (changes.revealBonusPct) t.revealBonusPct = changes.revealBonusPct;
    if (changes.revealBonusDur) t.revealBonusDur = changes.revealBonusDur;
    if (changes.autoMarkOnReveal) t.autoMarkOnReveal = true;
    if (changes.autoMarkDur) t.autoMarkDur = changes.autoMarkDur;

    if (changes.effectRadiusSet) t.effectRadius = changes.effectRadiusSet;
    if (changes.cooldownSet) t.cooldownMax = changes.cooldownSet;
    if (changes.rootDur) t.rootDur = changes.rootDur;
    if (changes.rootEliteDur) t.rootEliteDur = changes.rootEliteDur;
    if (changes.residualSlowPct) t.residualSlowPct = changes.residualSlowPct;
    if (changes.residualSlowDur) t.residualSlowDur = changes.residualSlowDur;
  }

  function canUpgrade(t, path) {
    if (!t || !path) return false;
    if (t.upgrades.pathA > 0 && t.upgrades.pathB > 0) return false;
    if (path === "pathA" && t.upgrades.pathB > 0) return false;
    if (path === "pathB" && t.upgrades.pathA > 0) return false;
    return true;
  }

  function upgradeSelected(path) {
    const idx = state.selectedTowerIndex;
    if (idx < 0 || idx >= state.towers.length) return false;
    const t = state.towers[idx];
    if (!t) return false;

    const def = TOWER_DEF_BY_ID[t.type];
    if (!def || !def.upgrades || !def.upgrades[path]) return false;

    if (!canUpgrade(t, path)) return false;

    const level = t.upgrades[path];
    if (level >= def.upgrades[path].length) return false;

    const next = def.upgrades[path][level];
    if (!next) return false;
    if (!canAfford(next.cost || 0)) return false;
    if (!spend(next.cost || 0)) return false;

    applyUpgradeChanges(t, next.changes);
    t.upgrades[path] += 1;
    t.totalCost = (t.totalCost || 0) + (next.cost || 0);
    return true;
  }

  function sellSelected() {
    const idx = state.selectedTowerIndex;
    if (idx < 0 || idx >= state.towers.length) return false;
    const t = state.towers[idx];
    if (!t) return false;
    const refundAmount = Math.floor((t.totalCost || 0) * REFUND_RATE);
    refund(refundAmount);
    state.towers.splice(idx, 1);
    state.selectedTowerIndex = -1;
    return true;
  }

  function towerTryShoot(t, dt) {
    if (!t.fireRate || t.fireRate <= 0) return;
    t.cooldown = Math.max(0, t.cooldown - dt);
    if (t.engulfCooldown > 0) t.engulfCooldown = Math.max(0, t.engulfCooldown - dt);

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
    const speed = t.projectileSpeed || DEFAULT_BULLET_SPEED;
    let dmg = t.dmg * (t.damageMult || 1);

    t.shotCount = (t.shotCount || 0) + 1;
    if (t.overdriveEvery && t.overdriveBonus && (t.shotCount % t.overdriveEvery === 0)) {
      dmg += t.overdriveBonus;
    }

    if (t.bonusTags && Array.isArray(enemy.tags)) {
      for (let i = 0; i < t.bonusTags.length; i++) {
        if (enemy.tags.includes(t.bonusTags[i])) {
          dmg = dmg * (1 + t.bonusMult);
          break;
        }
      }
    }

    if (t.finisherThreshold && t.finisherBonus && enemy.hpMax) {
      const pct = enemy.hp / enemy.hpMax;
      if (pct <= t.finisherThreshold) dmg = dmg * (1 + t.finisherBonus);
    }

    state.bullets.push({
      x: t.x,
      y: t.y,
      vx: nx * speed,
      vy: ny * speed,
      r: 4,
      dmg: dmg,
      damageType: t.damageType || "physical",
      pierce: t.pierce || 0,
      splashRadius: t.splashRadius || 0,
      slowPct: t.onHit && t.onHit.slowPct,
      slowDur: t.onHit && t.onHit.slowDur,
      markPct: t.onHit && t.onHit.markPct,
      markDur: t.onHit && t.onHit.markDur,
      armorDebuff: t.armorDebuff || 0,
      armorDebuffDur: t.armorDebuffDur || 0,
      weakenedSlowPct: t.weakenedSlowPct || 0,
      weakenedDur: t.weakenedDur || 0,
      stunEvery: t.stunEvery || 0,
      stunDur: t.stunDur || 0,
      stunEliteDur: t.stunEliteDur || 0,
      shooter: t,
    });

    t.cooldown = 1 / t.fireRate;

    if (t.chainMarkEvery && t.chainMarkCount && (t.shotCount % t.chainMarkEvery === 0)) {
      chainMarkAroundTarget(t, enemy);
    }
  }

  // Bullets collide with ANY enemy
  function applyBulletHit(b, e) {
    if (b.slowPct && e.applySlow) e.applySlow(b.slowPct, b.slowDur || 0);
    if (b.markPct && e.applyMark) e.applyMark(b.markPct, b.markDur || 0);
    if (b.armorDebuff && e.applyArmorDebuff) e.applyArmorDebuff(b.armorDebuff, b.armorDebuffDur || 0);
    if (b.weakenedSlowPct && e.applySlow) e.applySlow(b.weakenedSlowPct, b.weakenedDur || 0);

    if (b.shooter && b.shooter.slowSplashRadius && b.shooter.onHit && b.shooter.onHit.slowPct) {
      const r = b.shooter.slowSplashRadius;
      const r2 = r * r;
      const enemies = M.enemies || [];
      for (let j = 0; j < enemies.length; j++) {
        const o = enemies[j];
        if (!o || o.alive === false || o.reachedGoal) continue;
        const dx = o.x - e.x;
        const dy = o.y - e.y;
        if ((dx * dx + dy * dy) <= r2) {
          if (o.applySlow) o.applySlow(b.shooter.onHit.slowPct, b.shooter.onHit.slowDur || 0);
        }
      }
    }

    if (b.stunEvery && b.shooter) {
      const n = b.shooter.shotCount || 0;
      if (n % b.stunEvery === 0) {
        const isElite = Array.isArray(e.tags) && (e.tags.includes("ELITE") || e.tags.includes("BOSS"));
        const dur = isElite ? b.stunEliteDur : b.stunDur;
        if (dur && e.applyStun) e.applyStun(dur);
      }
    }

    if (b.shooter && b.shooter.engulfThreshold && b.shooter.engulfCooldown <= 0 && e.hpMax) {
      const pct = e.hp / e.hpMax;
      if (pct <= b.shooter.engulfThreshold) {
        e.hp = 0;
        e.alive = false;
        b.shooter.engulfCooldown = b.shooter.engulfCooldownMax || 4.0;

        if (b.shooter.engulfSplashRadius) {
          const r = b.shooter.engulfSplashRadius;
          const r2 = r * r;
          const enemies = M.enemies || [];
          for (let j = 0; j < enemies.length; j++) {
            const o = enemies[j];
            if (!o || o.alive === false || o.reachedGoal) continue;
            const dx = o.x - e.x;
            const dy = o.y - e.y;
            if ((dx * dx + dy * dy) <= r2) {
              if (o.damage) o.damage(b.dmg);
            }
          }
        }

        return;
      }
    }

    if (e.damage) {
      e.damage(b.dmg, b.damageType || "physical");
    } else if (M.enemy && M.enemy.damageEnemy) {
      M.enemy.damageEnemy(e, M.levelWaypoints || [], b.dmg);
    }
  }

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
          if (b.splashRadius && b.splashRadius > 0) {
            const r2 = b.splashRadius * b.splashRadius;
            for (let k = 0; k < enemies.length; k++) {
              const o = enemies[k];
              if (!o || o.alive === false || o.reachedGoal) continue;
              const dx2 = o.x - b.x;
              const dy2 = o.y - b.y;
              if ((dx2 * dx2 + dy2 * dy2) <= r2) applyBulletHit(b, o);
            }
          } else {
            applyBulletHit(b, e);
          }

          if (b.pierce && b.pierce > 0) {
            b.pierce -= 1;
          } else {
            state.bullets.splice(i, 1);
          }
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
    // Apply dendritic aura buffs and reveal stealth
    const towers = state.towers;
    const enemies = M.enemies || [];

    // Update zones
    for (let i = state.zones.length - 1; i >= 0; i--) {
      const z = state.zones[i];
      z.expires = Math.max(0, z.expires - dt);
      if (z.expires <= 0) {
        state.zones.splice(i, 1);
        continue;
      }

      const r2 = z.r * z.r;
      for (let j = 0; j < enemies.length; j++) {
        const e = enemies[j];
        if (!e || e.alive === false || e.reachedGoal) continue;
        const dx = e.x - z.x;
        const dy = e.y - z.y;
        if ((dx * dx + dy * dy) <= r2) {
          if (e.applySlow) e.applySlow(z.slowPct, z.expires);
        }
      }
    }

    for (let i = 0; i < towers.length; i++) {
      const t = towers[i];
      t.rateBonus = 0;
      t.rangeBonus = 0;
    }

    for (let i = 0; i < towers.length; i++) {
      const t = towers[i];
      if (t.type !== "dendritic") continue;
      const ar = t.auraRadius || 0;
      const ar2 = ar * ar;

      for (let j = 0; j < towers.length; j++) {
        if (i === j) continue;
        const o = towers[j];
        const dx = o.x - t.x;
        const dy = o.y - t.y;
        if ((dx * dx + dy * dy) <= ar2) {
          o.rateBonus = Math.max(o.rateBonus || 0, t.auraRateBonus || 0);
          if (t.auraRangeBonus) o.rangeBonus = Math.max(o.rangeBonus || 0, t.auraRangeBonus);
          if (t.burstRateBonus && t.burstTimer > 0) {
            o.rateBonus = Math.max(o.rateBonus || 0, t.burstRateBonus);
          }
        }
      }

      if (t.reveal) {
        for (let j = 0; j < enemies.length; j++) {
          const e = enemies[j];
          if (!e || e.alive === false || e.reachedGoal) continue;
          const dx = e.x - t.x;
          const dy = e.y - t.y;
          if ((dx * dx + dy * dy) <= ar2) {
            if (e.reveal) e.reveal(0.2);
            if (t.revealBonusPct && t.revealBonusDur && e.applyRevealBonus) {
              e.applyRevealBonus(t.revealBonusPct, t.revealBonusDur);
            }
            if (t.autoMarkOnReveal && e.applyMark) {
              e.applyMark(t.revealBonusPct || 0.12, t.autoMarkDur || 2.0);
            }
          }
        }
      }
    }

    for (let i = 0; i < towers.length; i++) {
      const t = towers[i];
      if (t.rateBonus && t.rateBonus > 0) {
        t.fireRate = (t.baseRate || t.fireRate) * (1 + t.rateBonus);
      } else if (t.baseRate) {
        t.fireRate = t.baseRate;
      }
      if (t.rangeBonus && t.rangeBonus > 0) {
        t.range = (t.baseRange || t.range) * (1 + t.rangeBonus);
      } else if (t.baseRange) {
        t.range = t.baseRange;
      }
      if (t.burstCooldown > 0) t.burstCooldown = Math.max(0, t.burstCooldown - dt);
      if (t.burstTimer > 0) t.burstTimer = Math.max(0, t.burstTimer - dt);
      if (t.burstCooldown <= 0 && t.burstRateBonus && t.burstTimer <= 0) {
        t.burstCooldown = t.burstCooldownMax || 10.0;
        t.burstTimer = t.burstDur || 2.0;
      }
    }

    for (let i = 0; i < towers.length; i++) towerTryShoot(towers[i], dt);
    updateBullets(dt);

    // NET trap pulses
    for (let i = 0; i < towers.length; i++) {
      const t = towers[i];
      if (t.type !== "net_trap") continue;

      if (t.cooldown > 0) {
        t.cooldown = Math.max(0, t.cooldown - dt);
        continue;
      }

      let triggered = false;
      const er = t.effectRadius || 0;
      const er2 = er * er;
      for (let j = 0; j < enemies.length; j++) {
        const e = enemies[j];
        if (!e || e.alive === false || e.reachedGoal) continue;
        const dx = e.x - t.x;
        const dy = e.y - t.y;
        if ((dx * dx + dy * dy) <= er2) {
          if (e.applySlow) e.applySlow(t.slowPct || 0, t.slowDur || 0);
          if (t.rootDur && e.applyStun) {
            const isElite = Array.isArray(e.tags) && (e.tags.includes("ELITE") || e.tags.includes("BOSS"));
            const dur = isElite ? (t.rootEliteDur || 0) : (t.rootDur || 0);
            if (dur > 0) e.applyStun(dur);
          }
          triggered = true;
        }
      }

      if (triggered) {
        t.cooldown = t.cooldownMax || 0;
        if (t.residualSlowPct && t.residualSlowDur) {
          addZone(t.x, t.y, t.effectRadius || 0, t.residualSlowPct, t.residualSlowDur);
        }
      }
    }

    // Macrophage sticky zone
    for (let i = 0; i < towers.length; i++) {
      const t = towers[i];
      if (t.type !== "macrophage") continue;
      if (!t.stickySlowPct || !t.stickySlowDur) continue;
      t.stickyCooldown = Math.max(0, (t.stickyCooldown || 0) - dt);
      if (t.stickyCooldown <= 0 && t.slowSplashRadius) {
        const target = pickTargetInRange(t);
        if (target) {
          addZone(target.x, target.y, t.slowSplashRadius, t.stickySlowPct, t.stickySlowDur);
          t.stickyCooldown = t.stickyCooldownMax || 5.0;
        }
      }
    }

    // Antibody mass tag pulse
    for (let i = 0; i < towers.length; i++) {
      const t = towers[i];
      if (t.type !== "antibody") continue;
      if (!t.massTagCooldownMax) continue;
      t.massTagCooldown = Math.max(0, (t.massTagCooldown || 0) - dt);
      if (t.massTagCooldown <= 0) {
        for (let j = 0; j < enemies.length; j++) {
          const e = enemies[j];
          if (!e || e.alive === false || e.reachedGoal) continue;
          const dx = e.x - t.x;
          const dy = e.y - t.y;
          if ((dx * dx + dy * dy) <= (t.range * t.range)) {
            if (t.onHit && t.onHit.markPct && e.applyMark) {
              e.applyMark(t.onHit.markPct, t.onHit.markDur || 0);
            }
          }
        }
        t.massTagCooldown = t.massTagCooldownMax;
      }
    }
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
    if (M.state && M.state !== "playing") return;
    const m = getMousePos(evt);
    const g = W.pixelToGrid(m.x, m.y);
    state.hover.gx = g.x;
    state.hover.gy = g.y;
    const def = selectedId ? TOWER_DEF_BY_ID[selectedId] : null;
    const canPlace = canPlaceTower(g.x, g.y, def);
    const affordable = def ? canAfford(def.cost || 0) : true;
    state.hover.valid = !!def && canPlace && affordable;
    state.hoverTowerIndex = findTowerAt(m.x, m.y);
    state.drag.x = m.x;
    state.drag.y = m.y;
  }

  function findTowerAt(px, py) {
    for (let i = state.towers.length - 1; i >= 0; i--) {
      const t = state.towers[i];
      const dx = t.x - px;
      const dy = t.y - py;
      const r = (t.type === "net_trap") ? 10 : 12;
      if ((dx * dx + dy * dy) <= r * r) return i;
    }
    return -1;
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
      state.hoverTowerIndex = -1;
      state.drag.active = false;
    });

    M.canvas.addEventListener("mousedown", (evt) => {
      if (M.state && M.state !== "playing") return;
      const m = getMousePos(evt);
      const ui = M.ui || {};
      if (ui.paletteVisible === false) return;
      const palette = ui.palette || [];
      for (let i = 0; i < palette.length; i++) {
        const p = palette[i];
        if (m.x >= p.x && m.x <= p.x + p.w && m.y >= p.y && m.y <= p.y + p.h) {
          state.drag.active = true;
          state.drag.type = p.id;
          state.drag.x = m.x;
          state.drag.y = m.y;
          selectedId = p.id;
          hasSelection = true;
          return;
        }
      }
    });

    M.canvas.addEventListener("mouseup", (evt) => {
      if (M.state && M.state !== "playing") return;
      if (!state.drag.active) return;
      const m = getMousePos(evt);
      const W = M.world;
      const g = W.pixelToGrid(m.x, m.y);
      const def = TOWER_DEF_BY_ID[state.drag.type];
      if (def && canPlaceTower(g.x, g.y, def) && canAfford(def.cost || 0)) {
        placeTower(g.x, g.y, state.drag.type);
      }
      state.drag.active = false;
      state.drag.type = null;
    });

    M.canvas.addEventListener("click", (evt) => {
      if (M.state && M.state !== "playing") return;
      updateHover(evt);
      const pos = getMousePos(evt);
      const idx = findTowerAt(pos.x, pos.y);
      if (idx >= 0) {
        state.selectedTowerIndex = idx;
        return;
      }

      state.selectedTowerIndex = -1;
      if (hasSelection && state.hover.valid) placeTower(state.hover.gx, state.hover.gy, selectedId);
      const def = selectedId ? TOWER_DEF_BY_ID[selectedId] : null;
      state.hover.valid = !!def && canPlaceTower(state.hover.gx, state.hover.gy, def);
    });
  }

  function attachKeys() {
    if (keyAttached) return;
    keyAttached = true;
    const order = TOWER_DEFS.map(d => d.id);

    window.addEventListener("keydown", (evt) => {
      const k = evt.key;
      if (k >= "1" && k <= String(order.length)) {
        selectedId = order[Number(k) - 1];
        hasSelection = true;
      }
      if (k === "q" || k === "Q") upgradeSelected("pathA");
      if (k === "e" || k === "E") upgradeSelected("pathB");
      if (k === "x" || k === "X") sellSelected();
      if (k === "f" || k === "F") cycleTargetMode();
      if (k === "p" || k === "P") {
        M.ui = M.ui || {};
        M.ui.paletteVisible = !M.ui.paletteVisible;
      }
    });
  }

  function cycleTargetMode() {
    const idx = state.selectedTowerIndex;
    if (idx < 0 || idx >= state.towers.length) return;
    const t = state.towers[idx];
    const modes = ["first", "strongest", "closest"];
    const cur = t.targetMode || "first";
    const next = modes[(modes.indexOf(cur) + 1) % modes.length];
    t.targetMode = next;
  }

  function initForLevel(level) {
    state.towers = [];
    state.bullets = [];
    state.hover = { gx: -1, gy: -1, valid: false };
    M._pathSet = buildPathSet((level && level.path) ? level.path : []);
    attachMouse();
    attachKeys();
  }

  M.towers = {
    state,
    TOWER_DEFS,
    canPlaceTower,
    placeTower,
    initForLevel,
    update,
    getSelected() {
      return TOWER_DEF_BY_ID[selectedId];
    },
    getSelectedTower() {
      const idx = state.selectedTowerIndex;
      if (idx < 0 || idx >= state.towers.length) return null;
      return state.towers[idx];
    },
    getHoverTower() {
      const idx = state.hoverTowerIndex;
      if (idx < 0 || idx >= state.towers.length) return null;
      return state.towers[idx];
    },
    getSelectedIndex() {
      return state.selectedTowerIndex;
    },
    getUpgradeInfo(tower, path) {
      if (!tower) return null;
      const def = TOWER_DEF_BY_ID[tower.type];
      if (!def || !def.upgrades || !def.upgrades[path]) return null;
      const level = tower.upgrades[path];
      if (level >= def.upgrades[path].length) return null;
      return def.upgrades[path][level];
    },
    getRefundAmount(tower) {
      if (!tower) return 0;
      return Math.floor((tower.totalCost || 0) * REFUND_RATE);
    },
    getDragState() {
      return state.drag;
    }
  };
})();
