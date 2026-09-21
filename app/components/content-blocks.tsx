import Image from "next/image";
import { renderInline } from "../lib/inline";

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "h"; text: string }
  | { type: "code"; text: string }
  | { type: "note"; text: string; tone?: "tip" | "warn" }
  /// Uploaded through the news Studio. `url` is always a cdn.sanity.io address.
  | { type: "image"; url: string; alt: string; caption?: string; width: number; height: number };

/// "sm" is the compact prose the legal pages and changelog use. "md" is the
/// article style for news posts: bigger, higher-contrast text, section
/// headings with anchors, and numbered steps as cards.
export type BlockSize = "sm" | "md";

const NUMBERED_HEADING = /^(\d+)\.\s+(.+)$/;

export type Heading = { id: string; text: string };

/// Anchor ids for every heading block, in order. Repeated headings get a
/// numeric suffix so ids stay unique within a page.
export function extractHeadings(blocks: ContentBlock[]): Heading[] {
  const seen = new Map<string, number>();
  const headings: Heading[] = [];
  for (const block of blocks) {
    if (block.type !== "h") continue;
    const base =
      block.text
        .toLowerCase()
        .replace(/^\d+\.\s+/, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "section";
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    headings.push({ id: count === 0 ? base : `${base}-${count + 1}`, text: block.text });
  }
  return headings;
}

/// Renders the paragraph / list / sub-heading / callout blocks used by the
/// legal pages and news posts, so both of them share the same prose
/// styling. Inline `code`, **bold** and [links](/path) work inside any text.
export function ContentBlocks({ blocks, size = "sm" }: { blocks: ContentBlock[]; size?: BlockSize }) {
  const md = size === "md";
  const headings = extractHeadings(blocks);
  let headingIndex = 0;

  return (
    <div className={md ? "flex flex-col gap-4 text-[15.5px] leading-7 text-foreground/75" : "flex flex-col gap-3 text-sm leading-relaxed text-muted"}>
      {blocks.map((block, i) => {
        if (block.type === "p") return <p key={i}>{renderInline(block.text)}</p>;

        if (block.type === "h") {
          const { id } = headings[headingIndex++];
          if (!md) {
            return (
              <h3 key={i} id={id} className="mt-3 text-sm font-bold text-white">
                {block.text}
              </h3>
            );
          }
          const numbered = block.text.match(NUMBERED_HEADING);
          return (
            <h2 key={i} id={id} className="mt-8 flex items-center gap-3 text-xl font-bold tracking-tight text-white first:mt-0">
              {numbered ? (
                <span
                  aria-hidden
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-sm font-bold text-accent-strong ring-1 ring-accent/30"
                >
                  {numbered[1]}
                </span>
              ) : (
                <span aria-hidden className="h-5 w-1 shrink-0 rounded-full bg-accent" />
              )}
              {numbered ? numbered[2] : block.text}
            </h2>
          );
        }

        if (block.type === "image") {
          return (
            <figure key={i} className="my-2">
              <Image
                src={block.url}
                alt={block.alt}
                width={block.width}
                height={block.height}
                sizes="(min-width: 1280px) 704px, (min-width: 768px) 672px, 100vw"
                className="h-auto w-full rounded-xl border border-border"
              />
              {block.caption ? <figcaption className="mt-2 text-center text-xs text-muted">{block.caption}</figcaption> : null}
            </figure>
          );
        }

        if (block.type === "code") {
          return (
            <pre
              key={i}
              className="overflow-x-auto rounded-xl border border-border bg-black/50 px-4 py-3.5 font-mono text-[12.5px] leading-relaxed text-foreground"
            >
              <code>{block.text}</code>
            </pre>
          );
        }

        if (block.type === "note") {
          const warn = block.tone === "warn";
          return (
            <aside
              key={i}
              className={`rounded-xl border border-l-[3px] px-4 py-3.5 text-foreground/90 ${
                warn ? "border-warning/25 border-l-warning bg-warning/8" : "border-accent/25 border-l-accent bg-accent/8"
              }`}
            >
              <span className={`mr-2 text-[11px] font-bold tracking-wider uppercase ${warn ? "text-warning" : "text-accent-strong"}`}>
                {warn ? "Heads up" : "Tip"}
              </span>
              {renderInline(block.text)}
            </aside>
          );
        }

        if (block.type === "ol") {
          if (!md) {
            return (
              <ol key={i} className="flex list-decimal flex-col gap-1.5 pl-5 marker:font-semibold marker:text-accent-strong">
                {block.items.map((item, j) => (
                  <li key={`${j}-${item}`}>{renderInline(item)}</li>
                ))}
              </ol>
            );
          }
          return (
            <ol key={i} className="flex flex-col gap-2.5">
              {block.items.map((item, j) => (
                <li key={`${j}-${item}`} className="flex gap-4 rounded-xl border border-border bg-white/3 px-4 py-3.5">
                  <span
                    aria-hidden
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent-strong ring-1 ring-accent/30"
                  >
                    {j + 1}
                  </span>
                  <span className="min-w-0">{renderInline(item)}</span>
                </li>
              ))}
            </ol>
          );
        }

        return (
          <ul key={i} className={`flex list-disc flex-col pl-5 marker:text-accent ${md ? "gap-2" : "gap-1.5"}`}>
            {block.items.map((item, j) => (
              <li key={`${j}-${item}`}>{renderInline(item)}</li>
            ))}
          </ul>
        );
      })}
    </div>
  );
}
