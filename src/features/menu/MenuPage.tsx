import { useMemo, useState } from "react";
import type { CartVariantOption } from "@/features/cart/types";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { CategoryChips } from "@/features/menu/components/CategoryChips";
import { ProductGrid } from "@/features/menu/components/ProductGrid";
import { useMenuFilterStore } from "@/features/menu/store/useMenuFilterStore";
import {
  getCategories,
  searchProducts,
  type CatalogProduct,
} from "@/features/menu/services/menuRepository";
import { buildCartProductName } from "@/features/menu/utils/productCopy";
import { SearchInput } from "@/shared/components/SearchInput";

export function MenuPage() {
  const addItem = useCartStore((state) => state.addItem);
  const activeCategoryId = useMenuFilterStore((state) => state.selectedCategoryId);
  const setActiveCategoryId = useMenuFilterStore((state) => state.setSelectedCategory);
  const [query, setQuery] = useState("");
  const categories = useMemo(() => getCategories(), []);
  const products = useMemo(() => {
    const hasQuery = query.trim().length > 0;

    return searchProducts(query, hasQuery ? undefined : activeCategoryId ?? undefined);
  }, [
    activeCategoryId,
    query,
  ]);

  const handleAddProduct = (
    product: CatalogProduct,
    input: {
      variantKey?: string;
      label?: string;
      displayName?: string;
      priceCents: number;
      image?: {
        src: string;
        alt: string;
      };
      variantOptions?: CartVariantOption[];
    },
  ) => {
    if (!product.isAvailable) {
      return;
    }

    addItem({
      productId: product.id,
      image: input.image,
      variantKey: input.variantKey,
      baseName: product.name,
      displayName: input.displayName ?? buildCartProductName(product, input.label),
      name: input.displayName ?? buildCartProductName(product, input.label),
      unitPriceCents: input.priceCents,
      variantOptions: input.variantOptions,
    });
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="grid gap-4 rounded-lg border border-primary-border bg-primary-soft p-5 sm:p-6">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">
          Menú digital
        </p>
        <div className="grid gap-3 md:grid-cols-[1fr_340px] md:items-end">
          <div>
            <h1 className="m-0 font-heading text-5xl font-black leading-none text-foreground">
              Pide rápido desde tu mesa
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
              Explora la carta completa, busca por nombre o descripción y agrega tus productos al
              carrito.
            </p>
          </div>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Buscar hamburguesas, pizzas, bebidas..."
          />
        </div>
      </section>

      <div className="sticky top-[88px] z-10 -mx-4 mt-6 border-b border-border bg-background/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <CategoryChips
          categories={categories}
          activeCategoryId={activeCategoryId}
          onChange={setActiveCategoryId}
        />
      </div>

      <section className="mt-5" aria-label="Productos del menú">
        <ProductGrid
          products={products}
          onAddProduct={handleAddProduct}
          emptyTitle="No encontramos productos"
          emptyDescription="Prueba otra búsqueda o revisa una categoría diferente."
        />
      </section>
    </main>
  );
}
