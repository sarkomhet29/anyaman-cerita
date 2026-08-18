// Logo mark: a simple, minimal knot — kept small and quiet.
export function WovenMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="14.5" stroke="var(--accent)" strokeWidth="1.6" />
      <path d="M10 16c2-4 4-4 6 0s4 4 6 0" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function ThreadMark() {
  return <div className="thread-mark" aria-hidden="true" />;
}
