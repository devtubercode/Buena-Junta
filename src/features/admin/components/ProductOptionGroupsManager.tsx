import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";
import { notify } from "@/shared/notifications/notify";
import { deleteProductOptionGroup } from "@/features/admin/services/admin-product-option-groups.service";
import { ManageProductOptionGroupsModal } from "@/features/admin/components/ManageProductOptionGroupsModal";
import type {
  ProductOptionGroupRow,
  ProductOptionValueRow,
} from "@/features/admin/types/admin.types";

interface ProductOptionGroupsManagerProps {
  productId: string;
  optionGroups: (ProductOptionGroupRow & {
    product_option_values: ProductOptionValueRow[];
  })[];
  onGroupsChange: () => void;
}

export function ProductOptionGroupsManager({
  productId,
  optionGroups,
  onGroupsChange,
}: ProductOptionGroupsManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const startNewGroup = () => {
    setSelectedGroupId(null);
    setIsModalOpen(true);
  };

  const selectGroup = (group: ProductOptionGroupRow) => {
    setSelectedGroupId(group.id);
    setIsModalOpen(true);
  };

  const handleDeleteGroup = async (group: ProductOptionGroupRow) => {
    if (
      !window.confirm(`¿Eliminar el grupo ${group.name} y todas sus opciones?`)
    ) {
      return;
    }

    try {
      await deleteProductOptionGroup(group.id);
      notify.success("Grupo eliminado.");
      onGroupsChange();
    } catch (error) {
      notify.error(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="m-0 font-heading text-2xl font-black text-foreground">
            Grupos de opciones
          </h2>
          <p className="mt-1 text-xs font-bold text-muted-foreground">
            {optionGroups.length} grupo{optionGroups.length === 1 ? "" : "s"}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-primary bg-primary px-3 text-xs font-black text-primary-foreground sm:px-4"
          onClick={startNewGroup}
        >
          <Plus className="size-4" />
          Nuevo grupo
        </button>
      </div>

      {optionGroups.length === 0 ? (
        <EmptyState
          title="Sin grupos de opciones"
          description="Este producto no tiene grupos de opciones configurados."
          action={
            <button
              type="button"
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-primary bg-primary px-4 text-xs font-black text-primary-foreground"
              onClick={startNewGroup}
            >
              <Plus className="size-4" />
              Crear grupo
            </button>
          }
        />
      ) : (
        <div className="grid max-h-[400px] gap-2 overflow-y-auto pr-1">
          {optionGroups.map((group) => (
            <article
              key={group.id}
              className="grid gap-2 rounded-lg border border-border bg-surface-muted p-3 sm:grid-cols-[1fr_auto]"
            >
              <button
                type="button"
                className="min-w-0 text-left"
                onClick={() => selectGroup(group)}
              >
                <span className="block text-sm font-black text-foreground">
                  {group.name}
                </span>
                <span className="mt-1 block text-xs font-bold text-muted-foreground">
                  {group.product_option_values.length} opción
                  {group.product_option_values.length === 1 ? "" : "es"} ·{" "}
                  {group.is_required ? "Requerido" : "Opcional"} ·{" "}
                  {group.is_active ? "Activo" : "Inactivo"}
                </span>
              </button>
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition hover:border-primary hover:text-primary"
                  onClick={() => selectGroup(group)}
                  aria-label={`Editar ${group.name}`}
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  type="button"
                  className="inline-flex size-9 items-center justify-center rounded-full border border-error-border bg-error-soft text-error"
                  onClick={() => void handleDeleteGroup(group)}
                  aria-label={`Eliminar ${group.name}`}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <ManageProductOptionGroupsModal
        key={isModalOpen ? selectedGroupId ?? "new" : "closed"}
        productId={productId}
        optionGroups={optionGroups}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedGroupId(null);
        }}
        onGroupsChange={onGroupsChange}
      />
    </div>
  );
}
