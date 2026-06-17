import type { IconProps } from "@/shared/icons/types";

export function DrinkIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="M7 5h10l-1.2 15H8.2Z" />
      <path d="M8 9h8" />
      <path d="M15 5 17.5 2" />
      <path d="M10 13h4" />
    </svg>
  );
}
