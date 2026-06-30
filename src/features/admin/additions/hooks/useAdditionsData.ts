import { fetchAdminAdditions } from "@/features/admin/additions/services/admin-additions.service";
import type { AdditionRow } from "@/features/admin/types/additions.types";
import { useAdminResource } from "@/features/admin/shared/hooks/useAdminResource";

export function useAdditionsData() {
  return useAdminResource<AdditionRow[]>(fetchAdminAdditions, []);
}
