"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface JournalStore {
  notes: Record<string, string>; // date (ISO) → not metni
  setNote: (date: string, text: string) => void;
}

const JournalContext = createContext<JournalStore>({
  notes: {},
  setNote: () => {},
});

const STORAGE_KEY = "traderos_journal_notes";

export function JournalProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setNotes(JSON.parse(stored));
    } catch {}
  }, []);

  const setNote = useCallback((date: string, text: string) => {
    setNotes((prev) => {
      const updated = { ...prev, [date]: text };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  return (
    <JournalContext.Provider value={{ notes, setNote }}>
      {children}
    </JournalContext.Provider>
  );
}

export function useJournal() {
  return useContext(JournalContext);
}
