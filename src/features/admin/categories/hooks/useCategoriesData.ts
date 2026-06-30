import { fetchAdminCategories } from "@/features/admin/categories/services/admin-categories.service";
import type { CategoryRow } from "@/features/admin/types/categories.types";
import { useAdminResource } from "@/features/admin/shared/hooks/useAdminResource";

export function useCategoriesData() {
  return useAdminResource<CategoryRow[]>(fetchAdminCategories, []);
}
