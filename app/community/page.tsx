"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { mockCommunityFeed } from "@/lib/mock-data";
import { cn, formatCurrency, getPnlBg } from "@/lib/utils";
import {
  Heart, MessageCircle, Bookmark, Share2, BadgeCheck,
  TrendingUp, TrendingDown, BarChart3, BookOpen, GraduationCap,
  Filter, Flame, Clock, Star,
} from "lucide-react";

const typeConfig: Record<string, { icon: any; color: string; label: string }> = {
  "Verified Trade Share": { icon: TrendingUp, color: "text-emerald-400", label: "Verified Trade" },
  "Educational Post": { icon: GraduationCap, color: "text-blue-400", label: "Educational" },
  "Verified Performance Snapshot": { icon: BarChart3, color: "text-primary", label: "Performance" },
  "Shared Journal": { icon: BookOpen, color: "text-orange-400", label: "Journal" },
};

function FeedCard({ post }: { post: typeof mockCommunityFeed[0] }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const type = typeConfig[post.type] || typeConfig["Educational Post"];
  const TypeIcon = type.icon;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/20 transition-colors">
      <div className="flex items-center gap-3 px-5 py-4">
        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-primary">{post.user.avatar}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-foreground">{post.user.name}</span>
            {post.user.verified && <BadgeCheck className="w-3.5 h-3.5 text-primary" />}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={cn("flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-accent", type.color)}>
              <TypeIcon className="w-2.5 h-2.5" />
              {type.label}
            </span>
            <span className="text-[10px] text-muted-foreground">{post.time}</span>
          </div>
        </div>
      </div>

      {post.pnl !== null && (post.instrument || post.direction) && (
        <div className="mx-5 mb-3 p-3 bg-accent/40 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {post.instrument && (
                <span className="text-sm font-bold text-foreground font-mono">{post.instrument}</span>
              )}
              {post.direction && (
                <span className={cn(
                  "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded",
                  post.direction === "LONG" ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400"
                )}>
                  {post.direction === "LONG" ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                  {post.direction}
                </span>
              )}
              {post.setup && (
                <span className="text-xs text-muted-foreground">{post.setup}</span>
              )}
            </div>
            {post.pnl !== null && (
              <span className={cn("text-sm font-bold px-2 py-1 rounded-lg", getPnlBg(post.pnl))}>
                {post.pnl >= 0 ? "+" : ""}{formatCurrency(post.pnl)}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="px-5 pb-4">
        <p className="text-sm text-foreground leading-relaxed">{post.content}</p>
        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
          {post.tags.map((tag) => (
            <span key={tag} className="text-[10px] text-primary/70 bg-primary/5 px-2 py-0.5 rounded-full cursor-pointer hover:bg-primary/10 transition-colors">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 px-5 py-3 border-t border-border">
        <button
          onClick={() => setLiked(!liked)}
          className={cn("flex items-center gap-1.5 text-xs transition-colors", liked ? "text-red-400" : "text-muted-foreground hover:text-red-400")}
        >
          <Heart className={cn("w-4 h-4", liked && "fill-red-400")} />
          {post.likes + (liked ? 1 : 0)}
        </button>
        <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <MessageCircle className="w-4 h-4" />
          {post.comments}
        </button>
        <button
          onClick={() => setSaved(!saved)}
          className={cn("flex items-center gap-1.5 text-xs transition-colors", saved ? "text-primary" : "text-muted-foreground hover:text-primary")}
        >
          <Bookmark className={cn("w-4 h-4", saved && "fill-primary")} />
          Save
        </button>
        <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto">
          <Share2 className="w-3.5 h-3.5" />
          Share
        </button>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  const [feedFilter, setFeedFilter] = useState<"latest" | "top" | "following">("latest");

  return (
    <div className="min-h-full">
      <Header title="Community" subtitle="Learn from other traders" />
      <div className="p-6 animate-fade-in">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1">
                {[
                  { key: "latest", icon: Clock, label: "Latest" },
                  { key: "top", icon: Flame, label: "Top" },
                  { key: "following", icon: Star, label: "Following" },
                ].map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => setFeedFilter(key as any)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                      feedFilter === key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="w-3 h-3" />
                    {label}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Filter className="w-3.5 h-3.5" />
                Filter
              </button>
            </div>

            <div className="bg-card border border-primary/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">ME</span>
                </div>
                <button className="flex-1 text-left px-4 py-2.5 bg-accent rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Share a trade, journal, or insight...
                </button>
              </div>
            </div>

            {mockCommunityFeed.map((post) => (
              <FeedCard key={post.id} post={post} />
            ))}
          </div>

          <div className="space-y-4">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 text-primary" />
                </div>
                <p className="text-xs font-semibold text-primary">Default: Private</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All your data stays private by default. Share only what you choose, when you choose.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-xs font-semibold text-foreground mb-3">Trending Topics</h3>
              <div className="flex flex-wrap gap-1.5">
                {["#nq", "#breakout", "#discipline", "#risk-management", "#psychology", "#vwap", "#execution", "#review"].map((tag) => (
                  <span key={tag} className="text-[11px] bg-accent text-muted-foreground px-2 py-1 rounded-full cursor-pointer hover:text-foreground hover:bg-accent/80 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-xs font-semibold text-foreground mb-3">Featured Traders</h3>
              <div className="space-y-3">
                {[
                  { name: "alex_trades", avatar: "AT", desc: "NQ specialist · 78% WR", verified: true },
                  { name: "sarah_scalper", avatar: "SS", desc: "ES & scalping · verified data", verified: true },
                  { name: "futures_pro", avatar: "FP", desc: "Educator · 12k followers", verified: false },
                ].map(({ name, avatar, desc, verified }) => (
                  <div key={name} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-foreground">{avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="text-xs font-medium text-foreground">{name}</p>
                        {verified && <BadgeCheck className="w-3 h-3 text-primary" />}
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate">{desc}</p>
                    </div>
                    <button className="text-[10px] px-2 py-1 bg-primary/10 text-primary rounded font-medium hover:bg-primary/20 transition-colors">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-xs font-semibold text-foreground mb-2">Community Standards</h3>
              <ul className="space-y-1.5">
                {[
                  "No guaranteed profit claims",
                  "No signal spam or pump schemes",
                  "Focus on process, not just results",
                  "Verified data is clearly labelled",
                ].map((rule) => (
                  <li key={rule} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
