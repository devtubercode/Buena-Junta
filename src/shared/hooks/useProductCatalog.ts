import { useMemo, useState } from "react";
import type { AddCartItemInput } from "@/features/cart/types/cart.types";
import { useCartStore } from "@/store/cart/useCartStore";
import { useMenuFilterStore } from "@/store/menu-filter/useMenuFilterStore";
import type { MenuProduct } from "@/features/menu/types/menu.types";

import { searchMenuProducts } from "@/features/menu/utils/searchMenuProducts";
import { notify } from "@/shared/notifications/notify";

interface UseProductCatalogOptions {
  searchQuery?: string;
  products?: MenuProduct[];
}

export const useProductCatalog = (options?: UseProductCatalogOptions) => {
  const { searchQuery = "", products = [] } = options ?? {};

  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);

  const selectedCategorySlug = useMenuFilterStore(
    (state) => state.selectedCategorySlug,
  );
  const setSelectedCategorySlug = useMenuFilterStore(
    (state) => state.setSelectedCategorySlug,
  );

  const [customizingProduct, setCustomizingProduct] =
    useState<MenuProduct | null>(null);

  const filteredProducts = useMemo(() => {
    const hasQuery = searchQuery.trim().length > 0;

    if (hasQuery) {
      return searchMenuProducts(products, searchQuery);
    }

    if (selectedCategorySlug) {
      return products.filter(
        (product) => product.categories?.slug === selectedCategorySlug,
      );
    }

    return products;
  }, [products, searchQuery, selectedCategorySlug]);

  const productQuantityByProductId = useMemo(() => {
    const map = new Map<string, number>();

    for (const item of items) {
      const currentQuantity = map.get(item.productId) ?? 0;
      map.set(item.productId, currentQuantity + item.quantity);
    }

    return map;
  }, [items]);

  const getQuantityInCart = (productId: string) => {
    return productQuantityByProductId.get(productId) ?? 0;
  };

  const handleOpenCustomization = (product: MenuProduct) => {
    setCustomizingProduct(product);
  };

  const handleCloseCustomization = () => {
    setCustomizingProduct(null);
  };

  const handleAddCustomized = (input: AddCartItemInput) => {
    addItem(input);
    notify.whatsapp(`Agregaste ${input.name} al carrito.`);
  };

  const handleQuickAdd = (product: MenuProduct) => {
    if (!product.is_available) {
      return;
    }

    addItem({
      productId: product.id,
      image: product.urlImage,
      baseName: product.name,
      displayName: product.name,
      name: product.name,
      unitPrice: product.price ?? 0,
      variantOptions: [],
      additionOptions: [],
    });

    notify.whatsapp(`Agregaste ${product.name} al carrito.`);
  };

  return {
    filteredProducts,
    selectedCategorySlug,
    setSelectedCategorySlug,
    customizingProduct,
    getQuantityInCart,
    handleOpenCustomization,
    handleCloseCustomization,
    handleAddCustomized,
    handleQuickAdd,
  };
};
