import { cn } from "@/shared/utils/cn";
import { TextArea } from "@/shared/components/TextArea";
import type {
  MenuOrderDetails,
  MenuOrderFulfillmentType,
  MenuOrderPaymentMethod,
} from "@/store/menu-order/types/menu-order.types";

type MenuOrderFormProps = {
  orderDetails: MenuOrderDetails;
  onChangeField: <K extends keyof MenuOrderDetails>(
    key: K,
    value: MenuOrderDetails[K],
  ) => void;
  compact?: boolean;
};

const inputClass =
  "w-full rounded-lg border border-border bg-surface px-3 text-foreground outline-none transition placeholder:text-placeholder focus:border-primary focus:ring-2 focus:ring-primary/25";

const sectionLabelClass =
  "font-bold uppercase tracking-[0.14em] text-muted-foreground";

export function MenuOrderForm({
  orderDetails,
  onChangeField,
  compact = false,
}: MenuOrderFormProps) {
  const {
    customerName,
    fulfillmentType,
    table,
    deliveryAddress,
    deliveryReference,
    paymentMethod,
    generalObservation,
  } = orderDetails;

  return (
    <div className={cn("grid", compact ? "gap-2" : "gap-3")}>
      <label className="grid gap-1">
        <span
          className={cn(
            "font-bold text-foreground",
            compact ? "text-xs" : "text-sm",
          )}
        >
          Nombre de quien hace pedido
        </span>
        <input
          type="text"
          value={customerName}
          onChange={(event) => onChangeField("customerName", event.target.value)}
          placeholder="Ej: Juan Pérez"
          className={cn(
            inputClass,
            compact ? "min-h-9 text-xs" : "min-h-11 text-sm",
          )}
        />
        <span className={cn("text-muted-foreground", compact ? "text-[11px]" : "text-xs")}>
          Usaremos este nombre para identificar quién hizo pedido y coordinar
          entrega o pago.
        </span>
      </label>

      <label className="grid gap-1">
        <span
          className={cn(
            sectionLabelClass,
            compact ? "text-[11px]" : "text-xs",
          )}
        >
          Tipo de entrega
        </span>
        <select
          value={fulfillmentType}
          onChange={(event) =>
            onChangeField(
              "fulfillmentType",
              event.target.value as MenuOrderFulfillmentType,
            )
          }
          className={cn(inputClass, compact ? "min-h-9 text-xs" : "min-h-11 text-sm")}
        >
          <option value="pickup">Recoger</option>
          <option value="table">En mesa</option>
          <option value="delivery">Domicilio</option>
        </select>
      </label>

      {fulfillmentType === "table" ? (
        <label className="grid gap-1">
          <span
            className={cn(
              sectionLabelClass,
              compact ? "text-[11px]" : "text-xs",
            )}
          >
            Mesa o punto de entrega
          </span>
          <input
            type="text"
            value={table}
            onChange={(event) => onChangeField("table", event.target.value)}
            placeholder="Ej: mesa 4"
            className={cn(inputClass, compact ? "min-h-9 text-xs" : "min-h-11 text-sm")}
          />
        </label>
      ) : null}

      {fulfillmentType === "delivery" ? (
        <>
          <label className="grid gap-1">
            <span
              className={cn(
                sectionLabelClass,
                compact ? "text-[11px]" : "text-xs",
              )}
            >
              Dirección de entrega
            </span>
            <input
              type="text"
              value={deliveryAddress}
              onChange={(event) =>
                onChangeField("deliveryAddress", event.target.value)
              }
              placeholder="Ej: Calle 10 # 12-34"
              className={cn(inputClass, compact ? "min-h-9 text-xs" : "min-h-11 text-sm")}
            />
          </label>

          <label className="grid gap-1">
            <span
              className={cn(
                sectionLabelClass,
                compact ? "text-[11px]" : "text-xs",
              )}
            >
              Referencia para entrega
            </span>
            <input
              type="text"
              value={deliveryReference}
              onChange={(event) =>
                onChangeField("deliveryReference", event.target.value)
              }
              placeholder="Ej: portón negro, apto 201"
              className={cn(inputClass, compact ? "min-h-9 text-xs" : "min-h-11 text-sm")}
            />
          </label>
        </>
      ) : null}

      <label className="grid gap-1">
        <span
          className={cn(
            sectionLabelClass,
            compact ? "text-[11px]" : "text-xs",
          )}
        >
          Método de pago
        </span>
        <select
          value={paymentMethod}
          onChange={(event) =>
            onChangeField(
              "paymentMethod",
              event.target.value as MenuOrderPaymentMethod,
            )
          }
          className={cn(inputClass, compact ? "min-h-9 text-xs" : "min-h-11 text-sm")}
        >
          <option value="cash">Pago físico</option>
          <option value="nequi">QR Nequi</option>
        </select>
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
          onChange={(event) =>
            onChangeField("generalObservation", event.target.value)
          }
          placeholder="Ej: sin cebolla, salsa aparte..."
          rows={compact ? 1 : 2}
          maxLength={200}
          className={cn(compact && "min-h-0")}
        />
      </label>
    </div>
  );
}
