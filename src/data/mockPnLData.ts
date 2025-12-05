import { ProfitAndLoss, ExpenseDetails, Money } from "@/types/pnl";

const createMoney = (amount: number, currency: string = "USD"): Money[] => [
  { amount, currency }
];

const createExpense = (type: string, amount: number, count: number): ExpenseDetails => ({
  expenseType: type,
  totalAmount: createMoney(amount),
  totalCount: count
});

export const mockPnLData: ProfitAndLoss[] = [
  {
    locationId: "loc-001",
    locationName: "New York - Manhattan",
    totalSales: createMoney(485000),
    revenue: createMoney(428500),
    profit: createMoney(142800),
    expenses: [
      createExpense("Payroll", 156000, 24),
      createExpense("Rent & Utilities", 48500, 12),
      createExpense("Inventory", 62400, 156),
      createExpense("Marketing", 18800, 8),
    ],
    transactions: 12450,
    ranking: 1
  },
  {
    locationId: "loc-002",
    locationName: "Los Angeles - Downtown",
    totalSales: createMoney(412000),
    revenue: createMoney(365800),
    profit: createMoney(98500),
    expenses: [
      createExpense("Payroll", 142000, 22),
      createExpense("Rent & Utilities", 52000, 12),
      createExpense("Inventory", 54300, 134),
      createExpense("Marketing", 19000, 10),
    ],
    transactions: 10890,
    ranking: 2
  },
  {
    locationId: "loc-003",
    locationName: "Chicago - Loop",
    totalSales: createMoney(356000),
    revenue: createMoney(312400),
    profit: createMoney(78200),
    expenses: [
      createExpense("Payroll", 128000, 20),
      createExpense("Rent & Utilities", 42000, 12),
      createExpense("Inventory", 48200, 118),
      createExpense("Marketing", 16000, 6),
    ],
    transactions: 8920,
    ranking: 3
  },
  {
    locationId: "loc-004",
    locationName: "Houston - Galleria",
    totalSales: createMoney(298000),
    revenue: createMoney(264500),
    profit: createMoney(52400),
    expenses: [
      createExpense("Payroll", 118000, 18),
      createExpense("Rent & Utilities", 38000, 12),
      createExpense("Inventory", 42100, 98),
      createExpense("Marketing", 14000, 5),
    ],
    transactions: 7650,
    ranking: 4
  },
  {
    locationId: "loc-005",
    locationName: "Miami - Brickell",
    totalSales: createMoney(278000),
    revenue: createMoney(245200),
    profit: createMoney(-12500),
    expenses: [
      createExpense("Payroll", 124000, 19),
      createExpense("Rent & Utilities", 56000, 12),
      createExpense("Inventory", 58700, 145),
      createExpense("Marketing", 19000, 12),
    ],
    transactions: 6890,
    ranking: 5
  },
  {
    locationId: "loc-006",
    locationName: "Seattle - Downtown",
    totalSales: createMoney(324000),
    revenue: createMoney(286800),
    profit: createMoney(68900),
    expenses: [
      createExpense("Payroll", 115000, 17),
      createExpense("Rent & Utilities", 45000, 12),
      createExpense("Inventory", 44900, 102),
      createExpense("Marketing", 13000, 7),
    ],
    transactions: 8120,
    ranking: 6
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
  const topPerformer = data.find(loc => loc.ranking === 1)?.locationName || "";
  
  return {
    totalRevenue,
    totalExpenses,
    netProfit,
    totalTransactions,
    profitMargin,
    topPerformer,
    currency: getCurrency(data[0]?.revenue || [])
  };
};

export const aggregateExpenses = (data: ProfitAndLoss[]) => {
  const expenseMap = new Map<string, { amount: number; count: number }>();
  
  data.forEach(location => {
    location.expenses.forEach(expense => {
      const existing = expenseMap.get(expense.expenseType) || { amount: 0, count: 0 };
      expenseMap.set(expense.expenseType, {
        amount: existing.amount + getAmount(expense.totalAmount),
        count: existing.count + expense.totalCount
      });
    });
  });
  
  return Array.from(expenseMap.entries()).map(([type, data]) => ({
    name: type,
    value: data.amount,
    count: data.count
  }));
};
