import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";
import { ButtonSheetModal } from "@/shared/components/ButtonSheetModal";
import { InputField } from "@/shared/components/InputField";
import { TextAreaField } from "@/shared/components/TextAreaField";
import { notify } from "@/shared/notifications/notify";
import { useAdminSaveHandler } from "@/features/admin/shared/hooks/useAdminSaveHandler";
import {
  normalizeAdminNullableString,
  normalizeAdminString,
} from "@/features/admin/shared/utils/adminForms";
import {
  deleteAddition,
  saveAddition,
} from "@/features/admin/additions/services/admin-additions.service";
import {
  additionSchema,
  type AdditionFormData,
} from "@/features/admin/schemas/additionSchema";
import type { AdditionRow } from "@/features/admin/types/additions.types";

interface ProductAdditionsSectionProps {
  additions: AdditionRow[];
  productId: string;
  onAdditionsChange: () => void;
}

const defaultValues: AdditionFormData = {
  name: "",
  description: null,
  price: "",
};

export function ProductAdditionsSection({
  additions,
  productId,
  onAdditionsChange,
}: ProductAdditionsSectionProps) {
  const [selectedAddition, setSelectedAddition] =
    useState<AdditionRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<AdditionFormData>({
    resolver: zodResolver(additionSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = form;

  const { isSaving, execute: executeSave } = useAdminSaveHandler<AdditionRow>({
    successMessage: "Adición guardada.",
    onSuccess: () => {
      closeModal();
      setSelectedAddition(null);
      reset(defaultValues);
      onAdditionsChange();
    },
  });

  const startNew = () => {
    setSelectedAddition(null);
    reset(defaultValues);
    setIsModalOpen(true);
  };

  const selectAddition = (addition: AdditionRow) => {
    setSelectedAddition(addition);
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
          name: normalizeAdminString(data.name),
          description: normalizeAdminNullableString(data.description),
          price: Math.max(0, Number(data.price) || 0),
          product_id: productId,
        },
        selectedAddition?.id,
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
      if (selectedAddition?.id === addition.id) {
        setSelectedAddition(null);
        reset(defaultValues);
      }
      onAdditionsChange();
    } catch (error) {
      notify.error(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <section className="grid h-fit min-w-0 content-start gap-4 rounded-lg border border-border bg-surface p-3 shadow-elevated sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="m-0 font-heading text-2xl font-black text-foreground">
            Adiciones
          </h2>
          <p className="mt-1 text-xs font-bold text-muted-foreground">
            {additions.length} adicion{additions.length === 1 ? "" : "es"}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-primary bg-primary px-3 text-xs font-black text-primary-foreground sm:px-4"
          onClick={startNew}
        >
          <Plus className="size-4" />
          Nueva
        </button>
      </div>

      {additions.length > 0 ? (
        <div className="grid max-h-[400px] gap-2 overflow-y-auto pr-1">
          {additions.map((addition) => (
            <article
              key={addition.id}
              className="grid gap-2 rounded-lg border border-border bg-surface-muted p-3 sm:grid-cols-[1fr_auto]"
            >
              <button
                type="button"
                className="min-w-0 text-left"
                onClick={() => selectAddition(addition)}
              >
                <span className="block text-sm font-black text-foreground">
                  {addition.name}
                </span>
                <span className="mt-1 block text-xs font-bold text-muted-foreground">
                  ${addition.price}
                  {addition.description
                    ? ` · ${addition.description}`
                    : ""}
                </span>
              </button>
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition hover:border-primary hover:text-primary"
                  onClick={() => selectAddition(addition)}
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
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Sin adiciones"
          description="Este producto no tiene adiciones configuradas."
          action={
            <button
              type="button"
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-primary bg-primary px-4 text-xs font-black text-primary-foreground"
              onClick={startNew}
            >
              <Plus className="size-4" />
              Nueva adición
            </button>
          }
        />
      )}

      <ButtonSheetModal
        isOpen={isModalOpen}
        title={selectedAddition ? "Editar adición" : "Nueva adición"}
        description={
          selectedAddition
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
    </section>
  );
}
