/**
 * Minimal OpenRouter chat client (server-only). Every call has a hard timeout
 * and asks for a JSON object; callers validate the shape and fall back to
 * neutral content when anything is off. Model ids are env-overridable.
 */

export const MODELS = {
  strong: process.env.OPENROUTER_MODEL_STRONG?.trim() || "anthropic/claude-sonnet-5.5",
  fast: process.env.OPENROUTER_MODEL_FAST?.trim() || "anthropic/claude-haiku-5.5",
} as const;

export type ChatResult = { ok: true; json: unknown; raw: string } | { ok: false; error: string };

export async function chatJson(args: {
  model: string;
  system: string;
  user: string;
  maxTokens?: number;
  timeoutMs?: number;
  temperature?: number;
}): Promise<ChatResult> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return { ok: false, error: "OPENROUTER_NOT_CONFIGURED" };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), args.timeoutMs ?? 40_000);
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://www.wellowork.net",
        "X-Title": "WelloWork Cognitive Rewards",
      },
      body: JSON.stringify({
        model: args.model,
        temperature: args.temperature ?? 0.7,
        max_tokens: args.maxTokens ?? 3000,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: args.system },
          { role: "user", content: args.user },
        ],
      }),
    });
    if (!res.ok) return { ok: false, error: `HTTP_${res.status}` };
    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string }; finish_reason?: string }> };
    const choice = data.choices?.[0];
    const raw = choice?.message?.content?.trim() ?? "";
    if (!raw) return { ok: false, error: "EMPTY_RESPONSE" };
    if (choice?.finish_reason === "length") return { ok: false, error: "TRUNCATED" };
    try {
      const json = JSON.parse(stripFences(raw));
      return { ok: true, json, raw };
    } catch (err) {
      return { ok: false, error: `BAD_JSON: ${err instanceof Error ? err.message : String(err)}` };
    }
  } catch (err) {
    const name = err instanceof Error ? err.name : "";
    return { ok: false, error: name === "AbortError" ? "TIMEOUT" : err instanceof Error ? err.message : String(err) };
  } finally {
    clearTimeout(timer);
  }
}

function stripFences(s: string): string {
  return s.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
}
