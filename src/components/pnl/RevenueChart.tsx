import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ProfitAndLoss } from "@/types/pnl";
import { getAmount } from "@/data/mockPnLData";
import { BarChart3 } from "lucide-react";

interface RevenueChartProps {
  data: ProfitAndLoss[];
}

const formatCurrency = (amount: number) => {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const profit = payload[1]?.value || 0;
    const isProfit = profit >= 0;
    
    return (
      <div className="glass-card rounded-lg p-4 border border-border min-w-48">
        <p className="font-medium text-foreground mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Revenue</span>
            <span className="font-mono-numbers text-sm text-neutral">
              {formatCurrency(payload[0]?.value || 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Profit</span>
            <span className={`font-mono-numbers text-sm ${isProfit ? 'text-profit' : 'text-loss'}`}>
              {formatCurrency(profit)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData = data
    .sort((a, b) => a.ranking - b.ranking)
    .map(location => ({
      name: location.locationName.split(' - ')[1] || location.locationName,
      fullName: location.locationName,
      revenue: getAmount(location.revenue),
      profit: getAmount(location.profit),
    }));

  return (
    <div className="glass-card rounded-xl p-6 animate-in-up" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Revenue vs Profit by Location</h3>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(217, 33%, 17%)' }}
              tickLine={false}
            />
            <YAxis 
              tickFormatter={formatCurrency}
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(217, 33%, 17%)' }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(217, 33%, 17%)', opacity: 0.3 }} />
            <Bar 
              dataKey="revenue" 
              fill="hsl(217, 91%, 60%)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Bar 
              dataKey="profit" 
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={entry.profit >= 0 ? "hsl(160, 84%, 39%)" : "hsl(0, 72%, 51%)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-neutral" />
          <span className="text-sm text-muted-foreground">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-profit" />
          <span className="text-sm text-muted-foreground">Profit</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-loss" />
          <span className="text-sm text-muted-foreground">Loss</span>
        </div>
      </div>
    </div>
  );
}
