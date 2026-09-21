import { Heading } from "@heroui/react";
import { FeatureMarquee } from "../components/feature-marquee";
import { Reveal } from "../components/reveal";
import { MORE_FEATURES } from "../lib/site-content";

export function MoreFeatures() {
  return (
    <>
      <Reveal delay={0.05}>
        <div className="mt-20 mb-8 flex items-center gap-3">
          <span aria-hidden className="h-px w-8 bg-accent" />
          <Heading level={3} className="text-xs font-bold tracking-[0.2em] text-muted uppercase">
            Everything else, built in
          </Heading>
          <span aria-hidden className="h-px flex-1 bg-border" />
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="relative left-1/2 w-screen -translate-x-1/2">
          <FeatureMarquee items={MORE_FEATURES} />
        </div>
      </Reveal>
    </>
  );
}
