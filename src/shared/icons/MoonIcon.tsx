type IconProps = {
  className?: string;
};

export function MoonIcon({ className }: IconProps) {
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
      <path d="M20 14.2A7.2 7.2 0 0 1 9.8 4a8 8 0 1 0 10.2 10.2Z" />
    </svg>
  );
}
