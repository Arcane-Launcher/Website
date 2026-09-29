import type { Metadata } from "next";
import Image from "next/image";
import NextLink from "next/link";
import { Chip, Heading, Link, buttonVariants } from "@heroui/react";
import { BetaBadge } from "../components/beta-badge";
import { BlockArt, type BlockKey } from "../components/block-art";
import { CircuitMotif } from "../components/circuit-motif";
import { CopyCommand } from "../components/copy-command";
import { Reveal } from "../components/reveal";
import { AUR_PACKAGE, fetchAurPackage, type AurPackage } from "../lib/aur";
import { formatPostDate } from "../lib/news-content";
import { fetchDownloads, fetchLatestRelease, type DownloadFile, type DownloadFiles } from "../lib/updates";
import { PageShell } from "../sections/page-shell";
import { fileName, formatSize, shellArg } from "./format";
import { DownloadIcon, WindowsIcon } from "./os-icons";
import { PlatformTabs } from "./platform-tabs";
import { PrimaryDownload } from "./primary-download";

export const metadata: Metadata = {
  title: "Download — Arcane Launcher",
  description: "Download Arcane Launcher for Windows or Linux: installer, AppImage, .deb, .rpm and Arch Linux packages.",
};

/// A newly published release shows up here within a minute, without a redeploy.
export const revalidate = 60;

const LINK = "text-accent-strong underline underline-offset-2 hover:text-white";
const CARD = "feature-card relative overflow-hidden rounded-3xl border border-border bg-surface/80 backdrop-blur-sm";

function Notice({ children }: { children: React.ReactNode }) {
  return <p className="mt-12 rounded-2xl border border-border bg-white/3 px-6 py-8 text-sm leading-relaxed text-muted">{children}</p>;
}

function FileButton({ file, primary }: { file: DownloadFile; primary?: boolean }) {
  const size = formatSize(file.size);
  return (
    <div className="flex shrink-0 flex-col items-start gap-1.5 sm:items-end">
      <Link
        href={file.url}
        className={buttonVariants({ variant: primary ? "primary" : "outline" }) + " gap-2 rounded-xl px-5 text-sm font-bold no-underline"}
      >
        <DownloadIcon /> Download
      </Link>
      <span className="font-mono text-[11px] text-muted">
        v{file.version}
        {size ? ` · ${size}` : ""}
      </span>
    </div>
  );
}

function Tags({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span key={item} className="rounded-md border border-white/8 bg-white/4 px-2 py-0.5 text-[11px] font-semibold text-foreground/80">
          {item}
        </span>
      ))}
    </div>
  );
}

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-muted">
      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[10px] text-accent-strong">
        ✓
      </span>
      {children}
    </li>
  );
}

function WindowsPanel({ files }: { files: DownloadFiles }) {
  const x64 = files.windows;
  const arm = files["windows-arm64"];
  if (!x64 && !arm) return <p className="text-sm text-muted">No Windows build has been published yet.</p>;

  return (
    <div className="flex flex-col gap-4">
      {x64 ? (
        <div className={`${CARD} p-6 sm:p-8`}>
          <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 text-accent-strong">
                <WindowsIcon className="h-6 w-6" />
              </span>
              <div>
                <Heading level={3} className="text-xl font-extrabold text-white">
                  Windows installer
                </Heading>
                <p className="mt-1 text-sm text-muted">64-bit · Windows 10 and 11</p>
                <ul className="mt-5 flex flex-col gap-2">
                  <Check>Installs for your user account, no administrator rights needed</Check>
                  <Check>Updates download and install themselves</Check>
                  <Check>Every update is signed and checked before it installs</Check>
                </ul>
              </div>
            </div>
            <FileButton file={x64} primary />
          </div>
        </div>
      ) : null}
      {arm ? (
        <div className={`${CARD} flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between`}>
          <div>
            <p className="font-bold text-white">Windows on ARM</p>
            <p className="mt-1 text-sm text-muted">For ARM64 devices, like Snapdragon laptops.</p>
          </div>
          <FileButton file={arm} />
        </div>
      ) : null}
    </div>
  );
}

