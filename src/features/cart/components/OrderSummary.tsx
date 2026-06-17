import { formatCOP } from "@/features/cart/utils/money";

type OrderSummaryProps = {
  totalCents: number;
  totalQuantity: number;
};

export function OrderSummary({ totalCents, totalQuantity }: OrderSummaryProps) {
  return (
    <section className="rounded-lg border border-primary-border bg-primary-soft p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-muted-foreground">Productos</p>
          <p className="font-heading text-2xl font-black text-foreground">{totalQuantity}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-muted-foreground">Total</p>
          <p className="font-heading text-3xl font-black text-primary">{formatCOP(totalCents)}</p>
        </div>
      </div>
    </section>
  );
}
