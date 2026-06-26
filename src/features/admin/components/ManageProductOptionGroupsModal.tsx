import { useState, type FormEvent } from "react";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import {
  AdminField,
  adminInputClass,
} from "@/features/admin/components/AdminField";
import { Checkbox } from "@/shared/components/Checkbox";
import { ButtonSheetModal } from "@/shared/components/ButtonSheetModal";
import { EmptyState } from "@/shared/components/EmptyState";
import { notify } from "@/shared/notifications/notify";
import {
  normalizeAdminSortOrder,
  normalizeAdminString,
} from "@/features/admin/utils/adminForms";
import {
  deleteProductOptionValue,
  saveProductOptionGroup,
  saveProductOptionValue,
} from "@/features/admin/services/admin-product-option-groups.service";
import type {
  ProductOptionGroupInput,
  ProductOptionGroupRow,
  ProductOptionValueInput,
  ProductOptionValueRow,
} from "@/features/admin/types/admin.types";

interface ManageProductOptionGroupsModalProps {
  productId: string;
  optionGroups: (ProductOptionGroupRow & {
    product_option_values: ProductOptionValueRow[];
  })[];
  selectedGroupId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onGroupsChange: () => void;
}

const emptyGroupForm: ProductOptionGroupInput = {
  name: "",
  is_required: true,
  is_active: true,
  sort_order: 0,
};

const emptyOptionForm: ProductOptionValueInput = {
  name: "",
  is_active: true,
  sort_order: 0,
};

