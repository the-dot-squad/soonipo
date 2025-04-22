"use server";

import { unstable_cache } from "next/cache";
import moment from "moment";
import connectDB from "./db.js";
import IPO from "@/models/ipo";
import { quote } from "./yahoo.js";

/**
 * getUpcomingIpos - fetches from MongoDB and caches results for 1 hour.
 *
 * Cache Key: ["upcoming-ipos"]
 * Revalidation: 3600 seconds (1 hour)
 */
export const getUpcomingIpos = unstable_cache(
  async () => {
    await connectDB();

    // Find IPOs that are in the future or have no date
    const now = moment().toDate();
    const ipos = await IPO.find({
      $or: [{ date: { $gt: now } }, { date: null }],
    })
      .sort({ date: 1 })
      .limit(100)
      .lean()
      .exec();

    return ipos || [];
  },
  ["upcoming-ipos"],
  { revalidate: 3600 }
);

/**
 * getPastIpos - fetches from MongoDB and caches results for 1 hour.
 */
export const getPastIpos = unstable_cache(
  async () => {
    await connectDB();

    const now = moment().toDate();
    const ipos = await IPO.find({
      date: { $lt: now },
    })
      .sort({ date: -1 })
      .limit(100)
      .lean()
      .exec();

    return ipos || [];
  },
  ["past-ipos"],
  { revalidate: 3600 }
);

/**
 * getStockData - fetch a quote from Yahoo or similar service
 *                and cache the result for 5 minutes.
 *
 * Cache Key: ["stock-data", symbol]
 * Revalidation: 300 seconds (5 mins)
 */
export const getStockData = unstable_cache(
  async (symbol) => {
    if (!symbol) return null;
    return quote(symbol);
  },
  ['stock-data'],          // key – symbol arg is automatically part of the hash
  { revalidate: 300 }       // 5 minutes
);
