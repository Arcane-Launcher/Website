import type { Metadata } from "next";
import { Chip, Heading, Link, Paragraph, buttonVariants } from "@heroui/react";
import { fetchLatestRelease } from "../lib/updates";
import { PageShell } from "../sections/page-shell";
import { OpenLauncher } from "./open-launcher";

export const metadata: Metadata = {
  title: "Join server — Arcane Launcher",
  description: "Join a Minecraft server straight from Arcane Launcher.",
  robots: { index: false },
};

const LOADERS: Record<string, string> = {
  vanilla: "Vanilla",
  fabric: "Fabric",
  quilt: "Quilt",
  forge: "Forge",
  neoforge: "NeoForge",
};

type Params = { server?: string; mc?: string; loader?: string };

/// The same rules the launcher applies to arcane://join links
/// (src-tauri/src/services/join_link.rs): a public host with an optional
/// port, a short version, a known loader.
function readJoin({ server, mc, loader }: Params) {
  if (!server || !mc || !loader || !(loader in LOADERS)) return null;
  const [host, port, ...extra] = server.trim().split(":");
  const hostOk = /^[a-zA-Z0-9][a-zA-Z0-9.-]{0,252}$/.test(host) && !/^(localhost|.*\.local|.*\.lan)$/i.test(host);
  const portOk = port === undefined || (/^\d{1,5}$/.test(port) && Number(port) > 0 && Number(port) < 65536);
  const versionOk = /^[a-zA-Z0-9._\- ]{1,32}$/.test(mc);
  const privateIp = /^(10\.|127\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|0\.)/.test(host);
  if (extra.length > 0 || !hostOk || !portOk || !versionOk || privateIp) return null;
  return { server: server.trim(), mc: mc.trim(), loader };
}

export default async function JoinPage({ searchParams }: { searchParams: Promise<Params> }) {
  const join = readJoin(await searchParams);
  const latest = await fetchLatestRelease(60);

  if (!join) {
    return (
      <PageShell>
        <div className="mx-auto max-w-xl text-center">
          <Heading level={1} className="w-full !text-center text-3xl font-extrabold tracking-tight text-white uppercase">
            This join link isn&apos;t valid
          </Heading>
          <Paragraph color="muted" className="mt-4 text-sm">
            Ask your friend for a fresh one from their Discord status.
          </Paragraph>
          <Link href="/" className={buttonVariants({ variant: "outline" }) + " mt-8 text-sm no-underline"}>
            Back to home
          </Link>
        </div>
      </PageShell>
    );
  }

  const deepLink = `arcane://join?server=${encodeURIComponent(join.server)}&mc=${encodeURIComponent(join.mc)}&loader=${join.loader}`;
  const loaderName = LOADERS[join.loader];

  return (
    <PageShell>
      <OpenLauncher href={deepLink} />
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <Chip className="text-xs">
          {loaderName} {join.mc}
        </Chip>
        <Heading level={1} className="mt-5 w-full !text-center text-3xl font-extrabold tracking-tight text-white uppercase sm:text-5xl">
          Join server
        </Heading>
        <p className="mt-3 max-w-full font-mono text-lg text-accent-strong [overflow-wrap:anywhere] sm:text-xl">
          {join.server}
        </p>
        <Paragraph color="muted" className="mt-4 max-w-md text-sm leading-relaxed">
          Arcane Launcher opens with this server ready. If you don&apos;t have a {loaderName} {join.mc} instance, it
          can make one for you.
        </Paragraph>

        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          <Link href={deepLink} className={buttonVariants({ variant: "primary" }) + " text-sm no-underline"}>
            Open in Arcane Launcher
          </Link>
          {latest.status === "ok" && (
            <Link href="/download" className={buttonVariants({ variant: "outline" }) + " text-sm no-underline"}>
              Download Arcane
            </Link>
          )}
        </div>

        <Paragraph color="muted" className="mt-10 text-xs">
          Don&apos;t have Arcane yet? Download it, sign in, then click the link in Discord again.
        </Paragraph>
      </div>
    </PageShell>
  );
}
