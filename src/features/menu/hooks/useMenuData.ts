import { useEffect, useState } from "react";
import { fetchCategories } from "@/shared/services/category.service";
import {
  fetchProductAvailableAdditions,
  fetchProducts,
} from "@/shared/services/product.service";
import { SUPABASE_BUCKETS } from "@/lib/supabase/constants";
import { getStorageImageUrl } from "@/shared/services/storage.service";
import { mapCatalogProduct } from "@/features/menu/mappers/menu-catalog.mapper";

import type {
  MenuCategory,
  MenuProduct,
} from "@/features/menu/types/menu.types";

export function useMenuData() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [products, setProducts] = useState<MenuProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const onLoadData = async () => {
      const [categoriesResult, productsResult, additionsResult] =
        await Promise.allSettled([
          fetchCategories(),
          fetchProducts(),
          fetchProductAvailableAdditions(),
        ]);

      const availableAdditions =
        additionsResult.status === "fulfilled" ? additionsResult.value : [];

      if (!isMounted) return;

      const failedParts: string[] = [];

      if (categoriesResult.status === "fulfilled") {
        setCategories(categoriesResult.value);
      } else {
        failedParts.push("categorías");
        console.error(
          "Could not load menu categories from Supabase.",
          categoriesResult.reason,
        );
      }

      if (productsResult.status === "fulfilled") {
        setProducts(
          productsResult.value.map((product) =>
            mapCatalogProduct(product, (storagePath) =>
              getStorageImageUrl(storagePath, SUPABASE_BUCKETS.MENU_IMAGES),
              availableAdditions,
            ),
          ),
        );
      } else {
        failedParts.push("productos");
        console.error(
          "Could not load menu products from Supabase.",
          productsResult.reason,
        );
      }

      if (additionsResult.status === "rejected") {
        failedParts.push("adiciones");
        console.error(
          "Could not load product additions from Supabase.",
          additionsResult.reason,
        );
      }

      if (failedParts.length === 3) {
        setError(new Error("No pudimos cargar categorías, productos ni adiciones."));
      } else {
        setError(null);
      }

      setIsLoading(false);
    };

    void onLoadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    categories,
    products,
    isLoading,
    error,
  };
}
