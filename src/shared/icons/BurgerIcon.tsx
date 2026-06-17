import type { IconProps } from "@/shared/icons/types";

export function BurgerIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="M5 11a7 7 0 0 1 14 0Z" />
      <path d="M4 14h16" />
      <path d="M5.5 17h13" />
      <path d="M7 20h10" />
      <path d="M9 8h.1M12 7h.1M15 8h.1" />
    </svg>
  );
}
