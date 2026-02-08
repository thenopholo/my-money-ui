import { useEffect, useMemo, useState } from "react";
import { listAccounts } from "../services/accounts.service.ts";
import { listCategories } from "../services/categories.service.ts";
import { listCreditCards } from "../services/credit-cards.service.ts";
import {
  createTransaction,
  deleteTransaction,
  listAccountTransactions,
  updateTransaction,
} from "../services/transactions.service.ts";
import { importConfirm, importPreview } from "../services/import.service.ts";
import type { CreateTransactionRequest, ImportConfirmRequest, UpdateTransactionRequest } from "../models/dtos.ts";
import type {
  BankAccount,
  Category,
  CreditCard,
  ImportPreviewResponse,
  ImportResult,
  Transaction,
} from "../models/entities.ts";
import type { ImportType } from "../models/enums.ts";
import { ApiRequestError } from "../services/http-client.ts";

export function useTransactionsViewModel() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");

  const [importStep, setImportStep] = useState<"idle" | "upload" | "preview" | "result">("idle");
  const [previewData, setPreviewData] = useState<ImportPreviewResponse | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");

  async function loadTransactions(accts?: BankAccount[]) {
    const accountList = accts ?? accounts;
    if (accountList.length === 0) {
      setTransactions([]);
      return;
    }
    const txArrays = await Promise.all(accountList.map((a) => listAccountTransactions(a.ID)));
    const all = txArrays.flat();
    all.sort((a, b) => new Date(b.TransactionDate).getTime() - new Date(a.TransactionDate).getTime());
    setTransactions(all);
  }

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const [accts, cats, cards] = await Promise.all([
          listAccounts(),
          listCategories(),
          listCreditCards(),
        ]);
        setAccounts(accts);
        setCategories(cats);
        setCreditCards(cards);
        await loadTransactions(accts);
      } catch (err) {
        if (err instanceof ApiRequestError) {
          setError(err.message);
        } else {
          setError("Erro ao carregar dados.");
        }
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate(data: CreateTransactionRequest) {
    setSaving(true);
    setError("");
    try {
      await createTransaction(data);
      await loadTransactions();
    } catch (err) {
      if (err instanceof ApiRequestError) {
        throw err;
      }
      throw new Error("Erro ao criar transação.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: string, data: UpdateTransactionRequest) {
    setSaving(true);
    setError("");
    try {
      await updateTransaction(id, data);
      await loadTransactions();
    } catch (err) {
      if (err instanceof ApiRequestError) {
        throw err;
      }
      throw new Error("Erro ao atualizar transação.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setSaving(true);
    setError("");
    try {
      await deleteTransaction(id);
      await loadTransactions();
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
      } else {
        setError("Erro ao excluir transação.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleImportPreview(file: File, importType: ImportType, targetId: string) {
    setImporting(true);
    setImportError("");
    try {
      const preview = await importPreview(file, importType, targetId);
      setPreviewData(preview);
      setImportStep("preview");
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setImportError(err.message);
      } else {
        setImportError("Erro ao processar CSV.");
      }
    } finally {
      setImporting(false);
    }
  }

  async function handleImportConfirm(request: ImportConfirmRequest) {
    setImporting(true);
    setImportError("");
    try {
      const result = await importConfirm(request);
      setImportResult(result);
      setImportStep("result");
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setImportError(err.message);
      } else {
        setImportError("Erro ao confirmar importação.");
      }
    } finally {
      setImporting(false);
    }
  }

  function resetImport() {
    setImportStep("idle");
    setPreviewData(null);
    setImportResult(null);
    setImporting(false);
    setImportError("");
  }

  const filteredTransactions = useMemo(() => {
    let result = transactions;
    if (selectedAccountId) {
      result = result.filter((tx) => tx.AccountID === selectedAccountId);
    }
    if (filterType !== "all") {
      result = result.filter((tx) => tx.TransactionType === filterType);
    }
    return result;
  }, [transactions, selectedAccountId, filterType]);

  const totalIncome = useMemo(
    () => filteredTransactions.filter((tx) => tx.TransactionType === "income").reduce((sum, tx) => sum + parseFloat(tx.Amount), 0),
    [filteredTransactions],
  );

  const totalExpense = useMemo(
    () => filteredTransactions.filter((tx) => tx.TransactionType === "expense").reduce((sum, tx) => sum + parseFloat(tx.Amount), 0),
    [filteredTransactions],
  );

  return {
    transactions,
    filteredTransactions,
    accounts,
    categories,
    creditCards,
    loading,
    error,
    saving,
    selectedAccountId,
    setSelectedAccountId,
    filterType,
    setFilterType,
    loadTransactions,
    handleCreate,
    handleUpdate,
    handleDelete,
    importStep,
    setImportStep,
    previewData,
    importResult,
    importing,
    importError,
    handleImportPreview,
    handleImportConfirm,
    resetImport,
    totalIncome,
    totalExpense,
  };
}
