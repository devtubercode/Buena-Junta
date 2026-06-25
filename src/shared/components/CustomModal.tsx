import { useEffect, useId, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/shared/utils/cn";

type CustomModalProps = {
  isOpen: boolean;
  title: string;
  description?: string;
  icon?: ReactNode;
  contentClassName?: string;
  onClose: () => void;
  children?: ReactNode;
};

export function CustomModal({
  isOpen,
  title,
  description,
  icon,
  contentClassName,
  onClose,
  children,
}: CustomModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-70 flex items-end justify-center bg-foreground/45 px-4 py-4 backdrop-blur-sm sm:items-center"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          "w-full max-w-md rounded-t-2xl border border-border bg-surface p-4 shadow-elevated sm:rounded-2xl sm:p-5",
          contentClassName,
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
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

          <button
            type="button"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Cerrar modal"
            onClick={onClose}
          >
            <X className="size-4" />
          </button>
        </div>

        {children ? (
          <div className="mt-4 text-sm font-medium leading-6 text-muted-foreground">
            {children}
          </div>
        ) : null}
      </section>
    </div>
  );
}
