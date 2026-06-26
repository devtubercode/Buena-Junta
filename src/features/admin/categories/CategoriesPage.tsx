import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminDataState } from "@/features/admin/shared/state/AdminDataState";
import { AdminSection } from "@/features/admin/shared/components/AdminSection";
import { AdminCategoriesSkeleton } from "@/features/admin/shared/state/AdminSkeletons";
import { useCategoriesData } from "@/features/admin/categories/useCategoriesData";
import { normalizeSlug } from "@/features/admin/shared/utils/adminForms";
import { useAutoSlug } from "@/features/admin/shared/hooks/useAutoSlug";
import { useAdminSaveHandler } from "@/features/admin/shared/hooks/useAdminSaveHandler";
import { notify } from "@/shared/notifications/notify";
import {
  deleteCategory,
  saveCategory,
} from "@/features/admin/categories/services/admin-categories.service";
import { ButtonSheetModal } from "@/shared/components/ButtonSheetModal";
import { InputField } from "@/shared/components/InputField";
import { TextAreaField } from "@/shared/components/TextAreaField";
import {
  categorySchema,
  type CategoryFormData,
} from "@/features/admin/schemas/categorySchema";
import type { CategoryRow } from "@/features/admin/types/categories.types";

const defaultValues: CategoryFormData = {
  slug: "",
  name: "",
  description: null,
  sort_order: 0,
};

export function CategoriesPage() {
  const { data: categories, isLoading, error, reload } = useCategoriesData();
  const [selected, setSelected] = useState<CategoryRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues,
  });

  const { reset, handleSubmit } = form;

  const { isSaving, execute: executeSave } = useAdminSaveHandler<CategoryRow>({
    successMessage: "Categoría guardada.",
    onSuccess: async () => {
      closeModal();
      setSelected(null);
      reset(defaultValues);
      await reload();
    },
  });

  useAutoSlug({
    form,
    source: "name",
    target: "slug",
    isNew: selected === null,
  });

  const openNewCategoryModal = () => {
    setSelected(null);
    reset(defaultValues);
    setIsModalOpen(true);
  };

  const openEditCategoryModal = (category: CategoryRow) => {
    setSelected(category);
    reset({
      slug: category.slug,
      name: category.name,
      description: category.description,
      sort_order: category.sort_order,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onSubmit = async (data: CategoryFormData) => {
    await executeSave(() =>
      saveCategory(
        {
          ...data,
          slug: normalizeSlug(data.slug),
          description: data.description?.trim() || null,
          sort_order: Number(data.sort_order) || 0,
        },
        selected?.id,
      ),
    );
  };

  const handleDelete = async (category: CategoryRow) => {
    if (!window.confirm(`¿Eliminar ${category.name}?`)) {
      return;
    }

    try {
      await deleteCategory(category.id);
      notify.success("Categoría eliminada.");
      if (selected?.id === category.id) {
        setSelected(null);
      }
      await reload();
    } catch (deleteError) {
      notify.error(
        deleteError instanceof Error ? deleteError.message : String(deleteError),
      );
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
          aria-label="Nueva categoría"
          className="inline-flex size-11 items-center justify-center rounded-full border border-primary bg-primary text-primary-foreground shadow-elevated transition hover:opacity-90"
          onClick={openNewCategoryModal}
        >
          <Plus className="size-5" />
        </button>
      }
    >
      <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-elevated">
        <div className="grid grid-cols-[1fr_70px_80px] gap-3 border-b border-border px-4 py-3 text-xs font-black uppercase text-muted-foreground sm:grid-cols-[1fr_90px_80px]">
          <span>Nombre</span>
          <span>Orden</span>
          <span />
        </div>
        {categories.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm font-bold text-muted-foreground">
              No hay categorías creadas todavía.
            </p>
            <button
              type="button"
              className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-primary px-4 text-sm font-black text-primary-foreground"
              onClick={openNewCategoryModal}
            >
              <Plus className="size-4" />
              Crear primera categoría
            </button>
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="grid grid-cols-[1fr_70px_80px] items-center gap-3 border-b border-border px-4 py-3 last:border-b-0 sm:grid-cols-[1fr_90px_80px]"
            >
              <button
                type="button"
                className="min-w-0 text-left"
                onClick={() => openEditCategoryModal(category)}
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
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition hover:border-primary hover:text-primary"
                  onClick={() => openEditCategoryModal(category)}
                  aria-label={`Editar ${category.name}`}
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  type="button"
                  className="inline-flex size-9 items-center justify-center rounded-full border border-error-border bg-error-soft text-error"
                  onClick={() => void handleDelete(category)}
                  aria-label={`Eliminar ${category.name}`}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <ButtonSheetModal
        isOpen={isModalOpen}
        title={selected ? "Editar categoría" : "Nueva categoría"}
        description={
          selected
            ? "Actualiza los datos de la categoría seleccionada."
            : "Completa los datos para crear una nueva categoría."
        }
        contentClassName="max-w-lg"
        onClose={closeModal}
      >
        <form
          className="grid gap-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <InputField
            name="name"
            control={form.control}
            label="Nombre"
            placeholder="Ej: Hamburguesas"
            autoComplete="off"
          />

          <InputField
            name="slug"
            control={form.control}
            label="Slug"
            placeholder="Ej: hamburguesas"
            autoComplete="off"
          />

          <TextAreaField
            name="description"
            form={form}
            label="Descripción"
            placeholder="Descripción opcional de la categoría"
          />

          <InputField
            name="sort_order"
            control={form.control}
            label="Orden"
            type="number"
            min={0}
            step={1}
          />

          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90 disabled:opacity-60"
            >
              <Save className="size-4" />
              {isSaving ? "Guardando" : "Guardar"}
            </button>
            <button
              type="button"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-black text-muted-foreground transition hover:border-primary hover:text-primary"
              onClick={closeModal}
            >
              <X className="size-4" />
              Cancelar
            </button>
          </div>
        </form>
      </ButtonSheetModal>
    </AdminSection>
  );
}
