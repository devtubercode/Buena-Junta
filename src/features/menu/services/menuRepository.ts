import {
  categories,
  getProductImageIds,
  menuImages,
  products,
  promotions,
} from "@/features/menu/data/menu";
import type { MenuCategory, MenuProduct, MenuPromotion } from "@/features/menu/types";
import { parsePriceToCents } from "@/features/cart/utils/money";

export type CatalogPriceOption = {
  label: string;
  displayPrice: string;
  priceCents: number;
};

export type CatalogProduct = Omit<MenuProduct, "priceOptions"> & {
  displayPrice: string | null;
  priceCents: number | null;
  priceOptions?: CatalogPriceOption[];
  categoryName: string;
  categorySlug: string;
  primaryImage?: {
    src: string;
    alt: string;
  };
};

const categoryById = new Map(categories.map((category) => [category.id, category]));
const imageById = new Map(menuImages.map((image) => [image.id, image]));

function normalizeProduct(product: MenuProduct): CatalogProduct {
  const category = categoryById.get(product.categoryId);
  const primaryImageId = category ? getProductImageIds(product, category)[0] : product.imageIds[0];
  const primaryImage = primaryImageId ? imageById.get(primaryImageId) : undefined;

  return {
    ...product,
    displayPrice: product.price,
    priceCents: parsePriceToCents(product.price),
    priceOptions: product.priceOptions
      ?.map((option) => {
        const priceCents = parsePriceToCents(option.price);

        if (priceCents === null) {
          return null;
        }

        return {
          label: option.label,
          displayPrice: option.price,
          priceCents,
        };
      })
      .filter((option): option is CatalogPriceOption => Boolean(option)),
    categoryName: category?.name ?? "Sin categoría",
    categorySlug: category?.slug ?? "",
    primaryImage: primaryImage
      ? {
          src: primaryImage.src,
          alt: primaryImage.alt,
        }
      : undefined,
  };
}

export function getCategories(): MenuCategory[] {
  return [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getProducts(): CatalogProduct[] {
  return products.map(normalizeProduct);
}

export function getAvailableProducts(): CatalogProduct[] {
  return getProducts().filter((product) => product.isAvailable);
}

export function getProductsByCategory(categoryId: string): CatalogProduct[] {
  return getAvailableProducts().filter((product) => product.categoryId === categoryId);
}

export function getProductById(productId: string): CatalogProduct | undefined {
  return getProducts().find((product) => product.id === productId);
}

export function getPromotions(): MenuPromotion[] {
  return promotions.filter((promotion) => promotion.active);
}

export function searchProducts(query: string, categoryId?: string): CatalogProduct[] {
  const normalizedQuery = query.trim().toLowerCase();

  return getAvailableProducts().filter((product) => {
    const matchesCategory = !categoryId || product.categoryId === categoryId;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [
        product.name,
        product.description,
        product.categoryName,
        product.tags?.join(" "),
        product.variants.flatMap((variant) => variant.values).join(" "),
        product.priceOptions?.map((option) => option.label).join(" "),
      ]
        .filter((value): value is string => Boolean(value))
        .some((value) => value.toLowerCase().includes(normalizedQuery));

    return matchesCategory && matchesQuery;
  });
}
