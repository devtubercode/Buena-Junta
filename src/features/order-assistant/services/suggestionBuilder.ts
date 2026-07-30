function normalizeAdditionKeys(
  additionOptions: Array<{ key: string }>,
): string {
  return [...additionOptions]
    .map((o) => o.key)
    .sort()
    .join("|");
}

function normalizeSelectedOptions(
  selectedOptions: Record<string, string>,
): string {
  return Object.entries(selectedOptions)
    .map(([key, value]) => [
      key.trim().toLowerCase(),
      value.trim().toLowerCase(),
    ])
    .filter(([, value]) => value.length > 0)
    .sort(([a], [b]) => String(a).localeCompare(String(b)))
    .map(([key, value]) => `${key}=${value}`)
    .join("|");
}

export function buildLineId(
  productId: string,
  variantId: string | undefined,
  additionOptions: Array<{ key: string }>,
  selectedOptions: Record<string, string>,
): string {
  return [
    productId,
    variantId ?? "base",
    normalizeAdditionKeys(additionOptions),
    normalizeSelectedOptions(selectedOptions),
  ].join("::");
}
