export type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
};

export type CategoryInput = Omit<CategoryRow, "id">;
