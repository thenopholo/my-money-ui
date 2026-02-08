import { useEffect, useState } from "react";
import { listAccounts } from "../services/accounts.service.ts";
import { listAccountTransactions } from "../services/transactions.service.ts";
import { listCreditCards } from "../services/credit-cards.service.ts";
import { listCreditCardTransactions } from "../services/credit-card-transactions.service.ts";
import { listCategories } from "../services/categories.service.ts";
import type {
  BankAccount,
  Category,
  CreditCard,
  CreditCardTransaction,
  Transaction,
} from "../models/entities.ts";
import type { CategorySpending } from "../views/components/SpendingPieChart.tsx";

export function useDashboardViewModel() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [allCreditCardTransactions, setAllCreditCardTransactions] = useState<
    CreditCardTransaction[]
  >([]);
  const [spentByCard, setSpentByCard] = useState<Record<string, number>>({});
  const [cardSpendingByCategory, setCardSpendingByCategory] = useState<
    CategorySpending[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [accts, cards, categories] = await Promise.all([
          listAccounts(),
          listCreditCards(),
          listCategories(),
        ]);
        setAccounts(accts);
        setCreditCards(cards);

        const txPromises = accts.map((a) => listAccountTransactions(a.ID));
        const txArrays = await Promise.all(txPromises);
        setTransactions(txArrays.flat());

        const spent: Record<string, number> = {};
        const allCardTxs: CreditCardTransaction[] = [];

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const cardPromises = cards.map(async (card) => {
          try {
            const cardTxs = await listCreditCardTransactions(card.ID);
            allCardTxs.push(...cardTxs);

            // Bug fix: calcular spent com base nas transações do mês corrente
            // ao invés de depender da fatura aberta
            const closeDay = card.CloseDay;
            const cycleStart = new Date(currentYear, currentMonth - 1, closeDay);
            const cycleEnd = new Date(currentYear, currentMonth, closeDay);

            const cycleTotal = cardTxs
              .filter((tx) => {
                const txDate = new Date(tx.TransactionDate);
                return txDate >= cycleStart && txDate < cycleEnd;
              })
              .reduce((sum, tx) => sum + parseFloat(tx.Amount), 0);

            spent[card.ID] = cycleTotal;
          } catch {
            spent[card.ID] = 0;
          }
        });
        await Promise.all(cardPromises);
        setSpentByCard(spent);
        setAllCreditCardTransactions(allCardTxs);

        const categoryMap = new Map<string, Category>();
        for (const cat of categories) {
          categoryMap.set(cat.ID, cat);
        }

        const byCat = new Map<string, number>();
        for (const tx of allCardTxs) {
          const prev = byCat.get(tx.CategoryID) ?? 0;
          byCat.set(tx.CategoryID, prev + parseFloat(tx.Amount));
        }

        const spending: CategorySpending[] = [];
        for (const [catId, amount] of byCat) {
          const cat = categoryMap.get(catId);
          spending.push({
            categoryName: cat?.Name ?? "Sem categoria",
            amount,
            color: cat?.Color ?? "",
          });
        }
        spending.sort((a, b) => b.amount - a.amount);
        setCardSpendingByCategory(spending);
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

  const savingsRate =
    monthIncome > 0 ? ((monthIncome - monthExpense) / monthIncome) * 100 : 0;

  const recentTransactions = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.TransactionDate).getTime() -
        new Date(a.TransactionDate).getTime(),
    )
    .slice(0, 5);

  // Saldo previsto por conta: Balance como fallback (sem dados de planejamento no dashboard)
  const accountPredictedBalances: Record<string, number> = {};
  for (const account of accounts) {
    accountPredictedBalances[account.ID] = parseFloat(account.Balance);
  }

  return {
    accounts,
    recentTransactions,
    totalBalance,
    monthIncome,
    monthExpense,
    savingsRate,
    creditCards,
    spentByCard,
    cardSpendingByCategory,
    allTransactions: transactions,
    allCreditCardTransactions,
    accountPredictedBalances,
    loading,
  };
}
