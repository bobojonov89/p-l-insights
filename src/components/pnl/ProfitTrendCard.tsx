import { ProfitAndLoss } from "@/types/pnl";
import { getAmount } from "@/data/mockPnLData";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Building2 } from "lucide-react";

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

export function ProfitTrendCard({ data }: ProfitTrendCardProps) {
  const profitableLocations = data.filter(loc => getAmount(loc.profit) > 0);
  const unprofitableLocations = data.filter(loc => getAmount(loc.profit) <= 0);
  
  const bestPerformer = data.reduce((best, loc) => 
    getAmount(loc.profit) > getAmount(best.profit) ? loc : best
  , data[0]);
  
  const worstPerformer = data.reduce((worst, loc) => 
    getAmount(loc.profit) < getAmount(worst.profit) ? loc : worst
  , data[0]);

  return (
    <div className="glass-card rounded-xl p-6 animate-in-up" style={{ animationDelay: "350ms" }}>
      <div className="flex items-center gap-2 mb-6">
        <Building2 className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Performance Overview</h3>
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

      <div className="space-y-4">
        <div className="bg-profit/5 rounded-lg p-4 border border-profit/10">
          <p className="text-xs text-muted-foreground mb-1">Top Performer</p>
          <p className="font-medium text-foreground">{bestPerformer.locationName}</p>
          <p className="font-mono-numbers text-profit font-semibold">
            {formatCurrency(getAmount(bestPerformer.profit))}
          </p>
        </div>
        
        {getAmount(worstPerformer.profit) < 0 && (
          <div className="bg-loss/5 rounded-lg p-4 border border-loss/10">
            <p className="text-xs text-muted-foreground mb-1">Needs Attention</p>
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
