import { X, Sparkles, AlertTriangle } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Button } from "@/shared/components/Button";
import { AssistantForm } from "@/features/order-assistant/components/AssistantForm";
import { SuggestedOrderReview } from "@/features/order-assistant/components/SuggestedOrderReview";
import GeneratingSuggestion from "@/features/order-assistant/components/GeneratingSuggestion";
import type {
  OrderAssistantStep,
  SuggestionFormData,
  SuggestedOrder,
  OrderAssistantActions,
} from "@/features/order-assistant/types/order-assistant.types";
import type {
  MenuCategory,
  MenuProduct,
} from "@/features/menu/types/menu.types";
import type { Promotion } from "@/features/home/types/promotion.types";

type AssistantDrawerProps = {
  isOpen: boolean;
  step: OrderAssistantStep;
  formData: SuggestionFormData;
  suggestion: SuggestedOrder | null;
  error: string | null;
  categories: MenuCategory[];
  products: MenuProduct[];
  promotions: Promotion[];
  actions: OrderAssistantActions;
  onClose: () => void;
};

function StepContent({
  step,
  formData,
  suggestion,
  error,
  categories,
  products,
  promotions,
  actions,
}: {
  step: OrderAssistantStep;
  formData: SuggestionFormData;
  suggestion: SuggestedOrder | null;
  error: string | null;
  categories: MenuCategory[];
  products: MenuProduct[];
  promotions: Promotion[];
  actions: OrderAssistantActions;
}) {
  const regenerate = () =>
    actions.generateSuggestion(products, categories, promotions);

  switch (step) {
    case "form":
      return (
        <AssistantForm
          formData={formData}
          categories={categories}
          onChange={actions.updateFormData}
          onSubmit={regenerate}
        />
      );

    case "generating":
      return <GeneratingSuggestion />;

    case "review":
      if (!suggestion) return null;
      return (
        <SuggestedOrderReview
          suggestion={suggestion}
          products={products}
          promotions={promotions}
          onUpdateQuantity={actions.updateItemQuantity}
          onRemoveItem={actions.removeItem}
          onUpdateConfiguration={actions.updateItemConfiguration}
          onAddAllToCart={actions.addAllToCart}
          onRegenerate={regenerate}
          onBack={() => actions.reset()}
        />
      );

    case "error":
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-6 inline-flex rounded-full bg-red-50 p-4 dark:bg-red-900/20">
            <AlertTriangle
              className="size-10 text-red-500"
              aria-hidden="true"
            />
          </div>
          <h3 className="font-heading text-lg font-black text-foreground">
            Algo salió mal
          </h3>
          <p className="mt-2 max-w-64 text-sm text-muted-foreground">
            {error ?? "No pudimos generar una sugerencia. Intenta de nuevo."}
          </p>
          <Button
            type="button"
            variant="primary"
            size="md"
            radius="full"
            className="mt-6"
            onClick={regenerate}
          >
            Intentar de nuevo
          </Button>
        </div>
      );

    default:
      return null;
  }
}

export function AssistantDrawer({
  isOpen,
  step,
  formData,
  suggestion,
  error,
  categories,
  products,
  promotions,
  actions,
  onClose,
}: AssistantDrawerProps) {
  const handleClose = () => {
    actions.reset();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-1000 bg-black/50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-1001 flex w-full flex-col bg-background shadow-elevated transition-transform duration-300 ease-out sm:max-w-md",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-label="Asistente de pedido"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" aria-hidden="true" />
            <h2 className="font-heading text-lg font-black text-foreground">
              Asistente de pedido
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar asistente"
            className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-black/5 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content - scrollable */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
          <StepContent
            step={step}
            formData={formData}
            suggestion={suggestion}
            error={error}
            categories={categories}
            products={products}
            promotions={promotions}
            actions={actions}
          />
        </div>
      </aside>
    </>
  );
}
