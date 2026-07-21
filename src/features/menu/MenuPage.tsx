import { useState } from "react";
import { useCatalogData } from "@/shared/hooks/useCatalogData";
import { useMenuPromotions } from "@/features/menu/hooks/useMenuPromotions";
import { useWhatsAppOrder } from "@/features/menu/hooks/useWhatsAppOrder";
import { useWhatsAppOrderDrawer } from "@/features/menu/hooks/useWhatsAppOrderDrawer";
import { notify } from "@/shared/notifications/notify";
import {
  MenuTabs,
  type Tab,
} from "@/features/menu/components/menu-tabs/MenuTabs";
import { ProductsTab } from "@/features/menu/components/menu-tabs/ProductsTab";
import { AdditionsTab } from "@/features/menu/components/menu-tabs/AdditionsTab";
import { PromotionsTab } from "@/features/menu/components/menu-tabs/PromotionsTab";

import { PromotionDetailModal } from "@/features/menu/components/PromotionDetailModal";
import { WhatsAppOrderButton } from "@/features/menu/components/WhatsAppOrderButton";
import { WhatsAppOrderDrawer } from "@/features/menu/components/WhatsAppOrderDrawer";
import type { MenuProduct } from "@/features/menu/types/menu.types";
import type { AdditionRow } from "@/features/admin/types/additions.types";
import type { Promotion } from "@/features/home/types/promotion.types";
import type { AddWhatsAppOrderItemInput } from "@/store/whatsapp/types/whatsapp-order.types";
import { CustomModal } from "@/shared/components/CustomModal";
import { ProductCustomizationForm } from "@/shared/components/product/ProductCustomizationForm";
import { ButtonSheetModal } from "@/shared/components/ButtonSheetModal";
import { cartInputToWhatsAppInput } from "./utils/whatsappOrderAdapter";

export function MenuPage() {
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const [selectedProduct, setSelectedProduct] = useState<MenuProduct | null>(
    null,
  );
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null,
  );

  const {
    categories,
    products,
    additions: globalAdditions,
    isLoading,
  } = useCatalogData();
  const { promotions, isLoading: isLoadingPromotions } = useMenuPromotions();
  const order = useWhatsAppOrder();
  const { isOpen, open, close } = useWhatsAppOrderDrawer();

  const getProductQuantity = (productId: string) => {
    return order.items
      .filter((item) => item.productId === productId && !item.isGlobalAddition)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const getAdditionQuantity = (additionId: string) => {
    return order.items
      .filter((item) => item.productId === additionId && item.isGlobalAddition)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleAddToOrder = (input: AddWhatsAppOrderItemInput) => {
    order.actions.addItem(input);
  };

  const handleAddProduct = (product: MenuProduct) => {
    if (product.price === null) return;
    handleAddToOrder({
      productId: product.id,
      image: product.urlImage,
      baseName: product.name,
      displayName: product.name,
      name: product.name,
      unitPrice: product.price,
      quantity: 1,
      selectedOptions: {},
      additionOptions: [],
    });
    notify.whatsapp(`Agregaste ${product.name} al pedido.`);
  };

  const handleAddGlobalAddition = (addition: AdditionRow) => {
    const item = order.items.find(
      (i) => i.productId === addition.id && i.isGlobalAddition,
    );

    handleAddToOrder({
      productId: addition.id,
      baseName: addition.name,
      displayName: addition.name,
      name: addition.name,
      unitPrice: addition.price,
      quantity: 1,
      isGlobalAddition: true,
      selectedOptions: {},
      additionOptions: [],
    });

    if (!item) {
      notify.whatsapp(`Agregaste ${addition.name} al pedido.`);
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl overflow-x-hidden py-4 lg:py-8">
      <div className="px-4 pb-4 sm:px-6 lg:px-8 lg:pb-6">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">
          Menú digital
        </p>
        <h1 className="mt-2 font-heading text-4xl font-black leading-none text-foreground">
          Pide rápido por WhatsApp
        </h1>
        <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-muted-foreground">
          Explora nuestro catálogo, personaliza tus productos y envía tu pedido
          directamente por WhatsApp. Rápido, fácil y sin complicaciones.
        </p>
      </div>

      <MenuTabs activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-4 px-4 sm:px-6 lg:px-8">
        {activeTab === "products" && (
          <ProductsTab
            products={products}
            categories={categories}
            isLoading={isLoading}
            onOpenProductDetail={setSelectedProduct}
            onAddToOrder={handleAddProduct}
            getQuantityInOrder={getProductQuantity}
          />
        )}

        {activeTab === "additions" && (
          <AdditionsTab
            additions={globalAdditions}
            onAddToOrder={handleAddGlobalAddition}
            getQuantityInOrder={getAdditionQuantity}
            onIncrementAddition={handleAddGlobalAddition}
            onDecrementAddition={(addition) => {
              const item = order.items.find(
                (i) => i.productId === addition.id && i.isGlobalAddition,
              );
              if (item) {
                order.actions.decrementItem(item.lineId);
              }
            }}
          />
        )}

        {activeTab === "promotions" && (
          <PromotionsTab
            promotions={promotions}
            isLoading={isLoadingPromotions}
            onOpenPromotionDetail={setSelectedPromotion}
          />
        )}
      </div>

      {selectedProduct && (
        <>
          <div className="hidden sm:block">
            <CustomModal
              isOpen={Boolean(selectedProduct)}
              contentClassName="max-w-lg p-0 sm:p-1"
              onClose={() => setSelectedProduct(null)}
            >
              <div className="p-3 sm:p-4">
                <ProductCustomizationForm
                  product={selectedProduct}
                  submitLabel="Agregar al pedido"
                  onSubmit={(input) => {
                    handleAddToOrder(cartInputToWhatsAppInput(input));
                    notify.whatsapp(`Agregaste ${input.name} al pedido.`);
                    setSelectedProduct(null);
                  }}
                  onClose={() => setSelectedProduct(null)}
                />
              </div>
            </CustomModal>
          </div>
          <div className="sm:hidden">
            <ButtonSheetModal
              isOpen={Boolean(selectedProduct)}
              title={""}
              contentClassName="max-w-lg p-0 sm:p-1"
              onClose={() => setSelectedProduct(null)}
            >
              <div className="p-3">
                <ProductCustomizationForm
                  product={selectedProduct}
                  submitLabel="Agregar al pedido"
                  onSubmit={(input) => {
                    handleAddToOrder(cartInputToWhatsAppInput(input));
                    notify.whatsapp(`Agregaste ${input.name} al pedido.`);
                    setSelectedProduct(null);
                  }}
                  onClose={() => setSelectedProduct(null)}
                />
              </div>
            </ButtonSheetModal>
          </div>
        </>
      )}

      {selectedPromotion && (
        <PromotionDetailModal
          promotion={selectedPromotion}
          isOpen={Boolean(selectedPromotion)}
          onClose={() => setSelectedPromotion(null)}
        />
      )}

      <WhatsAppOrderButton itemCount={order.totalQuantity} onClick={open} />

      <WhatsAppOrderDrawer isOpen={isOpen} onClose={close} order={order} />
    </main>
  );
}
