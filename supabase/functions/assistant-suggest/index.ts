import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

import { fetchMenuContext } from "./data.ts";
import { requestSuggestion } from "./zen.ts";
import { buildSystemPrompt, buildUserPrompt } from "./prompt.ts";
import type { SuggestionRequestBody } from "./types.ts";

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

      const apiKey = Deno.env.get("AI_API_KEY");
      const iaModel = Deno.env.get("AI_MODEL") ?? "glm-5";
      if (!apiKey) {
        return Response.json(
          { error: "Missing API key secret" },
          { status: 500 },
        );
      }

      const dbStartedAt = Date.now();

      const menuContext = await fetchMenuContext({
        supabaseAdmin: context.supabaseAdmin,
        preferredCategorySlugs: body.preferredCategorySlugs,
        hasSharedItem: body.hasSharedItem,
        hasExclusions: body.exclusions.length > 0,
      });

      const dbDurationMs = Date.now() - dbStartedAt;

      const systemPrompt = buildSystemPrompt();
      const userPrompt = buildUserPrompt(JSON.stringify(menuContext), {
        peopleCount: body.peopleCount,
        maximumBudget: body.maximumBudget,
        exclusions: body.exclusions,
        hasSharedItem: body.hasSharedItem,
      });

      try {
        const aiStartedAt = Date.now();
        const suggestion = await requestSuggestion(
          apiKey,
          iaModel,
          systemPrompt,
          userPrompt,
        );
        const aiDurationMs = Date.now() - aiStartedAt;
        console.info(
          `[assistant-suggest] model=${iaModel} db_ms=${dbDurationMs} ai_ms=${aiDurationMs} products=${menuContext.products.length} promotions=${menuContext.promotions.length}`,
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
