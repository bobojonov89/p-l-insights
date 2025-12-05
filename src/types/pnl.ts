// ============================================================================
// MONEY & BASIC TYPES
// ============================================================================

export interface Money {
  amount: number;
  currency: string;
}

// ============================================================================
// PERFORMANCE STATUS & ALERTS
// ============================================================================

export type PerformanceStatus = "EXCELLENT" | "GOOD" | "NORMAL" | "CONCERN" | "CRITICAL";

export type AlertType = "LOW_MARGIN" | "HIGH_EXPENSES" | "DECLINING_REVENUE" | "LOW_TRANSACTIONS" | "INVENTORY_ISSUE";

export type AlertSeverity = "CRITICAL" | "WARNING" | "INFO" | "SUCCESS";

export interface Alert {
  alertType: AlertType;
  severity: AlertSeverity;
  message: string;
}

// ============================================================================
// EXPENSE DETAILS
// ============================================================================

export interface ExpenseDetails {
  expenseType: string;
  totalAmount: Money[];
  totalCount: number;
  percentage: number;
  averageAmount: number;
  previousAmount?: Money[];
  growth?: number;
}

// ============================================================================
// CATEGORY & PRODUCT PERFORMANCE
// ============================================================================

export interface CategoryPerformance {
  categoryName: string;
  revenue: number;
  percentage: number;
}

export interface ProductPerformance {
  productId: string;
  productName: string;
  revenue: Money[];
  profit: Money[];
  quantitySold: number;
  profitMargin: number;
  ranking: number;
}

// ============================================================================
// PROFIT AND LOSS
// ============================================================================

export interface ProfitAndLoss {
  locationId: string;
  locationName: string;
  totalSales: Money[];
  revenue: Money[];
  profit: Money[];
  expenses: ExpenseDetails[];
  transactions: number;
  ranking: number;

  // Performance metrics
  profitMargin: number;
  expenseRatio: number;
  averageTransactionValue: number;
  averageProfit: number;

  // Comparison data
  previousRevenue?: Money[];
  revenueGrowth?: number;
  previousProfit?: Money[];
  profitGrowth?: number;
  transactionGrowth?: number;

  // Location context
  region?: string;
  locationType?: string;
  managerName?: string;
  isActive: boolean;

  // Performance indicators
  performanceStatus: PerformanceStatus;
  alerts: Alert[];

  // Top performers
  topCategories: CategoryPerformance[];
  topProducts: ProductPerformance[];
}

// ============================================================================
// CHART DATA STRUCTURES
// ============================================================================

export interface ChartDataPoint {
  label: string;
  value: number;
  currency?: string;
  metadata?: Record<string, string>;
}

export interface TimeSeriesData {
  period: string;
  dataPoints: ChartDataPoint[];
  totalValue: number;
  growthRate?: number;
}

export interface ExpenseChartData {
  expenseType: string;
  totalAmount: number;
  percentage: number;
  color?: string;
}

export interface ComparisonChartData {
  currentPeriod: ChartDataPoint;
  previousPeriod: ChartDataPoint;
  changePercent: number;
  trend: "UP" | "DOWN" | "STABLE";
}

export interface ProfitAndLossChartData {
  locationId: string;
  locationName: string;
  revenueData: TimeSeriesData;
  expenseData: TimeSeriesData;
  profitData: TimeSeriesData;
  expenseBreakdown: ExpenseChartData[];
  comparisonData?: ComparisonChartData;
}

export interface SummaryChartData {
  revenueByLocation: ChartDataPoint[];
  profitByLocation: ChartDataPoint[];
  expenseByType: ChartDataPoint[];
  performanceIndicators: ChartDataPoint[];
}

export interface DashboardChartData {
  profitAndLossCharts: ProfitAndLossChartData[];
  summaryCharts: SummaryChartData;
  timeGranularity: "HOUR" | "DAY" | "MONTH" | "YEAR";
}

// ============================================================================
// SUMMARY
// ============================================================================

export interface PnLSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  totalTransactions: number;
  profitMargin: number;
  expenseRatio: number;
  topPerformer: string;
  currency: string;
  revenueGrowth?: number;
  profitGrowth?: number;
  transactionGrowth?: number;
}
