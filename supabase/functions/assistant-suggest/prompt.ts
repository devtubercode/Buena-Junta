export function buildSystemPrompt(): string {
  return `Eres un curador experto de pedidos para un restaurante. Tu tarea es seleccionar productos del menú que mejor se ajusten a las preferencias del cliente.

IMPORTANTE: Tu respuesta debe ser EXCLUSIVAMENTE un objeto JSON válido. No incluyas texto, explicaciones, markdown, ni bloques de código. Solo el JSON puro.

REGLAS ESTRICTAS:
1. SOLO selecciona productos que existan en el menú proporcionado. No inventes IDs, nombres, variantes, opciones o adiciones.
2. El variantId debe ser el "id" EXACTO de una variante del producto (campo variants[].id). Si el producto no tiene variantes, usa null.
3. Las claves de selectedOptions deben ser los nombres EXACTOS de los grupos de opciones (groups[].name). Los valores deben ser nombres EXACTOS de opciones dentro de ese grupo.
4. Las additionKeys deben ser IDs EXACTOS de adiciones disponibles (additions[].id).
5. Respeta las exclusiones: ningún producto, variante, opción o adición cuyo nombre contenga un término excluido debe ser seleccionado.
6. Distribuye los items entre las categorías preferidas del usuario. Si hay 2+ categorías, cada una debe tener al menos un producto.
7. Si el usuario pide algo para compartir, selecciona UNA promoción activa como sharedPromotionSlug. Usa el slug exacto de la promoción.
8. Calcula la cantidad total de items como: personas * 2 (mínimo 2). Ajusta para no exceder el presupuesto.
9. Explica cada selección en español colombiano, natural y breve.

DEVUELVE ÚNICAMENTE ESTE JSON, sin markdown ni texto adicional:
{
  "items": [
    {
      "productId": "uuid-del-producto",
      "variantId": "uuid-o-null",
      "selectedOptions": { "nombreGrupo": "nombreOpcion" },
      "additionKeys": ["uuid-adicion"],
      "quantity": 2
    }
  ],
  "sharedPromotionSlug": "slug-o-null",
  "explanation": {
    "summary": "resumen general",
    "perItem": { "uuid-producto": "por qué elegiste este producto" }
  }
}`;
}

export function buildUserPrompt(
  menuContext: string,
  prefs: {
    peopleCount: number;
    maximumBudget: number | null;
    preferredCategoryNames: string[];
    exclusions: string[];
    hasSharedItem: boolean;
  },
): string {
  const budgetStr =
    prefs.maximumBudget !== null
      ? `$${prefs.maximumBudget.toLocaleString("es-CO")} COP`
      : "sin límite";

  const exclusionsStr =
    prefs.exclusions.length > 0
      ? prefs.exclusions.join(", ")
      : "ninguna";

  const categoriesStr =
    prefs.preferredCategoryNames.length > 0
      ? prefs.preferredCategoryNames.join(", ")
      : "todas las categorías";

  return `MENÚ DISPONIBLE:
${menuContext}

PREFERENCIAS DEL CLIENTE:
- Personas: ${prefs.peopleCount}
- Presupuesto máximo: ${budgetStr}
- Categorías: ${categoriesStr}
- Exclusiones: ${exclusionsStr}
- Incluir algo para compartir: ${prefs.hasSharedItem ? "sí" : "no"}

Selecciona la mejor combinación de productos del menú para este cliente.`;
}
