import { QuantityStepper } from "@/shared/components/QuantityStepper";
import { formatCOP } from "@/features/cart/utils/money";
import type { ProductCustomizationOutput } from "@/shared/components/product/types";
import type { MenuProduct } from "@/features/menu/types/menu.types";
import type { AdditionRow } from "@/features/admin/types/additions.types";
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
  initial?: {
    variantId?: string;
    selectedOptions?: Record<string, string>;
    selectedAdditions?: AdditionRow[];
    quantity?: number;
  };
  onSubmit: (output: ProductCustomizationOutput) => void;
  onClose: () => void;
};

export function ProductCustomizationForm({
  product,
  submitLabel = "Agregar",
  initial,
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
  } = useProductCustomization(product, initial);

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
    <div className="flex max-h-[80dvh] flex-col sm:max-h-[85dvh]">
      <header className="shrink-0">
        <div className="relative sm:hidden">
          <img
            src={productImage.src}
            alt={productImage.alt}
            className="aspect-video w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          {discountInfo ? (
            <span className="absolute left-2 top-2 rounded-lg bg-red-600 px-2 py-1 text-xs font-black text-white shadow-elevated">
              -{discountInfo.discountPercent}%
            </span>
          ) : null}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-background to-transparent" />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start  px-2">
          <div className="hidden sm:relative sm:block sm:shrink-0">
            <img
              src={productImage.src}
              alt={productImage.alt}
              className="aspect-square w-44 rounded-xl border border-border object-cover"
              loading="lazy"
              decoding="async"
            />
            {discountInfo ? (
              <span className="absolute left-0 top-0 rounded-br-lg rounded-tl-lg bg-red-600 px-2 py-1 text-xs font-black text-white shadow-elevated">
                -{discountInfo.discountPercent}%
              </span>
            ) : null}
          </div>

          <div className="min-w-0">
            <h2 className="font-heading text-xl font-black leading-tight text-foreground sm:text-2xl">
              {product.name}
            </h2>
            {product.description ? (
              <p className="mt-1 text-sm font-medium leading-5 text-muted-foreground">
                {product.description}
              </p>
            ) : null}
            <div className="mt-2 flex items-baseline gap-1.5">
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

      <div className="min-h-0 flex-1 overflow-y-auto  py-2 px-1">
        <div className="flex flex-col gap-4">
          {hasCustomizations && (
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
          )}
        </div>
      </div>

      <footer className="shrink-0 border-t border-border py-3 px-2">
        <div className="flex items-center gap-3">
          <QuantityStepper
            quantity={quantity}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onChange={handleSetQuantity}
            size="md"
            className="shrink-0"
          />
          <Button
            variant="primary"
            size="md"
            radius="full"
            fullWidth
            disabled={!isValid || totalPrice === null}
            onClick={handleSubmit}
            className="flex-1"
          >
            {submitLabel}
            {totalPrice !== null ? (
              <span> · {formatCOP(totalPrice)}</span>
            ) : null}
          </Button>
        </div>
      </footer>
    </div>
  );
}
