import { useState } from "react";
import { Link } from "react-router";
import { notify } from "@/shared/notifications/notify";
import { useCartStore } from "@/store/cart/useCartStore";
import { PromotionDetailModal } from "@/features/home/components/PromotionDetailModal";
import type { Promotion } from "@/features/home/types/promotion.types";
import { PromotionsCarousel } from "@/features/home/components/PromotionsCarousel";
import { useProductCatalog } from "@/shared/hooks/useProductCatalog";
import { CategoryChipsSkeleton } from "@/shared/components/menu/skeletons/CategoryChipsSkeleton";
import { CategoryChips } from "@/shared/components/menu/CategoryChips";
import { ProductGridSkeleton } from "@/shared/components/menu/skeletons/ProductGridSkeleton";
import { appRoutes } from "@/app/routes";
import { ButtonSheetModal } from "@/shared/components/ButtonSheetModal";
import { ProductCustomizationForm } from "@/shared/components/product/ProductCustomizationForm";
import { EmptyState } from "@/shared/components/EmptyState";
import { ProductCard } from "@/shared/components/menu/ProductCard";
import { CustomModal } from "@/shared/components/CustomModal";
import { useCatalogData } from "@/shared/hooks/useCatalogData";

export const HomePage = () => {
  const { categories, products, isLoading, error } = useCatalogData();
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null,
  );

  const {
    filteredProducts,
    selectedCategorySlug,
    setSelectedCategorySlug,
    customizingProduct,
    getQuantityInCart,
    handleOpenCustomization,
    handleCloseCustomization,
    handleAddCustomized,
  } = useProductCatalog({ products: products });

  const handleAddPromotionToCart = (promotion: Promotion) => {
    useCartStore.getState().addItem({
      productId: `promo-${promotion.slug}`,
      name: promotion.title,
      unitPrice: promotion.promotionPrice,
      quantity: 1,
      baseName: promotion.title,
      displayName: promotion.title,
    });
    notify.whatsapp(`Agregaste ${promotion.title} al carrito.`);
    setSelectedPromotion(null);
  };

  return (
    <main id="inicio">
      <section className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-5 pt-0 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        <PromotionsCarousel onOpenDetail={setSelectedPromotion} />
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

        <div className="sticky top-17.5 z-10 -mx-4 my-5  bg-background/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
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
                  onOpenDetail={() => handleOpenCustomization(product)}
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
              <CustomModal
                isOpen={Boolean(customizingProduct)}
                contentClassName="max-w-lg p-0 sm:p-1"
                onClose={handleCloseCustomization}
              >
                <div className="p-3 sm:p-4">
                  <ProductCustomizationForm
                    product={customizingProduct}
                    onSubmit={handleAddCustomized}
                    onClose={handleCloseCustomization}
                  />
                </div>
              </CustomModal>
            </div>
            <div className="sm:hidden">
              <ButtonSheetModal
                isOpen={Boolean(customizingProduct)}
                title=""
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

        {selectedPromotion ? (
          <PromotionDetailModal
            promotion={selectedPromotion}
            isOpen={Boolean(selectedPromotion)}
            onClose={() => setSelectedPromotion(null)}
            onAddToCart={() => handleAddPromotionToCart(selectedPromotion)}
          />
        ) : null}
      </section>
    </main>
  );
};
