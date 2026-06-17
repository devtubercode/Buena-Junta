import type { CatalogProduct } from "@/features/menu/services/menuRepository";
import type { CartVariantOption } from "@/features/cart/types";
import { EmptyState } from "@/shared/components/EmptyState";
import { ProductCard } from "@/features/menu/components/ProductCard";

type ProductGridProps = {
  products: CatalogProduct[];
  onAddProduct: (
    product: CatalogProduct,
    input: {
      variantKey?: string;
      label?: string;
      displayName?: string;
      priceCents: number;
      variantOptions?: CartVariantOption[];
    },
  ) => void;
  emptyTitle?: string;
  emptyDescription?: string;
};

export function ProductGrid({
  products,
  onAddProduct,
  emptyTitle = "No hay productos para mostrar",
  emptyDescription = "Prueba con otra categoría o cambia la búsqueda.",
}: ProductGridProps) {
  if (products.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAdd={(input) => onAddProduct(product, input)}
        />
      ))}
    </div>
  );
}
