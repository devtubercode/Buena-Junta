import { formatCOP } from "@/features/cart/utils/money";

type MenuOrderSummaryProps = {
  total: number;
  totalQuantity: number;
};

export function MenuOrderSummary({
  total,
  totalQuantity,
}: MenuOrderSummaryProps) {
  return (
    <section
      className="flex items-center justify-between gap-3 rounded-xl border border-primary-border bg-primary-soft px-3 py-2"
      aria-label="Resumen del pedido"
    >
      <p className="text-sm font-bold text-foreground">
        <span className="text-muted-foreground">Productos:</span>{" "}
        <span className="font-heading font-black">{totalQuantity}</span>
      </p>
      <p className="text-right">
        <span className="mr-1 text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">
          Total
        </span>
        <span className="font-heading text-xl font-black leading-none text-primary sm:text-2xl">
          {formatCOP(total)}
        </span>
      </p>
    </section>
  );
}
