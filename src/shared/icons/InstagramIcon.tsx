import type { IconProps } from "@/shared/icons/types";

export function InstagramIcon({
  color = "currentColor",
  size = 24,
  className,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      fill="none"
    >
      <rect
        x="3.25"
        y="3.25"
        width="17.5"
        height="17.5"
        rx="5.25"
        stroke={color}
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="4.25" stroke={color} strokeWidth="1.5" />
      <circle cx="17.2" cy="6.8" r="1.1" fill={color} />
    </svg>
  );
}
