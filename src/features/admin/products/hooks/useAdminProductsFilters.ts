import { useMemo, useState } from "react";
import { productMatchesSearch } from "@/features/admin/products/utils/productFilters";
import type { AdminProductListRow } from "@/features/admin/types/products.types";

type UseAdminProductsFiltersResult = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedCategoryId: string | null;
  setSelectedCategoryId: (value: string | null) => void;
  filteredProducts: AdminProductListRow[];
  activeFiltersCount: number;
};

export function useAdminProductsFilters(
  products: AdminProductListRow[],
): UseAdminProductsFiltersResult {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = productMatchesSearch(product.name, searchQuery);
      const matchesCategory =
        selectedCategoryId === null ||
        product.category_id === selectedCategoryId;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategoryId]);

  const activeFiltersCount =
    (searchQuery.trim() ? 1 : 0) + (selectedCategoryId ? 1 : 0);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategoryId,
    setSelectedCategoryId,
    filteredProducts,
    activeFiltersCount,
  };
}
