type GenericTable = {
  Row: Record<string, unknown>;
  Insert: Record<string, unknown>;
  Update: Record<string, unknown>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      categories: GenericTable;
      additions: GenericTable;
      category_additions: GenericTable;
      option_groups: GenericTable;
      option_values: GenericTable;
      product_additions: GenericTable;
      product_option_groups: GenericTable;
      product_variants: GenericTable;
      products: GenericTable;
      promotions: GenericTable;
    };
    Views: {
      product_available_additions: GenericTable;
    };
    Functions: Record<string, never>;
    Enums: Record<string, string>;
    CompositeTypes: Record<string, never>;
  };
};
