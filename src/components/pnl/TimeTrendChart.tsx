import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePreset } from "./DateRangeFilter";
import { DashboardChartData } from "@/types/pnl";
import { mockPnLData, generateChartData } from "@/data/mockPnLData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface TimeTrendChartProps {
  datePreset: DatePreset;
}

const getGranularity = (preset: DatePreset): "HOUR" | "DAY" | "MONTH" | "YEAR" => {
  switch (preset) {
    case "today": return "HOUR";
    case "this_week": return "DAY";
    case "this_month": return "DAY";
    case "custom": return "DAY";
    case "this_year": return "MONTH";
    default: return "DAY";
  }
};

const getGranularityLabel = (preset: DatePreset): string => {
  switch (preset) {
    case "today": return "Hourly breakdown";
    case "this_week": return "Daily breakdown";
    case "this_month": return "Daily breakdown";
    case "custom": return "Daily breakdown";
    case "this_year": return "Monthly breakdown";
    default: return "Breakdown";
  }
};

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
};

// Aggregate all locations into single time series
const aggregateChartData = (chartData: DashboardChartData) => {
  const locationCharts = chartData.profitAndLossCharts;
  if (locationCharts.length === 0) return [];
  
  const firstLocation = locationCharts[0];
  const timePoints = firstLocation.revenueData.dataPoints.map(dp => dp.label);
  
  return timePoints.map((label, index) => {
    let totalRevenue = 0;
    let totalExpenses = 0;
    let totalProfit = 0;
    
    locationCharts.forEach(loc => {
      totalRevenue += loc.revenueData.dataPoints[index]?.value || 0;
      totalExpenses += loc.expenseData.dataPoints[index]?.value || 0;
      totalProfit += loc.profitData.dataPoints[index]?.value || 0;
    });
    
    return {
      label,
      revenue: totalRevenue,
      expenses: totalExpenses,
      profit: totalProfit
    };
  });
};

export function TimeTrendChart({ datePreset }: TimeTrendChartProps) {
  const granularity = getGranularity(datePreset);
  const chartData = generateChartData(mockPnLData, granularity);
  const data = aggregateChartData(chartData);

  // Calculate totals for the header
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalProfit = data.reduce((sum, d) => sum + d.profit, 0);
  const totalExpenses = data.reduce((sum, d) => sum + d.expenses, 0);

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold">P&L Over Time</CardTitle>
            <CardDescription>{getGranularityLabel(datePreset)}</CardDescription>
          </div>
          <div className="flex gap-6 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Revenue</p>
              <p className="font-mono-numbers font-semibold text-chart-1">{formatCurrency(totalRevenue)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Expenses</p>
              <p className="font-mono-numbers font-semibold text-loss">{formatCurrency(totalExpenses)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Profit</p>
              <p className={`font-mono-numbers font-semibold ${totalProfit >= 0 ? 'text-profit' : 'text-loss'}`}>
                {formatCurrency(totalProfit)}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.3}
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "hsl(var(--border))" }}
                interval={datePreset === "this_month" || datePreset === "custom" ? 4 : 0}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatCurrency}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                itemStyle={{ color: "hsl(var(--muted-foreground))" }}
                formatter={(value: number) => [formatCurrency(value), ""]}
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
              />
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                formatter={(value) => (
                  <span style={{ color: "hsl(var(--foreground))", fontSize: 12 }}>
                    {value}
                  </span>
                )}
              />
              <Bar
                dataKey="revenue"
                name="Revenue"
                fill="hsl(var(--chart-1))"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expenses"
                name="Expenses"
                fill="hsl(var(--loss))"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="profit"
                name="Profit"
                fill="hsl(var(--profit))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
