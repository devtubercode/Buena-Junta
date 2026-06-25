import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ProductCustomizationForm } from "@/features/menu/components/ProductCustomizationForm";
import type { MenuProduct } from "@/features/menu/types/menu.types";
import type { AddCartItemInput, CartItem } from "@/features/cart/types/cart.types";

type ProductCustomizationSheetProps = {
  product: MenuProduct;
  initialCartItem?: CartItem;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (input: AddCartItemInput) => void;
};

export function ProductCustomizationSheet({
  product,
  initialCartItem,
  isOpen,
  onClose,
  onAdd,
}: ProductCustomizationSheetProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsVisible(true));
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-70 flex items-end justify-center bg-foreground/45 px-0 py-0 backdrop-blur-sm sm:hidden"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="customization-sheet-title"
        className={`w-full max-w-md rounded-t-2xl border border-border bg-surface shadow-elevated transition-transform duration-300 ease-out ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="relative flex items-center justify-center px-3 pb-2 pt-3">
          <div className="h-1.5 w-12 rounded-full bg-border" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-2 inline-flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Cerrar"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="sr-only" id="customization-sheet-title">
          Personalizar {product.name}
        </div>
        <div className="max-h-[80dvh] overflow-y-auto px-3 pb-3 pt-1">
          <ProductCustomizationForm
            product={product}
            initialCartItem={initialCartItem}
            submitLabel={initialCartItem ? "Guardar cambios" : "Agregar al carrito"}
            onSubmit={onAdd}
            onClose={onClose}
          />
        </div>
      </section>
    </div>
  );
}
