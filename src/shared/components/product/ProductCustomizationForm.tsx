import { QuantityStepper } from "@/shared/components/QuantityStepper";
import { formatCOP } from "@/features/cart/utils/money";
import type { ProductCustomizationOutput } from "@/shared/components/product/types";
import type { MenuProduct } from "@/features/menu/types/menu.types";
import { useProductCustomization } from "@/shared/hooks/useProductCustomization";
import { AdditionSelector } from "@/shared/components/product/AdditionSelector";
import { OptionGroupSelector } from "@/shared/components/product/OptionGroupSelector";
import { VariantSelector } from "@/shared/components/product/VariantSelector";
import {
  getProductDiscountInfo,
  getProductImage,
} from "@/features/menu/utils/productHelpers";
import { Button } from "@/shared/components/Button";

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
  const discountInfo = getProductDiscountInfo(product);
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
          <div className="relative shrink-0">
            <img
              src={productImage.src}
              alt={productImage.alt}
              className="aspect-square w-28 rounded-lg border border-border object-cover sm:w-32"
              loading="lazy"
              decoding="async"
            />
            {discountInfo ? (
              <span className="absolute left-0 top-0 rounded-br-lg rounded-tl-lg bg-red-600 px-1.5 py-0.5 text-[10px] font-black text-white shadow-elevated sm:px-2 sm:py-1 sm:text-xs">
                -{discountInfo.discountPercent}%
              </span>
            ) : null}
          </div>
          <div className="min-w-0">
            <h2 className="font-heading text-xl font-black leading-tight text-foreground sm:text-2xl">
              {product.name}
            </h2>
            {product.description ? (
              <p className="mt-0.5 text-sm font-medium leading-5 text-muted-foreground">
                {product.description}
              </p>
            ) : null}
            <div className="mt-1 flex items-baseline gap-1.5">
              <p className="font-heading text-xl font-black leading-none text-primary sm:text-2xl">
                {unitPrice === null ? "—" : formatCOP(unitPrice)}
              </p>
              {discountInfo ? (
                <p className="text-sm font-bold leading-none text-muted-foreground line-through sm:text-base">
                  {formatCOP(discountInfo.originalPrice)}
                </p>
              ) : null}
            </div>
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

        </div>
      </div>

      <footer className="pt-3">
        <div className="flex items-center gap-3">
          <QuantityStepper
            quantity={quantity}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onChange={handleSetQuantity}
          />
          <Button
            variant="primary"
            size="md"
            radius="full"
            fullWidth
            disabled={!isValid || totalPrice === null}
            onClick={handleSubmit}
          >
            {submitLabel}
            {totalPrice !== null ? <span>· {formatCOP(totalPrice)}</span> : null}
          </Button>
        </div>
      </footer>
    </div>
  );
}
