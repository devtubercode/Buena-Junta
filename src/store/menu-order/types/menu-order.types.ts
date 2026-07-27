/**
 * Tipos del pedido desde el menú.
 *
 * Representan un carrito independiente para el flujo de pedidos del menú
 * digital. Es deliberadamente más simple que el carrito principal, pero
 * mantiene la información necesaria para generar el resumen del pedido.
 */

import type { MenuImage } from "@/features/menu/types/menu.types";

export type MenuOrderItem = {
  /** Identificador único de la línea, generado a partir de producto + personalizaciones. */
  lineId: string;
  /** ID del producto en el catálogo. */
  id: string;
  /** Nombre final del producto (puede incluir presentación). */
  name: string;
  /** Precio unitario con adiciones incluidas. */
  price: number;
  /** Cantidad solicitada. */
  quantity: number;
  /** Imagen del producto. */
  urlImage?: MenuImage;
  /** Presentación / variante seleccionada. */
  variantId?: string;
  /** Opciones requeridas seleccionadas (grupo -> valor). */
  selectedOptions?: Record<string, string>;
  /** Adiciones seleccionadas. */
  additionOptions?: Array<{ key: string; label: string; unitPrice: number }>;
};

export type AddMenuOrderItemInput = Omit<MenuOrderItem, "lineId">;

export type MenuOrderTopping = {
  /** ID del topping en el catálogo. */
  id: string;
  /** Nombre del topping. */
  name: string;
  /** Precio unitario. */
  price: number;
  /** Cantidad solicitada. */
  quantity: number;
};

export type MenuOrderFulfillmentType = "pickup" | "table" | "delivery";

export type MenuOrderPaymentMethod = "cash" | "nequi";

export type MenuOrderDetails = {
  /** Nombre del cliente que realiza el pedido. */
  customerName: string;
  /** Modalidad de entrega del pedido. */
  fulfillmentType: MenuOrderFulfillmentType;
  /** Número o referencia de mesa cuando aplica. */
  table: string;
  /** Dirección del domicilio cuando aplica. */
  deliveryAddress: string;
  /** Referencia adicional para encontrar domicilio. */
  deliveryReference: string;
  /** Método de pago elegido por cliente. */
  paymentMethod: MenuOrderPaymentMethod;
  /** Observaciones generales del pedido. */
  generalObservation: string;
};

export type MenuOrderState = {
  /** Productos del pedido. */
  items: MenuOrderItem[];
  /** Toppings globales del pedido. */
  toppings: MenuOrderTopping[];
  /** Datos del formulario del pedido. */
  orderDetails: MenuOrderDetails;
};
