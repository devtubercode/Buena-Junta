import { useMemo, useState } from "react";
import {
  getPromotionStatus,
  type PromotionStatusFilter,
} from "@/features/admin/promotions/utils/promotionFilters";
import type { AdminPromotionListRow } from "@/features/admin/types/promotions.types";

type UseAdminPromotionFiltersResult = {
  statusFilter: PromotionStatusFilter;
  setStatusFilter: (value: PromotionStatusFilter) => void;
  filteredPromotions: AdminPromotionListRow[];
  activeFiltersCount: number;
};

export function useAdminPromotionFilters(
  promotions: AdminPromotionListRow[],
): UseAdminPromotionFiltersResult {
  const [statusFilter, setStatusFilter] =
    useState<PromotionStatusFilter>("all");

  const filteredPromotions = useMemo(() => {
    if (statusFilter === "all") {
      return promotions;
    }

    return promotions.filter(
      (promotion) => getPromotionStatus(promotion) === statusFilter,
    );
  }, [promotions, statusFilter]);

  const activeFiltersCount = statusFilter !== "all" ? 1 : 0;

  return {
    statusFilter,
    setStatusFilter,
    filteredPromotions,
    activeFiltersCount,
  };
}
