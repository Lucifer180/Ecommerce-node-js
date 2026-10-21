const AppError = require("../../shared/errors/AppError");

const DEFAULT_TIMEOUT_MS = 60000;

/**
 * Thin client for Crawler-Service (`GET /search`). A crawl drives real browser
 * sessions across several stores, so it is slow (10–90s) and can fail; every
 * failure is mapped to an operational AppError the error middleware understands.
 */
exports.search = async (q, limit = 20) => {
  if (!process.env.CRAWLER_URL) {
    throw new AppError("Product search is not configured", 503);
  }

  const url = new URL("/search", process.env.CRAWLER_URL);
  url.search = new URLSearchParams({ q, limit: String(limit) }).toString();

  let res;
  try {
    res = await fetch(url, {
      headers: { "x-api-key": process.env.CRAWLER_API_KEY ?? "" },
      signal: AbortSignal.timeout(Number(process.env.CRAWLER_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS),
    });
  } catch (err) {
    if (err.name === "TimeoutError") throw new AppError("Product search timed out, try again", 504);
    throw new AppError("Product search is unavailable right now", 503);
  }

  if (res.status === 400) throw new AppError("Invalid search query", 400);
  if (res.status === 503) throw new AppError("Product search is busy, retry shortly", 503);
  if (!res.ok) throw new AppError("Product search failed", 502);

  return res.json();
};
