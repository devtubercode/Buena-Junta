import { Link } from "react-router";
import { appRoutes } from "@/app/routes";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { CartBadge } from "@/shared/components/CartBadge";
import { BuenaCartIcon } from "@/shared/icons";

type CartButtonProps = {
  compact?: boolean;
};

export function CartButton({ compact = false }: CartButtonProps) {
  const totalQuantity = useCartStore((state) => state.getTotalQuantity());

  return (
    <Link
      to={appRoutes.cart}
      className="relative inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-primary-border bg-primary-soft px-4 text-sm font-black text-primary transition hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      aria-label={`Ver carrito con ${totalQuantity} ${totalQuantity === 1 ? "producto" : "productos"}`}
      title="Ver carrito"
    >
      <span className="relative inline-flex">
        <BuenaCartIcon className="size-5" />
        <CartBadge count={totalQuantity} />
      </span>
      {!compact ? (
        <span className="hidden sm:inline">Carrito</span>
      ) : null}
    </Link>
  );
}
