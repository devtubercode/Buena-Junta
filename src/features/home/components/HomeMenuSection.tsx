import { useMemo } from "react";
import { Link } from "react-router";
import { appRoutes } from "@/app/routes";
import type {
  CartAdditionOption,
  CartVariantOption,
} from "@/features/cart/types/cart.types";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { useMenuFilterStore } from "@/features/menu/store/useMenuFilterStore";
import { type MenuProduct } from "@/features/menu/types/menu.types";
import { buildCartProductName } from "@/features/menu/utils/productCopy";
import { CategoryChips } from "@/shared/components/menu/CategoryChips";
import { ProductGrid } from "@/shared/components/menu/ProductGrid";
import { CategoryChipsSkeleton } from "@/shared/components/menu/skeletons/CategoryChipsSkeleton";
import { ProductGridSkeleton } from "@/shared/components/menu/skeletons/ProductGridSkeleton";
import { useMenuData } from "@/features/menu/hooks/useMenuData";

export const HomeMenuSection = () => {
  const { categories, products, isLoading, error } = useMenuData();
  const addItem = useCartStore((state) => state.addItem);
  const { setSelectedCategorySlug, selectedCategorySlug } = useMenuFilterStore(
    (state) => state,
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

  const handleAddProduct = (
    product: MenuProduct,
    input: {
      variantKey?: string;
      label?: string;
      displayName?: string;
      price: number;
      variantOptions?: CartVariantOption[];
      additionOptions?: CartAdditionOption[];
      image?: {
        src: string;
        alt: string;
      };
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
    <section
      id="menu"
      className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 lg:px-8"
      aria-labelledby="menu-heading"
    >
      <div className="mb-6">
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

      <div className="sticky top-22 z-10 -mx-4 mb-5 border-b border-border bg-background/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
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

      {isLoading ? (
        <ProductGridSkeleton />
      ) : error ? null : (
        <ProductGrid
          products={filteredProducts}
          onAddProduct={handleAddProduct}
        />
      )}

      <div className="mt-8 flex justify-center">
        <Link
          to={appRoutes.menu}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-primary bg-primary px-6 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Ver menú completo
        </Link>
      </div>
    </section>
  );
};
