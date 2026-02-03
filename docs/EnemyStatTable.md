Enemy Stat Tables (v0.1) Scope
This file defines prototype-ready enemy stats for the MicroWorld Defender 2D tower defense.
Design goals: - Stats are tuned for readability and balance in early prototyping. - Values are unit-
consistent and easy to scale. - Enemies are defined by tags + base stats + optional mechanics.
Global Systems & Conventions Time & Movement
• Tick model: continuous (dt-based) simulation
• Enemy speed unit: pixels/second (px/s)
• Default path length assumption (Level 1 prototype): 1000 px
Health & Damage
• Health unit: HP
• Armor: flat damage reduction (per hit) unless otherwise specified • Shield: separate HP layer that must be removed first
Status Effects (Core)
• Slow: multiplies speed by (1 - slow%)
• Marked: increases damage taken by +X% Difficulty Scaling
Use a simple scalar per level and per wave segment: - LevelScalar L: starts at 1.00 in Level 1; +0.12 per level by default - WaveScalar W: within a level, starts at 1.00; +0.05 every 3 waves
Final stats: - HP_final = HP_base × L × W - Speed_final = Speed_base × (1 + 0.03 × (LevelIndex-1))
(speed scales lightly to preserve readability)
Enemy Taxonomy Tag Glossary
• FAST: high speed, low HP
• ARMORED: flat DR per hit
• SWARM: low HP, large counts
  1

• STEALTH: hidden unless revealed
• SHIELDED: extra shield HP
• SPAWNER: emits minions
• ELITE: increased resistances / mechanics • BOSS: unique rules, phase behavior
Base Enemies (Core Set) 1) Basic Virus (FAST)
Role: onboarding enemy; teaches tracking and burst vs swarm.
- HP_base: 18 - Speed_base: 130 px/s - Armor: 0 - Shield: 0 - Leak damage (to player health): 1 - Bounty (currency): 4 - Tags: FAST
Notes: - Designed so 1–2 early towers can handle small batches. 2) Bacterium (ARMORED)
Role: introduces armor and the need for sustained damage/support.
- HP_base: 60 - Speed_base: 85 px/s - Armor: 2 (flat damage reduction per hit) - Shield: 0 - Leak damage: 2 - Bounty: 8 - Tags: ARMORED
3) Encapsulated Bacterium (ARMORED, SHIELDED)
Role: forces the player to invest in debuffs/synergy.
- HP_base: 75 - Speed_base: 75 px/s - Armor: 3 - Shield: 25 - Leak damage: 3 - Bounty: 11 - Tags: ARMORED, SHIELDED
4) Protozoan Parasite (TANK)
Role: “mini-tank” that tests single-target damage.
- HP_base: 220 - Speed_base: 55 px/s - Armor: 1 - Shield: 0 - Leak damage: 5 - Bounty: 20 - Tags: ELITE
5) Toxin Droplet (FAST, STEALTH)
Role: stealth intro; teaches detection towers.
- HP_base: 28 - Speed_base: 150 px/s - Armor: 0 - Shield: 0 - Leak damage: 2 - Bounty: 7 - Tags: FAST, STEALTH
Mechanic: - Invisible unless within reveal radius of Dendritic Cell or equivalent.
      2

6) Spore Cluster (SWARM, SPAWNER)
Role: punishes low AoE; creates urgency spikes.
- HP_base: 90 - Speed_base: 70 px/s - Armor: 0 - Shield: 0 - Leak damage: 3 - Bounty: 14 - Tags: SWARM, SPAWNER
Mechanic: - On death, spawns 3 Sporelings. Sporeling (SWARM)
• HP_base: 12
• Speed_base: 125 px/s • Armor: 0
• Shield: 0
• Leak damage: 1
• Bounty: 2
• Tags: SWARM, FAST
Elite Variants (Optional for Later Levels) Viral Swarm (SWARM)
• HP_base: 14
• Speed_base: 120 px/s • Leak damage: 1
• Bounty: 3
• Tags: SWARM, FAST
Mutant Virus (FAST, ELITE)
• HP_base: 40
• Speed_base: 140 px/s • Armor: 0
• Leak damage: 2
• Bounty: 9
• Tags: FAST, ELITE
Mechanic: - At 50% HP, gains temporary resistance (e.g., -25% damage taken) for 3 seconds.
Boss Templates (System-Level) Boss A: Viral Load Surge (BOSS)
• HP_base: 1600
• Speed_base: 60 px/s
  3

• Armor: 2
• Shield: 200
• Leak damage: 20
• Bounty: 120
• Tags: BOSS, SHIELDED
Phases: 1. Phase 1 (100–60%): normal 2. Phase 2 (60–30%): spawns 2 Basic Viruses every 4 seconds 3. Phase 3 (30–0%): speed +20%
Implementation Notes (for Code)
Represent each enemy as a JSON-like object: - id, name - baseStats (hp, speed, armor, shield) - leakDamage, bounty - tags[] - mechanics[] (optional)
Scaling is applied at spawn time: - apply levelScalar and waveScalar to hp (and optionally bounty) - apply gentle speed scaling
Versioning
• v0.1: Prototype baseline stats for early testing and rapid iteration.
This file is meant to be attached alongside the GDD + Level files for implementation chats.
  4
