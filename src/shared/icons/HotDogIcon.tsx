import type { IconProps } from "@/shared/icons/types";

export function HotDogIcon({
  color = "currentColor",
  size = 24,
  className,
}: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M5.5 15.5c-2-2-2-5.1 0-7.1l1.8-1.8 10.1 10.1-1.8 1.8c-2 2-5.1 2-7.1 0Z" />
      <path d="M8.3 8.3 15.7 15.7" />
      <path d="M10 10c.7-.7 1.3-.7 2 0s1.3.7 2 0" />
    </svg>
  );
}
