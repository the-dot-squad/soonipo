import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

function isRateLimitedError(err) {
  const message = String(err?.message || "").toLowerCase();
  return message.includes("too many requests") || message.includes("429");
}

function toChartRows(chartJson) {
  const result = chartJson?.chart?.result?.[0];
  if (!result) return [];
  const timestamps = result.timestamp || [];
  const quote = result.indicators?.quote?.[0] || {};
  const closes = quote.close || [];
  const opens = quote.open || [];
  const highs = quote.high || [];
  const lows = quote.low || [];
  const volumes = quote.volume || [];

  return timestamps
    .map((ts, i) => ({
      date: new Date(ts * 1000),
      open: opens[i] ?? null,
      high: highs[i] ?? null,
      low: lows[i] ?? null,
      close: closes[i] ?? null,
      volume: volumes[i] ?? null,
    }))
    .filter((row) => typeof row.close === "number");
}

/**
 * Fetch the "price" portion of Yahoo's quoteSummary for a given symbol.
 * 
 * @param {string} symbol - e.g. "AAPL"
 * @returns {object|null} - The "price" data object or null if not found/error
 */
export async function quote(symbol) {
  try {
    const data = await yahooFinance.quoteSummary(symbol, { modules: ["price"] });
    if (!data || !data.price) {
      return null;
    }
    return data.price; // e.g. { symbol, regularMarketPrice, currency, ... }
  } catch (err) {
    if (!isRateLimitedError(err)) {
      console.error("Yahoo Finance API error on quoteSummary:", err);
    }
    return null;
  }
}

/**
 * Fetch historical price data for a given symbol between two dates.
 * 
 * @param {string} symbol - e.g. "AAPL"
 * @param {string|number|Date} from - Start of period
 * @param {string|number|Date} to - End of period
 * @param {string} [interval="1d"] - e.g. "1d", "1wk", "1mo"
 * @returns {Array|null} - Array of historical data or null on error
 */
export async function history(symbol, from, to, interval = "1d") {
  try {
    // node-yahoo-finance2 automatically parses date-like inputs
    const data = await yahooFinance.historical(symbol, {
      period1: from,
      period2: to,
      interval,
    });
    if (!data) {
      return null;
    }
    return data; // e.g. [{ date, open, close, volume, ... }, ...]
  } catch (err) {
    if (!isRateLimitedError(err)) {
      console.error("Yahoo Finance API error on historical:", err);
    }
    return null;
  }
}

/**
 * Fetch Yahoo chart data directly from query1 endpoint.
 * This bypasses quoteSummary consent/crumb loops that are often rate-limited.
 */
export async function chartRange(symbol, range = "1y", interval = "1d") {
  try {
    const encoded = encodeURIComponent(symbol);
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encoded}?range=${range}&interval=${interval}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    const rows = toChartRows(json);
    const meta = json?.chart?.result?.[0]?.meta || null;
    return { rows, meta };
  } catch (err) {
    if (!isRateLimitedError(err)) {
      console.error("Yahoo Finance API error on chartRange:", err);
    }
    return null;
  }
}

/**
 * Same shape as quoteSummary "price" module where possible.
 * Uses quoteSummary first; falls back to chart last close (works for many SPACs / thin symbols when quoteSummary fails).
 */
export async function quoteWithChartFallback(symbol) {
  if (!symbol) return null;
  const fromSummary = await quote(symbol);
  if (fromSummary && toNumber(fromSummary.regularMarketPrice) != null) {
    return fromSummary;
  }

  const chart = await chartRange(symbol, "1mo", "1d");
  const rows = chart?.rows || [];
  const meta = chart?.meta;
  if (!rows.length || typeof rows[rows.length - 1]?.close !== "number") {
    return null;
  }

  const last = rows[rows.length - 1];
  const currency = meta?.currency || "USD";
  const currencySymbol =
    currency === "USD"
      ? "$"
      : currency === "GBP"
        ? "£"
        : currency === "EUR"
          ? "€"
          : currency === "JPY"
            ? "¥"
            : currency;

  return {
    symbol: meta?.symbol || symbol,
    shortName: meta?.shortName || meta?.longName || meta?.symbol || symbol,
    longName: meta?.longName || meta?.shortName,
    regularMarketPrice: last.close,
    currency,
    currencySymbol,
    marketCap: undefined,
    source: "chart",
  };
}

function toNumber(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "object" && typeof value.raw === "number") return value.raw;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}
