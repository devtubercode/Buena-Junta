import type { IconProps } from "@/shared/icons/types";

export function SandwichIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="M4 10 12 5l8 5Z" />
      <path d="M5 13h14" />
      <path d="M6 16h12" />
      <path d="M7 19h10" />
    </svg>
  );
}
