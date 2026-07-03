import { useMemo, useState } from "react";

import type { CategoryRow } from "@/features/admin/types/categories.types";
import { normalizeSearchText } from "@/shared/utils/search";

export const useCategoryFilters = (categories: CategoryRow[]) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      if (!searchQuery) return true;

      const normalizedQuery = normalizeSearchText(searchQuery);
      if (!normalizedQuery) return true;

      const normalizedName = normalizeSearchText(category.name);
      return normalizedName.includes(normalizedQuery);
    });
  }, [categories, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredCategories,
  };
};
