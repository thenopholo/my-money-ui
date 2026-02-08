import { useCallback, useEffect, useState } from "react";
import {
  listPlannedExpenses,
  createPlannedExpense,
  updatePlannedExpense,
  deletePlannedExpense,
} from "../services/planned-expenses.service.ts";
import { listAccounts } from "../services/accounts.service.ts";
import { listCategories } from "../services/categories.service.ts";
import { ApiRequestError } from "../services/http-client.ts";
import type { PlannedExpense, BankAccount, Category } from "../models/entities.ts";
import type { CreatePlannedExpenseRequest, UpdatePlannedExpenseRequest } from "../models/dtos.ts";
import type { Recurrence } from "../models/enums.ts";

export function usePlannedExpensesViewModel() {
  const [expenses, setExpenses] = useState<PlannedExpense[]>([]);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [frequencyFilter, setFrequencyFilter] = useState<"all" | Recurrence>("all");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all");

  const loadData = useCallback(async () => {
    try {
      setError("");
      setLoading(true);
      const [expensesData, accountsData, categoriesData] = await Promise.all([
        listPlannedExpenses(),
        listAccounts(),
        listCategories(),
      ]);
      setExpenses(expensesData);
      setAccounts(accountsData);
      setCategories(categoriesData.filter((c) => c.CategoryType === "expense"));
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
      } else {
        setError("Erro ao carregar despesas planejadas.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const reloadExpenses = async () => {
    try {
      const data = await listPlannedExpenses();
      setExpenses(data);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
      } else {
        setError("Erro ao carregar despesas planejadas.");
      }
    }
  };

  const handleCreate = async (data: CreatePlannedExpenseRequest) => {
    setSaving(true);
    try {
      await createPlannedExpense(data);
      await reloadExpenses();
    } catch (err) {
      if (err instanceof ApiRequestError) {
        throw err;
      }
      throw new Error("Erro ao criar despesa planejada.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string, data: UpdatePlannedExpenseRequest) => {
    setSaving(true);
    try {
      await updatePlannedExpense(id, data);
      await reloadExpenses();
    } catch (err) {
      if (err instanceof ApiRequestError) {
        throw err;
      }
      throw new Error("Erro ao atualizar despesa planejada.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    try {
      await deletePlannedExpense(id);
      await reloadExpenses();
    } catch (err) {
      if (err instanceof ApiRequestError) {
        throw err;
      }
      throw new Error("Erro ao excluir despesa planejada.");
    } finally {
      setSaving(false);
    }
  };

  const filteredExpenses = expenses
    .filter((e) => frequencyFilter === "all" || e.Frequency === frequencyFilter)
    .filter(
      (e) =>
        activeFilter === "all" ||
        (activeFilter === "active" && e.IsActive) ||
        (activeFilter === "inactive" && !e.IsActive),
    );

  const activeCount = expenses.filter((e) => e.IsActive).length;
  const totalAmount = expenses
    .filter((e) => e.IsActive)
    .reduce((sum, e) => sum + parseFloat(e.Amount), 0);

  return {
    expenses,
    filteredExpenses,
    accounts,
    categories,
    loading,
    saving,
    error,
    frequencyFilter,
    setFrequencyFilter,
    activeFilter,
    setActiveFilter,
    activeCount,
    totalAmount,
    loadData,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}
