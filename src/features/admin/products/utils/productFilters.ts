import { normalizeSearchText } from "@/shared/utils/search";

export function productMatchesSearch(
  productName: string,
  searchQuery: string,
): boolean {
  if (!searchQuery) {
    return true;
  }

  const normalizedQuery = normalizeSearchText(searchQuery);
  if (!normalizedQuery) {
    return true;
  }

  const normalizedName = normalizeSearchText(productName);
  return normalizedName.includes(normalizedQuery);
}
