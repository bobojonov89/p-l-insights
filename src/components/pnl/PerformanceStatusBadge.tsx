import { Badge } from "@/components/ui/badge";
import { PerformanceStatus } from "@/types/pnl";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle } from "lucide-react";

interface PerformanceStatusBadgeProps {
  status: PerformanceStatus;
  showIcon?: boolean;
}

const statusConfig: Record<PerformanceStatus, { 
  label: string; 
  className: string; 
  icon: typeof TrendingUp 
}> = {
  EXCELLENT: { 
    label: "Excellent", 
    className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    icon: CheckCircle
  },
  GOOD: { 
    label: "Good", 
    className: "bg-green-500/20 text-green-400 border-green-500/30",
    icon: TrendingUp
  },
  NORMAL: { 
    label: "Normal", 
    className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: Minus
  },
  CONCERN: { 
    label: "Concern", 
    className: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    icon: AlertTriangle
  },
  CRITICAL: { 
    label: "Critical", 
    className: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: TrendingDown
  }
};

export function PerformanceStatusBadge({ status, showIcon = true }: PerformanceStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`${config.className} font-medium`}>
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {config.label}
    </Badge>
  );
}
