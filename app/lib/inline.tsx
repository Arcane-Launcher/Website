import NextLink from "next/link";
import type { ReactNode } from "react";

const LINK_CLASS = "text-accent-strong underline underline-offset-2 transition-colors hover:text-white";

/// One alternative per inline form, in priority order: `code`, **bold**,
/// [label](url), then a bare https:// URL. Everything else is plain text.
const TOKEN = /(`[^`\n]+`)|(\*\*[^*\n]+\*\*)|(\[[^\]\n]+\]\((?:https?:\/\/[^)\s]+|\/[^)\s]*)\))|(https?:\/\/[^\s<>)]*[^\s<>).,;:!?])/g;

/// GitHub's generated release notes are full of `.../pull/12` links; showing
/// them as `#12` keeps a changelog line readable.
function bareUrlLabel(url: string): string {
  const ref = url.match(/^https:\/\/github\.com\/[^/]+\/[^/]+\/(?:pull|issues)\/(\d+)$/);
  return ref ? `#${ref[1]}` : url;
}

function Anchor({ href, children }: { href: string; children: ReactNode }) {
  if (href.startsWith("/")) {
    return (
      <NextLink href={href} className={LINK_CLASS}>
        {children}
      </NextLink>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
      {children}
    </a>
  );
}

/// Turns the small inline-markup subset the news posts and release notes use into
/// React nodes. Built from elements only (never raw HTML), and links are limited
/// to https:// URLs and site-relative paths, so text from GitHub can't inject
/// markup or `javascript:` links.
export function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;

  for (const match of text.matchAll(TOKEN)) {
    const start = match.index ?? 0;
    if (start > last) out.push(text.slice(last, start));
    const [token, code, bold, link, bare] = match;

    if (code) {
      out.push(
        <code key={key++} className="rounded bg-white/8 px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
          {code.slice(1, -1)}
        </code>,
      );
    } else if (bold) {
      out.push(
        <strong key={key++} className="font-semibold text-white">
          {bold.slice(2, -2)}
        </strong>,
      );
    } else if (link) {
      const split = link.indexOf("](");
      out.push(
        <Anchor key={key++} href={link.slice(split + 2, -1)}>
          {link.slice(1, split)}
        </Anchor>,
      );
    } else if (bare) {
      out.push(
        <Anchor key={key++} href={bare}>
          {bareUrlLabel(bare)}
        </Anchor>,
      );
    } else {
      out.push(token);
    }
    last = start + token.length;
  }

  if (last < text.length) out.push(text.slice(last));
  return out;
}
