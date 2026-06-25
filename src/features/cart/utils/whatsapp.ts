import type { CartItem, OrderDraft } from "@/features/cart/types/cart.types";
import { formatCartItemName } from "@/features/cart/utils/cartCopy";
import { formatCOP } from "@/features/cart/utils/money";

const whatsappPhone = "573174263716";

type BuildMessageInput = {
  items: CartItem[];
  orderDraft: OrderDraft;
  total: number;
};

function compactLines(lines: Array<string | false | null | undefined>) {
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

export function buildWhatsAppOrderMessage({
  items,
  orderDraft,
  total,
}: BuildMessageInput) {
  const productLines = items
    .map((item, index) =>
      compactLines([
        `${index + 1}. ${formatCartItemName(item.name)}`,
        item.variantKey?.trim() ? `   Opción: ${item.variantKey.trim()}` : false,
        formatSelectedOptions(item),
        `   Cantidad: ${item.quantity}`,
        `   Precio unitario: ${formatCOP(item.unitPrice)}`,
        `   Subtotal: ${formatCOP(item.unitPrice * item.quantity)}`,
        item.additionOptions?.length
          ? `   Acompañantes: ${item.additionOptions
              .map((addition) => `${addition.label} (${formatCOP(addition.unitPrice)})`)
              .join(", ")}`
          : false,
        item.note?.trim() ? `   Observación: ${item.note.trim()}` : false,
      ]),
    )
    .join("\n\n");

  return compactLines([
    "*Pedido Buena Junta*",
    "",
    `Responsable: ${orderDraft.customerName.trim()}`,
    orderDraft.table.trim() ? `Mesa: ${orderDraft.table.trim()}` : false,
    "",
    "*Productos*",
    productLines,
    orderDraft.generalNotes.trim() ? "" : false,
    orderDraft.generalNotes.trim() ? "Observaciones del pedido:" : false,
    orderDraft.generalNotes.trim() || false,
    "",
    `*Total: ${formatCOP(total)}*`,
  ]);
}

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
}
