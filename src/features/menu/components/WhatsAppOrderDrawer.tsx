import { useState } from "react";
import { X } from "lucide-react";
import { CustomModal } from "@/shared/components/CustomModal";
import { WhatsAppOrderItem } from "@/features/menu/components/WhatsAppOrderItem";
import { WhatsAppOrderForm } from "@/features/menu/components/WhatsAppOrderForm";
import { WhatsAppOrderSummary } from "@/features/menu/components/WhatsAppOrderSummary";
import { cn } from "@/shared/utils/cn";
import type { UseWhatsAppOrderResult } from "@/features/menu/hooks/useWhatsAppOrder";

type WhatsAppOrderDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  order: UseWhatsAppOrderResult;
};

export function WhatsAppOrderDrawer({
  isOpen,
  onClose,
  order,
}: WhatsAppOrderDrawerProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSend = () => {
    setShowConfirm(false);
    order.actions.sendOrder();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-opacity-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-background shadow-elevated transition-transform duration-300 ease-out sm:max-w-md",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-label="Pedido por WhatsApp"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3 sm:px-5 sm:py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
              Tu pedido
            </p>
            <h2 className="font-heading text-xl font-black leading-none text-foreground sm:text-2xl">
              WhatsApp
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar pedido"
            className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground shadow-sm transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Items - scrollable */}
        <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
          {order.items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-surface p-4">
                <svg
                  className="size-12 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="font-heading text-xl font-black text-foreground">
                Tu pedido está vacío
              </h3>
              <p className="mt-2 max-w-48 text-sm text-muted-foreground">
                Agrega productos del menú para pedir por WhatsApp
              </p>
            </div>
          ) : (
            <section
              className="grid gap-2 sm:gap-3"
              aria-label="Productos en el pedido"
            >
              {order.items.map((item) => (
                <WhatsAppOrderItem
                  key={item.lineId}
                  item={item}
                  onIncrement={() => order.actions.incrementItem(item.lineId)}
                  onDecrement={() => order.actions.decrementItem(item.lineId)}
                  onQuantityChange={(quantity) =>
                    order.actions.updateQuantity(item.lineId, quantity)
                  }
                  onNoteChange={(note) =>
                    order.actions.updateItemNote(item.lineId, note)
                  }
                  onRemove={() => order.actions.removeItem(item.lineId)}
                />
              ))}
            </section>
          )}
        </div>

        {/* Footer - compact sticky */}
        {order.items.length > 0 && (
          <div className="shrink-0 border-t border-border bg-background p-3 shadow-elevated sm:p-4">
            <div className="grid gap-3">
              <WhatsAppOrderSummary
                total={order.total}
                totalQuantity={order.totalQuantity}
              />
              <WhatsAppOrderForm
                customerName={order.customerName}
                generalNotes={order.generalNotes}
                onChangeName={(customerName) =>
                  order.actions.updateCustomerName(customerName)
                }
                onChangeNotes={(generalNotes) =>
                  order.actions.updateGeneralNotes(generalNotes)
                }
              />
              <button
                type="button"
                disabled={!order.canSendOrder}
                onClick={() => setShowConfirm(true)}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:bg-muted-foreground/30 disabled:text-muted-foreground"
              >
                Enviar pedido por WhatsApp
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Confirmation modal */}
      <CustomModal
        isOpen={showConfirm}
        title="¿Enviar pedido por WhatsApp?"
        description="Revisa los productos y el responsable antes de continuar. Se abrirá WhatsApp con el mensaje listo."
        onClose={() => setShowConfirm(false)}
      >
        <div className="grid gap-3 p-3 sm:p-4">
          <WhatsAppOrderSummary
            total={order.total}
            totalQuantity={order.totalQuantity}
          />
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-surface px-4 text-sm font-black text-muted-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Volver
            </button>
            <button
              type="button"
              onClick={handleSend}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-4 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Enviar
            </button>
          </div>
        </div>
      </CustomModal>
    </>
  );
}
