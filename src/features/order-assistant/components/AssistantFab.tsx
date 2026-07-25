import { WandSparkles } from "lucide-react";
import { cn } from "@/shared/utils/cn";

type AssistantFabProps = {
  onClick: () => void;
};

export function AssistantFab({ onClick }: AssistantFabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Abrir asistente de pedido"
      className={cn(
        "fixed bottom-6 left-4 z-50",
        "sm:bottom-8 sm:left-8",
        "inline-flex items-center justify-center gap-2",
        "size-14 sm:size-auto sm:min-h-14 sm:px-5",
        "rounded-full bg-primary text-primary-foreground",
        "shadow-elevated transition-all duration-300 ease-out",
        "hover:scale-105 hover:shadow-lg",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        "animate-fade-slide-up",
      )}
    >
      <WandSparkles className="size-6 shrink-0 sm:size-5" />
      <span className="hidden text-sm font-black whitespace-nowrap sm:inline">
        Ayúdame a elegir
      </span>
    </button>
  );
}
