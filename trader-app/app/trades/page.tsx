"use client";

import { useState } from "react";
import { Search, TrendingUp, TrendingDown, Pencil, Trash2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { useTrades } from "@/lib/trade-store";
import { NewTradeForm } from "@/components/trades/new-trade-form";
import {
  cn,
  formatCurrency,
  formatDateShort,
  formatR,
  getOutcomeStyle,
} from "@/lib/utils";
import type { Trade } from "@/lib/types";

type OutcomeFilter = "all" | "win" | "loss" | "be" | "open" | "planned";

const OUTCOME_FILTERS: { label: string; value: OutcomeFilter }[] = [
  { label: "All", value: "all" },
  { label: "Win", value: "win" },
  { label: "Loss", value: "loss" },
  { label: "BE", value: "be" },
  { label: "Open", value: "open" },
];

export default function TradesPage() {
  const { trades, deleteTrade, updateTrade } = useTrades();
  const [outcomeFilter, setOutcomeFilter] = useState<OutcomeFilter>("all");
  const [search, setSearch] = useState("");
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);

  const filtered = trades.filter((t) => {
    const matchOutcome =
      outcomeFilter === "all" ||
      (outcomeFilter === "win" && t.outcome === "Win") ||
      (outcomeFilter === "loss" && t.outcome === "Loss") ||
      (outcomeFilter === "be" && t.outcome === "BE") ||
      (outcomeFilter === "open" && t.outcome === "Open") ||
      (outcomeFilter === "planned" && t.outcome === "Planned");
    const q = search.toLowerCase();
    const matchSearch = !q || t.market.toLowerCase().includes(q);
    return matchOutcome && matchSearch;
  });

  function handleDelete(id: string) {
    if (confirm("Delete this trade?")) deleteTrade(id);
  }

  function handleEditSave(trade: Omit<Trade, "id">) {
    if (editingTrade) updateTrade(editingTrade.id, trade);
    setEditingTrade(null);
  }

  return (
    <div className="min-h-full bg-background">
      <Header title="Trades" subtitle="All trade records" />
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center border border-border rounded-md overflow-hidden" style={{ background: "#ffffff" }}>
            {OUTCOME_FILTERS.map((f, i) => (
              <button
                key={f.value}
                onClick={() => setOutcomeFilter(f.value)}
                className={cn(
                  "px-3 py-1.5 transition-colors",
                  i !== 0 && "border-l border-border",
                  outcomeFilter === f.value ? "text-white" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
                style={{ fontSize: 11, fontWeight: 500, background: outcomeFilter === f.value ? "#2383e2" : undefined }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 border border-border rounded-md px-3 py-1.5" style={{ background: "#ffffff", minWidth: 200 }}>
            <Search className="text-muted-foreground flex-shrink-0" style={{ width: 13, height: 13 }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by market..."
              className="bg-transparent text-foreground placeholder:text-muted-foreground outline-none flex-1"
              style={{ fontSize: 13 }}
            />
          </div>
        </div>

        <div className="border border-border rounded-md overflow-hidden" style={{ background: "#ffffff" }}>
          <div
            className="grid border-b border-border px-4 py-2"
            style={{ gridTemplateColumns: "100px 110px 80px 120px 150px 110px 80px 70px 1fr 60px", background: "#f7f7f5" }}
          >
            {["Date", "Market", "Direction", "Session", "Entry Model", "Risk", "PnL", "R", "Outcome"].map((col) => (
              <span key={col} className="text-muted-foreground font-medium uppercase tracking-wide" style={{ fontSize: 11 }}>{col}</span>
            ))}
            <span />
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center text-muted-foreground" style={{ fontSize: 13 }}>No trades found.</div>
          )}

          <div className="divide-y divide-border">
            {filtered.map((trade) => (
              <TradeRow key={trade.id} trade={trade} onEdit={setEditingTrade} onDelete={handleDelete} />
            ))}
          </div>
        </div>

        {filtered.length > 0 && (
          <p className="text-muted-foreground" style={{ fontSize: 11 }}>
            {filtered.length} trade{filtered.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {editingTrade && (
        <NewTradeForm
          initialValues={editingTrade}
          onClose={() => setEditingTrade(null)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
}

function TradeRow({ trade, onEdit, onDelete }: { trade: Trade; onEdit: (t: Trade) => void; onDelete: (id: string) => void }) {
  const isLong = trade.direction === "Long";
  return (
    <div
      className="group grid items-center px-4 py-2.5 hover:bg-secondary transition-colors"
      style={{ gridTemplateColumns: "100px 110px 80px 120px 150px 110px 80px 70px 1fr 60px" }}
    >
      <span className="text-foreground" style={{ fontSize: 13 }}>{formatDateShort(trade.date)}</span>
      <span className="text-foreground font-medium" style={{ fontSize: 13 }}>{trade.market}</span>
      <div className="flex items-center gap-1">
        {isLong ? <TrendingUp style={{ width: 12, height: 12, color: "#0f7b6c" }} /> : <TrendingDown style={{ width: 12, height: 12, color: "#c74a4a" }} />}
        <span style={{ fontSize: 13, color: isLong ? "#0f7b6c" : "#c74a4a" }}>{trade.direction}</span>
      </div>
      <span className="text-muted-foreground" style={{ fontSize: 13 }}>{trade.session}</span>
      <span className="text-foreground" style={{ fontSize: 13 }}>{trade.entryModel}</span>
      <span className="text-muted-foreground" style={{ fontSize: 13 }}>{formatCurrency(trade.risk)}</span>
      <span style={{ fontSize: 13, color: trade.pnl === undefined ? "#a0a09a" : trade.pnl >= 0 ? "#0f7b6c" : "#c74a4a" }}>
        {trade.pnl !== undefined ? `${trade.pnl >= 0 ? "+" : ""}${formatCurrency(trade.pnl)}` : "—"}
      </span>
      <span style={{ fontSize: 13, color: trade.rMultiple === undefined ? "#a0a09a" : trade.rMultiple >= 0 ? "#0f7b6c" : "#c74a4a" }}>
        {trade.rMultiple !== undefined ? formatR(trade.rMultiple) : "—"}
      </span>
      <span className={cn(getOutcomeStyle(trade.outcome))}>{trade.outcome}</span>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(trade)} className="w-6 h-6 rounded flex items-center justify-center transition-colors hover:bg-secondary text-muted-foreground hover:text-foreground" title="Edit trade">
          <Pencil style={{ width: 14, height: 14 }} />
        </button>
        <button
          onClick={() => onDelete(trade.id)}
          className="w-6 h-6 rounded flex items-center justify-center transition-colors hover:bg-secondary text-muted-foreground"
          onMouseEnter={(e) => (e.currentTarget.style.color = "#c74a4a")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "")}
          title="Delete trade"
        >
          <Trash2 style={{ width: 14, height: 14 }} />
        </button>
      </div>
    </div>
  );
}
