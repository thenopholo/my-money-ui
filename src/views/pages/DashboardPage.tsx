import { Link } from "react-router-dom";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Percent,
  PieChart,
  Wallet,
  Calendar,
  BarChart3,
} from "lucide-react";
import { formatCurrency } from "../../utils/currency.ts";
import { useDashboardViewModel } from "../../viewmodels/dashboard.viewmodel.ts";
import { SummaryCard } from "../components/SummaryCard.tsx";
import { CreditCardWalletStack } from "../components/CreditCardWalletStack.tsx";
import { SpendingPieChart } from "../components/SpendingPieChart.tsx";
import { BankAccountCard } from "../components/BankAccountCard.tsx";
import { SpendingCalendar } from "../components/SpendingCalendar.tsx";
import { SpendingFrequencyChart } from "../components/SpendingFrequencyChart.tsx";

export function DashboardPage() {
  const {
    accounts,
    totalBalance,
    monthIncome,
    monthExpense,
    savingsRate,
    creditCards,
    spentByCard,
    cardSpendingByCategory,
    allTransactions,
    allCreditCardTransactions,
    accountPredictedBalances,
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

      {/* Row 1: Summary Cards */}
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

      {/* Row 2: Cartões de Crédito + Despesas por Categoria */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cartões de Crédito */}
        <section className="rounded-xl bg-surface border border-border p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Seus Cartões
          </h2>
          <CreditCardWalletStack
            cards={creditCards}
            spentByCard={spentByCard}
          />
          <div className="border-t border-border mt-4 pt-3 text-center">
            <Link
              to="/credit-cards"
              className="text-sm text-accent hover:underline uppercase tracking-wide"
            >
              VER MAIS
            </Link>
          </div>
        </section>

        {/* Despesas por Categoria — Donut */}
        <section className="rounded-xl bg-surface border border-border p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-primary" />
            Despesas por categoria
          </h2>
          <SpendingPieChart data={cardSpendingByCategory} />
          <div className="border-t border-border mt-4 pt-3 text-center">
            <Link
              to="/categories"
              className="text-sm text-accent hover:underline uppercase tracking-wide"
            >
              VER MAIS
            </Link>
          </div>
        </section>
      </div>

      {/* Row 3: Minhas Contas + Calendário */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Minhas Contas */}
        <section className="rounded-xl bg-surface border border-border p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Minhas contas
          </h2>
          {accounts.length === 0 ? (
            <p className="text-text-muted text-sm">
              Nenhuma conta cadastrada.
            </p>
          ) : (
            <div className="space-y-4">
              {accounts.map((account) => (
                <BankAccountCard
                  key={account.ID}
                  account={account}
                  predictedBalance={accountPredictedBalances[account.ID]}
                />
              ))}
            </div>
          )}
          <div className="border-t border-border mt-4 pt-3 text-center">
            <Link
              to="/accounts"
              className="text-sm text-accent hover:underline uppercase tracking-wide"
            >
              VER MAIS
            </Link>
          </div>
        </section>

        {/* Calendário */}
        <section className="rounded-xl bg-surface border border-border p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Calendário
          </h2>
          <SpendingCalendar
            transactions={allTransactions}
            creditCardTransactions={allCreditCardTransactions}
          />
          <div className="border-t border-border mt-4 pt-3 text-center">
            <Link
              to="/transactions"
              className="text-sm text-accent hover:underline uppercase tracking-wide"
            >
              VER MAIS
            </Link>
          </div>
        </section>
      </div>

      {/* Row 4: Frequência de Gastos — Full width */}
      <section className="rounded-xl bg-surface border border-border p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Frequência de gastos
        </h2>
        <SpendingFrequencyChart
          transactions={allTransactions}
          creditCardTransactions={allCreditCardTransactions}
        />
        <div className="border-t border-border mt-4 pt-3 text-center">
          <Link
            to="/transactions"
            className="text-sm text-accent hover:underline uppercase tracking-wide"
          >
            VER MAIS
          </Link>
        </div>
      </section>
    </div>
  );
}
