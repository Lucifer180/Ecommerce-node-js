const AppError = require("../../shared/errors/AppError");
const logger = require("../../shared/utils/logger");

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
// llama-3.3-70b-versatile was retired from Groq; gpt-oss-120b is its current
// general-purpose model and supports JSON mode.
const DEFAULT_MODEL = "openai/gpt-oss-120b";
const TIMEOUT_MS = 15000;

/**
 * Minimal Groq chat-completions client (OpenAI-compatible API). Asks for a
 * JSON object back and returns it parsed. Every failure becomes an
 * operational AppError; the API key and raw upstream errors are only logged.
 */
exports.completeJson = async ({ system, user, temperature = 0.3, maxTokens = 2000 }) => {
  if (!process.env.GROQ_API_KEY) {
    throw new AppError("Recommendations are not configured", 503);
  }

  const model = process.env.GROQ_MODEL || DEFAULT_MODEL;
  // gpt-oss models reason before answering, and those tokens count against
  // max_tokens; a light suggestion task doesn't need much of it.
  const reasoning = model.startsWith("openai/gpt-oss") ? { reasoning_effort: "low" } : {};

  let res;
  try {
    res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        ...reasoning,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
        temperature,
        max_tokens: maxTokens,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    if (err.name === "TimeoutError") throw new AppError("Recommendations timed out, try again", 504);
    throw new AppError("Recommendations are unavailable right now", 503);
  }

  if (!res.ok) {
    logger.warn("Groq request failed", { status: res.status, body: (await res.text()).slice(0, 300) });
    if (res.status === 429) throw new AppError("Recommendations are busy, retry shortly", 503);
    throw new AppError("Recommendations are unavailable right now", 502);
  }

  const body = await res.json();
  const content = body.choices?.[0]?.message?.content;

  try {
    return JSON.parse(content);
  } catch {
    logger.warn("Groq returned non-JSON content", { content: String(content).slice(0, 300) });
    throw new AppError("Recommendations are unavailable right now", 502);
  }
};
