"use client";

import { Header } from "@/components/layout/header";
import {
  mockSetupPerformance, mockSessionPerformance, mockInstruments,
  mockPerformanceData,
} from "@/lib/mock-data";
import { cn, formatCurrency } from "@/lib/utils";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
  LineChart, Line, Legend,
} from "recharts";
import { TrendingUp, Target, Zap, Award } from "lucide-react";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-xl text-xs">
        <p className="text-muted-foreground mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }} className="font-semibold">
            {p.name}: {typeof p.value === "number" && p.name.includes("PnL") ? formatCurrency(p.value) : p.name.includes("Rate") ? `${p.value}%` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const radarData = [
  { subject: "Discipline", A: 82 },
  { subject: "Execution", A: 74 },
  { subject: "Risk Mgmt", A: 88 },
  { subject: "Patience", A: 65 },
  { subject: "Process", A: 79 },
  { subject: "Review", A: 91 },
];

export default function AnalyticsPage() {
  return (
    <div className="min-h-full">
      <Header title="Analytics" subtitle="Deep performance analysis" />

      <div className="p-6 space-y-6 animate-fade-in">

        <div className="bg-card border border-border rounded-xl">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Setup Performance</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Win rate & expectancy by setup type</p>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-[1fr_80px_80px_100px_100px_100px] gap-3 mb-3">
              {["Setup", "Trades", "Win Rate", "Avg Win", "Avg Loss", "Expectancy"].map((h) => (
                <span key={h} className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{h}</span>
              ))}
            </div>
            <div className="space-y-2">
              {mockSetupPerformance.map((s) => (
                <div key={s.setup} className="grid grid-cols-[1fr_80px_80px_100px_100px_100px] gap-3 items-center">
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.setup}</p>
                    <div className="mt-1 h-1.5 bg-border rounded-full overflow-hidden w-full">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${s.winRate}%` }} />
                    </div>
                  </div>
                  <span className="text-sm text-foreground font-mono">{s.trades}</span>
                  <span className={cn("text-sm font-semibold", s.winRate >= 60 ? "text-emerald-400" : "text-orange-400")}>
                    {s.winRate}%
                  </span>
                  <span className="text-sm text-emerald-400 font-mono">+{formatCurrency(s.avgWin)}</span>
                  <span className="text-sm text-red-400 font-mono">{formatCurrency(s.avgLoss)}</span>
                  <span className={cn("text-sm font-semibold", s.expectancy > 0 ? "text-emerald-400" : "text-red-400")}>
                    {formatCurrency(s.expectancy)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 bg-card border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-foreground mb-1">Session Performance</h2>
            <p className="text-xs text-muted-foreground mb-5">P&L and win rate by trading session</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={mockSessionPerformance} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 47% 14%)" />
                <XAxis dataKey="session" tick={{ fontSize: 11, fill: "hsl(215 20% 55%)" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="pnl" tick={{ fontSize: 11, fill: "hsl(215 20% 55%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <YAxis yAxisId="wr" orientation="right" tick={{ fontSize: 11, fill: "hsl(215 20% 55%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar yAxisId="pnl" dataKey="totalPnl" name="Total PnL" fill="hsl(162 73% 46%)" opacity={0.7} radius={[4, 4, 0, 0]} />
                <Bar yAxisId="wr" dataKey="winRate" name="Win Rate" fill="hsl(217 91% 60%)" opacity={0.7} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-foreground mb-1">Trader Profile</h2>
            <p className="text-xs text-muted-foreground mb-4">Self-assessment scores</p>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(222 47% 14%)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "hsl(215 20% 55%)" }} />
                <Radar name="You" dataKey="A" stroke="hsl(162 73% 46%)" fill="hsl(162 73% 46%)" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">By Instrument</h2>
            <div className="space-y-4">
              {mockInstruments.map((inst) => (
                <div key={inst.symbol}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-6 bg-accent rounded text-xs font-bold text-foreground flex items-center justify-center">
                        {inst.symbol}
                      </span>
                      <span className="text-xs text-muted-foreground">{inst.trades} trades</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-emerald-400">{formatCurrency(inst.totalPnl)}</p>
                      <p className="text-[10px] text-muted-foreground">{inst.winRate}% WR</p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-border rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${inst.winRate}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="xl:col-span-2 bg-card border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-foreground mb-1">Daily P&L Trend</h2>
            <p className="text-xs text-muted-foreground mb-5">Win/loss pattern over time</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={mockPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 47% 14%)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(215 20% 55%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(215 20% 55%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="pnl" name="Daily PnL" stroke="hsl(162 73% 46%)" strokeWidth={2} dot={{ fill: "hsl(162 73% 46%)", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Key Insights</h2>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            {[
              { icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10", title: "Best Setup", value: "VWAP Bounce", sub: "78% win rate" },
              { icon: Target, color: "text-blue-400", bg: "bg-blue-400/10", title: "Best Session", value: "NY Session", sub: "71% WR, $6,800 PnL" },
              { icon: Zap, color: "text-orange-400", bg: "bg-orange-400/10", title: "Improve This", value: "Asia Session", sub: "50% WR — skip or reduce" },
              { icon: Award, color: "text-primary", bg: "bg-primary/10", title: "Top Instrument", value: "NQ", sub: "$5,200 total PnL" },
            ].map(({ icon: Icon, color, bg, title, value, sub }) => (
              <div key={title} className="bg-accent/50 rounded-xl p-4 flex gap-3">
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", bg)}>
                  <Icon className={cn("w-4 h-4", color)} />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{title}</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{value}</p>
                  <p className="text-[11px] text-muted-foreground">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
