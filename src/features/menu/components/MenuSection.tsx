import { useMemo, useState } from "react";
import { Link } from "react-router";
import { appRoutes } from "@/app/routes";
import type { CartVariantOption } from "@/features/cart/types";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { contactInfo, importantTexts } from "@/features/menu/data/menu";
import { CategoryChips } from "@/features/menu/components/CategoryChips";
import { ProductGrid } from "@/features/menu/components/ProductGrid";
import {
  getAvailableProducts,
  getCategories,
  type CatalogProduct,
} from "@/features/menu/services/menuRepository";
import { buildCartProductName } from "@/features/menu/utils/productCopy";

export function MenuSection() {
  const addItem = useCartStore((state) => state.addItem);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const categories = useMemo(() => getCategories(), []);
  const products = useMemo(() => getAvailableProducts(), []);
  const filteredProducts = activeCategoryId
    ? products.filter((product) => product.categoryId === activeCategoryId)
    : products;

  const handleAddProduct = (
    product: CatalogProduct,
    input: {
      variantKey?: string;
      label?: string;
      displayName?: string;
      priceCents: number;
      variantOptions?: CartVariantOption[];
    },
  ) => {
    if (!product.isAvailable) {
      return;
    }

    addItem({
      productId: product.id,
      variantKey: input.variantKey,
      baseName: product.name,
      displayName: input.displayName ?? buildCartProductName(product, input.label),
      name: input.displayName ?? buildCartProductName(product, input.label),
      unitPriceCents: input.priceCents,
      variantOptions: input.variantOptions,
    });
  };

  return (
    <section
      id="menu"
      className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 lg:px-8"
      aria-labelledby="menu-heading"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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

        <div className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
          <span className="font-bold text-foreground">Domicilios:</span>{" "}
          {contactInfo.deliveryPhones.join(" - ")}
        </div>
      </div>

      <div className="sticky top-[73px] z-10 -mx-4 mb-5 border-b border-border bg-background/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <CategoryChips
          categories={categories}
          activeCategoryId={activeCategoryId}
          onChange={setActiveCategoryId}
        />
      </div>

      <ProductGrid products={filteredProducts} onAddProduct={handleAddProduct} />

      <div className="mt-8 flex justify-center">
        <Link
          to={appRoutes.menu}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-primary bg-primary px-6 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Ver menú completo
        </Link>
      </div>

      <div className="mt-8 grid gap-3 rounded-lg border border-primary-border bg-primary-soft p-5 text-sm text-foreground sm:grid-cols-3">
        {importantTexts.map((text) => (
          <div key={text.id}>
            <p className="font-bold">{text.title}</p>
            {text.body ? <p className="mt-1 text-muted-foreground">{text.body}</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
