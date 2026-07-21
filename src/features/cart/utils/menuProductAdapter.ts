import type { AdditionRow } from "@/features/admin/types/additions.types";
import type { CartItem } from "@/features/cart/types/cart.types";
import type {
  OptionGroup,
  MenuPriceVariant,
  MenuProduct,
} from "@/features/menu/types/menu.types";

export type CartItemToMenuProductInput = {
  item: CartItem;
  availableAdditions?: AdditionRow[];
  optionGroups?: OptionGroup[];
};

function buildPriceVariants(
  variantOptions: CartItem["variantOptions"],
): MenuPriceVariant[] {
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
    tags: null,
    category: null,
    groups: groups.map((group) => ({ ...group })),
    urlImage: item.image,
    priceVariants: buildPriceVariants(item.variantOptions),
    additions,
  };
}
