import type { SupabaseClient } from "@supabase/supabase-js";

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
  category: { name: string } | null;
};

export type PromotionRecord = {
  id: string;
  title: string;
  description: string | null;
  promotion_price: number;
};

export type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
};

// Contexto del menú (lo que se envía a la IA)
// description solo se incluye cuando hay exclusiones; sin exclusiones
// no viaja en el payload (undefined se omite en JSON.stringify).
export type MenuProduct = {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
};

export type MenuPromotion = {
  id: string;
  title: string;
  description?: string;
  promotion_price: number;
};

export type MenuContext = {
  products: MenuProduct[];
  promotions: MenuPromotion[];
};

// Respuesta JSON de la IA
export type AIResponse = {
  items: AIItem[];
  sharedPromotionId: string | null;
  explanation: AIExplanation;
};

export type AIItem = {
  productId: string;
  quantity: number | null;
};

export type AIExplanation = {
  summary: string;
  itemReasons: Record<string, string>;
};

// Parámetros para construir el contexto del menú
export type FetchMenuContextParams = {
  supabaseAdmin: SupabaseClient;
  preferredCategorySlugs: string[];
  hasSharedItem: boolean;
  hasExclusions: boolean;
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
