import { 
  ProfitAndLoss, 
  ExpenseDetails, 
  Money, 
  PerformanceStatus, 
  Alert, 
  CategoryPerformance,
  DashboardChartData,
  ChartDataPoint,
  TimeSeriesData,
  ExpenseChartData,
  ProfitAndLossChartData
} from "@/types/pnl";
import { format, startOfDay, startOfMonth, addHours, addDays, subDays, subMonths, getDaysInMonth } from "date-fns";

const createMoney = (amount: number, currency: string = "USD"): Money[] => [
  { amount, currency }
];

const createExpense = (
  type: string, 
  amount: number, 
  count: number, 
  percentage: number,
  growth?: number
): ExpenseDetails => ({
  expenseType: type,
  totalAmount: createMoney(amount),
  totalCount: count,
  percentage,
  averageAmount: count > 0 ? amount / count : 0,
  growth
});

const createCategories = (): CategoryPerformance[] => [
  { categoryName: "Electronics", revenue: 125000, percentage: 35 },
  { categoryName: "Apparel", revenue: 89000, percentage: 25 },
  { categoryName: "Home & Garden", revenue: 71000, percentage: 20 },
];

const determineStatus = (margin: number, expenseRatio: number, transactions: number): PerformanceStatus => {
  if (margin >= 20 && expenseRatio <= 60 && transactions >= 50) return "EXCELLENT";
  if (margin >= 10 && expenseRatio <= 70 && transactions >= 20) return "GOOD";
  if (margin >= 5 && expenseRatio <= 80) return "NORMAL";
  if (margin >= 0 && expenseRatio <= 90) return "CONCERN";
  return "CRITICAL";
};

const generateAlerts = (margin: number, expenseRatio: number, transactions: number): Alert[] => {
  const alerts: Alert[] = [];
  if (margin < 5) {
    alerts.push({ 
      alertType: "LOW_MARGIN", 
      severity: "WARNING", 
      message: `Profit margin is low at ${margin.toFixed(1)}%. Consider reducing expenses.` 
    });
  }
  if (expenseRatio > 80) {
    alerts.push({ 
      alertType: "HIGH_EXPENSES", 
      severity: "CRITICAL", 
      message: `Expense ratio is high at ${expenseRatio.toFixed(1)}%. Review expense categories.` 
    });
  }
  if (transactions < 10) {
    alerts.push({ 
      alertType: "LOW_TRANSACTIONS", 
      severity: "WARNING", 
      message: `Low transaction count: ${transactions}. Consider marketing efforts.` 
    });
  }
  return alerts;
};

