export type AdditionRow = {
  id: string;
  product_id: string | null;
  name: string;
  description: string | null;
  price: number;
  created_at: string;
  updated_at: string;
};

export type AdditionInput = {
  product_id?: string | null;
  name: string;
  description: string | null;
  price: number;
};
