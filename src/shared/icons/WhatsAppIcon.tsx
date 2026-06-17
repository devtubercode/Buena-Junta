import type { IconProps } from "@/shared/icons/types";

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M5.6 18.4 4.4 21l2.9-1a8.1 8.1 0 1 0-1.7-1.6Z"
        fill="#25D366"
        stroke="#118C44"
        strokeWidth="1.15"
      />
      <path
        d="M9 8.8c.2-.4.4-.5.7-.5h.6c.2 0 .4.1.5.4l.7 1.5c.1.3 0 .5-.2.7l-.4.5c.7 1.2 1.6 2.1 2.9 2.7l.5-.5c.2-.2.5-.3.8-.1l1.5.7c.3.1.4.3.4.6v.6c0 .3-.2.6-.5.7-.6.3-1.3.4-2 .2-2.9-.8-5.1-2.9-5.9-5.8-.2-.7-.1-1.3.4-1.8Z"
        fill="#ffffff"
      />
    </svg>
  );
}
