import type { IconProps } from "@/shared/icons/types";

export function HomeIcon({ className }: IconProps) {
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
      <path d="M4 11.2 12 4l8 7.2" />
      <path d="M6.5 10.5V20h11v-9.5" />
      <path d="M9.5 20v-5.8h5V20" />
    </svg>
  );
}
