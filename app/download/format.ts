import type { DownloadFile } from "../lib/updates";

export function formatSize(bytes?: number): string | null {
  if (!bytes) return null;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/// The file name as it lands in the visitor's Downloads folder.
export function fileName(file: DownloadFile): string {
  return decodeURIComponent(file.url.split("/").pop() ?? "");
}

/// Quotes a file name for a shell command only when it needs it.
export function shellArg(name: string): string {
  return /^[\w.+-]+$/.test(name) ? name : `"${name}"`;
}
