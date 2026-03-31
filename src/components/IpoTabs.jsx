"use client";

import { useState } from "react";
import Tabs from "./Tabs";
import IpoTable from "./IpoTable";
import IpoDetailsCard from "./IpoDetailsCard";
import MarketSidebar from "./MarketSidebar";
import { Card, CardContent } from "@/components/ui/card";

export default function IpoTabs({ upcomingIpos, pastIpos, marketOverview }) {
  const [active, setActive] = useState("upcoming");
  const [selected, setSelected] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [selectedHistory, setSelectedHistory] = useState([]);
  const [loadingSelectedStock, setLoadingSelectedStock] = useState(false);
  const [query, setQuery] = useState("");
  const [detailHint, setDetailHint] = useState("");

  const ipos = active === "upcoming" ? upcomingIpos : pastIpos;
  const filteredIpos = ipos.filter((ipo) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      ipo.symbol?.toLowerCase().includes(q) ||
      ipo.companyName?.toLowerCase().includes(q) ||
      ipo.exchange?.symbol?.toLowerCase().includes(q)
    );
  });

  const handleRowSelect = (ipo) => {
    setSelected(ipo);
    setSelectedStock(null);
    setSelectedHistory([]);
    setDetailHint("");
    const status = (ipo?.status ?? "").toString().toLowerCase().trim();
    const isTradableStatus = ["priced", "active"].includes(status);
    const isPastTab = active === "past";
    if (!ipo?.symbol || (!isPastTab && !isTradableStatus)) {
      if (ipo?.symbol && !isPastTab && !isTradableStatus) {
        setDetailHint("Market details open for listed tickers (priced/active) or any row in the Past tab.");
      }
      return;
    }

    (async () => {
      setLoadingSelectedStock(true);
      try {
        const [stockRes, histRes] = await Promise.all([
          fetch(`/api/stock/${encodeURIComponent(ipo.symbol)}`),
          fetch(`/api/stock/${encodeURIComponent(ipo.symbol)}?range=7d&interval=1d`),
        ]);
        const json = await stockRes.json();
        const histJson = await histRes.json();
        if (json?.data) {
          setSelectedStock(json.data);
          if (Array.isArray(histJson?.data)) {
            setSelectedHistory(
              histJson.data
                .filter((p) => typeof p?.close === "number")
                .map((p) => ({ d: p.date, c: p.close }))
            );
          }
        } else {
          setDetailHint("No live market data is available for this IPO yet.");
        }
      } catch {
        setDetailHint("Live market data is temporarily unavailable.");
      } finally {
        setLoadingSelectedStock(false);
      }
    })();
  };

  const handleTabChange = (id) => {
    setActive(id);
    setSelected(null);
    setSelectedStock(null);
    setSelectedHistory([]);
    setDetailHint("");
    setQuery("");
  };

  const shouldShowDetail = Boolean(selected && selectedStock);
  const normalizedHistory =
    selectedHistory.length > 0
      ? (() => {
          const base = selectedHistory[0]?.c;
          return selectedHistory.map((p) => ({
            ...p,
            pct: base ? ((p.c - base) / base) * 100 : 0,
          }));
        })()
      : [];

  return (
    <div className="relative">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Tabs active={active} onChange={handleTabChange} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by symbol, company, exchange..."
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-ring transition focus-visible:ring-2 md:w-[320px]"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="self-start space-y-4 xl:col-span-3">
          {shouldShowDetail && <IpoDetailsCard ipo={selected} stock={selectedStock} history={normalizedHistory} />}
          <MarketSidebar indices={marketOverview} />
        </div>

        <div className="xl:col-span-9">
          {(loadingSelectedStock || detailHint) && (
            <Card className="mb-4 border-border/70 bg-card/80">
              <CardContent className="p-3 text-sm text-muted-foreground">
                {loadingSelectedStock ? "Loading live market data..." : detailHint}
              </CardContent>
            </Card>
          )}
          <IpoTable ipos={filteredIpos} onSelectIpo={handleRowSelect} />
        </div>

      </div>
    </div>
  );
}