export const mockPnLData: ProfitAndLoss[] = [
  {
    locationId: "loc-001",
    locationName: "New York - Manhattan",
    totalSales: createMoney(485000),
    revenue: createMoney(428500),
    profit: createMoney(142800),
    expenses: [
      createExpense("Payroll", 156000, 24, 54.6, -2.3),
      createExpense("Rent & Utilities", 48500, 12, 17.0, 0),
      createExpense("Inventory", 62400, 156, 21.9, 5.2),
      createExpense("Marketing", 18800, 8, 6.5, 12.1),
    ],
    transactions: 12450,
    ranking: 1,
    profitMargin: 33.3,
    expenseRatio: 66.7,
    averageTransactionValue: 34.4,
    averageProfit: 11.5,
    revenueGrowth: 12.5,
    profitGrowth: 8.7,
    transactionGrowth: 5.4,
    region: "Northeast",
    locationType: "Flagship Store",
    managerName: "Sarah Johnson",
    isActive: true,
    performanceStatus: "EXCELLENT",
    alerts: [],
    topCategories: createCategories(),
    topProducts: []
  },
  {
    locationId: "loc-002",
    locationName: "Los Angeles - Downtown",
    totalSales: createMoney(412000),
    revenue: createMoney(365800),
    profit: createMoney(98500),
    expenses: [
      createExpense("Payroll", 142000, 22, 53.1, 1.2),
      createExpense("Rent & Utilities", 52000, 12, 19.5, 0),
      createExpense("Inventory", 54300, 134, 20.3, -3.1),
      createExpense("Marketing", 19000, 10, 7.1, 8.5),
    ],
    transactions: 10890,
    ranking: 2,
    profitMargin: 26.9,
    expenseRatio: 73.1,
    averageTransactionValue: 33.6,
    averageProfit: 9.0,
    revenueGrowth: 8.3,
    profitGrowth: 5.2,
    transactionGrowth: 3.1,
    region: "West",
    locationType: "Store",
    managerName: "Michael Chen",
    isActive: true,
    performanceStatus: "GOOD",
    alerts: [],
    topCategories: createCategories(),
    topProducts: []
  },
  {
    locationId: "loc-003",
    locationName: "Chicago - Loop",
    totalSales: createMoney(356000),
    revenue: createMoney(312400),
    profit: createMoney(78200),
    expenses: [
      createExpense("Payroll", 128000, 20, 54.7, 2.1),
      createExpense("Rent & Utilities", 42000, 12, 17.9, 0),
      createExpense("Inventory", 48200, 118, 20.6, -1.5),
      createExpense("Marketing", 16000, 6, 6.8, -5.2),
    ],
    transactions: 8920,
    ranking: 3,
    profitMargin: 25.0,
    expenseRatio: 75.0,
    averageTransactionValue: 35.0,
    averageProfit: 8.8,
    revenueGrowth: 4.2,
    profitGrowth: 2.8,
    transactionGrowth: 1.9,
    region: "Midwest",
    locationType: "Store",
    managerName: "Emily Davis",
    isActive: true,
    performanceStatus: "GOOD",
    alerts: [],
    topCategories: createCategories(),
    topProducts: []
  },
  {
    locationId: "loc-004",
    locationName: "Houston - Galleria",
    totalSales: createMoney(298000),
    revenue: createMoney(264500),
    profit: createMoney(52400),
    expenses: [
      createExpense("Payroll", 118000, 18, 55.7, 3.5),
      createExpense("Rent & Utilities", 38000, 12, 17.9, 0),
      createExpense("Inventory", 42100, 98, 19.9, 2.3),
      createExpense("Marketing", 14000, 5, 6.5, -2.1),
    ],
    transactions: 7650,
    ranking: 4,
    profitMargin: 19.8,
    expenseRatio: 80.2,
    averageTransactionValue: 34.6,
    averageProfit: 6.8,
    revenueGrowth: 2.1,
    profitGrowth: -1.5,
    transactionGrowth: 0.8,
    region: "South",
    locationType: "Store",
    managerName: "Robert Wilson",
    isActive: true,
    performanceStatus: "NORMAL",
    alerts: generateAlerts(19.8, 80.2, 7650),
    topCategories: createCategories(),
    topProducts: []
  },
  {
    locationId: "loc-005",
    locationName: "Miami - Brickell",
    totalSales: createMoney(278000),
    revenue: createMoney(245200),
    profit: createMoney(-12500),
    expenses: [
      createExpense("Payroll", 124000, 19, 48.1, 8.2),
      createExpense("Rent & Utilities", 56000, 12, 21.7, 0),
      createExpense("Inventory", 58700, 145, 22.8, 15.3),
      createExpense("Marketing", 19000, 12, 7.4, 22.5),
    ],
    transactions: 6890,
    ranking: 6,
    profitMargin: -5.1,
    expenseRatio: 105.1,
    averageTransactionValue: 35.6,
    averageProfit: -1.8,
    revenueGrowth: -3.2,
    profitGrowth: -28.5,
    transactionGrowth: -5.1,
    region: "Southeast",
    locationType: "Store",
    managerName: "Lisa Martinez",
    isActive: true,
    performanceStatus: "CRITICAL",
    alerts: generateAlerts(-5.1, 105.1, 6890),
    topCategories: createCategories(),
    topProducts: []
  },
  {
    locationId: "loc-006",
    locationName: "Seattle - Downtown",
    totalSales: createMoney(324000),
    revenue: createMoney(286800),
    profit: createMoney(68900),
    expenses: [
      createExpense("Payroll", 115000, 17, 52.8, -1.2),
      createExpense("Rent & Utilities", 45000, 12, 20.6, 0),
      createExpense("Inventory", 44900, 102, 20.6, -2.8),
      createExpense("Marketing", 13000, 7, 6.0, 4.5),
    ],
    transactions: 8120,
    ranking: 5,
    profitMargin: 24.0,
    expenseRatio: 76.0,
    averageTransactionValue: 35.3,
    averageProfit: 8.5,
    revenueGrowth: 6.8,
    profitGrowth: 4.2,
    transactionGrowth: 2.5,
    region: "Pacific Northwest",
    locationType: "Store",
    managerName: "David Kim",
    isActive: true,
    performanceStatus: "GOOD",
    alerts: [],
    topCategories: createCategories(),
    topProducts: []
  },
];

