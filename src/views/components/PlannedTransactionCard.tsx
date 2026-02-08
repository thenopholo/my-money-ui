import { Calendar, Clock, Pencil, Repeat, Trash2, Wallet } from "lucide-react";
import { CategoryBadge } from "./CategoryBadge.tsx";
import { formatCurrency } from "../../utils/currency.ts";
import { formatDate } from "../../utils/date.ts";
import { RECURRENCE_LABELS } from "../../utils/recurrence.ts";
import type { Category } from "../../models/entities.ts";
import type { Recurrence } from "../../models/enums.ts";

interface PlannedTransactionCardProps {
  description: string;
  amount: string;
  dueDay: number;
  frequency: Recurrence;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  accountName: string;
  category: Category | null;
  type: "income" | "expense";
  onEdit: () => void;
  onDelete: () => void;
}

export function PlannedTransactionCard({
  description,
  amount,
  dueDay,
  frequency,
  isActive,
  startDate,
  endDate,
  accountName,
  category,
  type,
  onEdit,
  onDelete,
}: PlannedTransactionCardProps) {
  const FrequencyIcon = frequency === "once" ? Clock : Repeat;

  return (
    <div
      className={`rounded-xl glass p-5 shadow-lg flex flex-col gap-3 border-l-4 ${
        type === "income" ? "border-l-income" : "border-l-expense"
      }`}
    >
      {/* Header: description + actions */}
      <div className="flex items-start justify-between">
        <p className="text-base font-semibold truncate">{description}</p>
        <div className="flex items-center gap-1 ml-2 shrink-0">
          <button
            onClick={onEdit}
            className="rounded-lg p-2 text-text-muted hover:text-primary hover:bg-white/5 transition-colors"
            title="Editar"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="rounded-lg p-2 text-text-muted hover:text-danger hover:bg-white/5 transition-colors"
            title="Excluir"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Amount + Frequency */}
      <div className="flex items-center gap-3">
        <span
          className={`text-lg font-bold ${
            type === "income" ? "text-income" : "text-expense"
          }`}
        >
          {formatCurrency(amount)}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-medium text-text-secondary">
          <FrequencyIcon className="h-3 w-3" />
          {RECURRENCE_LABELS[frequency]}
        </span>
      </div>

      {/* Details: category, due day, account */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted">
        {category && <CategoryBadge category={category} size="sm" />}
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          Dia {dueDay}
        </span>
        <span className="flex items-center gap-1">
          <Wallet className="h-3.5 w-3.5" />
          {accountName}
        </span>
      </div>

      {/* Period + Status */}
      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>
          {startDate || endDate
            ? `${formatDate(startDate)} → ${formatDate(endDate)}`
            : "Sem período definido"}
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            isActive
              ? "bg-income/15 text-income"
              : "bg-text-muted/15 text-text-muted"
          }`}
        >
          {isActive ? "Ativo" : "Inativo"}
        </span>
      </div>
    </div>
  );
}
