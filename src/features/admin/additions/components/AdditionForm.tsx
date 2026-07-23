import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/Button";
import { ButtonSheetModal } from "@/shared/components/ButtonSheetModal";
import { CurrencyField } from "@/shared/components/CurrencyField";
import { InputField } from "@/shared/components/InputField";
import { TextAreaField } from "@/shared/components/TextAreaField";
import { Save, X } from "lucide-react";
import type { AdditionRow } from "@/features/admin/types/additions.types";
import {
  additionSchema,
  type AdditionFormData,
} from "@/features/admin/schemas/additionSchema";
import { saveAddition } from "@/features/admin/additions/services/admin-additions.service";
import {
  useImageUpload,
  type ImageUploadAction,
} from "@/features/admin/shared/hooks/useImageUpload";
import { AdminImageField } from "@/features/admin/shared/components/AdminImageField";
import {
  removeStorageImage,
  uploadStorageImage,
} from "@/shared/services/storage.service";
import {
  SUPABASE_BUCKETS,
  SUPABASE_STORAGE_PATHS,
} from "@/lib/supabase/constants";
import { createOptimizedImageFile } from "@/shared/utils/image-optimizer";
import { notify } from "@/shared/notifications/notify";

const uploadOriginalBackup = async (
  imageFile: File,
  bucket: string,
  pathPrefix: string,
): Promise<void> => {
  try {
    await uploadStorageImage(imageFile, bucket, pathPrefix);
  } catch {
    console.warn("No se pudo guardar la copia original de la imagen.");
  }
};

const resolveAdditionImagePath = async (
  imageFile: File | null,
  imageAction: ImageUploadAction,
  currentImagePath: string | null,
): Promise<{ imagePath: string | null; uploadedPath: string | null }> => {
  if (imageAction === "remove") return { imagePath: null, uploadedPath: null };

  if (imageFile) {
    let fileToUpload: File;
    try {
      fileToUpload = await createOptimizedImageFile(imageFile, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.8,
      });
    } catch (error) {
      console.warn(
        "No se pudo optimizar la imagen; se subirá el original.",
        error,
      );
      fileToUpload = imageFile;
    }

    const uploaded = await uploadStorageImage(
      fileToUpload,
      SUPABASE_BUCKETS.PRODUCT_IMAGES,
      SUPABASE_STORAGE_PATHS.TOPPINGS,
    );

    void uploadOriginalBackup(
      imageFile,
      SUPABASE_BUCKETS.PRODUCT_IMAGES,
      SUPABASE_STORAGE_PATHS.ORIGINAL_TOPPINGS,
    );

    return { imagePath: uploaded, uploadedPath: uploaded };
  }

  return { imagePath: currentImagePath, uploadedPath: null };
};

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
  const [isSaving, setIsSaving] = useState(false);

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

  const {
    imageFile,
    imagePreviewUrl,
    imageAction,
    setSelectedImageFile,
    removeImage,
    resetImageState,
  } = useImageUpload();

  const isNewAddition = addition === null;
  const titleModal = isNewAddition ? "Nueva adición" : "Editar adición";
  const descriptionModal = isNewAddition
    ? "Completa los datos para crear una nueva adición."
    : "Actualiza los datos de la adición seleccionada.";

  const onSubmit = async (data: AdditionFormData) => {
    setIsSaving(true);
    let currentUploadedImagePath: string | null = null;

    try {
      const { imagePath, uploadedPath } = await resolveAdditionImagePath(
        imageFile,
        imageAction,
        addition?.image_path ?? null,
      );

      currentUploadedImagePath = uploadedPath;

      const saved = await saveAddition(
        {
          name: data.name.trim(),
          description: data.description?.trim() || null,
          price: Math.max(0, Number(data.price) || 0),
          image_path: imagePath,
        },
        addition?.id,
      );

      if (
        ["replace", "remove"].includes(imageAction) &&
        addition?.image_path
      ) {
        await removeStorageImage(
          addition.image_path,
          SUPABASE_BUCKETS.PRODUCT_IMAGES,
        );
      }

      resetImageState();
      notify.success("Adición guardada correctamente.");
      onSuccessSaved(saved);
    } catch (error) {
      if (currentUploadedImagePath) {
        await removeStorageImage(
          currentUploadedImagePath,
          SUPABASE_BUCKETS.PRODUCT_IMAGES,
        );
      }
      notify.error(error instanceof Error ? error.message : String(error));
    } finally {
      setIsSaving(false);
    }
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

        <AdminImageField
          imagePreviewUrl={imagePreviewUrl}
          currentImagePath={addition?.image_path ?? null}
          imageAction={imageAction}
          onFileChange={setSelectedImageFile}
          onRemove={removeImage}
          label="Imagen de la adición"
        />

        <TextAreaField
          name="description"
          control={form.control}
          label="Descripción"
          placeholder="Descripción opcional de la adición"
        />

        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <Button
            type="submit"
            variant="primary"
            radius="full"
            size="lg"
            loading={isSaving}
            icon={<Save className="size-4" />}
          >
            {isSaving ? "Guardando..." : "Guardar"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            radius="full"
            size="lg"
            onClick={onCloseModal}
            icon={<X className="size-4" />}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </ButtonSheetModal>
  );
};