export const getAmount = (money: Money[]): number => {
  return money.reduce((sum, m) => sum + m.amount, 0);
};

export const getCurrency = (money: Money[]): string => {
  return money[0]?.currency || "USD";
};

export const calculateSummary = (data: ProfitAndLoss[]) => {
  const totalRevenue = data.reduce((sum, loc) => sum + getAmount(loc.revenue), 0);
  const totalExpenses = data.reduce((sum, loc) => {
    return sum + loc.expenses.reduce((expSum, exp) => expSum + getAmount(exp.totalAmount), 0);
  }, 0);
  const netProfit = data.reduce((sum, loc) => sum + getAmount(loc.profit), 0);
  const totalTransactions = data.reduce((sum, loc) => sum + loc.transactions, 0);
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  const expenseRatio = totalRevenue > 0 ? (totalExpenses / totalRevenue) * 100 : 0;
  const topPerformer = data.find(loc => loc.ranking === 1)?.locationName || "";
  
  // Calculate weighted growth rates
  const revenueGrowth = data.reduce((sum, loc) => sum + (loc.revenueGrowth || 0) * getAmount(loc.revenue), 0) / totalRevenue;
  const profitGrowth = data.reduce((sum, loc) => sum + (loc.profitGrowth || 0) * Math.abs(getAmount(loc.profit)), 0) / Math.abs(netProfit);
  const transactionGrowth = data.reduce((sum, loc) => sum + (loc.transactionGrowth || 0) * loc.transactions, 0) / totalTransactions;

  return {
    totalRevenue,
    totalExpenses,
    netProfit,
    totalTransactions,
    profitMargin,
    expenseRatio,
    topPerformer,
    currency: getCurrency(data[0]?.revenue || []),
    revenueGrowth,
    profitGrowth,
    transactionGrowth
  };
};

export const aggregateExpenses = (data: ProfitAndLoss[]) => {
  const expenseMap = new Map<string, { amount: number; count: number; growth: number }>();
  
  data.forEach(location => {
    location.expenses.forEach(expense => {
      const existing = expenseMap.get(expense.expenseType) || { amount: 0, count: 0, growth: 0 };
      expenseMap.set(expense.expenseType, {
        amount: existing.amount + getAmount(expense.totalAmount),
        count: existing.count + expense.totalCount,
        growth: (existing.growth + (expense.growth || 0)) / 2
      });
    });
  });
  
  const total = Array.from(expenseMap.values()).reduce((sum, d) => sum + d.amount, 0);
  
  return Array.from(expenseMap.entries()).map(([type, data]) => ({
    name: type,
    value: data.amount,
    count: data.count,
    percentage: total > 0 ? (data.amount / total) * 100 : 0,
    growth: data.growth
  }));
};

