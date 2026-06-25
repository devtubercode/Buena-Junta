import { supabase } from "@/lib/supabase/client";
import { SUPABASE_TABLES } from "@/lib/supabase/constants";
import { throwIfSupabaseError as throwIfError } from "@/shared/errors/handle-supabase-error";
import type {
  AdminOptionGroupsData,
  OptionGroupInput,
  OptionGroupRow,
  OptionValueInput,
  OptionValueRow,
} from "@/features/admin/types/admin.types";

export async function fetchAdminOptionGroups(): Promise<AdminOptionGroupsData> {
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.OPTION_GROUPS)
    .select(
      `
        *,
        option_values(*)
      `,
    )
    .order("sort_order")
    .order("created_at", {
      foreignTable: SUPABASE_TABLES.OPTION_VALUES,
      ascending: true,
    });

  throwIfError(error);

  return {
    option_groups: (data ?? []) as OptionGroupRow[],
  };
}

export async function saveOptionGroup(input: OptionGroupInput, id?: string) {
  const result = id
    ? await supabase
        .from(SUPABASE_TABLES.OPTION_GROUPS)
        .update(input)
        .eq("id", id)
        .select()
        .single()
    : await supabase
        .from(SUPABASE_TABLES.OPTION_GROUPS)
        .insert(input)
        .select()
        .single();

  throwIfError(result.error);

  return result.data as unknown as OptionGroupRow;
}

export async function deleteOptionGroup(id: string) {
  const { error } = await supabase
    .from(SUPABASE_TABLES.OPTION_GROUPS)
    .delete()
    .eq("id", id);

  throwIfError(error);
}

export async function saveOptionValue(input: OptionValueInput, id?: string) {
  const result = id
    ? await supabase
        .from(SUPABASE_TABLES.OPTION_VALUES)
        .update(input)
        .eq("id", id)
        .select()
        .single()
    : await supabase
        .from(SUPABASE_TABLES.OPTION_VALUES)
        .insert(input)
        .select()
        .single();

  throwIfError(result.error);

  return result.data as unknown as OptionValueRow;
}

export async function deleteOptionValue(id: string) {
  const { error } = await supabase
    .from(SUPABASE_TABLES.OPTION_VALUES)
    .delete()
    .eq("id", id);

  throwIfError(error);
}
