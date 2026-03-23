"use client";

import { Header } from "@/components/layout/header";
import { useTrades } from "@/lib/trade-store";
import { useJournal } from "@/lib/journal-store";
import { cn, formatCurrency, formatDateLong } from "@/lib/utils";
import type { Trade } from "@/lib/types";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

interface DayGroup {
  date: string;
  trades: Trade[];
  totalPnl: number;
  winCount: number;
  lossCount: number;
  beCount: number;
}

function groupTradesByDate(trades: Trade[]): DayGroup[] {
  const map = new Map<string, Trade[]>();

  for (const trade of trades) {
    const existing = map.get(trade.date) ?? [];
    existing.push(trade);
    map.set(trade.date, existing);
  }

  const groups: DayGroup[] = [];

  map.forEach((dayTrades, date) => {
    const totalPnl = dayTrades.reduce((sum, t) => sum + (t.pnl ?? 0), 0);
    const winCount = dayTrades.filter((t) => t.outcome === "Win").length;
    const lossCount = dayTrades.filter((t) => t.outcome === "Loss").length;
    const beCount = dayTrades.filter((t) => t.outcome === "BE").length;

    groups.push({ date, trades: dayTrades, totalPnl, winCount, lossCount, beCount });
  });

  // Sort descending — newest first
  return groups.sort((a, b) => b.date.localeCompare(a.date));
}

// ─────────────────────────────────────────────
// Journal Entry Card
// ─────────────────────────────────────────────

function JournalEntryCard({ group }: { group: DayGroup }) {
  const { notes, setNote } = useJournal();
  const noteText = notes[group.date] ?? "";

  const pnlPositive = group.totalPnl > 0;
  const pnlNegative = group.totalPnl < 0;

  return (
    <div
      className="bg-white border rounded-lg p-5 space-y-4"
      style={{ borderColor: "#e9e9e7" }}
    >
      {/* Card header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className="font-semibold"
            style={{ fontSize: "14px", color: "#37352f" }}
          >
            {formatDateLong(group.date)}
          </p>
          <p
            className="mt-0.5"
            style={{ fontSize: "11px", color: "#9b9a97" }}
          >
            {group.trades.length} trade{group.trades.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Daily PnL badge */}
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-1 rounded font-semibold",
            "text-[13px]"
          )}
          style={{
            backgroundColor: pnlPositive
              ? "rgba(15, 123, 108, 0.08)"
              : pnlNegative
              ? "rgba(199, 74, 74, 0.08)"
              : "rgba(55, 53, 47, 0.06)",
            color: pnlPositive
              ? "#0f7b6c"
              : pnlNegative
              ? "#c74a4a"
              : "#37352f",
          }}
        >
          {pnlPositive ? "+" : ""}
          {formatCurrency(group.totalPnl)}
        </span>
      </div>

      {/* Win / Loss / BE counters */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: "#0f7b6c" }}
          />
          <span style={{ fontSize: "11px", color: "#9b9a97" }}>
            <span className="font-semibold" style={{ color: "#0f7b6c" }}>
              {group.winCount}
            </span>{" "}
            Win
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: "#c74a4a" }}
          />
          <span style={{ fontSize: "11px", color: "#9b9a97" }}>
            <span className="font-semibold" style={{ color: "#c74a4a" }}>
              {group.lossCount}
            </span>{" "}
            Loss
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: "#9b9a97" }}
          />
          <span style={{ fontSize: "11px", color: "#9b9a97" }}>
            <span className="font-semibold" style={{ color: "#37352f" }}>
              {group.beCount}
            </span>{" "}
            BE
          </span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", backgroundColor: "#e9e9e7" }} />

      {/* Notes textarea */}
      <div>
        <label
          className="block mb-1.5 font-medium"
          style={{ fontSize: "11px", color: "#9b9a97", letterSpacing: "0.02em" }}
        >
          NOTES
        </label>
        <textarea
          value={noteText}
          onChange={(e) => setNote(group.date, e.target.value)}
          placeholder="Write your reflection for this session..."
          rows={3}
          className="w-full rounded resize-none outline-none transition-colors"
          style={{
            fontSize: "13px",
            color: "#37352f",
            backgroundColor: "#f7f6f3",
            border: "1px solid #e9e9e7",
            padding: "8px 10px",
            lineHeight: "1.6",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#2383e2";
            e.currentTarget.style.backgroundColor = "#ffffff";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#e9e9e7";
            e.currentTarget.style.backgroundColor = "#f7f6f3";
          }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

export default function JournalPage() {
  const { trades } = useTrades();
  const groups = groupTradesByDate(trades);

  return (
    <div className="min-h-full bg-white">
      <Header
        title="Journal"
        subtitle="Daily trading notes & reflections"
      />

      <div className="p-6 max-w-3xl mx-auto space-y-3">
        {groups.length === 0 ? (
          // Empty state
          <div
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: "#f7f6f3" }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9b9a97"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <p
              className="font-medium"
              style={{ fontSize: "14px", color: "#37352f" }}
            >
              No journal entries yet
            </p>
            <p
              className="mt-1"
              style={{ fontSize: "13px", color: "#9b9a97" }}
            >
              Start by adding trades.
            </p>
          </div>
        ) : (
          groups.map((group) => (
            <JournalEntryCard key={group.date} group={group} />
          ))
        )}
      </div>
    </div>
  );
}
