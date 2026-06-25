import { useCallback } from "react";
import { fetchAdminAdditions } from "@/features/admin/services/admin-additions.service";
import type { AdminAdditionsData } from "@/features/admin/types/admin.types";
import { useAdminResource } from "@/features/admin/hooks/useAdminResource";

const emptyAdditionsData: AdminAdditionsData = {
  additions: [],
};

export function useAdditionsData() {
  const fetchAdditions = useCallback(() => fetchAdminAdditions(), []);

  return useAdminResource(fetchAdditions, emptyAdditionsData);
}
