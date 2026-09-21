import Link from "next/link";
import { ArticleToc } from "../components/article-toc";
import { ContentBlocks, extractHeadings, type ContentBlock } from "../components/content-blocks";
import { PageShell } from "./page-shell";

/// The reading layout used by news posts: a back link, the
/// caller's header, the body in article-size prose, and — on wide screens with
/// enough sections to be worth it — a sticky "On this page" outline beside it.
export function ArticleLayout({
  back,
  header,
  blocks,
  footer,
}: {
  back: { href: string; label: string };
  header: React.ReactNode;
  blocks: ContentBlock[];
  footer?: React.ReactNode;
}) {
  const headings = extractHeadings(blocks);
  const showToc = headings.length >= 3;

  return (
    <PageShell>
      <div className={`mx-auto ${showToc ? "max-w-6xl xl:grid xl:grid-cols-[minmax(0,44rem)_15rem] xl:justify-center xl:gap-16" : "max-w-3xl"}`}>
        <article className="min-w-0">
          <Link href={back.href} className="text-xs font-semibold tracking-wide text-muted uppercase no-underline transition-colors hover:text-foreground">
            &larr; {back.label}
          </Link>

          <header className="mt-8 border-b border-border pb-10">{header}</header>

          <div className="mt-10">
            <ContentBlocks blocks={blocks} size="md" />
          </div>

          {footer}
        </article>

        {showToc ? (
          <aside className="hidden pt-14 xl:block">
            <ArticleToc items={headings} />
          </aside>
        ) : null}
      </div>
    </PageShell>
  );
}
