"use client";

import { useEffect, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

/**
 * Details card:
 * ─ Section ① “Key Facts” – static IPO info + company short name
 * ─ Section ② “Market Snapshot” – live Yahoo data (5 min cache)
 *
 * Extra: calculates absolute / % gain from IPO price → current price.
 */
export default function IpoDetailsCard({ ipo }) {
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ───────────────────────── fetch Yahoo once selected ────────────────────── */
  useEffect(() => {
    if (!ipo || !["priced", "active"].includes(ipo.status)) {
      setStock(null);
      return;
    }

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/stock/${ipo.symbol}`);
        if (!res.ok) throw new Error("Yahoo fetch failed");
        const json = await res.json();
        setStock(json.data);
      } catch (err) {
        console.error(err);
        setStock(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [ipo]);

  /* ───────────── compute gain/loss since IPO price (if we have both) ───────── */
  const gain = useMemo(() => {
    if (!stock?.regularMarketPrice || !ipo?.price) return null;
    const diff = stock.regularMarketPrice - ipo.price;
    const pct = (diff / ipo.price) * 100;
    return { diff, pct };
  }, [stock, ipo]);

  /* ─────────────────────────────── rendering ──────────────────────────────── */
  return (
    <AnimatePresence mode="wait">
      {ipo && (
        <motion.aside
          key={ipo.symbol}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="bg-white hover-card rounded-xl shadow-md w-full p-6 space-y-6"
        >
          {/* ───── Section 1 • Overview ───── */}
          <section>
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              {stock?.shortName || ipo.companyName || ipo.symbol}
            </h3>

            <ul className="text-sm text-gray-700 grid grid-cols-2 gap-y-2">
              <li>
                <span className="font-medium">Symbol:</span> {ipo.symbol}
              </li>
              <li>
                <span className="font-medium">Status:</span> {ipo.status}
              </li>
              <li className="col-span-2">
                <span className="font-medium">Listed:</span>{" "}
                {ipo.date
                  ? moment(ipo.date).fromNow()
                  : "—"}
              </li>
              <li>
                <span className="font-medium">IPO Price:</span>{" "}
                {ipo.price ?? "—"}
              </li>
              <li>
                <span className="font-medium">Currency:</span>{" "}
                {stock?.currencySymbol || stock?.currency || "—"}
              </li>
            </ul>
          </section>

          {/* ───── Section 2 • Market Snapshot ───── */}
          <section className="border-t pt-4">
            <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-1">
              <DollarSign size={16} /> Market Snapshot
            </h4>

            {loading ? (
              <p className="text-sm text-blue-600">Loading real-time data...</p>
            ) : stock ? (
              <div className="text-sm text-gray-700 space-y-2">
                <div className="flex justify-between">
                  <span>Current Price</span>
                  <span className="font-semibold">
                    {stock.regularMarketPrice} {stock.currencySymbol || ""}
                  </span>
                </div>

                {gain && (
                  <div className="flex justify-between">
                    <span>
                      Since IPO
                      {gain.diff >= 0 ? (
                        <TrendingUp size={14} className="inline text-green-600" />
                      ) : (
                        <TrendingDown size={14} className="inline text-red-600" />
                      )}
                    </span>
                    <span
                      className={
                        gain.diff >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"
                      }
                    >
                      {gain.diff.toFixed(2)} ({gain.pct.toFixed(2)}%)
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Market Cap</span>
                  <span>{Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: stock.currency || "USD",
                      notation: "compact",
                    }).format(stock.marketCap)}
                  </span>
                </div>

                <p className="text-xs text-gray-400">
                  Source: Yahoo Finance - cached ≤ 5 mins
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">
                No real-time data available.
              </p>
            )}
          </section>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
