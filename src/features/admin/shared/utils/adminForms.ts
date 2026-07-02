export function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parsePrice(value: string) {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return null;
  }

  return Math.max(0, Math.round(Number(normalizedValue) || 0));
}

export function textToTags(value: string) {
  const tags = value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return tags.length > 0 ? tags : null;
}

export const toDatetimeLocal = (value: string | null) => {
  if (!value) return "";

  return value.slice(0, 16);
};
