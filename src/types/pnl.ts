export interface Money {
  amount: number;
  currency: string;
}

export interface ExpenseDetails {
  expenseType: string;
  totalAmount: Money[];
  totalCount: number;
}

export interface ProfitAndLoss {
  locationId: string;
  locationName: string;
  totalSales: Money[];
  revenue: Money[];
  profit: Money[];
  expenses: ExpenseDetails[];
  transactions: number;
  ranking: number;
}

export interface PnLSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  totalTransactions: number;
  profitMargin: number;
  topPerformer: string;
  currency: string;
}
