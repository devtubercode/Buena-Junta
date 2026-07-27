import type { MenuPriceVariant } from "@/features/menu/types/menu.types";

export type CalculatePriceInput = {
  basePrice: number | null;
  selectedVariant: MenuPriceVariant | null;
  variants: MenuPriceVariant[];
  additionsTotal: number;
};

export type CalculatedPrice = {
  unitPrice: number | null;
  additionsTotal: number;
  basePrice: number | null;
};

export function calculateUnitPrice(input: CalculatePriceInput): number | null {
  const { basePrice, additionsTotal } = input;

  if (basePrice === null) return null;

  return basePrice + additionsTotal;
}

export function calculateSubtotal(unitPrice: number | null, quantity: number): number | null {
  if (unitPrice === null) return null;

  return unitPrice * quantity;
}

export function calculateAdditionsTotal(
  additions: Array<{ unitPrice: number }>,
): number {
  return additions.reduce((total, a) => total + a.unitPrice, 0);
}

export function resolveBasePrice(
  variants: MenuPriceVariant[],
  fallbackPrice: number | null,
  variantId?: string,
): number | null {
  if (variants.length > 0) {
    const variant = variantId
      ? variants.find((v) => v.id === variantId)
      : variants[0];

    return variant?.price ?? null;
  }

  return fallbackPrice;
}
