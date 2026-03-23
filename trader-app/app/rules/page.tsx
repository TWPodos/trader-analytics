"use client";

import { Header } from "@/components/layout/header";
import { Plus, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRules } from "@/lib/rules-store";

export default function RulesPage() {
  const { rules, incrementViolation, resetViolation } = useRules();

  return (
    <div className="min-h-full bg-background">
      <Header title="Trading Rules" subtitle="Your personal trading rulebook" />

      <div className="p-6 max-w-2xl space-y-4">
        {/* Toolbar row */}
        <div className="flex items-center justify-between">
          <p style={{ fontSize: "11px" }} className="text-muted-foreground uppercase tracking-wider font-medium">
            {rules.length} rules
          </p>
          <button
            className={cn(
              "flex items-center gap-1.5 px-3 h-7 rounded border border-border bg-background",
              "text-foreground hover:bg-secondary transition-colors"
            )}
            style={{ fontSize: "13px" }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Rule
          </button>
        </div>

        {/* Rule cards */}
        <div className="space-y-2">
          {rules.map((rule, index) => (
            <div
              key={rule.id}
              className={cn(
                "flex items-center gap-4 px-4 py-3",
                "bg-background border border-border rounded-lg",
                "hover:bg-secondary transition-colors group"
              )}
            >
              {/* Number badge */}
              <div
                className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center bg-secondary border border-border"
                style={{ fontSize: "11px", color: "#37352f", fontWeight: 500 }}
              >
                {index + 1}
              </div>

              {/* Rule text */}
              <p className="flex-1 text-foreground" style={{ fontSize: "13px" }}>
                {rule.text}
              </p>

              {/* Violation counter */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {rule.violationCount > 0 && (
                  <button
                    onClick={() => resetViolation(rule.id)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded"
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      backgroundColor: "rgba(199,74,74,0.1)",
                      color: "#c74a4a",
                      border: "1px solid rgba(199,74,74,0.2)",
                    }}
                    title="Reset violation count"
                  >
                    <AlertTriangle style={{ width: 10, height: 10 }} />
                    {rule.violationCount}×
                  </button>
                )}
                <button
                  onClick={() => incrementViolation(rule.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center w-6 h-6 rounded border border-border bg-background hover:bg-secondary"
                  style={{ fontSize: "13px", color: "#9b9a97" }}
                  title="Mark as violated"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <p style={{ fontSize: "11px" }} className="text-muted-foreground pt-1">
          Hover a rule and click <span className="font-medium text-foreground">+</span> to record a violation.
          Click the red badge to reset the count.
        </p>
      </div>
    </div>
  );
}
