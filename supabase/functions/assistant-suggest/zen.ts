import type { AIItem, AIResponse, ZenChatCompletion } from "./types.ts";
import {
  AI_CHAT_COMPLETIONS_URL,
  AI_MAX_TOKENS,
  AI_TEMPERATURE,
  AI_REQUEST_TIMEOUT_MILLISECONDS,
} from "./constants.ts";

const extractJsonSubstring = (rawContent: string): string => {
  const start = rawContent.indexOf("{");
  if (start === -1) {
    throw new Error("No JSON object found in AI response");
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < rawContent.length; i++) {
    const char = rawContent[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
    } else if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return rawContent.slice(start, i + 1);
      }
    }
  }

  throw new Error("Unbalanced JSON in AI response");
};

const parseAiJsonResponse = (content: string): AIResponse => {
  const jsonText = extractJsonSubstring(content);
  const parsed: unknown = JSON.parse(jsonText);
  return normalizeAiResponse(parsed);
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeAiResponse = (raw: unknown): AIResponse => {
  if (!isRecord(raw)) {
    throw new Error("AI response is not a JSON object");
  }

  const itemsRaw = raw.items;
  if (!Array.isArray(itemsRaw)) {
    throw new Error("AI response missing items array");
  }

  const items: AIItem[] = itemsRaw.map((entry, index) => {
    if (!isRecord(entry) || typeof entry.productId !== "string") {
      throw new Error(`AI item ${index} missing productId`);
    }
    const quantity =
      typeof entry.quantity === "number" && Number.isFinite(entry.quantity)
        ? entry.quantity
        : null;
    return { productId: entry.productId, quantity };
  });

  const sharedPromotionId =
    typeof raw.sharedPromotionId === "string" ? raw.sharedPromotionId : null;

  const explanationRaw = isRecord(raw.explanation) ? raw.explanation : {};
  const summary =
    typeof explanationRaw.summary === "string" ? explanationRaw.summary : "";
  const itemReasonsRaw = isRecord(explanationRaw.itemReasons)
    ? explanationRaw.itemReasons
    : {};
  const itemReasons: Record<string, string> = {};
  for (const [key, value] of Object.entries(itemReasonsRaw)) {
    if (typeof value === "string") {
      itemReasons[key] = value;
    }
  }

  return {
    items,
    sharedPromotionId,
    explanation: { summary, itemReasons },
  };
};

export const requestSuggestion = async (
  apiKey: string,
  iaModel: string,
  systemPrompt: string,
  userPrompt: string,
): Promise<AIResponse> => {
  let response: Response;
  try {
    response = await fetch(AI_CHAT_COMPLETIONS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: iaModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: AI_TEMPERATURE,
        max_tokens: AI_MAX_TOKENS,
        response_format: { type: "json_object" },
      }),
      signal: AbortSignal.timeout(AI_REQUEST_TIMEOUT_MILLISECONDS),
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? `${error.name}: ${error.message}`
        : String(error);
    console.error("AI API fetch failed:", errorMessage);
    throw new Error(`Fetch failed: ${errorMessage.slice(0, 200)}`, {
      cause: error,
    });
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error("AI API error:", response.status, errorText.slice(0, 500));
    throw new Error(`AI API ${response.status}: ${errorText.slice(0, 200)}`);
  }

  let completion: ZenChatCompletion;
  try {
    completion = (await response.json()) as ZenChatCompletion;
  } catch {
    console.error("AI API returned non-JSON body");
    throw new Error("AI API returned invalid JSON body");
  }

  const content = completion.choices?.[0]?.message?.content;
  const finishReason = completion.choices?.[0]?.finish_reason ?? "unknown";

  const promptTokens = completion.usage?.prompt_tokens ?? 0;
  const completionTokens = completion.usage?.completion_tokens ?? 0;
  const totalTokens = completion.usage?.total_tokens ?? 0;
  console.info(
    `[assistant-suggest] tokens prompt=${promptTokens} completion=${completionTokens} total=${totalTokens} finish_reason=${finishReason}`,
  );

  if (finishReason === "length") {
    console.warn(
      `[assistant-suggest] output truncated by max_tokens (${AI_MAX_TOKENS}); JSON may be incomplete`,
    );
  }

  if (!content) {
    console.error("AI returned empty content, finish_reason:", finishReason);
    throw new Error("AI returned empty content");
  }

  try {
    return parseAiJsonResponse(content);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      `Failed to parse AI JSON (${message}), content:`,
      content.slice(0, 300),
    );
    throw new Error(`Invalid JSON from AI: ${message}`, { cause: error });
  }
};
