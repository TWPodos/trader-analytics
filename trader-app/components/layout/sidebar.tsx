"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  TrendingUp,
  BookOpen,
  BarChart3,
  Users,
  Settings,
  Activity,
  Shield,
  CheckSquare,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/trades", label: "Trade Log", icon: TrendingUp },
  { href: "/checklist", label: "Checklist", icon: CheckSquare },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/community", label: "Community", icon: Users },
];

const bottomItems = [
  { href: "/rules", label: "My Rules", icon: Shield },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-[220px] flex flex-col border-r border-border bg-secondary z-40">
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-border">
        <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
          <Activity className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-sm font-semibold text-foreground tracking-tight">TraderOS</span>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-2 mb-1.5">
          Workspace
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-2 py-1.5 rounded text-sm transition-colors duration-100 group",
                active
                  ? "bg-accent text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/70"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 flex-shrink-0",
                  active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              <span className="flex-1 text-[13px]">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-2 py-3 border-t border-border space-y-0.5">
        {bottomItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-2 py-1.5 rounded text-[13px] transition-colors duration-100",
                active
                  ? "bg-accent text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/70"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}

        <div className="flex items-center gap-2.5 px-2 py-2 mt-1">
          <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
            <span className="text-[9px] font-bold text-primary">ME</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-foreground truncate">Mehmet Emir</p>
            <p className="text-[10px] text-muted-foreground">Pro</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
