import { useCallback } from "react";
import { fetchAdminCategories } from "@/features/admin/services/admin-categories.service";
import type { CategoryRow } from "@/features/admin/types/admin.types";
import { useAdminResource } from "@/features/admin/hooks/useAdminResource";

export function useCategoriesData() {
  const fetchCategories = useCallback(() => fetchAdminCategories(), []);

  return useAdminResource<CategoryRow[]>(fetchCategories, []);
}
