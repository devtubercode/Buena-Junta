import type {
  MenuImage,
  MenuOptionGroup,
  MenuProduct,
} from "@/features/menu/types/menu.types";

export function hasPriceVariants(product: MenuProduct): boolean {
  return product.priceOptions.length > 0;
}

export function hasRequiredOptions(product: MenuProduct): boolean {
  return getRequiredGroups(product).length > 0;
}

export function hasAdditions(product: MenuProduct): boolean {
  return product.additions.length > 0;
}

export function requiresCustomization(product: MenuProduct): boolean {
  return (
    hasPriceVariants(product) ||
    hasRequiredOptions(product) ||
    hasAdditions(product)
  );
}

export function isSimpleProduct(product: MenuProduct): boolean {
  return !requiresCustomization(product);
}

export function getRequiredGroups(product: MenuProduct): MenuOptionGroup[] {
  return [...(product.option_groups ?? [])]
    .filter((group) => group.is_active && group.is_required)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((group) => ({
      ...group,
      product_option_values: [...(group.product_option_values ?? [])]
        .filter((option) => option.is_active)
        .sort((a, b) => a.sort_order - b.sort_order),
    }))
    .filter((group) => group.product_option_values.length > 0);
}

export function getActiveOptionGroups(product: MenuProduct): MenuOptionGroup[] {
  return [...(product.option_groups ?? [])]
    .filter((group) => group.is_active)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((group) => ({
      ...group,
      product_option_values: [...(group.product_option_values ?? [])]
        .filter((option) => option.is_active)
        .sort((a, b) => a.sort_order - b.sort_order),
    }))
    .filter((group) => group.product_option_values.length > 0);
}

export function getProductButtonLabel(
  product: MenuProduct,
  isMobile = false,
): "Agregar" | "Elegir presentación" | "Personalizar" | "Presentaciones" {
  if (isSimpleProduct(product)) {
    return "Agregar";
  }

  if (
    hasPriceVariants(product) &&
    !hasRequiredOptions(product) &&
    !hasAdditions(product)
  ) {
    return isMobile ? "Presentaciones" : "Elegir presentación";
  }

  return "Personalizar";
}

export function getProductCardPriceLabel(product: MenuProduct): string | null {
  if (hasPriceVariants(product)) {
    const prices = product.priceOptions.map((option) => option.price);
    const minPrice = Math.min(...prices);
    return `Desde ${formatCOP(minPrice)}`;
  }

  if (product.price !== null) {
    return formatCOP(product.price);
  }

  return null;
}

export function getProductImage(product: MenuProduct): MenuImage {
  return (
    product.urlImage ?? {
      src: "/src/assets/product-placeholder.svg",
      alt: `Imagen de referencia para ${product.name}`,
    }
  );
}

function formatCOP(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);
}
