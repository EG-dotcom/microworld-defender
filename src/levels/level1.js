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
      { count: 10, interval: 0.8, enemy: { hp: 30, speed: 90, radius: 14 } },
      { count: 14, interval: 0.7, enemy: { hp: 40, speed: 95, radius: 14 } }
    ]
  };

  window.MWD = window.MWD || {};
  window.MWD.levels = window.MWD.levels || {};
  window.MWD.levels.level1 = level1;
})();
