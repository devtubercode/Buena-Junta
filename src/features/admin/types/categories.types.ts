export type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
};

export type CategoryInput = Omit<CategoryRow, "id">;
