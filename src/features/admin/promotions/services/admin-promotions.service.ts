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

export const fetchAdminPromotionsList = async (): Promise<
  AdminPromotionListRow[]
> => {
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.PROMOTIONS)
    .select(
      `
        *,
        category:categories(id, name),
        product:products(id, name)
      `,
    )
    .order("title");

  throwIfError(error);

  return (data ?? []) as unknown as AdminPromotionListRow[];
};

export const fetchAdminPromotionDetail = async (
  promotionSlug?: string,
): Promise<AdminPromotionDetailData> => {
  const [categories, products, promotionResult] = await Promise.all([
    supabase.from(SUPABASE_TABLES.CATEGORIES).select("*").order("name"),
    supabase.from(SUPABASE_TABLES.PRODUCTS).select("*").order("name"),
    promotionSlug
      ? supabase
          .from(SUPABASE_TABLES.PROMOTIONS)
          .select("*")
          .eq("slug", promotionSlug)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  throwIfError(categories.error);
  throwIfError(products.error);
  throwIfError(promotionResult.error);

  return {
    categories: (categories.data ?? []) as CategoryRow[],
    products: (products.data ?? []) as unknown as ProductRow[],
    promotion: promotionResult.data as unknown as PromotionRow | null,
  };
};

export const savePromotion = async (
  input: PromotionInput,
  promotionId?: string,
): Promise<PromotionRow> => {
  const result = promotionId
    ? await supabase
        .from(SUPABASE_TABLES.PROMOTIONS)
        .update(input)
        .eq("id", promotionId)
        .select()
        .single()
    : await supabase
        .from(SUPABASE_TABLES.PROMOTIONS)
        .insert(input)
        .select()
        .single();

  throwIfError(result.error);

  return result.data as unknown as PromotionRow;
};

export const deletePromotion = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from(SUPABASE_TABLES.PROMOTIONS)
    .delete()
    .eq("id", id);

  throwIfError(error);
};
