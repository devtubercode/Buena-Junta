import type {
  CartAdditionOption,
  CartVariantOption,
} from "@/features/cart/types/cart.types";
import type { MenuProduct } from "@/features/menu/types/menu.types";
import { EmptyState } from "@/shared/components/EmptyState";
import { ProductCard } from "@/shared/components/menu/ProductCard";

type ProductGridProps = {
  products: MenuProduct[];
  onAddProduct: (
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
    <div className="grid gap-3 lg:grid-cols-2">
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
