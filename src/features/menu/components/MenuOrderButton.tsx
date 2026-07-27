import { WhatsappIcon } from "@/shared/icons";
import { cn } from "@/shared/utils/cn";
import { formatCOP } from "@/features/cart/utils/money";

type MenuOrderButtonProps = {
  itemCount: number;
  total: number;
  onClick: () => void;
};

export function MenuOrderButton({
  itemCount,
  total,
  onClick,
}: MenuOrderButtonProps) {
  const hasItems = itemCount > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        hasItems
          ? `Ver pedido: ${itemCount} ${itemCount === 1 ? "producto" : "productos"}, total ${formatCOP(total)}`
          : "Hacer pedido"
      }
      className={cn(
        "fixed z-40",
        "bottom-[calc(1rem+env(safe-area-inset-bottom))]",
        "sm:bottom-[calc(2rem+env(safe-area-inset-bottom))]",
        "lg:bottom-[calc(2.5rem+env(safe-area-inset-bottom))]",

        "right-4",
        "sm:right-6",
        "lg:right-8",

        "inline-flex items-center rounded-full",
        "border border-primary/30 bg-primary text-primary-foreground",
        "shadow-elevated",
        "transition-all duration-300 ease-out",
        "hover:scale-105 hover:shadow-lg",
        "focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary",

        hasItems
          ? "gap-1.5 p-2 sm:gap-2 sm:px-3 sm:py-2"
          : "p-2 sm:px-4 sm:py-2.5",
      )}
    >
      <span className="relative inline-flex size-9 items-center justify-center rounded-full shrink-0">
        <WhatsappIcon className="size-10" />
        {hasItems ? (
          <span
            key={itemCount}
            className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-primary bg-foreground px-1 text-xs font-black leading-none text-background animate-badge-pop"
          >
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        ) : null}
      </span>

      <span
        className={cn(
          "hidden text-sm font-black whitespace-nowrap sm:inline",
          !hasItems && "sm:inline",
        )}
      >
        {hasItems ? "Ver pedido" : "Hacer pedido"}
      </span>

      {hasItems ? (
        <span
          key={total}
          className="hidden items-center rounded-full bg-white/20 px-3 py-1.5 font-heading text-sm font-black leading-none backdrop-blur-[2px] sm:inline-flex sm:text-base animate-fade-slide-up"
        >
          {formatCOP(total)}
        </span>
      ) : null}
    </button>
  );
}
