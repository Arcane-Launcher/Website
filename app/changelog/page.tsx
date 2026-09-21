import type { Metadata } from "next";
import Link from "next/link";
import { Card, Chip, Heading } from "@heroui/react";
import { ContentBlocks } from "../components/content-blocks";
import { Reveal } from "../components/reveal";
import { fetchReleases, type GithubRelease } from "../lib/github";
import { formatPostDate } from "../lib/news-content";
import { parseReleaseNotes } from "../lib/release-notes";
import { PageShell } from "../sections/page-shell";

export const metadata: Metadata = {
  title: "Changelog — Arcane Launcher",
  description: "Every published Arcane Launcher release and what changed in it, straight from GitHub Releases.",
};

/// The release list is re-read from GitHub at most this often, so a newly
/// published release shows up here without redeploying the site. Also what lets
/// the page pick up `GITHUB_REPO` when it's only set at runtime, not build time.
export const revalidate = 300;

function releaseDate(release: GithubRelease): string | null {
  return release.published_at ? formatPostDate(release.published_at.slice(0, 10)) : null;
}

function safeReleaseUrl(release: GithubRelease): string | null {
  return release.html_url.startsWith("https://github.com/") ? release.html_url : null;
}

function ReleaseCard({ release, latest }: { release: GithubRelease; latest: boolean }) {
  const date = releaseDate(release);
  const url = safeReleaseUrl(release);
  const blocks = release.body ? parseReleaseNotes(release.body) : [];
  // A release titled just "v0.2.0" repeats its tag; only show real titles.
  const title = release.name && release.name.trim() !== release.tag_name ? release.name.trim() : null;

  return (
    <Card className="rounded-2xl border border-border p-6" variant="default">
      <Card.Header>
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <Card.Title className="text-xl font-extrabold tracking-tight text-white">{release.tag_name}</Card.Title>
          {latest ? (
            <Chip variant="soft" color="accent" size="sm">
              Latest
            </Chip>
          ) : null}
          {release.prerelease ? (
            <Chip variant="soft" color="warning" size="sm">
              Pre-release
            </Chip>
          ) : null}
          {date && release.published_at ? (
            <time dateTime={release.published_at} className="text-xs text-muted">
              {date}
            </time>
          ) : null}
        </div>
        {title ? <p className="text-base font-semibold text-white">{title}</p> : null}
      </Card.Header>
      <Card.Content>
        {blocks.length > 0 ? (
          <ContentBlocks blocks={blocks} />
        ) : (
          <p className="text-sm text-muted">No release notes were written for this version.</p>
        )}
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-block text-xs font-semibold tracking-wide text-accent-strong uppercase no-underline transition-transform duration-200 hover:translate-x-1"
          >
            View on GitHub &rarr;
          </a>
        ) : null}
      </Card.Content>
    </Card>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return <p className="mt-12 rounded-2xl border border-border bg-white/3 px-6 py-8 text-sm leading-relaxed text-muted">{children}</p>;
}

export default async function ChangelogPage() {
  const result = await fetchReleases(revalidate);
  // The first stable release is "Latest"; a newer pre-release doesn't take that badge.
  const latestTag = result.status === "ok" ? result.releases.find((r) => !r.prerelease)?.tag_name : undefined;

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl">
        <Heading level={1} className="text-4xl leading-tight font-extrabold tracking-tight text-white uppercase sm:text-5xl">
          Change<span className="text-muted">log</span>
        </Heading>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
          Every published release of Arcane Launcher and what changed in it, read live from GitHub Releases. Announcements and
          feature write-ups live in{" "}
          <Link href="/news" className="text-accent-strong underline underline-offset-2 hover:text-white">
            News
          </Link>
          .
        </p>

        {result.status === "unconfigured" ? (
          <Notice>The changelog isn&apos;t connected to a release source yet. Check back once the first release is published.</Notice>
        ) : result.status === "error" ? (
          <Notice>Couldn&apos;t load releases from GitHub just now. Refresh in a minute, and the list will be back.</Notice>
        ) : result.releases.length === 0 ? (
          <Notice>
            No releases yet. The first release hasn&apos;t shipped. Check the{" "}
            <Link href="/news" className="text-accent-strong underline underline-offset-2 hover:text-white">
              news
            </Link>{" "}
            for what&apos;s coming.
          </Notice>
        ) : (
          <div className="mt-12 flex flex-col gap-4">
            {result.releases.map((release, i) => (
              <Reveal key={release.tag_name} y={20} delay={Math.min(i, 3) * 0.05}>
                <ReleaseCard release={release} latest={release.tag_name === latestTag} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
