"use client";

import { useMemo } from "react";
import moment from "moment";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Details card:
 * ─ Section ① “Key Facts” – static IPO info + company short name
 * ─ Section ② “Market Snapshot” – live Yahoo data (5 min cache)
 *
 * Extra: calculates absolute / % gain from IPO price → current price.
 */
export default function IpoDetailsCard({ ipo, stock, history = [] }) {
  const gain = useMemo(() => {
    const ipoPrice = Number(ipo?.price);
    const live = Number(stock?.regularMarketPrice);
    if (!Number.isFinite(live) || !Number.isFinite(ipoPrice) || ipoPrice === 0) return null;
    const diff = live - ipoPrice;
    const pct = (diff / ipoPrice) * 100;
    return { diff, pct };
  }, [stock, ipo]);

  /* ─────────────────────────────── rendering ──────────────────────────────── */
  if (!ipo || !stock) return null;

  const chartValues = history.map((h) => Number(h.pct) || 0);
  const showHistory = chartValues.length > 1;
  const min = showHistory ? Math.min(...chartValues) : 0;
  const max = showHistory ? Math.max(...chartValues) : 1;
  const range = max - min || 1;
  const width = 220;
  const height = 48;
  const pad = 4;
  const points = showHistory
    ? chartValues
        .map((v, i) => {
          const x = pad + (i * (width - pad * 2)) / (chartValues.length - 1);
          const y = height - pad - ((v - min) / range) * (height - pad * 2);
          return `${x},${y}`;
        })
        .join(" ")
    : "";
  const historyPositive = (history[history.length - 1]?.pct ?? 0) >= 0;
  const startLabel = showHistory
    ? new Date(history[0].d).toLocaleDateString("en-US", { weekday: "short" })
    : "";
  const endLabel = showHistory
    ? new Date(history[history.length - 1].d).toLocaleDateString("en-US", { weekday: "short" })
    : "";

  return (
    <aside className="w-full">
      <Card className="glass w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {stock?.shortName || ipo.companyName || ipo.symbol}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <ul className="grid grid-cols-2 gap-y-2 text-sm text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">Symbol:</span> {ipo.symbol}
              </li>
              <li>
                <span className="font-medium text-foreground">Status:</span> {ipo.status}
              </li>
              <li className="col-span-2">
                <span className="font-medium text-foreground">Listed:</span>{" "}
                {ipo.date ? moment(ipo.date).fromNow() : "-"}
              </li>
              <li>
                <span className="font-medium text-foreground">IPO Price:</span> {ipo.price ?? "-"}
              </li>
              <li>
                <span className="font-medium text-foreground">Currency:</span>{" "}
                {stock?.currencySymbol || stock?.currency || "-"}
              </li>
            </ul>
          </section>

          <section className="border-t pt-4">
            <h4 className="mb-3 flex items-center gap-1 font-medium">
              <DollarSign size={16} /> Market Snapshot
            </h4>

            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Current Price</span>
                <span className="font-semibold text-foreground">
                  {Number.isFinite(Number(stock.regularMarketPrice))
                    ? Number(stock.regularMarketPrice).toLocaleString("en-US", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })
                    : stock.regularMarketPrice}{" "}
                  {stock.currencySymbol || ""}
                </span>
              </div>

              {gain && (
                <div className="flex justify-between">
                  <span>
                    Since IPO{" "}
                    {gain.diff >= 0 ? (
                      <TrendingUp size={14} className="inline text-green-600" />
                    ) : (
                      <TrendingDown size={14} className="inline text-red-600" />
                    )}
                  </span>
                  <span className={gain.diff >= 0 ? "font-medium text-green-600" : "font-medium text-red-600"}>
                    {gain.diff.toFixed(2)} ({gain.pct.toFixed(2)}%)
                  </span>
                </div>
              )}

              {typeof stock.marketCap === "number" && Number.isFinite(stock.marketCap) && (
                <div className="flex justify-between">
                  <span>Market Cap</span>
                  <span className="text-foreground">
                    {Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: stock.currency || "USD",
                      notation: "compact",
                    }).format(stock.marketCap)}
                  </span>
                </div>
              )}

              {showHistory && (
                <div className="mt-2">
                  <svg viewBox={`0 0 ${width} ${height}`} className="h-12 w-full overflow-visible">
                    <polyline
                      fill="none"
                      stroke={historyPositive ? "#16a34a" : "#dc2626"}
                      strokeWidth="2"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      points={points}
                    />
                  </svg>
                  <div className="mt-0.5 flex justify-between text-[10px] text-muted-foreground">
                    <span>{startLabel}</span>
                    <span>{endLabel}</span>
                  </div>
                </div>
              )}

              <p className="text-xs text-muted-foreground">Source: Yahoo Finance - cached up to 5 mins</p>
            </div>
          </section>
        </CardContent>
      </Card>
    </aside>
  );
}
