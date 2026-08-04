import type { AIResponse, ZenChatCompletion } from "./types.ts";
import {
  AI_CHAT_COMPLETIONS_URL,
  AI_MAX_TOKENS,
  AI_TEMPERATURE,
  AI_REQUEST_TIMEOUT_MILLISECONDS,
} from "./constants.ts";

function cleanMarkdownFromJson(rawContent: string): string {
  return rawContent
    .replace(/```json\s*/g, "")
    .replace(/```\s*/g, "")
    .trim();
}

function extractJsonSubstring(rawContent: string): string {
  const firstBraceIndex = rawContent.indexOf("{");
  const lastBraceIndex = rawContent.lastIndexOf("}");
  if (
    firstBraceIndex === -1 ||
    lastBraceIndex === -1 ||
    lastBraceIndex < firstBraceIndex
  ) {
    return rawContent;
  }
  return rawContent.slice(firstBraceIndex, lastBraceIndex + 1);
}

function parseAiJsonResponse(content: string): AIResponse {
  const cleanedContent = extractJsonSubstring(cleanMarkdownFromJson(content));
  return JSON.parse(cleanedContent) as AIResponse;
}

export async function requestSuggestion(
  apiKey: string,
  iaModel: string,
  systemPrompt: string,
  userPrompt: string,
): Promise<AIResponse> {
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

  const completion = (await response.json()) as ZenChatCompletion;
  const content = completion.choices?.[0]?.message?.content;
  const finishReason = completion.choices?.[0]?.finish_reason ?? "unknown";

  const promptTokens = completion.usage?.prompt_tokens ?? 0;
  const completionTokens = completion.usage?.completion_tokens ?? 0;
  const totalTokens = completion.usage?.total_tokens ?? 0;
  console.error(
    "AI tokens usados — prompt:",
    promptTokens,
    "| completion:",
    completionTokens,
    "| total:",
    totalTokens,
    "| finish_reason:",
    finishReason,
  );

  if (!content) {
    console.error("AI returned empty content, finish_reason:", finishReason);
    throw new Error("AI returned empty content");
  }

  try {
    return parseAiJsonResponse(content);
  } catch {
    console.error("Failed to parse AI JSON, content:", content.slice(0, 300));
    throw new Error("Invalid JSON from AI");
  }
}
