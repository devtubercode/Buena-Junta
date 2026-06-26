import { ImagePlus, Trash2 } from "lucide-react";
import { AdminField, adminInputClass } from "@/features/admin/components/AdminField";
import { getStorageImageUrl } from "@/shared/services/storage.service";

interface AdminImageFieldProps {
  imagePreviewUrl: string | null;
  currentImagePath: string | null;
  shouldRemoveImage: boolean;
  onFileChange: (file: File | null) => void;
  onRemove: () => void;
  alt: string;
  bucket: string;
  accept?: string;
}

export function AdminImageField({
  imagePreviewUrl,
  currentImagePath,
  shouldRemoveImage,
  onFileChange,
  onRemove,
  alt,
  bucket,
  accept = "image/png,image/jpeg,image/webp",
}: AdminImageFieldProps) {
  const displayImagePath = currentImagePath ?? null;

  return (
    <div className="grid gap-2">
      <AdminField label="Imagen">
        <input
          className={adminInputClass}
          type="file"
          accept={accept}
          onChange={(event) => {
            onFileChange(event.target.files?.[0] ?? null);
          }}
        />
      </AdminField>

      {(imagePreviewUrl || displayImagePath) && !shouldRemoveImage ? (
        <div className="grid gap-2 rounded-lg border border-border bg-surface-muted p-3">
          <img
            src={
              imagePreviewUrl ??
              (displayImagePath ? getStorageImageUrl(displayImagePath, bucket) : "")
            }
            alt={alt}
            className="aspect-video rounded-md object-cover"
          />
          <button
            type="button"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-error-border bg-error-soft px-4 text-xs font-black text-error"
            onClick={onRemove}
          >
            <Trash2 className="size-4" />
            Quitar imagen
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-muted p-3 text-xs font-bold text-muted-foreground">
          <ImagePlus className="size-4" />
          Sin imagen seleccionada
        </div>
      )}
    </div>
  );
}
