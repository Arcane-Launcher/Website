"use client";

import { useState } from "react";

/// A shell command in a small terminal window, with a copy button. Long
/// commands wrap instead of scrolling so they stay readable on phones.
export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked (insecure context, permissions) — the text is still selectable.
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/8 bg-[#0b0b0e] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex items-center gap-1.5 border-b border-white/6 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-white/12" />
        <span className="h-2 w-2 rounded-full bg-white/12" />
        <span className="h-2 w-2 rounded-full bg-white/12" />
        <span className="ml-2 text-[10px] font-semibold tracking-wider text-muted/70 uppercase">Terminal</span>
        <button
          type="button"
          onClick={copy}
          aria-label={`Copy command: ${command}`}
          className={`ml-auto rounded-md px-2 py-0.5 text-[11px] font-semibold transition-colors ${
            copied ? "bg-emerald-500/15 text-emerald-300" : "text-muted hover:bg-white/8 hover:text-white"
          }`}
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <code className="block px-4 py-3 font-mono text-[12.5px] leading-relaxed break-all whitespace-pre-wrap text-foreground/90">
        <span aria-hidden className="mr-2 text-accent-strong select-none">
          $
        </span>
        {command}
      </code>
    </div>
  );
}
