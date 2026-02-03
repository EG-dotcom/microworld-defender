(function () {
  const level = {
    id: "bloodvessel",
    name: "Blood Vessel",
    theme: "bloodvessel",
    difficulty: "easy",
    path: (() => {
      // Shorter snake with open build space (uses every other row, leaves margins)
      const rows = [2, 5, 8, 11, 14];
      const path = [];
      let dir = 1;
      const xStart = 2;
      const xEnd = 23;
      for (let i = 0; i < rows.length; i++) {
        const y = rows[i];
        if (dir === 1) {
          for (let x = xStart; x <= xEnd; x++) path.push({ x, y });
        } else {
          for (let x = xEnd; x >= xStart; x--) path.push({ x, y });
        }
        if (i < rows.length - 1) {
          const nextY = rows[i + 1];
          const cx = dir === 1 ? xEnd : xStart;
          for (let y2 = y + 1; y2 <= nextY; y2++) path.push({ x: cx, y: y2 });
        }
        dir *= -1;
      }
      return path;
    })(),
    waves: window.MWD.waveTemplates.buildNormalized([
      { count: 6, interval: 1.0, enemy: { color: "#7d5cff" } },
      { count: 6, interval: 0.85, enemy: { color: "#8a5cff" } },
      { count: 4, interval: 1.1, enemy: { color: "#ffb347" } }
    ])
  };

  window.MWD = window.MWD || {};
  window.MWD.levels = window.MWD.levels || {};
  window.MWD.levels.bloodvessel = level;
})();
