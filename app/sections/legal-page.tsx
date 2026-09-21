import { Heading, Link } from "@heroui/react";
import { ContentBlocks } from "../components/content-blocks";
import { Reveal } from "../components/reveal";
import { LEGAL_CONTACT, type LegalDoc } from "../lib/legal-content";
import { PageShell } from "./page-shell";

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <PageShell>
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="text-xs font-semibold tracking-wide text-muted uppercase no-underline hover:text-foreground">
          &larr; Back to home
        </Link>

        <Heading level={1} className="mt-8 text-4xl leading-tight font-extrabold tracking-tight text-white uppercase sm:text-5xl">
          {doc.title}
        </Heading>
        <p className="mt-3 text-xs text-muted">Last updated {doc.updated}</p>
        <p className="mt-6 text-sm leading-relaxed text-muted">{doc.intro}</p>

        <div className="mt-12 flex flex-col gap-10">
          {doc.sections.map((section, i) => (
            <Reveal key={section.heading} y={20}>
              <section>
                <Heading level={2} className="mb-3 flex items-baseline gap-3 text-base font-bold text-white">
                  <span className="text-xs font-semibold text-accent-strong tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  {section.heading}
                </Heading>
                <ContentBlocks blocks={section.blocks} />
              </section>
            </Reveal>
          ))}

          {LEGAL_CONTACT ? (
            <Reveal y={20}>
              <section>
                <Heading level={2} className="mb-3 flex items-baseline gap-3 text-base font-bold text-white">
                  <span className="text-xs font-semibold text-accent-strong tabular-nums">{String(doc.sections.length + 1).padStart(2, "0")}</span>
                  Contact
                </Heading>
                <p className="text-sm leading-relaxed text-muted">Questions about this page? Reach us at {LEGAL_CONTACT}.</p>
              </section>
            </Reveal>
          ) : null}
        </div>
      </article>
    </PageShell>
  );
}
