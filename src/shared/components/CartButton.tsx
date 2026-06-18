import { Link } from "react-router";
import { appRoutes } from "@/app/routes";
import { useCartStore } from "@/features/cart/store/useCartStore";

import { ShoppingCart } from "lucide-react";

export const CartButton = () => {
  const totalQuantity = useCartStore((state) => state.getTotalQuantity());

  return (
    <Link
      to={appRoutes.cart}
      className="relative inline-flex items-center justify-center rounded-full p-1.5 text-primary transition hover:opacity-90 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary"
      aria-label={`Ver carrito con ${totalQuantity} ${totalQuantity === 1 ? "producto" : "productos"}`}
      title="Ver carrito"
    >
      <ShoppingCart className="size-7" />
      {totalQuantity > 0 && (
        <span
          className={`absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full border border-background bg-primary px-1.5 text-[11px] font-black leading-none text-primary-foreground shadow-elevated`}
        >
          {totalQuantity > 99 ? "99+" : totalQuantity}
        </span>
      )}
    </Link>
  );
};
