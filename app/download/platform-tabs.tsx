"use client";

import { useEffect, useState } from "react";
import { useVisitorOs } from "../components/download-button";
import { LinuxIcon, WindowsIcon } from "./os-icons";

type Tab = "windows" | "linux";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "windows", label: "Windows", icon: <WindowsIcon /> },
  { id: "linux", label: "Linux", icon: <LinuxIcon /> },
];

/// Windows / Linux switcher. Opens on the visitor's OS, and on #windows /
/// #linux links (the hero's "Download for Linux" points at #linux).
export function PlatformTabs({ windows, linux }: { windows: React.ReactNode; linux: React.ReactNode }) {
  const os = useVisitorOs();
  const [picked, setPicked] = useState<Tab | null>(null);
  const active: Tab = picked ?? (os === "linux" ? "linux" : "windows");

  useEffect(() => {
    const fromHash = () => {
      const hash = window.location.hash.slice(1);
      if (hash === "windows" || hash === "linux") {
        setPicked(hash);
        document.getElementById("platforms")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  return (
    <div id="platforms" className="scroll-mt-28">
      <div role="tablist" aria-label="Platform" className="inline-flex rounded-2xl border border-border bg-white/3 p-1.5">
        {TABS.map((tab) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`panel-${tab.id}`}
              onClick={() => {
                setPicked(tab.id);
                history.replaceState(null, "", `#${tab.id}`);
              }}
              className={`relative flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
                selected
                  ? "bg-accent text-white shadow-[0_8px_24px_-8px_rgba(var(--accent-rgb),0.8)]"
                  : "text-muted hover:bg-white/5 hover:text-white"
              }`}
            >
              {tab.icon}
              {tab.label}
              {os === tab.id ? (
                <span
                  title="Your system"
                  className={`h-1.5 w-1.5 rounded-full ${selected ? "bg-white" : "bg-accent-strong"}`}
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <div id="panel-windows" role="tabpanel" aria-labelledby="tab-windows" hidden={active !== "windows"} className="mt-6">
        {windows}
      </div>
      <div id="panel-linux" role="tabpanel" aria-labelledby="tab-linux" hidden={active !== "linux"} className="mt-6">
        {linux}
      </div>
    </div>
  );
}
