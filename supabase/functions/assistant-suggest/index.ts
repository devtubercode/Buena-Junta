import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import OpenAI from "openai";
import { buildSystemPrompt, buildUserPrompt } from "./prompt.ts";

type MenuProduct = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  tags: string[];
  variants: { id: string; label: string; price: number }[];
  groups: { name: string; required: boolean; options: string[] }[];
  additions: { id: string; name: string; price: number }[];
};

type MenuPromotion = {
  slug: string;
  title: string;
  description: string;
  promotion_price: number;
  original_price: number | null;
};

function buildMenuContext(
  products: MenuProduct[],
  promotions: MenuPromotion[],
  categories: { name: string }[],
): string {
  const data = {
    products,
    promotions,
    categories: categories.map((c) => c.name),
  };

  return JSON.stringify(data, null, 2);
}

export default {
  fetch: withSupabase(
    { auth: ["publishable", "secret"] },
    async (req, ctx) => {
      if (req.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
      }

      let body: {
        peopleCount: number;
        maximumBudget: number | null;
        preferredCategorySlugs: string[];
        exclusions: string[];
        hasSharedItem: boolean;
      };
      try {
        body = await req.json();
      } catch {
        return Response.json(
          { error: "Invalid JSON body" },
          { status: 400 },
        );
      }

      const {
        peopleCount,
        maximumBudget,
        preferredCategorySlugs,
        exclusions,
        hasSharedItem,
      } = body;

      if (!peopleCount || peopleCount < 1) {
        return Response.json(
          { error: "peopleCount must be >= 1" },
          { status: 400 },
        );
      }

      // 1. Query all required data in parallel
      const [
        productsRes,
        groupsRes,
        additionsRes,
        promosRes,
        catsRes,
      ] = await Promise.all([
        ctx.supabaseAdmin
          .from("products")
          .select(
            `id, name, description, price, sale_price, tags,
             category:categories(name, slug),
             variants:product_variants(id, name, price, is_active)`,
          )
          .eq("is_available", true),

        ctx.supabaseAdmin
          .from("product_option_groups")
          .select(
            `id, product_id, name, is_required,
             options:product_option_values(name, is_active)`,
          )
          .eq("is_active", true),

        ctx.supabaseAdmin
          .from("product_available_additions")
          .select(`product_id, addition_id, addition:additions!inner(id, name, price)`),

        ctx.supabaseAdmin
          .from("promotions")
          .select(
            `slug, title, description, promotion_price, original_price, active_weekdays`,
          )
          .eq("is_active", true),

        ctx.supabaseAdmin.from("categories").select(`name, slug`),
      ]);

      if (productsRes.error) {
        return Response.json(
          { error: "Failed to fetch products" },
          { status: 500 },
        );
      }

      // 2. Filter products by preferred categories
      let filteredProducts = productsRes.data;
      if (preferredCategorySlugs.length > 0) {
        const slugs = new Set(preferredCategorySlugs);
        filteredProducts = filteredProducts.filter(
          (p: any) => p.category && slugs.has(p.category.slug),
        );
      }

      if (filteredProducts.length === 0) {
        return Response.json(
          { error: "No products match the selected categories" },
          { status: 422 },
        );
      }

      // 3. Build compact menu context
      const productIds = new Set(filteredProducts.map((p: any) => p.id));
      const filteredGroups = (groupsRes.data ?? []).filter(
        (g: any) => productIds.has(g.product_id),
      );
      const filteredAdditions = (additionsRes.data ?? []).filter(
        (a: any) => productIds.has(a.product_id) && a.addition,
      );

      const products: MenuProduct[] = filteredProducts.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.sale_price ?? p.price ?? 0,
        category: p.category?.name ?? "Sin categoría",
        description: p.description?.slice(0, 150) ?? "",
        tags: p.tags ?? [],
        variants: (p.variants ?? [])
          .filter((v: any) => v.is_active)
          .map((v: any) => ({ id: v.id, label: v.name, price: v.price })),
        groups: filteredGroups
          .filter((g: any) => g.product_id === p.id)
          .map((g: any) => ({
            name: g.name,
            required: g.is_required,
            options: g.options
              .filter((o: any) => o.is_active)
              .map((o: any) => o.name),
          })),
        additions: filteredAdditions
          .filter((a: any) => a.product_id === p.id)
          .map((a: any) => ({
            id: a.addition.id,
            name: a.addition.name,
            price: a.addition.price,
          })),
      }));

      const promotions: MenuPromotion[] = (promosRes.data ?? []).map(
        (p: any) => ({
          slug: p.slug,
          title: p.title,
          description: p.description,
          promotion_price: p.promotion_price,
          original_price: p.original_price,
        }),
      );

      const categories = catsRes.data ?? [];
      const preferredCategoryNames = preferredCategorySlugs.length > 0
        ? categories
            .filter((c: any) => preferredCategorySlugs.includes(c.slug))
            .map((c: any) => c.name)
        : [];

      const menuContext = buildMenuContext(products, promotions, categories);

      // 4. Call OpenCode Go API
      const goApiKey = Deno.env.get("OPENCODE_GO_API_KEY");
      if (!goApiKey) {
        console.error("Missing OPENCODE_GO_API_KEY secret");
        return Response.json(
          { error: "Server misconfigured: missing API key. Add OPENCODE_GO_API_KEY to Edge Function secrets." },
          { status: 500 },
        );
      }

      const openai = new OpenAI({
        apiKey: goApiKey,
        baseURL: "https://opencode.ai/zen/go/v1",
      });

      let completion;
      try {
        completion = await openai.chat.completions.create({
          model: "opencode-go/deepseek-v4-flash",
          messages: [
            { role: "system", content: buildSystemPrompt() },
            {
              role: "user",
              content: buildUserPrompt(menuContext, {
                peopleCount,
                maximumBudget,
                preferredCategoryNames,
                exclusions,
                hasSharedItem,
              }),
            },
          ],
          temperature: 0.3,
          max_tokens: 2048,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("OpenCode Go API error:", msg);
        return Response.json(
          { error: `AI service error: ${msg.slice(0, 200)}` },
          { status: 502 },
        );
      }

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        return Response.json(
          { error: "Empty AI response" },
          { status: 502 },
        );
      }

      // 5. Parse — handle markdown-wrapped JSON
      try {
        const cleaned = content
          .replace(/```json\s*/g, "")
          .replace(/```\s*/g, "")
          .trim();
        const result = JSON.parse(cleaned);
        return Response.json(result);
      } catch {
        console.error("Failed to parse AI response:", content);
        return Response.json(
          { error: "La IA devolvió una respuesta inválida. Intenta de nuevo." },
          { status: 502 },
        );
      }
    },
  ),
};
