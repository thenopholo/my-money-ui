import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Percent,
  Wallet,
} from "lucide-react";
import { formatCurrency } from "../../utils/currency.ts";
import { useDashboardViewModel } from "../../viewmodels/dashboard.viewmodel.ts";
import { SummaryCard } from "../components/SummaryCard.tsx";

export function DashboardPage() {
  const {
    accounts,
    recentTransactions,
    totalBalance,
    monthIncome,
    monthExpense,
    savingsRate,
    loading,
  } = useDashboardViewModel();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Saldo Total"
          value={formatCurrency(totalBalance)}
          icon={<DollarSign className="h-5 w-5" />}
          color="text-primary"
        />
        <SummaryCard
          title="Receitas do Mês"
          value={formatCurrency(monthIncome)}
          icon={<TrendingUp className="h-5 w-5" />}
          color="text-income"
        />
        <SummaryCard
          title="Despesas do Mês"
          value={formatCurrency(monthExpense)}
          icon={<TrendingDown className="h-5 w-5" />}
          color="text-expense"
        />
        <SummaryCard
          title="Taxa de Economia"
          value={`${savingsRate.toFixed(1)}%`}
          icon={<Percent className="h-5 w-5" />}
          color="text-primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Accounts */}
        <section className="rounded-xl bg-surface border border-border p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Suas Contas
          </h2>
          {accounts.length === 0 ? (
            <p className="text-text-muted text-sm">Nenhuma conta cadastrada.</p>
          ) : (
            <div className="space-y-3">
              {accounts.map((account) => (
                <div
                  key={account.ID}
                  className="flex items-center justify-between rounded-lg bg-surface-light p-4"
                >
                  <div>
                    <p className="text-sm font-medium">{account.Name}</p>
                    <p className="text-xs text-text-muted">{account.BankName}</p>
                  </div>
                  <p className="text-sm font-semibold text-primary">
                    {formatCurrency(account.Balance)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Transactions */}
        <section className="rounded-xl bg-surface border border-border p-6">
          <h2 className="text-lg font-semibold mb-4">Transações Recentes</h2>
          {recentTransactions.length === 0 ? (
            <p className="text-text-muted text-sm">Nenhuma transação encontrada.</p>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.ID}
                  className="flex items-center justify-between rounded-lg bg-surface-light p-4"
                >
                  <div>
                    <p className="text-sm font-medium">{tx.Description}</p>
                    <p className="text-xs text-text-muted">
                      {new Date(tx.TransactionDate).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <p
                    className={`text-sm font-semibold ${
                      tx.TransactionType === "income" ? "text-income" : "text-expense"
                    }`}
                  >
                    {tx.TransactionType === "expense" ? "- " : "+ "}
                    {formatCurrency(tx.Amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Charts placeholder */}
      <section className="rounded-xl bg-surface border border-border p-6">
        <h2 className="text-lg font-semibold mb-2">Gráficos</h2>
        <p className="text-text-muted text-sm">Em breve...</p>
      </section>
    </div>
  );
}
