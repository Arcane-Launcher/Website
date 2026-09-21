import Image from "next/image";
import { Heading, Paragraph, Surface } from "@heroui/react";
import { Reveal } from "../components/reveal";
import { SHOWCASES } from "../lib/site-content";

export function ProductShowcases() {
  return (
    <div className="mt-20 flex flex-col gap-20">
      {SHOWCASES.map((showcase, i) => (
        <Reveal key={showcase.windowLabel} delay={0.1}>
          <div className={`grid grid-cols-1 items-center gap-10 lg:grid-cols-2 ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <div>
              <Heading level={3} className="mb-3 text-2xl leading-tight font-extrabold tracking-tight text-white uppercase sm:text-3xl">
                {showcase.title}
              </Heading>
              <Paragraph color="muted" className="max-w-md text-sm leading-relaxed">
                {showcase.description}
              </Paragraph>
            </div>
            <div className="group relative">
              <div
                aria-hidden
                className="absolute -inset-x-4 -inset-y-6 -z-10 rounded-4xl bg-accent/20 opacity-60 blur-[90px] transition-opacity duration-500 group-hover:opacity-90"
              />
              <Surface
                variant="default"
                className="overflow-hidden rounded-2xl border border-border shadow-[0_30px_80px_-30px_rgba(0,0,0,0.85)] transition-transform duration-500 group-hover:-translate-y-1.5"
              >
                <div className="flex items-center gap-1.5 border-b border-border bg-white/2 px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="ml-3 text-[11px] font-medium text-muted">{showcase.windowLabel}</span>
                </div>
                <Image
                  src={showcase.image}
                  alt={showcase.alt}
                  width={showcase.width}
                  height={showcase.height}
                  quality={100}
                  className="h-auto w-full"
                />
              </Surface>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
