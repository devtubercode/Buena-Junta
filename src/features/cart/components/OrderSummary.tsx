import { formatCOP } from "@/features/cart/utils/money";
import { ShoppingBag } from "lucide-react";

type OrderSummaryProps = {
  total: number;
  totalQuantity: number;
};

export function OrderSummary({ total, totalQuantity }: OrderSummaryProps) {
  return (
    <section className="rounded-2xl border border-primary-border bg-primary-soft p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <ShoppingBag className="size-5 text-primary" />
        <h2 className="font-heading text-xl font-black text-foreground">
          Resumen
        </h2>
      </div>
      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">
            Productos
          </p>
          <p className="font-heading text-2xl font-black text-foreground">
            {totalQuantity}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">
            Total a pagar
          </p>
          <p className="font-heading text-3xl font-black leading-none text-primary sm:text-4xl">
            {formatCOP(total)}
          </p>
        </div>
      </div>
    </section>
  );
}
