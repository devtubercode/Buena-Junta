import { formatCOP } from "@/features/cart/utils/money";
import type {
  MenuOrderDetails,
  MenuOrderFulfillmentType,
  MenuOrderPaymentMethod,
} from "@/store/menu-order/types/menu-order.types";
import { formatProductName } from "@/shared/utils/formatProductName";

const WHATSAPP_PHONE = "573174263716";

type WhatsAppMessageItem = {
  name: string;
  price: number;
  quantity: number;
  variantKey?: string;
  selectedOptions?: Record<string, string>;
  additionOptions?: Array<{ key: string; label: string; unitPrice: number }>;
};

type WhatsAppMessageDraft = MenuOrderDetails;

type BuildWhatsAppMessageInput = {
  items: WhatsAppMessageItem[];
  orderDraft: WhatsAppMessageDraft;
  total: number;
  totalQuantity: number;
};

type CompactLine = string | false | null | undefined;

function compactLines(lines: CompactLine[]): string {
  return lines.filter(Boolean).join("\n");
}

function formatSelectedOptions(item: WhatsAppMessageItem): string | false {
  if (!item.selectedOptions || Object.keys(item.selectedOptions).length === 0) {
    return false;
  }

  const options = Object.entries(item.selectedOptions)
    .map(([groupName, optionName]) => `${groupName}: ${optionName}`)
    .join(", ");

  return `   *Opciones:* ${options}`;
}

function formatAdditions(item: WhatsAppMessageItem): string | false {
  if (!item.additionOptions?.length) {
    return false;
  }

  const additions = item.additionOptions
    .map((addition) => `${addition.label} (${formatCOP(addition.unitPrice)})`)
    .join(", ");

  return `   *Acompañantes:* ${additions}`;
}

function formatProductLine(item: WhatsAppMessageItem, index: number): string {
  const productName = formatProductName(item.name);
  const subtotal = item.price * item.quantity;

  return compactLines([
    `*${index + 1}. ${productName} x${item.quantity}*`,
    item.variantKey?.trim()
      ? `   *Presentación:* ${item.variantKey.trim()}`
      : false,
    formatSelectedOptions(item),
    `   *Unit:* ${formatCOP(item.price)}`,
    `   *Subtotal:* ${formatCOP(subtotal)}`,
    formatAdditions(item),
  ]);
}

function formatOrderNotes(orderDraft: WhatsAppMessageDraft): CompactLine[] {
  const observation = orderDraft.generalObservation.trim();

  if (!observation) {
    return [];
  }

  return ["", "📌 *Observaciones*", observation];
}

function formatFulfillmentType(type: MenuOrderFulfillmentType): string {
  switch (type) {
    case "table":
      return "En mesa";
    case "delivery":
      return "Domicilio";
    case "pickup":
    default:
      return "Recoger";
  }
}

function formatPaymentMethod(method: MenuOrderPaymentMethod): string {
  switch (method) {
    case "nequi":
      return "QR Nequi";
    case "cash":
    default:
      return "Pago físico";
  }
}

function formatFulfillmentDetails(
  orderDraft: WhatsAppMessageDraft,
): CompactLine[] {
  const table = orderDraft.table?.trim() ?? "";
  const deliveryAddress = orderDraft.deliveryAddress?.trim() ?? "";
  const deliveryReference = orderDraft.deliveryReference?.trim() ?? "";

  return [
    `*Entrega:* ${formatFulfillmentType(orderDraft.fulfillmentType)}`,
    orderDraft.fulfillmentType === "table" && table
      ? `*Mesa:* ${table}`
      : false,
    orderDraft.fulfillmentType === "delivery" && deliveryAddress
      ? `*Dirección:* ${deliveryAddress}`
      : false,
    orderDraft.fulfillmentType === "delivery" && deliveryReference
      ? `*Referencia:* ${deliveryReference}`
      : false,
  ];
}

export function buildWhatsAppOrderMessage({
  items,
  orderDraft,
  total,
  totalQuantity,
}: BuildWhatsAppMessageInput): string {
  if (items.length === 0) {
    throw new Error("No se puede generar el mensaje: el carrito está vacío.");
  }

  if (!Number.isFinite(total)) {
    throw new Error("No se puede generar el mensaje: el total no es válido.");
  }

  if (!Number.isFinite(totalQuantity)) {
    throw new Error(
      "No se puede generar el mensaje: la cantidad no es válida.",
    );
  }

  const customerName = orderDraft.customerName.trim() || "Sin nombre";
  const productLines = items.map(formatProductLine).join("\n\n");

  return compactLines([
    "✅ *Nuevo pedido desde web*",
    "",
    "Hola, quiero hacer este pedido:",
    "",
    "📝 *Datos del pedido*",
    `*Nombre:* ${customerName}`,
    ...formatFulfillmentDetails(orderDraft),
    `*Pago:* ${formatPaymentMethod(orderDraft.paymentMethod)}`,
    "",
    "🛒 *Productos*",
    productLines,
    ...formatOrderNotes(orderDraft),
    "",
    "📄 *Resumen*",
    `*Productos:* ${totalQuantity}`,
    `*Total:* ${formatCOP(total)}`,
  ]);
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
