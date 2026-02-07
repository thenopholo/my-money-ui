import { Wallet } from "lucide-react";

export function AccountsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold flex items-center gap-3">
        <Wallet className="h-6 w-6 text-primary" />
        Contas
      </h1>
      <p className="text-text-muted">Em breve...</p>
    </div>
  );
}
