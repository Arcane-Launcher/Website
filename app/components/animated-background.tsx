"use client";

import { useEffect, useRef } from "react";
import { TEX } from "../lib/block-textures";

interface BlockFaces {
  side: string;
  top: string;
  bottom: string;
}

const uniform = (t: string): BlockFaces => ({ side: t, top: t, bottom: t });

const BLOCKS = {
  grass: { side: TEX.grassSide, top: TEX.grassTop, bottom: TEX.dirt },
  dirt: uniform(TEX.dirt),
  stone: uniform(TEX.stone),
  diamond: uniform(TEX.diamond),
  redstone: uniform(TEX.redstone),
  gold: uniform(TEX.gold),
  planks: uniform(TEX.planks),
} satisfies Record<string, BlockFaces>;

/* ------------------------------------------------------------------------ *
 * Floating blocks.
 * ------------------------------------------------------------------------ */

// Front, right, back, left, top, bottom.
const FACE_TRANSFORMS = [
  "rotateY(0deg)",
  "rotateY(90deg)",
  "rotateY(180deg)",
  "rotateY(-90deg)",
  "rotateX(90deg)",
  "rotateX(-90deg)",
];
// Per-face brightness so the block reads as lit from above.
const FACE_SHADE = [1, 0.74, 0.52, 0.74, 1.15, 0.4];

interface CubeSpec {
  block: keyof typeof BLOCKS;
  size: number;
  pos: { left?: string; right?: string; top: string };
  spin: number; // seconds per full turn
  float: number; // seconds per bob
  offset: number; // negative animation delay so blocks don't move in lockstep
  tilt: number; // always negative: we look down on the block so tops show
  blur?: number; // far blocks are soft
  opacity: number;
  hideOnMobile?: boolean;
}

const CUBES: CubeSpec[] = [
  { block: "grass", size: 92, pos: { left: "5%", top: "16%" }, spin: 46, float: 8, offset: 3, tilt: -26, opacity: 0.95 },
  { block: "diamond", size: 54, pos: { left: "15%", top: "64%" }, spin: 34, float: 6, offset: 9, tilt: -30, blur: 1, opacity: 0.8 },
  { block: "redstone", size: 132, pos: { right: "5%", top: "24%" }, spin: 62, float: 9, offset: 14, tilt: -22, opacity: 0.9, hideOnMobile: true },
  { block: "gold", size: 46, pos: { right: "17%", top: "70%" }, spin: 30, float: 7, offset: 6, tilt: -28, opacity: 0.85 },
  { block: "dirt", size: 74, pos: { right: "31%", top: "8%" }, spin: 52, float: 10, offset: 20, tilt: -32, blur: 2, opacity: 0.45, hideOnMobile: true },
  { block: "planks", size: 38, pos: { left: "31%", top: "80%" }, spin: 28, float: 6, offset: 11, tilt: -24, blur: 2, opacity: 0.5, hideOnMobile: true },
];

