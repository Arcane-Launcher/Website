import type { ContentBlock } from "../components/content-blocks";

const BULLET = /^\s*[-*+]\s+(.*)$/;
const NUMBERED = /^\s*\d+[.)]\s+(.*)$/;
const HEADING = /^\s{0,3}#{1,6}\s+(.*?)\s*#*\s*$/;
const FENCE = /^\s*```/;
const RULE = /^\s*([-*_])(\s*\1){2,}\s*$/;

/// Parses the Markdown a GitHub Release body is written in (headings, bullet
/// and numbered lists, paragraphs, fenced code) into the same blocks the rest
/// of the site renders. Deliberately a small subset: nothing here ever produces
/// raw HTML, so a release description can't inject markup into the page.
export function parseReleaseNotes(markdown: string): ContentBlock[] {
  const lines = markdown
    .replace(/\r\n?/g, "\n")
    .replace(/<!--[\s\S]*?-->/g, "")
    .split("\n");

  const blocks: ContentBlock[] = [];
  let paragraph: string[] = [];
  let list: { type: "ul" | "ol"; items: string[] } | null = null;
  let fence: string[] | null = null;

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ type: "p", text: paragraph.join(" ") });
    paragraph = [];
  };
  const flushList = () => {
    if (list) blocks.push(list);
    list = null;
  };

  for (const line of lines) {
    if (fence) {
      if (FENCE.test(line)) {
        blocks.push({ type: "code", text: fence.join("\n") });
        fence = null;
      } else {
        fence.push(line);
      }
      continue;
    }
    if (FENCE.test(line)) {
      flushParagraph();
      flushList();
      fence = [];
      continue;
    }

    if (!line.trim() || RULE.test(line)) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = line.match(HEADING);
    if (heading) {
      flushParagraph();
      flushList();
      if (heading[1]) blocks.push({ type: "h", text: heading[1] });
      continue;
    }

    const bullet = line.match(BULLET);
    const numbered = bullet ? null : line.match(NUMBERED);
    if (bullet || numbered) {
      flushParagraph();
      const type = bullet ? "ul" : "ol";
      if (list && list.type !== type) flushList();
      list ??= { type, items: [] };
      list.items.push((bullet ?? numbered)![1]);
      continue;
    }

    // Blockquote markers and stray indentation aren't worth preserving.
    flushList();
    paragraph.push(line.replace(/^\s*>\s?/, "").trim());
  }

  // An unclosed fence still shows what was written rather than dropping it.
  if (fence) blocks.push({ type: "code", text: fence.join("\n") });
  flushParagraph();
  flushList();
  return blocks;
}
