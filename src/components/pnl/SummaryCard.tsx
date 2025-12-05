import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "profit" | "loss" | "neutral";
  delay?: number;
}

export function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  variant = "neutral",
  delay = 0
}: SummaryCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] animate-in-up",
        variant === "profit" && "bg-profit glow-profit",
        variant === "loss" && "bg-loss glow-loss",
        variant === "neutral" && "glass-card"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={cn(
            "font-mono-numbers text-3xl font-bold tracking-tight animate-number",
            variant === "profit" && "text-profit",
            variant === "loss" && "text-loss",
            variant === "neutral" && "text-foreground"
          )}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && trendValue && (
            <div className={cn(
              "inline-flex items-center gap-1 text-xs font-medium",
              trend === "up" && "text-profit",
              trend === "down" && "text-loss",
              trend === "neutral" && "text-muted-foreground"
            )}>
              <span>{trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}</span>
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={cn(
          "rounded-lg p-3",
          variant === "profit" && "bg-profit/20",
          variant === "loss" && "bg-loss/20",
          variant === "neutral" && "bg-muted"
        )}>
          <Icon className={cn(
            "h-5 w-5",
            variant === "profit" && "text-profit",
            variant === "loss" && "text-loss",
            variant === "neutral" && "text-muted-foreground"
          )} />
        </div>
      </div>
      
      {/* Decorative gradient */}
      <div className={cn(
        "absolute -bottom-8 -right-8 h-24 w-24 rounded-full opacity-20 blur-2xl",
        variant === "profit" && "bg-profit",
        variant === "loss" && "bg-loss",
        variant === "neutral" && "bg-neutral"
      )} />
    </div>
  );
}
