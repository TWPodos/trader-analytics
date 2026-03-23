"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface Rule {
  id: string;
  text: string;
  violationCount: number;
}

const DEFAULT_RULES: Rule[] = [
  { id: "r1", text: "Never risk more than 1% per trade", violationCount: 0 },
  { id: "r2", text: "Only trade A+ and A setups", violationCount: 0 },
  { id: "r3", text: "No revenge trading after 2 consecutive losses", violationCount: 0 },
  { id: "r4", text: "Always define stop loss before entry", violationCount: 0 },
  { id: "r5", text: "Trade only during planned sessions", violationCount: 0 },
  { id: "r6", text: "Review trades at end of each session", violationCount: 0 },
];

interface RulesStore {
  rules: Rule[];
  incrementViolation: (id: string) => void;
  resetViolation: (id: string) => void;
}

const RulesContext = createContext<RulesStore>({
  rules: DEFAULT_RULES,
  incrementViolation: () => {},
  resetViolation: () => {},
});

const STORAGE_KEY = "traderos_rules";

export function RulesProvider({ children }: { children: React.ReactNode }) {
  const [rules, setRules] = useState<Rule[]>(DEFAULT_RULES);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRules(JSON.parse(stored));
      else localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_RULES));
    } catch {}
  }, []);

  const incrementViolation = useCallback((id: string) => {
    setRules((prev) => {
      const updated = prev.map((r) =>
        r.id === id ? { ...r, violationCount: r.violationCount + 1 } : r
      );
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const resetViolation = useCallback((id: string) => {
    setRules((prev) => {
      const updated = prev.map((r) =>
        r.id === id ? { ...r, violationCount: 0 } : r
      );
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  return (
    <RulesContext.Provider value={{ rules, incrementViolation, resetViolation }}>
      {children}
    </RulesContext.Provider>
  );
}

export function useRules() {
  return useContext(RulesContext);
}
