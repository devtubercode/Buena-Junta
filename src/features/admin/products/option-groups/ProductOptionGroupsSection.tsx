import { useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Plus } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";
import { useAdminCrudModal } from "@/features/admin/shared/hooks/useAdminCrudModal";
import { useAdminDeleteConfirm } from "@/features/admin/shared/hooks/useAdminDeleteConfirm";
import {
  deleteProductOptionGroup,
  deleteProductOptionValue,
} from "@/features/admin/products/option-groups/services/admin-product-option-groups.service";
import { ProductOptionGroupModal } from "./ProductOptionGroupModal";
import { ProductOptionValueModal } from "./ProductOptionValueModal";
import type {
  ProductOptionGroupRow,
  ProductOptionValueRow,
  AdminProductDetailData,
} from "@/features/admin/types/products.types";
import { OptionGroupItem } from "./components/OptionGroupItem";
import { useExpandedGroups } from "./components/useExpandedGroups";

interface ProductOptionGroupsSectionProps {
  productId: string;
  optionGroups: (ProductOptionGroupRow & {
    product_option_values: ProductOptionValueRow[];
  })[];
  setProductDetail: Dispatch<SetStateAction<AdminProductDetailData>>;
}

export function ProductOptionGroupsSection({
  productId,
  optionGroups,
  setProductDetail,
}: ProductOptionGroupsSectionProps) {
  const { confirmDelete } = useAdminDeleteConfirm();
  const groupModal = useAdminCrudModal<ProductOptionGroupRow>();
  const valueModal = useAdminCrudModal<ProductOptionValueRow>();
  const { isExpanded, toggle } = useExpandedGroups();
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
    const deleted = await confirmDelete({
      item: group,
      deleteFn: deleteProductOptionGroup,
      id: group.id,
      itemLabel: "Grupo",
    });

    if (deleted) {
      if (groupModal.selected?.id === group.id) {
        groupModal.close();
      }
      setProductDetail((prev) => ({
        ...prev,
        product_option_groups: prev.product_option_groups.filter(
          (g) => g.id !== group.id,
        ),
      }));
    }
  };

  const handleDeleteValue = async (optionValue: ProductOptionValueRow) => {
    const deleted = await confirmDelete({
      item: optionValue,
      deleteFn: deleteProductOptionValue,
      id: optionValue.id,
      itemLabel: "Opción",
    });

    if (deleted) {
      if (valueModal.selected?.id === optionValue.id) {
        closeValueModal();
      }
      setProductDetail((prev) => ({
        ...prev,
        product_option_groups: prev.product_option_groups.map((g) =>
          g.id === activeGroupId
            ? {
                ...g,
                product_option_values: g.product_option_values.filter(
                  (v) => v.id !== optionValue.id,
                ),
              }
            : g,
        ),
      }));
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
        <div className="grid max-h-[520px] gap-4 overflow-y-auto">
          {sortedGroups.map((group) => (
            <OptionGroupItem
              key={group.id}
              group={group}
              isExpanded={isExpanded(group.id)}
              onToggle={() => toggle(group.id)}
              onEditGroup={() => groupModal.openEdit(group)}
              onDeleteGroup={() => void handleDeleteGroup(group)}
              onAddValue={() => openNewValue(group.id)}
              onEditValue={(value) => openEditValue(group.id, value)}
              onDeleteValue={(value) => void handleDeleteValue(value)}
            />
          ))}
        </div>
      )}

      <ProductOptionGroupModal
        isOpen={groupModal.isOpen}
        onClose={groupModal.close}
        productId={productId}
        group={groupModal.selected}
      />

      <ProductOptionValueModal
        isOpen={valueModal.isOpen}
        onClose={closeValueModal}
        groupId={activeGroupId}
        value={valueModal.selected}
      />
    </section>
  );
}
