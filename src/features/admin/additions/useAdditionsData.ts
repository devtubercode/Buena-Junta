import { useCallback } from "react";
import { fetchAdminAdditions } from "@/features/admin/additions/services/admin-additions.service";
import type { AdditionRow } from "@/features/admin/types/additions.types";
import { useAdminResource } from "@/features/admin/shared/hooks/useAdminResource";

const emptyAdditions: AdditionRow[] = [];

export function useAdditionsData() {
  const fetchAdditions = useCallback(() => fetchAdminAdditions(), []);

  return useAdminResource<AdditionRow[]>(fetchAdditions, emptyAdditions);
}
