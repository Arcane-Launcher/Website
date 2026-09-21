"use client";

import { useEffect } from "react";
import gsap from "gsap";

/// Runs once per page load: fades in the page "chrome" (header bar, nav
/// links, hero CTA, footer — anything marked `data-reveal-group`) in a
/// staggered sequence, then starts a subtle glow pulse on anything marked
/// `data-glow-pulse`. The hero background/copy is already visible on first
/// paint (see AnimatedBackground / Hero) — this only staggers the chrome
/// layered on top of it.
const GROUP_ORDER = ["header-bar", "nav-links", "hero-cta", "footer"];
const STAGGER_S = 0.13;
const START_DELAY_S = 0.18;

export function PageLoadReveal() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const groups = GROUP_ORDER.map((key) => Array.from(document.querySelectorAll<HTMLElement>(`[data-reveal-group="${key}"]`)));
    const glowEls = Array.from(document.querySelectorAll<HTMLElement>("[data-glow-pulse]"));

    if (prefersReducedMotion) return;
    if (!groups.some((els) => els.length)) return;

    let cancelled = false;

    const run = () => {
      if (cancelled) return;

      const ctx = gsap.context(() => {
        groups.forEach((els) => {
          if (els.length) gsap.set(els, { opacity: 0 });
        });

        const tl = gsap.timeline({ delay: START_DELAY_S });
        groups.forEach((els, i) => {
          if (!els.length) return;
          tl.to(els, { opacity: 1, duration: 0.5, ease: "power2.out" }, i * STAGGER_S);
        });

        if (glowEls.length) {
          tl.call(() => {
            gsap.to(glowEls, {
              "--glow": "20px",
              duration: 2.6,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            });
          });
        }
      });

      return () => ctx.revert();
    };

    let cleanup: (() => void) | undefined;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        cleanup = run();
      });
    } else {
      cleanup = run();
    }

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return null;
}
