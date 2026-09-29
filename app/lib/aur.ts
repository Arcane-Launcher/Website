/// The Arch User Repository package that repackages the launcher's .deb
/// (`packaging/aur/arcane-launcher-bin` in the launcher repo).
export const AUR_PACKAGE = "arcane-launcher-bin";

export type AurPackage = { version: string; url: string };

/// The AUR package, read from the AUR's own RPC — null until it has really
/// been published there (or when the AUR can't be reached), so the site never
/// shows a `yay -S` command that would fail.
export async function fetchAurPackage(revalidateSeconds: number): Promise<AurPackage | null> {
  try {
    const res = await fetch(`https://aur.archlinux.org/rpc/v5/info?arg%5B%5D=${AUR_PACKAGE}`, {
      next: { revalidate: revalidateSeconds },
    });
    if (!res.ok) {
      console.error(`AUR RPC: HTTP ${res.status}`);
      return null;
    }
    const body = (await res.json()) as { results?: { Name: string; Version: string }[] };
    const pkg = body.results?.find((r) => r.Name === AUR_PACKAGE);
    return pkg ? { version: pkg.Version, url: `https://aur.archlinux.org/packages/${AUR_PACKAGE}` } : null;
  } catch (error) {
    console.error("AUR RPC: fetch failed", error);
    return null;
  }
}
