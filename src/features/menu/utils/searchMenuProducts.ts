import type { MenuProduct } from "@/features/menu/types/menu.types";

export const searchMenuProducts = (
  productsToSearch: MenuProduct[],
  query: string,
): MenuProduct[] => {
  const normalizedQuery = query.trim().toLowerCase();

  if (normalizedQuery.length === 0) {
    return productsToSearch;
  }

  return productsToSearch.filter((product) => {
    const searchableText = [
      product.name,
      product.description,
      product.categories?.name,
      product.tags?.join(" "),
    ]
      .filter((value): value is string => Boolean(value))
      .join(" ");

    return searchableText.toLowerCase().includes(normalizedQuery);
  });
};
