import { ProfitAndLoss, PerformanceStatus } from "@/types/pnl";
import { getAmount } from "@/data/mockPnLData";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Building2, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface ProfitTrendCardProps {
  data: ProfitAndLoss[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const statusCounts = (data: ProfitAndLoss[]) => {
  const counts: Record<PerformanceStatus, number> = {
    EXCELLENT: 0,
    GOOD: 0,
    NORMAL: 0,
    CONCERN: 0,
    CRITICAL: 0
  };
  data.forEach(loc => counts[loc.performanceStatus]++);
  return counts;
};

export function ProfitTrendCard({ data }: ProfitTrendCardProps) {
  const profitableLocations = data.filter(loc => getAmount(loc.profit) > 0);
  const unprofitableLocations = data.filter(loc => getAmount(loc.profit) <= 0);
  const counts = statusCounts(data);
  
  const bestPerformer = data.reduce((best, loc) => 
    getAmount(loc.profit) > getAmount(best.profit) ? loc : best
  , data[0]);
  
  const worstPerformer = data.reduce((worst, loc) => 
    getAmount(loc.profit) < getAmount(worst.profit) ? loc : worst
  , data[0]);

  const totalAlerts = data.reduce((sum, loc) => sum + loc.alerts.length, 0);

  return (
    <div className="glass-card rounded-xl p-6 animate-in-up" style={{ animationDelay: "350ms" }}>
      <div className="flex items-center gap-2 mb-6">
        <Building2 className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Performance Overview</h3>
      </div>

      {/* Performance Status Distribution */}
      <div className="mb-6">
        <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">Status Distribution</p>
        <div className="flex gap-1 h-3 rounded-full overflow-hidden">
          {counts.EXCELLENT > 0 && (
            <div className="bg-emerald-500" style={{ flex: counts.EXCELLENT }} title={`Excellent: ${counts.EXCELLENT}`} />
          )}
          {counts.GOOD > 0 && (
            <div className="bg-green-500" style={{ flex: counts.GOOD }} title={`Good: ${counts.GOOD}`} />
          )}
          {counts.NORMAL > 0 && (
            <div className="bg-blue-500" style={{ flex: counts.NORMAL }} title={`Normal: ${counts.NORMAL}`} />
          )}
          {counts.CONCERN > 0 && (
            <div className="bg-amber-500" style={{ flex: counts.CONCERN }} title={`Concern: ${counts.CONCERN}`} />
          )}
          {counts.CRITICAL > 0 && (
            <div className="bg-red-500" style={{ flex: counts.CRITICAL }} title={`Critical: ${counts.CRITICAL}`} />
          )}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs">
          {counts.EXCELLENT > 0 && <span className="text-emerald-400">● {counts.EXCELLENT} Excellent</span>}
          {counts.GOOD > 0 && <span className="text-green-400">● {counts.GOOD} Good</span>}
          {counts.NORMAL > 0 && <span className="text-blue-400">● {counts.NORMAL} Normal</span>}
          {counts.CONCERN > 0 && <span className="text-amber-400">● {counts.CONCERN} Concern</span>}
          {counts.CRITICAL > 0 && <span className="text-red-400">● {counts.CRITICAL} Critical</span>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-profit/10 rounded-lg p-4 border border-profit/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-profit" />
            <span className="text-sm font-medium text-profit">Profitable</span>
          </div>
          <p className="text-2xl font-bold text-foreground font-mono-numbers">
            {profitableLocations.length}
          </p>
          <p className="text-xs text-muted-foreground">locations</p>
        </div>
        
        <div className={cn(
          "rounded-lg p-4 border",
          unprofitableLocations.length > 0 
            ? "bg-loss/10 border-loss/20" 
            : "bg-muted border-border"
        )}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className={cn(
              "h-4 w-4",
              unprofitableLocations.length > 0 ? "text-loss" : "text-muted-foreground"
            )} />
            <span className={cn(
              "text-sm font-medium",
              unprofitableLocations.length > 0 ? "text-loss" : "text-muted-foreground"
            )}>
              Unprofitable
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground font-mono-numbers">
            {unprofitableLocations.length}
          </p>
          <p className="text-xs text-muted-foreground">locations</p>
        </div>
      </div>

      {/* Alerts Summary */}
      {totalAlerts > 0 && (
        <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-400">{totalAlerts} Active Alerts</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="bg-profit/5 rounded-lg p-4 border border-profit/10">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <p className="text-xs text-muted-foreground">Top Performer</p>
          </div>
          <p className="font-medium text-foreground">{bestPerformer.locationName}</p>
          <p className="font-mono-numbers text-profit font-semibold">
            {formatCurrency(getAmount(bestPerformer.profit))}
          </p>
        </div>
        
        {getAmount(worstPerformer.profit) < 0 && (
          <div className="bg-loss/5 rounded-lg p-4 border border-loss/10">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="h-4 w-4 text-red-400" />
              <p className="text-xs text-muted-foreground">Needs Attention</p>
            </div>
            <p className="font-medium text-foreground">{worstPerformer.locationName}</p>
            <p className="font-mono-numbers text-loss font-semibold">
              {formatCurrency(getAmount(worstPerformer.profit))}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
