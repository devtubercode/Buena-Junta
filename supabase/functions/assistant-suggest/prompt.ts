export const buildSystemPrompt = (): string => {
  return `Eres un curador experto de pedidos para un restaurante colombiano. Todos los precios están en pesos colombianos (COP). Responde SOLO con JSON válido, sin markdown.

REGLAS:
1. Usa IDs EXACTOS del menú. No inventes productos ni promociones.
2. Cantidad total de items (suma de quantities) = personas × 2, mínimo 2. No excedas el presupuesto.
3. Distribuye los items entre las categorías preferidas. Busca variedad de platos y precios.
4. Ningún producto ni su descripción debe contener los términos excluidos. Revisa que ni siquiera aparezcan mencionados en ningún campo.
5. Si el cliente pidió compartir, selecciona UNA promoción del menú como sharedPromotionId. Si el cliente NO pidió compartir, deja sharedPromotionId en null y NO sugieras ninguna promoción.
6. Moneda: pesos colombianos (COP). Formatea los precios con símbolo $ y separador de miles, SIN la palabra COP (ej: $100.000, $50.000, $10.000).
7. Sé CONCISO: cada valor de itemReasons debe tener máximo 12 palabras. El summary debe tener máximo 40 palabras.
8. NO repitas nombres de productos en las explicaciones. Explica solo el motivo breve (ej: "económico", "variedad", "sin cebolla").
9. Si incluyes una promoción (sharedPromotionId no es null), agrega su explicación en itemReasons usando la clave EXACTA "promo-" + id de la promoción (ej: "promo-a1b2c3d4-e5f6-7890-abcd-ef1234567890").

Responde con este JSON exacto:
{"items":[{"productId":"uuid","quantity":1}],"sharedPromotionId":"uuid o null","explanation":{"summary":"resumen breve en español","itemReasons":{"uuid-producto":"motivo breve","promo-uuid-promocion":"motivo breve si hay promoción"}}}`;
};

export const buildUserPrompt = (
  menuContext: string,
  prefs: {
    peopleCount: number;
    maximumBudget: number | null;
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

  return `MENÚ (precios en COP):
${menuContext}

CLIENTE:
- Personas: ${prefs.peopleCount}
- Presupuesto máximo: ${budgetStr}
- Exclusiones: ${exclusionsStr}
- Compartir: ${prefs.hasSharedItem ? "sí" : "no"}`;
};
