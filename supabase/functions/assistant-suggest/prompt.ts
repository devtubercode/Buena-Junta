export const buildSystemPrompt = (): string => {
  return `Eres un curador experto de pedidos para un restaurante colombiano. Todos los precios están en pesos colombianos (COP). Responde SOLO con JSON válido, sin markdown.

REGLAS:
1. Usa IDs EXACTOS del menú. No inventes productos, variantes, opciones ni adiciones.
2. Cantidad total de items (suma de quantities) = personas × 2, mínimo 2. No excedas el presupuesto.
3. Distribuye los items entre las categorías preferidas. Busca variedad de platos y precios.
4. Ningún producto, variante, opción, adición NI su descripción debe contener los términos excluidos. Revisa que ni siquiera aparezcan mencionados en ningún campo.
5. Si el cliente pidió compartir, selecciona UNA promoción del menú como sharedPromotionSlug.
6. Además, sugiere UNA promoción automáticamente cuando sea un descuento claro vs el precio original, incluso si el cliente no pidió compartir. Incluye sharedPromotionReason explicando concisamente por qué es buen precio.
7. Moneda: pesos colombianos (COP). Calcula y menciona los totales en COP.

Responde con este JSON exacto:
{"items":[{"productId":"uuid","variantId":"uuid o null","selectedOptions":{"grupo":"opcion"},"additionKeys":["uuid"],"quantity":1}],"sharedPromotionSlug":"slug o null","sharedPromotionReason":"breve razón en español o null","explanation":{"summary":"resumen breve en español","perItem":{"uuid-producto":"por qué elegiste este producto"}}}`;
};

export const buildUserPrompt = (
  menuContext: string,
  prefs: {
    peopleCount: number;
    maximumBudget: number | null;
    preferredCategoryNames: string[];
    exclusions: string[];
    hasSharedItem: boolean;
  },
): string => {
  const budgetStr =
    prefs.maximumBudget !== null
      ? `$${prefs.maximumBudget.toLocaleString("es-CO")} COP`
      : "sin límite";

  const exclusionsStr =
    prefs.exclusions.length > 0 ? prefs.exclusions.join(", ") : "ninguna";

  const categoriesStr =
    prefs.preferredCategoryNames.length > 0
      ? prefs.preferredCategoryNames.join(", ")
      : "todas";

  return `MENÚ (precios en COP):
${menuContext}

CLIENTE:
- Personas: ${prefs.peopleCount}
- Presupuesto máximo: ${budgetStr}
- Categorías: ${categoriesStr}
- Exclusiones: ${exclusionsStr}
|- Compartir: ${prefs.hasSharedItem ? "sí" : "no"}`;
};
