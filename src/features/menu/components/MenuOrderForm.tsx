import { cn } from "@/shared/utils/cn";
import { TextArea } from "@/shared/components/TextArea";

type MenuOrderFormProps = {
  customerName: string;
  generalObservation: string;
  onChangeName: (customerName: string) => void;
  onChangeObservation: (generalObservation: string) => void;
  compact?: boolean;
};

export function MenuOrderForm({
  customerName,
  generalObservation,
  onChangeName,
  onChangeObservation,
  compact = false,
}: MenuOrderFormProps) {
  return (
    <div className={cn("grid", compact ? "gap-2" : "gap-3")}>
      <label className="grid gap-1">
        <span
          className={cn(
            "font-bold text-foreground",
            compact ? "text-xs" : "text-sm",
          )}
        >
          Nombre del responsable
        </span>
        <input
          type="text"
          value={customerName}
          onChange={(event) => onChangeName(event.target.value)}
          placeholder="Ej: Juan Pérez"
          className={cn(
            "w-full rounded-lg border border-border bg-surface px-3 text-foreground outline-none transition placeholder:text-placeholder focus:border-primary focus:ring-2 focus:ring-primary/25",
            compact ? "min-h-9 text-xs" : "min-h-11 text-sm",
          )}
        />
      </label>

      <label className="grid gap-1">
        <span
          className={cn(
            "font-bold text-foreground",
            compact ? "text-xs" : "text-sm",
          )}
        >
          Observaciones generales
        </span>
        <TextArea
          value={generalObservation}
          onChange={(event) => onChangeObservation(event.target.value)}
          placeholder="Ej: sin cebolla, salsa aparte..."
          rows={compact ? 1 : 2}
          maxLength={200}
          className={cn(compact && "min-h-0")}
        />
      </label>
    </div>
  );
}
