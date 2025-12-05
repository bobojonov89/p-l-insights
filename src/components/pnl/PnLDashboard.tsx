import { mockPnLData, calculateSummary } from "@/data/mockPnLData";
import { SummaryCard } from "./SummaryCard";
import { LocationTable } from "./LocationTable";
import { ExpenseBreakdown } from "./ExpenseBreakdown";
import { RevenueChart } from "./RevenueChart";
import { ProfitTrendCard } from "./ProfitTrendCard";
import { PnLHeader } from "./PnLHeader";
import { DollarSign, TrendingUp, Receipt, Activity } from "lucide-react";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function PnLDashboard() {
  const summary = calculateSummary(mockPnLData);

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
        <PnLHeader />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <SummaryCard
            title="Total Revenue"
            value={formatCurrency(summary.totalRevenue)}
            subtitle={`${mockPnLData.length} locations`}
            icon={DollarSign}
            trend="up"
            trendValue="12.5% vs last month"
            variant="neutral"
            delay={0}
          />
          <SummaryCard
            title="Total Expenses"
            value={formatCurrency(summary.totalExpenses)}
            subtitle="All categories"
            icon={Receipt}
            trend="down"
            trendValue="3.2% vs last month"
            variant="neutral"
            delay={50}
          />
          <SummaryCard
            title="Net Profit"
            value={formatCurrency(summary.netProfit)}
            subtitle={`${summary.profitMargin.toFixed(1)}% margin`}
            icon={TrendingUp}
            trend={summary.netProfit >= 0 ? "up" : "down"}
            trendValue="8.7% vs last month"
            variant={summary.netProfit >= 0 ? "profit" : "loss"}
            delay={100}
          />
          <SummaryCard
            title="Transactions"
            value={summary.totalTransactions.toLocaleString()}
            subtitle="This period"
            icon={Activity}
            trend="up"
            trendValue="5.4% vs last month"
            variant="neutral"
            delay={150}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
      </div>
    </div>
  );
}
