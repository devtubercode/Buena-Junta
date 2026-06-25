import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import productPlaceholderImage from "@/assets/product-placeholder.svg";
import type {
  CartAdditionOption,
  CartVariantOption,
} from "@/features/cart/types/cart.types";
import { formatCOP } from "@/features/cart/utils/money";
import type {
  MenuOptionGroup,
  MenuPriceOption,
  MenuProduct,
} from "@/features/menu/types/menu.types";
import {
  buildCartProductName,
  getMissingSelectionMessage,
} from "@/features/menu/utils/productCopy";
import { notify } from "@/shared/notifications/notify";
import { cn } from "@/shared/utils/cn";

type ProductCardProps = {
  product: MenuProduct;
  onAdd: (input: {
    variantKey?: string;
    label?: string;
    displayName?: string;
    price: number;
    image?: {
      src: string;
      alt: string;
    };
    variantOptions?: CartVariantOption[];
    additionOptions?: CartAdditionOption[];
  }) => void;
};

type SelectedOptions = Record<string, string>;
type SelectedAdditions = Record<string, boolean>;

function getActiveOptionGroups(product: MenuProduct) {
  return [...(product.option_groups ?? [])]
    .filter((group) => group.is_active)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((group) => ({
      ...group,
      option_values: [...(group.option_values ?? [])]
        .filter((option) => option.is_active)
        .sort((a, b) => a.created_at.localeCompare(b.created_at)),
    }))
    .filter((group) => group.option_values.length > 0);
}

function getActiveAdditions(product: MenuProduct) {
  return [...(product.additions ?? [])];
}

