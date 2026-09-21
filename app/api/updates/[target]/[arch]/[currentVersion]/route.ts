import { NextResponse } from "next/server";
import { githubHeaders, type GithubRelease } from "../../../../../lib/github";

/// Which release asset is the updater payload for each `{target}-{arch}` the
/// launcher can report. Tauri's `createUpdaterArtifacts` emits a `.sig` file
/// next to each of these; the signature is what the launcher verifies against
/// the pubkey baked into its tauri.conf.json before it will install anything.
/// Only Windows is listed because that's all the launcher currently ships —
/// add a row here (e.g. `darwin-aarch64` -> /aarch64\.app\.tar\.gz$/) when
/// another platform's build is published.
const PLATFORM_ASSETS: Record<string, RegExp> = {
  "windows-x86_64": /_x64-setup\.exe$/i,
  "windows-aarch64": /_arm64-setup\.exe$/i,
  "windows-i686": /_x86-setup\.exe$/i,
};

/// How long GitHub's answer is reused before asking again. Unauthenticated
/// GitHub API calls are limited to 60/hour per IP, so caching (rather than
/// hitting GitHub once per launcher) is what keeps this from being rate-limited.
const RELEASE_CACHE_SECONDS = 60;
const SIGNATURE_CACHE_SECONDS = 3600;

/// Compares two `major.minor.patch`-style version strings. Deliberately
/// dependency-free (no semver package) since this is the only place version
/// comparison happens — returns >0 if `a` is newer than `b`.
function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map((n) => parseInt(n, 10) || 0);
  const pb = b.split(".").map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

/// Arcane Launcher's real auto-update check, implementing Tauri's dynamic
/// updater contract: https://v2.tauri.app/plugin/updater/ — the desktop app
/// requests `/api/updates/{target}/{arch}/{currentVersion}` (those three
/// segments come from the `{{target}}/{{arch}}/{{current_version}}` template
/// in its tauri.conf.json `updater.endpoints`), and this returns either:
///   - 204 No Content, if there's nothing newer than what it's already running
///     (also the answer when the repo has no published release yet), or
///   - 200 with { version, url, signature, notes, pub_date } for the newest
///     published GitHub Release, if it beats currentVersion and ships that
///     platform's installer + `.sig`.
///
/// There's no release list to maintain here: publishing a (non-draft,
/// non-prerelease) GitHub Release on `GITHUB_REPO` is what makes launchers
/// pick the update up, within RELEASE_CACHE_SECONDS, with no website redeploy.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ target: string; arch: string; currentVersion: string }> },
) {
  const { target, arch, currentVersion } = await params;

  const repo = process.env.GITHUB_REPO;
  if (!repo) {
    return NextResponse.json(
      { error: "Updater API isn't configured: set GITHUB_REPO (e.g. owner/arcane-launcher)." },
      { status: 503 },
    );
  }

  const assetPattern = PLATFORM_ASSETS[`${target}-${arch}`];
  if (!assetPattern) return new NextResponse(null, { status: 204 });

  try {
    // `/releases/latest` already skips drafts and prereleases.
    const releaseRes = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
      headers: githubHeaders(),
      next: { revalidate: RELEASE_CACHE_SECONDS },
    });
    if (releaseRes.status === 404) return new NextResponse(null, { status: 204 });
    if (!releaseRes.ok) {
      return NextResponse.json({ error: `GitHub returned ${releaseRes.status}.` }, { status: 502 });
    }
    const release = (await releaseRes.json()) as GithubRelease;

    const version = release.tag_name.replace(/^v/i, "");
    if (compareVersions(version, currentVersion) <= 0) {
      return new NextResponse(null, { status: 204 });
    }

    const installer = release.assets.find((a) => assetPattern.test(a.name));
    const sigAsset = installer && release.assets.find((a) => a.name === `${installer.name}.sig`);
    if (!installer || !sigAsset) {
      // The release exists but doesn't (yet) carry a signed build for this
      // platform — e.g. assets are still uploading. Not an error for the
      // launcher; it just has nothing to install right now.
      return new NextResponse(null, { status: 204 });
    }

    const sigRes = await fetch(sigAsset.browser_download_url, {
      next: { revalidate: SIGNATURE_CACHE_SECONDS },
    });
    if (!sigRes.ok) {
      return NextResponse.json({ error: `Couldn't read signature (${sigRes.status}).` }, { status: 502 });
    }

    return NextResponse.json({
      version,
      notes: release.body ?? "",
      pub_date: release.published_at ?? undefined,
      url: installer.browser_download_url,
      signature: (await sigRes.text()).trim(),
    });
  } catch {
    return NextResponse.json({ error: "Couldn't reach GitHub." }, { status: 502 });
  }
}
