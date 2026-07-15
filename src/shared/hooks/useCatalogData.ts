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

export const useCatalogData = () => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [products, setProducts] = useState<MenuProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [categoriesData, productsData, additionsData] = await Promise.all(
          [
            fetchCategories(),
            fetchProducts(),
            fetchProductAvailableAdditions(),
          ],
        );

        if (!isMounted) return;

        setCategories(categoriesData);
        setProducts(
          productsData.map((product) =>
            mapCatalogProduct(
              product,
              (storagePath) =>
                getStorageImageUrl(storagePath, SUPABASE_BUCKETS.MENU_IMAGES),
              additionsData,
            ),
          ),
        );
        setError(null);
      } catch (err) {
        if (!isMounted) return;

        console.error("Could not load catalog data.", err);
        setError(
          err instanceof Error
            ? err
            : new Error("No pudimos cargar los datos del catálogo."),
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadData();

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
};
