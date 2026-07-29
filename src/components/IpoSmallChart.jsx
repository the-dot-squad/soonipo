"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  XAxis,
} from "recharts";
import dayjs from "@/lib/dayjs";

/**
 * Fetches historical prices from /api/stocks/[symbol]?from=...&to=...
 * and displays a spark‑line from IPO date → now.
 */
export default function IpoSparkline({ symbol, ipoDate }) {
  const [points, setPoints] = useState(null);

  useEffect(() => {
    if (!symbol || !ipoDate) return;

    const url = `/api/stock/${symbol}?from=${ipoDate}&to=${dayjs().format(
      "YYYY-MM-DD"
    )}&interval=1d`;

    (async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("hist fetch");
        const json = await res.json(); // { data: [ { date, close, ... } ] }
        const formatted = json.data.map((d) => ({
          x: d.date.slice(0, 10),
          y: d.close,
        }));
        setPoints(formatted);
      } catch (err) {
        console.error(err);
        setPoints(null);
      }
    })();
  }, [symbol, ipoDate]);

  if (!points?.length) return null;

  return (
    <ResponsiveContainer width="100%" height={80}>
      <LineChart data={points}>
        <XAxis hide dataKey="x" />
        <Tooltip
          formatter={(v) => v.toFixed(2)}
          labelFormatter={(l) => dayjs(l).format("MMM DD YYYY")}
        />
        <Line
          type="monotone"
          dataKey="y"
          stroke="#2563eb"
          dot={false}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
