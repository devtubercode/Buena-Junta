export function parsePriceToCents(price: string | null | undefined) {
  if (!price) {
    return null;
  }

  const digits = price.replace(/\D/g, "");

  if (!digits) {
    return null;
  }

  return Number(digits) * 100;
}

export function formatCOP(cents: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
