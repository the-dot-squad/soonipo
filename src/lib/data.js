"use server";

import { cacheLife, cacheTag } from "next/cache";
import moment from "moment";
import connectDB from "./db.js";
import IPO from "@/models/ipo";
import { quoteWithChartFallback, chartRange } from "./yahoo.js";

function toPlain(value) {
  return JSON.parse(JSON.stringify(value));
}

const MARKET_INDICES = [
  { symbol: "^GSPC", name: "S&P 500" },
  { symbol: "^DJI", name: "Dow Jones" },
  { symbol: "^IXIC", name: "NASDAQ" },
  { symbol: "^RUT", name: "Russell 2000" },
  { symbol: "^FTSE", name: "FTSE 100" },
  { symbol: "^N225", name: "Nikkei 225" },
  { symbol: "BTC-USD", name: "Bitcoin" },
];

function pctChange(current, base) {
  if (current === null || base === null || base === 0) return null;
  return ((current - base) / base) * 100;
}

function toNumber(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return value;
  if (typeof value === "object" && typeof value.raw === "number") return value.raw;
  return Number(value);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * getUpcomingIpos - fetches from MongoDB with cache life and tag.
 */
export async function getUpcomingIpos() {
  "use cache";
  cacheLife("hours");
  cacheTag("ipos", "ipos-upcoming");

  await connectDB();
  const now = moment().toDate();
  const ipos = await IPO.find({
    $or: [{ date: { $gt: now } }, { date: null }],
  })
    .sort({ date: 1 })
    .limit(100)
    .lean()
    .exec();

  return toPlain(ipos || []);
}

/**
 * getPastIpos - fetches past IPOs with cache life and tag.
 */
export async function getPastIpos() {
  "use cache";
  cacheLife("hours");
  cacheTag("ipos", "ipos-past");

  await connectDB();
  const now = moment().toDate();
  const ipos = await IPO.find({
    date: { $lt: now },
  })
    .sort({ date: -1 })
    .limit(100)
    .lean()
    .exec();

  return toPlain(ipos || []);
}

/**
 * getStockData - fetch a quote from Yahoo or similar service
 *                and cache the result for 5 minutes.
 *
 * Uses argument-aware function caching in Next.js 16.
 */
export async function getStockData(symbol) {
  "use cache";
  cacheLife("minutes");
  cacheTag("stock", `stock-${symbol}`);

  if (!symbol) return null;
  return quoteWithChartFallback(symbol);
}

export async function getMarketOverview() {
  "use cache";
  cacheLife("hours");
  cacheTag("market-overview");

  const now = new Date();
  const indices = [];
  for (const item of MARKET_INDICES) {
    const chart = await chartRange(item.symbol, "1y", "1d");
    const points = chart?.rows || [];
    if (!points.length) {
      console.warn(`[MarketPulse] No chart data for ${item.symbol}`);
    }
    const latest = points.length ? points[points.length - 1] : null;
    const prev = points.length > 1 ? points[points.length - 2] : null;
    const weekBase = points.length > 6 ? points[points.length - 6] : points[0] || null;
    const yearBase = points[0] || null;
    const current = toNumber(latest?.close);
    const previousClose = toNumber(prev?.close);
    const dayPct = pctChange(current, previousClose);
    const sparkWindow = points.slice(-7);
    const sparkBase = sparkWindow[0]?.close ?? null;
    const spark = sparkWindow.map((p) => ({
      d: p.date,
      c: p.close,
      pct: pctChange(p.close, sparkBase),
    }));
    const weekFromSpark = spark.length > 1 ? spark[spark.length - 1].pct : null;

    const result = {
      ...item,
      price: current ?? null,
      currency: chart?.meta?.currency || "",
      dayPct,
      weekPct: weekFromSpark ?? pctChange(current, weekBase?.close ?? null),
      yearPct: pctChange(current, yearBase?.close ?? null),
      spark,
    };

    indices.push(result);
    await delay(80);
  }

  return toPlain(indices);
}