function Cube({ spec }: { spec: CubeSpec }) {
  const half = spec.size / 2;
  const faces = BLOCKS[spec.block];
  const textures = [faces.side, faces.side, faces.side, faces.side, faces.top, faces.bottom];
  return (
    <div
      className={`absolute ${spec.hideOnMobile ? "max-md:hidden" : ""}`}
      style={{
        ...spec.pos,
        width: spec.size,
        height: spec.size,
        opacity: spec.opacity,
        filter: spec.blur ? `blur(${spec.blur}px)` : undefined,
      }}
    >
      {/* Each block gets its own perspective, so the 3D never depends on where it sits on screen. */}
      <div
        className="gbg-float h-full w-full"
        style={{ perspective: 900, animationDuration: `${spec.float}s`, animationDelay: `-${spec.offset}s` }}
      >
        <div
          className="gbg-spin h-full w-full"
          style={
            {
              transformStyle: "preserve-3d",
              animationDuration: `${spec.spin}s`,
              animationDelay: `-${spec.offset * 3}s`,
              "--tilt": `${spec.tilt}deg`,
            } as React.CSSProperties
          }
        >
          {FACE_TRANSFORMS.map((t, i) => (
            <div
              key={i}
              className="absolute inset-0"
              style={{
                transform: `${t} translateZ(${half}px)`,
                backgroundImage: textures[i],
                backgroundSize: "100% 100%",
                imageRendering: "pixelated",
                filter: `brightness(${FACE_SHADE[i]})`,
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.28)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ *
 * Grass field, scrolling toward the viewer under a dark night sky.
 * ------------------------------------------------------------------------ */

function GrassField() {
  return (
    <>
      {/* Dusk glow along the horizon. */}
      <div
        className="absolute inset-x-0 bottom-[40vh] h-44"
        style={{ background: "radial-gradient(50% 100% at 50% 100%, rgba(255, 110, 70, 0.16), transparent)" }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[46vh] overflow-hidden"
        style={{
          perspective: 460,
          perspectiveOrigin: "50% 0%",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 45%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 45%)",
        }}
      >
        {/* The plane tilts back from its bottom edge, so the top recedes to the horizon. */}
        <div
          className="absolute bottom-0 left-1/2 h-[240%] w-[400%] origin-bottom"
          style={{ transform: "translateX(-50%) rotateX(72deg)" }}
        >
          <div
            className="gbg-floor absolute inset-x-0 bottom-0 -top-16"
            style={{ backgroundImage: TEX.grassTop, backgroundSize: "64px 64px", imageRendering: "pixelated" }}
          />
        </div>
        {/* Night: darken the whole field so it sits behind the page. */}
        <div className="absolute inset-0" style={{ background: "rgba(4, 6, 10, 0.68)" }} />
      </div>
    </>
  );
}

/* ------------------------------------------------------------------------ *
 * Blocky clouds and a square moon.
 * ------------------------------------------------------------------------ */

const CLOUD_SHAPES = [
  ["..XXXX....", ".XXXXXXX..", "XXXXXXXXXX", ".XXXXXXXX."],
  ["...XXX......", ".XXXXXXX....", "XXXXXXXXXXX.", ".XXXXXXXXXXX", "...XXXXX...."],
  ["XXXX....", "XXXXXX..", ".XXXXXXX", "..XXXX.."],
];

function cloudImage(rows: string[]): string {
  let rects = "";
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch === "X") rects += `<rect x='${x}' y='${y}' width='1' height='1' fill='white'/>`;
    });
  });
  const w = rows[0].length;
  return `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${rows.length}' shape-rendering='crispEdges'>${rects}</svg>")`;
}

const CELL = 22;

const CLOUDS = [
  { shape: 0, top: "9%", duration: 170, delay: 20, opacity: 0.05 },
  { shape: 1, top: "21%", duration: 230, delay: 120, opacity: 0.04 },
  { shape: 2, top: "34%", duration: 200, delay: 60, opacity: 0.045 },
  { shape: 0, top: "52%", duration: 260, delay: 190, opacity: 0.03 },
];

function Sky() {
  return (
    <>
      {CLOUDS.map((c, i) => {
        const rows = CLOUD_SHAPES[c.shape];
        return (
          <div
            key={i}
            className="gbg-cloud absolute left-0"
            style={{
              top: c.top,
              width: rows[0].length * CELL,
              height: rows.length * CELL,
              backgroundImage: cloudImage(rows),
              backgroundSize: "100% 100%",
              imageRendering: "pixelated",
              opacity: c.opacity,
              animationDuration: `${c.duration}s`,
              animationDelay: `-${c.delay}s`,
            }}
          />
        );
      })}
      {/* Minecraft's moon is a square. */}
      <div
        className="absolute top-[6%] right-[6%] h-14 w-14 max-md:hidden"
        style={{ background: "#e9e7da", opacity: 0.5, boxShadow: "0 0 80px 12px rgba(233, 231, 218, 0.22)" }}
      >
        <div className="absolute top-2.5 left-3 h-3 w-3 bg-[#cfcdbd]" />
        <div className="absolute right-3 bottom-3 h-2.5 w-2.5 bg-[#cfcdbd]" />
        <div className="absolute right-2 top-5 h-2 w-2 bg-[#d8d6c6]" />
      </div>
    </>
  );
}

/* ------------------------------------------------------------------------ *
 * Canvas: twinkling pixel stars, plus sparks drifting up — a mix of the
 * accent colour and lime-green XP orbs.
 * ------------------------------------------------------------------------ */

interface Spark {
  x: number;
  y: number;
  vy: number;
  sway: number;
  swaySpeed: number;
  phase: number;
  px: number; // pixel size
  life: number;
  maxLife: number;
  xp: boolean;
}

interface Star {
  x: number;
  y: number;
  phase: number;
  px: number;
}

const XP_RGB = "168, 255, 60";

function accentRgb(): string {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(raw);
  return m ? `${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}` : "239, 59, 77";
}

function SkyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const accent = accentRgb();
    let w = 0;
    let h = 0;
    let sparks: Spark[] = [];
    let stars: Star[] = [];
    let raf = 0;
    let last = 0;

    const spawn = (anywhere: boolean): Spark => {
      const maxLife = 8 + Math.random() * 9;
      return {
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : h + 10,
        vy: 12 + Math.random() * 26,
        sway: 8 + Math.random() * 22,
        swaySpeed: 0.2 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        px: Math.random() > 0.7 ? 3 : 2,
        life: anywhere ? Math.random() * maxLife : 0,
        maxLife,
        xp: Math.random() < 0.35,
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const sparkCount = Math.round(Math.min(56, Math.max(20, (w * h) / 32000)));
      sparks = Array.from({ length: sparkCount }, () => spawn(true));
      const starCount = Math.round(Math.min(90, Math.max(30, (w * h) / 14000)));
      stars = Array.from({ length: starCount }, () => ({
        x: Math.round(Math.random() * w),
        y: Math.round(Math.random() * h * 0.62),
        phase: Math.random() * Math.PI * 2,
        px: Math.random() > 0.85 ? 3 : 2,
      }));
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);

      ctx.globalCompositeOperation = "source-over";
      for (const s of stars) {
        const twinkle = 0.5 + 0.5 * Math.sin(time * 0.0015 + s.phase * 3);
        ctx.fillStyle = `rgba(255, 255, 255, ${(0.1 + twinkle * 0.5).toFixed(3)})`;
        ctx.fillRect(s.x, s.y, s.px, s.px);
      }

      ctx.globalCompositeOperation = "lighter";
      for (const s of sparks) {
        const t = s.life / s.maxLife;
        const envelope = Math.min(1, t * 6) * Math.min(1, (1 - t) * 3);
        const flicker = 0.6 + 0.4 * Math.sin(time * 0.004 + s.phase * 4);
        const alpha = Math.max(0, envelope * flicker);
        // Snap to whole pixels so the squares stay crisp.
        const x = Math.round(s.x + Math.sin(time * 0.001 * s.swaySpeed + s.phase) * s.sway);
        const y = Math.round(s.y);
        const rgb = s.xp ? XP_RGB : accent;
        ctx.fillStyle = `rgba(${rgb}, ${(alpha * 0.16).toFixed(3)})`;
        ctx.fillRect(x - s.px, y - s.px, s.px * 3, s.px * 3);
        ctx.fillStyle = `rgba(${rgb}, ${(alpha * 0.95).toFixed(3)})`;
        ctx.fillRect(x, y, s.px, s.px);
      }
    };

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      for (let i = 0; i < sparks.length; i++) {
        const s = sparks[i];
        s.life += dt;
        s.y -= s.vy * dt;
        if (s.life >= s.maxLife || s.y < -10) sparks[i] = spawn(false);
      }
      draw(now);
      raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (reduceMotion || raf) return;
      last = performance.now();
      raf = requestAnimationFrame(step);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    resize();
    if (reduceMotion) draw(0);
    else start();

    let resizePending = false;
    const onResize = () => {
      if (resizePending) return;
      resizePending = true;
      requestAnimationFrame(() => {
        resizePending = false;
        resize();
        if (reduceMotion) draw(0);
      });
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}

/* ------------------------------------------------------------------------ */

export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* Crimson glow pooling at the top keeps the site's brand colour in the sky. */}
      <div
        className="arcane-aurora absolute -top-1/4 left-1/2 h-[80vh] w-[140vw] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(50% 55% at 50% 40%, rgba(var(--accent-rgb), 0.24), transparent 70%), radial-gradient(30% 40% at 80% 55%, rgba(var(--accent-rgb), 0.09), transparent 70%)",
        }}
      />

      <Sky />
      <GrassField />

      {CUBES.map((spec, i) => (
        <Cube key={i} spec={spec} />
      ))}

      <SkyCanvas />

      {/* Edge vignette keeps the corners deep and text contrast steady. */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 85% 75% at 50% 45%, transparent 50%, rgba(0,0,0,0.6) 100%)" }}
      />
    </div>
  );
}
