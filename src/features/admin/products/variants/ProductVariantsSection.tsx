import { useState, useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";
import { notify } from "@/shared/notifications/notify";
import { deleteProductVariant } from "@/features/admin/products/services/admin-products.service";
import { VariantModal } from "@/features/admin/products/variants/VariantModal";
import type { ProductVariantRow } from "@/features/admin/types/products.types";

interface ProductVariantsSectionProps {
  productId: string;
  variants: ProductVariantRow[];
  onVariantsChange: () => void;
}

export function ProductVariantsSection({
  productId,
  variants,
  onVariantsChange,
}: ProductVariantsSectionProps) {
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariantRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sortedVariants = useMemo(
    () => [...variants].sort((a, b) => a.sort_order - b.sort_order),
    [variants],
  );

  const startNew = () => {
    setSelectedVariant(null);
    setIsModalOpen(true);
  };

  const selectVariant = (variant: ProductVariantRow) => {
    setSelectedVariant(variant);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async (variant: ProductVariantRow) => {
    if (!window.confirm(`¿Eliminar ${variant.name}?`)) {
      return;
    }

    try {
      await deleteProductVariant(variant.id);
      notify.success("Variante eliminada.");
      if (selectedVariant?.id === variant.id) {
        setSelectedVariant(null);
      }
      onVariantsChange();
    } catch (error) {
      notify.error(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <section className="grid h-fit min-w-0 content-start gap-4 rounded-lg border border-border bg-surface p-3 shadow-elevated sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="m-0 font-heading text-2xl font-black text-foreground">
          Variantes
        </h2>
        <button
          type="button"
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-primary bg-primary px-3 text-xs font-black text-primary-foreground sm:px-4"
          onClick={startNew}
        >
          <Plus className="size-4" />
          Nueva
        </button>
      </div>

      {sortedVariants.length > 0 ? (
        <div className="grid max-h-[400px] gap-2 overflow-y-auto pr-1">
          {sortedVariants.map((variant) => (
            <article
              key={variant.id}
              className="grid gap-2 rounded-lg border border-border bg-surface-muted p-3 sm:grid-cols-[1fr_auto]"
            >
              <button
                type="button"
                className="text-left"
                onClick={() => selectVariant(variant)}
              >
                <span className="block text-sm font-black text-foreground">
                  {variant.name}
                </span>
                <span className="mt-1 block text-xs font-bold text-muted-foreground">
                  ${variant.price} ·{" "}
                  {variant.is_default ? "Default" : "Opcional"} ·{" "}
                  {variant.is_active ? "Activa" : "Inactiva"}
                </span>
              </button>
              <button
                type="button"
                className="inline-flex size-9 items-center justify-center rounded-full border border-error-border bg-error-soft text-error"
                onClick={() => void handleDelete(variant)}
                aria-label={`Eliminar ${variant.name}`}
              >
                <Trash2 className="size-4" />
              </button>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Sin variantes"
          description="Este producto no tiene variantes configuradas."
          action={
            <button
              type="button"
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-primary bg-primary px-4 text-xs font-black text-primary-foreground"
              onClick={startNew}
            >
              <Plus className="size-4" />
              Nueva variante
            </button>
          }
        />
      )}

      <VariantModal
        isOpen={isModalOpen}
        onClose={closeModal}
        productId={productId}
        variant={selectedVariant}
        onSaved={onVariantsChange}
      />
    </section>
  );
}
