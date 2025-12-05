import { useState } from "react";
import { mockPnLData, calculateSummary } from "@/data/mockPnLData";
import { SummaryCard } from "./SummaryCard";
import { LocationTable } from "./LocationTable";
import { ExpenseBreakdown } from "./ExpenseBreakdown";
import { RevenueChart } from "./RevenueChart";
import { ProfitTrendCard } from "./ProfitTrendCard";
import { PnLHeader } from "./PnLHeader";
import { LocationReport } from "./LocationReport";
import { ViewToggle, ViewMode } from "./ViewToggle";
import { TimeTrendChart } from "./TimeTrendChart";
import { MetricsGrid } from "./MetricsGrid";
import { DateRange, DatePreset } from "./DateRangeFilter";
import { DollarSign, TrendingUp, Receipt, Activity } from "lucide-react";
import { format } from "date-fns";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function PnLDashboard() {
  const [activeView, setActiveView] = useState<ViewMode>("overview");
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [datePreset, setDatePreset] = useState<DatePreset>("this_month");
  
  const summary = calculateSummary(mockPnLData);

  const handleDateRangeChange = (range: DateRange, preset: DatePreset) => {
    setDateRange(range);
    setDatePreset(preset);
    // In a real app, this would trigger data fetching for the selected date range
    console.log("Date range changed:", format(range.from, "yyyy-MM-dd"), "to", format(range.to, "yyyy-MM-dd"));
  };

  const getDateRangeLabel = () => {
    if (!dateRange) return "This Month";
    if (datePreset !== "custom") {
      const labels: Record<DatePreset, string> = {
        today: "Today",
        this_week: "This Week",
        this_month: "This Month",
        this_year: "This Year",
        custom: "",
      };
      return labels[datePreset];
    }
    return `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
        <PnLHeader onDateRangeChange={handleDateRangeChange} />

        {/* View Toggle & Date Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <ViewToggle activeView={activeView} onViewChange={setActiveView} />
          <p className="text-sm text-muted-foreground">
            Showing data for: <span className="text-foreground font-medium">{getDateRangeLabel()}</span>
          </p>
        </div>

        {activeView === "overview" ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <SummaryCard
                title="Total Revenue"
                value={formatCurrency(summary.totalRevenue)}
                subtitle={`${mockPnLData.length} locations`}
                icon={DollarSign}
                trend="up"
                trendValue={`${summary.revenueGrowth?.toFixed(1) || '0'}% vs last period`}
                variant="neutral"
                delay={0}
              />
              <SummaryCard
                title="Total Expenses"
                value={formatCurrency(summary.totalExpenses)}
                subtitle={`${summary.expenseRatio.toFixed(1)}% of revenue`}
                icon={Receipt}
                trend={summary.expenseRatio < 75 ? "down" : "up"}
                trendValue={summary.expenseRatio < 75 ? "Healthy" : "High ratio"}
                variant="neutral"
                delay={50}
              />
              <SummaryCard
                title="Net Profit"
                value={formatCurrency(summary.netProfit)}
                subtitle={`${summary.profitMargin.toFixed(1)}% margin`}
                icon={TrendingUp}
                trend={summary.netProfit >= 0 ? "up" : "down"}
                trendValue={`${summary.profitGrowth?.toFixed(1) || '0'}% vs last period`}
                variant={summary.netProfit >= 0 ? "profit" : "loss"}
                delay={100}
              />
              <SummaryCard
                title="Transactions"
                value={summary.totalTransactions.toLocaleString()}
                subtitle="This period"
                icon={Activity}
                trend={summary.transactionGrowth && summary.transactionGrowth >= 0 ? "up" : "down"}
                trendValue={`${summary.transactionGrowth?.toFixed(1) || '0'}% vs last period`}
                variant="neutral"
                delay={150}
              />
            </div>

            {/* Metrics Grid */}
            <div className="mb-6">
              <MetricsGrid
                profitMargin={summary.profitMargin}
                expenseRatio={summary.expenseRatio}
                avgTransactionValue={summary.totalRevenue / summary.totalTransactions}
                avgProfit={summary.netProfit / summary.totalTransactions}
                revenueGrowth={summary.revenueGrowth}
                profitGrowth={summary.profitGrowth}
              />
            </div>

            {/* Time Trend Chart */}
            <div className="mb-6">
              <TimeTrendChart datePreset={datePreset} />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <RevenueChart data={mockPnLData} />
              </div>
              <div className="space-y-6">
                <ExpenseBreakdown data={mockPnLData} />
              </div>
            </div>

            {/* Performance Overview and Table */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <ProfitTrendCard data={mockPnLData} />
              </div>
              <div className="lg:col-span-3">
                <LocationTable data={mockPnLData} />
              </div>
            </div>
          </>
        ) : (
          <LocationReport data={mockPnLData} />
        )}
      </div>
    </div>
  );
}
