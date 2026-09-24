import type { Metadata } from "next";
import Link from "next/link";
import { Card, Chip, Heading } from "@heroui/react";
import { ContentBlocks } from "../components/content-blocks";
import { Reveal } from "../components/reveal";
import { formatPostDate } from "../lib/news-content";
import { parseReleaseNotes } from "../lib/release-notes";
import { fetchReleaseHistory, type ReleaseHistoryEntry } from "../lib/updates";
import { PageShell } from "../sections/page-shell";

export const metadata: Metadata = {
  title: "Changelog — Arcane Launcher",
  description: "Every published Arcane Launcher release and what changed in it.",
};

/// The release history is re-read at most this often, so a newly published
/// release shows up here without redeploying the site.
export const revalidate = 60;

function releaseDate(release: ReleaseHistoryEntry): string | null {
  return release.pub_date ? formatPostDate(release.pub_date.slice(0, 10)) : null;
}

function ReleaseCard({ release, latest }: { release: ReleaseHistoryEntry; latest: boolean }) {
  const date = releaseDate(release);
  const blocks = release.notes ? parseReleaseNotes(release.notes) : [];

  return (
    <Card className="rounded-2xl border border-border p-6" variant="default">
      <Card.Header>
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <Card.Title className="text-xl font-extrabold tracking-tight text-white">v{release.version}</Card.Title>
          {latest ? (
            <Chip variant="soft" color="accent" size="sm">
              Latest
            </Chip>
          ) : null}
          {date ? (
            <time dateTime={release.pub_date} className="text-xs text-muted">
              {date}
            </time>
          ) : null}
        </div>
      </Card.Header>
      <Card.Content>
        {blocks.length > 0 ? (
          <ContentBlocks blocks={blocks} />
        ) : (
          <p className="text-sm text-muted">No release notes were written for this version.</p>
        )}
      </Card.Content>
    </Card>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return <p className="mt-12 rounded-2xl border border-border bg-white/3 px-6 py-8 text-sm leading-relaxed text-muted">{children}</p>;
}

export default async function ChangelogPage() {
  const result = await fetchReleaseHistory(revalidate);
  const latestVersion = result.status === "ok" ? result.releases[0]?.version : undefined;

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl">
        <Heading level={1} className="text-4xl leading-tight font-extrabold tracking-tight text-white uppercase sm:text-5xl">
          Change<span className="text-muted">log</span>
        </Heading>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
          Every published release of Arcane Launcher and what changed in it. Announcements and feature write-ups live in{" "}
          <Link href="/news" className="text-accent-strong underline underline-offset-2 hover:text-white">
            News
          </Link>
          .
        </p>

        {result.status === "unconfigured" ? (
          <Notice>The changelog isn&apos;t connected to a release source yet. Check back once the first release is published.</Notice>
        ) : result.status === "error" ? (
          <Notice>Couldn&apos;t load releases just now. Refresh in a minute, and the list will be back.</Notice>
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
              <Reveal key={release.version} y={20} delay={Math.min(i, 3) * 0.05}>
                <ReleaseCard release={release} latest={release.version === latestVersion} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
