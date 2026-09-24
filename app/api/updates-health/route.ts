import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/// Reports what this deployment gets back when it fetches the R2 update bucket,
/// so a disabled download button can be traced to its cause (unset variable,
/// wrong domain, Cloudflare blocking the host, bad JSON). Only the public
/// bucket URL is echoed back; nothing secret is read here.
export async function GET() {
  const raw = process.env.R2_UPDATES_BASE_URL;
  const base = raw?.trim().replace(/\/+$/, "");
  const report: Record<string, unknown> = {
    variableSet: raw !== undefined,
    variableValue: raw === undefined ? null : JSON.stringify(raw),
    acceptedAsHttps: !!base && /^https:\/\//.test(base),
  };

  if (base && /^https:\/\//.test(base)) {
    for (const file of ["latest.json", "releases.json"]) {
      try {
        const res = await fetch(`${base}/${file}`, { cache: "no-store" });
        const body = await res.text();
        let json = false;
        try {
          JSON.parse(body);
          json = true;
        } catch {}
        report[file] = {
          status: res.status,
          contentType: res.headers.get("content-type"),
          server: res.headers.get("server"),
          validJson: json,
          bodyStart: body.slice(0, 200),
        };
      } catch (error) {
        const e = error as Error & { cause?: { code?: string; message?: string } };
        report[file] = { fetchFailed: e.message, cause: e.cause?.code ?? e.cause?.message ?? null };
      }
    }
  }

  return NextResponse.json(report, { headers: { "cache-control": "no-store" } });
}
