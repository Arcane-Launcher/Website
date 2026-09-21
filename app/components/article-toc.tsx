"use client";

import { useEffect, useState } from "react";
import type { Heading } from "./content-blocks";

/// The "On this page" outline beside a long article: highlights the section
/// currently crossing the top of the viewport. Its links are same-page anchors,
/// which SmoothScroll turns into a glide that lands below the floating header.
export function ArticleToc({ items }: { items: Heading[] }) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    const els = items.map((item) => document.getElementById(item.id)).filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;

    // A heading counts as current once it passes under the header and stays so
    // until the next one does: watch a thin band near the top of the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-110px 0px -70% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page" className="sticky top-28">
      <p className="mb-3 text-[11px] font-bold tracking-[0.18em] text-white uppercase">On this page</p>
      <ul className="flex flex-col border-l border-border">
        {items.map((item) => {
          const current = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={current ? "location" : undefined}
                className={`-ml-px block border-l py-1.5 pl-4 text-[13px] leading-snug no-underline transition-colors ${
                  current ? "border-accent font-semibold text-white" : "border-transparent text-muted hover:text-white"
                }`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
