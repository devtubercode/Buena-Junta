import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useImageUpload,
  type ImageUploadAction,
} from "@/features/admin/shared/hooks/useImageUpload";
import { useSaveHandler } from "@/features/admin/shared/hooks/useSaveHandler";

import { normalizeSlug } from "@/features/admin/shared/utils/adminForms";
import { savePromotion } from "@/features/admin/promotions/services/admin-promotions.service";
import {
  removeStorageImage,
  uploadStorageImage,
} from "@/shared/services/storage.service";
import {
  SUPABASE_BUCKETS,
  SUPABASE_STORAGE_PATHS,
} from "@/lib/supabase/constants";
import { createOptimizedImageFile } from "@/shared/utils/image-optimizer";
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

type UsePromotionFormOptions = {
  promotion: PromotionRow | null;
  onSuccessSaved: (savedPromotion: PromotionRow) => void;
};

const uploadOriginalBackup = async (
  imageFile: File,
  bucket: string,
  pathPrefix: string,
): Promise<void> => {
  try {
    await uploadStorageImage(imageFile, bucket, pathPrefix);
  } catch {
    // The original backup is optional; its failure should not block the save.
    console.warn("No se pudo guardar la copia original de la imagen.");
  }
};

const resolvePromotionImagePath = async (
  imageFile: File | null,
  imageAction: ImageUploadAction,
  currentImagePath: string | null,
): Promise<string | null> => {
  if (imageAction === "remove") return null;

  if (imageFile) {
    let fileToUpload: File;
    try {
      fileToUpload = await createOptimizedImageFile(imageFile, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.8,
      });
    } catch (error) {
      console.warn("No se pudo optimizar la imagen; se subirá el original.", error);
      fileToUpload = imageFile;
    }

    const uploaded = await uploadStorageImage(
      fileToUpload,
      SUPABASE_BUCKETS.PROMOTION_IMAGES,
      SUPABASE_STORAGE_PATHS.PROMOTIONS,
    );

    // Keep the original file as a backup under a separate path, accessible
    // only from the storage bucket itself (not exposed in the public UI).
    void uploadOriginalBackup(
      imageFile,
      SUPABASE_BUCKETS.PROMOTION_IMAGES,
      SUPABASE_STORAGE_PATHS.ORIGINAL_PROMOTIONS,
    );

    return uploaded;
  }

  return currentImagePath;
};

export const usePromotionForm = ({
  promotion,
  onSuccessSaved,
}: UsePromotionFormOptions) => {
  const form = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    defaultValues: defaultPromotionValues,
    values: promotion ? toPromotionForm(promotion) : defaultPromotionValues,
  });

  const {
    imageFile,
    imagePreviewUrl,
    imageAction,
    setSelectedImageFile,
    removeImage,
    resetImageState,
  } = useImageUpload();

  const savedHandler = useSaveHandler<PromotionRow>({
    successMessage: "Promoción guardada correctamente.",
    onSuccess: (savedPromotion) => {
      resetImageState();
      onSuccessSaved(savedPromotion);
    },
  });

  const toggleWeekday = (weekday: number) => {
    const currentWeekdays = form.getValues("active_weekdays");
    const nextWeekdays = currentWeekdays.includes(weekday)
      ? currentWeekdays.filter((value) => value !== weekday)
      : [...currentWeekdays, weekday];

    form.setValue("active_weekdays", nextWeekdays, { shouldValidate: true });
  };

  const onChangeField = (
    fieldName: keyof PromotionFormData,
    value: PromotionFormData[keyof PromotionFormData],
  ) => {
    form.setValue(fieldName, value, { shouldValidate: true });
  };

  const onSubmit = async (data: PromotionFormData) => {
    await savedHandler.execute(async () => {
      const imagePath = await resolvePromotionImagePath(
        imageFile,
        imageAction,
        promotion?.image_path ?? null,
      );

      const bodySave: PromotionInput = {
        category_id: data.category_id,
        product_id: data.product_id,
        slug: normalizeSlug(data.slug),
        title: data.title.trim(),
        description: data.description?.trim() || "",
        is_active: data.is_active,
        active_weekdays: data.active_weekdays,
        starts_at: data.starts_at,
        ends_at: data.ends_at,
        image_path: imagePath,
        terms: data.terms?.trim() || "",
      };

      const savedPromotion = await savePromotion(bodySave, promotion?.id);

      if (
        ["replace", "remove"].includes(imageAction) &&
        promotion?.image_path
      ) {
        await removeStorageImage(
          promotion?.image_path ?? null,
          SUPABASE_BUCKETS.PROMOTION_IMAGES,
        );
      }

      return savedPromotion;
    });
  };

  return {
    form,
    isSaving: savedHandler.isSaving,
    imagePreviewUrl,
    imageAction,
    setSelectedImageFile,
    removeImage,
    resetImageState,
    toggleWeekday,
    onSubmit,
    onChangeField,
  };
};
