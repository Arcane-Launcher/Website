import Image from "next/image";
import { Card, Chip, Heading } from "@heroui/react";
import { Reveal } from "../components/reveal";
import { LOADER_BADGES, LAUNCHER_BADGES } from "../lib/site-content";

export function FeaturesGrid() {
  return (
    <>
      <Reveal>
        <Heading level={2} className="mb-8 text-3xl leading-tight font-extrabold tracking-tight text-white uppercase sm:text-4xl">
          Why choose <span className="text-muted">Arcane Launcher?</span>
        </Heading>
      </Reveal>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Wide card: real compatibility scanning, radiating out to every loader it checks against */}
        <Reveal delay={0.05} className="sm:col-span-2">
          <Card className="feature-card relative h-full overflow-hidden rounded-2xl border border-border p-6" variant="default">
            <Card.Header>
              <Card.Title className="mb-1.5 text-sm font-bold text-white">Real compatibility checks</Card.Title>
              <Card.Description className="max-w-sm text-sm leading-relaxed text-muted">
                Arcane Instance Evolution scans every installed mod against the version you&apos;re moving to —
                before anything changes — across every major loader.
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="relative mt-8 flex h-40 items-center justify-center">
                <svg aria-hidden viewBox="0 0 400 160" className="absolute inset-0 h-full w-full text-accent/25">
                  {LOADER_BADGES.map((_, i) => {
                    const x = 60 + i * 95;
                    const y = i % 2 === 0 ? 30 : 130;
                    return <line key={i} x1="200" y1="80" x2={x} y2={y} stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />;
                  })}
                </svg>
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 shadow-[0_0_30px_rgba(var(--accent-rgb),0.35)]">
                  <Image src="/logo.png" alt="" width={26} height={26} quality={100} className="rounded-md" />
                </div>
                {LOADER_BADGES.map((name, i) => {
                  const x = 60 + i * 95;
                  const y = i % 2 === 0 ? 30 : 130;
                  return (
                    <Chip
                      key={name}
                      variant="soft"
                      color="default"
                      size="sm"
                      className="absolute z-10 -translate-x-1/2 -translate-y-1/2 border border-border bg-surface font-semibold text-foreground"
                      style={{ left: `${(x / 400) * 100}%`, top: `${(y / 160) * 100}%` }}
                    >
                      {name}
                    </Chip>
                  );
                })}
              </div>
            </Card.Content>
          </Card>
        </Reveal>

        {/* Tall card: a real, honest stat from the concurrent-download fix */}
        <Reveal delay={0.1}>
          <Card className="feature-card flex h-full flex-col justify-between rounded-2xl border border-border p-6" variant="default">
            <Card.Header>
              <Card.Title className="mb-1.5 text-sm font-bold text-white">Faster installs</Card.Title>
              <Card.Description className="text-sm leading-relaxed text-muted">
                Libraries and assets download in parallel instead of one at a time.
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <p className="mt-8 bg-linear-to-br from-accent-strong to-accent bg-clip-text text-6xl font-extrabold text-transparent">
                24×
              </p>
            </Card.Content>
          </Card>
        </Reveal>

        {/* Row 2: three even cards */}
        <Reveal delay={0.15}>
          <Card className="feature-card h-full rounded-2xl border border-border p-6" variant="default">
            <Card.Header>
              <Card.Title className="mb-1.5 text-sm font-bold text-white">Import from anywhere</Card.Title>
              <Card.Description className="mb-5 text-sm leading-relaxed text-muted">
                Bring instances over — mods, worlds, and configs come along as-is.
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="flex flex-wrap gap-1.5">
                {LAUNCHER_BADGES.map((name) => (
                  <Chip key={name} variant="soft" color="default" size="sm">
                    {name}
                  </Chip>
                ))}
              </div>
            </Card.Content>
          </Card>
        </Reveal>

        <Reveal delay={0.2}>
          <Card className="feature-card flex h-full flex-col justify-between rounded-2xl border border-border p-6" variant="default">
            <Card.Header>
              <Card.Title className="mb-1.5 text-sm font-bold text-white">Arcane Smart Launch</Card.Title>
              <Card.Description className="text-sm leading-relaxed text-muted">
                A real pre-flight score before every launch — Java, RAM, disk space, mod conflicts.
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <p className="mt-5 bg-linear-to-br from-accent-strong to-accent bg-clip-text text-5xl font-extrabold text-transparent">
                92<span className="text-lg text-muted">/100</span>
              </p>
            </Card.Content>
          </Card>
        </Reveal>

        <Reveal delay={0.25}>
          <Card className="feature-card h-full rounded-2xl border border-border p-6" variant="default">
            <Card.Header>
              <Card.Title className="mb-1.5 text-sm font-bold text-white">Safe upgrades &amp; downgrades</Card.Title>
              <Card.Description className="text-sm leading-relaxed text-muted">
                Every version change takes an automatic snapshot first, so a bad upgrade is one click to undo.
              </Card.Description>
            </Card.Header>
          </Card>
        </Reveal>
      </div>
    </>
  );
}
