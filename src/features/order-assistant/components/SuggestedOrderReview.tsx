import { AlertTriangle, Check, ShoppingBag, Sparkles, ChevronLeft } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Button } from "@/shared/components/Button";
import { formatCOP } from "@/features/cart/utils/money";
import { useMemo } from "react";
import { SuggestedOrderItem } from "@/features/order-assistant/components/SuggestedOrderItem";
import type { SuggestedOrder } from "@/features/order-assistant/types/order-assistant.types";
import type { MenuProduct } from "@/features/menu/types/menu.types";
import type { ProductCustomizationOutput } from "@/shared/components/product/types";

type SuggestedOrderReviewProps = {
  suggestion: SuggestedOrder;
  products: MenuProduct[];
  onUpdateQuantity: (lineId: string, quantity: number) => void;
  onRemoveItem: (lineId: string) => void;
  onUpdateConfiguration: (lineId: string, output: ProductCustomizationOutput) => void;
  onAddAllToCart: () => void;
  onRegenerate: () => void;
  onBack: () => void;
};

function BudgetIndicator({
  withinBudget,
  budgetMargin,
  total,
}: {
  withinBudget: boolean;
  budgetMargin: number;
  total: number;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-3",
        withinBudget
          ? "border-green-200 bg-green-50 dark:border-green-900/40 dark:bg-green-900/10"
          : "border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-900/10",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {withinBudget ? (
            <Check className="size-5 shrink-0 text-green-600 dark:text-green-400" />
          ) : (
            <AlertTriangle className="size-5 shrink-0 text-red-600 dark:text-red-400" />
          )}
          <span
            className={cn(
              "text-sm font-black",
              withinBudget
                ? "text-green-800 dark:text-green-300"
                : "text-red-800 dark:text-red-300",
            )}
          >
            {withinBudget
              ? "Dentro del presupuesto"
              : `Excede por ${formatCOP(Math.abs(budgetMargin))}`}
          </span>
        </div>
        <span className="font-heading text-lg font-black text-foreground">
          {formatCOP(total)}
        </span>
      </div>
      {withinBudget && budgetMargin > 0 ? (
        <p className="mt-1 text-xs font-medium text-green-700 dark:text-green-400">
          Te sobran {formatCOP(budgetMargin)}
        </p>
      ) : null}
    </div>
  );
}

export function SuggestedOrderReview({
  suggestion,
  products,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateConfiguration,
  onAddAllToCart,
  onRegenerate,
  onBack,
}: SuggestedOrderReviewProps) {
  const itemCount = suggestion.items.length;
  const hasWarnings = suggestion.explanation.warnings.length > 0;

  const productMap = useMemo(
    () => new Map(products.map((p) => [p.id, p])),
    [products],
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <h2 className="font-heading text-xl font-black text-foreground">
          Pedido sugerido
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Para {suggestion.peopleCount}{" "}
          {suggestion.peopleCount === 1 ? "persona" : "personas"}
          {" · "}
          {itemCount} {itemCount === 1 ? "producto" : "productos"}
        </p>
      </div>

      {/* Budget */}
      <BudgetIndicator
        withinBudget={suggestion.withinBudget}
        budgetMargin={suggestion.budgetMargin}
        total={suggestion.total}
      />

      {/* Items */}
      <section aria-label="Productos sugeridos">
        <ul className="flex flex-col gap-3">
          {suggestion.items.map((item) => (
            <li key={item.lineId}>
              <SuggestedOrderItem
                item={item}
                product={productMap.get(item.productId)!}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemoveItem}
                onUpdateConfiguration={onUpdateConfiguration}
                explanation={suggestion.explanation.perItem[item.lineId]}
              />
            </li>
          ))}
        </ul>
      </section>

      {/* Explanation summary */}
      {suggestion.explanation.summary ? (
        <div className="rounded-xl border border-border bg-surface p-4">
          <h3 className="mb-1 text-xs font-black uppercase tracking-wider text-muted-foreground">
            ¿Por qué esta combinación?
          </h3>
          <p className="text-sm leading-relaxed text-foreground">
            {suggestion.explanation.summary}
          </p>
        </div>
      ) : null}

      {/* Warnings */}
      {hasWarnings ? (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/40 dark:bg-yellow-900/10">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
            <div>
              <h3 className="text-sm font-black text-yellow-800 dark:text-yellow-300">
                Advertencias
              </h3>
              <ul className="mt-1 list-inside list-disc space-y-1 text-xs text-yellow-700 dark:text-yellow-400">
                {suggestion.explanation.warnings.map((warning, idx) => (
                  <li key={idx}>{warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}

      {/* Incomplete items notice */}
      {suggestion.incompleteItemCount > 0 ? (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-900/40 dark:bg-yellow-900/10">
          <p className="text-xs font-bold text-yellow-800 dark:text-yellow-300">
            Hay {suggestion.incompleteItemCount} producto
            {suggestion.incompleteItemCount !== 1 ? "s" : ""} que requieren
            configuración. Ábrelos para personalizarlos.
          </p>
        </div>
      ) : null}

      {/* Total */}
      <div className="flex items-center justify-between gap-3 rounded-xl border border-primary-border bg-primary-soft px-4 py-3">
        <span className="text-sm font-black text-foreground">Total</span>
        <span className="font-heading text-xl font-black leading-none text-primary sm:text-2xl">
          {formatCOP(suggestion.total)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="primary"
          size="lg"
          radius="full"
          fullWidth
          icon={<ShoppingBag className="size-5" />}
          disabled={!suggestion.isComplete}
          onClick={onAddAllToCart}
        >
          Agregar todo al carrito
        </Button>

        <Button
          type="button"
          variant="secondary"
          size="lg"
          radius="full"
          fullWidth
          icon={<Sparkles className="size-5" />}
          onClick={onRegenerate}
        >
          Generar otra opción
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="md"
          fullWidth
          icon={<ChevronLeft className="size-4" />}
          onClick={onBack}
        >
          Volver
        </Button>
      </div>
    </div>
  );
}