// Generate chart data matching backend DashboardChartData structure
export const generateChartData = (
  data: ProfitAndLoss[], 
  granularity: "HOUR" | "DAY" | "MONTH" | "YEAR",
  isCurrentMonth: boolean = false
): DashboardChartData => {
  const now = new Date();
  
  const generateTimePoints = (): { label: string; date: Date }[] => {
    const points: { label: string; date: Date }[] = [];
    
    if (granularity === "HOUR") {
      const startOfToday = startOfDay(now);
      for (let i = 0; i < 24; i++) {
        const hour = addHours(startOfToday, i);
        points.push({ label: format(hour, "ha"), date: hour });
      }
    } else if (granularity === "DAY") {
      if (isCurrentMonth) {
        // For "This Month", show only the days in the current month
        const monthStart = startOfMonth(now);
        const daysInMonth = getDaysInMonth(now);
        for (let i = 0; i < daysInMonth; i++) {
          const day = addDays(monthStart, i);
          points.push({ label: format(day, "MMM d"), date: day });
        }
      } else {
        // For "This Week" or "Custom", show last 7 days
        for (let i = 6; i >= 0; i--) {
          const day = subDays(now, i);
          points.push({ label: format(day, "MMM d"), date: day });
        }
      }
    } else if (granularity === "MONTH") {
      for (let i = 11; i >= 0; i--) {
        const month = subMonths(now, i);
        points.push({ label: format(month, "MMM"), date: month });
      }
    } else {
      for (let i = 4; i >= 0; i--) {
        const year = new Date(now.getFullYear() - i, 0, 1);
        points.push({ label: format(year, "yyyy"), date: year });
      }
    }
    return points;
  };

  const timePoints = generateTimePoints();
  
  // Generate data for each location
  const profitAndLossCharts: ProfitAndLossChartData[] = data.map(loc => {
    const baseRevenue = getAmount(loc.revenue);
    const baseExpense = loc.expenses.reduce((sum, e) => sum + getAmount(e.totalAmount), 0);
    const baseProfit = getAmount(loc.profit);
    
    const revenuePoints: ChartDataPoint[] = timePoints.map(tp => ({
      label: tp.label,
      value: Math.round(baseRevenue / timePoints.length * (0.7 + Math.random() * 0.6)),
      currency: "USD"
    }));
    
    const expensePoints: ChartDataPoint[] = timePoints.map(tp => ({
      label: tp.label,
      value: Math.round(baseExpense / timePoints.length * (0.7 + Math.random() * 0.6)),
      currency: "USD"
    }));
    
    const profitPoints: ChartDataPoint[] = timePoints.map((tp, i) => ({
      label: tp.label,
      value: revenuePoints[i].value - expensePoints[i].value,
      currency: "USD"
    }));

    const expenseBreakdown: ExpenseChartData[] = loc.expenses.map(exp => ({
      expenseType: exp.expenseType,
      totalAmount: getAmount(exp.totalAmount),
      percentage: exp.percentage
    }));

    return {
      locationId: loc.locationId,
      locationName: loc.locationName,
      revenueData: {
        period: granularity,
        dataPoints: revenuePoints,
        totalValue: revenuePoints.reduce((sum, p) => sum + p.value, 0),
        growthRate: loc.revenueGrowth
      },
      expenseData: {
        period: granularity,
        dataPoints: expensePoints,
        totalValue: expensePoints.reduce((sum, p) => sum + p.value, 0)
      },
      profitData: {
        period: granularity,
        dataPoints: profitPoints,
        totalValue: profitPoints.reduce((sum, p) => sum + p.value, 0),
        growthRate: loc.profitGrowth
      },
      expenseBreakdown
    };
  });

  // Generate summary charts
  const summaryCharts = {
    revenueByLocation: data.map(loc => ({
      label: loc.locationName,
      value: getAmount(loc.revenue),
      metadata: { locationId: loc.locationId }
    })),
    profitByLocation: data.map(loc => ({
      label: loc.locationName,
      value: getAmount(loc.profit),
      metadata: { locationId: loc.locationId }
    })),
    expenseByType: aggregateExpenses(data).map(exp => ({
      label: exp.name,
      value: exp.value,
      metadata: { percentage: exp.percentage.toFixed(1) }
    })),
    performanceIndicators: [
      { label: "Excellent", value: data.filter(d => d.performanceStatus === "EXCELLENT").length },
      { label: "Good", value: data.filter(d => d.performanceStatus === "GOOD").length },
      { label: "Normal", value: data.filter(d => d.performanceStatus === "NORMAL").length },
      { label: "Concern", value: data.filter(d => d.performanceStatus === "CONCERN").length },
      { label: "Critical", value: data.filter(d => d.performanceStatus === "CRITICAL").length },
    ]
  };

  return {
    profitAndLossCharts,
    summaryCharts,
    timeGranularity: granularity
  };
};