function getPriceOptions(
  product: MenuProduct,
  priceOptions: MenuPriceOption[],
): CartVariantOption[] | undefined {
  if (priceOptions.length === 0) {
    return undefined;
  }

  return priceOptions.map((option) => ({
    key: option.label,
    label: option.label,
    itemName: buildCartProductName(product, option.label),
    unitPrice: option.price,
  }));
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const priceOptions = product.priceOptions ?? [];
  const optionGroups = getActiveOptionGroups(product);
  const additionOptions = getActiveAdditions(product);
  const [selectedPriceOption, setSelectedPriceOption] =
    useState<MenuPriceOption | null>(() => priceOptions[0] ?? null);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [selectedAdditions, setSelectedAdditions] =
    useState<SelectedAdditions>({});
  const isUnavailable = !product.is_available;
  const hasProductImage = Boolean(product.urlImage);
  const productImage = product.urlImage ?? {
    src: productPlaceholderImage,
    alt: `Imagen de referencia para ${product.name}`,
  };

  const selectedOptionSummary = optionGroups
    .map((group) => selectedOptions[group.name])
    .filter((label): label is string => Boolean(label))
    .join(" / ");
  const selectedVariantLabel = [
    selectedPriceOption?.label,
    selectedOptionSummary ? `Sabor: ${selectedOptionSummary}` : null,
  ]
    .filter(Boolean)
    .join(" / ");
  const selectedAdditionsList = additionOptions.filter(
    (addition) => selectedAdditions[addition.id],
  );
  const additionTotal = selectedAdditionsList.reduce(
    (total, addition) => total + addition.price,
    0,
  );
  const selectedBasePrice =
    selectedPriceOption !== null ? selectedPriceOption.price : product.price;
  const totalPrice =
    selectedBasePrice === null ? null : selectedBasePrice + additionTotal;
  const formattedPrice =
    totalPrice === null ? null : formatCOP(totalPrice);
  const cartVariantOptions = getPriceOptions(product, priceOptions);
  const cartAdditionOptions = selectedAdditionsList.map((addition) => ({
    key: addition.id,
    label: addition.name,
    unitPrice: addition.price,
  }));

  const isOptionSelectionComplete = optionGroups.every((group) => {
    if (!group.is_required) {
      return true;
    }

    return Boolean(selectedOptions[group.name]);
  });

  const handleSelectOption = (group: MenuOptionGroup, optionName: string) => {
    setSelectedOptions((currentOptions) => {
      const currentValue = currentOptions[group.name];

      if (!group.is_required && currentValue === optionName) {
        const nextOptions = { ...currentOptions };
        delete nextOptions[group.name];
        return nextOptions;
      }

      return {
        ...currentOptions,
        [group.name]: optionName,
      };
    });
  };

  const handleToggleAddition = (additionId: string) => {
    setSelectedAdditions((currentAdditions) => ({
      ...currentAdditions,
      [additionId]: !currentAdditions[additionId],
    }));
  };

  const handleConfirmAdd = () => {
    if (totalPrice === null) {
      notify.warning(getMissingSelectionMessage(product));
      return;
    }

    if (!isOptionSelectionComplete) {
      notify.warning(getMissingSelectionMessage(product));
      return;
    }

    const displayName = buildCartProductName(
      product,
      selectedVariantLabel || undefined,
    );

    onAdd({
      variantKey: selectedVariantLabel || undefined,
      label: selectedVariantLabel || undefined,
      displayName,
      price: totalPrice,
      image: productImage,
      variantOptions: cartVariantOptions,
      additionOptions: cartAdditionOptions,
    });
    notify.whatsapp(`Agregaste ${displayName} al carrito.`);
  };

  return (
    <article
      className="grid grid-cols-[104px_minmax(0,1fr)] gap-3 rounded-lg border border-border bg-surface p-2 shadow-elevated sm:grid-cols-[116px_minmax(0,1fr)]"
      data-product-id={product.id}
    >
      <img
        src={productImage.src}
        alt={productImage.alt}
        className={cn(
          "h-full min-h-28 w-full rounded-md border border-border object-cover",
          hasProductImage
            ? "bg-surface-muted"
            : "bg-surface-raised object-contain p-2",
        )}
        loading="lazy"
      />

      <div className="flex min-w-0 flex-col py-1 pr-1">
        <h3 className="line-clamp-2 font-heading text-[1.55rem] font-black leading-[0.98] text-foreground">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm font-medium leading-5 text-muted-foreground">
          {product.description}
        </p>

        {priceOptions.length > 0 ? (
          <div
            className="mt-2 flex gap-1.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden"
            aria-label="Presentaciones"
          >
            {priceOptions.map((option) => {
              const isSelected = selectedPriceOption?.label === option.label;

              return (
                <button
                  key={option.label}
                  type="button"
                  disabled={isUnavailable}
                  data-selected={isSelected}
                  className="inline-flex min-h-8 shrink-0 items-center gap-1 rounded-md border px-2 text-[11px] font-black transition disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary data-[selected=true]:border-primary data-[selected=true]:bg-primary-soft data-[selected=true]:text-primary data-[selected=false]:border-primary-border data-[selected=false]:bg-surface data-[selected=false]:text-muted-foreground"
                  onClick={() => setSelectedPriceOption(option)}
                >
                  <span>{option.label}</span>
                  <span className="font-semibold">
                    {formatCOP(option.price)}
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}

        {optionGroups.length > 0 ? (
          <div className="mt-2 grid gap-1.5">
            {optionGroups.map((group) => (
              <fieldset key={group.name} className="min-w-0">
                <legend className="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">
                  {group.name}
                </legend>
                <div className="flex gap-1.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
                  {group.option_values.map((option) => {
                    const isSelected =
                      selectedOptions[group.name] === option.name;

                    return (
                      <button
                        key={`${group.name}-${option.name}`}
                        type="button"
                        disabled={isUnavailable}
                        data-selected={isSelected}
                        className="inline-flex min-h-8 shrink-0 items-center gap-1 rounded-md border px-2 text-[11px] font-black transition disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary data-[selected=true]:border-primary data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=false]:border-primary-border data-[selected=false]:bg-surface data-[selected=false]:text-muted-foreground"
                        onClick={() => handleSelectOption(group, option.name)}
                      >
                        <span>{option.name}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>
        ) : null}

        {additionOptions.length > 0 ? (
          <div className="mt-2 grid gap-1.5">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">
              Acompañantes
            </p>
            <div className="flex gap-1.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
              {additionOptions.map((addition) => {
                const isSelected = Boolean(selectedAdditions[addition.id]);

                return (
                  <button
                    key={addition.id}
                    type="button"
                    disabled={isUnavailable}
                    data-selected={isSelected}
                    className="inline-flex min-h-8 shrink-0 items-center gap-1 rounded-md border px-2 text-[11px] font-black transition disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary data-[selected=true]:border-primary data-[selected=true]:bg-primary-soft data-[selected=true]:text-primary data-[selected=false]:border-primary-border data-[selected=false]:bg-surface data-[selected=false]:text-muted-foreground"
                    onClick={() => handleToggleAddition(addition.id)}
                  >
                    <span>{addition.name}</span>
                    <span className="font-semibold">{formatCOP(addition.price)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="min-w-0">
            {formattedPrice ? (
              <p className="font-heading text-[1.55rem] font-black leading-none text-primary">
                {formattedPrice}
              </p>
            ) : (
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Precio no disponible
              </p>
            )}
            {additionTotal > 0 ? (
              <p className="mt-1 text-[11px] font-bold text-muted-foreground">
                Incluye {formatCOP(additionTotal)} en acompañantes
              </p>
            ) : null}
          </div>
          <button
            type="button"
            disabled={isUnavailable}
            className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md bg-primary px-3.5 text-[13px] font-black text-primary-foreground shadow-elevated transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleConfirmAdd}
          >
            <ShoppingCart className="size-4" />
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}
