import { create } from "zustand";

type MenuFilterState = {
  selectedCategoryId: string | null;
  selectedPromotionId: string | null;
  setSelectedCategory: (categoryId: string | null) => void;
  clearSelectedPromotion: () => void;
  applyPromotionFilter: (input: {
    categoryId: string;
    promotionId: string;
  }) => void;
};

export const useMenuFilterStore = create<MenuFilterState>()((set) => ({
  selectedCategoryId: null,
  selectedPromotionId: null,
  setSelectedCategory: (categoryId) =>
    set({
      selectedCategoryId: categoryId,
      selectedPromotionId: null,
    }),
  clearSelectedPromotion: () => set({ selectedPromotionId: null }),
  applyPromotionFilter: ({ categoryId, promotionId }) =>
    set({
      selectedCategoryId: categoryId,
      selectedPromotionId: promotionId,
    }),
}));
