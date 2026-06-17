import type { IconProps } from "@/shared/icons/types";

export function MenuBoardIcon({ className }: IconProps) {
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
      <path d="M7 4.5h10A2.5 2.5 0 0 1 19.5 7v10A2.5 2.5 0 0 1 17 19.5H7A2.5 2.5 0 0 1 4.5 17V7A2.5 2.5 0 0 1 7 4.5Z" />
      <path d="M8 9h8" />
      <path d="M8 12h8" />
      <path d="M8 15h4.5" />
      <path d="M15.5 15h.1" />
    </svg>
  );
}
