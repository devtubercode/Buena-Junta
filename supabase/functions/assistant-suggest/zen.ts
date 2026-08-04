import type { AIResponse, ZenChatCompletion } from "./types.ts";
import {
  AI_CHAT_COMPLETIONS_URL,
  AI_MODEL,
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

export async function requestSuggestion(
  apiKey: string,
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
        model: AI_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: AI_TEMPERATURE,
        max_tokens: AI_MAX_TOKENS,
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

  if (!content) {
    const finishReason = completion.choices?.[0]?.finish_reason ?? "unknown";
    console.error("AI returned empty content, finish_reason:", finishReason);
    throw new Error("AI returned empty content");
  }

  try {
    const cleanedContent = cleanMarkdownFromJson(content);
    const parsedResponse = JSON.parse(cleanedContent) as AIResponse;
    return parsedResponse;
  } catch {
    console.error("Failed to parse AI JSON, content:", content.slice(0, 300));
    throw new Error("Invalid JSON from AI");
  }
}
