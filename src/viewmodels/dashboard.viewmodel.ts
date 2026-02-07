import { useEffect, useState } from "react";
import { listAccounts } from "../services/accounts.service.ts";
import { listAccountTransactions } from "../services/transactions.service.ts";
import type { BankAccount, Transaction } from "../models/entities.ts";

export function useDashboardViewModel() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const accts = await listAccounts();
        setAccounts(accts);

        const txPromises = accts.map((a) => listAccountTransactions(a.ID));
        const txArrays = await Promise.all(txPromises);
        setTransactions(txArrays.flat());
      } catch {
        // silently fail on dashboard load
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalBalance = accounts.reduce(
    (sum, a) => sum + parseFloat(a.Balance),
    0,
  );

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthTransactions = transactions.filter((t) => {
    const d = new Date(t.TransactionDate);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const monthIncome = monthTransactions
    .filter((t) => t.TransactionType === "income")
    .reduce((sum, t) => sum + parseFloat(t.Amount), 0);

  const monthExpense = monthTransactions
    .filter((t) => t.TransactionType === "expense")
    .reduce((sum, t) => sum + parseFloat(t.Amount), 0);

  const savingsRate = monthIncome > 0
    ? ((monthIncome - monthExpense) / monthIncome) * 100
    : 0;

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.TransactionDate).getTime() - new Date(a.TransactionDate).getTime())
    .slice(0, 5);

  return {
    accounts,
    recentTransactions,
    totalBalance,
    monthIncome,
    monthExpense,
    savingsRate,
    loading,
  };
}
