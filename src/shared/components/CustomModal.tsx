import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/shared/utils/cn";

type CustomModalProps = {
  isOpen: boolean;
  title?: string;
  description?: string;
  icon?: ReactNode;
  contentClassName?: string;
  scrollable?: boolean;
  onClose: () => void;
  children?: ReactNode;
};

export const CustomModal = ({
  isOpen,
  title,
  description,
  icon,
  contentClassName,
  scrollable = true,
  onClose,
  children,
}: CustomModalProps) => {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.show();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-1000 bg-foreground/45 backdrop-blur-sm animate-fade-in"
          onClick={onClose}
        />
      )}
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-1001 m-0 w-full max-w-full rounded-t-2xl border border-border bg-surface p-5 shadow-elevated sm:inset-0 sm:m-auto sm:w-auto sm:max-w-md sm:rounded-2xl sm:p-6",
          contentClassName,
        )}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
      >
        <div className="mb-4 flex items-start gap-3">
          {icon ? (
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-elevated">
              {icon}
            </span>
          ) : null}
          <div className="min-w-0">
            {title ? (
              <h2
                id={titleId}
                className="m-0 font-heading text-2xl font-black leading-tight text-foreground"
              >
                {title}
              </h2>
            ) : null}
            {description ? (
              <p
                id={descriptionId}
                className="mt-2 text-sm font-medium leading-6 text-muted-foreground"
              >
                {description}
              </p>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          className="inline-flex absolute top-3 right-3 size-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label="Cerrar modal"
          onClick={onClose}
        >
          <X className="size-4" />
        </button>

        {children ? (
          <div
            className={cn(
              scrollable &&
                "max-h-[70dvh] overflow-y-auto sm:max-h-[80dvh] sm:overflow-y-auto",
            )}
          >
            {children}
          </div>
        ) : null}
      </dialog>
    </>
  );
};
