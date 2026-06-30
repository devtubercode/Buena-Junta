import type { OrderDraft } from "@/features/cart/types/cart.types";
import { User, MapPin, FileText } from "lucide-react";

type CustomerOrderFormProps = {
  draft: OrderDraft;
  onChange: (draft: Partial<OrderDraft>) => void;
};

const inputClass =
  "min-h-12 w-full rounded-lg border border-border bg-surface-muted px-4 text-base font-semibold text-foreground outline-none transition placeholder:text-placeholder focus:border-primary focus:ring-2 focus:ring-primary/20";

export function CustomerOrderForm({ draft, onChange }: CustomerOrderFormProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-4 shadow-elevated sm:p-5">
      <h2 className="font-heading text-2xl font-black leading-tight text-foreground sm:text-3xl">
        Datos del pedido
      </h2>
      <p className="mt-1 text-sm font-medium text-muted-foreground">
        Necesitamos estos datos para preparar tu pedido.
      </p>

      <div className="mt-5 grid gap-4">
        <label className="block">
          <span className="mb-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.14em] text-primary">
            <User className="size-3.5" />
            Responsable *
          </span>
          <input
            type="text"
            value={draft.customerName}
            maxLength={80}
            className={inputClass}
            placeholder="Ej: Juan Pérez"
            onChange={(event) =>
              onChange({ customerName: event.target.value })
            }
          />
          <span className="mt-1.5 block text-xs font-bold text-muted-foreground">
            * Campo obligatorio para enviar el pedido
          </span>
        </label>

        <label className="block">
          <span className="mb-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
            <MapPin className="size-3.5" />
            Mesa o punto de entrega
          </span>
          <input
            type="text"
            value={draft.table}
            maxLength={40}
            className={inputClass}
            placeholder="Ej: mesa 4"
            onChange={(event) => onChange({ table: event.target.value })}
          />
        </label>

        <label className="block">
          <span className="mb-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
            <FileText className="size-3.5" />
            Observaciones del pedido
          </span>
          <textarea
            value={draft.generalNotes}
            maxLength={240}
            rows={3}
            className="w-full resize-none rounded-lg border border-border bg-surface-muted px-4 py-3 text-base font-medium text-foreground outline-none transition placeholder:text-placeholder focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Ej: entregar todo junto, sin picante..."
            onChange={(event) =>
              onChange({ generalNotes: event.target.value })
            }
          />
        </label>
      </div>
    </section>
  );
}
