import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useImageUpload,
  type ImageUploadAction,
} from "@/features/admin/shared/hooks/useImageUpload";
import { saveProduct } from "@/features/admin/products/services/admin-products.service";
import {
  removeStorageImage,
  uploadStorageImage,
} from "@/shared/services/storage.service";
import {
  SUPABASE_BUCKETS,
  SUPABASE_STORAGE_PATHS,
} from "@/lib/supabase/constants";
import {
  normalizeSlug,
  parsePrice,
  textToTags,
} from "@/features/admin/shared/utils/adminForms";
import { appRoutes } from "@/app/routes";
import { notify } from "@/shared/notifications/notify";
import {
  productSchema,
  type ProductFormData,
} from "@/features/admin/schemas/productSchema";

import type { ProductRow } from "@/features/admin/types/products.types";

const defaultProductValues: ProductFormData = {
  category_id: "",
  slug: "",
  name: "",
  description: "",
  price: "",
  is_available: true,
  tags: "",
};

const toProductForm = (product: ProductRow): ProductFormData => ({
  category_id: product.category_id,
  slug: product.slug,
  name: product.name,
  description: product.description,
  price:
    product.price !== null ? String(Math.round(Number(product.price))) : "",
  is_available: product.is_available,
  tags: product.tags?.join(", ") ?? "",
});

interface ImageResolution {
  imagePath: string | null;
  uploadedPath: string | null;
}

const resolveProductImagePath = async (
  imageFile: File | null,
  imageAction: ImageUploadAction,
  currentImagePath: string | null,
): Promise<ImageResolution> => {
  if (imageAction === "remove") return { imagePath: null, uploadedPath: null };

  if (imageFile) {
    const uploaded = await uploadStorageImage(
      imageFile,
      SUPABASE_BUCKETS.PRODUCT_IMAGES,
      SUPABASE_STORAGE_PATHS.PRODUCTS,
    );
    return { imagePath: uploaded, uploadedPath: uploaded };
  }

  return { imagePath: currentImagePath, uploadedPath: null };
};

type UseProductFormOptions = {
  selectedProduct: ProductRow | null;
};

const useProductForm = ({ selectedProduct }: UseProductFormOptions) => {
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultProductValues,
    values: selectedProduct
      ? toProductForm(selectedProduct)
      : defaultProductValues,
  });

  const watchedProductIsAvailable = useWatch({
    control: form.control,
    name: "is_available",
  });

  const {
    imageFile,
    imagePreviewUrl,
    imageAction,
    setSelectedImageFile,
    removeImage,
    resetImageState,
  } = useImageUpload();

  const onSubmitProduct = async (data: ProductFormData) => {
    setIsSaving(true);
    let currentUploadedImagePath: string | null = null;

    try {
      const { imagePath, uploadedPath } = await resolveProductImagePath(
        imageFile,
        imageAction,
        selectedProduct?.image_path ?? null,
      );

      currentUploadedImagePath = uploadedPath;

      const body = {
        category_id: data.category_id,
        slug: normalizeSlug(data.slug),
        name: data.name.trim(),
        description: data.description.trim(),
        price: parsePrice(data.price),
        image_path: imagePath,
        is_available: data.is_available,
        tags: textToTags(data.tags),
      };

      const savedProduct = await saveProduct(body, selectedProduct?.id);

      if (
        ["replace", "remove"].includes(imageAction) &&
        selectedProduct?.image_path
      ) {
        await removeStorageImage(
          selectedProduct?.image_path ?? null,
          SUPABASE_BUCKETS.PRODUCT_IMAGES,
        );
      }

      resetImageState();
      notify.success("Producto guardado correctamente.");
      navigate(`${appRoutes.adminProducts}/${savedProduct.slug}`, {
        replace: true,
      });
    } catch (error) {
      if (currentUploadedImagePath) {
        await removeStorageImage(
          currentUploadedImagePath,
          SUPABASE_BUCKETS.PRODUCT_IMAGES,
        );
      }
      notify.error(error instanceof Error ? error.message : String(error));
    } finally {
      setIsSaving(false);
    }
  };

  return {
    form,
    watchedProductIsAvailable,
    isSaving,
    onSubmitProduct,
    imagePreviewUrl,
    imageAction,
    setSelectedImageFile,
    removeImage,
  };
};

export default useProductForm;
