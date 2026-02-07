import { TrendingUp } from "lucide-react";

export function PlannedIncomesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold flex items-center gap-3">
        <TrendingUp className="h-6 w-6 text-primary" />
        Receitas Planejadas
      </h1>
      <p className="text-text-muted">Em breve...</p>
    </div>
  );
}
