import { useCallback, useEffect, useState } from "react";
import {
  listPlannedIncomes,
  createPlannedIncome,
  updatePlannedIncome,
  deletePlannedIncome,
} from "../services/planned-incomes.service.ts";
import { listAccounts } from "../services/accounts.service.ts";
import { listCategories } from "../services/categories.service.ts";
import { ApiRequestError } from "../services/http-client.ts";
import type { PlannedIncome, BankAccount, Category } from "../models/entities.ts";
import type { CreatePlannedIncomeRequest, UpdatePlannedIncomeRequest } from "../models/dtos.ts";
import type { Recurrence } from "../models/enums.ts";

export function usePlannedIncomesViewModel() {
  const [incomes, setIncomes] = useState<PlannedIncome[]>([]);
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
      const [incomesData, accountsData, categoriesData] = await Promise.all([
        listPlannedIncomes(),
        listAccounts(),
        listCategories(),
      ]);
      setIncomes(incomesData);
      setAccounts(accountsData);
      setCategories(categoriesData.filter((c) => c.CategoryType === "income"));
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
      } else {
        setError("Erro ao carregar receitas planejadas.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const reloadIncomes = async () => {
    try {
      const data = await listPlannedIncomes();
      setIncomes(data);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
      } else {
        setError("Erro ao carregar receitas planejadas.");
      }
    }
  };

  const handleCreate = async (data: CreatePlannedIncomeRequest) => {
    setSaving(true);
    try {
      await createPlannedIncome(data);
      await reloadIncomes();
    } catch (err) {
      if (err instanceof ApiRequestError) {
        throw err;
      }
      throw new Error("Erro ao criar receita planejada.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string, data: UpdatePlannedIncomeRequest) => {
    setSaving(true);
    try {
      await updatePlannedIncome(id, data);
      await reloadIncomes();
    } catch (err) {
      if (err instanceof ApiRequestError) {
        throw err;
      }
      throw new Error("Erro ao atualizar receita planejada.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    try {
      await deletePlannedIncome(id);
      await reloadIncomes();
    } catch (err) {
      if (err instanceof ApiRequestError) {
        throw err;
      }
      throw new Error("Erro ao excluir receita planejada.");
    } finally {
      setSaving(false);
    }
  };

  const filteredIncomes = incomes
    .filter((i) => frequencyFilter === "all" || i.Frequency === frequencyFilter)
    .filter(
      (i) =>
        activeFilter === "all" ||
        (activeFilter === "active" && i.IsActive) ||
        (activeFilter === "inactive" && !i.IsActive),
    );

  const activeCount = incomes.filter((i) => i.IsActive).length;
  const totalAmount = incomes
    .filter((i) => i.IsActive)
    .reduce((sum, i) => sum + parseFloat(i.Amount), 0);

  return {
    incomes,
    filteredIncomes,
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
