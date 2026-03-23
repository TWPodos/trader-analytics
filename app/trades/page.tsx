"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { mockTrades } from "@/lib/mock-data";
import { cn, formatCurrency, getPnlColor, getPnlBg } from "@/lib/utils";
import {
  Filter, ArrowUpDown, CheckCircle2, XCircle, Search,
  TrendingUp, TrendingDown, Tag, Calendar, MoreHorizontal,
} from "lucide-react";

type FilterType = "all" | "long" | "short" | "win" | "loss";

export default function TradesPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");

  const filtered = mockTrades.filter((t) => {
    if (filter === "long") return t.direction === "LONG";
    if (filter === "short") return t.direction === "SHORT";
    if (filter === "win") return t.pnl > 0;
    if (filter === "loss") return t.pnl < 0;
    if (search) return t.instrument.toLowerCase().includes(search.toLowerCase()) || t.setup.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const totalPnl = filtered.reduce((s, t) => s + t.pnl, 0);
  const wins = filtered.filter((t) => t.pnl > 0).length;
  const winRate = filtered.length ? ((wins / filtered.length) * 100).toFixed(1) : "0";

  return (
    <div className="min-h-full">
      <Header title="Trade Log" subtitle={`${mockTrades.length} trades recorded`} />

      <div className="p-6 space-y-5 animate-fade-in">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Showing", value: `${filtered.length} trades` },
            { label: "P&L", value: formatCurrency(totalPnl), colored: true, positive: totalPnl >= 0 },
            { label: "Win Rate", value: `${winRate}%` },
          ].map(({ label, value, colored, positive }) => (
            <div key={label} className="bg-card border border-border rounded-xl px-4 py-3">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className={cn("text-lg font-bold mt-0.5", colored ? (positive ? "text-emerald-400" : "text-red-400") : "text-foreground")}>
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1">
            {(["all", "long", "short", "win", "loss"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all",
                  filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-1 max-w-xs bg-card border border-border rounded-lg px-3 py-1.5">
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search instrument or setup..."
              className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none flex-1"
            />
          </div>

          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Filter className="w-3.5 h-3.5" />
            Filter
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowUpDown className="w-3.5 h-3.5" />
            Sort
          </button>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-[80px_120px_1fr_100px_100px_80px_60px] gap-3 px-5 py-3 border-b border-border bg-accent/30">
            {["Date", "Instrument", "Setup & Notes", "Entry/Exit", "P&L", "Rules", ""].map((h) => (
              <span key={h} className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{h}</span>
            ))}
          </div>
          <div className="divide-y divide-border">
            {filtered.map((trade) => (
              <div
                key={trade.id}
                className="grid grid-cols-[80px_120px_1fr_100px_100px_80px_60px] gap-3 px-5 py-4 hover:bg-accent/20 transition-colors items-center group"
              >
                <div>
                  <p className="text-xs text-muted-foreground">{trade.date.slice(5)}</p>
                  <p className="text-[10px] text-muted-foreground/60">{trade.session}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    trade.direction === "LONG" ? "bg-emerald-400/10" : "bg-red-400/10"
                  )}>
                    {trade.direction === "LONG"
                      ? <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      : <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                    }
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{trade.instrument}</p>
                    <p className={cn("text-[10px] font-medium", trade.direction === "LONG" ? "text-emerald-400" : "text-red-400")}>
                      {trade.direction}
                    </p>
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{trade.setup}</p>
                  <div className="flex items-center gap-1 mt-1 flex-wrap">
                    {trade.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-[10px] bg-accent text-muted-foreground px-1.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                    {trade.note && (
                      <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">{trade.note}</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-foreground font-mono">{trade.entry}</p>
                  <p className="text-xs text-muted-foreground font-mono">→ {trade.exit}</p>
                </div>
                <div>
                  <span className={cn("text-sm font-bold px-2 py-1 rounded-lg", getPnlBg(trade.pnl))}>
                    {trade.pnl >= 0 ? "+" : ""}{formatCurrency(trade.pnl)}
                  </span>
                  <p className="text-[10px] text-muted-foreground mt-1">{trade.size} lot{trade.size > 1 ? "s" : ""}</p>
                </div>
                <div className="flex items-center gap-1">
                  {trade.ruleFollowed
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    : <XCircle className="w-4 h-4 text-red-400" />
                  }
                  <span className="text-[10px] text-muted-foreground">
                    {trade.ruleFollowed ? "OK" : "Broke"}
                  </span>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
