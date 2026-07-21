import { User, FileText } from "lucide-react";

type WhatsAppOrderFormProps = {
  customerName: string;
  generalNotes: string;
  onChangeName: (customerName: string) => void;
  onChangeNotes: (generalNotes: string) => void;
};

const inputClass =
  "min-h-10 w-full rounded-lg border border-border bg-surface-muted px-3 text-sm font-semibold text-foreground outline-none transition placeholder:text-placeholder focus:border-primary focus:ring-2 focus:ring-primary/20";

export function WhatsAppOrderForm({
  customerName,
  generalNotes,
  onChangeName,
  onChangeNotes,
}: WhatsAppOrderFormProps) {
  return (
    <section className="grid gap-2.5" aria-label="Datos del pedido">
      <label className="block">
        <span className="mb-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-primary">
          <User className="size-3" />
          Responsable *
        </span>
        <input
          type="text"
          value={customerName}
          maxLength={80}
          className={inputClass}
          placeholder="Ej: Juan Pérez"
          onChange={(event) => onChangeName(event.target.value)}
          aria-required="true"
        />
      </label>

      <label className="block">
        <span className="mb-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">
          <FileText className="size-3" />
          Observaciones del pedido
        </span>
        <textarea
          value={generalNotes}
          maxLength={240}
          rows={2}
          className="w-full resize-none rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm font-medium text-foreground outline-none transition placeholder:text-placeholder focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="Ej: entregar todo junto, sin picante..."
          onChange={(event) => onChangeNotes(event.target.value)}
        />
      </label>
    </section>
  );
}
