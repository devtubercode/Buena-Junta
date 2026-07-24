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
        "fixed right-4 z-40",
        "bottom-[calc(1.5rem+env(safe-area-inset-bottom))]",
        "sm:bottom-[calc(2rem+env(safe-area-inset-bottom))] sm:right-6",
        "lg:bottom-[calc(2.5rem+env(safe-area-inset-bottom))] lg:right-8",

        "inline-flex items-center rounded-full",
        "bg-primary text-primary-foreground",
        "shadow-elevated",
        "transition-all duration-300 ease-out",
        "hover:scale-105 hover:shadow-lg",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",

        hasItems
          ? "px-2 py-1.5 gap-1.5 sm:gap-2 sm:px-3 sm:py-2"
          : "size-11 p-0 sm:px-4 sm:py-2.5 sm:w-auto sm:h-auto",
      )}
    >
      <span className="relative inline-flex size-9 items-center justify-center rounded-full bg-white/20 shrink-0">
        <WhatsappIcon className="size-5" />
        {hasItems ? (
          <span
            key={itemCount}
            className="absolute -right-1 -top-1 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-primary bg-foreground px-1 text-[10px] font-black leading-none text-background animate-badge-pop"
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
          className="inline-flex items-center rounded-full bg-white/20 px-3 py-1.5 font-heading text-sm font-black leading-none backdrop-blur-[2px] sm:text-base animate-fade-slide-up"
        >
          {formatCOP(total)}
        </span>
      ) : null}
    </button>
  );
}
