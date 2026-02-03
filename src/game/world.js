(function () {
  // Ensure namespace exists and is an object
  if (!window.MWD || typeof window.MWD !== "object") window.MWD = {};
  const M = window.MWD;

  // World config (kept as constants so later we can parameterize by level)
  const TILE = 32;
  const COLS = 26;
  const ROWS = 16;
  const GRID_OFFSET_X = 20;
  const GRID_OFFSET_Y = 20;

  // Define world object
  M.world = {
    TILE,
    COLS,
    ROWS,
    GRID_OFFSET_X,
    GRID_OFFSET_Y,

    // Derived canvas size (used by main.js)
    WIDTH: GRID_OFFSET_X * 2 + COLS * TILE,
    HEIGHT: GRID_OFFSET_Y * 2 + ROWS * TILE,

    // Grid bounds
    isInGrid(gx, gy) {
      return gx >= 0 && gx < COLS && gy >= 0 && gy < ROWS;
    },

    // Grid -> pixel conversions
    gridToPixelTopLeft(gx, gy) {
      return {
        x: GRID_OFFSET_X + gx * TILE,
        y: GRID_OFFSET_Y + gy * TILE
      };
    },

    gridToPixelCenter(gx, gy) {
      return {
        x: GRID_OFFSET_X + gx * TILE + TILE / 2,
        y: GRID_OFFSET_Y + gy * TILE + TILE / 2
      };
    },

    // Pixel -> grid conversion
    pixelToGrid(px, py) {
      return {
        x: Math.floor((px - GRID_OFFSET_X) / TILE),
        y: Math.floor((py - GRID_OFFSET_Y) / TILE)
      };
    }
  };

  // Hard verification (so we never waste time again)
  if (!M.world || typeof M.world.WIDTH !== "number") {
    throw new Error("world.js: failed to initialize MWD.world");
  }

  console.log("world.js loaded OK", M.world);
})();
