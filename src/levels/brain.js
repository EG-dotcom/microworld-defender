(function () {
  const level = {
    id: "brain",
    name: "Brain",
    theme: "brain",
    difficulty: "hard",
    path: (() => {
      const pts = [
        { x: 0, y: 2 },
        { x: 10, y: 2 },
        { x: 10, y: 12 },
        { x: 4, y: 12 },
        { x: 4, y: 6 },
        { x: 20, y: 6 },
        { x: 20, y: 14 },
        { x: 25, y: 14 }
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
      { count: 10, interval: 0.85, enemy: { color: "#7d5cff" } },
      { count: 8, interval: 0.85, enemy: { color: "#8a5cff" } },
      { count: 6, interval: 1.0, enemy: { color: "#ffb347" } },
      { count: 8, interval: 0.8, enemy: { color: "#7d5cff" } }
    ])
  };

  window.MWD = window.MWD || {};
  window.MWD.levels = window.MWD.levels || {};
  window.MWD.levels.brain = level;
})();
