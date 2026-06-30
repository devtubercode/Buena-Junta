import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAdminImageUpload } from "@/features/admin/shared/hooks/useAdminImageUpload";
import { useAdminSaveHandler } from "@/features/admin/shared/hooks/useAdminSaveHandler";
import { useAutoSlug } from "@/features/admin/shared/hooks/useAutoSlug";
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
  normalizeAdminString,
  normalizeSlug,
  parsePrice,
  priceToInputValue,
  tagsToText,
  textToTags,
} from "@/features/admin/shared/utils/adminForms";
import {
  productSchema,
  type ProductFormData,
} from "@/features/admin/schemas/productSchema";
import type { CategoryRow } from "@/features/admin/types/categories.types";
import type {
  ProductInput,
  ProductRow,
} from "@/features/admin/types/products.types";

const defaultProductValues: ProductFormData = {
  category_id: "",
  slug: "",
  name: "",
  description: "",
  price: "",
  is_available: true,
  tags: "",
};

function toProductForm(product: ProductRow): ProductFormData {
  return {
    category_id: product.category_id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: priceToInputValue(product.price),
    is_available: product.is_available,
    tags: tagsToText(product.tags),
  };
}

type UseProductBaseFormOptions = {
  selected: ProductRow | null;
  isNewProduct: boolean;
  categories: CategoryRow[];
  onSaved: (savedProduct: ProductRow) => void;
};

export function useProductBaseForm({
  selected,
  isNewProduct,
  categories,
  onSaved,
}: UseProductBaseFormOptions) {
  const productForm = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultProductValues,
  });

  const {
    register: registerProduct,
    handleSubmit: handleSubmitProduct,
    reset: resetProduct,
    setValue: setProductValue,
    control: productControl,
  } = productForm;

  const watchedProductName = useWatch({
    control: productControl,
    name: "name",
  });
  const watchedProductIsAvailable = useWatch({
    control: productControl,
    name: "is_available",
  });

  useEffect(() => {
    if (selected) {
      resetProduct(toProductForm(selected));
    }
  }, [selected, resetProduct]);

  useEffect(() => {
    if (selected || !isNewProduct) {
      return;
    }

    resetProduct({
      ...defaultProductValues,
      category_id: categories[0]?.id ?? "",
    });
  }, [selected, isNewProduct, categories, resetProduct]);

  useAutoSlug({
    form: productForm,
    source: "name",
    target: "slug",
    isNew: isNewProduct,
  });

  const {
    imageFile,
    imagePreviewUrl,
    shouldRemoveImage,
    setSelectedImageFile,
    removeImage,
    resetImageState,
  } = useAdminImageUpload();

  const { isSaving, execute: executeProductSave } =
    useAdminSaveHandler<ProductRow>({
      successMessage: "Producto guardado.",
      onSuccess: (savedProduct) => {
        resetImageState();
        onSaved(savedProduct);
      },
    });

  const onSubmitProduct = async (data: ProductFormData) => {
    await executeProductSave(async () => {
      let image_path: string | null = selected?.image_path ?? null;

      if (imageFile) {
        image_path = await uploadStorageImage(
          imageFile,
          SUPABASE_BUCKETS.PRODUCT_IMAGES,
          SUPABASE_STORAGE_PATHS.PRODUCTS,
        );
      }

      const savedProduct = await saveProduct(
        {
          category_id: data.category_id,
          slug: normalizeSlug(data.slug),
          name: normalizeAdminString(data.name),
          description: normalizeAdminString(data.description),
          price: parsePrice(data.price),
          image_path: shouldRemoveImage ? null : image_path,
          is_available: data.is_available,
          tags: textToTags(data.tags),
        } satisfies ProductInput,
        selected?.id,
      );

      if ((imageFile || shouldRemoveImage) && selected?.image_path) {
        await removeStorageImage(
          selected.image_path,
          SUPABASE_BUCKETS.PRODUCT_IMAGES,
        );
      }

      return savedProduct;
    });
  };

  return {
    productForm,
    registerProduct,
    handleSubmitProduct,
    setProductValue,
    watchedProductName,
    watchedProductIsAvailable,
    isSaving,
    onSubmitProduct,
    imageFile,
    imagePreviewUrl,
    shouldRemoveImage,
    setSelectedImageFile,
    removeImage,
    resetImageState,
  };
}
