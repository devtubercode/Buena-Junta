import { useState } from "react";
import { useCatalogData } from "@/shared/hooks/useCatalogData";
import { useMenuPromotions } from "@/features/menu/hooks/useMenuPromotions";
import { useMenuOrder } from "@/features/menu/hooks/useMenuOrder";
import { useMenuOrderDrawer } from "@/features/menu/hooks/useMenuOrderDrawer";
import { useOrderAssistant } from "@/features/order-assistant/hooks/useOrderAssistant";
import { notify } from "@/shared/notifications/notify";
import {
  MenuTabs,
  type Tab,
} from "@/features/menu/components/menu-tabs/MenuTabs";
import { ProductsTab } from "@/features/menu/components/menu-tabs/ProductsTab";
import { AdditionsTab } from "@/features/menu/components/menu-tabs/AdditionsTab";
import { PromotionsTab } from "@/features/menu/components/menu-tabs/PromotionsTab";

import { PromotionDetailModal } from "@/features/menu/components/PromotionDetailModal";
import { MenuOrderButton } from "@/features/menu/components/MenuOrderButton";
import { MenuOrderDrawer } from "@/features/menu/components/MenuOrderDrawer";
import { AssistantFab } from "@/features/order-assistant/components/AssistantFab";
import { AssistantDrawer } from "@/features/order-assistant/components/AssistantDrawer";
import type { MenuProduct } from "@/features/menu/types/menu.types";
import type { AdditionRow } from "@/features/admin/types/additions.types";
import type { Promotion } from "@/features/home/types/promotion.types";
import { CustomModal } from "@/shared/components/CustomModal";
import { ProductCustomizationForm } from "@/shared/components/product/ProductCustomizationForm";
import type { ProductCustomizationOutput } from "@/shared/components/product/types";
import { ButtonSheetModal } from "@/shared/components/ButtonSheetModal";

export function MenuPage() {
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const [selectedProduct, setSelectedProduct] = useState<MenuProduct | null>(
    null,
  );
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null,
  );

  const { categories, products, additions, isLoading, additionsError } =
    useCatalogData();

  const { promotions, isLoading: isLoadingPromotions } = useMenuPromotions();
  const order = useMenuOrder();
  const { isOpen, open, close } = useMenuOrderDrawer();
  const assistant = useOrderAssistant();

  const getProductQuantity = (productId: string) => {
    return order.items
      .filter((item) => item.id === productId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const getToppingQuantity = (toppingId: string) => {
    return order.toppings
      .filter((topping) => topping.id === toppingId)
      .reduce((sum, topping) => sum + topping.quantity, 0);
  };

  const handleAddItem = (output: ProductCustomizationOutput) => {
    order.actions.addItem(output);
  };

  const handleAddGlobalTopping = (addition: AdditionRow) => {
    order.actions.addTopping({
      id: addition.id,
      name: addition.name,
      price: addition.price,
      quantity: 1,
    });
    notify.whatsapp(`Agregaste el topping ${addition.name} al pedido.`);
  };

  const onAddPromotion = () => {
    if (!selectedPromotion) return;
    order.actions.addItem({
      id: selectedPromotion.slug,
      name: selectedPromotion.title,
      price: selectedPromotion.promotionPrice,
      quantity: 1,
      urlImage: selectedPromotion.image
        ? {
            src: selectedPromotion.image,
            alt: selectedPromotion.imageAlt,
          }
        : undefined,
    });
    notify.whatsapp(
      `Agregaste la promción ${selectedPromotion.title} al pedido.`,
    );
    setSelectedPromotion(null);
  };

  return (
    <main className="mx-auto w-full max-w-6xl py-4 lg:py-8">
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
        <div hidden={activeTab !== "products"}>
          <ProductsTab
            products={products}
            categories={categories}
            isLoading={isLoading}
            onOpenProductDetail={setSelectedProduct}
            getQuantityInOrder={getProductQuantity}
          />
        </div>
        <div hidden={activeTab !== "additions"}>
          <AdditionsTab
            additions={additions}
            isLoading={isLoading}
            error={additionsError}
            onAddTopping={handleAddGlobalTopping}
            getToppingQuantity={getToppingQuantity}
          />
        </div>

        <div hidden={activeTab !== "promotions"}>
          <PromotionsTab
            promotions={promotions}
            isLoading={isLoadingPromotions}
            onOpenPromotionDetail={setSelectedPromotion}
          />
        </div>
      </div>

      <div className="hidden sm:block">
        <CustomModal
          isOpen={Boolean(selectedProduct)}
          contentClassName="max-w-lg overflow-hidden p-0"
          onClose={() => setSelectedProduct(null)}
        >
          {selectedProduct && (
            <ProductCustomizationForm
              key={selectedProduct.id}
              product={selectedProduct}
              onSubmit={(output) => {
                handleAddItem(output);
                notify.whatsapp(`Agregaste ${output.name} al pedido.`);
                setSelectedProduct(null);
              }}
              onClose={() => setSelectedProduct(null)}
            />
          )}
        </CustomModal>
      </div>
      <div className="sm:hidden">
        <ButtonSheetModal
          isOpen={Boolean(selectedProduct)}
          title={""}
          scrollable={false}
          contentClassName="max-w-lg overflow-hidden p-0"
          onClose={() => setSelectedProduct(null)}
        >
          {selectedProduct && (
            <ProductCustomizationForm
              key={selectedProduct.id}
              product={selectedProduct}
              onSubmit={(output) => {
                handleAddItem(output);
                notify.whatsapp(`Agregaste ${output.name} al pedido.`);
                setSelectedProduct(null);
              }}
              onClose={() => setSelectedProduct(null)}
            />
          )}
        </ButtonSheetModal>
      </div>

      {selectedPromotion && (
        <PromotionDetailModal
          promotion={selectedPromotion}
          isOpen={Boolean(selectedPromotion)}
          onClose={() => setSelectedPromotion(null)}
          onAddToOrder={onAddPromotion}
        />
      )}

      <MenuOrderButton
        itemCount={order.totalQuantity}
        total={order.total}
        onClick={open}
      />

      <MenuOrderDrawer isOpen={isOpen} onClose={close} order={order} />

      <AssistantFab onClick={assistant.actions.open} />

      <AssistantDrawer
        isOpen={assistant.isOpen}
        step={assistant.step}
        formData={assistant.formData}
        suggestion={assistant.suggestion}
        error={assistant.error}
        categories={categories}
        products={products}
        promotions={promotions}
        actions={assistant.actions}
        onClose={assistant.actions.close}
      />
    </main>
  );
}
