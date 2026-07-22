import { QuantityStepper } from "@/shared/components/QuantityStepper";
import { formatCOP } from "@/features/cart/utils/money";
import type { ProductCustomizationOutput } from "@/shared/components/product/types";
import type { MenuProduct } from "@/features/menu/types/menu.types";
import { useProductCustomization } from "@/shared/hooks/useProductCustomization";
import { AdditionSelector } from "@/shared/components/product/AdditionSelector";
import { OptionGroupSelector } from "@/shared/components/product/OptionGroupSelector";
import { VariantSelector } from "@/shared/components/product/VariantSelector";
import { getProductImage } from "@/features/menu/utils/productHelpers";
import { cn } from "@/shared/utils/cn";

type ProductCustomizationFormProps = {
  product: MenuProduct;
  submitLabel?: string;
  onSubmit: (output: ProductCustomizationOutput) => void;
  onClose: () => void;
};

export function ProductCustomizationForm({
  product,
  submitLabel = "Agregar al pedido",
  onSubmit,
  onClose,
}: ProductCustomizationFormProps) {
  const {
    selectedVariant,
    selectedOptions,
    selectedAdditions,
    quantity,
    unitPrice,
    totalPrice,
    isValid,
    activeOptionGroups,
    availableAdditions,
    handleSelectVariant,
    handleSelectOption,
    handleToggleAddition,
    handleIncrement,
    handleDecrement,
    handleSetQuantity,
    buildOutput,
  } = useProductCustomization(product);

  const productImage = getProductImage(product);
  const hasCustomizations =
    product.priceVariants.length > 0 ||
    activeOptionGroups.length > 0 ||
    availableAdditions.length > 0;

  const handleSubmit = () => {
    const output = buildOutput();
    if (!output) return;

    onSubmit(output);
    onClose();
  };

  return (
    <div className="grid max-h-[80vh] grid-rows-[auto_1fr_auto]">
      <header className="border-b border-border pb-3">
        <div className="flex items-start gap-3">
          <img
            src={productImage.src}
            alt={productImage.alt}
            className="aspect-square w-16 shrink-0 rounded-lg border border-border object-cover sm:w-20"
            loading="lazy"
            decoding="async"
          />
          <div className="min-w-0">
            <h2 className="font-heading text-xl font-black leading-tight text-foreground sm:text-2xl">
              {product.name}
            </h2>
            {product.description ? (
              <p className="mt-0.5 line-clamp-2 text-sm font-medium leading-5 text-muted-foreground">
                {product.description}
              </p>
            ) : null}
            <p className="mt-1 font-heading text-xl font-black leading-none text-primary sm:text-2xl">
              {unitPrice === null ? "—" : formatCOP(unitPrice)}
            </p>
          </div>
        </div>
      </header>

      <div className="min-h-0 overflow-y-auto py-3">
        <div className="flex flex-col gap-4">
          {hasCustomizations ? (
            <>
              <VariantSelector
                variants={product.priceVariants}
                selectedVariant={selectedVariant}
                onSelect={handleSelectVariant}
              />

              <OptionGroupSelector
                groups={activeOptionGroups}
                selectedOptions={selectedOptions}
                onSelect={handleSelectOption}
              />

              <AdditionSelector
                additions={availableAdditions}
                selectedAdditions={selectedAdditions}
                onToggle={handleToggleAddition}
              />
            </>
          ) : null}

          <section className="flex flex-col gap-2">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
              Cantidad
            </span>
            <div>
              <QuantityStepper
                quantity={quantity}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
                onChange={handleSetQuantity}
              />
            </div>
          </section>
        </div>
      </div>

      <footer className="border-t border-border pt-3">
        <button
          type="button"
          disabled={!isValid || totalPrice === null}
          onClick={handleSubmit}
          className={cn(
            "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-4 text-sm font-black shadow-elevated transition",
            "focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary",
            isValid && totalPrice !== null
              ? "bg-primary text-primary-foreground hover:opacity-90"
              : "cursor-not-allowed bg-muted-foreground/30 text-muted-foreground",
          )}
        >
          {submitLabel}
          {totalPrice !== null ? <span>· {formatCOP(totalPrice)}</span> : null}
        </button>
      </footer>
    </div>
  );
}
