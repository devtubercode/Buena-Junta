import { Plus, Save, X } from "lucide-react";
import { AdminDataState } from "@/features/admin/shared/state/AdminDataState";
import { AdminSection } from "@/features/admin/shared/components/AdminSection";
import { AdminAdditionsSkeleton } from "@/features/admin/shared/state/AdminSkeletons";
import { useAdditionsData } from "@/features/admin/additions/hooks/useAdditionsData";
import { useAdminAdditionDelete } from "@/features/admin/additions/hooks/useAdminAdditionDelete";
import { useAdminAdditionForm } from "@/features/admin/additions/hooks/useAdminAdditionForm";
import { ButtonSheetModal } from "@/shared/components/ButtonSheetModal";
import { InputField } from "@/shared/components/InputField";
import { TextAreaField } from "@/shared/components/TextAreaField";
import { AdditionList } from "@/features/admin/additions/components/AdditionList";
import { AdditionEmptyState } from "@/features/admin/additions/components/AdditionEmptyState";

export function AdditionsPage() {
  const { data: additions, isLoading, error, reload } = useAdditionsData();

  const { handleDelete, ConfirmDialog: AdditionDeleteDialog } =
    useAdminAdditionDelete(reload);

  const {
    form,
    isSaving,
    selected,
    isOpen,
    openNew,
    openEdit,
    close,
    onSubmit,
  } = useAdminAdditionForm(reload);

  if (error) {
    return <AdminDataState isLoading={false} error={error} />;
  }

  if (isLoading) {
    return (
      <AdminSection
        title="Adiciones"
        description="Gestiona las adiciones globales reutilizables."
      >
        <AdminAdditionsSkeleton />
      </AdminSection>
    );
  }

  const hasAdditions = additions.length > 0;

  return (
    <AdminSection
      title="Adiciones"
      description="Gestiona las adiciones globales reutilizables."
      actions={
        <button
          type="button"
          onClick={openNew}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-primary px-4 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90"
        >
          <Plus className="size-4" />
          Nueva adición
        </button>
      }
    >
      {!hasAdditions ? (
        <AdditionEmptyState type="empty" onCreate={openNew} />
      ) : (
        <AdditionList
          additions={additions}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      )}

      <ButtonSheetModal
        isOpen={isOpen}
        title={selected ? "Editar adición" : "Nueva adición"}
        description={
          selected
            ? "Actualiza los datos de la adición seleccionada."
            : "Completa los datos para crear una nueva adición."
        }
        contentClassName="max-w-lg"
        onClose={close}
      >
        <form className="grid gap-4" onSubmit={onSubmit} noValidate>
          <InputField
            name="name"
            control={form.control}
            label="Nombre"
            placeholder="Ej: Queso extra"
            autoComplete="off"
          />

          <TextAreaField
            name="description"
            control={form.control}
            label="Descripción"
            placeholder="Descripción opcional de la adición"
          />

          <InputField
            name="price"
            control={form.control}
            label="Precio"
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
              onClick={close}
            >
              <X className="size-4" />
              Cancelar
            </button>
          </div>
        </form>
      </ButtonSheetModal>

      <AdditionDeleteDialog />
    </AdminSection>
  );
}
