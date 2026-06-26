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
      // DEPRECATED: Old global option tables (to be removed)
      // option_groups: GenericTable;
      // option_values: GenericTable;
      // NEW: Product-specific option groups (replaces global option_groups + product_option_groups bridge)
      product_option_groups: GenericTable;
      product_option_values: GenericTable;
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
