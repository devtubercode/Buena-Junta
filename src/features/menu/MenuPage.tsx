import { useState } from "react";
import { useCatalogData } from "@/shared/hooks/useCatalogData";
import { useMenuPromotions } from "@/features/menu/hooks/useMenuPromotions";
import { useMenuOrder } from "@/features/menu/hooks/useMenuOrder";
import { useMenuOrderDrawer } from "@/features/menu/hooks/useMenuOrderDrawer";
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
import type { MenuProduct } from "@/features/menu/types/menu.types";
import type { AdditionRow } from "@/features/admin/types/additions.types";
import type { Promotion } from "@/features/home/types/promotion.types";
import { CustomModal } from "@/shared/components/CustomModal";
import { ProductCustomizationForm } from "@/shared/components/product/ProductCustomizationForm";
import type { ProductCustomizationOutput } from "@/shared/components/product/types";
import { ButtonSheetModal } from "@/shared/components/ButtonSheetModal";

function additionToAddAdditionInput(
  addition: AdditionRow,
): {
  id: string;
  name: string;
  price: number;
  quantity: number;
} {
  return {
    id: addition.id,
    name: addition.name,
    price: addition.price,
    quantity: 1,
  };
}

export function MenuPage() {
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const [selectedProduct, setSelectedProduct] = useState<MenuProduct | null>(
    null,
  );
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null,
  );

  const { categories, products, additions, isLoading } = useCatalogData();

  const { promotions, isLoading: isLoadingPromotions } = useMenuPromotions();
  const order = useMenuOrder();
  const { isOpen, open, close } = useMenuOrderDrawer();

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
    const existingTopping = order.toppings.find(
      (a) => a.id === addition.id,
    );

    order.actions.addTopping(additionToAddAdditionInput(addition));

    if (!existingTopping) {
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
            getQuantityInOrder={getProductQuantity}
          />
        )}

        {activeTab === "additions" && (
          <AdditionsTab
            additions={additions}
            onAddTopping={handleAddGlobalTopping}
            getToppingQuantity={getToppingQuantity}
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
                  onSubmit={(output) => {
                    handleAddItem(output);
                    notify.whatsapp(`Agregaste ${output.name} al pedido.`);
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
                  onSubmit={(output) => {
                    handleAddItem(output);
                    notify.whatsapp(`Agregaste ${output.name} al pedido.`);
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
          onAddToOrder={() => {
            order.actions.addItem({
              id: selectedPromotion.slug,
              name: selectedPromotion.title,
              price: selectedPromotion.promotionPrice,
              quantity: 1,
              urlImage: selectedPromotion.image
                ? { src: selectedPromotion.image, alt: selectedPromotion.imageAlt }
                : undefined,
            });
            notify.whatsapp(
              `Agregaste ${selectedPromotion.title} al pedido.`,
            );
            setSelectedPromotion(null);
          }}
        />
      )}

      <MenuOrderButton itemCount={order.totalQuantity} onClick={open} />

      <MenuOrderDrawer isOpen={isOpen} onClose={close} order={order} />
    </main>
  );
}
