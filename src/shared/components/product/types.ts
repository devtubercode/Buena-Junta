export type ProductCustomizationOutput = {
  /** ID del producto en el catálogo. */
  id: string;
  /** Nombre final del producto (puede incluir presentación). */
  name: string;
  /** Precio unitario con adiciones incluidas. */
  price: number;
  /** Cantidad solicitada. */
  quantity: number;
  /** Imagen del producto. */
  urlImage?: { src: string; alt: string };
  /** ID de la variante seleccionada. */
  variantId?: string;
  /** Nombre visible de la variante seleccionada. */
  variantLabel?: string;
  /** Opciones requeridas seleccionadas (grupo -> valor). */
  selectedOptions: Record<string, string>;
  /** Adiciones seleccionadas. */
  additionOptions: Array<{ key: string; label: string; unitPrice: number }>;
};
