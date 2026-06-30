import type { MenuProduct } from "@/features/menu/types/menu.types";
import { EmptyState } from "@/shared/components/EmptyState";
import { ProductCard } from "@/shared/components/menu/ProductCard";

type ProductGridProps = {
  products: MenuProduct[];
  getQuantityInCart?: (productId: string) => number;
  onQuickAdd: (product: MenuProduct) => void;
  onOpenCustomization: (product: MenuProduct) => void;
  emptyTitle?: string;
  emptyDescription?: string;
};

export function ProductGrid({
  products,
  getQuantityInCart,
  onQuickAdd,
  onOpenCustomization,
  emptyTitle = "No hay productos para mostrar",
  emptyDescription = "Prueba con otra categoría o cambia la búsqueda.",
}: ProductGridProps) {
  if (products.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          quantityInCart={getQuantityInCart?.(product.id)}
          onQuickAdd={() => onQuickAdd(product)}
          onOpenCustomization={() => onOpenCustomization(product)}
        />
      ))}
    </div>
  );
}
