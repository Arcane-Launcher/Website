import Image from "next/image";
import { Chip, Heading, Link, Paragraph, Surface, buttonVariants } from "@heroui/react";
import { BetaBadge } from "../components/beta-badge";
import { CircuitMotif } from "../components/circuit-motif";
import { DownloadButtons } from "../components/download-button";
import { Reveal } from "../components/reveal";
import { screenshotSrc } from "../lib/cloudinary";
import { INTEGRATIONS } from "../lib/site-content";
import { fetchDownloads } from "../lib/updates";

/// How often the hero re-checks for a published release. Doesn't need to be
/// as fresh as the launcher's own update check — this only gates whether the
/// download button is clickable, not an in-app update.
const LATEST_RELEASE_REVALIDATE_SECONDS = 60;

export async function Hero() {
  const downloads = await fetchDownloads(LATEST_RELEASE_REVALIDATE_SECONDS);
  const files = downloads.status === "ok" ? downloads.files : {};
  const windowsUrl = files.windows?.url;
  const hasLinux = Boolean(files.appimage || files.deb || files.rpm || files.pacman);
  const version = (files.windows ?? files.appimage ?? files.deb)?.version;

  return (
    <section className="relative overflow-hidden px-6 pt-10 pb-16 sm:px-10 sm:pt-16">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse 900px 500px at 75% 20%, black, transparent)",
          }}
        />
        <CircuitMotif className="absolute -right-4 top-6 h-56 w-56 text-accent/25 sm:h-72 sm:w-72" />
        <CircuitMotif flip className="absolute -left-6 bottom-0 h-44 w-44 text-accent/15 sm:h-56 sm:w-56" />
      </div>

      <div className="relative mx-auto flex max-w-5xl flex-col gap-12">
        <Reveal>
          <Heading
            level={1}
            className="max-w-2xl text-4xl leading-[1.05] font-extrabold tracking-tight text-white uppercase sm:text-6xl"
          >
            Every instance.
            <br />
            Every mod.
            <br />
            <span
              data-glow-pulse
              className="text-accent-strong"
              style={{ filter: "drop-shadow(0 0 var(--glow, 8px) var(--accent-strong))" }}
            >
              Under control.
            </span>
          </Heading>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
            <Paragraph color="muted" className="max-w-sm text-sm leading-relaxed">
              Arcane Launcher manages your Minecraft instances, mods, and versions the way a launcher should — real
              compatibility checks, safe upgrades and downgrades, and nothing left to guesswork.
            </Paragraph>
            <div id="download" data-reveal-group="hero-cta" className="flex w-full flex-col items-start gap-2 sm:w-auto sm:shrink-0 sm:items-end">
              <div className="flex flex-wrap gap-2.5 sm:justify-end">
                <Link href="#features" className={buttonVariants({ variant: "outline" }) + " text-sm"}>
                  See features
                </Link>
                <DownloadButtons windowsUrl={windowsUrl} hasLinux={hasLinux} />
              </div>
              <div className="flex items-center gap-2.5">
                <BetaBadge scale={1.4} />
                <Paragraph size="xs" color="muted">
                  {version ? (
                    <>
                      v{version} ·{" "}
                      <Link href="/changelog" className="text-accent-strong underline underline-offset-2 hover:text-white">
                        what&apos;s new
                      </Link>{" "}
                      ·{" "}
                      <Link href="/download" className="text-accent-strong underline underline-offset-2 hover:text-white">
                        all downloads
                      </Link>
                    </>
                  ) : (
                    "Coming soon — the first release hasn't shipped yet."
                  )}
                </Paragraph>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.22} y={48}>
          <div className="group relative">
            <div
              aria-hidden
              className="absolute -inset-x-6 -inset-y-8 -z-10 rounded-4xl bg-accent/25 opacity-70 blur-[110px] transition-opacity duration-500 group-hover:opacity-100 sm:-inset-x-16"
            />
            <Surface
              variant="default"
              className="overflow-hidden rounded-2xl border border-border shadow-[0_40px_100px_-32px_rgba(0,0,0,0.85)] transition-transform duration-500 group-hover:-translate-y-1.5"
            >
              <div className="flex items-center gap-1.5 border-b border-border bg-white/2 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="ml-3 text-[11px] font-medium text-muted">Arcane Launcher</span>
              </div>
              <Image
                src={screenshotSrc("hero-screenshot")}
                alt="Arcane Launcher's home screen showing an instance ready to play, live server status, and a 100/100 performance score"
                width={1273}
                height={767}
                quality={100}
                className="h-auto w-full"
                priority
              />
            </Surface>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-3 border-t border-border pt-6">
            <span className="mr-5 text-[11px] font-semibold tracking-wider text-muted/70 uppercase">integrations</span>
            {INTEGRATIONS.map((name) => (
              <Chip key={name} variant="soft" color="default" size="sm" className="font-bold tracking-wide">
                {name}
              </Chip>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
