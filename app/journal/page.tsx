"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { mockJournals } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  Smile, Meh, Frown, CheckCircle2, ChevronDown, ChevronUp,
  Lock, Globe, Plus, BookOpen, Lightbulb, AlertTriangle, Target,
} from "lucide-react";

const moodConfig = {
  focused: { icon: Smile, color: "text-emerald-400", bg: "bg-emerald-400/10", label: "Focused" },
  frustrated: { icon: Frown, color: "text-red-400", bg: "bg-red-400/10", label: "Frustrated" },
  neutral: { icon: Meh, color: "text-slate-400", bg: "bg-slate-400/10", label: "Neutral" },
};

function JournalCard({ journal }: { journal: typeof mockJournals[0] }) {
  const [expanded, setExpanded] = useState(false);
  const mood = moodConfig[journal.mood as keyof typeof moodConfig] || moodConfig.neutral;
  const MoodIcon = mood.icon;
  const adherence = Math.round((journal.rulesFollowed / journal.rulesTotal) * 100);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors">
      <div
        className="flex items-center gap-4 px-5 py-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", mood.bg)}>
          <MoodIcon className={cn("w-5 h-5", mood.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">{journal.date}</p>
            <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", mood.bg, mood.color)}>
              {mood.label}
            </span>
            {journal.isPublic
              ? <Globe className="w-3 h-3 text-muted-foreground" />
              : <Lock className="w-3 h-3 text-muted-foreground" />
            }
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{journal.preMarket}</p>
        </div>
        <div className="text-center mr-2">
          <p className={cn("text-lg font-bold", adherence >= 80 ? "text-emerald-400" : adherence >= 50 ? "text-orange-400" : "text-red-400")}>
            {adherence}%
          </p>
          <p className="text-[10px] text-muted-foreground">Rules</p>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </div>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-accent/40 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Target className="w-3.5 h-3.5 text-blue-400" />
                <p className="text-xs font-semibold text-blue-400">Pre-Market Plan</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{journal.preMarket}</p>
            </div>
            <div className="bg-accent/40 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <p className="text-xs font-semibold text-emerald-400">Post-Market Review</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{journal.postMarket}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-red-400/5 border border-red-400/20 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <p className="text-xs font-semibold text-red-400">Mistakes</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{journal.mistakes}</p>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Lightbulb className="w-3.5 h-3.5 text-primary" />
                <p className="text-xs font-semibold text-primary">Lessons</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{journal.lessons}</p>
            </div>
            <div className="bg-orange-400/5 border border-orange-400/20 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Target className="w-3.5 h-3.5 text-orange-400" />
                <p className="text-xs font-semibold text-orange-400">Tomorrow's Focus</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{journal.nextDayFocus}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-accent/40 rounded-lg px-4 py-2.5">
            <CheckCircle2 className={cn("w-4 h-4", adherence >= 80 ? "text-emerald-400" : "text-orange-400")} />
            <span className="text-xs text-foreground">
              Followed <span className={cn("font-bold", adherence >= 80 ? "text-emerald-400" : "text-orange-400")}>
                {journal.rulesFollowed}/{journal.rulesTotal}
              </span> rules today
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function JournalPage() {
  const [showNew, setShowNew] = useState(false);

  return (
    <div className="min-h-full">
      <Header title="Journal" subtitle={`${mockJournals.length} entries`} />
      <div className="p-6 space-y-5 animate-fade-in">
        <div className="bg-card border border-primary/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Today's Entry</h2>
              <p className="text-xs text-muted-foreground">March 19, 2024</p>
            </div>
            <button
              onClick={() => setShowNew(!showNew)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Write Entry
            </button>
          </div>
          {showNew && (
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">How are you feeling?</p>
                <div className="flex gap-2">
                  {Object.entries(moodConfig).map(([key, { icon: Icon, color, bg, label }]) => (
                    <button key={key} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors", bg, color)}>
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Pre-market plan</p>
                <textarea
                  placeholder="What's your plan for today? Key levels, setups to watch, risk limits..."
                  className="w-full bg-accent border border-border rounded-lg px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 resize-none"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowNew(false)} className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Cancel
                </button>
                <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors">
                  Save Entry
                </button>
              </div>
            </div>
          )}
          {!showNew && (
            <div className="text-center py-4 text-xs text-muted-foreground">
              No entry yet for today. Click "Write Entry" to start your journal.
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Current Streak", value: "5 days", sub: "Keep it up!" },
            { label: "This Month", value: `${mockJournals.length}/${18} days`, sub: "Journaling rate" },
            { label: "Avg Rule Adherence", value: "76%", sub: "From journals" },
          ].map(({ label, value, sub }) => (
            <div key={label} className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-xl font-bold text-foreground mt-1">{value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Past Entries</h2>
          {mockJournals.map((j) => (
            <JournalCard key={j.id} journal={j} />
          ))}
        </div>
      </div>
    </div>
  );
}
