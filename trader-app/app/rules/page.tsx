"use client";

import { Header } from "@/components/layout/header";
import { CheckCircle2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const rules = [
  { id: 1, text: "Never risk more than 1% per trade" },
  { id: 2, text: "Only trade A+ and A setups" },
  { id: 3, text: "No revenge trading after 2 consecutive losses" },
  { id: 4, text: "Always define stop loss before entry" },
  { id: 5, text: "Trade only during planned sessions" },
  { id: 6, text: "Review trades at end of each session" },
];

export default function RulesPage() {
  return (
    <div className="min-h-full bg-background">
      <Header title="Trading Rules" subtitle="Your personal trading rulebook" />
      <div className="p-6 max-w-2xl space-y-4">
        <div className="flex items-center justify-between">
          <p style={{ fontSize: "11px" }} className="text-muted-foreground uppercase tracking-wider font-medium">{rules.length} rules</p>
          <button
            className={cn("flex items-center gap-1.5 px-3 h-7 rounded border border-border bg-background", "text-foreground hover:bg-secondary transition-colors")}
            style={{ fontSize: "13px" }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Rule
          </button>
        </div>
        <div className="space-y-2">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={cn("flex items-center gap-4 px-4 py-3", "bg-background border border-border rounded-lg", "hover:bg-secondary transition-colors")}
            >
              <div className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center bg-secondary border border-border" style={{ fontSize: "11px", color: "#37352f", fontWeight: 500 }}>
                {rule.id}
              </div>
              <p className="flex-1 text-foreground" style={{ fontSize: "13px" }}>{rule.text}</p>
              <CheckCircle2 className="flex-shrink-0 w-4 h-4" style={{ color: "#0f7b6c" }} />
            </div>
          ))}
        </div>
        <p style={{ fontSize: "11px" }} className="text-muted-foreground pt-1">
          Click <span className="font-medium text-foreground">Add Rule</span> to create a new trading rule.
        </p>
      </div>
    </div>
  );
}
