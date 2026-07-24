import { Link } from "react-router";
import { ShoppingBag, ChefHat, ArrowRight, Heart } from "lucide-react";

export function CartEmpty() {
  return (
    <div className="rounded-2xl  border border-border bg-surface p-8 text-center shadow-elevated transition-all duration-300 sm:p-12">
      <div className="relative mx-auto inline-flex size-20 items-center justify-center sm:size-24">
        <div className="absolute inset-0 animate-[spin_8s_linear_infinite] rounded-full border-2 border-dashed border-primary/20" />

        <div className="relative z-10 inline-flex size-16 items-center justify-center rounded-full bg-primary-soft text-primary transition-transform duration-500 hover:scale-110 sm:size-20">
          <ShoppingBag className="size-8 sm:size-10" />
        </div>
      </div>

      <div className="flex justify-center flex-col items-center">
        <h2 className="mt-6 font-heading text-2xl font-black leading-tight text-foreground sm:text-3xl">
          Tu carrito está vacío
        </h2>

        <p className="mx-auto mt-2 max-w-xs text-center text-sm font-medium  text-muted-foreground">
          Agrega productos desde el inicio para armar tu pedido. Te los
          preparamos con mucho cariño.
        </p>
      </div>

      <div className="mt-8 space-y-3">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md active:scale-[0.97]"
        >
          Explorar el menú
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>

        <p className="flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground">
          <span>Hecho con</span>
          <Heart className="size-3.5 fill-primary/30 text-primary" />
          <span>en cada plato</span>
        </p>
      </div>

      <div className="mt-8 flex items-center justify-center gap-3 text-muted-foreground/30">
        <span className="h-px flex-1 bg-border" />
        <ChefHat className="size-4" />
        <span className="h-px flex-1 bg-border" />
      </div>
    </div>
  );
}
