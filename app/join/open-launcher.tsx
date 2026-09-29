"use client";

import { useEffect } from "react";

/// Tries the arcane:// link once on arrival, so a player who has the
/// launcher lands straight in its Join dialog. The browser asks first; the
/// buttons on the page stay for anyone who dismisses that or doesn't have it.
export function OpenLauncher({ href }: { href: string }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = href;
    }, 400);
    return () => clearTimeout(timer);
  }, [href]);
  return null;
}
