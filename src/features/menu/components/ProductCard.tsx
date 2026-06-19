import { useState } from "react";
import type { CartVariantOption } from "@/features/cart/types";
import type {
  CatalogPriceOption,
  CatalogProduct,
} from "@/features/menu/services/menuRepository";
import {
  buildCartProductName,
  buildSelectedVariantLabel,
  getMissingSelectionMessage,
  getSelectedVariantSummary,
  getVariantPrompt,
} from "@/features/menu/utils/productCopy";
import { ShoppingCart } from "lucide-react";
import { notify } from "@/shared/notifications/notify";

type ProductCardProps = {
  product: CatalogProduct;
  onAdd: (input: {
    variantKey?: string;
    label?: string;
    displayName?: string;
    priceCents: number;
    image?: {
      src: string;
      alt: string;
    };
    variantOptions?: CartVariantOption[];
  }) => void;
};

type SelectedVariants = Record<string, string>;

function buildVariantOptions(
  product: CatalogProduct,
): CartVariantOption[] | undefined {
  const priceOptions = product.priceOptions ?? [];

  if (priceOptions.length > 0) {
    return priceOptions.map((option) => ({
      key: option.label,
      label: option.label,
      itemName: buildCartProductName(product, option.label),
      unitPriceCents: option.priceCents,
    }));
  }

  if (product.variants.length === 1 && product.priceCents !== null) {
    return product.variants[0].values.map((value) => ({
      key: `${product.variants[0].name}: ${value}`,
      label: value,
      itemName: buildCartProductName(
        product,
        `${product.variants[0].name}: ${value}`,
      ),
      unitPriceCents: product.priceCents ?? 0,
    }));
  }

  return undefined;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const [selectedVariants, setSelectedVariants] = useState<SelectedVariants>(
    {},
  );
  const [selectedPriceOption, setSelectedPriceOption] =
    useState<CatalogPriceOption | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const isUnavailable = !product.isAvailable;
  const hasBasePrice = product.priceCents !== null;
  const priceOptions = product.priceOptions ?? [];
  const hasVariants = product.variants.length > 0;
  const cartVariantOptions = buildVariantOptions(product);
  const selectedVariantLabel = buildSelectedVariantLabel(selectedVariants);
  const isVariantSelectionComplete =
    !hasVariants ||
    product.variants.every((variant) =>
      Boolean(selectedVariants[variant.name]),
    );
  const shouldUseExpandableOptions = hasVariants || priceOptions.length > 0;
  const handleAdd = (input: {
    variantKey?: string;
    label?: string;
    displayName?: string;
    priceCents: number;
    image?: {
      src: string;
      alt: string;
    };
    variantOptions?: CartVariantOption[];
  }) => {
    onAdd(input);
    notify.whatsapp(
      `Agregaste ${input.displayName ?? product.name} al carrito.`,
    );
  };

  const handleSelectVariant = (groupName: string, value: string) => {
    setSelectedVariants((currentVariants) => ({
      ...currentVariants,
      [groupName]: value,
    }));
  };

  const handleSelectPriceOption = (option: CatalogPriceOption) => {
    setSelectedPriceOption(option);
  };

  const handleConfirmAdd = () => {
    if (!hasBasePrice && !selectedPriceOption) {
      notify.warning(getMissingSelectionMessage(product));
      return;
    }

    if (hasVariants && !isVariantSelectionComplete) {
      setShowOptions(true);
      notify.warning(getMissingSelectionMessage(product));
      return;
    }

    const baseLabel = selectedPriceOption?.label;
    const label = [baseLabel, selectedVariantLabel].filter(Boolean).join(" / ");
    const displayName = buildCartProductName(product, label || undefined);

    handleAdd({
      variantKey: label || undefined,
      label: label || undefined,
      displayName,
      priceCents: selectedPriceOption?.priceCents ?? product.priceCents ?? 0,
      image: product.primaryImage,
      variantOptions: cartVariantOptions,
    });
  };

  return (
    <article
      className="grid gap-4 rounded-lg border border-border bg-surface p-4 shadow-elevated sm:grid-cols-[112px_1fr]"
      data-product-id={product.id}
    >
      {product.primaryImage ? (
        <img
          src={product.primaryImage.src}
          alt={product.primaryImage.alt}
          className="aspect-square w-full rounded-md border border-border object-cover sm:w-28"
          loading="lazy"
        />
      ) : null}

      <div className="min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-primary">
              {product.categoryName}
            </p>
            <h3 className="mt-1 font-heading text-2xl font-black leading-tight text-foreground">
              {product.name}
            </h3>
          </div>
          {product.displayPrice ? (
            <p className="shrink-0 font-heading text-2xl font-black text-primary">
              {product.displayPrice}
            </p>
          ) : null}
        </div>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {product.description}
        </p>

        {hasVariants ? (
          <div className="mt-4 rounded-lg border border-primary-border bg-primary-soft p-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-primary">
                  {getVariantPrompt(product)}
                </p>
                <p className="mt-1 text-sm font-bold text-foreground">
                  {getSelectedVariantSummary(product, selectedVariantLabel)}
                </p>
              </div>
              <button
                type="button"
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-primary bg-surface px-4 text-xs font-black text-primary transition hover:bg-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                onClick={() => setShowOptions((isOpen) => !isOpen)}
              >
                {showOptions ? "Ocultar" : "Elegir"}
              </button>
            </div>
          </div>
        ) : null}

        {showOptions && hasVariants ? (
          <div className="mt-3 space-y-4 rounded-lg border border-border bg-surface-muted p-3">
            {product.variants.map((variant) => (
              <fieldset key={variant.name}>
                <legend className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
                  {variant.name}
                </legend>
                <div className="mt-2 flex max-h-36 flex-wrap gap-2 overflow-y-auto pr-1">
                  {variant.values.map((value) => (
                    <button
                      key={value}
                      type="button"
                      className="min-h-10 rounded-full border px-3 text-xs font-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary data-[selected=true]:border-primary data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=false]:border-border data-[selected=false]:bg-surface data-[selected=false]:text-muted-foreground"
                      data-selected={selectedVariants[variant.name] === value}
                      onClick={() => handleSelectVariant(variant.name, value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        ) : null}

        <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
          {priceOptions.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {priceOptions.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  disabled={isUnavailable}
                  className="relative rounded-lg border px-3 py-2 text-left transition enabled:hover:border-primary disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary data-[selected=true]:border-primary data-[selected=true]:bg-primary-soft data-[selected=false]:border-border data-[selected=false]:bg-surface-muted"
                  data-selected={selectedPriceOption?.label === option.label}
                  data-option-label={option.label}
                  onClick={() => handleSelectPriceOption(option)}
                >
                  {selectedPriceOption?.label === option.label ? (
                    <span className="absolute right-2 top-2 rounded-full bg-success px-2 py-0.5 text-[10px] font-black uppercase text-success-foreground">
                      Listo
                    </span>
                  ) : null}
                  <span className="block text-[11px] font-black uppercase tracking-normal text-muted-foreground">
                    {option.label}
                  </span>
                  <span className="mt-1 block text-sm font-black text-primary">
                    {option.displayPrice}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm font-bold text-muted-foreground">
              {isUnavailable
                ? "No disponible por ahora"
                : shouldUseExpandableOptions
                  ? `${getVariantPrompt(product)} para agregar`
                  : "Listo para agregar"}
            </p>
          )}

          {hasBasePrice || priceOptions.length > 0 ? (
            <button
              type="button"
              disabled={isUnavailable}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-5 text-sm font-black text-primary-foreground shadow-elevated transition enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-muted-foreground disabled:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              data-cart-action="add-product"
              onClick={handleConfirmAdd}
            >
              <ShoppingCart className="mr-2 size-5" />
              {shouldUseExpandableOptions ? "Agregar al carrito" : "Agregar"}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
