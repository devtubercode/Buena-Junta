import { create } from "zustand";

type MenuFilterState = {
  selectedCategorySlug: string | null;
  selectedPromotionSlug: string | null;
  setSelectedCategorySlug: (categorySlug: string | null) => void;
  clearSelectedPromotion: () => void;
  applyPromotionFilter: (input: {
    categorySlug: string;
    promotionSlug: string;
  }) => void;
};

export const useMenuFilterStore = create<MenuFilterState>()((set) => ({
  selectedCategorySlug: null,
  selectedPromotionSlug: null,
  setSelectedCategorySlug: (categorySlug) =>
    set({
      selectedCategorySlug: categorySlug,
      selectedPromotionSlug: null,
    }),
  clearSelectedPromotion: () => set({ selectedPromotionSlug: null }),
  applyPromotionFilter: ({ categorySlug, promotionSlug }) =>
    set({
      selectedCategorySlug: categorySlug,
      selectedPromotionSlug: promotionSlug,
    }),
}));
