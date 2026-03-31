import { NextResponse } from "next/server";
import * as YahooFinance from "@/lib/yahoo.js";
import { getStockData } from "@/lib/data.js";

/**
 * GET /api/stock/[symbol]
 *
 * If no query params for 'from' and 'to' are provided, returns a single "quote" from Yahoo.
 * If 'from' and 'to' are provided, returns historical data instead.
 *
 * Examples:
 *   GET /api/stock/AAPL           -> quote data
 *   GET /api/stock/AAPL?from=2023-01-01&to=2023-03-01&interval=1d  -> daily historical data
 */
export async function GET(request, { params }) {
  try {
    const { symbol } =  await params;
    if (!symbol) {
      return NextResponse.json(
        { error: "Symbol parameter is required" },
        { status: 400 }
      );
    }

    // Parse query params from the request
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const range = searchParams.get("range");
    const interval = searchParams.get("interval") || "1d"; // default to 1 day
    
    let result = null;

    if (range) {
      const chart = await YahooFinance.chartRange(symbol, range, interval);
      result = chart?.rows || null;
    } else if (from && to) {
      // If we have both from & to, fetch historical data
      result = await YahooFinance.history(symbol, from, to, interval);
    } else {
      // Otherwise, fetch a single quote
      result = await getStockData(symbol);
    }

    return NextResponse.json({
      symbol,
      data: result || null,
      unavailable: !result,
    });
  } catch (err) {
    console.error("Error in [symbol] route:", err);
    return NextResponse.json(
      { error: err.message || "Internal error" },
      { status: 500 }
    );
  }
}
