import yahooFinance from "yahoo-finance2";

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
    console.error("Yahoo Finance API error on quoteSummary:", err);
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
    console.error("Yahoo Finance API error on historical:", err);
    return null;
  }
}
