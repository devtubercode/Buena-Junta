import type {
  MenuImage,
  OptionGroup,
  MenuProduct,
} from "@/features/menu/types/menu.types";

export function hasPriceVariants(product: MenuProduct): boolean {
  return product.priceVariants.length > 0;
}

export function hasRequiredOptions(product: MenuProduct): boolean {
  return getRequiredGroups(product).length > 0;
}

export function hasAdditions(product: MenuProduct): boolean {
  return product.additions.length > 0;
}

export function requiresCustomization(product: MenuProduct): boolean {
  console.log("Checking if product requires customization:", product);
  return (
    hasPriceVariants(product) ||
    hasRequiredOptions(product) ||
    hasAdditions(product)
  );
}

export function isSimpleProduct(product: MenuProduct): boolean {
  return !requiresCustomization(product);
}

export function getRequiredGroups(product: MenuProduct): OptionGroup[] {
  console.log(
    "Getting required option groups for product:",
    product.groups,
  );
  return [...(product.groups ?? [])]
    .filter((group) => group.is_active && group.is_required)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((group) => ({
      ...group,
      options: [...(group.options ?? [])]
        .filter((option) => option.is_active)
        .sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .filter((group) => group.options.length > 0);
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
    const prices = product.priceVariants.map((option) => option.price);
    const minPrice = Math.min(...prices);
    return `Desde ${formatCOP(minPrice)}`;
  }

  const effectivePrice = product.sale_price ?? product.price;
  if (effectivePrice !== null) {
    return formatCOP(effectivePrice);
  }

  return null;
}

export type ProductDiscountInfo = {
  originalPrice: number;
  salePrice: number;
  discountPercent: number;
};

export function getProductDiscountInfo(
  product: MenuProduct,
): ProductDiscountInfo | null {
  if (hasPriceVariants(product)) return null;
  if (product.sale_price === null || product.price === null) return null;
  if (product.sale_price >= product.price) return null;

  const discountPercent = Math.round(
    (1 - product.sale_price / product.price) * 100,
  );
  return {
    originalPrice: product.price,
    salePrice: product.sale_price,
    discountPercent,
  };
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
