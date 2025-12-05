import { ProfitAndLoss } from "@/types/pnl";
import { getAmount } from "@/data/mockPnLData";
import { cn } from "@/lib/utils";
import { Trophy, TrendingUp, TrendingDown, MapPin } from "lucide-react";

interface LocationTableProps {
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

const getRankingBadge = (ranking: number) => {
  if (ranking === 1) return <Trophy className="h-4 w-4 text-warning" />;
  if (ranking === 2) return <span className="text-xs font-bold text-muted-foreground">2nd</span>;
  if (ranking === 3) return <span className="text-xs font-bold text-muted-foreground">3rd</span>;
  return <span className="text-xs text-muted-foreground">{ranking}th</span>;
};

export function LocationTable({ data }: LocationTableProps) {
  const sortedData = [...data].sort((a, b) => a.ranking - b.ranking);

  return (
    <div className="glass-card rounded-xl overflow-hidden animate-in-up" style={{ animationDelay: "400ms" }}>
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Location Performance
        </h3>
        <p className="text-sm text-muted-foreground mt-1">Ranked by profitability</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rank</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Revenue</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Expenses</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Profit</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Margin</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Transactions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedData.map((location, index) => {
              const revenue = getAmount(location.revenue);
              const profit = getAmount(location.profit);
              const totalExpenses = location.expenses.reduce((sum, exp) => sum + getAmount(exp.totalAmount), 0);
              const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
              const isProfit = profit >= 0;

              return (
                <tr 
                  key={location.locationId}
                  className="transition-colors hover:bg-muted/20 group"
                  style={{ animationDelay: `${500 + index * 50}ms` }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                      {getRankingBadge(location.ranking)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-2 h-8 rounded-full",
                        isProfit ? "bg-profit" : "bg-loss"
                      )} />
                      <div>
                        <p className="font-medium text-foreground">{location.locationName}</p>
                        <p className="text-xs text-muted-foreground">{location.locationId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono-numbers text-foreground">
                      {formatCurrency(revenue)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono-numbers text-muted-foreground">
                      {formatCurrency(totalExpenses)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isProfit ? (
                        <TrendingUp className="h-4 w-4 text-profit" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-loss" />
                      )}
                      <span className={cn(
                        "font-mono-numbers font-semibold",
                        isProfit ? "text-profit" : "text-loss"
                      )}>
                        {formatCurrency(profit)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-mono-numbers",
                      isProfit ? "bg-profit/10 text-profit" : "bg-loss/10 text-loss"
                    )}>
                      {margin.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono-numbers text-muted-foreground">
                      {location.transactions.toLocaleString()}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
