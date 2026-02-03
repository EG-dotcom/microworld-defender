Tower Stat Tables (v0.1) Scope
This file defines prototype-ready tower stats for MicroWorld Defender 2D.
Design goals: - Towers are role-pure (DPS, CC, Support, Utility). - Early game is forgiving, late game is build-
synergy-driven. - Values are tuned to work with Enemy Stat Tables (v0.1).
Global Systems & Conventions Units
• Range: pixels (px)
• Attack rate: shots/second
• Damage: HP per hit
• DPS: damage × rate (single-target unless AoE noted)
• Economy: currency
Targeting
Default targeting modes (player-selectable later): - First / Last / Strong / Weak
Status Effects
• Slow: speed × (1 - slow%) for duration
• Mark: target takes +X% damage for duration Upgrade Philosophy
• Each tower has two branches (Path A / Path B).
• Early upgrades are small; Tier-3 upgrades change behavior.
Starter Towers (Unlocked in Level 1) 1) Neutrophil (Fast DPS)
Role: early DPS, anti-FAST and general cleanup.
Base Stats - Cost: 70 - Range: 120 px - Damage/Hit: 4 - Rate: 2.6 /s - DPS: 10.4 - Projectile: fast pellet - Notes:
excels when placed near curves due to longer time-on-target.
  1

Upgrade Path A – “Burst Response” (single-target scaling) - A1 (Cost 60): Damage +2 (6) - A2 (Cost 95): Rate +0.8 (3.4/s) - A3 (Cost 170): “Overdrive” – every 4th hit deals +10 bonus damage
Upgrade Path B – “Micro-Splinter” (anti-swarm) - B1 (Cost 70): +1 pierce (hits 2 enemies in a line) - B2 (Cost 110): +1 pierce (hits 3) - B3 (Cost 190): “Fragment Spray” – small cone AoE (splash radius 28 px), -15% base damage
2) Macrophage (Crowd Control)
Role: slows groups, stabilizes the line; low DPS by design.
Base Stats - Cost: 100 - Range: 105 px - Damage/Hit: 6 - Rate: 1.0 /s - DPS: 6.0 - On-hit: Slow 25% for 1.6 s
Upgrade Path A – “Engulfment” (execute + control) - A1 (Cost 80): Slow 35% (duration unchanged) - A2 (Cost 120): “Engulf” – if target HP < 20%, instantly kills (cooldown 4.0 s) - A3 (Cost 220): Engulf threshold 35% + small splash (radius 26 px) on engulf
Upgrade Path B – “Inflammatory Field” (area slow / lane control) - B1 (Cost 85): Range +25 (130) - B2 (Cost 130): Applies slow in small AoE (radius 24 px) on hit - B3 (Cost 210): “Sticky Zone” – places a slow puddle (30% slow) on path for 2.5 s (cooldown 5 s)
Mid Game Towers (Unlocks after Level 1) 3) Antibody Tower (Support / Mark)
Role: increases team DPS via mark; enables synergy with Complement.
Base Stats - Cost: 120 - Range: 170 px - Damage/Hit: 1 (token damage) - Rate: 1.2 /s - Mark: +18% damage
taken for 3.0 s (refreshes) - Notes: the value is in mark uptime, not raw damage.
Upgrade Path A – “Affinity” (stronger mark) - A1 (Cost 100): Mark +25% - A2 (Cost 160): Mark duration 4.0 s - A3 (Cost 260): “Expose” – marked enemies also suffer -2 armor (min 0)
Upgrade Path B – “Spread” (multi-target marking) - B1 (Cost 110): Every 3rd shot chains mark to 1 nearby enemy (within 45 px) - B2 (Cost 170): Chain to 2 enemies - B3 (Cost 260): “Mass Tag” – periodic pulse that marks all enemies in range (cooldown 7 s)
4) Cytotoxic T Cell (Single-Target) Role: elite/boss killer.
Base Stats - Cost: 180 - Range: 150 px - Damage/Hit: 22 - Rate: 0.55 /s - DPS: 12.1 - Bonus: +35% damage vs ELITE/BOSS tags
   2

