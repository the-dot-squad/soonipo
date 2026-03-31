import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function fmtPercent(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "N/A";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function fmtPrice(price, currency) {
  if (price === null || price === undefined || Number.isNaN(Number(price))) return "N/A";
  const n = Number(price);
  const cur = (currency || "").toUpperCase();
  if (cur === "JPY") {
    return `${Math.round(n).toLocaleString("en-US")} ${currency || ""}`.trim();
  }
  return `${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${currency || ""}`.trim();
}

function TrendValue({ value }) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return <span className="text-xs text-muted-foreground">N/A</span>;
  }
  const positive = value >= 0;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${positive ? "text-green-600" : "text-red-600"}`}>
      {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {fmtPercent(value)}
    </span>
  );
}

function Sparkline({ data = [], positive = true }) {
  if (data.length < 2) return null;
  const width = 220;
  const height = 42;
  const pad = 4;
  const values = data.map((p) => Number(p.pct) || 0);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = pad + (i * (width - pad * 2)) / (values.length - 1);
      const y = height - pad - ((v - min) / range) * (height - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const start = new Date(data[0].d).toLocaleDateString("en-US", { weekday: "short" });
  const end = new Date(data[data.length - 1].d).toLocaleDateString("en-US", { weekday: "short" });

  return (
    <div className="mb-2">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-11 w-full overflow-visible">
        <polyline
          fill="none"
          stroke={positive ? "#16a34a" : "#dc2626"}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
        />
      </svg>
      <div className="mt-0.5 flex justify-between text-[10px] text-muted-foreground">
        <span>{start}</span>
        <span>{end}</span>
      </div>
    </div>
  );
}

export default function MarketSidebar({ indices = [] }) {
  return (
    <Card className="glass sticky top-24">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Market Pulse</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {indices.map((item) => (
          <div key={item.symbol} className="rounded-lg border border-border/70 bg-card/70 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.symbol}</p>
            </div>
            <p className="mb-2 text-sm text-foreground">
              {fmtPrice(item.price, item.currency)}
            </p>
            {Array.isArray(item.spark) && item.spark.length > 1 && <Sparkline data={item.spark} positive={(item.weekPct ?? 0) >= 0} />}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">1D</p>
                <TrendValue value={item.dayPct} />
              </div>
              <div>
                <p className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">1W</p>
                <TrendValue value={item.weekPct} />
              </div>
              <div>
                <p className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">1Y</p>
                <TrendValue value={item.yearPct} />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
