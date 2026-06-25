import type { MenuProduct } from "@/features/menu/types/menu.types";

export function searchMenuProducts(
  productsToSearch: MenuProduct[],
  query: string,
  categorySlug?: string,
): MenuProduct[] {
  const normalizedQuery = query.trim().toLowerCase();

  return productsToSearch.filter((product) => {
    const matchesCategory =
      !categorySlug || product.categories?.slug === categorySlug;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [
        product.name,
        product.description,
        product.categories?.name,
        product.tags?.join(" "),
        product.variants.flatMap((variant) => variant.values).join(" "),
        product.priceOptions.map((option) => option.label).join(" "),
        product.additions.map((addition) => addition.name).join(" "),
      ]
        .filter((value): value is string => Boolean(value))
        .some((value) => value.toLowerCase().includes(normalizedQuery));

    return matchesCategory && matchesQuery;
  });
}
