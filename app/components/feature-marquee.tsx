"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Card } from "@heroui/react";

export type FeatureMarqueeItem = {
  title: string;
  description: string;
};

function FeatureCard({ item, decorative }: { item: FeatureMarqueeItem; decorative?: boolean }) {
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  return (
    <Card
      onMouseMove={handleMove}
      aria-hidden={decorative || undefined}
      variant="default"
      className="spotlight-card group relative w-75 shrink-0 overflow-hidden rounded-2xl border border-border p-5 sm:w-85"
    >
      <div aria-hidden className="spotlight-glow" />
      <div className="relative z-10">
        <Card.Title className="mb-1 text-sm font-bold text-white">{item.title}</Card.Title>
        <Card.Description className="text-sm leading-relaxed text-muted">{item.description}</Card.Description>
      </div>
    </Card>
  );
}

function MarqueeRow({
  items,
  direction,
  duration,
}: {
  items: FeatureMarqueeItem[];
  direction: "left" | "right";
  duration: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      tweenRef.current = gsap.fromTo(
        track,
        { xPercent: direction === "left" ? 0 : -50 },
        { xPercent: direction === "left" ? -50 : 0, duration, ease: "none", repeat: -1 },
      );
    }, track);

    return () => ctx.revert();
  }, [direction, duration]);

  // Doubled so translating the track by exactly -50% loops seamlessly.
  const loop = [...items, ...items];

  return (
    <div
      className="relative overflow-hidden"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
      }}
      onMouseEnter={() => tweenRef.current?.pause()}
      onMouseLeave={() => tweenRef.current?.play()}
    >
      <div ref={trackRef} className="flex w-max gap-4 py-1.5">
        {loop.map((item, i) => (
          <FeatureCard key={`${item.title}-${i}`} item={item} decorative={i >= items.length} />
        ))}
      </div>
    </div>
  );
}

/// Two rows of feature cards, auto-scrolling in opposite directions and
/// pausing on hover — a livelier alternative to a static grid for a long
/// tail of secondary features. Each card also tracks the cursor for a
/// subtle accent-colored spotlight.
export function FeatureMarquee({ items }: { items: FeatureMarqueeItem[] }) {
  const rowA = items.filter((_, i) => i % 2 === 0);
  const rowB = items.filter((_, i) => i % 2 === 1);

  return (
    <div className="flex flex-col gap-4">
      <MarqueeRow items={rowA} direction="left" duration={40} />
      <MarqueeRow items={rowB} direction="right" duration={34} />
    </div>
  );
}
