import { useState, useCallback } from "react";
import { Trash2, AlertTriangle, Settings2, PlusCircle } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { QuantityStepper } from "@/shared/components/QuantityStepper";
import { formatCOP } from "@/features/cart/utils/money";
import { ProductCustomizationForm } from "@/shared/components/product/ProductCustomizationForm";
import { CustomModal } from "@/shared/components/CustomModal";
import { ButtonSheetModal } from "@/shared/components/ButtonSheetModal";
import { useIsMobile } from "@/shared/hooks/useIsMobile";
import productPlaceholderImage from "@/assets/product-placeholder.svg";
import type { SuggestedOrderItem as SuggestedOrderItemType } from "@/features/order-assistant/types/order-assistant.types";
import type { MenuProduct } from "@/features/menu/types/menu.types";
import type { ProductCustomizationOutput } from "@/shared/components/product/types";

type SuggestedOrderItemProps = {
  item: SuggestedOrderItemType;
  product: MenuProduct;
  onUpdateQuantity: (lineId: string, quantity: number) => void;
  onRemove: (lineId: string) => void;
  onUpdateConfiguration: (
    lineId: string,
    output: ProductCustomizationOutput,
  ) => void;
  explanation?: string;
};

const hasCustomizations = (product: MenuProduct) =>
  product.priceVariants.length > 0 ||
  product.groups.some((g) => g.is_active) ||
  product.additions.length > 0;

const statusConfig: Record<string, { label: string; className: string }> = {
  complete: {
    label: "Listo",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  needs_variant: {
    label: "Elige variante",
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  needs_options: {
    label: "Requiere opciones",
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  needs_additions: {
    label: "Elige acompañantes",
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  incomplete: {
    label: "Incompleto",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
};

function formatItemDetails(
  item: SuggestedOrderItemType,
  variantLabel?: string,
): string {
  const parts: string[] = [];

  if (variantLabel) {
    parts.push(variantLabel);
  }

  if (item.selectedOptions && Object.keys(item.selectedOptions).length > 0) {
    parts.push(...Object.values(item.selectedOptions));
  }

  if (item.additionOptions?.length) {
    parts.push(...item.additionOptions.map((a) => `+${a.label}`));
  }

  return parts.join(" · ");
}

export function SuggestedOrderItem({
  item,
  product,
  onUpdateQuantity,
  onRemove,
  onUpdateConfiguration,
  explanation,
}: SuggestedOrderItemProps) {
  const [showConfig, setShowConfig] = useState(false);
  const isMobile = useIsMobile();
  const image = item.urlImage ?? {
    src: productPlaceholderImage,
    alt: item.productName,
  };

  const variantLabel = item.variantId
    ? product.priceVariants.find((v) => v.id === item.variantId)?.label
    : undefined;
  const details = formatItemDetails(item, variantLabel);
  const cfg = statusConfig[item.configurationStatus] ?? statusConfig.incomplete;
  const needsAttention = item.configurationStatus !== "complete";
  const canConfigure = hasCustomizations(product);
  const hasOptionalAdditions =
    product.additions.length > 0 &&
    item.additionOptions.length === 0 &&
    item.configurationStatus === "complete";

  const renderForm = useCallback(
    () => (
      <ProductCustomizationForm
        product={product}
        submitLabel="Guardar"
        initial={{
          variantId: item.variantId,
          selectedOptions: item.selectedOptions,
          selectedAdditions: product.additions.filter((a) =>
            item.additionOptions.some((o) => o.key === a.id),
          ),
          quantity: item.quantity,
        }}
        onSubmit={(output) => {
          onUpdateConfiguration(item.lineId, output);
          setShowConfig(false);
        }}
        onClose={() => setShowConfig(false)}
      />
    ),
    [product, item, onUpdateConfiguration],
  );

  return (
    <article className="rounded-2xl border border-border bg-surface p-3 shadow-elevated sm:p-4">
      <div className="flex items-start gap-3">
        <img
          src={image.src}
          alt={image.alt}
          className="size-12 shrink-0 rounded-xl border border-border object-cover sm:size-14"
          loading="lazy"
          decoding="async"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate font-heading text-sm font-black leading-tight text-foreground sm:text-base">
                {item.productName}
              </h3>
              {details ? (
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {details}
                </p>
              ) : null}
              <p className="mt-0.5 text-xs font-bold text-muted-foreground">
                {formatCOP(item.unitPrice)} c/u
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-heading text-base font-black leading-none text-primary sm:text-lg">
                {formatCOP(item.subtotal)}
              </p>
              <p className="mt-0.5 text-[10px] font-bold text-muted-foreground sm:text-xs">
                {item.quantity} x {formatCOP(item.unitPrice)}
              </p>
            </div>
          </div>

          {/* Status badge + configure */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {needsAttention ? (
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="size-3.5 shrink-0 text-yellow-600 dark:text-yellow-400" />
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-black leading-none",
                    cfg.className,
                  )}
                >
                  {cfg.label}
                </span>
              </div>
            ) : null}
            {hasOptionalAdditions ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-primary/40 bg-primary/5 px-2.5 py-0.5 text-[10px] font-black text-primary">
                <PlusCircle className="size-3" />
                Acompañantes
              </span>
            ) : null}
            {canConfigure ? (
              <button
                type="button"
                onClick={() => setShowConfig(true)}
                className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5 text-[10px] font-black text-muted-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Settings2 className="size-3" />
                Configurar
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Explanation */}
      {explanation ? (
        <p className="mt-2 text-xs italic leading-relaxed text-muted-foreground">
          {explanation}
        </p>
      ) : null}

      {/* Actions */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <QuantityStepper
          size="sm"
          quantity={item.quantity}
          onIncrement={() => onUpdateQuantity(item.lineId, item.quantity + 1)}
          onDecrement={() =>
            onUpdateQuantity(item.lineId, Math.max(0, item.quantity - 1))
          }
          onChange={(qty) => onUpdateQuantity(item.lineId, qty)}
          itemName={item.productName}
        />
        <button
          type="button"
          onClick={() => onRemove(item.lineId)}
          className="inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-error hover:text-error focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
          aria-label={`Eliminar ${item.productName} de la sugerencia`}
          title="Eliminar"
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </button>
      </div>

      {/* Customization modal - responsive: ButtonSheetModal on mobile, CustomModal on desktop */}
      {showConfig ? (
        isMobile ? (
          <ButtonSheetModal
            isOpen
            title={item.productName}
            onClose={() => setShowConfig(false)}
          >
            {renderForm()}
          </ButtonSheetModal>
        ) : (
          <CustomModal
            isOpen
            title={item.productName}
            onClose={() => setShowConfig(false)}
            contentClassName="sm:max-w-xl sm:mx-4"
          >
            {renderForm()}
          </CustomModal>
        )
      ) : null}
    </article>
  );
}
