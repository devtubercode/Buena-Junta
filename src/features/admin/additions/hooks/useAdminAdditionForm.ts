import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAdminCrudModal } from "@/features/admin/shared/hooks/useAdminCrudModal";
import { useAdminSaveHandler } from "@/features/admin/shared/hooks/useAdminSaveHandler";
import {
  additionSchema,
  type AdditionFormData,
} from "@/features/admin/schemas/additionSchema";
import { saveAddition } from "@/features/admin/additions/services/admin-additions.service";
import type { AdditionRow } from "@/features/admin/types/additions.types";

const defaultValues: AdditionFormData = {
  name: "",
  description: null,
  price: "",
};

type UseAdminAdditionFormResult = {
  form: UseFormReturn<AdditionFormData>;
  isSaving: boolean;
  selected: AdditionRow | null;
  isOpen: boolean;
  openNew: () => void;
  openEdit: (addition: AdditionRow) => void;
  close: () => void;
  onSubmit: () => Promise<void>;
};

export function useAdminAdditionForm(
  onSaved: () => Promise<void>,
): UseAdminAdditionFormResult {
  const { selected, isOpen, openNew, openEdit, close } =
    useAdminCrudModal<AdditionRow>();

  const form = useForm<AdditionFormData>({
    resolver: zodResolver(additionSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = form;

  const { isSaving, execute: executeSave } = useAdminSaveHandler<AdditionRow>({
    successMessage: "Adición guardada.",
    onSuccess: async () => {
      close();
      reset(defaultValues);
      await onSaved();
    },
  });

  const handleOpenNew = () => {
    reset(defaultValues);
    openNew();
  };

  const handleOpenEdit = (addition: AdditionRow) => {
    reset({
      name: addition.name,
      description: addition.description,
      price: String(addition.price),
    });
    openEdit(addition);
  };

  const onSubmit = handleSubmit(async (data) => {
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
  });

  return {
    form,
    isSaving,
    selected,
    isOpen,
    openNew: handleOpenNew,
    openEdit: handleOpenEdit,
    close,
    onSubmit,
  };
}
