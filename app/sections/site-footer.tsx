import Image from "next/image";
import NextLink from "next/link";
import { BetaBadge } from "../components/beta-badge";
import { TEX } from "../lib/block-textures";
import { communityLinks } from "../lib/github";

const PIXELATED = { imageRendering: "pixelated" } as const;

type FooterLink = { label: string; href: string; external?: boolean };
type FooterColumn = { title: string; links: FooterLink[] };

const PRODUCT: FooterColumn = {
  title: "Product",
  links: [
    { label: "Features", href: "/#features" },
    { label: "Compare", href: "/compare" },
    { label: "FAQ", href: "/#faq" },
    { label: "Download", href: "/download" },
  ],
};

const RESOURCES: FooterColumn = {
  title: "Resources",
  links: [
    { label: "Changelog", href: "/changelog" },
    { label: "News", href: "/news" },
  ],
};

const LEGAL: FooterColumn = {
  title: "Legal",
  links: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};

/// A Community column only exists when at least one destination is actually
/// configured (see `communityLinks`), so the footer never links to a guess.
function communityColumn(): FooterColumn | null {
  const { github, discord } = communityLinks();
  const links: FooterLink[] = [];
  if (discord) links.push({ label: "Discord", href: discord, external: true });
  if (github) links.push({ label: "GitHub", href: github, external: true });
  return links.length ? { title: "Community", links } : null;
}

// A decorative hotbar: the same block textures as the page background.
const HOTBAR: (string | null)[] = [
  TEX.grassSide,
  TEX.dirt,
  TEX.stone,
  TEX.planks,
  TEX.gold,
  TEX.diamond,
  TEX.redstone,
  null,
  null,
];
const HOTBAR_SELECTED = 6;

function Hotbar() {
  return (
    <div aria-hidden className="inline-flex gap-1 rounded-md border border-white/8 bg-black/40 p-1">
      {HOTBAR.map((tex, i) => (
        <span
          key={i}
          className={`flex h-7 w-7 items-center justify-center border ${
            i === HOTBAR_SELECTED
              ? "border-accent bg-accent/10 shadow-[0_0_12px_-2px_var(--accent)]"
              : "border-white/10 bg-white/4"
          }`}
        >
          {tex ? (
            <span className="h-[18px] w-[18px]" style={{ ...PIXELATED, backgroundImage: tex, backgroundSize: "100% 100%" }} />
          ) : null}
        </span>
      ))}
    </div>
  );
}

/// The footer is the ground: a strip of pixel grass along the top edge, then
/// dark dirt underneath holding the brand, link columns and legal line.
export function SiteFooter() {
  const community = communityColumn();
  const columns = [PRODUCT, RESOURCES, ...(community ? [community] : []), LEGAL];

  return (
    <footer className="mt-8">
      <div
        aria-hidden
        className="h-8 w-full"
        style={{
          ...PIXELATED,
          backgroundImage: TEX.grassSide,
          backgroundSize: "32px 32px",
          backgroundRepeat: "repeat-x",
          // Night: keep the grass from glowing against the dark page.
          filter: "brightness(0.62) saturate(0.9)",
        }}
      />
      <div
        className="border-t border-black/50 px-6 sm:px-10"
        style={{
          ...PIXELATED,
          backgroundImage: `linear-gradient(rgba(7, 7, 8, 0.93), rgba(7, 7, 8, 0.96)), ${TEX.dirt}`,
          backgroundSize: "auto, 64px 64px",
        }}
      >
        <div className="mx-auto max-w-5xl pt-12 pb-8">
          <div
            data-reveal-group="footer"
            className={`grid gap-10 sm:grid-cols-2 ${
              community ? "lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]" : "lg:grid-cols-[1.5fr_1fr_1fr_1fr]"
            }`}
          >
            <div className="flex flex-col items-start gap-4">
              <NextLink href="/" aria-label="Arcane Launcher home" className="flex items-center gap-2.5 no-underline">
                <Image src="/logo.png" alt="" width={32} height={32} quality={100} className="rounded-lg" />
                <span className="text-sm font-bold tracking-wide whitespace-nowrap text-white">
                  ARCANE <span className="font-normal text-muted">LAUNCHER</span>
                </span>
                <BetaBadge scale={1.1} />
              </NextLink>
              <p className="max-w-xs text-sm leading-relaxed text-muted">
                A premium Minecraft launcher: instances, mods, skins, and safe version upgrades, all in one place.
              </p>
            </div>

            {columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h3 className="mb-4 flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] text-white uppercase">
                  <span aria-hidden className="h-1.5 w-1.5 bg-accent" />
                  {column.title}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted no-underline transition-colors hover:text-white"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <NextLink
                          href={link.href}
                          className="text-sm text-muted no-underline transition-colors hover:text-white"
                        >
                          {link.label}
                        </NextLink>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-5 border-t border-white/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1.5">
              <p className="text-xs text-muted">
                © {new Date().getFullYear()} Arcane Launcher, developed by Evolutionz.
              </p>
              <p className="max-w-xl text-[11px] leading-relaxed text-muted/70">
                Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.
              </p>
            </div>
            <Hotbar />
          </div>
        </div>
      </div>
    </footer>
  );
}
