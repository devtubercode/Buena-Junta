import { useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";
import { useAdminDeleteConfirm } from "@/features/admin/shared/hooks/useAdminDeleteConfirm";
import { VariantModal } from "@/features/admin/products/variants/VariantModal";
import { deleteProductVariant } from "@/features/admin/products/variants/services/admin-product-variants.service";
import { cn } from "@/shared/utils/cn";
import type {
  ProductVariantRow,
  AdminProductDetailData,
} from "@/features/admin/types/products.types";

interface ProductVariantsSectionProps {
  productId: string;
  variants: ProductVariantRow[];
  setProductDetail: Dispatch<SetStateAction<AdminProductDetailData>>;
}

function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-CO")}`;
}

function VariantStatusBadge({ isDefault }: { isDefault: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide",
        isDefault
          ? "border border-primary-border bg-primary-soft text-primary"
          : "border border-border bg-surface-muted text-muted-foreground",
      )}
    >
      {isDefault ? "Default" : "Opcional"}
    </span>
  );
}

export function ProductVariantsSection({
  productId,
  variants,
  setProductDetail,
}: ProductVariantsSectionProps) {
  const { confirmDelete } = useAdminDeleteConfirm();
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariantRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sortedVariants = useMemo(
    () => [...variants].sort((a, b) => a.name.localeCompare(b.name)),
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
    setSelectedVariant(null);
  };

  const handleDelete = async (variant: ProductVariantRow) => {
    const deleted = await confirmDelete({
      item: variant,
      deleteFn: deleteProductVariant,
      id: variant.id,
      itemLabel: "Variante",
    });

    if (deleted) {
      if (selectedVariant?.id === variant.id) {
        setSelectedVariant(null);
      }
      setProductDetail((prev) => ({
        ...prev,
        product_variants: prev.product_variants.filter(
          (v) => v.id !== variant.id,
        ),
      }));
    }
  };

  return (
    <section className="grid h-fit min-w-0 content-start gap-4 rounded-xl border border-border bg-surface p-3 shadow-elevated sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="m-0 font-heading text-2xl font-black text-foreground">
            Variantes
          </h2>
          <p className="mt-1 text-xs font-bold text-muted-foreground">
            {variants.length} variant{variants.length === 1 ? "e" : "es"}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-primary px-4 text-xs font-black text-primary-foreground shadow-elevated transition hover:opacity-90"
          onClick={startNew}
        >
          <Plus className="size-4" />
          Nueva
        </button>
      </div>

      {sortedVariants.length > 0 ? (
        <div className="grid max-h-[420px] gap-3 overflow-y-auto pr-1">
          {sortedVariants.map((variant) => (
            <article
              key={variant.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface-muted p-3 transition hover:border-primary/30 hover:shadow-md sm:p-4"
            >
              <button
                type="button"
                className="min-w-0 flex-1 text-left"
                onClick={() => selectVariant(variant)}
              >
                <span className="block truncate font-heading text-sm font-black text-foreground">
                  {variant.name}
                </span>
                <span className="mt-1 flex flex-wrap items-center gap-2 text-xs font-bold text-muted-foreground">
                  <span className="text-primary">
                    {formatPrice(variant.price)}
                  </span>
                  <VariantStatusBadge isDefault={variant.is_default} />
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className={cn(
                        "inline-flex size-2 rounded-full",
                        variant.is_active
                          ? "bg-success"
                          : "bg-muted-foreground/40",
                      )}
                      aria-hidden="true"
                    />
                    {variant.is_active ? "Activa" : "Inactiva"}
                  </span>
                </span>
              </button>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition hover:border-primary hover:text-primary"
                  onClick={() => selectVariant(variant)}
                  aria-label={`Editar ${variant.name}`}
                >
                  <Edit3 className="size-4" />
                </button>
                <button
                  type="button"
                  className="inline-flex size-9 items-center justify-center rounded-full border border-error-border bg-error-soft text-error transition hover:bg-error hover:text-error-foreground"
                  onClick={() => void handleDelete(variant)}
                  aria-label={`Eliminar ${variant.name}`}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
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
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-primary px-4 text-xs font-black text-primary-foreground transition hover:opacity-90"
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
      />
    </section>
  );
}
