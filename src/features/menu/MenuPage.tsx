import { useMemo, useState } from "react";
import type {
  AddCartItemInput,
  CartItem,
} from "@/features/cart/types/cart.types";
import { useCartStore } from "@/store/cart/useCartStore";
import { ProductCustomizationModal } from "@/features/menu/components/ProductCustomizationModal";
import { useMenuData } from "@/features/menu/hooks/useMenuData";
import { useMenuFilterStore } from "@/store/menu-filter/useMenuFilterStore";
import { type MenuProduct } from "@/features/menu/types/menu.types";
import { searchMenuProducts } from "@/features/menu/utils/searchMenuProducts";
import { EmptyState } from "@/shared/components/EmptyState";
import { SearchInput } from "@/shared/components/SearchInput";
import { CategoryChips } from "@/shared/components/menu/CategoryChips";
import { CategoryChipsSkeleton } from "@/shared/components/menu/skeletons/CategoryChipsSkeleton";
import { ProductGridSkeleton } from "@/shared/components/menu/skeletons/ProductGridSkeleton";
import { notify } from "@/shared/notifications/notify";
import { ProductCustomizationForm } from "./components/ProductCustomizationForm";
import { ButtonSheetModal } from "../../shared/components/ButtonSheetModal";
import { ProductCard } from "@/shared/components/menu/ProductCard";

export function MenuPage() {
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const items = useCartStore((state) => state.items);

  const activeCategorySlug = useMenuFilterStore(
    (state) => state.selectedCategorySlug,
  );
  const setActiveCategorySlug = useMenuFilterStore(
    (state) => state.setSelectedCategorySlug,
  );
  const [query, setQuery] = useState("");
  const [customizingProduct, setCustomizingProduct] =
    useState<MenuProduct | null>(null);
  const [editingCartItem, setEditingCartItem] = useState<CartItem | undefined>(
    undefined,
  );

  const { categories, products, isLoading, error } = useMenuData();
  const filteredProducts = useMemo(() => {
    const hasQuery = query.trim().length > 0;

    return searchMenuProducts(
      products,
      query,
      hasQuery ? undefined : (activeCategorySlug ?? undefined),
    );
  }, [activeCategorySlug, products, query]);

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
    <main className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 lg:px-8 lg:py-8">
      <section className="mb-4 grid gap-3 md:grid-cols-[1fr_340px] md:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">
            Menú digital
          </p>
          <h1 className="mt-2 font-heading text-4xl font-black leading-none text-foreground">
            Pide rápido desde tu mesa
          </h1>
        </div>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Buscar hamburguesas, pizzas, bebidas..."
        />
      </section>

      <div className="sticky top-18 z-10 -mx-4 my-5 bg-background/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        {isLoading ? (
          <CategoryChipsSkeleton />
        ) : (
          <CategoryChips
            categories={categories}
            activeCategorySlug={activeCategorySlug}
            onChange={setActiveCategorySlug}
          />
        )}
      </div>

      <section aria-label="Productos del menú">
        {isLoading ? (
          <ProductGridSkeleton count={5} />
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
            title="No pudimos cargar el menú"
            description="Revisa la conexión e intenta nuevamente."
          />
        )}
      </section>

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
    </main>
  );
}
