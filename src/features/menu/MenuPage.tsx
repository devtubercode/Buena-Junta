import { useState } from "react";
import { useProductCatalog } from "@/shared/hooks/useProductCatalog";
import { EmptyState } from "@/shared/components/EmptyState";
import { SearchInput } from "@/shared/components/SearchInput";
import { CategoryChips } from "@/shared/components/menu/CategoryChips";
import { CategoryChipsSkeleton } from "@/shared/components/menu/skeletons/CategoryChipsSkeleton";
import { ProductGridSkeleton } from "@/shared/components/menu/skeletons/ProductGridSkeleton";
import { ProductCustomizationForm } from "./components/ProductCustomizationForm";
import { ButtonSheetModal } from "../../shared/components/ButtonSheetModal";
import { ProductCard } from "@/shared/components/menu/ProductCard";
import { CustomModal } from "@/shared/components/CustomModal";
import { useCatalogData } from "@/shared/hooks/useCatalogData";

export function MenuPage() {
  const [query, setQuery] = useState("");
  const { categories, products, isLoading, error } = useCatalogData();

  const {
    filteredProducts,
    selectedCategorySlug,
    setSelectedCategorySlug,
    customizingProduct,
    getQuantityInCart,
    handleOpenCustomization,
    handleCloseCustomization,
    handleAddCustomized,
    handleQuickAdd,
  } = useProductCatalog({ searchQuery: query, products });

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

      <div className="sticky top-17.5 z-10 -mx-4 my-5 bg-background/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
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
            <CustomModal
              isOpen={Boolean(customizingProduct)}
              title="Selecciona tus opciones"
              description="Personaliza tu pedido antes de agregarlo al carrito."
              contentClassName="max-w-lg p-0 sm:p-1"
              onClose={handleCloseCustomization}
            >
              <div className="p-3 sm:p-4">
                <ProductCustomizationForm
                  product={customizingProduct}
                  submitLabel="Agregar al carrito"
                  onSubmit={handleAddCustomized}
                  onClose={handleCloseCustomization}
                />
              </div>
            </CustomModal>
          </div>
          <div className="sm:hidden">
            <ButtonSheetModal
              isOpen={Boolean(customizingProduct)}
              title="Selecciona tus opciones"
              description="Personaliza tu pedido antes de agregarlo al carrito."
              contentClassName="max-w-lg p-0 sm:p-1"
              onClose={handleCloseCustomization}
            >
              <div className="p-3">
                <ProductCustomizationForm
                  product={customizingProduct}
                  submitLabel="Agregar al carrito"
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
