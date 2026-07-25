import type { AdditionRow } from "@/features/admin/types/additions.types";
import { supabase } from "@/lib/supabase/client";
import { SUPABASE_VIEWS } from "@/lib/supabase/constants";
import { throwIfSupabaseError } from "@/shared/errors/handle-supabase-error";

export const fetchAdditions = async (): Promise<AdditionRow[]> => {
  const { data, error } = await supabase
    .from(SUPABASE_VIEWS.PUBLIC_GLOBAL_ADDITIONS)
    .select("*")
    .order("name");

  throwIfSupabaseError(error);

  return data as AdditionRow[];
};
