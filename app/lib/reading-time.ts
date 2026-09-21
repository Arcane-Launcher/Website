import type { ContentBlock } from "../components/content-blocks";

const WORDS_PER_MINUTE = 200;

/// Whole minutes to read a set of content blocks, at least 1. Counted from the
/// real text (code blocks excluded, since nobody reads those at prose speed).
export function readingMinutes(blocks: ContentBlock[]): number {
  let words = 0;
  for (const block of blocks) {
    if (block.type === "code" || block.type === "image") continue;
    const text = block.type === "ul" || block.type === "ol" ? block.items.join(" ") : block.text;
    words += text.split(/\s+/).filter(Boolean).length;
  }
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
