(function () {
  function createLoop(tickFn) {
    let last = performance.now();

    function frame(now) {
      const dtMs = now - last;
      last = now;

      // clamp to avoid huge jumps if tab unfocused
      const dt = Math.min(dtMs / 1000, 0.05);

      tickFn(dt, dtMs);
      requestAnimationFrame(frame);
    }

    return {
      start() { requestAnimationFrame(frame); }
    };
  }

  window.MWD.loop = { createLoop };
})();
