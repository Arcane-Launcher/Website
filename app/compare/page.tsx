import type { Metadata } from "next";
import Link from "next/link";
import { Heading } from "@heroui/react";
import { Reveal } from "../components/reveal";
import { COMPARE_CHECKED, COMPARE_ROWS, COMPETITORS, type Cell, type Support } from "../lib/compare-content";
import { formatPostDate } from "../lib/news-content";
import { PageShell } from "../sections/page-shell";

export const metadata: Metadata = {
  title: "Compare — Arcane Launcher",
  description:
    "How Arcane Launcher compares with Prism Launcher, the CurseForge app, Modrinth App, and TLauncher, using only what each launcher's own site says.",
};

const LINK = "text-accent-strong underline underline-offset-2 hover:text-white";

const LABELS: Record<Support, string> = {
  yes: "Yes",
  partial: "Partly",
  notyet: "Not yet",
  undocumented: "Not documented",
};

function StateMark({ state }: { state: Support }) {
  if (state === "yes") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-success" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="m5 12.5 4.5 4.5L19 7.5" />
      </svg>
    );
  }
  if (state === "undocumented") return <span aria-hidden className="text-sm leading-none text-muted/60">&mdash;</span>;
  return (
    <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-bold tracking-wider text-warning uppercase">
      {state === "notyet" ? "Not yet" : "Partly"}
    </span>
  );
}

function CellView({ cell }: { cell: Cell }) {
  return (
    <div className="flex flex-col items-start gap-1.5">
      <StateMark state={cell.state} />
      <span className="sr-only">{LABELS[cell.state]}</span>
      {cell.text ? <span className="text-xs leading-snug text-muted">{cell.text}</span> : null}
    </div>
  );
}

export default function ComparePage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-5xl">
        <Heading level={1} className="text-4xl leading-tight font-extrabold tracking-tight text-white uppercase sm:text-5xl">
          How Arcane <span className="text-muted">compares</span>
        </Heading>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          Prism, the CurseForge app, Modrinth App, and TLauncher are all good launchers, and some things they do, Arcane doesn&apos;t
          yet. This table only uses what each launcher&apos;s own site says, and it marks Arcane&apos;s gaps plainly.
        </p>

        <Reveal y={20}>
          <div className="mt-10 overflow-x-auto rounded-2xl border border-border bg-surface/80 backdrop-blur-sm">
            <table className="w-full min-w-[860px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="sticky left-0 z-10 w-[19%] bg-surface px-4 py-4 text-[11px] font-bold tracking-wider text-muted uppercase">
                    Feature
                  </th>
                  <th scope="col" className="w-[21%] bg-accent/10 px-4 py-4 text-sm font-bold text-white">
                    Arcane Launcher
                  </th>
                  {COMPETITORS.map((c) => (
                    <th key={c.key} scope="col" className="px-4 py-4 text-sm font-semibold text-white">
                      {c.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row) => (
                  <tr key={row.feature} className="border-b border-border align-top last:border-b-0">
                    <th scope="row" className="sticky left-0 z-10 bg-surface px-4 py-4 text-sm font-semibold text-white">
                      {row.feature}
                      {row.hint ? <span className="mt-1 block text-[11px] leading-snug font-normal text-muted">{row.hint}</span> : null}
                    </th>
                    <td className="bg-accent/10 px-4 py-4">
                      <CellView cell={row.arcane} />
                    </td>
                    {COMPETITORS.map((c) => (
                      <td key={c.key} className="px-4 py-4">
                        <CellView cell={row.others[c.key]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <div className="mt-6 flex flex-col gap-4 text-xs leading-relaxed text-muted">
          <p>
            <strong className="font-semibold text-white">How to read this.</strong> A dash means we didn&apos;t find the feature on
            that launcher&apos;s own pages, not that it&apos;s missing. Checked {formatPostDate(COMPARE_CHECKED)}. If something here is
            out of date or wrong, tell us and we&apos;ll fix it.
          </p>
          <p>
            <strong className="font-semibold text-white">Sources.</strong>{" "}
            {COMPETITORS.map((c, i) => (
              <span key={c.key}>
                {i > 0 ? " · " : ""}
                <a href={c.source} target="_blank" rel="noopener noreferrer" className={LINK}>
                  {c.name}
                </a>
              </span>
            ))}
          </p>
        </div>

        <Reveal y={20}>
          <section className="mt-14 rounded-2xl border border-border bg-white/3 p-6 sm:p-8">
            <Heading level={2} className="text-base font-bold text-white">
              When another launcher is the better fit
            </Heading>
            <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed text-muted marker:text-accent">
              <li>You&apos;re on macOS or Linux. Arcane is Windows-only for now.</li>
              <li>You download most of your mods and modpacks from CurseForge. Prism and the CurseForge app browse it directly.</li>
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              Arcane is built for the other side: changing Minecraft versions without breaking an instance, seeing problems before
              you press Play, and moving over from another launcher. See the latest on the{" "}
              <Link href="/news" className={LINK}>
                news page
              </Link>
              .
            </p>
          </section>
        </Reveal>
      </div>
    </PageShell>
  );
}
