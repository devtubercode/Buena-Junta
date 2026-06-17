import type { IconProps } from "@/shared/icons/types";

export function TrashIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6.5 7 7.4 20h9.2l.9-13" />
      <path d="M9 7V4.8h6V7" />
    </svg>
  );
}
