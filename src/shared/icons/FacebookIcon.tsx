import type { IconProps } from "@/shared/icons/types";

export function FacebookIcon({
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
      <path
        d="M13.1 20.5v-7.1h2.4l.36-2.8H13.1V8.83c0-.81.23-1.36 1.39-1.36H16V4.96c-.28-.04-1.24-.12-2.35-.12-2.32 0-3.91 1.42-3.91 4.02v1.74H7.5v2.8h2.24v7.1h3.36Z"
        fill={color}
      />
      <rect
        x="3.25"
        y="3.25"
        width="17.5"
        height="17.5"
        rx="5.25"
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  );
}
