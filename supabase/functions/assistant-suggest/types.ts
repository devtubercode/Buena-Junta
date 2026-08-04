// Request body del cliente
export type SuggestionRequestBody = {
  peopleCount: number;
  maximumBudget: number | null;
  preferredCategorySlugs: string[];
  exclusions: string[];
  hasSharedItem: boolean;
};

// Filas crudas de Supabase (lo que devuelve .select())
export type ProductRecord = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  sale_price: number | null;
  tags: string[] | null;
  category: { name: string; slug: string } | null;
  variants: ProductVariantRecord[];
};

export type ProductVariantRecord = {
  id: string;
  name: string;
  price: number;
  is_active: boolean;
};

export type OptionGroupRecord = {
  id: string;
  product_id: string;
  name: string;
  is_required: boolean;
  options: OptionValueRecord[];
};

export type OptionValueRecord = {
  name: string;
  is_active: boolean;
};

export type AdditionLinkRecord = {
  product_id: string;
  addition: { id: string; name: string; price: number } | null;
};

export type PromotionRecord = {
  slug: string;
  title: string;
  description: string | null;
  promotion_price: number;
  original_price: number | null;
};

export type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
};

// Contexto del menú (lo que se envía a la IA)
export type MenuProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  variants: MenuProductVariant[];
  groups: MenuProductGroup[];
  additions: MenuProductAddition[];
};

export type MenuProductVariant = {
  id: string;
  label: string;
  price: number;
};

export type MenuProductGroup = {
  name: string;
  required: boolean;
  options: string[];
};

export type MenuProductAddition = {
  id: string;
  name: string;
  price: number;
};

export type MenuPromotion = {
  slug: string;
  title: string;
  promotion_price: number;
  original_price: number | null;
};

export type MenuContext = {
  products: MenuProduct[];
  promotions: MenuPromotion[];
  categories: string[];
};

// Respuesta JSON de la IA
export type AIResponse = {
  items: AIItem[];
  sharedPromotionSlug: string | null;
  explanation: AIExplanation;
};

export type AIItem = {
  productId: string;
  variantId: string | null;
  selectedOptions: Record<string, string> | null;
  additionKeys: string[] | null;
  quantity: number | null;
};

export type AIExplanation = {
  summary: string;
  perItem: Record<string, string>;
};

// Resultado de las queries DB
export type DatabaseQueryResult = {
  products: ProductRecord[];
  optionGroups: OptionGroupRecord[];
  additionLinks: AdditionLinkRecord[];
  promotions: PromotionRecord[];
  categories: CategoryRecord[];
};

// Respuesta JSON de la API Zen (raw)
export type ZenChatCompletion = {
  choices: Array<{
    finish_reason: string;
    message: { role: string; content: string };
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
};
