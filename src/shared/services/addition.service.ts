import type { AdditionRow } from "@/features/admin/types/additions.types";
import { supabase } from "@/lib/supabase/client";
import { SUPABASE_TABLES } from "@/lib/supabase/constants";
import { throwIfSupabaseError } from "@/shared/errors/handle-supabase-error";

export const fetchAdditions = async (): Promise<AdditionRow[]> => {
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.ADDITIONS)
    .select("*")
    .is("product_id", null)
    .order("name");

  throwIfSupabaseError(error);

  return data as AdditionRow[];
};
