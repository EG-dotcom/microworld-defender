(function () {
  window.MWD = window.MWD || {};

  function cloneWave(w) {
    return { count: w.count, interval: w.interval, enemy: { ...w.enemy } };
  }

  const baseNormalized = [
    { count: 6, interval: 1.4, enemy: { color: "#ff5a5a" } },
    { count: 8, interval: 1.25, enemy: { color: "#ff5a5a" } },
    { count: 8, interval: 1.15, enemy: { color: "#ff5a5a" } },
    { count: 9, interval: 1.05, enemy: { color: "#ff5a5a" } },
    { count: 8, interval: 1.1, enemy: { color: "#a0a0a0" } },
    { count: 8, interval: 1.05, enemy: { color: "#a0a0a0" } }
  ];

  function buildWaves(extra) {
    const waves = baseNormalized.map(cloneWave);
    if (Array.isArray(extra)) {
      for (let i = 0; i < extra.length; i++) waves.push(cloneWave(extra[i]));
    }
    return waves;
  }

  window.MWD.waveTemplates = {
    buildNormalized: buildWaves
  };
})();
