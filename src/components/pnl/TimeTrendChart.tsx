import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePreset } from "./DateRangeFilter";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format, startOfDay, addHours, addDays, addMonths, subDays, subMonths } from "date-fns";

interface TimeDataPoint {
  label: string;
  revenue: number;
  expenses: number;
  profit: number;
}

interface TimeTrendChartProps {
  datePreset: DatePreset;
}

// Generate mock time-series data based on the granularity
const generateTimeSeriesData = (preset: DatePreset): TimeDataPoint[] => {
  const now = new Date();
  const data: TimeDataPoint[] = [];

  if (preset === "today") {
    // Hourly data for today (24 hours)
    const startOfToday = startOfDay(now);
    for (let i = 0; i < 24; i++) {
      const hour = addHours(startOfToday, i);
      const baseRevenue = 8000 + Math.random() * 12000;
      const baseExpenses = 5000 + Math.random() * 6000;
      data.push({
        label: format(hour, "ha"),
        revenue: Math.round(baseRevenue),
        expenses: Math.round(baseExpenses),
        profit: Math.round(baseRevenue - baseExpenses),
      });
    }
  } else if (preset === "this_week") {
    // Daily data for this week (7 days)
    for (let i = 6; i >= 0; i--) {
      const day = subDays(now, i);
      const baseRevenue = 45000 + Math.random() * 35000;
      const baseExpenses = 30000 + Math.random() * 20000;
      data.push({
        label: format(day, "EEE"),
        revenue: Math.round(baseRevenue),
        expenses: Math.round(baseExpenses),
        profit: Math.round(baseRevenue - baseExpenses),
      });
    }
  } else if (preset === "this_month" || preset === "custom") {
    // Daily data for a month (30 days)
    for (let i = 29; i >= 0; i--) {
      const day = subDays(now, i);
      const baseRevenue = 45000 + Math.random() * 35000;
      const baseExpenses = 30000 + Math.random() * 20000;
      data.push({
        label: format(day, "MMM d"),
        revenue: Math.round(baseRevenue),
        expenses: Math.round(baseExpenses),
        profit: Math.round(baseRevenue - baseExpenses),
      });
    }
  } else if (preset === "this_year") {
    // Monthly data for a year (12 months)
    for (let i = 11; i >= 0; i--) {
      const month = subMonths(now, i);
      const baseRevenue = 1200000 + Math.random() * 600000;
      const baseExpenses = 800000 + Math.random() * 400000;
      data.push({
        label: format(month, "MMM"),
        revenue: Math.round(baseRevenue),
        expenses: Math.round(baseExpenses),
        profit: Math.round(baseRevenue - baseExpenses),
      });
    }
  }

  return data;
};

const getGranularityLabel = (preset: DatePreset): string => {
  switch (preset) {
    case "today":
      return "Hourly breakdown";
    case "this_week":
      return "Daily breakdown";
    case "this_month":
    case "custom":
      return "Daily breakdown";
    case "this_year":
      return "Monthly breakdown";
    default:
      return "Breakdown";
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

export function TimeTrendChart({ datePreset }: TimeTrendChartProps) {
  const data = generateTimeSeriesData(datePreset);

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">P&L Over Time</CardTitle>
        <CardDescription>{getGranularityLabel(datePreset)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--profit))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--profit))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--loss))" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(var(--loss))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.3}
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
              />
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                formatter={(value) => (
                  <span style={{ color: "hsl(var(--foreground))", fontSize: 12 }}>
                    {value}
                  </span>
                )}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                name="Expenses"
                stroke="hsl(var(--loss))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorExpenses)"
              />
              <Area
                type="monotone"
                dataKey="profit"
                name="Profit"
                stroke="hsl(var(--profit))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorProfit)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
