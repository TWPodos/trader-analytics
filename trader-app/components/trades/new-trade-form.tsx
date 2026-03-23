"use client";

import { useState } from "react";
import {
  X, TrendingUp, TrendingDown, Link as LinkIcon,
  ChevronDown, CheckCircle2,
} from "lucide-react";
import { cn, calcRMultiple, calcPnlPercent, formatR, formatCurrency } from "@/lib/utils";
import { DEFAULT_ENTRY_MODELS } from "@/lib/types";
import type {
  Trade, Direction, Session, EntryRelativity,
  EntryTimeframe, MarketBias, TradeOutcome, EntryModel,
} from "@/lib/types";
import { mockUserSettings } from "@/lib/mock-data";

interface NewTradeFormProps {
  onClose: () => void;
  onSave: (trade: Omit<Trade, "id">) => void;
  initialValues?: Trade; // if provided = edit mode
}

const SESSIONS: Session[] = [
  "New York AM", "New York Lunch", "New York PM",
  "Asia", "London", "None",
];
const TIMEFRAMES: EntryTimeframe[] = ["1s", "1m", "5m", "15m", "1h", "4h", "1D"];
const OUTCOMES: TradeOutcome[] = ["Win", "Loss", "BE", "Open", "Planned"];

export function NewTradeForm({ onClose, onSave, initialValues }: NewTradeFormProps) {
  const isEditMode = !!initialValues;

  const allModels: EntryModel[] = [
    ...DEFAULT_ENTRY_MODELS,
    ...mockUserSettings.customEntryModels,
  ];

  const [form, setForm] = useState({
    date: initialValues?.date ?? new Date().toISOString().split("T")[0],
    account: initialValues?.account ?? mockUserSettings.defaultAccount,
    market: initialValues?.market ?? mockUserSettings.defaultMarket,
    direction: (initialValues?.direction ?? "Long") as Direction,
    session: (initialValues?.session ?? "New York AM") as Session,
    sessionTime: initialValues?.sessionTime ?? "",
    entryModel: (initialValues?.entryModel ?? "IFVG") as EntryModel,
    entryRelativity: (initialValues?.entryRelativity ?? "A") as EntryRelativity,
    entryTimeframe: (initialValues?.entryTimeframe ?? "5m") as EntryTimeframe,
    marketBias: (initialValues?.marketBias ?? "Bullish") as MarketBias,
    outcome: (initialValues?.outcome ?? "Win") as TradeOutcome,
    risk: initialValues?.risk !== undefined ? String(initialValues.risk) : "",
    pnl: initialValues?.pnl !== undefined ? String(initialValues.pnl) : "",
    setup: initialValues?.setup ?? "",
    chartUrl: initialValues?.chartUrl ?? "",
    notes: initialValues?.notes ?? "",
    learning: initialValues?.learning ?? "",
    customLabel: initialValues?.customLabel ?? "",
    entryPrice: initialValues?.entryPrice !== undefined ? String(initialValues.entryPrice) : "",
    exitPrice: initialValues?.exitPrice !== undefined ? String(initialValues.exitPrice) : "",
  });

  const rMultiple = form.risk && form.pnl ? calcRMultiple(Number(form.pnl), Number(form.risk)) : null;
  const pnlPercent = form.risk && form.pnl ? calcPnlPercent(Number(form.pnl), Number(form.risk)) : null;
  const showPnl = form.outcome !== "Planned" && form.outcome !== "Open";

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.risk) return;
    const trade: Omit<Trade, "id"> = {
      date: form.date,
      account: form.account,
      market: form.market.toUpperCase(),
      direction: form.direction,
      session: form.session,
      sessionTime: form.sessionTime || undefined,
      entryModel: form.entryModel,
      entryRelativity: form.entryRelativity,
      entryTimeframe: form.entryTimeframe,
      marketBias: form.marketBias,
      outcome: form.outcome,
      risk: Number(form.risk),
      pnl: showPnl && form.pnl ? Number(form.pnl) : undefined,
      rMultiple: rMultiple ?? undefined,
      pnlPercent: pnlPercent ?? undefined,
      setup: form.setup || undefined,
      chartUrl: form.chartUrl || undefined,
      notes: form.notes || undefined,
      learning: form.learning || undefined,
      customLabel: form.customLabel || undefined,
      entryPrice: form.entryPrice ? Number(form.entryPrice) : undefined,
      exitPrice: form.exitPrice ? Number(form.exitPrice) : undefined,
    };
    onSave(trade);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative bg-background border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border sticky top-0 bg-background z-10">
          <h2 className="text-[15px] font-semibold text-foreground">
            {isEditMode ? "Edit Trade" : "Log Trade"}
          </h2>
          <button type="button" onClick={onClose} className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Field label="Date" required>
              <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className={inputCls} required />
            </Field>
            <Field label="Account">
              <SelectInput value={form.account} onChange={(v) => set("account", v)} options={mockUserSettings.accounts} />
            </Field>
            <Field label="Market" required>
              <input value={form.market} onChange={(e) => set("market", e.target.value.toUpperCase())} placeholder="NQ" className={inputCls} required />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Direction">
              <div className="flex gap-2">
                {(["Long", "Short"] as Direction[]).map((d) => (
                  <button key={d} type="button" onClick={() => set("direction", d)}
                    className={cn("flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded text-[13px] font-medium border transition-all",
                      form.direction === d ? d === "Long" ? "bg-[#ddedea] border-[#0f7b6c]/30 text-[#0f7b6c]" : "bg-[#ffe0de] border-[#c74a4a]/30 text-[#c74a4a]"
                      : "bg-secondary border-border text-muted-foreground hover:text-foreground hover:bg-accent")}>
                    {d === "Long" ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {d}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Market Bias">
              <div className="flex gap-2">
                {(["Bullish", "Bearish"] as MarketBias[]).map((b) => (
                  <button key={b} type="button" onClick={() => set("marketBias", b)}
                    className={cn("flex-1 py-1.5 rounded text-[13px] font-medium border transition-all",
                      form.marketBias === b ? b === "Bullish" ? "bg-[#ddedea] border-[#0f7b6c]/30 text-[#0f7b6c]" : "bg-[#ffe0de] border-[#c74a4a]/30 text-[#c74a4a]"
                      : "bg-secondary border-border text-muted-foreground hover:text-foreground hover:bg-accent")}>
                    {b}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Session">
              <SelectInput value={form.session} onChange={(v) => set("session", v as Session)} options={SESSIONS} />
            </Field>
            <Field label="Session Time">
              <input value={form.sessionTime} onChange={(e) => set("sessionTime", e.target.value)} placeholder="09:35" className={inputCls} />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Entry Model" required>
              <SelectInput value={form.entryModel} onChange={(v) => set("entryModel", v as EntryModel)} options={allModels} />
            </Field>
            <Field label="Entry Quality">
              <div className="flex gap-1.5">
                {(["A+", "A", "B"] as EntryRelativity[]).map((r) => (
                  <button key={r} type="button" onClick={() => set("entryRelativity", r)}
                    className={cn("flex-1 py-1.5 rounded text-[13px] font-semibold border transition-all",
                      form.entryRelativity === r
                        ? r === "A+" ? "bg-[#ddedea] border-[#0f7b6c]/30 text-[#0f7b6c]"
                          : r === "A" ? "bg-[#dbeafe] border-primary/30 text-primary"
                          : "bg-[#fef3c7] border-[#ba8e23]/30 text-[#ba8e23]"
                        : "bg-secondary border-border text-muted-foreground hover:text-foreground hover:bg-accent")}>
                    {r}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Entry Timeframe">
              <SelectInput value={form.entryTimeframe} onChange={(v) => set("entryTimeframe", v as EntryTimeframe)} options={TIMEFRAMES} />
            </Field>
          </div>

          <Field label="Outcome">
            <div className="flex gap-1.5 flex-wrap">
              {OUTCOMES.map((o) => (
                <button key={o} type="button" onClick={() => set("outcome", o)}
                  className={cn("px-3 py-1.5 rounded text-[13px] font-medium border transition-all",
                    form.outcome === o
                      ? o === "Win" ? "bg-[#ddedea] border-[#0f7b6c]/30 text-[#0f7b6c]"
                        : o === "Loss" ? "bg-[#ffe0de] border-[#c74a4a]/30 text-[#c74a4a]"
                        : o === "BE" ? "bg-[#e3e2e0] border-[#787774]/30 text-[#787774]"
                        : o === "Open" ? "bg-[#dbeafe] border-primary/30 text-primary"
                        : "bg-[#ede9fe] border-purple-400/30 text-purple-600"
                      : "bg-secondary border-border text-muted-foreground hover:text-foreground hover:bg-accent")}>
                  {o}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Risk ($)" required>
              <input type="number" value={form.risk} onChange={(e) => set("risk", e.target.value)} placeholder="200" className={inputCls} min="0" required />
            </Field>
            {showPnl && (
              <Field label="P&L ($)">
                <input type="number" value={form.pnl} onChange={(e) => set("pnl", e.target.value)} placeholder="1200" className={inputCls} />
              </Field>
            )}
            {rMultiple !== null && (
              <Field label="R (auto)">
                <div className={cn("h-8 px-3 rounded border flex items-center text-[13px] font-bold",
                  rMultiple > 0 ? "bg-[#ddedea] border-[#0f7b6c]/30 text-[#0f7b6c]" : rMultiple < 0 ? "bg-[#ffe0de] border-[#c74a4a]/30 text-[#c74a4a]" : "bg-[#e3e2e0] border-[#787774]/30 text-[#787774]")}>
                  {formatR(rMultiple)}
                  {pnlPercent !== null && <span className="ml-2 text-xs opacity-70">({pnlPercent > 0 ? "+" : ""}{pnlPercent.toFixed(0)}%)</span>}
                </div>
              </Field>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Entry Price (optional)">
              <input type="number" value={form.entryPrice} onChange={(e) => set("entryPrice", e.target.value)} placeholder="18420" className={inputCls} />
            </Field>
            <Field label="Exit Price (optional)">
              <input type="number" value={form.exitPrice} onChange={(e) => set("exitPrice", e.target.value)} placeholder="18485" className={inputCls} />
            </Field>
          </div>

          <Field label="TradingView Chart URL">
            <div className="flex items-center gap-2 bg-secondary border border-border rounded px-3 h-8">
              <LinkIcon className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              <input value={form.chartUrl} onChange={(e) => set("chartUrl", e.target.value)} placeholder="https://www.tradingview.com/x/..." className="bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground outline-none flex-1" />
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Setup (optional)">
              <input value={form.setup} onChange={(e) => set("setup", e.target.value)} placeholder="liq, VWAP reclaim..." className={inputCls} />
            </Field>
            <Field label="Custom Label (optional)">
              <input value={form.customLabel} onChange={(e) => set("customLabel", e.target.value)} placeholder="e.g. Best trade of the week" className={inputCls} />
            </Field>
          </div>

          <Field label="Notes">
            <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Trade notes, market context..." className={cn(inputCls, "resize-none h-16 py-2")} />
          </Field>

          <Field label="Learning">
            <textarea value={form.learning} onChange={(e) => set("learning", e.target.value)} placeholder="Key lesson from this trade..." className={cn(inputCls, "resize-none h-14 py-2")} />
          </Field>
        </div>

        <div className="sticky bottom-0 flex items-center justify-end gap-2 px-5 py-3 border-t border-border bg-background">
          <button type="button" onClick={onClose} className="px-3 py-1.5 rounded text-[13px] text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">Cancel</button>
          <button type="submit" className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-white rounded text-[13px] font-medium hover:bg-primary/90 transition-colors">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isEditMode ? "Save Changes" : "Save Trade"}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputCls = "w-full h-8 bg-secondary border border-border rounded px-3 text-[13px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:bg-background transition-colors";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-medium text-muted-foreground">
        {label}{required && <span className="text-primary ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function SelectInput({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: readonly string[] | string[] }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)} className={cn(inputCls, "appearance-none pr-7 cursor-pointer")}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
    </div>
  );
}