function PackageCard({
  block,
  format,
  distros,
  file,
  commands,
  footer,
}: {
  block: BlockKey;
  format: string;
  distros: string[];
  file?: DownloadFile;
  commands: string[];
  footer?: React.ReactNode;
}) {
  return (
    <div className={`${CARD} flex flex-col gap-5 p-6`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <BlockArt block={block} className="h-10 w-10" />
          <span className="font-mono text-lg font-bold text-white">{format}</span>
        </div>
        {file ? <FileButton file={file} /> : null}
      </div>
      <Tags items={distros} />
      <div className="mt-auto flex flex-col gap-2">
        {commands.map((command) => (
          <CopyCommand key={command} command={command} />
        ))}
        {footer}
      </div>
    </div>
  );
}

function LinuxPanel({ files, aur }: { files: DownloadFiles; aur: AurPackage | null }) {
  const { appimage, deb, rpm, pacman } = files;
  if (!appimage && !deb && !rpm && !pacman && !aur) {
    return <p className="text-sm text-muted">No Linux build has been published yet.</p>;
  }

  const inDownloads = (file: DownloadFile, install: (name: string) => string) =>
    `cd ~/Downloads && ${install(shellArg(fileName(file)))}`;

  return (
    <div className="flex flex-col gap-4">
      {appimage ? (
        <div className={`${CARD} border-accent/30 p-6 sm:p-8`}>
          <div aria-hidden className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <BlockArt block="diamond" className="h-11 w-11" />
                <Heading level={3} className="text-xl font-extrabold text-white">
                  AppImage
                </Heading>
                <Chip variant="soft" color="accent" size="sm">
                  Recommended
                </Chip>
              </div>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
                One file that runs on any 64-bit distribution. It&apos;s the only Linux version that updates itself, just like
                on Windows.
              </p>
              <div className="mt-5">
                <FileButton file={appimage} primary />
              </div>
            </div>
            <CopyCommand command={inDownloads(appimage, (f) => `chmod +x ${f} && ./${f}`)} />
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        {deb ? (
          <PackageCard
            block="redstone"
            format=".deb"
            distros={["Ubuntu", "Debian", "Linux Mint", "Pop!_OS", "Zorin"]}
            file={deb}
            commands={[inDownloads(deb, (f) => `sudo apt install ./${f}`)]}
          />
        ) : null}
        {rpm ? (
          <PackageCard
            block="gold"
            format=".rpm"
            distros={["Fedora", "openSUSE", "RHEL", "Nobara"]}
            file={rpm}
            commands={[inDownloads(rpm, (f) => `sudo dnf install ./${f}`)]}
            footer={<p className="text-[11px] text-muted">On openSUSE, use zypper install instead.</p>}
          />
        ) : null}
        {pacman || aur ? (
          <PackageCard
            block="stone"
            format={aur ? "AUR" : "pacman"}
            distros={["Arch", "Manjaro", "EndeavourOS", "CachyOS"]}
            file={aur ? undefined : pacman}
            commands={[
              ...(aur ? [`yay -S ${AUR_PACKAGE}`] : []),
              ...(pacman && !aur ? [inDownloads(pacman, (f) => `sudo pacman -U ${f}`)] : []),
            ]}
            footer={
              aur ? (
                <p className="text-[11px] text-muted">
                  <Link href={aur.url} className={LINK}>
                    {AUR_PACKAGE}
                  </Link>{" "}
                  on the AUR
                  {pacman ? (
                    <>
                      {" · "}
                      <Link href={pacman.url} className={LINK}>
                        package file
                      </Link>
                    </>
                  ) : null}
                </p>
              ) : null
            }
          />
        ) : null}
      </div>

      {deb || rpm || pacman ? (
        <p className="rounded-2xl border border-border bg-white/2 px-5 py-4 text-xs leading-relaxed text-muted">
          <strong className="font-semibold text-white">About updates.</strong> The .deb, .rpm and Arch packages belong to your
          package manager, so the launcher doesn&apos;t replace them itself.
          {aur ? " From the AUR, a normal system update picks up new versions." : null} Otherwise grab the new package here
          when the{" "}
          <NextLink href="/changelog" className={LINK}>
            changelog
          </NextLink>{" "}
          shows a new version.
        </p>
      ) : null}
    </div>
  );
}

const STEPS: { block: BlockKey; title: string; text: string }[] = [
  { block: "grassSide", title: "Sign in", text: "Use your Microsoft account, or play offline." },
  { block: "planks", title: "Bring your instances", text: "Import from Prism, CurseForge, the Modrinth App and more." },
  { block: "diamond", title: "Play", text: "Pick a version and loader, add mods, press Play." },
];

function HeroArt() {
  return (
    <div aria-hidden className="relative mx-auto hidden h-72 w-72 lg:block">
      <div className="absolute inset-8 rounded-full bg-accent/25 blur-[70px]" />
      <CircuitMotif className="absolute inset-0 h-full w-full text-accent/20" />
      <BlockArt block="grassSide" className="absolute top-4 left-6 h-20 w-20 -rotate-12" />
      <BlockArt block="diamond" className="absolute right-4 bottom-10 h-16 w-16 rotate-6" />
      <BlockArt block="redstone" className="absolute bottom-2 left-14 h-12 w-12 rotate-12" />
      <BlockArt block="gold" className="absolute top-10 right-10 h-10 w-10 -rotate-6" />
      <div className="absolute top-1/2 left-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[28px] border border-accent/40 bg-surface/90 shadow-[0_0_60px_rgba(var(--accent-rgb),0.45)]">
        <Image src="/logo.png" alt="" width={60} height={60} quality={100} className="rounded-xl" />
      </div>
    </div>
  );
}

export default async function DownloadPage() {
  const [downloads, latest, aur] = await Promise.all([
    fetchDownloads(revalidate),
    fetchLatestRelease(revalidate),
    fetchAurPackage(revalidate * 10),
  ]);
  const files = downloads.status === "ok" ? downloads.files : {};
  const version = (files.windows ?? files.appimage ?? files.deb)?.version;
  const released =
    latest.status === "ok" && latest.release.version === version && latest.release.pub_date
      ? formatPostDate(latest.release.pub_date.slice(0, 10))
      : null;
  const hasLinux = Boolean(files.appimage || files.deb || files.rpm || files.pacman || aur);
  const nothing = downloads.status === "ok" && !version && !aur;

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl">
        <section className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <div className="flex flex-wrap items-center gap-3">
              <BetaBadge scale={1.3} />
              {version ? (
                <span className="font-mono text-xs text-muted">
                  v{version}
                  {released ? ` · released ${released}` : ""}
                </span>
              ) : null}
            </div>
            <Heading
              level={1}
              className="mt-5 text-4xl leading-[1.05] font-extrabold tracking-tight text-white uppercase sm:text-6xl"
            >
              Get Arcane
              <br />
              <span
                className="text-accent-strong"
                style={{ filter: "drop-shadow(0 0 10px var(--accent-strong))" }}
              >
                Launcher
              </span>
            </Heading>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
              {hasLinux ? "For Windows and Linux." : "For Windows."} Small download, opens instantly, keeps itself up to date.
              See what changed in the{" "}
              <NextLink href="/changelog" className={LINK}>
                changelog
              </NextLink>
              .
            </p>
            {version ? (
              <div className="mt-8">
                <PrimaryDownload windows={files.windows} appimage={files.appimage} />
              </div>
            ) : null}
          </Reveal>
          <Reveal delay={0.15}>
            <HeroArt />
          </Reveal>
        </section>

        {downloads.status === "unconfigured" ? (
          <Notice>Downloads aren&apos;t connected to a release source yet. Check back once the first release is published.</Notice>
        ) : downloads.status === "error" ? (
          <Notice>Couldn&apos;t load the downloads just now. Refresh in a minute, and they&apos;ll be back.</Notice>
        ) : nothing ? (
          <Notice>Nothing to download yet. The first release hasn&apos;t shipped.</Notice>
        ) : (
          <Reveal y={24}>
            <section className="mt-20">
              <Heading level={2} className="mb-6 text-2xl font-extrabold tracking-tight text-white uppercase sm:text-3xl">
                All <span className="text-muted">downloads</span>
              </Heading>
              <PlatformTabs windows={<WindowsPanel files={files} />} linux={<LinuxPanel files={files} aur={aur} />} />
            </section>
          </Reveal>
        )}

        <Reveal y={24}>
          <section className="mt-20">
            <Heading level={2} className="mb-6 text-2xl font-extrabold tracking-tight text-white uppercase sm:text-3xl">
              After <span className="text-muted">you install</span>
            </Heading>
            <ol className="grid gap-4 sm:grid-cols-3">
              {STEPS.map((step, i) => (
                <li key={step.title} className={`${CARD} flex gap-4 p-5`}>
                  <BlockArt block={step.block} className="h-11 w-11" />
                  <div>
                    <p className="text-[11px] font-bold tracking-wider text-accent-strong uppercase">Step {i + 1}</p>
                    <p className="mt-0.5 font-bold text-white">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-xs text-muted">
              On a Mac? There&apos;s no macOS version yet. Follow the{" "}
              <NextLink href="/news" className={LINK}>
                news
              </NextLink>{" "}
              for what&apos;s next.
            </p>
          </section>
        </Reveal>
      </div>
    </PageShell>
  );
}
