/**
 * Tipos del pedido por WhatsApp.
 *
 * Representan un carrito independiente, optimizado para el flujo de pedidos
 * que se envían directamente por WhatsApp. Es deliberadamente más simple que
 * el carrito principal, pero mantiene la información necesaria para generar
 * el mensaje de pedido.
 */

export type WhatsAppOrderItem = {
  /** Identificador único de la línea, generado a partir de producto + personalizaciones. */
  lineId: string;
  /** ID del producto en el catálogo. */
  productId: string;
  /** Nombre base del producto, sin presentación ni personalizaciones. */
  baseName: string;
  /** Nombre formateado para mostrar en la UI (puede incluir presentación). */
  displayName: string;
  /** Nombre final que se usa en el mensaje de WhatsApp. */
  name: string;
  /** Precio unitario con adiciones incluidas. */
  unitPrice: number;
  /** Cantidad solicitada. */
  quantity: number;
  /** Imagen del producto. */
  image?: { src: string; alt: string };
  /** Presentación / variante seleccionada. */
  variantKey?: string;
  /** Opciones requeridas seleccionadas (grupo -> valor). */
  selectedOptions?: Record<string, string>;
  /** Adiciones seleccionadas. */
  additionOptions?: Array<{ key: string; label: string; unitPrice: number }>;
  /** Observación particular de la línea. */
  note?: string;
  /** Indica si la adición proviene del listado global de adiciones. */
  isGlobalAddition?: boolean;
};

export type WhatsAppOrderState = {
  /** Líneas del pedido. */
  items: WhatsAppOrderItem[];
  /** Nombre del cliente que realiza el pedido. */
  customerName: string;
  /** Notas generales del pedido. */
  generalNotes: string;
};

/** Input para agregar un producto al pedido (el `lineId` se calcula internamente). */
export type AddWhatsAppOrderItemInput = Omit<WhatsAppOrderItem, "lineId">;
