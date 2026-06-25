import { useEffect, useId, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/shared/utils/cn";

type ButtonSheetModalProps = {
  isOpen: boolean;
  title: string;
  description?: string;
  icon?: ReactNode;
  contentClassName?: string;
  onClose: () => void;
  children?: ReactNode;
};

export function ButtonSheetModal({
  isOpen,
  title,
  description,
  icon,
  contentClassName,
  onClose,
  children,
}: ButtonSheetModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const frameId = requestAnimationFrame(() => setIsVisible(true));

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-70 flex items-end justify-center bg-foreground/45 px-0 py-0 backdrop-blur-sm sm:items-center sm:px-4 sm:py-4"
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
          "w-full max-w-md rounded-t-2xl border border-border bg-surface p-4 shadow-elevated transition-transform duration-300 ease-out sm:rounded-2xl sm:p-5",
          isVisible ? "translate-y-0" : "translate-y-full",
          contentClassName,
        )}
      >
        <div className="relative flex items-start justify-between px-3 pb-2 pt-3 sm:px-0 sm:pb-0 sm:pt-0">
          <div className="h-1.5 w-12 rounded-full bg-border sm:hidden" />
          <button
            type="button"
            className="inline-flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:size-9"
            aria-label="Cerrar modal"
            onClick={onClose}
          >
            <X className="size-4" />
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

        {children ? (
          <div className="max-h-[70dvh] overflow-y-auto px-0 pb-0 pt-4 sm:max-h-none sm:overflow-visible sm:px-0 sm:pt-0">
            {children}
          </div>
        ) : null}
      </section>
    </div>
  );
}
