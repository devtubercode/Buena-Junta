import type { CatalogProduct } from "@/features/menu/services/menuRepository";

type SelectedVariants = Record<string, string>;

const productNameOverrides: Record<string, string> = {
  "jugos-en-agua": "Jugo en agua",
  "jarra-jugo-en-agua": "Jarra de jugo en agua",
  "jugos-en-leche": "Jugo en leche",
  "jarra-jugos-en-leche": "Jarra de jugo en leche",
};

function lowerFirst(value: string) {
  return value.length > 0 ? `${value[0].toLocaleLowerCase("es-CO")}${value.slice(1)}` : value;
}

function getOrderBaseName(product: CatalogProduct) {
  if (productNameOverrides[product.id]) {
    return productNameOverrides[product.id];
  }

  if (product.categoryId === "pizzas") {
    return `Pizza ${lowerFirst(product.name)}`;
  }

  return product.name;
}

function normalizeVariantGroupName(groupName: string) {
  const normalizedName = groupName.trim().toLocaleLowerCase("es-CO");

  if (normalizedName === "sabores") {
    return "Sabor";
  }

  if (normalizedName === "opciones") {
    return "Opción";
  }

  return groupName.trim();
}

function formatPresentation(label: string) {
  return label
    .replace(/^Pequeña\b/i, "pequeña")
    .replace(/^Pequena\b/i, "pequeña")
    .replace(/^Mediana\b/i, "mediana")
    .replace(/^Grande\b/i, "grande")
    .replace(/^Personal\b/i, "personal");
}

function formatVariantForProductName(label: string) {
  const [rawGroupName, ...rawValueParts] = label.split(":");
  const value = rawValueParts.join(":").trim();
  const groupName = normalizeVariantGroupName(rawGroupName);

  if (!value) {
    return formatPresentation(label);
  }

  if (groupName.toLocaleLowerCase("es-CO") === "sabor") {
    return `sabor a ${lowerFirst(value)}`;
  }

  return `${lowerFirst(groupName)} ${lowerFirst(value)}`;
}

export function buildSelectedVariantLabel(selectedVariants: SelectedVariants) {
  return Object.entries(selectedVariants)
    .map(([groupName, value]) => `${normalizeVariantGroupName(groupName)}: ${value}`)
    .join(" / ");
}

export function buildCartProductName(product: CatalogProduct, label?: string) {
  const baseName = getOrderBaseName(product);

  if (!label) {
    return baseName;
  }

  return [baseName, ...label.split(" / ").map(formatVariantForProductName)].join(" ");
}

export function getVariantPrompt(product: CatalogProduct) {
  const firstVariantName = product.variants[0]?.name;

  if (product.priceOptions?.length) {
    return "Elige una presentación";
  }

  if (firstVariantName && normalizeVariantGroupName(firstVariantName) === "Sabor") {
    return "Elige un sabor";
  }

  return "Elige una opción";
}

export function getMissingSelectionMessage(product: CatalogProduct) {
  const firstVariantName = product.variants[0]?.name;

  if (!product.priceCents && product.priceOptions?.length) {
    return "Selecciona una presentación antes de agregar el producto.";
  }

  if (firstVariantName && normalizeVariantGroupName(firstVariantName) === "Sabor") {
    return "Selecciona un sabor antes de agregar el producto.";
  }

  return "Selecciona una opción antes de agregar el producto.";
}

export function getSelectedVariantSummary(product: CatalogProduct, selectedVariantLabel: string) {
  if (selectedVariantLabel) {
    return selectedVariantLabel;
  }

  return getVariantPrompt(product);
}
