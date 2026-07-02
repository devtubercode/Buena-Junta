import { useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";
import { useAdminCrudModal } from "@/features/admin/shared/hooks/useAdminCrudModal";
import { useAdminDeleteConfirm } from "@/features/admin/shared/hooks/useAdminDeleteConfirm";
import { deleteAddition } from "@/features/admin/additions/services/admin-additions.service";
import { ProductAdditionModal } from "./ProductAdditionModal";
import type { AdditionRow } from "@/features/admin/types/additions.types";
import type { AdminProductDetailData } from "@/features/admin/types/products.types";

interface ProductAdditionsSectionProps {
  additions: AdditionRow[];
  productId: string;
  setProductDetail: Dispatch<SetStateAction<AdminProductDetailData>>;
}

function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-CO")}`;
}

export function ProductAdditionsSection({
  additions,
  productId,
  setProductDetail,
}: ProductAdditionsSectionProps) {
  const { confirmDelete } = useAdminDeleteConfirm();
  const { selected, isOpen, openNew, openEdit, close } =
    useAdminCrudModal<AdditionRow>();

  const sortedAdditions = useMemo(
    () => [...additions].sort((a, b) => a.name.localeCompare(b.name)),
    [additions],
  );

  const handleDelete = async (addition: AdditionRow) => {
    const deleted = await confirmDelete({
      item: addition,
      deleteFn: deleteAddition,
      id: addition.id,
      itemLabel: "Adición",
    });

    if (deleted) {
      setProductDetail((prev) => ({
        ...prev,
        product_additions: prev.product_additions.filter(
          (a) => a.id !== addition.id,
        ),
      }));
    }
  };

  return (
    <section className="grid h-fit min-w-0 content-start gap-4 rounded-xl border border-border bg-surface p-3 shadow-elevated sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="m-0 font-heading text-2xl font-black text-foreground">
            Adiciones
          </h2>
          <p className="mt-1 text-xs font-bold text-muted-foreground">
            {additions.length} adicion{additions.length === 1 ? "" : "es"}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-primary px-4 text-xs font-black text-primary-foreground shadow-elevated transition hover:opacity-90"
          onClick={openNew}
        >
          <Plus className="size-4" />
          Nueva
        </button>
      </div>

      {sortedAdditions.length > 0 ? (
        <div className="grid max-h-[400px] gap-3 overflow-y-auto pr-1">
          {sortedAdditions.map((addition) => (
            <article
              key={addition.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface-muted p-3 transition hover:border-primary/30 hover:shadow-md sm:p-4"
            >
              <button
                type="button"
                className="min-w-0 flex-1 text-left"
                onClick={() => openEdit(addition)}
              >
                <span className="block truncate font-heading text-sm font-black text-foreground">
                  {addition.name}
                </span>
                <span className="mt-1 block text-xs font-bold text-muted-foreground">
                  <span className="text-primary">
                    {formatPrice(addition.price)}
                  </span>
                  {addition.description ? (
                    <span className="ml-1.5 break-words">
                      · {addition.description}
                    </span>
                  ) : null}
                </span>
              </button>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition hover:border-primary hover:text-primary"
                  onClick={() => openEdit(addition)}
                  aria-label={`Editar ${addition.name}`}
                >
                  <Edit3 className="size-4" />
                </button>
                <button
                  type="button"
                  className="inline-flex size-9 items-center justify-center rounded-full border border-error-border bg-error-soft text-error transition hover:bg-error hover:text-error-foreground"
                  onClick={() => void handleDelete(addition)}
                  aria-label={`Eliminar ${addition.name}`}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Sin adiciones"
          description="Este producto no tiene adiciones configuradas."
          action={
            <button
              type="button"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-primary px-4 text-xs font-black text-primary-foreground transition hover:opacity-90"
              onClick={openNew}
            >
              <Plus className="size-4" />
              Nueva adición
            </button>
          }
        />
      )}

      <ProductAdditionModal
        isOpen={isOpen}
        onClose={close}
        productId={productId}
        addition={selected}
      />
    </section>
  );
}
