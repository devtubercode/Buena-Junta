import type { IconProps } from "@/shared/icons/types";

export function ArepaIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="M4 13a8 6 0 0 1 16 0v1a8 5 0 0 1-16 0Z" />
      <path d="M7 13c3 1.4 7 1.4 10 0" />
      <path d="M9 10h.1M13 9.5h.1M16 11h.1" />
    </svg>
  );
}
