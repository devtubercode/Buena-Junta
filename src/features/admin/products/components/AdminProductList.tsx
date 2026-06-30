import { AdminProductCard } from "./AdminProductCard";
import type { AdminProductListRow } from "@/features/admin/types/products.types";

type AdminProductListProps = {
  products: AdminProductListRow[];
  onDelete: (product: AdminProductListRow) => void;
};

export function AdminProductList({
  products,
  onDelete,
}: AdminProductListProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
      {products.map((product) => (
        <AdminProductCard
          key={product.id}
          product={product}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
