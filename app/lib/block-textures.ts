/* ------------------------------------------------------------------------ *
 * Block textures — 16×16 pixel art painted from seeded noise, so the
 * server-rendered markup matches the client's exactly (no hydration
 * mismatch), no image files are needed, and no Math.random is used in render.
 *
 * Each texture is a CSS `url(...)` value, ready to drop into
 * `backgroundImage` (pair it with `imageRendering: "pixelated"`). Shared by
 * the animated background and the footer.
 * ------------------------------------------------------------------------ */

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

type Paint = (x: number, y: number, rnd: () => number) => string;

/// Paints a 16×16 texture; `paint` returns a hex colour (no `#`) per pixel.
function texture(seed: number, paint: Paint): string {
  const rnd = seeded(seed);
  let rects = "";
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      rects += `<rect x='${x}' y='${y}' width='1' height='1' fill='%23${paint(x, y, rnd)}'/>`;
    }
  }
  return `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'>${rects}</svg>")`;
}

const pick = (palette: string[], r: number) => palette[Math.floor(r * palette.length)];

const GRASS = ["5b8c2a", "6a9b32", "4f7d24", "79ab3c", "436b1d"];
const DIRT = ["6b4a2e", "7a5636", "5c3f27", "8a6440", "503722"];
const STONE = ["7d7d7d", "8a8a8a", "6f6f6f", "969696", "626262"];
const PLANK = ["b8945a", "c0a065", "a9864f", "b28d55"];

/// How far the green fringe hangs down each column of a grass block's side.
const FRINGE = [4, 3, 4, 5, 3, 4, 4, 3, 5, 4, 3, 4, 4, 5, 3, 4];

/// Little 2×2-ish ore clusters, shared by every ore texture.
const ORE_SPOTS = new Set(
  [
    [3, 3], [4, 3], [3, 4], [10, 2], [11, 2], [10, 3], [6, 9], [7, 9], [7, 10], [6, 10],
    [12, 11], [13, 11], [12, 12], [2, 12], [3, 12], [9, 13],
  ].map(([x, y]) => `${x},${y}`),
);

const ore = (seed: number, shades: [string, string]) =>
  texture(seed, (x, y, rnd) => {
    const stone = pick(STONE, rnd());
    return ORE_SPOTS.has(`${x},${y}`) ? shades[(x + y) % 2] : stone;
  });

export const TEX = {
  grassTop: texture(11, (_x, _y, rnd) => pick(GRASS, rnd())),
  dirt: texture(23, (_x, _y, rnd) => pick(DIRT, rnd())),
  grassSide: texture(37, (x, y, rnd) => {
    const g = pick(GRASS, rnd());
    const d = pick(DIRT, rnd());
    return y < FRINGE[x] ? g : d;
  }),
  stone: texture(41, (_x, _y, rnd) => pick(STONE, rnd())),
  diamond: ore(53, ["4fe3e0", "2bc4c0"]),
  redstone: ore(61, ["ef3b4d", "ff5064"]),
  gold: ore(71, ["f5d442", "e0b030"]),
  planks: texture(83, (_x, y, rnd) => (y % 4 === 3 ? "7a5a30" : pick(PLANK, rnd()))),
};
