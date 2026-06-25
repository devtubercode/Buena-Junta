import { AppModal } from "@/shared/components/AppModal";
import { ProductCustomizationForm } from "@/features/menu/components/ProductCustomizationForm";
import type { MenuProduct } from "@/features/menu/types/menu.types";
import type { CartItem, AddCartItemInput } from "@/features/cart/types/cart.types";

type ProductCustomizationModalProps = {
  product: MenuProduct;
  initialCartItem?: CartItem;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (input: AddCartItemInput) => void;
};

export function ProductCustomizationModal({
  product,
  initialCartItem,
  isOpen,
  onClose,
  onAdd,
}: ProductCustomizationModalProps) {
  return (
    <AppModal
      isOpen={isOpen}
      title=""
      description=""
      contentClassName="max-w-lg p-0 sm:p-1"
      onClose={onClose}
    >
      <div className="p-3 sm:p-4">
        <ProductCustomizationForm
          product={product}
          initialCartItem={initialCartItem}
          submitLabel={initialCartItem ? "Guardar cambios" : "Agregar al carrito"}
          onSubmit={onAdd}
          onClose={onClose}
        />
      </div>
    </AppModal>
  );
}
