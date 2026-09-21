"use client";

import { useSyncExternalStore } from "react";
import { MetalBadge } from "metal-fx";

const subscribeNoop = () => () => {};

// MetalBadge's Figma metrics: 45×25 at scale 1.
const BASE_W = 45;
const BASE_H = 25;

/// "Beta" pill with the liquid-metal rim from metal-fx. metal-fx ships no
/// "use client" marker, so this wrapper lets server components render it.
/// The effect only mounts after hydration (its server markup differs from the
/// client's, which caused a hydration mismatch), with a same-size placeholder
/// holding the space so nothing shifts. The site is always dark, so the theme
/// is pinned rather than following the OS setting.
export function BetaBadge({ scale = 1 }: { scale?: number }) {
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);

  return (
    <span className="inline-flex shrink-0" title="Arcane Launcher is in beta">
      {mounted ? (
        <MetalBadge theme="dark" scale={scale}>
          Beta
        </MetalBadge>
      ) : (
        <span aria-hidden style={{ width: BASE_W * scale, height: BASE_H * scale }} />
      )}
    </span>
  );
}
