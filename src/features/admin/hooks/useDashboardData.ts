import { useCallback } from "react";
import { fetchAdminDashboard } from "@/features/admin/services/admin-dashboard.service";
import type { AdminDashboardData } from "@/features/admin/types/admin.types";
import { useAdminResource } from "@/features/admin/hooks/useAdminResource";

const emptyDashboard: AdminDashboardData = {
  productsCount: 0,
  categoriesCount: 0,
  promotionsCount: 0,
};

export function useDashboardData() {
  const fetchDashboard = useCallback(() => fetchAdminDashboard(), []);

  return useAdminResource(fetchDashboard, emptyDashboard);
}
