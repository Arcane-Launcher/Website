"use client";

import { useSyncExternalStore } from "react";
import { Button, Link, buttonVariants } from "@heroui/react";
import { LinuxIcon, WindowsIcon } from "../download/os-icons";

export type VisitorOs = "windows" | "linux" | "other";

function detectOs(): VisitorOs {
  // The reduced user-agent string browsers send still names the OS family,
  // which is all this needs.
  const platform = navigator.userAgent;
  if (/android/i.test(platform)) return "other";
  if (/windows/i.test(platform)) return "windows";
  if (/linux|x11|cros/i.test(platform)) return "linux";
  return "other";
}

const noSubscribe = () => () => {};

/// The visitor's OS. The server render (and the first client render, so
/// hydration matches) assumes Windows, the most common case.
export function useVisitorOs(): VisitorOs {
  return useSyncExternalStore(noSubscribe, detectOs, () => "windows");
}

const BUTTON = " gap-2 text-sm no-underline";

/// "Windows" and "Linux" side by side, the visitor's own OS filled in.
/// Windows gets the installer directly; Linux has several formats, so it goes
/// to the Linux section of /download. A platform with nothing published yet
/// shows a disabled "soon" button instead of a dead link.
export function DownloadButtons({ windowsUrl, hasLinux }: { windowsUrl?: string; hasLinux: boolean }) {
  const os = useVisitorOs();
  const linuxFirst = os === "linux";
  const variant = (platform: VisitorOs) => (platform === (linuxFirst ? "linux" : "windows") ? "primary" : "outline");

  const windows = windowsUrl ? (
    <Link key="windows" href={windowsUrl} className={buttonVariants({ variant: variant("windows") }) + BUTTON}>
      <WindowsIcon /> Windows
    </Link>
  ) : (
    <Button key="windows" variant="outline" isDisabled className={BUTTON}>
      <WindowsIcon /> Windows · soon
    </Button>
  );
  const linux = hasLinux ? (
    <Link key="linux" href="/download#linux" className={buttonVariants({ variant: variant("linux") }) + BUTTON}>
      <LinuxIcon /> Linux
    </Link>
  ) : (
    <Button key="linux" variant="outline" isDisabled className={BUTTON}>
      <LinuxIcon /> Linux · soon
    </Button>
  );

  return <div className="flex gap-2.5">{linuxFirst ? [linux, windows] : [windows, linux]}</div>;
}
