import { normalizeSearchText } from "@/shared/utils/search";

export function categoryMatchesSearch(
  categoryName: string,
  searchQuery: string,
): boolean {
  if (!searchQuery) {
    return true;
  }

  const normalizedQuery = normalizeSearchText(searchQuery);
  if (!normalizedQuery) {
    return true;
  }

  const normalizedName = normalizeSearchText(categoryName);
  return normalizedName.includes(normalizedQuery);
}
