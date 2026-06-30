import { useMemo, useState } from "react";
import { categoryMatchesSearch } from "@/features/admin/categories/utils/categoryFilters";
import type { CategoryRow } from "@/features/admin/types/categories.types";

type UseAdminCategoryFiltersResult = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filteredCategories: CategoryRow[];
  activeFiltersCount: number;
};

export function useAdminCategoryFilters(
  categories: CategoryRow[],
): UseAdminCategoryFiltersResult {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      categoryMatchesSearch(category.name, searchQuery),
    );
  }, [categories, searchQuery]);

  const activeFiltersCount = searchQuery.trim() ? 1 : 0;

  return {
    searchQuery,
    setSearchQuery,
    filteredCategories,
    activeFiltersCount,
  };
}
