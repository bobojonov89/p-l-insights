import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Percent, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: number;
  icon?: typeof TrendingUp;
  variant?: "default" | "profit" | "loss";
}

function MetricCard({ label, value, subValue, trend, icon: Icon = DollarSign, variant = "default" }: MetricCardProps) {
  const variantClasses = {
    default: "bg-card/50",
    profit: "bg-emerald-500/5 border-emerald-500/20",
    loss: "bg-red-500/5 border-red-500/20"
  };

  return (
    <div className={`p-4 rounded-lg border border-border/50 ${variantClasses[variant]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      {(subValue || trend !== undefined) && (
        <div className="flex items-center gap-2 mt-1">
          {subValue && <span className="text-xs text-muted-foreground">{subValue}</span>}
          {trend !== undefined && (
            <span className={`text-xs flex items-center ${trend >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(trend).toFixed(1)}%
            </span>
          )}
        </div>
      )}
    </div>
  );
}

interface MetricsGridProps {
  profitMargin: number;
  expenseRatio: number;
  avgTransactionValue: number;
  avgProfit: number;
  revenueGrowth?: number;
  profitGrowth?: number;
}

export function MetricsGrid({ 
  profitMargin, 
  expenseRatio, 
  avgTransactionValue, 
  avgProfit,
  revenueGrowth,
  profitGrowth 
}: MetricsGridProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Profit Margin"
            value={`${profitMargin.toFixed(1)}%`}
            trend={profitGrowth}
            icon={Percent}
            variant={profitMargin >= 20 ? "profit" : profitMargin < 0 ? "loss" : "default"}
          />
          <MetricCard
            label="Expense Ratio"
            value={`${expenseRatio.toFixed(1)}%`}
            subValue={expenseRatio > 80 ? "High" : expenseRatio < 60 ? "Low" : "Normal"}
            icon={TrendingDown}
            variant={expenseRatio > 80 ? "loss" : expenseRatio < 60 ? "profit" : "default"}
          />
          <MetricCard
            label="Avg Transaction"
            value={formatCurrency(avgTransactionValue)}
            trend={revenueGrowth}
            icon={DollarSign}
          />
          <MetricCard
            label="Avg Profit/Transaction"
            value={formatCurrency(avgProfit)}
            icon={TrendingUp}
            variant={avgProfit > 0 ? "profit" : "loss"}
          />
        </div>
      </CardContent>
    </Card>
  );
}
