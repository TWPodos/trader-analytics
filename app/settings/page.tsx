"use client";

import { Header } from "@/components/layout/header";

export default function SettingsPage() {
  return (
    <div className="min-h-full">
      <Header title="Settings" />
      <div className="p-6 animate-fade-in">
        <div className="max-w-2xl space-y-4">
          {[
            { section: "Account", items: ["Profile & Username", "Email & Password", "Subscription Plan"] },
            { section: "Privacy", items: ["Default sharing mode", "Who can see my profile", "Data export"] },
            { section: "Trading", items: ["Default currency", "Timezone & sessions", "Risk settings"] },
            { section: "Notifications", items: ["Daily review reminder", "Community activity", "Weekly summary"] },
          ].map(({ section, items }) => (
            <div key={section} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-accent/30">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{section}</p>
              </div>
              <div className="divide-y divide-border">
                {items.map((item) => (
                  <div key={item} className="flex items-center justify-between px-5 py-3 hover:bg-accent/20 cursor-pointer transition-colors">
                    <p className="text-sm text-foreground">{item}</p>
                    <span className="text-xs text-muted-foreground">›</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
