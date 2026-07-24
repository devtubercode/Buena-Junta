import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/shared/utils/cn";

type ButtonSheetModalProps = {
  isOpen: boolean;
  title: string;
  description?: string;
  icon?: ReactNode;
  contentClassName?: string;
  scrollable?: boolean;
  onClose: () => void;
  children?: ReactNode;
};

export const ButtonSheetModal = ({
  isOpen,
  title,
  description,
  icon,
  contentClassName,
  scrollable = true,
  onClose,
  children,
}: ButtonSheetModalProps) => {
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
  }, [isOpen, onClose]);

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
          "fixed bottom-0 left-0 right-0 z-1001 m-0 w-full max-w-full rounded-t-2xl border border-border bg-surface p-4 shadow-elevated pb-[calc(1rem+env(safe-area-inset-bottom))] sm:inset-0 sm:m-auto sm:w-auto sm:max-w-md sm:rounded-2xl sm:p-5",
          contentClassName,
        )}
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div className="relative flex items-center justify-center px-3 pb-2 pt-3 sm:px-0 sm:pb-0 sm:pt-0">
          <div className="h-1.5 w-12 rounded-full bg-border sm:hidden" />
          <button
            type="button"
            className="absolute right-1 top-1 inline-flex size-11 items-center justify-center rounded-full text-muted-foreground transition hover:text-foreground focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary sm:right-3 sm:top-3 sm:size-9 sm:border sm:border-border sm:hover:border-primary sm:hover:text-primary"
            aria-label="Cerrar modal"
            onClick={onClose}
          >
            <X className="size-5 sm:size-4" />
          </button>
        </div>

        <div className="mb-4 hidden items-start gap-3 sm:flex">
          {icon ? (
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-elevated">
              {icon}
            </span>
          ) : null}
          <div className="min-w-0">
            <h2
              id={titleId}
              className="m-0 font-heading text-2xl font-black leading-tight text-foreground"
            >
              {title}
            </h2>
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

        <div className="sm:hidden">
          <h2
            id={titleId}
            className="m-0 pr-8 font-heading text-2xl font-black leading-tight text-foreground"
          >
            {title}
          </h2>
          {description ? (
            <p
              id={descriptionId}
              className="mt-2 pr-8 text-sm font-medium leading-6 text-muted-foreground"
            >
              {description}
            </p>
          ) : null}
        </div>

        {children ? (
          <div
            className={cn(
              "px-0 pb-0 pt-4 sm:px-0 sm:pt-0",
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
