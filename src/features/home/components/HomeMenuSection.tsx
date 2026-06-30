import { useMemo, useState } from "react";
import { Link } from "react-router";
import { appRoutes } from "@/app/routes";
import type {
  AddCartItemInput,
  CartItem,
} from "@/features/cart/types/cart.types";
import { useCartStore } from "@/store/cart/useCartStore";
import { ProductCustomizationModal } from "@/features/menu/components/ProductCustomizationModal";
import { useMenuFilterStore } from "@/store/menu-filter/useMenuFilterStore";
import { type MenuProduct } from "@/features/menu/types/menu.types";
import { CategoryChips } from "@/shared/components/menu/CategoryChips";
import { ProductGrid } from "@/shared/components/menu/ProductGrid";
import { CategoryChipsSkeleton } from "@/shared/components/menu/skeletons/CategoryChipsSkeleton";
import { ProductGridSkeleton } from "@/shared/components/menu/skeletons/ProductGridSkeleton";
import { useMenuData } from "@/features/menu/hooks/useMenuData";
import { notify } from "@/shared/notifications/notify";

export const HomeMenuSection = () => {
  const { categories, products, isLoading, error } = useMenuData();
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const items = useCartStore((state) => state.items);

  const { setSelectedCategorySlug, selectedCategorySlug } = useMenuFilterStore(
    (state) => state,
  );

  const [customizingProduct, setCustomizingProduct] =
    useState<MenuProduct | null>(null);
  const [editingCartItem, setEditingCartItem] = useState<CartItem | undefined>(
    undefined,
  );

  const filteredProducts = useMemo(() => {
    if (selectedCategorySlug) {
      return products.filter(
        (product: MenuProduct) =>
          product.categories?.slug === selectedCategorySlug,
      );
    }
    return products;
  }, [selectedCategorySlug, products]);

  const simpleProductItemsByProductId = useMemo(() => {
    const map = new Map<string, CartItem>();

    for (const item of items) {
      if (!map.has(item.productId)) {
        map.set(item.productId, item);
      }
    }

    return map;
  }, [items]);

  const getQuantityInCart = (productId: string) => {
    const item = simpleProductItemsByProductId.get(productId);
    return item?.quantity ?? 0;
  };

  const handleOpenCustomization = (product: MenuProduct, item?: CartItem) => {
    setEditingCartItem(item);
    setCustomizingProduct(product);
  };

  const handleCloseCustomization = () => {
    setCustomizingProduct(null);
    setEditingCartItem(undefined);
  };

  const handleAddCustomized = (input: AddCartItemInput) => {
    if (editingCartItem) {
      removeItem(editingCartItem.lineId);
    }

    addItem(input);
    handleCloseCustomization();

    notify.whatsapp(
      editingCartItem
        ? `Actualizaste ${input.name} en el carrito.`
        : `Agregaste ${input.name} al carrito.`,
    );
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

  if (error) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-sm font-medium text-error">
          Error al cargar el menú.
        </p>
      </div>
    );
  }

  return (
    <section className="grid gap-6">
      <div className="flex items-center justify-between gap-4 px-4">
        <h2 className="font-heading text-2xl font-black text-foreground">
          Menú
        </h2>
        <Link
          to={appRoutes.menu}
          className="text-sm font-black text-primary hover:underline"
        >
          Ver todo
        </Link>
      </div>

      {isLoading ? (
        <CategoryChipsSkeleton />
      ) : (
        <CategoryChips
          categories={categories}
          activeCategorySlug={selectedCategorySlug}
          onChange={setSelectedCategorySlug}
        />
      )}

      {isLoading ? (
        <ProductGridSkeleton />
      ) : (
        <ProductGrid
          products={filteredProducts}
          getQuantityInCart={getQuantityInCart}
          onOpenCustomization={handleOpenCustomization}
          onQuickAdd={handleQuickAdd}
        />
      )}

      {customizingProduct ? (
        <ProductCustomizationModal
          product={customizingProduct}
          initialCartItem={editingCartItem}
          isOpen
          onClose={handleCloseCustomization}
          onAdd={handleAddCustomized}
        />
      ) : null}
    </section>
  );
};
