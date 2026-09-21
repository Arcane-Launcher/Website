import type { ContentBlock } from "../components/content-blocks";

/// Sanity stores rich text as "Portable Text". The site already renders its own
/// small block model (paragraphs, headings, lists, code, callouts), so posts are
/// converted into that instead of pulling in a second renderer — which keeps the
/// article styling, the "On this page" outline and the reading time identical
/// for CMS posts and the ones written in code.

type Span = { _type: "span"; text: string; marks?: string[] };
type MarkDef = { _key: string; _type: string; href?: string };

export type PortableBlock =
  | {
      _type: "block";
      style?: string;
      listItem?: string;
      children?: Span[];
      markDefs?: MarkDef[];
    }
  | { _type: "code"; code?: string }
  | { _type: "note"; tone?: string; text?: string }
  | { _type: "image"; url?: string; alt?: string; caption?: string; width?: number; height?: number }
  | { _type: string };

/// Only these may become links. Everything else is kept as plain text, never an
/// href: a CMS field shouldn't be able to emit `javascript:` or `data:` URLs.
function safeHref(href: string | undefined): string | null {
  if (!href) return null;
  const trimmed = href.trim();
  if (!/^(https:\/\/|\/(?!\/))/.test(trimmed)) return null;
  // The inline syntax is [label](url), so a stray `)` or space would end it early.
  return trimmed.replace(/\s/g, "%20").replace(/\)/g, "%29");
}

/// Turns one text block's spans into the inline markdown subset renderInline understands.
function spansToInline(block: Extract<PortableBlock, { _type: "block" }>): string {
  const defs = new Map((block.markDefs ?? []).map((def) => [def._key, def]));
  let out = "";

  for (const span of block.children ?? []) {
    if (span._type !== "span" || !span.text) continue;
    let text = span.text;
    const marks = span.marks ?? [];

    // Whitespace on the edge of a mark breaks `**bold **`, so it stays outside.
    const lead = text.match(/^\s*/)?.[0] ?? "";
    const trail = text.trim() ? (text.match(/\s*$/)?.[0] ?? "") : "";
    const core = text.trim();
    if (!core) {
      out += text;
      continue;
    }

    let styled = core;
    if (marks.includes("code")) styled = `\`${styled.replace(/`/g, "'")}\``;
    if (marks.includes("strong")) styled = `**${styled.replace(/\*\*/g, "")}**`;
    for (const mark of marks) {
      const def = defs.get(mark);
      if (def?._type !== "link") continue;
      const href = safeHref(def.href);
      if (href) styled = `[${styled.replace(/[[\]]/g, "")}](${href})`;
    }
    text = lead + styled + trail;
    out += text;
  }
  return out.replace(/\s+\n/g, "\n").trim();
}

function plainText(block: Extract<PortableBlock, { _type: "block" }>): string {
  return (block.children ?? [])
    .filter((c) => c._type === "span")
    .map((c) => c.text)
    .join("")
    .trim();
}

const HEADING_STYLES = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

export function portableTextToBlocks(input: PortableBlock[] | null | undefined): ContentBlock[] {
  const out: ContentBlock[] = [];
  let list: { type: "ul" | "ol"; items: string[] } | null = null;
  const flushList = () => {
    if (list) out.push(list);
    list = null;
  };

  for (const block of input ?? []) {
    if (block._type === "block") {
      const b = block as Extract<PortableBlock, { _type: "block" }>;

      if (b.listItem) {
        const text = spansToInline(b);
        if (!text) continue;
        const type = b.listItem === "number" ? "ol" : "ul";
        if (list && list.type !== type) flushList();
        list ??= { type, items: [] };
        list.items.push(text);
        continue;
      }

      flushList();
      if (b.style && HEADING_STYLES.has(b.style)) {
        const text = plainText(b);
        if (text) out.push({ type: "h", text });
      } else if (b.style === "blockquote") {
        const text = spansToInline(b);
        if (text) out.push({ type: "note", text });
      } else {
        const text = spansToInline(b);
        if (text) out.push({ type: "p", text });
      }
      continue;
    }

    flushList();
    if (block._type === "code") {
      const text = (block as { code?: string }).code?.replace(/\s+$/, "");
      if (text) out.push({ type: "code", text });
    } else if (block._type === "note") {
      const n = block as { tone?: string; text?: string };
      const text = n.text?.trim();
      if (text) out.push({ type: "note", text, tone: n.tone === "warn" ? "warn" : "tip" });
    } else if (block._type === "image") {
      const img = block as { url?: string; alt?: string; caption?: string; width?: number; height?: number };
      // Only images served from Sanity's own CDN are accepted (see next.config.ts).
      if (img.url?.startsWith("https://cdn.sanity.io/") && img.width && img.height) {
        out.push({ type: "image", url: img.url, alt: img.alt?.trim() ?? "", caption: img.caption?.trim() || undefined, width: img.width, height: img.height });
      }
    }
  }
  flushList();
  return out;
}
