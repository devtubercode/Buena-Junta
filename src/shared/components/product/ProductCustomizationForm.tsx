import { QuantityStepper } from "@/shared/components/QuantityStepper";
import { formatCOP } from "@/features/cart/utils/money";
import type {
  CartItem,
  AddCartItemInput,
} from "@/features/cart/types/cart.types";
import type { MenuProduct } from "@/features/menu/types/menu.types";
import { useProductCustomization } from "@/shared/hooks/useProductCustomization";
import { AdditionSelector } from "@/shared/components/product/AdditionSelector";
import { OptionGroupSelector } from "@/shared/components/product/OptionGroupSelector";
import { VariantSelector } from "@/shared/components/product/VariantSelector";
import {
  getProductImage,
  isSimpleProduct,
} from "@/features/menu/utils/productHelpers";
import { cn } from "@/shared/utils/cn";

type ProductCustomizationFormProps = {
  product: MenuProduct;
  initialCartItem?: CartItem;
  submitLabel?: string;
  onSubmit: (input: AddCartItemInput) => void;
  onClose: () => void;
};

export function ProductCustomizationForm({
  product,
  initialCartItem,
  submitLabel = "Agregar al carrito",
  onSubmit,
  onClose,
}: ProductCustomizationFormProps) {
  const {
    selectedVariant,
    selectedOptions,
    selectedAdditions,
    quantity,
    note,
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
    setNote,
    buildCartInput,
  } = useProductCustomization(product, initialCartItem);

  const productImage = getProductImage(product);

  const handleSubmit = () => {
    if (isSimpleProduct(product)) {
      if (product.price === null) return;

      onSubmit({
        productId: product.id,
        image: product.urlImage,
        baseName: product.name,
        displayName: product.name,
        name: product.name,
        unitPrice: product.price,
        quantity,
        selectedOptions: {},
        additionOptions: [],
      });
      onClose();
      return;
    }

    const input = buildCartInput();
    if (!input) return;
    onSubmit(input);
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

      <div className="overflow-y-auto py-3">
        <div className="flex flex-col gap-4">
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

          <section className="flex flex-col gap-2">
            <label
              htmlFor="product-note"
              className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground"
            >
              Nota o instrucciones
            </label>
            <textarea
              id="product-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={160}
              rows={2}
              placeholder="Ej: sin cebolla, sin salsas..."
              className="w-full resize-none rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm font-medium text-foreground outline-none transition placeholder:text-placeholder focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </section>

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
