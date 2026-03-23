import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changePositive?: boolean;
  icon: LucideIcon;
  iconColor?: string;
  subtitle?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  changePositive,
  icon: Icon,
  iconColor = "text-primary",
  subtitle,
  className,
}: StatCardProps) {
  return (
    <div className={cn("bg-card border border-border rounded-xl p-5 flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{title}</span>
        <div className={cn("w-8 h-8 rounded-lg bg-accent flex items-center justify-center", iconColor + "/10")}>
          <Icon className={cn("w-4 h-4", iconColor)} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {change && (
        <div className={cn(
          "text-xs font-medium px-2 py-0.5 rounded-full w-fit",
          changePositive ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400"
        )}>
          {change}
        </div>
      )}
    </div>
  );
}
