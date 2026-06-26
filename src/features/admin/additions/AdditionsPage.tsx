import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminDataState } from "@/features/admin/shared/state/AdminDataState";
import { AdminSection } from "@/features/admin/shared/components/AdminSection";
import { AdminAdditionsSkeleton } from "@/features/admin/shared/state/AdminSkeletons";
import { useAdditionsData } from "@/features/admin/additions/useAdditionsData";
import { useAdminSaveHandler } from "@/features/admin/shared/hooks/useAdminSaveHandler";
import { notify } from "@/shared/notifications/notify";
import {
  deleteAddition,
  saveAddition,
} from "@/features/admin/additions/services/admin-additions.service";
import { ButtonSheetModal } from "@/shared/components/ButtonSheetModal";
import { InputField } from "@/shared/components/InputField";
import { TextAreaField } from "@/shared/components/TextAreaField";
import {
  additionSchema,
  type AdditionFormData,
} from "@/features/admin/schemas/additionSchema";
import type { AdditionRow } from "@/features/admin/types/additions.types";

const defaultValues: AdditionFormData = {
  name: "",
  description: null,
  price: "",
};

export function AdditionsPage() {
  const { data: additions, isLoading, error, reload } = useAdditionsData();
  const [selected, setSelected] = useState<AdditionRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<AdditionFormData>({
    resolver: zodResolver(additionSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = form;

  const { isSaving, execute: executeSave } = useAdminSaveHandler<AdditionRow>({
    successMessage: "Adición guardada.",
    onSuccess: async () => {
      closeModal();
      setSelected(null);
      reset(defaultValues);
      await reload();
    },
  });

  const openNewAdditionModal = () => {
    setSelected(null);
    reset(defaultValues);
    setIsModalOpen(true);
  };

  const openEditAdditionModal = (addition: AdditionRow) => {
    setSelected(addition);
    reset({
      name: addition.name,
      description: addition.description,
      price: String(addition.price),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onSubmit = async (data: AdditionFormData) => {
    await executeSave(() =>
      saveAddition(
        {
          name: data.name.trim(),
          description: data.description?.trim() || null,
          price: Math.max(0, Number(data.price) || 0),
        },
        selected?.id,
      ),
    );
  };

  const handleDelete = async (addition: AdditionRow) => {
    if (!window.confirm(`¿Eliminar ${addition.name}?`)) {
      return;
    }

    try {
      await deleteAddition(addition.id);
      notify.success("Adición eliminada.");
      if (selected?.id === addition.id) {
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
        title="Adiciones"
        description="Gestiona las adiciones globales reutilizables."
      >
        <AdminAdditionsSkeleton />
      </AdminSection>
    );
  }

  return (
    <AdminSection
      title="Adiciones"
      description="Gestiona las adiciones globales reutilizables."
      actions={
        <button
          type="button"
          aria-label="Nueva adición"
          className="inline-flex size-11 items-center justify-center rounded-full border border-primary bg-primary text-primary-foreground shadow-elevated transition hover:opacity-90"
          onClick={openNewAdditionModal}
        >
          <Plus className="size-5" />
        </button>
      }
    >
      <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-elevated">
        <div className="grid grid-cols-[1fr_90px_80px] gap-3 border-b border-border px-4 py-3 text-xs font-black uppercase text-muted-foreground sm:grid-cols-[1fr_120px_80px]">
          <span>Nombre</span>
          <span>Precio</span>
          <span />
        </div>
        {additions.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm font-bold text-muted-foreground">
              No hay adiciones creadas todavía.
            </p>
            <button
              type="button"
              className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-primary px-4 text-sm font-black text-primary-foreground"
              onClick={openNewAdditionModal}
            >
              <Plus className="size-4" />
              Crear primera adición
            </button>
          </div>
        ) : (
          additions.map((addition) => (
            <div
              key={addition.id}
              className="grid grid-cols-[1fr_90px_80px] items-center gap-3 border-b border-border px-4 py-3 last:border-b-0 sm:grid-cols-[1fr_120px_80px]"
            >
              <button
                type="button"
                className="min-w-0 text-left"
                onClick={() => openEditAdditionModal(addition)}
              >
                <span className="block truncate text-sm font-black text-foreground">
                  {addition.name}
                </span>
                <span className="block truncate text-xs font-bold text-muted-foreground">
                  {addition.description ?? "Sin descripción"}
                </span>
              </button>
              <span className="text-sm font-bold text-muted-foreground">
                ${addition.price}
              </span>
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition hover:border-primary hover:text-primary"
                  onClick={() => openEditAdditionModal(addition)}
                  aria-label={`Editar ${addition.name}`}
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  type="button"
                  className="inline-flex size-9 items-center justify-center rounded-full border border-error-border bg-error-soft text-error"
                  onClick={() => void handleDelete(addition)}
                  aria-label={`Eliminar ${addition.name}`}
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
        title={selected ? "Editar adición" : "Nueva adición"}
        description={
          selected
            ? "Actualiza los datos de la adición seleccionada."
            : "Completa los datos para crear una nueva adición."
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
            placeholder="Ej: Queso extra"
            autoComplete="off"
          />

          <TextAreaField
            name="description"
            form={form}
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
