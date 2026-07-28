import type { ComponentType, ReactNode } from "react";
import type { IconProps } from "@/shared/icons/types";

export type CategoryChipProps = {
  active: boolean;
  onClick: () => void;
  icon: ComponentType<IconProps>;
  children: ReactNode;
};

export function CategoryChip({
  active,
  onClick,
  icon: Icon,
  children,
}: CategoryChipProps) {
  return (
    <button
      type="button"
      data-active={active}
      aria-pressed={active}
      onClick={onClick}
      className="group cursor-pointer inline-flex snap-start shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border font-black leading-none transition focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-95 min-h-10 px-3 text-xs sm:min-h-11 sm:px-4 sm:text-sm data-[active=true]:border-primary data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-sm data-[active=true]:shadow-primary/25 data-[active=false]:border-border data-[active=false]:bg-surface data-[active=false]:text-muted-foreground data-[active=false]:hover:border-primary/60 data-[active=false]:hover:bg-surface-muted data-[active=false]:hover:text-foreground"
    >
      <Icon className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-110 group-data-[active=true]:scale-110 sm:size-4.5" />
      {children}
    </button>
  );
}
