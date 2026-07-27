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
};

const inputClass =
  "w-full rounded-lg border border-border bg-surface px-3 text-foreground outline-none transition placeholder:text-placeholder focus:border-primary focus:ring-2 focus:ring-primary/25";

const sectionLabelClass =
  "font-bold uppercase tracking-[0.14em] text-muted-foreground";

export function MenuOrderForm({
  orderDetails,
  onChangeField,
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
    <div className="grid gap-2">
      <label className="grid gap-1">
        <span className="text-xs font-bold text-foreground">
          Nombre de quien hace pedido
        </span>
        <input
          type="text"
          value={customerName}
          onChange={(event) =>
            onChangeField("customerName", event.target.value)
          }
          placeholder="Ej: Juan Pérez"
          className={cn(inputClass, "min-h-9 text-xs")}
        />
        <span className="text-[11px] text-muted-foreground">
          Usaremos este nombre para identificar quién hizo pedido y coordinar
          entrega o pago.
        </span>
      </label>

      <label className="grid gap-1">
        <span className={cn(sectionLabelClass, "text-[11px]")}>
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
          className={cn(inputClass, "min-h-9 text-xs")}
        >
          <option value="pickup">Recoger</option>
          <option value="table">En mesa</option>
          <option value="delivery">Domicilio</option>
        </select>
      </label>

      {fulfillmentType === "table" ? (
        <label className="grid gap-1">
          <span className={cn(sectionLabelClass, "text-[11px]")}>
            Mesa o punto de entrega
          </span>
          <input
            type="text"
            value={table}
            onChange={(event) => onChangeField("table", event.target.value)}
            placeholder="Ej: mesa 4"
            className={cn(inputClass, "min-h-9 text-xs")}
          />
        </label>
      ) : null}

      {fulfillmentType === "delivery" ? (
        <>
          <label className="grid gap-1">
            <span className={cn(sectionLabelClass, "text-[11px]")}>
              Dirección de entrega
            </span>
            <input
              type="text"
              value={deliveryAddress}
              onChange={(event) =>
                onChangeField("deliveryAddress", event.target.value)
              }
              placeholder="Ej: Calle 10 # 12-34"
              className={cn(inputClass, "min-h-9 text-xs")}
            />
          </label>

          <label className="grid gap-1">
            <span className={cn(sectionLabelClass, "text-[11px]")}>
              Referencia para entrega
            </span>
            <input
              type="text"
              value={deliveryReference}
              onChange={(event) =>
                onChangeField("deliveryReference", event.target.value)
              }
              placeholder="Ej: portón negro, apto 201"
              className={cn(inputClass, "min-h-9 text-xs")}
            />
          </label>
        </>
      ) : null}

      <label className="grid gap-1">
        <span className={cn(sectionLabelClass, "text-[11px]")}>
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
          className={cn(inputClass, "min-h-9 text-xs")}
        >
          <option value="cash">Pago físico</option>
          <option value="nequi">QR Nequi</option>
        </select>
      </label>

      <label className="grid gap-1">
        <span className="text-xs font-bold text-foreground">
          Observaciones generales
        </span>
        <TextArea
          value={generalObservation}
          onChange={(event) =>
            onChangeField("generalObservation", event.target.value)
          }
          placeholder="Ej: sin cebolla, salsa aparte..."
          rows={2}
          maxLength={200}
          className="min-h-0"
        />
      </label>
    </div>
  );
}
