import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Chip, Heading } from "@heroui/react";
import { BlockArt } from "../components/block-art";
import { Reveal } from "../components/reveal";
import { getAllPosts } from "../lib/news";
import { formatPostDate, type NewsPost } from "../lib/news-content";
import { readingMinutes } from "../lib/reading-time";
import { PageShell } from "../sections/page-shell";

export const metadata: Metadata = {
  title: "News — Arcane Launcher",
  description: "Release notes, new features, and updates from the Arcane Launcher team.",
};

// Re-read from the CMS at most this often; the /api/revalidate webhook can refresh
// it sooner. Next needs this to be a literal number.
export const revalidate = 60;

function PostMeta({ post }: { post: NewsPost }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
      <Chip variant="soft" color="accent" size="sm">
        {post.tag}
      </Chip>
      <time dateTime={post.date} className="text-xs text-muted">
        {formatPostDate(post.date)}
      </time>
      <span aria-hidden className="h-1 w-1 rounded-full bg-white/20" />
      <span className="text-xs text-muted">{readingMinutes(post.body)} min read</span>
    </div>
  );
}

/// The newest post: a wide card with its block art and a real call to action.
function FeaturedPost({ post }: { post: NewsPost }) {
  return (
    <Link
      href={`/news/${post.slug}`}
      className="feature-card group relative block overflow-hidden rounded-3xl border border-border bg-surface/80 no-underline backdrop-blur-sm"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-linear-to-br from-accent/18 via-transparent to-transparent" />
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-accent/20 blur-[90px]" />

      {post.cover ? (
        <Image
          src={post.cover.url}
          alt={post.cover.alt}
          width={post.cover.width}
          height={post.cover.height}
          sizes="(min-width: 1024px) 1024px, 100vw"
          priority
          className="relative aspect-[21/9] w-full object-cover"
        />
      ) : null}

      <div className={`relative grid items-center gap-8 p-7 sm:p-10 ${post.cover ? "" : "md:grid-cols-[1fr_auto]"}`}>
        <div>
          <div className="mb-5 flex items-center gap-3">
            <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase">Latest</span>
            <PostMeta post={post} />
          </div>
          <h2 className="max-w-xl text-2xl leading-tight font-extrabold tracking-tight text-white sm:text-4xl">{post.title}</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">{post.summary}</p>
          <span className="mt-7 inline-flex items-center gap-2 rounded-full bg-white/8 px-5 py-2.5 text-[13px] font-bold text-white transition-colors group-hover:bg-accent">
            Read the post <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
          </span>
        </div>
        {/* The wrapper hides it below md: BlockArt sets its own display, which would win over a `hidden` on it. */}
        {post.cover ? null : (
          <div className="hidden md:block">
            <BlockArt block={post.block} className="h-36 w-36 transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105" />
          </div>
        )}
      </div>
    </Link>
  );
}

function PostCard({ post }: { post: NewsPost }) {
  return (
    <Link
      href={`/news/${post.slug}`}
      className="feature-card group flex h-full flex-col rounded-2xl border border-border bg-surface/80 p-6 no-underline backdrop-blur-sm"
    >
      {post.cover ? (
        <Image
          src={post.cover.url}
          alt={post.cover.alt}
          width={post.cover.width}
          height={post.cover.height}
          sizes="(min-width: 768px) 480px, 100vw"
          className="-mx-6 -mt-6 mb-5 aspect-video w-[calc(100%+3rem)] max-w-none rounded-t-2xl object-cover"
        />
      ) : null}
      <div className="flex items-start gap-4">
        {post.cover ? null : <BlockArt block={post.block} className="h-12 w-12" />}
        <PostMeta post={post} />
      </div>
      <h3 className="mt-5 text-lg leading-snug font-bold text-white">{post.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{post.summary}</p>
      <span className="mt-auto inline-block pt-6 text-xs font-semibold tracking-wide text-accent-strong uppercase transition-transform duration-200 group-hover:translate-x-1">
        Read more &rarr;
      </span>
    </Link>
  );
}

export default async function NewsPage() {
  const [latest, ...rest] = await getAllPosts();

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl">
        <Heading level={1} className="text-4xl leading-tight font-extrabold tracking-tight text-white uppercase sm:text-5xl">
          Latest <span className="text-muted">news</span>
        </Heading>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
          New features, release notes, and what we&apos;re working on next. For every published version, see the{" "}
          <Link href="/changelog" className="text-accent-strong underline underline-offset-2 hover:text-white">
            changelog
          </Link>
          .
        </p>

        {latest ? (
          <div className="mt-12 flex flex-col gap-5">
            <Reveal y={20}>
              <FeaturedPost post={latest} />
            </Reveal>

            {rest.length > 0 ? (
              <>
                <h2 className="mt-6 text-[11px] font-bold tracking-[0.18em] text-white uppercase">Earlier posts</h2>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {rest.map((post, i) => (
                    <Reveal key={post.slug} y={20} delay={(i % 2) * 0.05}>
                      <PostCard post={post} />
                    </Reveal>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        ) : (
          <p className="mt-12 text-sm text-muted">Nothing here yet. Check back soon.</p>
        )}
      </div>
    </PageShell>
  );
}
