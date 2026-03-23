"use client";

import { Header } from "@/components/layout/header";
import { StatCard } from "@/components/ui/stat-card";
import {
  DollarSign, TrendingUp, Target, Activity, Shield,
  ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, XCircle,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell,
} from "recharts";
import { mockPerformanceData, mockTrades, mockStats } from "@/lib/mock-data";
import { cn, formatCurrency, getPnlColor } from "@/lib/utils";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className={cn("text-sm font-semibold", payload[0].value >= 0 ? "text-emerald-400" : "text-red-400")}>
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const recentTrades = mockTrades.slice(0, 5);
  const stats = mockStats;

  return (
    <div className="min-h-full">
      <Header
        title="Dashboard"
        subtitle="March 2024 · 18 trading days"
      />

      <div className="p-6 space-y-6 animate-fade-in">

        {/* Stats Grid */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Total P&L"
            value={formatCurrency(stats.totalPnl)}
            change="+23.4% this month"
            changePositive={true}
            icon={DollarSign}
            iconColor="text-emerald-400"
          />
          <StatCard
            title="Win Rate"
            value={`${stats.winRate}%`}
            change="+2.1% vs last month"
            changePositive={true}
            icon={Target}
            iconColor="text-primary"
          />
          <StatCard
            title="Profit Factor"
            value={stats.profitFactor.toFixed(2)}
            change="vs 1.98 last month"
            changePositive={true}
            icon={TrendingUp}
            iconColor="text-blue-400"
          />
          <StatCard
            title="Rule Adherence"
            value={`${stats.ruleAdherence}%`}
            change="-3% vs last month"
            changePositive={false}
            icon={Shield}
            iconColor="text-orange-400"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* Cumulative PnL Chart */}
          <div className="xl:col-span-2 bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Cumulative P&L</h2>
                <p className="text-xs text-muted-foreground">March 2024</p>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-sm font-semibold">
                <ArrowUpRight className="w-4 h-4" />
                {formatCurrency(stats.totalPnl)}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={mockPerformanceData}>
                <defs>
                  <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(162 73% 46%)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(162 73% 46%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 47% 14%)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(215 20% 55%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(215 20% 55%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="cumPnl"
                  stroke="hsl(162 73% 46%)"
                  strokeWidth={2}
                  fill="url(#pnlGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Daily PnL Bar Chart */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="mb-5">
              <h2 className="text-sm font-semibold text-foreground">Daily P&L</h2>
              <p className="text-xs text-muted-foreground">Each trading day</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={mockPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 47% 14%)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(215 20% 55%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(215 20% 55%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                  {mockPerformanceData.map((entry, index) => (
                    <Cell key={index} fill={entry.pnl >= 0 ? "hsl(162 73% 46%)" : "hsl(0 72% 51%)"} opacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* Recent Trades */}
          <div className="xl:col-span-2 bg-card border border-border rounded-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Recent Trades</h2>
              <a href="/trades" className="text-xs text-primary hover:underline">View all</a>
            </div>
            <div className="divide-y divide-border">
              {recentTrades.map((trade) => (
                <div key={trade.id} className="flex items-center gap-4 px-5 py-3 hover:bg-accent/30 transition-colors">
                  <div className={cn(
                    "w-14 text-center text-[10px] font-bold py-1 rounded",
                    trade.direction === "LONG" ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400"
                  )}>
                    {trade.direction}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{trade.instrument}</p>
                    <p className="text-xs text-muted-foreground truncate">{trade.setup} · {trade.session}</p>
                  </div>
                  <div>
                    {trade.ruleFollowed
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      : <XCircle className="w-4 h-4 text-red-400" />
                    }
                  </div>
                  <div className="text-right">
                    <p className={cn("text-sm font-bold", getPnlColor(trade.pnl))}>
                      {trade.pnl >= 0 ? "+" : ""}{formatCurrency(trade.pnl)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{trade.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-card border border-border rounded-xl">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Performance Summary</h2>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: "Total Trades", value: stats.totalTrades.toString(), icon: Activity },
                { label: "Avg Win", value: formatCurrency(stats.avgWin), positive: true },
                { label: "Avg Loss", value: formatCurrency(stats.avgLoss), positive: false },
                { label: "Expectancy", value: formatCurrency(stats.expectancy), positive: true },
                { label: "Max Drawdown", value: formatCurrency(stats.maxDrawdown), positive: false },
                { label: "Best Streak", value: `${stats.consecutiveWins} wins`, positive: true },
              ].map(({ label, value, positive }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className={cn(
                    "text-sm font-semibold",
                    positive === undefined ? "text-foreground" : positive ? "text-emerald-400" : "text-red-400"
                  )}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <div className="mx-5 mb-5 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="w-3 h-3 text-primary" />
                <p className="text-[11px] font-semibold text-primary">Today's Focus</p>
              </div>
              <p className="text-xs text-muted-foreground">Watch for NQ follow-through. Reduce size before CPI. No trades in first 15 min.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
