import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { aggregateExpenses } from "@/data/mockPnLData";
import { ProfitAndLoss } from "@/types/pnl";
import { Receipt } from "lucide-react";

interface ExpenseBreakdownProps {
  data: ProfitAndLoss[];
}

const COLORS = [
  "hsl(280, 65%, 60%)",
  "hsl(38, 92%, 50%)",
  "hsl(190, 95%, 39%)",
  "hsl(340, 75%, 55%)",
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass-card rounded-lg p-3 border border-border">
        <p className="font-medium text-foreground">{data.name}</p>
        <p className="text-sm text-muted-foreground font-mono-numbers">
          {formatCurrency(data.value)}
        </p>
        <p className="text-xs text-muted-foreground">
          {data.count} transactions
        </p>
      </div>
    );
  }
  return null;
};

export function ExpenseBreakdown({ data }: ExpenseBreakdownProps) {
  const expenses = aggregateExpenses(data);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.value, 0);

  return (
    <div className="glass-card rounded-xl p-6 animate-in-up" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center gap-2 mb-6">
        <Receipt className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Expense Breakdown</h3>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={expenses}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {expenses.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3 mt-4">
        {expenses.map((expense, index) => {
          const percentage = ((expense.value / totalExpenses) * 100).toFixed(1);
          return (
            <div key={expense.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-muted-foreground">{expense.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground">{percentage}%</span>
                <span className="font-mono-numbers text-sm font-medium">
                  {formatCurrency(expense.value)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Total Expenses</span>
          <span className="font-mono-numbers text-lg font-bold text-foreground">
            {formatCurrency(totalExpenses)}
          </span>
        </div>
      </div>
    </div>
  );
}
