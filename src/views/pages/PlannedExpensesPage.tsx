import { TrendingDown } from "lucide-react";

export function PlannedExpensesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold flex items-center gap-3">
        <TrendingDown className="h-6 w-6 text-primary" />
        Despesas Planejadas
      </h1>
      <p className="text-text-muted">Em breve...</p>
    </div>
  );
}
