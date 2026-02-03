// src/levels/level1.js
(function () {
  const level1 = {
    name: "Level 1",

    // REQUIRED: grid path tiles (must be at least 2)
    // This is a simple straight path across row 6.
    path: [
      { x: 0, y: 6 }, { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 4, y: 6 },
      { x: 5, y: 6 }, { x: 6, y: 6 }, { x: 7, y: 6 }, { x: 8, y: 6 }, { x: 9, y: 6 },
      { x: 10, y: 6 }, { x: 11, y: 6 }, { x: 12, y: 6 }, { x: 13, y: 6 },
      { x: 14, y: 6 }, { x: 15, y: 6 }, { x: 16, y: 6 }, { x: 17, y: 6 },
      { x: 18, y: 6 }, { x: 19, y: 6 }
    ],

    // OPTIONAL but needed for waves
    waves: [
      // Gentle ramp: start with small FAST waves, then introduce armored/shielded, then elite/stealth.
      { count: 6,  interval: 1.4, enemy: { color: "#ff5a5a" } }, // Basic Virus (very gentle)
      { count: 8,  interval: 1.2, enemy: { color: "#ff5a5a" } }, // Basic Virus
      { count: 10, interval: 1.05, enemy: { color: "#ff5a5a" } }, // Basic Virus
      { count: 10, interval: 0.95, enemy: { color: "#ff5a5a" } }, // Basic Virus
      { count: 12, interval: 0.9, enemy: { color: "#ff5a5a" } }, // Basic Virus
      { count: 8,  interval: 1.0, enemy: { color: "#a0a0a0" } }, // Bacterium
      { count: 6,  interval: 1.1, enemy: { color: "#7d5cff" } }, // Encapsulated Bacterium
      { count: 5,  interval: 1.2, enemy: { color: "#ffb347" } }, // Protozoan Parasite
      { count: 6,  interval: 0.9, enemy: { color: "#8a5cff" } }  // Toxin Droplet (Stealth)
    ]
  };

  window.MWD = window.MWD || {};
  window.MWD.levels = window.MWD.levels || {};
  window.MWD.levels.level1 = level1;
})();
