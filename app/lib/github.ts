/// Everything the site reads from GitHub goes through here: the updater API,
/// the changelog page, and the footer's community links all share one repo
/// setting (`GITHUB_REPO`) and one set of request headers.

export interface GithubAsset {
  name: string;
  browser_download_url: string;
}

export interface GithubRelease {
  tag_name: string;
  name: string | null;
  body: string | null;
  html_url: string;
  draft: boolean;
  prerelease: boolean;
  published_at: string | null;
  assets: GithubAsset[];
}

/// `owner/name` of the repo whose Releases are the launcher's source of truth,
/// or null when the site hasn't been configured with one.
export function githubRepo(): string | null {
  const repo = process.env.GITHUB_REPO?.trim();
  return repo && /^[\w.-]+\/[\w.-]+$/.test(repo) ? repo : null;
}

export function githubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "arcane-launcher-website",
  };
  // Optional: raises GitHub's rate limit from 60/h to 5000/h. Only needs
  // read access to public repos, so a fine-grained token with no scopes works.
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return headers;
}

export type ReleasesResult =
  | { status: "ok"; releases: GithubRelease[] }
  | { status: "unconfigured" }
  | { status: "error" };

/// Published releases, newest first. Drafts never appear (GitHub only shows
/// them to authenticated collaborators) but are filtered anyway so a token with
/// push access can't leak one onto the public site.
export async function fetchReleases(revalidateSeconds: number, limit = 30): Promise<ReleasesResult> {
  const repo = githubRepo();
  if (!repo) return { status: "unconfigured" };

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=${limit}`, {
      headers: githubHeaders(),
      next: { revalidate: revalidateSeconds },
    });
    // A repo with no releases answers 200 with []; 404 means the repo isn't
    // reachable (private, or the name is wrong) — same as "nothing to show".
    if (res.status === 404) return { status: "ok", releases: [] };
    if (!res.ok) return { status: "error" };
    const releases = ((await res.json()) as GithubRelease[]).filter((r) => !r.draft);
    return { status: "ok", releases };
  } catch {
    return { status: "error" };
  }
}

export type CommunityLinks = { github: string | null; discord: string | null };

/// Public community destinations, each shown only when it's really configured.
/// Nothing is guessed: no GITHUB_REPO means no GitHub link, no
/// DISCORD_INVITE_URL means no Discord link.
export function communityLinks(): CommunityLinks {
  const repo = githubRepo();
  const discordRaw = process.env.DISCORD_INVITE_URL?.trim();
  let discord: string | null = null;
  if (discordRaw) {
    try {
      const url = new URL(discordRaw);
      if (url.protocol === "https:") discord = url.toString();
    } catch {
      discord = null;
    }
  }
  return { github: repo ? `https://github.com/${repo}` : null, discord };
}
