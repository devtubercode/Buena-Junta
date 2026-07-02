import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";
import { ButtonSheetModal } from "@/shared/components/ButtonSheetModal";
import { InputField } from "@/shared/components/InputField";
import { TextAreaField } from "@/shared/components/TextAreaField";
import { useSaveHandler } from "@/features/admin/shared/hooks/useSaveHandler";

import { saveAddition } from "@/features/admin/additions/services/admin-additions.service";
import {
  additionSchema,
  type AdditionFormData,
} from "@/features/admin/schemas/additionSchema";
import type { AdditionRow } from "@/features/admin/types/additions.types";

interface ProductAdditionModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  addition: AdditionRow | null;
  onSaved?: () => void;
}

const defaultValues: AdditionFormData = {
  name: "",
  description: null,
  price: "",
};

export function ProductAdditionModal({
  isOpen,
  onClose,
  productId,
  addition,
  onSaved = () => {},
}: ProductAdditionModalProps) {
  const form = useForm<AdditionFormData>({
    resolver: zodResolver(additionSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = form;
  const isNew = useMemo(() => addition === null, [addition]);

  useEffect(() => {
    if (addition) {
      reset({
        name: addition.name,
        description: addition.description,
        price: String(addition.price),
      });
    } else {
      reset(defaultValues);
    }
  }, [addition, reset, isOpen]);

  const { isSaving, execute: executeSave } = useSaveHandler<AdditionRow>({
    successMessage: "Adición guardada.",
    onSuccess: () => {
      onClose();
      onSaved();
    },
  });

  const onSubmit = async (data: AdditionFormData) => {
    await executeSave(() =>
      saveAddition(
        {
          name: data.name.trim(),
          description: data.description?.trim() || "",
          price: Math.max(0, Number(data.price) || 0),
          product_id: productId,
        },
        addition?.id,
      ),
    );
  };

  return (
    <ButtonSheetModal
      isOpen={isOpen}
      title={isNew ? "Nueva adición" : "Editar adición"}
      description={
        isNew
          ? "Completa los datos para crear una nueva adición."
          : "Actualiza los datos de la adición seleccionada."
      }
      contentClassName="max-w-lg"
      onClose={onClose}
    >
      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            name="name"
            control={form.control}
            label="Nombre"
            placeholder="Ej: Queso extra"
            autoComplete="off"
          />

          <InputField
            name="price"
            control={form.control}
            label="Precio"
            type="number"
            min={0}
            step={1}
          />
        </div>

        <TextAreaField
          name="description"
          control={form.control}
          label="Descripción"
          placeholder="Descripción opcional de la adición"
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
            onClick={onClose}
          >
            <X className="size-4" />
            Cancelar
          </button>
        </div>
      </form>
    </ButtonSheetModal>
  );
}
