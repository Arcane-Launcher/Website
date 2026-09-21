/// A tiny read-only client for Sanity's HTTP query API. The site only ever
/// reads published news; writing happens in the Studio (website/studio). Plain
/// `fetch` keeps this dependency-free and lets Next cache and tag the responses.

const API_VERSION = "2025-01-01";

/// Tag on every Sanity read, so the /api/revalidate webhook can drop them all
/// the moment an editor publishes.
export const SANITY_TAG = "sanity-news";

function config() {
  const projectId = process.env.SANITY_PROJECT_ID?.trim();
  // Project ids are lowercase letters, digits and dashes; anything else is a typo.
  if (!projectId || !/^[a-z0-9-]+$/.test(projectId)) return null;
  return { projectId, dataset: process.env.SANITY_DATASET?.trim() || "production" };
}

export function sanityConfigured(): boolean {
  return config() !== null;
}

/// Runs a GROQ query against published documents. Returns null when Sanity isn't
/// configured or can't be reached, so callers can fall back instead of breaking
/// the page.
export async function sanityQuery<T>(query: string, revalidateSeconds: number): Promise<T | null> {
  const cfg = config();
  if (!cfg) return null;

  // Reads normally go through the public CDN. A read token (only needed if the
  // dataset is private) has to use the live API host instead.
  const token = process.env.SANITY_READ_TOKEN?.trim();
  const host = token ? "api.sanity.io" : "apicdn.sanity.io";
  const url =
    `https://${cfg.projectId}.${host}/v${API_VERSION}/data/query/${cfg.dataset}` +
    `?query=${encodeURIComponent(query)}&perspective=published`;

  try {
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      next: { revalidate: revalidateSeconds, tags: [SANITY_TAG] },
    });
    if (!res.ok) {
      console.error(`Sanity query failed: HTTP ${res.status}`);
      return null;
    }
    return ((await res.json()) as { result: T }).result;
  } catch (error) {
    console.error("Sanity query failed:", error);
    return null;
  }
}
