import type { BlockKey } from "../components/block-art";
import type { ContentBlock } from "../components/content-blocks";

export type NewsPost = {
  slug: string;
  title: string;
  /// ISO date (YYYY-MM-DD).
  date: string;
  /// Full publish time. Used to order posts that share a date.
  publishedAt?: string;
  tag: string;
  /// The Minecraft block shown as this post's art on the news pages.
  block: BlockKey;
  summary: string;
  /// Optional cover picture uploaded in the Studio (always from Sanity's CDN).
  cover?: { url: string; alt: string; width: number; height: number };
  body: ContentBlock[];
};

export function formatPostDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
