type CartBadgeProps = {
  count: number;
};

export function CartBadge({ count }: CartBadgeProps) {
  if (count <= 0) {
    return null;
  }

  return (
    <span className="absolute left-1/2 top-0 inline-flex min-h-5 min-w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-background bg-primary px-1.5 text-[11px] font-black leading-none text-primary-foreground shadow-elevated">
      {count > 99 ? "99+" : count}
    </span>
  );
}
