import { useMemo, useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";
import { useAdminCrudModal } from "@/features/admin/shared/hooks/useAdminCrudModal";
import { useAdminDeleteConfirm } from "@/features/admin/shared/hooks/useAdminDeleteConfirm";
import {
  deleteProductOptionGroup,
  deleteProductOptionValue,
} from "@/features/admin/products/option-groups/services/admin-product-option-groups.service";
import { ProductOptionGroupModal } from "./ProductOptionGroupModal";
import { ProductOptionValueModal } from "./ProductOptionValueModal";
import { cn } from "@/shared/utils/cn";
import type {
  ProductOptionGroupRow,
  ProductOptionValueRow,
} from "@/features/admin/types/products.types";

interface ProductOptionGroupsSectionProps {
  productId: string;
  optionGroups: (ProductOptionGroupRow & {
    product_option_values: ProductOptionValueRow[];
  })[];
  onGroupsChange: () => void;
}

function RequirementBadge({ isRequired }: { isRequired: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide",
        isRequired
          ? "border border-primary-border bg-primary-soft text-primary"
          : "border border-border bg-surface text-muted-foreground",
      )}
    >
      {isRequired ? "Requerido" : "Opcional"}
    </span>
  );
}

function ActiveBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide",
        isActive
          ? "border border-success-border bg-success-soft text-success"
          : "border border-border bg-surface text-muted-foreground",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          isActive ? "bg-success" : "bg-muted-foreground",
        )}
        aria-hidden="true"
      />
      {isActive ? "Activo" : "Inactivo"}
    </span>
  );
}

function OptionValueStatusDot({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex size-2 rounded-full",
        isActive ? "bg-success" : "bg-muted-foreground/40",
      )}
      aria-hidden="true"
    />
  );
}

export function ProductOptionGroupsSection({
  productId,
  optionGroups,
  onGroupsChange,
}: ProductOptionGroupsSectionProps) {
  const { confirmDelete } = useAdminDeleteConfirm();
  const groupModal = useAdminCrudModal<ProductOptionGroupRow>();
  const valueModal = useAdminCrudModal<ProductOptionValueRow>();
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);

  const sortedGroups = useMemo(
    () => [...optionGroups].sort((a, b) => a.name.localeCompare(b.name)),
    [optionGroups],
  );

  const openNewValue = (groupId: string) => {
    setActiveGroupId(groupId);
    valueModal.openNew();
  };

  const openEditValue = (
    groupId: string,
    optionValue: ProductOptionValueRow,
  ) => {
    setActiveGroupId(groupId);
    valueModal.openEdit(optionValue);
  };

  const closeValueModal = () => {
    valueModal.close();
    setActiveGroupId(null);
  };

  const handleDeleteGroup = async (group: ProductOptionGroupRow) => {
    const deleted = await confirmDelete(
      group,
      deleteProductOptionGroup,
      group.id,
      "Grupo",
    );

    if (deleted) {
      if (groupModal.selected?.id === group.id) {
        groupModal.close();
      }
      onGroupsChange();
    }
  };

  const handleDeleteValue = async (optionValue: ProductOptionValueRow) => {
    const deleted = await confirmDelete(
      optionValue,
      deleteProductOptionValue,
      optionValue.id,
      "Opción",
    );

    if (deleted) {
      if (valueModal.selected?.id === optionValue.id) {
        closeValueModal();
      }
      onGroupsChange();
    }
  };

  return (
    <section className="grid h-fit min-w-0 content-start gap-4 rounded-xl border border-border bg-surface p-3 shadow-elevated sm:p-5">
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
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-primary px-4 text-xs font-black text-primary-foreground shadow-elevated transition hover:opacity-90"
          onClick={groupModal.openNew}
        >
          <Plus className="size-4" />
          Nuevo grupo
        </button>
      </div>

      {sortedGroups.length === 0 ? (
        <EmptyState
          title="Sin grupos de opciones"
          description="Este producto no tiene grupos de opciones configurados."
          action={
            <button
              type="button"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-primary px-4 text-xs font-black text-primary-foreground transition hover:opacity-90"
              onClick={groupModal.openNew}
            >
              <Plus className="size-4" />
              Crear grupo
            </button>
          }
        />
      ) : (
        <div className="grid gap-4">
          {sortedGroups.map((group) => (
            <article
              key={group.id}
              className="grid gap-4 rounded-xl border border-border bg-surface-muted p-4 transition hover:border-primary/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="m-0 truncate font-heading text-base font-black text-foreground">
                    {group.name}
                  </h3>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <RequirementBadge isRequired={group.is_required} />
                    <ActiveBadge isActive={group.is_active} />
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition hover:border-primary hover:text-primary"
                    onClick={() => groupModal.openEdit(group)}
                    aria-label={`Editar ${group.name}`}
                  >
                    <Edit3 className="size-4" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex size-9 items-center justify-center rounded-full border border-error-border bg-error-soft text-error transition hover:bg-error hover:text-error-foreground"
                    onClick={() => void handleDeleteGroup(group)}
                    aria-label={`Eliminar ${group.name}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>

              <div className="grid gap-3">
                {group.product_option_values.length > 0 ? (
                  <ul className="grid max-h-[320px] gap-2 overflow-y-auto pr-1">
                    {[...group.product_option_values]
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((optionValue) => (
                        <li
                          key={optionValue.id}
                          className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface p-2.5 transition hover:border-primary/30 hover:bg-surface-raised"
                        >
                          <span className="flex min-w-0 items-center gap-2 text-sm font-bold text-foreground">
                            <OptionValueStatusDot
                              isActive={optionValue.is_active}
                            />
                            <span className="truncate">{optionValue.name}</span>
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              className="inline-flex size-8 items-center justify-center rounded-full border border-border bg-surface-muted text-muted-foreground transition hover:border-primary hover:text-primary"
                              onClick={() =>
                                openEditValue(group.id, optionValue)
                              }
                              aria-label={`Editar ${optionValue.name}`}
                            >
                              <Edit3 className="size-4" />
                            </button>
                            <button
                              type="button"
                              className="inline-flex size-8 items-center justify-center rounded-full border border-error-border bg-error-soft text-error transition hover:bg-error hover:text-error-foreground"
                              onClick={() =>
                                void handleDeleteValue(optionValue)
                              }
                              aria-label={`Eliminar ${optionValue.name}`}
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="m-0 rounded-lg border border-dashed border-border bg-surface p-4 text-center text-xs font-bold text-muted-foreground">
                    Este grupo aún no tiene opciones.
                  </p>
                )}

                <button
                  type="button"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 text-xs font-black text-muted-foreground transition hover:border-primary hover:text-primary"
                  onClick={() => openNewValue(group.id)}
                >
                  <Plus className="size-4" />
                  Agregar opción
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <ProductOptionGroupModal
        isOpen={groupModal.isOpen}
        onClose={groupModal.close}
        productId={productId}
        group={groupModal.selected}
        onSaved={onGroupsChange}
      />

      <ProductOptionValueModal
        isOpen={valueModal.isOpen}
        onClose={closeValueModal}
        groupId={activeGroupId}
        value={valueModal.selected}
        onSaved={onGroupsChange}
      />
    </section>
  );
}
