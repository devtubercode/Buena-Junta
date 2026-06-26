import { useCallback } from "react";
import { fetchAdminDashboard } from "@/features/admin/dashboard/services/admin-dashboard.service";
import type { AdminDashboardData } from "@/features/admin/types/dashboard.types";
import { useAdminResource } from "@/features/admin/shared/hooks/useAdminResource";

const emptyDashboard: AdminDashboardData = {
  productsCount: 0,
  categoriesCount: 0,
  promotionsCount: 0,
};

export function useDashboardData() {
  const fetchDashboard = useCallback(() => fetchAdminDashboard(), []);

  return useAdminResource(fetchDashboard, emptyDashboard);
}
