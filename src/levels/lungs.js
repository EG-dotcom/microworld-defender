(function () {
  const level = {
    id: "lungs",
    name: "Lungs",
    theme: "lungs",
    difficulty: "medium",
    path: (() => {
      const pts = [
        { x: 0, y: 3 },
        { x: 10, y: 3 },
        { x: 10, y: 6 },
        { x: 4, y: 6 },
        { x: 4, y: 9 },
        { x: 20, y: 9 },
        { x: 20, y: 4 },
        { x: 25, y: 4 }
      ];
      const path = [];
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i];
        const b = pts[i + 1];
        if (i === 0) path.push({ x: a.x, y: a.y });
        const dx = Math.sign(b.x - a.x);
        const dy = Math.sign(b.y - a.y);
        let x = a.x;
        let y = a.y;
        while (x !== b.x || y !== b.y) {
          if (x !== b.x) x += dx;
          else if (y !== b.y) y += dy;
          path.push({ x, y });
        }
      }
      return path;
    })(),
    waves: window.MWD.waveTemplates.buildNormalized([
      { count: 6, interval: 1.0, enemy: { color: "#7d5cff" } },
      { count: 6, interval: 0.85, enemy: { color: "#8a5cff" } },
      { count: 4, interval: 1.1, enemy: { color: "#ffb347" } },
      { count: 4, interval: 1.2, enemy: { color: "#67d46b" } } // Spore Cluster (spawns sporelings)
    ])
  };

  window.MWD = window.MWD || {};
  window.MWD.levels = window.MWD.levels || {};
  window.MWD.levels.lungs = level;
})();
