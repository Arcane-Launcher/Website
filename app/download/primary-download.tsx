"use client";

import { Link, buttonVariants } from "@heroui/react";
import { useVisitorOs } from "../components/download-button";
import type { DownloadFile } from "../lib/updates";
import { formatSize } from "./format";
import { DownloadIcon, LinuxIcon, WindowsIcon } from "./os-icons";

const BIG = " h-14 gap-3 rounded-2xl px-7 text-base font-bold no-underline";

/// The one button most visitors need: the right file for the OS they're on.
/// macOS and phones get both, with a note that there's no build for them.
export function PrimaryDownload({ windows, appimage }: { windows?: DownloadFile; appimage?: DownloadFile }) {
  const os = useVisitorOs();

  if (os === "linux" && appimage) {
    return (
      <Choice
        href={appimage.url}
        icon={<LinuxIcon className="h-5 w-5" />}
        label="Download for Linux"
        meta={["AppImage", formatSize(appimage.size), "any distribution"]}
        other={{ href: "#linux", label: "Other Linux packages" }}
      />
    );
  }
  if (os === "windows" && windows) {
    return (
      <Choice
        href={windows.url}
        icon={<WindowsIcon className="h-5 w-5" />}
        label="Download for Windows"
        meta={["Installer", formatSize(windows.size), "Windows 10 & 11"]}
        other={{ href: "#linux", label: "Looking for Linux?" }}
      />
    );
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex flex-wrap gap-3">
        {windows ? (
          <Link href={windows.url} className={buttonVariants({ variant: "primary" }) + BIG}>
            <WindowsIcon className="h-5 w-5" /> Windows
          </Link>
        ) : null}
        {appimage ? (
          <Link href={appimage.url} className={buttonVariants({ variant: "outline" }) + BIG}>
            <LinuxIcon className="h-5 w-5" /> Linux
          </Link>
        ) : null}
      </div>
      {os === "other" ? <p className="text-xs text-muted">No macOS or mobile version yet.</p> : null}
    </div>
  );
}

function Choice({
  href,
  icon,
  label,
  meta,
  other,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  meta: (string | null)[];
  other: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col items-start gap-3">
      <Link
        href={href}
        className={
          buttonVariants({ variant: "primary" }) +
          BIG +
          " shadow-[0_18px_50px_-14px_rgba(var(--accent-rgb),0.75)] transition-transform hover:-translate-y-0.5"
        }
      >
        {icon}
        {label}
        <DownloadIcon className="h-4 w-4 opacity-80" />
      </Link>
      <p className="text-xs text-muted">
        {meta.filter(Boolean).join(" · ")} ·{" "}
        <a href={other.href} className="text-accent-strong underline underline-offset-2 hover:text-white">
          {other.label}
        </a>
      </p>
    </div>
  );
}
