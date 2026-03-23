"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { mockTrades } from "./mock-data";
import type { Trade } from "./types";

interface TradeStore {
  trades: Trade[];
  addTrade: (trade: Omit<Trade, "id">) => void;
}

const TradeContext = createContext<TradeStore>({
  trades: [],
  addTrade: () => {},
});

const STORAGE_KEY = "traderos_trades";

export function TradeProvider({ children }: { children: React.ReactNode }) {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTrades(JSON.parse(stored));
      } else {
        setTrades(mockTrades);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTrades));
      }
    } catch {
      setTrades(mockTrades);
    }
  }, []);

  const addTrade = useCallback((trade: Omit<Trade, "id">) => {
    const newTrade: Trade = { ...trade, id: `t-${Date.now()}` };
    setTrades((prev) => {
      const updated = [newTrade, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  return (
    <TradeContext.Provider value={{ trades, addTrade }}>
      {children}
    </TradeContext.Provider>
  );
}

export function useTrades() {
  return useContext(TradeContext);
}
