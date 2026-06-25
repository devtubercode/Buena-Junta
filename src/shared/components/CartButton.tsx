import { Link } from "react-router";
import { ShoppingCart } from "lucide-react";
import { appRoutes } from "@/app/routes";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { cn } from "@/shared/utils/cn";

type CartButtonProps = {
  className?: string;
  iconClassName?: string;
};

export const CartButton = ({ className, iconClassName }: CartButtonProps) => {
  const totalQuantity = useCartStore((state) => state.getTotalQuantity());

  return (
    <Link
      to={appRoutes.cart}
      className={cn(
        "relative inline-flex size-10 items-center justify-center rounded-full text-primary transition hover:opacity-90 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary",
        className,
      )}
      aria-label={`Ver carrito con ${totalQuantity} ${totalQuantity === 1 ? "producto" : "productos"}`}
      title="Ver carrito"
    >
      <ShoppingCart className={cn("size-5", iconClassName)} />
      {totalQuantity > 0 && (
        <span
          className="absolute right-0 top-0 inline-flex min-h-4 min-w-4 -translate-y-1/3 translate-x-1/3 items-center justify-center rounded-full border border-background bg-primary px-1 text-[10px] font-black leading-none text-primary-foreground shadow-elevated"
        >
          {totalQuantity > 99 ? "99+" : totalQuantity}
        </span>
      )}
    </Link>
  );
};
