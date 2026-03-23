"use client";

import { Bell, Search, Plus, TrendingUp } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h1 className="text-sm font-semibold text-foreground">{title}</h1>
        {subtitle && <p className="text-[11px] text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 h-8 px-3 rounded-lg bg-accent text-muted-foreground hover:text-foreground text-xs transition-colors">
          <Search className="w-3.5 h-3.5" />
          <span>Search</span>
          <kbd className="text-[9px] bg-background border border-border rounded px-1 py-0.5">⌘K</kbd>
        </button>
        <button className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full" />
        </button>
        <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-3.5 h-3.5" />
          New Trade
        </button>
      </div>
    </header>
  );
}
