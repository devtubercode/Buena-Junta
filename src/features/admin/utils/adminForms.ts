export function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function priceToInputValue(price: number | string | null) {
  return price === null ? "" : String(Math.round(Number(price)));
}

export function inputValueToPrice(value: string) {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return null;
  }

  return Math.max(0, Math.round(Number(normalizedValue) || 0));
}

export function tagsToText(tags: string[] | null) {
  return tags?.join(", ") ?? "";
}

export function textToTags(value: string) {
  const tags = value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return tags.length > 0 ? tags : null;
}

export function toDatetimeLocal(value: string | null) {
  if (!value) {
    return "";
  }

  return value.slice(0, 16);
}

export function fromDatetimeLocal(value: string) {
  return value ? new Date(value).toISOString() : null;
}

export function normalizeAdminString(value: string) {
  return value.trim();
}

export function normalizeAdminNullableString(value: string | null) {
  return value?.trim() || null;
}

export function normalizeAdminPrice(value: string) {
  return Math.max(0, Math.round(Number(value) || 0));
}

export function normalizeAdminSortOrder(value: string | number) {
  return Math.max(0, Number(value) || 0);
}
