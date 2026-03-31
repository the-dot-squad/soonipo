// app/api/cron/route.js   ← rename folder to match vercel.json
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import IPO from "@/models/ipo";
import * as finnhub from "@/lib/finhub";
import { get as getStockExchange } from "@/lib/stockExchanges";
import moment from "moment-timezone";

// Vercel always triggers cron jobs with an HTTP **GET**
export async function GET(request) {
  // ──────────────────── 1. security gate ───────────────────
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // ──────────────────── 2. main job ────────────────────────
  try {
    await connectDB();

    const past = moment().subtract(14, "days");
    const future = moment().add(14, "days");
    const ipos = await finnhub.ipoCalendar(
      past.format("YYYY-MM-DD"),
      future.format("YYYY-MM-DD")
    );

    console.log("Founded ipo items from API:", ipos.length);

    const relevant = ["active", "priced"];
    let i = 0;
    for (const item of ipos) {
      const status = (item.status || "").toLowerCase();
      // ignore active and priced
      //if (relevant.includes(status)) continue;

      // Get exchanges data - manually
      const exchangeMeta = item.exchange
        ? getStockExchange(item.exchange)
        : null;

      console.log("Exchange meta:", exchangeMeta, item.exchange);

      // Convert to date object based on timezone of exchange
      const itemDate = item?.date
        ? moment.tz(item.date, exchangeMeta?.timezone || "UTC").toDate()
        : null;

      const where = item.symbol
        ? { symbol: item.symbol }
        : { companyName: item.name ?? item.companyName };

      // Limit where clause in case of new ipo for previous record
      if (itemDate) {
        where["date"] = {
          $gte: moment(itemDate).subtract(20, "days").toDate(),
        };
      }

      // Insert into db
      await IPO.findOneAndUpdate(
        where,
        {
          symbol: item.symbol,
          companyName: item.name ?? item.companyName ?? null,
          date: itemDate,
          price: item.price ?? null,
          shares: {
            number: item.numberOfShares ?? 0,
            value: item.totalSharesValue ?? 0,
          },
          exchange: {
            symbol: exchangeMeta?.symbol ?? item.exchange ?? null,
            country: exchangeMeta?.countryISO ?? null,
          },
          source: "finnhub",
          updatedAt: new Date(),
          status,
        },
        { upsert: true, new: true }
      );
      i++;
    }

    console.log("Inserted items: ", i);

    return NextResponse.json({ ok: true, found: ipos.length, inserted: i });
  } catch (err) {
    console.error("[cron] Error:", err);
    return NextResponse.json(
      { error: err.message ?? "Failed to update IPO data" },
      { status: 500 }
    );
  }
}