Upgrade Path A – “Execution” (boss focus) - A1 (Cost 150): Damage +8 (30) - A2 (Cost 240): Bonus vs ELITE/ BOSS +60% - A3 (Cost 340): “Finisher” – +40% damage to targets below 30% HP
Upgrade Path B – “Suppression” (control via debuff) - B1 (Cost 150): Applies Weakened: -15% speed for 2 s - B2 (Cost 230): Weakened becomes -25% speed, duration 3 s - B3 (Cost 330): “Lockdown Shot” – every 5th hit stuns 0.8 s (elite/boss: 0.35 s)
5) Dendritic Cell (Utility / Reveal / Aura)
Role: enables anti-stealth and improves nearby towers.
Base Stats - Cost: 160 - Range: 0 (aura) - Aura radius: 140 px - Reveal: detects STEALTH within aura - Buff: +10% attack rate to towers inside aura
Upgrade Path A – “Signal Boost” (stronger aura) - A1 (Cost 140): Aura radius +35 (175) - A2 (Cost 210): Buff +16% attack rate - A3 (Cost 300): “Cytokine Burst” – periodic +30% rate for 2 s (cooldown 10 s)
Upgrade Path B – “Targeting Intel” (precision) - B1 (Cost 140): Buff becomes +12% rate and +8% range - B2 (Cost 220): Revealed enemies take +10% damage - B3 (Cost 310): “Expose Weakness” – revealed enemies are auto-marked for +12% damage (separate from Antibody mark)
6) NET Trap (Area Denial)
Role: wave stabilization; converts burst pressure into manageable flow.
Base Stats - Cost: 140 - Placement: on path - Radius: 55 px - Effect: 35% slow for 3.0 s - Cooldown: 8.0 s - Notes: no direct damage.
Upgrade Path A – “Stronger Web” (more slow) - A1 (Cost 120): Slow 45% - A2 (Cost 190): Duration 4.0 s - A3 (Cost 280): Adds Root: 0.5 s at application (elite/boss: 0.2 s)
Upgrade Path B – “Wider Coverage” (area control) - B1 (Cost 120): Radius 70 px - B2 (Cost 200): Cooldown 6.5 s - B3 (Cost 280): Leaves residual slow zone (25% slow) for 3 s after trap ends
Late Game Towers (for later chapters) 7) Memory Cell (Scaling Support)
Role: meta-scaling inside a run; rewards survival.
Base Stats - Cost: 220 - Aura radius: 150 px - Passive: after each wave, gain 1 stack (max 15) - Each stack: +1% damage for nearby towers
   3

Upgrades focus on faster stacking and higher cap.
8) Complement Node (Synergy Amplifier) Role: big payoff for marking/chain setups.
Base Stats - Cost: 260 - Range: 160 px - Damage/Hit: 8 - Rate: 1.0 /s - Mechanic: if target is marked, damage chains to 1 additional marked enemy (within 55 px) for 60% damage
Upgrades expand chain count and chain damage.
Economy Benchmarks (Prototype)
To keep pacing Bloons-like (constant small upgrades): - Early waves: expected income 150–250 total - Mid waves: 300–450 total - Mini-boss: 70–120 bonus
Sanity checks (Level 1): - Starting cash supports 2 Neutrophils (140) or 1 Macrophage (100) + 1 Neutrophil (70) after Wave 1. - Basic Virus (18 HP) should die to 1 Neutrophil in ~1.8 s of sustained fire; curves amplify this.
Implementation Notes (for Code)
Represent each tower as a JSON-like object: - id, name, cost - stats (range, damage, rate, pierce, aoeRadius) - status (slow%, slowDur, mark%, markDur) - tags[] (DPS/CC/SUPPORT/UTILITY) - upgrades: { pathA: [..], pathB: [..] }
Versioning
• v0.1: Baseline prototype stats designed to feel like a standard tower defense economy.
This file is intended to be attached alongside the Enemy Stat Tables + Level files for implementation chats.
    4
