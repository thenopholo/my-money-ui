import { CreditCard } from "lucide-react";

export function CreditCardsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold flex items-center gap-3">
        <CreditCard className="h-6 w-6 text-primary" />
        Cartões de Crédito
      </h1>
      <p className="text-text-muted">Em breve...</p>
    </div>
  );
}
