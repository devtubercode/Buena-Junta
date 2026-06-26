import { useCallback } from "react";
import { fetchAdminPromotionsList } from "@/features/admin/promotions/services/admin-promotions.service";
import type { AdminPromotionListRow } from "@/features/admin/types/promotions.types";
import { useAdminResource } from "@/features/admin/shared/hooks/useAdminResource";

export function usePromotionsData() {
  const fetchPromotions = useCallback(() => fetchAdminPromotionsList(), []);

  return useAdminResource<AdminPromotionListRow[]>(fetchPromotions, []);
}
