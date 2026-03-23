"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { CHECKLIST_ITEMS } from "@/lib/types";
import type { DailyChecklist } from "@/lib/types";
import { cn, todayISO, formatDateLong } from "@/lib/utils";
import { Check, Circle, RotateCcw } from "lucide-react";

const TRADE_ITEMS = CHECKLIST_ITEMS.filter((item) => item.key !== "completed");

type ChecklistState = Record<
  Exclude<keyof Omit<DailyChecklist, "id" | "date" | "notes" | "completed">, never>,
  boolean
>;

const EMPTY_STATE: ChecklistState = {
  marketConditionIdentified: false,
  entryModelConfirmed: false,
  stopLossDefined: false,
  takeProfitDefined: false,
  positionSizeCalculated: false,
  newsRiskChecked: false,
  screenshotCaptured: false,
};

export default function ChecklistPage() {
  const today = todayISO();
  const [checks, setChecks] = useState<ChecklistState>({ ...EMPTY_STATE });

  const checkedCount = Object.values(checks).filter(Boolean).length;
  const total = TRADE_ITEMS.length;
  const completionPct = Math.round((checkedCount / total) * 100);
  const allDone = checkedCount === total;

  function toggleItem(key: keyof ChecklistState) {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function resetAll() {
    setChecks({ ...EMPTY_STATE });
  }

  return (
    <div className="min-h-full bg-background">
      <Header title="Checklist" subtitle="Pre-trade preparation checklist" />
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold" style={{ fontSize: 18, color: "#37352f" }}>Today</p>
            <p className="mt-0.5" style={{ fontSize: 13, color: "#9b9a97" }}>{formatDateLong(today)}</p>
          </div>
          {allDone ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded" style={{ backgroundColor: "#ddedea", border: "1px solid #0f7b6c33" }}>
              <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#0f7b6c" }} />
              <span className="font-semibold" style={{ fontSize: 13, color: "#0f7b6c" }}>Ready to trade</span>
            </div>
          ) : (
            <span style={{ fontSize: 13, color: "#9b9a97" }}>{checkedCount}/{total} completed</span>
          )}
        </div>

        <div className="rounded-full overflow-hidden" style={{ height: 4, backgroundColor: "#e9e9e7" }}>
          <div className="h-full rounded-full transition-all duration-400" style={{ width: `${completionPct}%`, backgroundColor: allDone ? "#0f7b6c" : "#2383e2" }} />
        </div>

        <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #e9e9e7" }}>
          {TRADE_ITEMS.map(({ key, label, description }, index) => {
            const checked = !!checks[key as keyof ChecklistState];
            const isLast = index === TRADE_ITEMS.length - 1;
            return (
              <button
                key={key}
                onClick={() => toggleItem(key as keyof ChecklistState)}
                className={cn("w-full flex items-start gap-3 px-4 py-3 text-left transition-colors group", !isLast && "border-b")}
                style={{ borderColor: "#e9e9e7", backgroundColor: checked ? "#f7faf9" : "#ffffff" }}
                onMouseEnter={(e) => { if (!checked) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#f7f7f5"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = checked ? "#f7faf9" : "#ffffff"; }}
              >
                <span className="mt-0.5 flex-shrink-0">
                  {checked ? (
                    <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#0f7b6c" }}>
                      <Check className="w-3 h-3" style={{ color: "#ffffff" }} />
                    </span>
                  ) : (
                    <Circle className="w-5 h-5 flex-shrink-0" style={{ color: "#c4c4c0" }} />
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={cn("font-medium", checked && "line-through")} style={{ fontSize: 14, color: checked ? "#9b9a97" : "#37352f", textDecorationColor: "#9b9a97" }}>
                    {label}
                  </p>
                  <p className="mt-0.5" style={{ fontSize: 11, color: "#9b9a97" }}>{description}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-1">
          <p style={{ fontSize: 13, color: "#9b9a97" }}>
            {allDone ? (
              <span style={{ color: "#0f7b6c", fontWeight: 500 }}>All {total} items complete — you're ready.</span>
            ) : (
              <><span style={{ color: "#37352f", fontWeight: 500 }}>{checkedCount}</span>{" of "}<span style={{ color: "#37352f", fontWeight: 500 }}>{total}</span>{" items checked"}</>
            )}
          </p>
          <button
            onClick={resetAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors"
            style={{ fontSize: 13, color: "#9b9a97", border: "1px solid #e9e9e7", backgroundColor: "#ffffff" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#f7f7f5"; (e.currentTarget as HTMLButtonElement).style.color = "#37352f"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ffffff"; (e.currentTarget as HTMLButtonElement).style.color = "#9b9a97"; }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
