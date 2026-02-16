import React, { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import type { BankAccount, Category, Transaction } from "../../models/entities.ts";
import type { CreateTransactionRequest, UpdateTransactionRequest } from "../../models/dtos.ts";
import type { TransactionType } from "../../models/enums.ts";

interface TransactionFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTransactionRequest | UpdateTransactionRequest) => Promise<void>;
  transaction?: Transaction;
  accounts: BankAccount[];
  categories: Category[];
  saving: boolean;
}

export function TransactionFormModal({
  open,
  onClose,
  onSubmit,
  transaction,
  accounts,
  categories,
  saving,
}: TransactionFormModalProps) {
  const isEdit = !!transaction;

  const [transactionType, setTransactionType] = useState<TransactionType>(
    transaction?.TransactionType ?? "expense",
  );
  const [accountId, setAccountId] = useState(transaction?.AccountID ?? "");
  const [categoryId, setCategoryId] = useState(transaction?.CategoryID ?? "");
  const [description, setDescription] = useState(transaction?.Description ?? "");
  const [amount, setAmount] = useState(transaction?.Amount ?? "");
  const [transactionDate, setTransactionDate] = useState(
    transaction?.TransactionDate
      ? transaction.TransactionDate.slice(0, 10)
      : new Date().toISOString().slice(0, 10),
  );
  const [error, setError] = useState("");

  const filteredCategories = useMemo(
    () => categories.filter((c) => c.CategoryType === transactionType),
    [categories, transactionType],
  );

  const today = new Date().toISOString().slice(0, 10);

  const handleTypeChange = (type: TransactionType) => {
    setTransactionType(type);
    setCategoryId("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Valor deve ser positivo.");
      return;
    }

    if (transactionDate > today) {
      setError("Data não pode ser no futuro.");
      return;
    }

    try {
      if (isEdit) {
        if (!categoryId) {
          setError("Selecione uma categoria.");
          return;
        }
        const data: UpdateTransactionRequest = {
          category_id: categoryId,
          amount: amount,
          description: description.trim(),
          transaction_date: transactionDate + "T00:00:00Z",
        };
        await onSubmit(data);
      } else {
        if (!accountId) {
          setError("Selecione uma conta.");
          return;
        }
        if (!categoryId) {
          setError("Selecione uma categoria.");
          return;
        }
        const data: CreateTransactionRequest = {
          account_id: accountId,
          category_id: categoryId,
          amount: amount,
          transaction_type: transactionType,
          description: description.trim(),
          transaction_date: transactionDate + "T00:00:00Z",
        };
        await onSubmit(data);
      }
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro inesperado.");
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="rounded-2xl bg-surface ring-1 ring-white/10 p-6 w-full max-w-md mx-4 shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
        <h2 className="text-lg font-semibold mb-4">
          {isEdit ? "Editar Transação" : "Nova Transação"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="txType" className="block text-sm text-text-secondary mb-1">
              Tipo da Transação
            </label>
            <select
              id="txType"
              value={transactionType}
              onChange={(e) => handleTypeChange(e.target.value as TransactionType)}
              disabled={isEdit}
              className="w-full rounded-lg bg-[#050505] border border-white/10 px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-white/20 disabled:opacity-50"
            >
              <option value="income">Receita</option>
              <option value="expense">Despesa</option>
            </select>
          </div>

          <div>
            <label htmlFor="txAccount" className="block text-sm text-text-secondary mb-1">
              Conta Bancária
            </label>
            <select
              id="txAccount"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              disabled={isEdit}
              className="w-full rounded-lg bg-[#050505] border border-white/10 px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-white/20 disabled:opacity-50"
            >
              <option value="">Selecione uma conta</option>
              {accounts.filter((a) => a.IsActive).map((a) => (
                <option key={a.ID} value={a.ID}>
                  {a.Name || a.BankName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="txCategory" className="block text-sm text-text-secondary mb-1">
              Categoria
            </label>
            <select
              id="txCategory"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg bg-[#050505] border border-white/10 px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-white/20 disabled:opacity-50"
            >
              <option value="">Selecione uma categoria</option>
              {filteredCategories.map((c) => (
                <option key={c.ID} value={c.ID}>
                  {c.Name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="txDescription" className="block text-sm text-text-secondary mb-1">
              Descrição
            </label>
            <input
              id="txDescription"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg bg-[#050505] border border-white/10 px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-white/20"
              placeholder="Ex: PIX recebido, Supermercado..."
            />
          </div>

          <div>
            <label htmlFor="txAmount" className="block text-sm text-text-secondary mb-1">
              Valor
            </label>
            <input
              id="txAmount"
              type="number"
              step="0.01"
              min="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg bg-[#050505] border border-white/10 px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-white/20"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="txDate" className="block text-sm text-text-secondary mb-1">
              Data
            </label>
            <input
              id="txDate"
              type="date"
              required
              max={today}
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="w-full rounded-lg bg-[#050505] border border-white/10 px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-white/20"
            />
          </div>

          {error && (
            <p className="text-sm text-danger">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-full border border-white/10 px-4 py-2.5 text-sm text-text-secondary hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 btn-glow text-white font-semibold px-4 py-2.5 text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "Salvar Alterações" : "Criar Transação"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
