import { ProfitAndLoss } from "@/types/pnl";
import { getAmount } from "@/data/mockPnLData";
import { cn } from "@/lib/utils";
import { 
  Trophy, TrendingUp, TrendingDown, MapPin, 
  DollarSign, Receipt, Activity, ChevronRight,
  Building2
} from "lucide-react";
import { useState } from "react";

interface LocationReportProps {
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

const getRankingIcon = (ranking: number) => {
  if (ranking === 1) return <Trophy className="h-5 w-5 text-warning" />;
  return <span className="text-sm font-bold text-muted-foreground">#{ranking}</span>;
};

export function LocationReport({ data }: LocationReportProps) {
  const [expandedLocation, setExpandedLocation] = useState<string | null>(null);
  const sortedData = [...data].sort((a, b) => a.ranking - b.ranking);

  return (
    <div className="glass-card rounded-xl overflow-hidden animate-in-up" style={{ animationDelay: "200ms" }}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Location Report</h2>
              <p className="text-sm text-muted-foreground">Detailed breakdown by location</p>
            </div>
          </div>
          <span className="text-sm text-muted-foreground">{data.length} locations</span>
        </div>
      </div>

      <div className="divide-y divide-border">
        {sortedData.map((location, index) => {
          const revenue = getAmount(location.revenue);
          const profit = getAmount(location.profit);
          const totalExpenses = location.expenses.reduce((sum, exp) => sum + getAmount(exp.totalAmount), 0);
          const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
          const isProfit = profit >= 0;
          const isExpanded = expandedLocation === location.locationId;

          return (
            <div 
              key={location.locationId}
              className="transition-colors hover:bg-muted/10"
            >
              {/* Main Row */}
              <button
                onClick={() => setExpandedLocation(isExpanded ? null : location.locationId)}
                className="w-full p-4 sm:p-6 flex items-center gap-4 text-left"
              >
                {/* Rank */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted shrink-0">
                  {getRankingIcon(location.ranking)}
                </div>

                {/* Location Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                    <h3 className="font-semibold text-foreground truncate">
                      {location.locationName}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    <span className="text-muted-foreground">
                      {location.transactions.toLocaleString()} transactions
                    </span>
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                      isProfit ? "bg-profit/10 text-profit" : "bg-loss/10 text-loss"
                    )}>
                      {margin.toFixed(1)}% margin
                    </span>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="hidden sm:flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-0.5">Revenue</p>
                    <p className="font-mono-numbers font-medium text-foreground">
                      {formatCurrency(revenue)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-0.5">Profit</p>
                    <div className="flex items-center gap-1 justify-end">
                      {isProfit ? (
                        <TrendingUp className="h-4 w-4 text-profit" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-loss" />
                      )}
                      <p className={cn(
                        "font-mono-numbers font-semibold",
                        isProfit ? "text-profit" : "text-loss"
                      )}>
                        {formatCurrency(profit)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Expand Arrow */}
                <ChevronRight className={cn(
                  "h-5 w-5 text-muted-foreground transition-transform shrink-0",
                  isExpanded && "rotate-90"
                )} />
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-4 sm:px-6 pb-6 pt-2 bg-muted/5 animate-fade-in">
                  {/* Mobile Metrics */}
                  <div className="sm:hidden grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-card rounded-lg p-3 border border-border">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="h-4 w-4 text-neutral" />
                        <span className="text-xs text-muted-foreground">Revenue</span>
                      </div>
                      <p className="font-mono-numbers font-semibold text-foreground">
                        {formatCurrency(revenue)}
                      </p>
                    </div>
                    <div className={cn(
                      "rounded-lg p-3 border",
                      isProfit ? "bg-profit/5 border-profit/20" : "bg-loss/5 border-loss/20"
                    )}>
                      <div className="flex items-center gap-2 mb-1">
                        {isProfit ? (
                          <TrendingUp className="h-4 w-4 text-profit" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-loss" />
                        )}
                        <span className="text-xs text-muted-foreground">Profit</span>
                      </div>
                      <p className={cn(
                        "font-mono-numbers font-semibold",
                        isProfit ? "text-profit" : "text-loss"
                      )}>
                        {formatCurrency(profit)}
                      </p>
                    </div>
                  </div>

                  {/* Expense Breakdown */}
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                      <Receipt className="h-4 w-4" />
                      Expense Breakdown
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {location.expenses.map((expense, expIndex) => {
                        const expAmount = getAmount(expense.totalAmount);
                        const expPercent = totalExpenses > 0 ? (expAmount / totalExpenses) * 100 : 0;
                        
                        return (
                          <div 
                            key={expense.expenseType}
                            className="bg-card rounded-lg p-3 border border-border"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-foreground">
                                {expense.expenseType}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {expPercent.toFixed(1)}%
                              </span>
                            </div>
                            <p className="font-mono-numbers text-lg font-semibold text-foreground">
                              {formatCurrency(expAmount)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {expense.totalCount} items
                            </p>
                            {/* Progress bar */}
                            <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full transition-all duration-500"
                                style={{ width: `${expPercent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Total Expenses */}
                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Total Expenses
                      </span>
                      <span className="font-mono-numbers text-lg font-bold text-foreground">
                        {formatCurrency(totalExpenses)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
