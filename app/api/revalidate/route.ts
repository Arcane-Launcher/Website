import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { SANITY_TAG } from "../../lib/sanity";

function matches(provided: string | null, expected: string): boolean {
  if (!provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/// Called by a Sanity webhook whenever a post is created, edited, or deleted, so
/// the site shows the change right away instead of after the 60 second cache.
/// Set the webhook's URL to `https://<site>/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>`
/// (method POST). Without SANITY_REVALIDATE_SECRET this endpoint is switched off.
export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ error: "Revalidation isn't configured: set SANITY_REVALIDATE_SECRET." }, { status: 503 });
  }

  const provided = new URL(request.url).searchParams.get("secret") ?? request.headers.get("x-revalidate-secret");
  if (!matches(provided, secret)) {
    return NextResponse.json({ error: "Invalid secret." }, { status: 401 });
  }

  // expire: 0 means nobody is served the old list while the new one loads, so an
  // editor who hits Publish and opens the site sees their post.
  revalidateTag(SANITY_TAG, { expire: 0 });
  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}
