(function () {
  const level = {
    id: "nose",
    name: "Nose",
    theme: "nose",
    difficulty: "medium",
    path: (() => {
      const pts = [
        { x: 0, y: 12 },
        { x: 8, y: 12 },
        { x: 8, y: 8 },
        { x: 3, y: 8 },
        { x: 3, y: 4 },
        { x: 12, y: 4 },
        { x: 12, y: 10 },
        { x: 20, y: 10 },
        { x: 20, y: 6 },
        { x: 25, y: 6 }
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
      { count: 8, interval: 0.9, enemy: { color: "#7d5cff" } },
      { count: 6, interval: 0.85, enemy: { color: "#8a5cff" } },
      { count: 5, interval: 1.0, enemy: { color: "#ffb347" } }
    ])
  };

  window.MWD = window.MWD || {};
  window.MWD.levels = window.MWD.levels || {};
  window.MWD.levels.nose = level;
})();
