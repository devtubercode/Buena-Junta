import type { IconProps } from "@/shared/icons/types";

export function BuenaCartIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="M3 5h2.2l1.6 10.2a2 2 0 0 0 2 1.7h8.4a2 2 0 0 0 1.9-1.5l1.2-5.4H7" />
      <path d="M8.4 9.2h9.9" />
      <path d="M9.2 13.4h7.7" />
      <path d="M10 9.2c.2-1.7 1.5-3 3.2-3s3 1.3 3.2 3" />
      <path d="M11 12.2c.7.6 1.4.9 2.2.9s1.5-.3 2.2-.9" />
      <path d="M17.3 8.9l1.3-1.1" />
      <path d="M8.3 8.9 7 7.8" />
      <circle cx="9.5" cy="20" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="17.2" cy="20" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
