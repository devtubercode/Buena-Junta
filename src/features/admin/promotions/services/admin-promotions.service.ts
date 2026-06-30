import { supabase } from "@/lib/supabase/client";
import { SUPABASE_TABLES } from "@/lib/supabase/constants";
import { throwIfSupabaseError as throwIfError } from "@/shared/errors/handle-supabase-error";
import type {
  AdminPromotionDetailData,
  AdminPromotionListRow,
  PromotionInput,
  PromotionRow,
} from "@/features/admin/types/promotions.types";
import type { CategoryRow } from "@/features/admin/types/categories.types";
import type { ProductRow } from "@/features/admin/types/products.types";

export async function fetchAdminPromotionsList(): Promise<
  AdminPromotionListRow[]
> {
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.PROMOTIONS)
    .select(
      `
        *,
        categories(id, name),
        products(id, name)
      `,
    )
    .order("title");

  throwIfError(error);

  return (data ?? []) as unknown as AdminPromotionListRow[];
}

export async function fetchAdminPromotionDetail(
  promotionId: string,
): Promise<AdminPromotionDetailData> {
  const [categories, products, promotionResult] = await Promise.all([
    supabase.from(SUPABASE_TABLES.CATEGORIES).select("*").order("name"),
    supabase.from(SUPABASE_TABLES.PRODUCTS).select("*").order("name"),
    supabase
      .from(SUPABASE_TABLES.PROMOTIONS)
      .select("*")
      .eq("id", promotionId)
      .maybeSingle(),
  ]);

  throwIfError(categories.error);
  throwIfError(products.error);
  throwIfError(promotionResult.error);

  return {
    categories: (categories.data ?? []) as CategoryRow[],
    products: (products.data ?? []) as unknown as ProductRow[],
    promotion: promotionResult.data as unknown as PromotionRow | null,
  };
}

export async function savePromotion(
  input: PromotionInput,
  id?: string,
): Promise<PromotionRow> {
  const result = id
    ? await supabase
        .from(SUPABASE_TABLES.PROMOTIONS)
        .update(input)
        .eq("id", id)
        .select()
        .single()
    : await supabase
        .from(SUPABASE_TABLES.PROMOTIONS)
        .insert(input)
        .select()
        .single();

  throwIfError(result.error);

  return result.data as unknown as PromotionRow;
}

export async function deletePromotion(id: string): Promise<void> {
  const { error } = await supabase
    .from(SUPABASE_TABLES.PROMOTIONS)
    .delete()
    .eq("id", id);

  throwIfError(error);
}
