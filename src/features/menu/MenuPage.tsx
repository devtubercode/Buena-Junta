import { useMemo, useState } from "react";
import type {
  CartAdditionOption,
  CartVariantOption,
} from "@/features/cart/types/cart.types";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { useMenuData } from "@/features/menu/hooks/useMenuData";
import { useMenuFilterStore } from "@/features/menu/store/useMenuFilterStore";
import { type MenuProduct } from "@/features/menu/types/menu.types";
import { searchMenuProducts } from "@/features/menu/utils/searchMenuProducts";
import { buildCartProductName } from "@/features/menu/utils/productCopy";
import { EmptyState } from "@/shared/components/EmptyState";
import { SearchInput } from "@/shared/components/SearchInput";
import { CategoryChips } from "@/shared/components/menu/CategoryChips";
import { ProductGrid } from "@/shared/components/menu/ProductGrid";
import { CategoryChipsSkeleton } from "@/shared/components/menu/skeletons/CategoryChipsSkeleton";
import { ProductGridSkeleton } from "@/shared/components/menu/skeletons/ProductGridSkeleton";

export function MenuPage() {
  const addItem = useCartStore((state) => state.addItem);
  const activeCategorySlug = useMenuFilterStore(
    (state) => state.selectedCategorySlug,
  );
  const setActiveCategorySlug = useMenuFilterStore(
    (state) => state.setSelectedCategorySlug,
  );
  const [query, setQuery] = useState("");
  const { categories, products, isLoading, error } = useMenuData();
  const filteredProducts = useMemo(() => {
    const hasQuery = query.trim().length > 0;

    return searchMenuProducts(
      products,
      query,
      hasQuery ? undefined : (activeCategorySlug ?? undefined),
    );
  }, [activeCategorySlug, products, query]);

  const handleAddProduct = (
    product: MenuProduct,
    input: {
      variantKey?: string;
      label?: string;
      displayName?: string;
      price: number;
      image?: {
        src: string;
        alt: string;
      };
      variantOptions?: CartVariantOption[];
      additionOptions?: CartAdditionOption[];
    },
  ) => {
    if (!product.is_available) {
      return;
    }

    addItem({
      productId: product.id,
      image: input.image,
      variantKey: input.variantKey,
      baseName: product.name,
      displayName:
        input.displayName ?? buildCartProductName(product, input.label),
      name: input.displayName ?? buildCartProductName(product, input.label),
      unitPrice: input.price,
      variantOptions: input.variantOptions,
      additionOptions: input.additionOptions,
    });
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

      <div className="sticky top-22 z-10 -mx-4 border-b border-border bg-background/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
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

      <section className="mt-5" aria-label="Productos del menú">
        {isLoading ? (
          <ProductGridSkeleton count={5} />
        ) : error ? (
          <EmptyState
            title="No pudimos cargar el menú"
            description="Revisa la conexión e intenta nuevamente."
          />
        ) : (
          <ProductGrid
            products={filteredProducts}
            onAddProduct={handleAddProduct}
            emptyTitle="No encontramos productos"
            emptyDescription="Prueba otra búsqueda o revisa una categoría diferente."
          />
        )}
      </section>
    </main>
  );
}
