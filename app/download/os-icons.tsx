/// Plain glyphs for the platform tabs and buttons.

export function WindowsIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className={className} fill="currentColor">
      <path d="M0 2.2 6.5 1.3v6.2H0zM7.3 1.2 16 0v7.5H7.3zM0 8.5h6.5v6.2L0 13.8zM7.3 8.5H16V16l-8.7-1.2z" />
    </svg>
  );
}

export function LinuxIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="1" y="2" width="14" height="12" rx="2" />
      <path d="m4 6 2.5 2L4 10M8 10.5h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DownloadIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 1.5v9M4.5 7 8 10.5 11.5 7M2 14h12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
