import { useMemo, useState } from "react";
import { SearchInput } from "@/shared/components/SearchInput";
import { CategoryChips } from "@/shared/components/menu/CategoryChips";
import { ProductGridSkeleton } from "@/shared/components/menu/skeletons/ProductGridSkeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { ProductCard } from "@/features/menu/components/ProductCard";
import { searchMenuProducts } from "@/features/menu/utils/searchMenuProducts";
import {
  hasPriceVariants,
  hasRequiredOptions,
} from "@/features/menu/utils/productHelpers";
import type {
  MenuCategory,
  MenuProduct,
} from "@/features/menu/types/menu.types";
import { Search } from "lucide-react";

type ProductsTabProps = {
  products: MenuProduct[];
  categories: MenuCategory[];
  isLoading: boolean;
  onOpenProductDetail: (product: MenuProduct) => void;
  onAddToOrder: (product: MenuProduct) => void;
  getQuantityInOrder?: (productId: string) => number;
};

export function ProductsTab({
  products,
  categories,
  isLoading,
  onOpenProductDetail,
  onAddToOrder,
  getQuantityInOrder,
}: ProductsTabProps) {
  const [query, setQuery] = useState("");
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<
    string | null
  >(null);

  const filteredProducts = useMemo(() => {
    const hasQuery = query.trim().length > 0;

    if (hasQuery) {
      return searchMenuProducts(products, query);
    }

    if (selectedCategorySlug) {
      return products.filter(
        (product) => product.category?.slug === selectedCategorySlug,
      );
    }

    return products;
  }, [products, query, selectedCategorySlug]);

  return (
    <section
      id="menu-tabpanel-products"
      role="tabpanel"
      aria-labelledby="menu-tab-products"
      className="grid gap-4"
    >
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Buscar hamburguesas, pizzas, bebidas..."
        label="Buscar productos"
      />

      <div className="sticky top-[72px] z-10 -mx-4 overflow-x-hidden bg-background/95 py-2 backdrop-blur sm:-mx-6 lg:-mx-8">
        <div className="px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="h-10 animate-pulse rounded-full bg-surface-muted sm:h-11" />
          ) : (
            <CategoryChips
              categories={categories}
              activeCategorySlug={selectedCategorySlug}
              onChange={setSelectedCategorySlug}
            />
          )}
        </div>
      </div>

      <section aria-label="Productos del menú">
        {isLoading ? (
          <ProductGridSkeleton count={6} />
        ) : filteredProducts.length > 0 ? (
          <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                quantityInOrder={getQuantityInOrder?.(product.id) ?? 0}
                onOpenDetail={() => onOpenProductDetail(product)}
                onAddOrCustomize={() => {
                  if (
                    hasPriceVariants(product) ||
                    hasRequiredOptions(product)
                  ) {
                    onOpenProductDetail(product);
                  } else {
                    onAddToOrder(product);
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No encontramos productos"
            description={
              query
                ? "Prueba con otra palabra o cambia la categoría seleccionada."
                : "No hay productos disponibles en esta categoría."
            }
            icon={<Search className="size-8" />}
          />
        )}
      </section>
    </section>
  );
}
