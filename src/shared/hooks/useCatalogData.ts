import { useEffect, useState } from "react";
import { fetchCategories } from "@/shared/services/category.service";
import { fetchAdditions } from "@/shared/services/addition.service";
import { fetchProducts } from "@/shared/services/product.service";

import { mapProducts } from "@/features/menu/mappers/menu-products.mapper";

import type {
  MenuCategory,
  MenuProduct,
} from "@/features/menu/types/menu.types";
import type { AdditionRow } from "@/features/admin/types/additions.types";

export const useCatalogData = () => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [products, setProducts] = useState<MenuProduct[]>([]);
  const [additions, setAdditions] = useState<AdditionRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [additionsError, setAdditionsError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);

      try {
        const [categoriesData, productsResult] = await Promise.all([
          fetchCategories(),
          fetchProducts(),
        ]);

        if (!isMounted) return;

        setCategories(categoriesData);
        setProducts(
          mapProducts({
            products: productsResult.products,
            groups: productsResult.optionGroups,
            availableAdditions: productsResult.availableAdditions,
          }),
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
      }

      try {
        const additionsData = await fetchAdditions();
        if (!isMounted) return;
        setAdditions(additionsData);
        setAdditionsError(null);
      } catch (err) {
        if (!isMounted) return;

        console.error("Could not load additions.", err);
        setAdditionsError(
          err instanceof Error
            ? err
            : new Error("No pudimos cargar los toppings."),
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
    additions,
    isLoading,
    error,
    additionsError,
  };
};
