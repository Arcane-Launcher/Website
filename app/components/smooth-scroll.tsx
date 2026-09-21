"use client";

// Lenis's own stylesheet: without it `html { height: 100% }` (see globals.css)
// keeps applying, and the `data-lenis-prevent` / stopped-state rules are missing.
import "lenis/dist/lenis.css";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/// A same-page link like `/#faq` or `#features`, resolved to its target element.
/// Returns null for anything that should keep its normal browser/Next behavior:
/// other pages, other origins, new-tab and download links, or a missing target.
function sameDocumentAnchor(event: MouseEvent): { url: URL; target: HTMLElement } | null {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;

  const link = (event.target as Element | null)?.closest?.("a[href]");
  if (!(link instanceof HTMLAnchorElement)) return null;
  if ((link.target && link.target !== "_self") || link.hasAttribute("download")) return null;

  const url = new URL(link.href, window.location.href);
  if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || url.hash.length < 2) return null;

  const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
  return target ? { url, target } : null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // stopInertiaOnNavigate: clicking a link to another page cancels any glide
    // still in flight. Otherwise the leftover momentum keeps pushing the *new*
    // page toward the old scroll target, so it opens scrolled down (or pinned
    // to its bottom) instead of at the top.
    const lenis = new Lenis({ autoRaf: false, stopInertiaOnNavigate: true });
    lenisRef.current = lenis;

    const syncScrollTrigger = () => ScrollTrigger.update();
    const driveLenis = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", syncScrollTrigger);
    gsap.ticker.add(driveLenis);
    gsap.ticker.lagSmoothing(0);

    // Same-page anchors (header "Features"/"FAQ"/"Download", hero "See features")
    // glide instead of jumping. Lenis's own `anchors` option doesn't cancel the
    // browser's native jump, so the page would snap and then animate back; this
    // takes the click over completely (which also stops Next's Link from
    // scrolling) and keeps the hash in the URL. Lenis honors the CSS
    // scroll-padding-top that keeps the target below the floating header.
    const onClick = (event: MouseEvent) => {
      if (lenis.prefersReducedMotion) return;
      const anchor = sameDocumentAnchor(event);
      if (!anchor) return;

      event.preventDefault();
      if (window.location.hash !== anchor.url.hash) {
        window.history.pushState(null, "", anchor.url.pathname + anchor.url.search + anchor.url.hash);
      }
      lenis.scrollTo(anchor.target, { duration: 1.2 });
    };
    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      gsap.ticker.remove(driveLenis);
      lenis.off("scroll", syncScrollTrigger);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Navigation that didn't come from a click (a redirect, router.push, back/forward)
  // can still land mid-glide. Stop then start is Lenis's public way of dropping the
  // old animation and re-syncing to wherever the page actually is.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    lenis.stop();
    lenis.start();
  }, [pathname]);

  return <>{children}</>;
}
