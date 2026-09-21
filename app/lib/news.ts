import type { BlockKey } from "../components/block-art";
import type { NewsPost } from "./news-content";
import { portableTextToBlocks, type PortableBlock } from "./portable-text";
import { sanityQuery } from "./sanity";

/// How long a Sanity answer is reused. The /api/revalidate webhook makes a
/// publish show up immediately; this is the fallback if that isn't set up.
export const NEWS_REVALIDATE_SECONDS = 60;

const BLOCKS: ReadonlySet<string> = new Set<BlockKey>(["grassTop", "grassSide", "dirt", "stone", "planks", "gold", "diamond", "redstone"]);

// Only what the site renders, and only posts whose publish time has passed, so
// a post scheduled for later appears by itself when its time arrives.
const POSTS_QUERY = `*[_type == "post" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()]
  | order(publishedAt desc) {
    "slug": slug.current,
    title,
    publishedAt,
    tag,
    block,
    summary,
    "cover": select(defined(cover.asset) => {
      "url": cover.asset->url,
      "alt": cover.alt,
      "width": cover.asset->metadata.dimensions.width,
      "height": cover.asset->metadata.dimensions.height
    }),
    "body": body[]{
      ...,
      _type == "image" => {
        "url": asset->url,
        alt,
        caption,
        "width": asset->metadata.dimensions.width,
        "height": asset->metadata.dimensions.height
      }
    }
  }`;

type SanityPost = {
  slug: string;
  title?: string;
  publishedAt: string;
  tag?: string;
  block?: string;
  summary?: string;
  cover?: { url?: string; alt?: string; width?: number; height?: number } | null;
  body?: PortableBlock[];
};

/// Only images served from Sanity's own CDN are accepted (see next.config.ts).
function coverFromSanity(cover: SanityPost["cover"]): NewsPost["cover"] {
  if (!cover?.url?.startsWith("https://cdn.sanity.io/") || !cover.width || !cover.height) return undefined;
  return { url: cover.url, alt: cover.alt?.trim() ?? "", width: cover.width, height: cover.height };
}

function fromSanity(post: SanityPost): NewsPost | null {
  // A post with no title or summary would render as an empty card, so it's skipped.
  if (!post.title?.trim() || !post.summary?.trim() || Number.isNaN(Date.parse(post.publishedAt))) return null;
  return {
    slug: post.slug,
    title: post.title.trim(),
    date: post.publishedAt.slice(0, 10),
    publishedAt: post.publishedAt,
    tag: post.tag?.trim() || "News",
    block: (post.block && BLOCKS.has(post.block) ? post.block : "stone") as BlockKey,
    summary: post.summary.trim(),
    cover: coverFromSanity(post.cover),
    body: portableTextToBlocks(post.body),
  };
}

/// Every published post, newest first: whatever has been published in the Sanity
/// Studio. Empty when Sanity isn't configured or can't be reached, so the news
/// pages show their "nothing here yet" state instead of breaking.
export async function getAllPosts(): Promise<NewsPost[]> {
  const remote = (await sanityQuery<SanityPost[]>(POSTS_QUERY, NEWS_REVALIDATE_SECONDS)) ?? [];
  return remote
    .map(fromSanity)
    .filter((post): post is NewsPost => post !== null)
    .sort((a, b) => (b.publishedAt ?? `${b.date}T00:00:00Z`).localeCompare(a.publishedAt ?? `${a.date}T00:00:00Z`));
}

export async function getPost(slug: string): Promise<NewsPost | undefined> {
  return (await getAllPosts()).find((post) => post.slug === slug);
}
