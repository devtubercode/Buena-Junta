import { useRef } from "react";
import { ImagePlus, Trash2, Camera } from "lucide-react";
import { getStorageImageUrl } from "@/shared/services/storage.service";
import { SUPABASE_BUCKETS } from "@/lib/supabase/constants";
import { cn } from "@/shared/utils/cn";
import type { ImageUploadAction } from "@/features/admin/shared/hooks/useImageUpload";

interface AdminImageFieldProps {
  imagePreviewUrl: string | null;
  currentImagePath: string | null;
  imageAction: ImageUploadAction;
  onFileChange: (file: File | null) => void;
  onRemove: () => void;
  accept?: string;
  bucket?: string;
  label?: string;
}

export const AdminImageField = ({
  imagePreviewUrl,
  currentImagePath,
  imageAction,
  onFileChange,
  onRemove,
  accept = "image/png,image/jpeg,image/webp",
  bucket = SUPABASE_BUCKETS.PRODUCT_IMAGES,
  label = "Imagen del producto",
}: AdminImageFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const displayImagePath = currentImagePath ?? null;
  const hasImage =
    (imagePreviewUrl || displayImagePath) && imageAction !== "remove";

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onFileChange(file);
    // Reset para permitir re-seleccionar el mismo archivo
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    const acceptableFormats = accept.split(",");
    if (
      file &&
      acceptableFormats.some((type) => file.type.match(type.trim()))
    ) {
      onFileChange(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const triggerFileInput = () => {
    inputRef.current?.click();
  };

  const inputId = `admin-image-field-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="grid gap-3">
      <span className="text-sm font-bold text-foreground">{label}</span>

      <input
        ref={inputRef}
        id={inputId}
        className="sr-only"
        type="file"
        accept={accept}
        onChange={handleFileChange}
      />

      {!hasImage ? (
        <label
          htmlFor={inputId}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-surface-muted p-8 text-center transition-colors hover:border-primary/50 hover:bg-primary-soft/20 focus-within:border-primary focus-within:bg-primary-soft/20"
        >
          <div className="flex items-center justify-center rounded-full bg-surface p-3 shadow-sm transition-transform group-hover:scale-110">
            <ImagePlus className="size-6 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-black text-foreground">
              Arrastra una imagen o haz clic para seleccionar
            </p>
            <p className="text-xs text-muted-foreground">
              Formatos: PNG, JPG, WebP
            </p>
          </div>
        </label>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-surface-muted p-2 shadow-sm">
          <div className="relative">
            <img
              src={
                imagePreviewUrl ??
                (displayImagePath
                  ? getStorageImageUrl(displayImagePath, bucket)
                  : "")
              }
              alt={label}
              className="aspect-video w-full rounded-lg object-cover"
            />

            <div className="absolute bottom-2 left-2">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide",
                  imagePreviewUrl
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface/90 text-muted-foreground backdrop-blur-sm",
                )}
              >
                {imagePreviewUrl ? "Nueva imagen" : "Imagen actual"}
              </span>
            </div>

            <button
              type="button"
              onClick={onRemove}
              className="absolute right-2 top-2 inline-flex min-h-9 min-w-9 items-center justify-center rounded-full bg-surface/90 text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-error hover:text-error-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2"
              aria-label="Quitar imagen"
            >
              <Trash2 className="size-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={triggerFileInput}
            className="mt-2 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 text-xs font-black text-foreground transition-colors hover:border-primary/30 hover:bg-primary-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Camera className="size-4" />
            Cambiar imagen
          </button>
        </div>
      )}
    </div>
  );
};
