function lowerFirst(value: string) {
  return value.length > 0 ? `${value[0].toLocaleLowerCase("es-CO")}${value.slice(1)}` : value;
}

function formatPresentation(label: string) {
  return label
    .replace(/^Personal\b/i, "personal")
    .replace(/^Pequeña\b/i, "pequeña")
    .replace(/^Pequena\b/i, "pequeña")
    .replace(/^Mediana\b/i, "mediana")
    .replace(/^Grande\b/i, "grande");
}

export function formatCartItemName(name: string) {
  const flavorMatch = name.match(
    /^(Jugos?|Jarra de jugos?) en (agua|leche)\s*\((Sabores?|Sabor):\s*([^)]+)\)$/i,
  );

  if (flavorMatch) {
    const [, productType, base, , flavor] = flavorMatch;
    const singularProduct =
      productType.toLocaleLowerCase("es-CO").startsWith("jarra") ? "Jarra de jugo" : "Jugo";

    return `${singularProduct} en ${base.toLocaleLowerCase("es-CO")} sabor a ${lowerFirst(flavor)}`;
  }

  const pizzaMatch = name.match(/^(.+)\s*\((Personal|Pequeña|Pequena|Mediana|Grande)\s*x\d+\)$/i);

  if (pizzaMatch) {
    const [, productName, presentation] = pizzaMatch;
    const baseName = productName.toLocaleLowerCase("es-CO").startsWith("pizza ")
      ? productName
      : `Pizza ${lowerFirst(productName)}`;

    return `${baseName} ${formatPresentation(presentation)}`;
  }

  return name.replace(/\((Sabores):/gi, "(Sabor:");
}
