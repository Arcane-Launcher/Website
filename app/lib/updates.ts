/// Everything the site reads from the launcher's Cloudflare R2 update bucket:
/// the current release (for the hero's download button) and the release
/// history (for /changelog). This is a completely different source from
/// GitHub (see `github.ts`) — there is no GitHub Release created per launcher
/// version any more, `scripts/publish-update.mjs` in the launcher repo writes
/// straight to R2, so this is the only place that data comes from.

export interface ReleasePlatform {
  url: string;
  signature: string;
}

export interface LatestRelease {
  version: string;
  notes: string;
  pub_date: string;
  platforms: Record<string, ReleasePlatform>;
}

export interface ReleaseHistoryEntry {
  version: string;
  notes: string;
  pub_date: string;
}

/// The public domain the update bucket is served from, e.g.
/// `https://update.arcaneworld.lk` (no trailing slash). Distinct from
/// `GITHUB_REPO` — this site never talks to R2's own API, only the plain
/// files it serves publicly, same as the launcher's updater plugin does.
function updatesBaseUrl(): string | null {
  const url = process.env.R2_UPDATES_BASE_URL?.trim().replace(/\/+$/, "");
  return url && /^https:\/\//.test(url) ? url : null;
}

export type LatestReleaseResult =
  | { status: "ok"; release: LatestRelease }
  | { status: "unconfigured" }
  | { status: "none" }
  | { status: "error" };

/// The currently-shipping release, straight from the same latest.json the
/// launcher's updater plugin reads. `status: "none"` means the bucket is
/// reachable but nothing has been published yet (a fresh bucket 404s here).
export async function fetchLatestRelease(revalidateSeconds: number): Promise<LatestReleaseResult> {
  const base = updatesBaseUrl();
  if (!base) return { status: "unconfigured" };

  try {
    const res = await fetch(`${base}/latest.json`, { next: { revalidate: revalidateSeconds } });
    if (res.status === 404) return { status: "none" };
    if (!res.ok) {
      console.error(`latest.json: HTTP ${res.status} from ${base}`);
      return { status: "error" };
    }
    return { status: "ok", release: (await res.json()) as LatestRelease };
  } catch (error) {
    console.error(`latest.json: fetch from ${base} failed`, error);
    return { status: "error" };
  }
}

/// One direct download on the /download page. `size` is in bytes; it's
/// missing when the entry came from latest.json (the fallback below).
export interface DownloadFile {
  version: string;
  url: string;
  size?: number;
}

/// windows / windows-arm64 installers, appimage, deb, rpm, pacman.
export type DownloadKind = "windows" | "windows-arm64" | "appimage" | "deb" | "rpm" | "pacman";

export type DownloadFiles = Partial<Record<DownloadKind, DownloadFile>>;

export type DownloadsResult =
  | { status: "ok"; files: DownloadFiles }
  | { status: "unconfigured" }
  | { status: "error" };

const PLATFORM_KIND: Record<string, DownloadKind> = {
  "windows-x86_64": "windows",
  "windows-aarch64": "windows-arm64",
  "linux-x86_64": "appimage",
};

/// Every direct download, from the downloads.json that
/// `scripts/publish-update.mjs` writes next to latest.json. The .deb, .rpm
/// and pacman packages are only listed there (they don't self-update, so
/// they're not in latest.json). Releases published before downloads.json
/// existed fall back to latest.json's installers.
export async function fetchDownloads(revalidateSeconds: number): Promise<DownloadsResult> {
  const base = updatesBaseUrl();
  if (!base) return { status: "unconfigured" };

  try {
    const res = await fetch(`${base}/downloads.json`, { next: { revalidate: revalidateSeconds } });
    if (res.ok) {
      const body = (await res.json()) as { files?: DownloadFiles };
      return { status: "ok", files: body.files ?? {} };
    }
    if (res.status !== 404) {
      console.error(`downloads.json: HTTP ${res.status} from ${base}`);
      return { status: "error" };
    }
  } catch (error) {
    console.error(`downloads.json: fetch from ${base} failed`, error);
    return { status: "error" };
  }

  const latest = await fetchLatestRelease(revalidateSeconds);
  if (latest.status === "unconfigured" || latest.status === "error") return latest;
  const files: DownloadFiles = {};
  if (latest.status === "ok") {
    for (const [key, platform] of Object.entries(latest.release.platforms)) {
      const kind = PLATFORM_KIND[key];
      if (kind) files[kind] = { version: latest.release.version, url: platform.url };
    }
  }
  return { status: "ok", files };
}

export type ReleaseHistoryResult =
  | { status: "ok"; releases: ReleaseHistoryEntry[] }
  | { status: "unconfigured" }
  | { status: "error" };

/// Every published release, newest first — maintained by
/// `scripts/publish-update.mjs`, which merges each new version in rather
/// than overwriting the list.
export async function fetchReleaseHistory(revalidateSeconds: number): Promise<ReleaseHistoryResult> {
  const base = updatesBaseUrl();
  if (!base) return { status: "unconfigured" };

  try {
    const res = await fetch(`${base}/releases.json`, { next: { revalidate: revalidateSeconds } });
    // A fresh bucket with nothing published yet is the same as an empty list.
    if (res.status === 404) return { status: "ok", releases: [] };
    if (!res.ok) {
      console.error(`releases.json: HTTP ${res.status} from ${base}`);
      return { status: "error" };
    }
    return { status: "ok", releases: (await res.json()) as ReleaseHistoryEntry[] };
  } catch (error) {
    console.error(`releases.json: fetch from ${base} failed`, error);
    return { status: "error" };
  }
}
