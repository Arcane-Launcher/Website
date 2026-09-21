import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Chip, Heading } from "@heroui/react";
import { BlockArt } from "../../components/block-art";
import { getAllPosts, getPost } from "../../lib/news";
import { formatPostDate } from "../../lib/news-content";
import { readingMinutes } from "../../lib/reading-time";
import { ArticleLayout } from "../../sections/article-layout";

// Posts published after the last build render on first visit, then are cached and
// re-read from the CMS at most this often. (Must be a literal for Next.)
export const revalidate = 60;

export async function generateStaticParams() {
  return (await getAllPosts()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Arcane Launcher`,
    description: post.summary,
    openGraph: post.cover ? { images: [{ url: post.cover.url, width: post.cover.width, height: post.cover.height, alt: post.cover.alt }] } : undefined,
  };
}

export default async function NewsPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  // Next-older post, wrapping around to the newest after the last one.
  const posts = await getAllPosts();
  const next = posts[posts.findIndex((p) => p.slug === post.slug) + 1] ?? posts[0];

  return (
    <ArticleLayout
      back={{ href: "/news", label: "All news" }}
      blocks={post.body}
      header={
        <>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <BlockArt block={post.block} className="h-11 w-11" />
            <Chip variant="soft" color="accent" size="sm">
              {post.tag}
            </Chip>
            <time dateTime={post.date} className="text-xs text-muted">
              {formatPostDate(post.date)}
            </time>
            <span aria-hidden className="h-1 w-1 rounded-full bg-white/20" />
            <span className="text-xs text-muted">{readingMinutes(post.body)} min read</span>
          </div>
          <Heading level={1} className="mt-6 text-3xl leading-[1.1] font-extrabold tracking-tight text-white sm:text-5xl">
            {post.title}
          </Heading>
          <p className="mt-5 text-lg leading-relaxed text-foreground/70">{post.summary}</p>
          {post.cover ? (
            <Image
              src={post.cover.url}
              alt={post.cover.alt}
              width={post.cover.width}
              height={post.cover.height}
              sizes="(min-width: 1280px) 704px, (min-width: 768px) 672px, 100vw"
              priority
              className="mt-8 h-auto w-full rounded-xl border border-border"
            />
          ) : null}
        </>
      }
      footer={
        next && next.slug !== post.slug ? (
          <Link
            href={`/news/${next.slug}`}
            className="feature-card group mt-16 flex items-center gap-5 rounded-2xl border border-border bg-surface/80 p-5 no-underline backdrop-blur-sm"
          >
            <BlockArt block={next.block} className="h-14 w-14" />
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-bold tracking-wider text-muted uppercase">Keep reading</span>
              <span className="mt-1 block text-base leading-snug font-bold text-white">{next.title}</span>
            </span>
            <span aria-hidden className="text-lg text-accent-strong transition-transform duration-200 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        ) : null
      }
    />
  );
}
