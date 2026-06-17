import type { IconProps } from "@/shared/icons/types";

export function CoffeeIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="M6 9h10v5a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4Z" />
      <path d="M16 10h1.5a2 2 0 0 1 0 4H16" />
      <path d="M8 5v1M12 4v2M16 5v1" />
    </svg>
  );
}
