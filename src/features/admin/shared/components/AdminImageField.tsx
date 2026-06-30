import { ImagePlus, Trash2 } from "lucide-react";
import {
  AdminField,
  adminInputClass,
} from "@/features/admin/shared/components/AdminField";
import { getStorageImageUrl } from "@/shared/services/storage.service";
import { SUPABASE_BUCKETS } from "@/lib/supabase/constants";
import { cn } from "@/shared/utils/cn";

interface AdminImageFieldProps {
  imagePreviewUrl: string | null;
  currentImagePath: string | null;
  shouldRemoveImage: boolean;
  onFileChange: (file: File | null) => void;
  onRemove: () => void;
  alt: string;
  accept?: string;
  bucket?: string;
  label?: string;
}

export function AdminImageField({
  imagePreviewUrl,
  currentImagePath,
  shouldRemoveImage,
  onFileChange,
  onRemove,
  alt,
  accept = "image/png,image/jpeg,image/webp",
  bucket = SUPABASE_BUCKETS.PRODUCT_IMAGES,
  label = "Imagen del producto",
}: AdminImageFieldProps) {
  const displayImagePath = currentImagePath ?? null;

  return (
    <div className="grid gap-2">
      <AdminField label={label}>
        <input
          className={cn(
            adminInputClass,
            "file:mr-4 file:rounded-md file:border-0 file:bg-primary-soft file:px-3 file:py-1.5 file:text-xs file:font-black file:text-primary transition hover:file:bg-primary/20",
          )}
          type="file"
          accept={accept}
          onChange={(event) => {
            onFileChange(event.target.files?.[0] ?? null);
          }}
        />
      </AdminField>

      {(imagePreviewUrl || displayImagePath) && !shouldRemoveImage ? (
        <div className="overflow-hidden rounded-xl border border-border bg-surface-muted p-2 shadow-sm">
          <img
            src={
              imagePreviewUrl ??
              (displayImagePath
                ? getStorageImageUrl(displayImagePath, bucket)
                : "")
            }
            alt={alt}
            className="aspect-video w-full rounded-lg object-cover"
          />
          <button
            type="button"
            className="mt-2 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-error-border bg-error-soft px-4 text-xs font-black text-error transition hover:bg-error hover:text-error-foreground"
            onClick={onRemove}
          >
            <Trash2 className="size-4" />
            Quitar imagen
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface-muted p-6 text-center text-muted-foreground">
          <ImagePlus className="size-8" />
          <span className="text-xs font-black">Sin imagen seleccionada</span>
        </div>
      )}
    </div>
  );
}
