import type { MenuProduct } from "@/features/menu/types/menu.types";

export function buildCartProductName(product: MenuProduct, label?: string) {
  return label ? `${product.name} ${label}` : product.name;
}

export function getMissingSelectionMessage(product: MenuProduct) {
  if (product.price === null && product.priceOptions.length > 0) {
    return "Selecciona una presentación antes de agregar el producto.";
  }

  const firstRequiredGroup = product.option_groups.find(
    (group) => group.is_active && group.is_required,
  );

  if (firstRequiredGroup) {
    return `Selecciona ${firstRequiredGroup.name.toLocaleLowerCase("es-CO")} antes de agregar el producto.`;
  }

  return product.price === null
    ? "Este producto no tiene un precio configurado."
    : "Selecciona una opción antes de agregar el producto.";
}
