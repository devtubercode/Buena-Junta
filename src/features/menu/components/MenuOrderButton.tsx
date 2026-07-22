import { WhatsappIcon } from "@/shared/icons";
import { cn } from "@/shared/utils/cn";

type MenuOrderButtonProps = {
  itemCount: number;
  onClick: () => void;
};

export function MenuOrderButton({
  itemCount,
  onClick,
}: MenuOrderButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Ver pedido con ${itemCount} ${itemCount === 1 ? "producto" : "productos"}`}
      title="Hacer pedido"
      className={cn(
        "fixed bottom-6 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 pr-5 text-primary-foreground shadow-elevated transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:bottom-8 sm:right-6 lg:bottom-10 lg:right-8",
        itemCount === 0 && "opacity-70 hover:opacity-100",
      )}
    >
      <span className="relative inline-flex size-8 items-center justify-center">
        <WhatsappIcon className="size-6" />
        {itemCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-background bg-primary px-1 text-[10px] font-black leading-none text-primary-foreground shadow-elevated">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </span>
      <span className="hidden text-sm font-black sm:inline">Hacer pedido</span>
    </button>
  );
}
