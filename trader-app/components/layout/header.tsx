"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { NewTradeForm } from "@/components/trades/new-trade-form";
import { useTrades } from "@/lib/trade-store";
import type { Trade } from "@/lib/types";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const [showNewTrade, setShowNewTrade] = useState(false);
  const { addTrade } = useTrades();

  function handleSave(trade: Omit<Trade, "id">) {
    addTrade(trade);
  }

  return (
    <>
      <header className="h-12 border-b border-border bg-background flex items-center justify-between px-6 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <h1 className="text-[15px] font-semibold text-foreground">{title}</h1>
          {subtitle && (
            <span className="text-[13px] text-muted-foreground">{subtitle}</span>
          )}
        </div>
        <button
          onClick={() => setShowNewTrade(true)}
          className="flex items-center gap-1.5 h-7 px-3 rounded bg-primary text-white text-[13px] font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          New Trade
        </button>
      </header>

      {showNewTrade && (
        <NewTradeForm
          onClose={() => setShowNewTrade(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