export function ManageProductOptionGroupsModal({
  productId,
  optionGroups,
  selectedGroupId: initialSelectedGroupId,
  isOpen,
  onClose,
  onGroupsChange,
}: ManageProductOptionGroupsModalProps) {
  const initialSelectedGroup = optionGroups.find(
    (group) => group.id === initialSelectedGroupId,
  );

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(
    initialSelectedGroupId,
  );
  const [groupForm, setGroupForm] = useState<ProductOptionGroupInput>(
    initialSelectedGroup
      ? {
          name: initialSelectedGroup.name,
          is_required: initialSelectedGroup.is_required,
          is_active: initialSelectedGroup.is_active,
          sort_order: initialSelectedGroup.sort_order,
        }
      : { ...emptyGroupForm },
  );
  const [optionForm, setOptionForm] =
    useState<ProductOptionValueInput>(emptyOptionForm);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    null,
  );
  const [isOptionFormOpen, setIsOptionFormOpen] = useState(false);
  const [isSavingGroup, setIsSavingGroup] = useState(false);
  const [isSavingOption, setIsSavingOption] = useState(false);

  const selectedGroup =
    optionGroups.find((group) => group.id === selectedGroupId) ?? null;

  const startNewOption = () => {
    if (!selectedGroup) return;
    setSelectedOptionId(null);
    setIsOptionFormOpen(true);
    setOptionForm({ ...emptyOptionForm });
  };

  const selectOption = (option: ProductOptionValueRow) => {
    setSelectedOptionId(option.id);
    setIsOptionFormOpen(true);
    setOptionForm({
      name: option.name,
      is_active: option.is_active,
      sort_order: option.sort_order,
    });
  };

  const handleGroupSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSavingGroup(true);

    try {
      const savedGroup = await saveProductOptionGroup(
        {
          name: normalizeAdminString(groupForm.name),
          is_required: groupForm.is_required,
          is_active: groupForm.is_active,
          sort_order: normalizeAdminSortOrder(groupForm.sort_order),
        },
        productId,
        selectedGroup?.id ?? undefined,
      );

      notify.success("Grupo guardado.");
      onGroupsChange();

      if (!selectedGroup) {
        setSelectedGroupId(savedGroup.id);
        setSelectedOptionId(null);
        setIsOptionFormOpen(false);
      }
    } catch (error) {
      notify.error(error instanceof Error ? error.message : String(error));
    } finally {
      setIsSavingGroup(false);
    }
  };

  const handleOptionSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedGroup) {
      notify.warning("Selecciona un grupo antes de agregar una opción.");
      return;
    }

    setIsSavingOption(true);

    try {
      await saveProductOptionValue(
        {
          name: normalizeAdminString(optionForm.name),
          is_active: optionForm.is_active,
          sort_order: normalizeAdminSortOrder(optionForm.sort_order),
        },
        selectedGroup.id,
        selectedOptionId ?? undefined,
      );

      notify.success("Opción guardada.");
      onGroupsChange();
      setSelectedOptionId(null);
      setIsOptionFormOpen(false);
      setOptionForm({ ...emptyOptionForm });
    } catch (error) {
      notify.error(error instanceof Error ? error.message : String(error));
    } finally {
      setIsSavingOption(false);
    }
  };

  const handleDeleteOption = async (option: ProductOptionValueRow) => {
    if (!window.confirm(`¿Eliminar la opción ${option.name}?`)) {
      return;
    }

    try {
      await deleteProductOptionValue(option.id);
      notify.success("Opción eliminada.");
      if (selectedOptionId === option.id) {
        setSelectedOptionId(null);
        setIsOptionFormOpen(false);
        setOptionForm({ ...emptyOptionForm });
      }
      onGroupsChange();
    } catch (error) {
      notify.error(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <ButtonSheetModal
      isOpen={isOpen}
      title={selectedGroup ? "Editar grupo" : "Nuevo grupo"}
      description={
        selectedGroup
          ? "Actualiza los datos del grupo y sus opciones."
          : "Completa los datos para crear un nuevo grupo de opciones."
      }
      contentClassName="max-w-lg"
      scrollable={false}
      onClose={onClose}
    >
      <div className="flex max-h-[60dvh] flex-col gap-4 sm:max-h-[65dvh]">
        {/* Group form */}
        <form
          className="shrink-0 grid gap-3"
          onSubmit={handleGroupSubmit}
          noValidate
        >
          <AdminField label="Nombre">
            <input
              className={adminInputClass}
              value={groupForm.name}
              onChange={(event) =>
                setGroupForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              required
            />
          </AdminField>
          <AdminField label="Orden">
            <input
              className={adminInputClass}
              type="number"
              value={groupForm.sort_order}
              onChange={(event) =>
                setGroupForm((current) => ({
                  ...current,
                  sort_order: Number(event.target.value),
                }))
              }
            />
          </AdminField>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Checkbox
              label="Requerido"
              checked={groupForm.is_required}
              onCheckedChange={(checked) =>
                setGroupForm((current) => ({
                  ...current,
                  is_required: checked,
                }))
              }
            />
            <Checkbox
              label="Activo"
              checked={groupForm.is_active}
              onCheckedChange={(checked) =>
                setGroupForm((current) => ({
                  ...current,
                  is_active: checked,
                }))
              }
            />
          </div>
          <button
            type="submit"
            disabled={isSavingGroup}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-black text-primary-foreground disabled:opacity-60"
          >
            <Save className="size-4" />
            {isSavingGroup ? "Guardando" : "Guardar grupo"}
          </button>
        </form>

        {/* Options section */}
        <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-border bg-surface">
          <div className="flex h-full flex-col">
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border p-3 sm:p-4">
              <h3 className="m-0 font-heading text-lg font-black text-foreground">
                Opciones
              </h3>
              <button
                type="button"
                className="inline-flex min-h-9 items-center gap-2 rounded-full border border-primary bg-primary px-3 text-xs font-black text-primary-foreground disabled:opacity-60"
                onClick={startNewOption}
                disabled={!selectedGroup}
              >
                <Plus className="size-4" />
                Agregar
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
              {!selectedGroup ? (
                <EmptyState
                  title="Grupo no guardado"
                  description="Guarda el grupo para administrar sus opciones."
                />
              ) : selectedGroup.product_option_values.length === 0 ? (
                <EmptyState
                  title="Sin opciones"
                  description="Este grupo todavía no tiene opciones."
                  action={
                    <button
                      type="button"
                      className="inline-flex min-h-10 items-center gap-2 rounded-full border border-primary bg-primary px-4 text-xs font-black text-primary-foreground"
                      onClick={startNewOption}
                    >
                      <Plus className="size-4" />
                      Agregar opción
                    </button>
                  }
                />
              ) : (
                <div className="grid gap-2">
                  {selectedGroup.product_option_values.map((option) => (
                    <article
                      key={option.id}
                      className="grid gap-2 rounded-lg border border-border bg-surface-muted p-3 sm:grid-cols-[1fr_auto]"
                    >
                      <button
                        type="button"
                        className="min-w-0 text-left"
                        onClick={() => selectOption(option)}
                      >
                        <span className="block text-sm font-black text-foreground">
                          {option.name}
                        </span>
                        <span className="mt-1 block text-xs font-bold text-muted-foreground">
                          {option.is_active ? "Activa" : "Inactiva"}
                        </span>
                      </button>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition hover:border-primary hover:text-primary"
                          aria-label={`Editar ${option.name}`}
                          onClick={() => selectOption(option)}
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          type="button"
                          className="inline-flex size-9 items-center justify-center rounded-full border border-error-border bg-error-soft text-error"
                          aria-label={`Eliminar ${option.name}`}
                          onClick={() => void handleDeleteOption(option)}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Option form */}
        {selectedGroup && isOptionFormOpen && (
          <form
            className="shrink-0 grid gap-3 rounded-lg border border-border bg-surface-muted p-3"
            onSubmit={handleOptionSubmit}
            noValidate
          >
            <h3 className="m-0 font-heading text-base font-black text-foreground">
              {selectedOptionId ? "Editar opción" : "Nueva opción"}
            </h3>
            <AdminField label="Nombre">
              <input
                className={adminInputClass}
                value={optionForm.name}
                onChange={(event) =>
                  setOptionForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                required
              />
            </AdminField>
            <AdminField label="Orden">
              <input
                className={adminInputClass}
                type="number"
                value={optionForm.sort_order}
                onChange={(event) =>
                  setOptionForm((current) => ({
                    ...current,
                    sort_order: Number(event.target.value),
                  }))
                }
              />
            </AdminField>
            <Checkbox
              label="Activa"
              checked={optionForm.is_active}
              onCheckedChange={(checked) =>
                setOptionForm((current) => ({
                  ...current,
                  is_active: checked,
                }))
              }
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={isSavingOption}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-black text-primary-foreground disabled:opacity-60"
              >
                <Save className="size-4" />
                {isSavingOption ? "Guardando" : "Guardar opción"}
              </button>
              <button
                type="button"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-black text-foreground"
                onClick={() => {
                  setSelectedOptionId(null);
                  setIsOptionFormOpen(false);
                  setOptionForm({ ...emptyOptionForm });
                }}
              >
                <X className="size-4" />
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </ButtonSheetModal>
  );
}
