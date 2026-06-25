import { useEffect, useState, type FormEvent } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { AdminDataState } from "@/features/admin/components/AdminDataState";
import {
  AdminField,
  adminInputClass,
  adminTextareaClass,
} from "@/features/admin/components/AdminField";
import { AdminSection } from "@/features/admin/components/AdminSection";
import { AdminCategoriesSkeleton } from "@/features/admin/components/AdminSkeletons";
import { useAdditionsData } from "@/features/admin/hooks/useAdditionsData";
import { useCategoriesData } from "@/features/admin/hooks/useCategoriesData";
import { normalizeSlug } from "@/features/admin/utils/adminForms";
import { notify } from "@/shared/notifications/notify";
import {
  deleteCategory,
  saveCategory,
} from "@/features/admin/services/admin-categories.service";
import {
  fetchCategoryAdditionIds,
  syncCategoryAdditions,
} from "@/features/admin/services/admin-additions.service";
import type {
  AdditionRow,
  CategoryInput,
  CategoryRow,
} from "@/features/admin/types/admin.types";

const emptyForm: CategoryInput = {
  slug: "",
  name: "",
  description: null,
  sort_order: 0,
};

export function CategoriesPage() {
  const { data: categories, isLoading, error, reload } = useCategoriesData();
  const { data: additionsData } = useAdditionsData();
  const { additions } = additionsData;
  const [selected, setSelected] = useState<CategoryRow | null>(null);
  const [form, setForm] = useState<CategoryInput>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedAdditionIds, setSelectedAdditionIds] = useState<string[]>([]);
  const [isSavingAdditions, setIsSavingAdditions] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadCategoryAdditions = async () => {
      if (!selected) {
        setSelectedAdditionIds([]);
        return;
      }

      try {
        const additionIds = await fetchCategoryAdditionIds(selected.id);
        if (isMounted) {
          setSelectedAdditionIds(additionIds);
        }
      } catch (error) {
        notify.error(error instanceof Error ? error.message : String(error));
      }
    };

    void loadCategoryAdditions();

    return () => {
      isMounted = false;
    };
  }, [selected]);

  const selectCategory = (category: CategoryRow) => {
    setSelected(category);
    setForm({
      slug: category.slug,
      name: category.name,
      description: category.description,
      sort_order: category.sort_order,
    });
  };

  const startNewCategory = () => {
    setSelected(null);
    setForm(emptyForm);
    setSelectedAdditionIds([]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      await saveCategory(
        {
          ...form,
          slug: normalizeSlug(form.slug),
          description: form.description?.trim() || null,
          sort_order: Number(form.sort_order) || 0,
        },
        selected?.id,
      );
      notify.success("Categoría guardada.");
      startNewCategory();
      await reload();
    } catch (error) {
      notify.error(error instanceof Error ? error.message : String(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (category: CategoryRow) => {
    if (!window.confirm(`Eliminar ${category.name}?`)) {
      return;
    }

    try {
      await deleteCategory(category.id);
      notify.success("Categoría eliminada.");
      if (selected?.id === category.id) {
        setSelected(null);
      }
      await reload();
    } catch (error) {
      notify.error(error instanceof Error ? error.message : String(error));
    }
  };

  const toggleAddition = (additionId: string) => {
    setSelectedAdditionIds((current) =>
      current.includes(additionId)
        ? current.filter((currentId) => currentId !== additionId)
        : [...current, additionId],
    );
  };

  const handleSaveCategoryAdditions = async () => {
    if (!selected) {
      notify.warning("Selecciona una categoría primero.");
      return;
    }

    setIsSavingAdditions(true);

    try {
      await syncCategoryAdditions(selected.id, selectedAdditionIds);
      notify.success("Adiciones de la categoría guardadas.");
    } catch (error) {
      notify.error(error instanceof Error ? error.message : String(error));
    } finally {
      setIsSavingAdditions(false);
    }
  };

  if (error) {
    return <AdminDataState isLoading={false} error={error} />;
  }

  if (isLoading) {
    return (
      <AdminSection
        title="Categorías"
        description="Crea y edita las categorías públicas del menú."
      >
        <AdminCategoriesSkeleton />
      </AdminSection>
    );
  }

  return (
    <AdminSection
      title="Categorías"
      description="Crea y edita las categorías públicas del menú."
      actions={
        <button
          type="button"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-primary px-4 text-sm font-black text-primary-foreground"
          onClick={startNewCategory}
        >
          <Plus className="size-4" />
          Nueva
        </button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
        <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-elevated">
          <div className="grid grid-cols-[1fr_90px_80px] gap-3 border-b border-border px-4 py-3 text-xs font-black uppercase text-muted-foreground">
            <span>Nombre</span>
            <span>Orden</span>
            <span />
          </div>
          {categories.map((category) => (
            <div
              key={category.id}
              className="grid grid-cols-[1fr_90px_80px] items-center gap-3 border-b border-border px-4 py-3 last:border-b-0"
            >
              <button
                type="button"
                className="min-w-0 text-left"
                onClick={() => selectCategory(category)}
              >
                <span className="block truncate text-sm font-black text-foreground">
                  {category.name}
                </span>
                <span className="block truncate text-xs font-bold text-muted-foreground">
                  {category.slug}
                </span>
              </button>
              <span className="text-sm font-bold text-muted-foreground">
                {category.sort_order}
              </span>
              <button
                type="button"
                className="inline-flex size-9 items-center justify-center rounded-full border border-error-border bg-error-soft text-error"
                onClick={() => void handleDelete(category)}
                aria-label={`Eliminar ${category.name}`}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="grid gap-4">
          <form
            className="grid content-start gap-4 rounded-lg border border-border bg-surface p-4 shadow-elevated"
            onSubmit={handleSubmit}
          >
            <h2 className="m-0 font-heading text-2xl font-black text-foreground">
              {selected ? "Editar categoría" : "Nueva categoría"}
            </h2>
            <AdminField label="Nombre">
              <input
                className={adminInputClass}
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                    slug: current.slug || normalizeSlug(event.target.value),
                  }))
                }
                required
              />
            </AdminField>
            <AdminField label="Slug">
              <input
                className={adminInputClass}
                value={form.slug}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    slug: normalizeSlug(event.target.value),
                  }))
                }
                required
              />
            </AdminField>
            <AdminField label="Descripción">
              <textarea
                className={adminTextareaClass}
                value={form.description ?? ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
              />
            </AdminField>
            <AdminField label="Orden">
              <input
                className={adminInputClass}
                type="number"
                value={form.sort_order}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    sort_order: Number(event.target.value),
                  }))
                }
              />
            </AdminField>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-black text-primary-foreground disabled:opacity-60"
            >
              <Save className="size-4" />
              {isSaving ? "Guardando" : "Guardar"}
            </button>
          </form>

          <section className="grid gap-4 rounded-lg border border-border bg-surface p-4 shadow-elevated">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="m-0 font-heading text-2xl font-black text-foreground">
                  Adiciones de categoría
                </h2>
                <p className="mt-1 text-xs font-bold text-muted-foreground">
                  {selectedAdditionIds.length} seleccionadas
                </p>
              </div>
            </div>

            {selected ? (
              <>
                <div className="grid gap-2">
                  {additions.length > 0 ? (
                    additions.map((addition: AdditionRow) => {
                      const isSelected = selectedAdditionIds.includes(addition.id);

                      return (
                        <label
                          key={addition.id}
                          className="flex items-start gap-3 rounded-lg border border-border bg-surface-muted p-3"
                        >
                          <input
                            className="mt-1 size-4"
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleAddition(addition.id)}
                          />
                          <span className="min-w-0">
                            <span className="block text-sm font-black text-foreground">
                              {addition.name}
                            </span>
                            <span className="mt-1 block text-xs font-bold text-muted-foreground">
                              ${addition.price}
                            </span>
                          </span>
                        </label>
                      );
                    })
                  ) : (
                    <p className="m-0 rounded-lg border border-border bg-surface-muted p-3 text-sm font-bold text-muted-foreground">
                      No hay adiciones creadas todavía.
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  disabled={isSavingAdditions}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-black text-primary-foreground disabled:opacity-60"
                  onClick={() => void handleSaveCategoryAdditions()}
                >
                  <Save className="size-4" />
                  {isSavingAdditions ? "Guardando" : "Guardar adiciones"}
                </button>
              </>
            ) : (
              <p className="m-0 rounded-lg border border-border bg-surface-muted p-3 text-sm font-bold text-muted-foreground">
                Selecciona una categoría para asignarle adiciones.
              </p>
            )}
          </section>
        </div>
      </div>
    </AdminSection>
  );
}
