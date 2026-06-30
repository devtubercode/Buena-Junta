import type { CartItem, OrderDraft } from "@/features/cart/types/cart.types";
import { formatCartItemName } from "@/features/cart/utils/cartCopy";
import { formatCOP } from "@/features/cart/utils/money";

const WHATSAPP_PHONE = "573174263716";

type BuildMessageInput = {
  items: CartItem[];
  orderDraft: OrderDraft;
  total: number;
};

type CompactLine = string | false | null | undefined;

function compactLines(lines: CompactLine[]): string {
  return lines.filter(Boolean).join("\n");
}

function formatSelectedOptions(item: CartItem): string | false {
  if (!item.selectedOptions || Object.keys(item.selectedOptions).length === 0) {
    return false;
  }

  const options = Object.entries(item.selectedOptions)
    .map(([groupName, optionName]) => `${groupName}: ${optionName}`)
    .join(", ");

  return `   Opciones: ${options}`;
}

function formatAdditions(item: CartItem): string | false {
  if (!item.additionOptions?.length) {
    return false;
  }

  const additions = item.additionOptions
    .map((addition) => `${addition.label} (${formatCOP(addition.unitPrice)})`)
    .join(", ");

  return `   Acompañantes: ${additions}`;
}

function formatProductLine(item: CartItem, index: number): string {
  const productName = formatCartItemName(item.name);
  const subtotal = item.unitPrice * item.quantity;

  return compactLines([
    `${index + 1}. ${productName}`,
    item.variantKey?.trim() ? `   Presentación: ${item.variantKey.trim()}` : false,
    formatSelectedOptions(item),
    `   Cantidad: ${item.quantity}`,
    `   Precio unitario: ${formatCOP(item.unitPrice)}`,
    `   Subtotal: ${formatCOP(subtotal)}`,
    formatAdditions(item),
    item.note?.trim() ? `   Observación: ${item.note.trim()}` : false,
  ]);
}

function formatOrderNotes(orderDraft: OrderDraft): CompactLine[] {
  const notes = orderDraft.generalNotes.trim();

  if (!notes) {
    return [];
  }

  return ["", "Observaciones del pedido:", notes];
}

/**
 * Construye el mensaje de texto listo para enviar por WhatsApp.
 * Incluye datos del responsable, productos con variantes/opciones/adiciones,
 * subtotales por línea y total general.
 *
 * @throws {Error} Si el carrito está vacío o el total no es un número finito.
 */
export function buildWhatsAppOrderMessage({
  items,
  orderDraft,
  total,
}: BuildMessageInput): string {
  if (items.length === 0) {
    throw new Error("No se puede generar el mensaje: el carrito está vacío.");
  }

  if (!Number.isFinite(total)) {
    throw new Error("No se puede generar el mensaje: el total no es válido.");
  }

  const customerName = orderDraft.customerName.trim() || "Sin responsable";
  const table = orderDraft.table.trim();
  const productLines = items.map(formatProductLine).join("\n\n");

  return compactLines([
    "*Pedido Buena Junta*",
    "",
    `Responsable: ${customerName}`,
    table ? `Mesa: ${table}` : false,
    "",
    "*Productos*",
    productLines,
    ...formatOrderNotes(orderDraft),
    "",
    `*Total: ${formatCOP(total)}*`,
  ]);
}

/**
 * Construye la URL de WhatsApp con el mensaje codificado.
 */
export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
