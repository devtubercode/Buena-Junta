import { supabase } from "@/lib/supabase/client";
import { SUPABASE_TABLES } from "@/lib/supabase/constants";
import { throwIfSupabaseError as throwIfError } from "@/shared/errors/handle-supabase-error";
import type { AdminDashboardData } from "@/features/admin/types/dashboard.types";

type CountableAdminTable = (typeof SUPABASE_TABLES)[keyof Pick<
  typeof SUPABASE_TABLES,
  "CATEGORIES" | "PRODUCTS" | "PROMOTIONS"
>];

async function countRows(table: CountableAdminTable) {
  const { count, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });

  throwIfError(error);

  return count ?? 0;
}

export async function fetchAdminDashboard(): Promise<AdminDashboardData> {
  const [productsCount, categoriesCount, promotionsCount] = await Promise.all([
    countRows(SUPABASE_TABLES.PRODUCTS),
    countRows(SUPABASE_TABLES.CATEGORIES),
    countRows(SUPABASE_TABLES.PROMOTIONS),
  ]);

  return {
    productsCount,
    categoriesCount,
    promotionsCount,
  };
}
