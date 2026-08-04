import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

import { fetchMenuContext } from "./data.ts";
import { requestSuggestion } from "./zen.ts";
import { buildSystemPrompt, buildUserPrompt } from "./prompt.ts";
import type { SuggestionRequestBody, MenuContext } from "./types.ts";
import { AI_API_KEY_ENVIRONMENT_VARIABLE } from "./constants.ts";

export default {
  fetch: withSupabase(
    { auth: ["publishable", "secret"] },
    async (request, context) => {
      if (request.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
      }

      let body: SuggestionRequestBody;
      try {
        body = (await request.json()) as SuggestionRequestBody;
      } catch {
        return Response.json({ error: "Invalid JSON body" }, { status: 400 });
      }

      const apiKey = Deno.env.get(AI_API_KEY_ENVIRONMENT_VARIABLE);
      if (!apiKey) {
        return Response.json(
          { error: "Missing API key secret" },
          { status: 500 },
        );
      }

      let menuContext: MenuContext;
      let preferredCategoryNames: string[];
      try {
        const result = await fetchMenuContext(
          context.supabaseAdmin,
          body.preferredCategorySlugs,
        );
        menuContext = result.menuContext;
        preferredCategoryNames = result.preferredCategoryNames;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error("Database error:", errorMessage);
        const status = errorMessage.includes("No products match") ? 422 : 500;
        return Response.json({ error: errorMessage }, { status });
      }

      const systemPrompt = buildSystemPrompt();
      const userPrompt = buildUserPrompt(
        JSON.stringify({
          products: menuContext.products,
          promotions: menuContext.promotions,
          categories: menuContext.categories,
        }),
        {
          peopleCount: body.peopleCount,
          maximumBudget: body.maximumBudget,
          preferredCategoryNames,
          exclusions: body.exclusions,
          hasSharedItem: body.hasSharedItem,
        },
      );

      try {
        const suggestion = await requestSuggestion(
          apiKey,
          systemPrompt,
          userPrompt,
        );
        return Response.json(suggestion);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error("Zen API error:", errorMessage);
        return Response.json({ error: errorMessage }, { status: 502 });
      }
    },
  ),
};
