import { AlertTriangle } from "lucide-react";
import { CustomModal } from "@/shared/components/CustomModal";

type AdminConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function AdminConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
  isConfirming = false,
  onConfirm,
  onCancel,
}: AdminConfirmDialogProps) {
  return (
    <CustomModal
      isOpen={isOpen}
      title={title}
      description={description}
      icon={<AlertTriangle className="size-6" />}
      onClose={onCancel}
    >
      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          disabled={isConfirming}
          onClick={onConfirm}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-error px-5 text-sm font-black text-error-foreground shadow-elevated transition hover:opacity-90 disabled:opacity-60"
        >
          {isConfirming ? "Eliminando..." : confirmLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isConfirming}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-black text-muted-foreground transition hover:border-primary hover:text-primary disabled:opacity-60"
        >
          {cancelLabel}
        </button>
      </div>
    </CustomModal>
  );
}
