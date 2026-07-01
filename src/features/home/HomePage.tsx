import { Link } from "react-router";
import { useMemo, useState } from "react";
import { PromotionsCarousel } from "@/features/home/components/PromotionsCarousel";
import { useMenuData } from "../menu/hooks/useMenuData";
import { useCartStore } from "@/store/cart/useCartStore";
import { useMenuFilterStore } from "@/store/menu-filter/useMenuFilterStore";
import type { AddCartItemInput, CartItem } from "../cart/types/cart.types";
import type { MenuProduct } from "../menu/types/menu.types";
import { notify } from "@/shared/notifications/notify";
import { CategoryChipsSkeleton } from "@/shared/components/menu/skeletons/CategoryChipsSkeleton";
import { CategoryChips } from "@/shared/components/menu/CategoryChips";
import { ProductGridSkeleton } from "@/shared/components/menu/skeletons/ProductGridSkeleton";
import { appRoutes } from "@/app/routes";
import { ProductCustomizationModal } from "../menu/components/ProductCustomizationModal";
import { ButtonSheetModal } from "@/shared/components/ButtonSheetModal";
import { ProductCustomizationForm } from "../menu/components/ProductCustomizationForm";
import { EmptyState } from "@/shared/components/EmptyState";
import { ProductCard } from "@/shared/components/menu/ProductCard";

export const HomePage = () => {
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

  return (
    <main id="inicio">
      <section className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-5 pt-0 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        <PromotionsCarousel />
      </section>

      <section
        id="menu"
        className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 lg:px-8"
        aria-labelledby="menu-heading"
      >
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-primary">
            Carta BuenaJunta
          </p>
          <h2
            id="menu-heading"
            className="m-0 font-heading text-4xl font-black leading-none tracking-normal text-foreground"
          >
            Lo más pedido
          </h2>
        </div>

        <div className="sticky top-16 z-10 -mx-4 my-5  bg-background/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {isLoading ? (
            <CategoryChipsSkeleton />
          ) : (
            <CategoryChips
              categories={categories}
              activeCategorySlug={selectedCategorySlug}
              onChange={setSelectedCategorySlug}
            />
          )}
        </div>

        <section aria-label="Productos del menú">
          {isLoading ? (
            <ProductGridSkeleton />
          ) : filteredProducts.length > 0 && !error ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantityInCart={getQuantityInCart?.(product.id)}
                  onQuickAdd={() => handleQuickAdd(product)}
                  onOpenCustomization={() => handleOpenCustomization(product)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No hay productos para mostrar"
              description="Prueba con otra categoría o cambia la búsqueda."
            />
          )}
        </section>

        <div className="mt-8 flex justify-center">
          <Link
            to={appRoutes.menu}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-primary bg-primary px-6 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Ver menú completo
          </Link>
        </div>

        {customizingProduct ? (
          <>
            <div className="hidden sm:block">
              <ProductCustomizationModal
                product={customizingProduct}
                initialCartItem={editingCartItem}
                isOpen={Boolean(customizingProduct)}
                onClose={handleCloseCustomization}
                onAdd={handleAddCustomized}
              />
            </div>
            <div className="sm:hidden">
              <ButtonSheetModal
                isOpen={Boolean(customizingProduct)}
                title=""
                description=""
                contentClassName="max-w-lg p-0 sm:p-1"
                onClose={handleCloseCustomization}
              >
                <div className="p-3">
                  <ProductCustomizationForm
                    product={customizingProduct}
                    initialCartItem={editingCartItem}
                    submitLabel={
                      editingCartItem ? "Guardar cambios" : "Agregar al carrito"
                    }
                    onSubmit={handleAddCustomized}
                    onClose={handleCloseCustomization}
                  />
                </div>
              </ButtonSheetModal>
            </div>
          </>
        ) : null}
      </section>
    </main>
  );
};
