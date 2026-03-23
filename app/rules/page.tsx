"use client";

import { Header } from "@/components/layout/header";
import { Shield, Plus, CheckCircle2, Clock, DollarSign, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const rules = [
  { id: "1", title: "Max Daily Loss", desc: "Stop trading if daily loss exceeds $500", category: "risk", active: true, breached: 2 },
  { id: "2", title: "No Trade First 15 Min", desc: "Never enter in the first 15 minutes of NY open", category: "timing", active: true, breached: 1 },
  { id: "3", title: "Max 3 Trades Per Day", desc: "Do not take more than 3 setups in a single day", category: "discipline", active: true, breached: 3 },
  { id: "4", title: "Only A+ Setups", desc: "Only trade setups that meet all criteria — no B setups", category: "setup", active: true, breached: 4 },
  { id: "5", title: "Risk Max 1% Per Trade", desc: "Position size must keep max loss under 1% of account", category: "risk", active: true, breached: 0 },
];

const categoryConfig: Record<string, { color: string; icon: any }> = {
  risk: { color: "text-red-400 bg-red-400/10", icon: DollarSign },
  timing: { color: "text-blue-400 bg-blue-400/10", icon: Clock },
  discipline: { color: "text-orange-400 bg-orange-400/10", icon: Shield },
  setup: { color: "text-primary bg-primary/10", icon: TrendingUp },
};

export default function RulesPage() {
  return (
    <div className="min-h-full">
      <Header title="My Rules" subtitle="Trading rules & discipline tracking" />
      <div className="p-6 space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{rules.length} rules defined</p>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors">
            <Plus className="w-3.5 h-3.5" />
            Add Rule
          </button>
        </div>
        <div className="space-y-2">
          {rules.map((rule) => {
            const cat = categoryConfig[rule.category];
            const CatIcon = cat.icon;
            return (
              <div key={rule.id} className="bg-card border border-border rounded-xl px-5 py-4 flex items-center gap-4">
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", cat.color)}>
                  <CatIcon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{rule.title}</p>
                  <p className="text-xs text-muted-foreground">{rule.desc}</p>
                </div>
                <div className="text-right">
                  <p className={cn("text-sm font-bold", rule.breached === 0 ? "text-emerald-400" : "text-red-400")}>
                    {rule.breached}x broken
                  </p>
                  <p className="text-[10px] text-muted-foreground">this month</p>
                </div>
                <CheckCircle2 className={cn("w-5 h-5", rule.active ? "text-emerald-400" : "text-muted-foreground")} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
