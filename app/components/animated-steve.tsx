import type { ReactElement } from "react";

/* Steve, as 1-pixel-per-cell pixel art in profile. Every limb is its own
   group so the arms and legs can swing from the shoulder/hip in CSS (see the
   `.steve-*` rules in globals.css). It's all static markup — no client JS. */

const COLORS: Record<string, string> = {
  H: "#3a2a1a", // hair
  S: "#c4906b", // skin
  s: "#a87752", // skin shade
  W: "#ffffff", // eye white
  I: "#4b3fa5", // iris
  M: "#6b4630", // stubble
  T: "#2cb0b0", // shirt
  t: "#1f8f8f", // shirt shade
  P: "#423f9c", // trousers
  p: "#312f7c", // trousers shade
  B: "#5c5c5c", // shoes
};

// Head is 8×8, facing right.
const HEAD = [
  "HHHHHHHH",
  "HHHHHHHH",
  "HHHSSSSS",
  "HHHSSSSS",
  "HHSSSSWI",
  "HSSSSSSS",
  "HSSSSSSS",
  "sSSSSMMM",
];

const TORSO = Array.from({ length: 12 }, () => "tTTT");

// Arm: short sleeve over four rows, bare skin below.
const ARM = [...Array.from({ length: 4 }, () => "tTTT"), ...Array.from({ length: 8 }, () => "sSSS")];

// Leg: trousers down to the ankle, then shoes.
const LEG = [...Array.from({ length: 10 }, () => "pPPP"), "BBBB", "BBBB"];

function pixels(rows: string[], ox: number, oy: number): ReactElement[] {
  const rects: ReactElement[] = [];
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      const fill = COLORS[ch];
      if (fill) rects.push(<rect key={`${x},${y}`} x={ox + x} y={oy + y} width="1" height="1" fill={fill} />);
    });
  });
  return rects;
}

/// Far-side limbs are drawn a little darker so the near ones read in front.
const FAR = { filter: "brightness(0.72)" };

/// A pixel Steve who paces back and forth along the bottom of the page,
/// behind the content — the launcher's mascot, walking the grass.
export function AnimatedSteve() {
  return (
    // Both timelines start 14s in, so Steve is already mid-walk on first load
    // instead of the page opening on an empty stage.
    <div aria-hidden className="steve-walker pointer-events-none fixed bottom-2 left-0 -z-10" style={{ animationDelay: "-14s" }}>
      <div className="steve-flip" style={{ filter: "brightness(0.88)", animationDelay: "-14s" }}>
        <svg
          viewBox="0 0 16 33"
          shapeRendering="crispEdges"
          className="h-16 w-8 sm:h-24 sm:w-12"
          style={{ overflow: "visible" }}
        >
          <ellipse cx="8" cy="32.4" rx="5.5" ry="1" fill="black" opacity="0.4" />

          <g className="steve-body">
            <g className="steve-arm-b" style={FAR}>
              {pixels(ARM, 6, 8)}
            </g>
            <g className="steve-leg-b" style={FAR}>
              {pixels(LEG, 6, 20)}
            </g>
            <g>{pixels(TORSO, 6, 8)}</g>
            <g>{pixels(HEAD, 4, 0)}</g>
            <g className="steve-leg-a">{pixels(LEG, 6, 20)}</g>
            <g className="steve-arm-a">{pixels(ARM, 6, 8)}</g>
          </g>
        </svg>
      </div>
    </div>
  );
}
