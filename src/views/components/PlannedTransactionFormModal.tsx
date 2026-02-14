import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { RECURRENCE_OPTIONS } from "../../utils/recurrence.ts";
import type { BankAccount, Category, PlannedIncome, PlannedExpense } from "../../models/entities.ts";
import type {
  CreatePlannedIncomeRequest,
  CreatePlannedExpenseRequest,
  UpdatePlannedIncomeRequest,
  UpdatePlannedExpenseRequest,
} from "../../models/dtos.ts";
import type { Recurrence } from "../../models/enums.ts";

type FormSubmitData =
  | CreatePlannedIncomeRequest
  | CreatePlannedExpenseRequest
  | UpdatePlannedIncomeRequest
  | UpdatePlannedExpenseRequest;

interface PlannedTransactionFormModalProps {
  type: "income" | "expense";
  onClose: () => void;
  onSubmit: (data: FormSubmitData) => Promise<void>;
  item?: PlannedIncome | PlannedExpense;
  saving: boolean;
  accounts: BankAccount[];
  categories: Category[];
}

const LABELS = {
  income: {
    createTitle: "Nova Receita Planejada",
    editTitle: "Editar Receita Planejada",
    createButton: "Criar Receita Planejada",
    placeholder: "Ex: Salário, Freelance, Aluguel recebido",
  },
  expense: {
    createTitle: "Nova Despesa Planejada",
    editTitle: "Editar Despesa Planejada",
    createButton: "Criar Despesa Planejada",
    placeholder: "Ex: Aluguel, Internet, Energia",
  },
} as const;

function toDateInputValue(dateStr: string | null): string {
  if (!dateStr) return "";
  return dateStr.slice(0, 10);
}

export function PlannedTransactionFormModal({
  type,
  onClose,
  onSubmit,
  item,
  saving,
  accounts,
  categories,
}: PlannedTransactionFormModalProps) {
  const isEdit = !!item;
  const labels = LABELS[type];

  const [description, setDescription] = useState(item?.Description ?? "");
  const [amount, setAmount] = useState(item?.Amount ?? "");
  const [accountId, setAccountId] = useState(item?.AccountID ?? "");
  const [categoryId, setCategoryId] = useState(item?.CategoryID ?? "");
  const [frequency, setFrequency] = useState<Recurrence>(item?.Frequency ?? "monthly");
  const [dueDay, setDueDay] = useState(item?.DueDay?.toString() ?? "");
  const [startDate, setStartDate] = useState(toDateInputValue(item?.StartDate ?? null));
  const [endDate, setEndDate] = useState(toDateInputValue(item?.EndDate ?? null));
  const [isActive, setIsActive] = useState(item?.IsActive ?? true);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!description.trim()) {
      setError("Descrição é obrigatória.");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Valor deve ser um número positivo.");
      return;
    }

    const dueDayNum = parseInt(dueDay, 10);
    if (isNaN(dueDayNum) || dueDayNum < 1 || dueDayNum > 31) {
      setError("Dia de vencimento deve estar entre 1 e 31.");
      return;
    }

    if (!isEdit && !accountId) {
      setError("Selecione uma conta.");
      return;
    }

    if (!isEdit && !categoryId) {
      setError("Selecione uma categoria.");
      return;
    }

    if (startDate && endDate && endDate < startDate) {
      setError("Data final deve ser posterior ou igual à data inicial.");
      return;
    }

    const startDateValue = startDate ? `${startDate}T00:00:00Z` : null;
    const endDateValue = endDate ? `${endDate}T00:00:00Z` : null;

    try {
      if (isEdit) {
        const data: UpdatePlannedIncomeRequest | UpdatePlannedExpenseRequest = {
          amount: amount,
          due_day: dueDayNum,
          start_date: startDateValue,
          end_date: endDateValue,
          description: description.trim(),
          frequency,
          is_active: isActive,
        };
        await onSubmit(data);
      } else {
        const data: CreatePlannedIncomeRequest | CreatePlannedExpenseRequest = {
          account_id: accountId,
          category_id: categoryId,
          amount: amount,
          due_day: dueDayNum,
          start_date: startDateValue,
          end_date: endDateValue,
          description: description.trim(),
          frequency,
          is_active: isActive,
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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="rounded-2xl bg-surface ring-1 ring-white/10 p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span
            className={`inline-block h-1 w-6 rounded-full ${
              type === "income" ? "bg-income" : "bg-expense"
            }`}
          />
          {isEdit ? labels.editTitle : labels.createTitle}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm text-text-secondary mb-1">
              Descrição
            </label>
            <input
              id="description"
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg bg-[#050505] border border-white/10 px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-white/20"
              placeholder={labels.placeholder}
            />
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm text-text-secondary mb-1">
              Valor
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg bg-[#050505] border border-white/10 px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-white/20"
              placeholder="0,00"
            />
          </div>

          {/* Account + Category (2 columns) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="accountId" className="block text-sm text-text-secondary mb-1">
                Conta Bancária
              </label>
              <select
                id="accountId"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                disabled={isEdit}
                className="w-full rounded-lg bg-[#050505] border border-white/10 px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-white/20 disabled:opacity-50"
              >
                <option value="">Selecione uma conta</option>
                {accounts.map((acc) => (
                  <option key={acc.ID} value={acc.ID}>
                    {acc.Name} — {acc.BankName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="categoryId" className="block text-sm text-text-secondary mb-1">
                Categoria
              </label>
              <select
                id="categoryId"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={isEdit}
                className="w-full rounded-lg bg-[#050505] border border-white/10 px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-white/20 disabled:opacity-50"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((cat) => (
                  <option key={cat.ID} value={cat.ID}>
                    {cat.Name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Day + Frequency (2 columns) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="dueDay" className="block text-sm text-text-secondary mb-1">
                Dia de Vencimento
              </label>
              <input
                id="dueDay"
                type="number"
                min={1}
                max={31}
                required
                value={dueDay}
                onChange={(e) => setDueDay(e.target.value)}
                className="w-full rounded-lg bg-[#050505] border border-white/10 px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-white/20"
                placeholder="1–31"
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">
                Frequência
              </label>
              <div className="flex gap-2">
                {RECURRENCE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFrequency(opt.value)}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      frequency === opt.value
                        ? "bg-primary-dim text-primary border border-primary/50"
                        : "bg-white/5 text-text-secondary border border-white/10"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Start Date + End Date (2 columns) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm text-text-secondary mb-1">
                Data Inicial
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg bg-[#050505] border border-white/10 px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-white/20"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm text-text-secondary mb-1">
                Data Final
              </label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg bg-[#050505] border border-white/10 px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-white/20"
              />
            </div>
          </div>

          {/* Is Active */}
          <div className="flex items-center gap-2">
            <input
              id="isActive"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-white/10 accent-primary"
            />
            <label htmlFor="isActive" className="text-sm text-text-secondary">
              {type === "income" ? "Receita ativa" : "Despesa ativa"}
            </label>
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

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
              {isEdit ? "Salvar Alterações" : labels.createButton}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
