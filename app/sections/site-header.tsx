"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@heroui/react";
import { BetaBadge } from "../components/beta-badge";

type NavItem = { label: string; href: string; id: "features" | "news" | "faq" };

const NAV_ITEMS: NavItem[] = [
  { label: "Features", href: "/#features", id: "features" },
  { label: "News", href: "/news", id: "news" },
  { label: "FAQ", href: "/#faq", id: "faq" },
];

const SECTION_IDS = ["features", "faq"] as const;

// Scrolled = past the top of the page; drives the pill's firmer background.
const subscribeScroll = (cb: () => void) => {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
};
const getScrolled = () => window.scrollY > 8;
const getScrolledServer = () => false;

/// Which home-page section is crossing the middle of the viewport, so the
/// matching nav link can light up while scrolling.
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
          else setActive((current) => (current === entry.target.id ? null : current));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [enabled]);

  return enabled ? active : null;
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const scrolled = useSyncExternalStore(subscribeScroll, getScrolled, getScrolledServer);
  const activeSection = useActiveSection(pathname === "/");

  // The menu remembers which page it was opened on, so navigating anywhere
  // closes it without an effect.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const menuOpen = openOn === pathname;
  const closeMenu = () => setOpenOn(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenOn(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const activeId = pathname.startsWith("/news") ? "news" : activeSection;

  return (
    <header className="site-header z-40 px-3 pt-3 sm:px-6 sm:pt-4" data-scrolled={scrolled}>
      <div className="nav-pill mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 rounded-full py-2 pr-2 pl-4">
        <div data-reveal-group="header-bar" className="flex min-w-0 items-center gap-3">
          <NextLink href="/" onClick={closeMenu} aria-label="Arcane Launcher home" className="flex items-center gap-2.5 no-underline">
            <Image src="/logo.png" alt="" width={28} height={28} quality={100} className="rounded-lg" priority />
            <span className="text-sm font-bold tracking-wide whitespace-nowrap text-white">
              ARCANE <span className="font-normal text-muted">LAUNCHER</span>
            </span>
          </NextLink>
          <BetaBadge scale={1.3} />
        </div>

        <div data-reveal-group="nav-links" className="flex items-center gap-1">
          <nav aria-label="Main" className="mr-2 hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => {
              const active = activeId === item.id;
              return (
                <NextLink
                  key={item.id}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative px-3.5 py-2 text-[13px] font-semibold tracking-wide no-underline transition-colors ${
                    active ? "text-white" : "text-muted hover:text-white"
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={`absolute inset-x-3.5 -bottom-px h-px rounded-full bg-accent-strong shadow-[0_0_10px_var(--accent)] transition-opacity duration-300 ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </NextLink>
              );
            })}
          </nav>

          <NextLink
            href="/#download"
            className={buttonVariants({ variant: "primary", size: "sm" }) + " hidden h-10 rounded-full px-5 text-[13px] font-bold no-underline sm:inline-flex"}
          >
            Download
          </NextLink>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setOpenOn(menuOpen ? null : pathname)}
            className="ml-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/6 text-foreground transition-colors hover:bg-white/12 md:hidden"
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="nav-drop mx-auto mt-2 max-w-5xl rounded-3xl border border-border bg-surface/95 p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl md:hidden"
        >
          {NAV_ITEMS.map((item) => {
            const active = activeId === item.id;
            return (
              <NextLink
                key={item.id}
                href={item.href}
                onClick={closeMenu}
                aria-current={active ? "page" : undefined}
                className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-semibold no-underline transition-colors ${
                  active ? "bg-white/8 text-white" : "text-muted hover:bg-white/5 hover:text-foreground"
                }`}
              >
                {item.label}
                <ChevronIcon />
              </NextLink>
            );
          })}
          <NextLink
            href="/#download"
            onClick={closeMenu}
            className={buttonVariants({ variant: "primary" }) + " mt-1 h-12 w-full justify-center rounded-2xl text-sm font-bold no-underline"}
          >
            Download
          </NextLink>
        </nav>
      ) : null}
    </header>
  );
}
