import { useCallback } from "react";
import { fetchAdminOptionGroups } from "@/features/admin/services/admin-option-groups.service";
import type { AdminOptionGroupsData } from "@/features/admin/types/admin.types";
import { useAdminResource } from "@/features/admin/hooks/useAdminResource";

const emptyOptionGroupsData: AdminOptionGroupsData = {
  option_groups: [],
};

export function useOptionGroupsData() {
  const fetchOptionGroups = useCallback(() => fetchAdminOptionGroups(), []);

  return useAdminResource(fetchOptionGroups, emptyOptionGroupsData);
}
