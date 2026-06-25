import { useCallback } from "react";
import { fetchAdminPromotionsList } from "@/features/admin/services/admin-promotions.service";
import type { AdminPromotionListRow } from "@/features/admin/types/admin.types";
import { useAdminResource } from "@/features/admin/hooks/useAdminResource";

export function usePromotionsData() {
  const fetchPromotions = useCallback(() => fetchAdminPromotionsList(), []);

  return useAdminResource<AdminPromotionListRow[]>(fetchPromotions, []);
}
