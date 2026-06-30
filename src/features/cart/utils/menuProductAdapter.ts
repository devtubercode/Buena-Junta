import type { CartItem } from "@/features/cart/types/cart.types";
import type {
  MenuAddition,
  MenuOptionGroup,
  MenuPriceOption,
  MenuProduct,
  MenuProductVariantRow,
} from "@/features/menu/types/menu.types";

export type CartItemToMenuProductInput = {
  item: CartItem;
  availableAdditions?: MenuAddition[];
  optionGroups?: MenuOptionGroup[];
};

function buildProductVariantRows(
  variantOptions: CartItem["variantOptions"],
): MenuProductVariantRow[] {
  return (
    variantOptions?.map((option) => ({
      id: option.key,
      name: option.label,
      price: option.unitPrice,
      is_default: false,
      is_active: true,
      sort_order: 0,
    })) ?? []
  );
}

function buildPriceOptions(
  variantOptions: CartItem["variantOptions"],
): MenuPriceOption[] {
  return (
    variantOptions?.map((option) => ({
      label: option.label,
      price: option.unitPrice,
    })) ?? []
  );
}

export function cartItemToMenuProduct({
  item,
  availableAdditions,
  optionGroups,
}: CartItemToMenuProductInput): MenuProduct {
  const baseName = item.baseName ?? item.name;
  const additions = availableAdditions ?? item.availableAdditions ?? [];
  const groups = optionGroups ?? item.optionGroups ?? [];

  return {
    id: item.productId,
    slug: "",
    name: baseName,
    description: "",
    price: item.variantOptions?.length ? null : item.unitPrice,
    image_path: item.image?.src ?? null,
    is_available: true,
    sort_order: 0,
    tags: null,
    categories: null,
    product_variants: buildProductVariantRows(item.variantOptions),
    product_option_groups: groups.map((group) => ({ ...group })),
    urlImage: item.image,
    option_groups: groups.map((group) => ({ ...group })),
    variants: [],
    priceOptions: buildPriceOptions(item.variantOptions),
    additions,
  };
}
