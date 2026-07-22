import { ButtonSheetModal } from "@/shared/components/ButtonSheetModal";
import { CurrencyField } from "@/shared/components/CurrencyField";
import { InputField } from "@/shared/components/InputField";
import { TextAreaField } from "@/shared/components/TextAreaField";
import { Save, X } from "lucide-react";
import type { AdditionRow } from "@/features/admin/types/additions.types";
import { useSaveHandler } from "@/features/admin/shared/hooks/useSaveHandler";
import {
  additionSchema,
  type AdditionFormData,
} from "@/features/admin/schemas/additionSchema";
import { saveAddition } from "@/features/admin/additions/services/admin-additions.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type AdditionFormProps = {
  onCloseModal: () => void;
  addition: AdditionRow | null;
  onSuccessSaved: (addition: AdditionRow) => void;
};

const defaultValues: AdditionFormData = {
  name: "",
  description: null,
  price: "",
};

export const AdditionForm = ({
  onCloseModal,
  addition,
  onSuccessSaved,
}: AdditionFormProps) => {
  const form = useForm<AdditionFormData>({
    resolver: zodResolver(additionSchema),
    values: addition
      ? {
          name: addition.name,
          description: addition.description,
          price: String(addition.price),
        }
      : defaultValues,
  });

  const savedHandler = useSaveHandler<AdditionRow>({
    successMessage: "Adición guardada correctamente.",
    onSuccess: onSuccessSaved,
  });

  const isNewAddition = addition === null;
  const titleModal = isNewAddition ? "Nueva adición" : "Editar adición";
  const descriptionModal = isNewAddition
    ? "Completa los datos para crear una nueva adición."
    : "Actualiza los datos de la adición seleccionada.";

  const onSubmit = async (data: AdditionFormData) => {
    await savedHandler.execute(() =>
      saveAddition(
        {
          name: data.name.trim(),
          description: data.description?.trim() || null,
          price: Math.max(0, Number(data.price) || 0),
        },
        addition?.id,
      ),
    );
  };

  return (
    <ButtonSheetModal
      isOpen={true}
      title={titleModal}
      description={descriptionModal}
      contentClassName="max-w-lg"
      onClose={onCloseModal}
    >
      <form
        className="grid gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <InputField
          name="name"
          control={form.control}
          label="Nombre"
          placeholder="Ej: Queso extra"
          autoComplete="off"
        />

        <CurrencyField
          name="price"
          control={form.control}
          label="Precio"
          placeholder="Ej: 5.000"
        />

        <TextAreaField
          name="description"
          control={form.control}
          label="Descripción"
          placeholder="Descripción opcional de la adición"
        />

        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <button
            type="submit"
            disabled={savedHandler.isSaving}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90 disabled:opacity-60"
          >
            <Save className="size-4" />
            {savedHandler.isSaving ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="button"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-black text-muted-foreground transition hover:border-primary hover:text-primary"
            onClick={onCloseModal}
          >
            <X className="size-4" />
            Cancelar
          </button>
        </div>
      </form>
    </ButtonSheetModal>
  );
};
