import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAdminImageUpload } from "@/features/admin/shared/hooks/useAdminImageUpload";
import { useAdminSaveHandler } from "@/features/admin/shared/hooks/useAdminSaveHandler";
import { useAutoSlug } from "@/features/admin/shared/hooks/useAutoSlug";
import {
  normalizeAdminNullableString,
  normalizeAdminString,
  normalizeSlug,
} from "@/features/admin/shared/utils/adminForms";
import { savePromotion } from "@/features/admin/promotions/services/admin-promotions.service";
import {
  removeStorageImage,
  uploadStorageImage,
} from "@/shared/services/storage.service";
import {
  SUPABASE_BUCKETS,
  SUPABASE_STORAGE_PATHS,
} from "@/lib/supabase/constants";
import {
  promotionSchema,
  type PromotionFormData,
} from "@/features/admin/schemas/promotionSchema";
import {
  defaultPromotionValues,
  toPromotionForm,
} from "@/features/admin/promotions/utils/promotionForms";
import type {
  PromotionInput,
  PromotionRow,
} from "@/features/admin/types/promotions.types";

type UseAdminPromotionFormOptions = {
  selected: PromotionRow | null;
  isNewPromotion: boolean;
  onSaved: (savedPromotion: PromotionRow) => Promise<void>;
};

type UseAdminPromotionFormResult = {
  form: ReturnType<typeof useForm<PromotionFormData>>;
  isSaving: boolean;
  imagePreviewUrl: string | null;
  shouldRemoveImage: boolean;
  setSelectedImageFile: (file: File | null) => void;
  removeImage: () => void;
  resetImageState: () => void;
  toggleWeekday: (weekday: number) => void;
  onSubmit: (data: PromotionFormData) => Promise<void>;
};

export function useAdminPromotionForm({
  selected,
  isNewPromotion,
  onSaved,
}: UseAdminPromotionFormOptions): UseAdminPromotionFormResult {
  const form = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    defaultValues: defaultPromotionValues,
  });

  const { reset, setValue, getValues } = form;

  useEffect(() => {
    if (selected) {
      reset(toPromotionForm(selected));
      return;
    }

    if (isNewPromotion) {
      reset(defaultPromotionValues);
    }
  }, [selected, isNewPromotion, reset]);

  useAutoSlug({
    form,
    source: "title",
    target: "slug",
    isNew: isNewPromotion,
  });

  const {
    imageFile,
    imagePreviewUrl,
    shouldRemoveImage,
    setSelectedImageFile,
    removeImage,
    resetImageState,
  } = useAdminImageUpload();

  const { isSaving, execute: executeSave } = useAdminSaveHandler<PromotionRow>({
    successMessage: "Promoción guardada.",
    onSuccess: async (savedPromotion) => {
      resetImageState();
      await onSaved(savedPromotion);
    },
  });

  const toggleWeekday = (weekday: number) => {
    const currentWeekdays = getValues("active_weekdays");
    const nextWeekdays = currentWeekdays.includes(weekday)
      ? currentWeekdays.filter((value) => value !== weekday)
      : [...currentWeekdays, weekday];

    setValue("active_weekdays", nextWeekdays, { shouldValidate: true });
  };

  const onSubmit = async (data: PromotionFormData) => {
    await executeSave(async () => {
      let image_path: string | null = selected?.image_path ?? null;

      if (imageFile) {
        image_path = await uploadStorageImage(
          imageFile,
          SUPABASE_BUCKETS.PROMOTION_IMAGES,
          SUPABASE_STORAGE_PATHS.PROMOTIONS,
        );
      }

      const savedPromotion = await savePromotion(
        {
          category_id: data.category_id,
          product_id: data.product_id,
          slug: normalizeSlug(data.slug),
          title: normalizeAdminString(data.title),
          description: normalizeAdminNullableString(data.description),
          is_active: data.is_active,
          active_weekdays: data.active_weekdays,
          starts_at: data.starts_at,
          ends_at: data.ends_at,
          image_path: shouldRemoveImage ? null : image_path,
          terms: normalizeAdminNullableString(data.terms),
        } satisfies PromotionInput,
        selected?.id,
      );

      if ((imageFile || shouldRemoveImage) && selected?.image_path) {
        await removeStorageImage(
          selected.image_path,
          SUPABASE_BUCKETS.PROMOTION_IMAGES,
        );
      }

      return savedPromotion;
    });
  };

  return {
    form,
    isSaving,
    imagePreviewUrl,
    shouldRemoveImage,
    setSelectedImageFile,
    removeImage,
    resetImageState,
    toggleWeekday,
    onSubmit,
  };
}
