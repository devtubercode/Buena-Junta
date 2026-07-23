import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { EmptyState } from "@/shared/components/EmptyState";
import { useAdminCrudModal } from "@/features/admin/shared/hooks/useAdminCrudModal";
import { useAdminDeleteConfirm } from "@/features/admin/shared/hooks/useAdminDeleteConfirm";
import {
  deleteProductOptionGroup,
  deleteProductOptionValue,
} from "@/features/admin/products/option-groups/services/admin-product-option-groups.service";
import { ProductOptionGroupModal } from "./components/ProductOptionGroupModal";
import { ProductOptionValueModal } from "./components/ProductOptionValueModal";
import type {
  ProductOptionGroupRow,
  ProductOptionValueRow,
} from "@/features/admin/types/products.types";
import { useExpandedGroups } from "../hooks/useExpandedGroups";
import { OptionGroupHeader } from "./components/OptionGroupHeader";
import { OptionGroupOptionsList } from "./components/OptionGroupOptionsList";

type OptionGroupWithValues = ProductOptionGroupRow & {
  product_option_values: ProductOptionValueRow[];
};

interface ProductOptionGroupsSectionProps {
  productId: string;
  optionGroups: OptionGroupWithValues[];
}

export const ProductOptionGroupsSection = ({
  productId,
  optionGroups,
}: ProductOptionGroupsSectionProps) => {
  const { confirmDelete, ConfirmDialog: DeleteGroupConfirmDialog } =
    useAdminDeleteConfirm();
  const groupModal = useAdminCrudModal<ProductOptionGroupRow>();
  const optionModal = useAdminCrudModal<ProductOptionValueRow>();
  const { isExpanded, toggle } = useExpandedGroups();
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [groups, setGroups] = useState<OptionGroupWithValues[]>(optionGroups);

  const sortedGroups = useMemo(
    () => [...groups].sort((a, b) => a.name.localeCompare(b.name)),
    [groups],
  );

  const handleShowModalAddOption = (groupId: string) => {
    setActiveGroupId(groupId);
    optionModal.openNew();
  };

  const handleShowModalEditOption = (
    groupId: string,
    optionValue: ProductOptionValueRow,
  ) => {
    setActiveGroupId(groupId);
    optionModal.openEdit(optionValue);
  };

  const handlerCloseOptionModal = () => {
    optionModal.close();
    setActiveGroupId(null);
  };

  const handleDeleteGroup = async (selectedGroup: ProductOptionGroupRow) => {
    const deleted = await confirmDelete({
      item: selectedGroup,
      deleteFn: deleteProductOptionGroup,
      id: selectedGroup.id,
      itemLabel: "Grupo",
    });
    if (!deleted) return;

    setGroups((prev) => prev.filter((group) => group.id !== selectedGroup.id));
  };

  const onDeleteOptionValueOfGroup = (item: ProductOptionValueRow) => {
    const updatedGroups = groups.map((group) => {
      const optionsGroup = group.product_option_values;
      const groupIdOption = item.product_option_group_id;

      if (group.id === groupIdOption) {
        return {
          ...group,
          product_option_values: optionsGroup.filter(
            (optionValue) => optionValue.id !== item.id,
          ),
        };
      }

      return group;
    });

    setGroups(updatedGroups);
  };

  const onUpdatedOptionValueOfGroup = (
    optionValueUpdated: ProductOptionValueRow,
  ) => {
    const updatedGroups = groups.map((group) => {
      const optionsGroup = group.product_option_values;
      const groupIdOption = optionValueUpdated.product_option_group_id;

      if (group.id === groupIdOption) {
        return {
          ...group,
          product_option_values: optionsGroup.map((option) =>
            option.id === optionValueUpdated.id ? optionValueUpdated : option,
          ),
        };
      }
      return group;
    });

    setGroups(updatedGroups);
  };

  const onAddOptionValueOfGroup = (newOptionValue: ProductOptionValueRow) => {
    const updatedGroups = groups.map((group) => {
      const groupIdOption = newOptionValue.product_option_group_id;
      if (group.id === groupIdOption) {
        return {
          ...group,
          product_option_values: [
            ...group.product_option_values,
            newOptionValue,
          ],
        };
      }
      return group;
    });
    setGroups(updatedGroups);
  };

  const handleDeleteOptionValue = async (
    selectedOptionValue: ProductOptionValueRow,
  ) => {
    const deleted = await confirmDelete({
      item: selectedOptionValue,
      deleteFn: deleteProductOptionValue,
      id: selectedOptionValue.id,
      itemLabel: "Opción",
    });

    if (deleted) onDeleteOptionValueOfGroup(selectedOptionValue);
  };

  const handleGroupSaved = (savedGroup: ProductOptionGroupRow) => {
    if (groupModal.selected === null) {
      setGroups([...groups, { ...savedGroup, product_option_values: [] }]);
      groupModal.close();
      return;
    }

    const getGroupsUpdated = groups.map((group) => {
      const isSameGroup = group.id === savedGroup.id;
      if (!isSameGroup) return group;

      return {
        ...savedGroup,
        product_option_values: group.product_option_values,
      };
    });
    setGroups(getGroupsUpdated);
    groupModal.close();
  };

  const handleUpdateGroupOptionValues = (
    optionValueSaved: ProductOptionValueRow,
  ) => {
    if (!optionModal.selected) {
      onAddOptionValueOfGroup(optionValueSaved);
    } else {
      onUpdatedOptionValueOfGroup(optionValueSaved);
    }
    handlerCloseOptionModal();
  };

  return (
    <section className="grid h-fit min-w-0 content-start gap-4 rounded-xl border border-border bg-surface p-3 shadow-elevated sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="m-0 font-heading text-2xl font-black text-foreground">
            Grupos de opciones
          </h2>
          <p className="mt-1 text-xs font-bold text-muted-foreground">
            {groups.length} grupo{groups.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          radius="full"
          size="sm"
          onClick={groupModal.openNew}
          icon={<Plus className="size-4" />}
        >
          Nuevo grupo
        </Button>
      </div>

      {sortedGroups.length === 0 ? (
        <EmptyState
          title="Sin grupos de opciones"
          description="Este producto no tiene grupos de opciones configurados."
        />
      ) : (
        <div className="grid max-h-130 gap-4 overflow-y-auto">
          {sortedGroups.map((group) => (
            <article
              key={group.id}
              className="grid gap-4 rounded-xl border border-border bg-surface-muted p-4 transition hover:border-primary/20"
            >
              <OptionGroupHeader
                group={group}
                optionsCount={group.product_option_values.length}
                isExpanded={isExpanded(group.id)}
                onToggle={() => toggle(group.id)}
                onEdit={() => groupModal.openEdit(group)}
                onDelete={() => handleDeleteGroup(group)}
              />
              {isExpanded(group.id) && (
                <OptionGroupOptionsList
                  options={group.product_option_values}
                  onAdd={() => handleShowModalAddOption(group.id)}
                  onEdit={(value) => handleShowModalEditOption(group.id, value)}
                  onDelete={(value) => handleDeleteOptionValue(value)}
                />
              )}
            </article>
          ))}
        </div>
      )}

      {groupModal.isOpen && (
        <ProductOptionGroupModal
          onCloseModal={groupModal.close}
          productId={productId}
          group={groupModal.selected}
          onSuccessSaved={handleGroupSaved}
        />
      )}

      {optionModal.isOpen && activeGroupId && (
        <ProductOptionValueModal
          isOpen={optionModal.isOpen}
          onClose={handlerCloseOptionModal}
          groupId={activeGroupId}
          optionValue={optionModal.selected}
          onSuccessSaved={handleUpdateGroupOptionValues}
        />
      )}

      <DeleteGroupConfirmDialog />
    </section>
  );
};
