import type { IconProps } from "@/shared/icons/types";

export function PizzaIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="M4 4c5.7.4 10.9 2.5 16 6L9.5 21Z" />
      <path d="M8 5.2 18.8 10" />
      <circle cx="10" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="13.8" cy="13.2" r="1" fill="currentColor" stroke="none" />
      <circle cx="9.6" cy="16" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
