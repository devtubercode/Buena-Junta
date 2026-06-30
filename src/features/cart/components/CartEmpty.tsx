import { Link } from "react-router";
import { appRoutes } from "@/app/routes";
import { ShoppingBag, ClipboardList } from "lucide-react";

export function CartEmpty() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-8 text-center shadow-elevated sm:p-12">
      <div className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-primary-soft text-primary sm:size-20">
        <ShoppingBag className="size-8 sm:size-10" />
      </div>
      <h2 className="mt-5 font-heading text-2xl font-black leading-tight text-foreground sm:text-3xl">
        Tu carrito está vacío
      </h2>
      <p className="mx-auto mt-2 max-w-xs text-sm font-medium leading-6 text-muted-foreground">
        Agrega productos desde el menú para armar tu pedido. Te los preparamos
        con mucho cariño.
      </p>
      <div className="mt-6">
        <Link
          to={appRoutes.menu}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <ClipboardList className="size-5" />
          Ver menú
        </Link>
      </div>
    </div>
  );
}
