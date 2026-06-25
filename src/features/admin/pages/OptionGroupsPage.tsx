import { useMemo, useState, type FormEvent } from "react";
import { Pencil, Plus, Save, Trash2 } from "lucide-react";
import { AdminDataState } from "@/features/admin/components/AdminDataState";
import {
  AdminField,
  adminInputClass,
} from "@/features/admin/components/AdminField";
import { AdminSection } from "@/features/admin/components/AdminSection";
import { useOptionGroupsData } from "@/features/admin/hooks/useOptionGroupsData";
import { notify } from "@/shared/notifications/notify";
import {
  deleteOptionGroup,
  deleteOptionValue,
  saveOptionGroup,
  saveOptionValue,
} from "@/features/admin/services/admin-option-groups.service";
import type {
  OptionGroupInput,
  OptionGroupRow,
  OptionValueInput,
  OptionValueRow,
} from "@/features/admin/types/admin.types";

const emptyGroupForm: OptionGroupInput = {
  name: "",
  is_required: true,
  is_active: true,
  sort_order: 0,
};

const emptyOptionForm: OptionValueInput = {
  option_group_id: "",
  name: "",
  is_active: true,
};

export function OptionGroupsPage() {
  const { data, isLoading, error, reload } = useOptionGroupsData();
  const { option_groups } = data;
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [groupForm, setGroupForm] = useState<OptionGroupInput>(emptyGroupForm);
  const [optionForm, setOptionForm] =
    useState<OptionValueInput>(emptyOptionForm);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isOptionFormOpen, setIsOptionFormOpen] = useState(false);
  const [isSavingGroup, setIsSavingGroup] = useState(false);
  const [isSavingOption, setIsSavingOption] = useState(false);

  const selectedGroup = useMemo(
    () => option_groups.find((group) => group.id === selectedGroupId) ?? null,
    [option_groups, selectedGroupId],
  );

  const startNewGroup = () => {
    setSelectedGroupId(null);
    setSelectedOptionId(null);
    setGroupForm(emptyGroupForm);
    setOptionForm(emptyOptionForm);
    setIsOptionFormOpen(false);
  };

  const selectGroup = (group: OptionGroupRow) => {
    setSelectedGroupId(group.id);
    setGroupForm({
      name: group.name,
      is_required: group.is_required,
      is_active: group.is_active,
      sort_order: group.sort_order,
    });
    setSelectedOptionId(null);
    setIsOptionFormOpen(false);
    setOptionForm({
      ...emptyOptionForm,
      option_group_id: group.id,
    });
  };

  const startNewOption = () => {
    if (!selectedGroup) {
      return;
    }

    setSelectedOptionId(null);
    setIsOptionFormOpen(true);
    setOptionForm({
      ...emptyOptionForm,
      option_group_id: selectedGroup.id,
    });
  };

  const selectOption = (option: OptionValueRow) => {
    setSelectedOptionId(option.id);
    setIsOptionFormOpen(true);
    setOptionForm({
      option_group_id: option.option_group_id,
      name: option.name,
      is_active: option.is_active,
    });
  };

  const handleGroupSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSavingGroup(true);

    try {
      const savedGroup = await saveOptionGroup(
        {
          name: groupForm.name.trim(),
          is_required: groupForm.is_required,
          is_active: groupForm.is_active,
          sort_order: Number(groupForm.sort_order) || 0,
        },
        selectedGroup?.id ?? undefined,
      );

      notify.success("Grupo guardado.");
      await reload();
      selectGroup(savedGroup);
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
      await saveOptionValue(
        {
          option_group_id: selectedGroup.id,
          name: optionForm.name.trim(),
          is_active: optionForm.is_active,
        },
        selectedOptionId ?? undefined,
      );

      notify.success("Opción guardada.");
      await reload();
      setSelectedOptionId(null);
      setIsOptionFormOpen(false);
      setOptionForm({
        ...emptyOptionForm,
        option_group_id: selectedGroup.id,
      });
    } catch (error) {
      notify.error(error instanceof Error ? error.message : String(error));
    } finally {
      setIsSavingOption(false);
    }
  };

  const handleDeleteGroup = async (group: OptionGroupRow) => {
    if (!window.confirm(`Eliminar el grupo ${group.name}?`)) {
      return;
    }

    try {
      await deleteOptionGroup(group.id);
      notify.success("Grupo eliminado.");
      if (selectedGroupId === group.id) {
        startNewGroup();
      }
      await reload();
    } catch (error) {
      notify.error(error instanceof Error ? error.message : String(error));
    }
  };

  const handleDeleteOption = async (option: OptionValueRow) => {
    if (!window.confirm(`Eliminar la opción ${option.name}?`)) {
      return;
    }

    try {
      await deleteOptionValue(option.id);
      notify.success("Opción eliminada.");
      if (selectedOptionId === option.id) {
        setSelectedOptionId(null);
        setIsOptionFormOpen(false);
        setOptionForm({
          ...emptyOptionForm,
          option_group_id: selectedGroup?.id ?? option.option_group_id,
        });
      }
      await reload();
    } catch (error) {
      notify.error(error instanceof Error ? error.message : String(error));
    }
  };

  const state = <AdminDataState isLoading={isLoading} error={error} />;

  if (isLoading || error) {
    return state;
  }

  return (
    <AdminSection
      title="Grupos de opciones"
      description="Gestiona grupos y opciones desde una sola pantalla."
      actions={
        <button
          type="button"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-primary px-4 text-sm font-black text-primary-foreground"
          onClick={startNewGroup}
        >
          <Plus className="size-4" />
          Nuevo grupo
        </button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        <section className="grid gap-2">
          {option_groups.map((group) => {
            const isSelected = group.id === selectedGroupId;

            return (
              <article
                key={group.id}
                className="grid gap-3 rounded-lg border bg-surface p-4 shadow-elevated md:grid-cols-[minmax(0,1fr)_auto] data-[selected=true]:border-primary"
                data-selected={isSelected}
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
                    {group.option_values.length} opciones ·{" "}
                    {group.is_required ? "Requerido" : "Opcional"} ·{" "}
                    {group.is_active ? "Activo" : "Inactivo"}
                  </span>
                </button>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface-muted text-foreground"
                    aria-label={`Editar ${group.name}`}
                    onClick={() => selectGroup(group)}
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex size-9 items-center justify-center rounded-full border border-error-border bg-error-soft text-error"
                    aria-label={`Eliminar ${group.name}`}
                    onClick={() => void handleDeleteGroup(group)}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        <div className="grid gap-4">
          <form
            className="grid content-start gap-4 rounded-lg border border-border bg-surface p-4 shadow-elevated"
            onSubmit={handleGroupSubmit}
          >
            <h2 className="m-0 font-heading text-2xl font-black text-foreground">
              {selectedGroup ? "Editar grupo" : "Nuevo grupo"}
            </h2>
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
            <label className="flex items-center gap-2 text-sm font-black text-foreground">
              <input
                type="checkbox"
                checked={groupForm.is_required}
                onChange={(event) =>
                  setGroupForm((current) => ({
                    ...current,
                    is_required: event.target.checked,
                  }))
                }
              />
              Requerido
            </label>
            <label className="flex items-center gap-2 text-sm font-black text-foreground">
              <input
                type="checkbox"
                checked={groupForm.is_active}
                onChange={(event) =>
                  setGroupForm((current) => ({
                    ...current,
                    is_active: event.target.checked,
                  }))
                }
              />
              Activo
            </label>
            <button
              type="submit"
              disabled={isSavingGroup}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-black text-primary-foreground disabled:opacity-60"
            >
              <Save className="size-4" />
              {isSavingGroup ? "Guardando" : "Guardar grupo"}
            </button>
          </form>

          <section className="grid gap-4 rounded-lg border border-border bg-surface p-4 shadow-elevated">
            <div className="flex items-center justify-between gap-3">
              <h2 className="m-0 font-heading text-2xl font-black text-foreground">
                Opciones
              </h2>
              <button
                type="button"
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-primary bg-primary px-3 text-xs font-black text-primary-foreground sm:px-4"
                onClick={startNewOption}
                disabled={!selectedGroup}
              >
                <Plus className="size-4" />
                Agregar opción
              </button>
            </div>

            {!selectedGroup ? (
              <p className="rounded-lg border border-border bg-surface-muted p-3 text-sm font-medium text-muted-foreground">
                Selecciona o guarda un grupo para administrar sus opciones.
              </p>
            ) : (
              <>
                <div className="grid gap-2">
                  {selectedGroup.option_values.length > 0 ? (
                    selectedGroup.option_values.map((option) => (
                      <article
                        key={option.id}
                        className="grid gap-2 rounded-lg border border-border bg-surface-muted p-3 md:grid-cols-[minmax(0,1fr)_auto]"
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
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface text-foreground"
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
                    ))
                  ) : (
                    <p className="rounded-lg border border-border bg-surface-muted p-3 text-sm font-medium text-muted-foreground">
                      Este grupo todavía no tiene opciones.
                    </p>
                  )}
                </div>

                {selectedGroup && isOptionFormOpen ? (
                  <form
                    className="grid gap-4 rounded-lg border border-border bg-surface-muted p-3"
                    onSubmit={handleOptionSubmit}
                  >
                    <h3 className="m-0 font-heading text-xl font-black text-foreground">
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
                    <label className="flex items-center gap-2 text-sm font-black text-foreground">
                      <input
                        type="checkbox"
                        checked={optionForm.is_active}
                        onChange={(event) =>
                          setOptionForm((current) => ({
                            ...current,
                            is_active: event.target.checked,
                          }))
                        }
                      />
                      Activa
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="submit"
                        disabled={isSavingOption}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-black text-primary-foreground disabled:opacity-60"
                      >
                        <Save className="size-4" />
                        {isSavingOption ? "Guardando" : "Guardar opción"}
                      </button>
                      <button
                        type="button"
                        className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-surface px-4 text-sm font-black text-foreground"
                        onClick={() => {
                          setSelectedOptionId(null);
                          setIsOptionFormOpen(false);
                          setOptionForm({
                            ...emptyOptionForm,
                            option_group_id: selectedGroup.id,
                          });
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                ) : null}
              </>
            )}
          </section>
        </div>
      </div>
    </AdminSection>
  );
}
