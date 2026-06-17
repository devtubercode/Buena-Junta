import type { IconProps } from "@/shared/icons/types";

export function SnackIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="M6 8h12l-1.4 12H7.4Z" />
      <path d="M8 8 9 4h6l1 4" />
      <path d="M9 12h6M10 16h4" />
    </svg>
  );
}
