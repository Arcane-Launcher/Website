import Image from "next/image";
import { Button, Chip, Heading, Link, Paragraph, Surface, buttonVariants } from "@heroui/react";
import { BetaBadge } from "../components/beta-badge";
import { CircuitMotif } from "../components/circuit-motif";
import { Reveal } from "../components/reveal";
import { screenshotSrc } from "../lib/cloudinary";
import { INTEGRATIONS } from "../lib/site-content";

export function Hero() {
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
            <div id="download" data-reveal-group="hero-cta" className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
              <div className="flex gap-2.5">
                <Link href="#features" className={buttonVariants({ variant: "outline" }) + " text-sm"}>
                  See features
                </Link>
                <Button variant="primary" isDisabled className="text-sm">
                  Download for Windows
                </Button>
              </div>
              <div className="flex items-center gap-2.5">
                <BetaBadge scale={1.4} />
                <Paragraph size="xs" color="muted">
                  Coming soon — the first release hasn&apos;t shipped yet.
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
