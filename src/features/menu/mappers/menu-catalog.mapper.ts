import type {
  MenuOptionGroup,
  MenuProduct,
  MenuProductRow,
} from "@/features/menu/types/menu.types";
import type { ProductAvailableAdditionRow } from "@/shared/services/product.service";

function sortOptionGroups(optionGroups: MenuOptionGroup[]) {
  return [...optionGroups].sort((a, b) => a.name.localeCompare(b.name));
}

function getProductVariants(optionGroups: MenuOptionGroup[]) {
  return optionGroups
    .filter((group) => group.is_active)
    .map((group) => ({
      name: group.name,
      values: [...group.product_option_values]
        .filter((option) => option.is_active)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((option) => option.name),
    }))
    .filter((variant) => variant.values.length > 0);
}

function getProductPriceOptions(product: MenuProductRow) {
  return [...(product.product_variants ?? [])]
    .filter((variant) => variant.is_active)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((variant) => {
      return {
        label: variant.name,
        price: Number(variant.price),
      };
    });
}

function getProductAdditions(additions: ProductAvailableAdditionRow[]) {
  const uniqueAdditions = new Map<string, ProductAvailableAdditionRow>();

  for (const addition of additions) {
    if (!uniqueAdditions.has(addition.addition_id)) {
      uniqueAdditions.set(addition.addition_id, addition);
    }
  }

  return [...uniqueAdditions.values()]
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .map((addition) => ({
      id: addition.addition_id,
      name: addition.name,
      description: addition.description,
      price: addition.price,
      source: addition.source,
      created_at: addition.created_at,
    }));
}

export function mapCatalogProduct(
  product: MenuProductRow,
  getImageUrl: (storagePath: string) => string,
  additions: ProductAvailableAdditionRow[] = [],
): MenuProduct {
  // NEW: Product-specific option groups (flat array, no nested relation table)
  const optionGroups = sortOptionGroups(
    (product.product_option_groups ?? []),
  );
  const productAdditions = additions.filter(
    (addition) => addition.product_id === product.id,
  );

  return {
    ...product,
    product_variants: product.product_variants ?? [],
    option_groups: optionGroups.map((group) => ({
      ...group,
      product_option_values: [...group.product_option_values]
        .filter((option) => option.is_active)
        .sort((a, b) => a.name.localeCompare(b.name)),
    })),
    urlImage: product.image_path
      ? {
          src: getImageUrl(product.image_path),
          alt: product.name,
        }
      : undefined,
    variants: getProductVariants(optionGroups),
    priceOptions: getProductPriceOptions(product),
    additions: getProductAdditions(productAdditions),
  };
}
