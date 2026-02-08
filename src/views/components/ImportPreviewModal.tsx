import { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import type { Category, ImportPreviewResponse } from "../../models/entities.ts";
import type { ImportConfirmRequest } from "../../models/dtos.ts";
import type { CategoryType, TransactionType } from "../../models/enums.ts";
import { formatCurrency } from "../../utils/currency.ts";
import { formatDate } from "../../utils/date.ts";

interface EditableTransaction {
  selected: boolean;
  description: string;
  original_description: string;
  amount: number;
  transaction_date: string;
  transaction_type: TransactionType;
  category_id: string | null;
  suggested_category_name: string | null;
  suggested_category_type: CategoryType | null;
  useExistingCategory: boolean;
  confidence: number;
  installments?: number | null;
  current_installment?: number | null;
}

interface ImportPreviewModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (request: ImportConfirmRequest) => Promise<void>;
  previewData: ImportPreviewResponse;
  categories: Category[];
  importing: boolean;
  error: string;
}

function ConfidenceBadge({ confidence }: { confidence: number }) {
  const color = confidence >= 0.8
    ? "bg-green-500"
    : confidence >= 0.5
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <span className="flex items-center gap-1.5" title={`${(confidence * 100).toFixed(0)}% confiança`}>
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <span className="text-xs text-text-muted">{(confidence * 100).toFixed(0)}%</span>
    </span>
  );
}

export function ImportPreviewModal({
  open,
  onClose,
  onConfirm,
  previewData,
  categories,
  importing,
  error,
}: ImportPreviewModalProps) {
  const transactions = previewData.transactions ?? [];
  const suggestedCategories = previewData.new_categories_suggested ?? [];

  const [editableTxs, setEditableTxs] = useState<EditableTransaction[]>(() =>
    transactions.map((tx) => ({
      selected: true,
      description: tx.cleaned_description,
      original_description: tx.original_description,
      amount: tx.amount,
      transaction_date: tx.transaction_date,
      transaction_type: tx.transaction_type,
      category_id: tx.category_id,
      suggested_category_name: tx.suggested_category_name,
      suggested_category_type: tx.suggested_category_type,
      useExistingCategory: !!tx.category_id,
      confidence: tx.confidence,
      installments: tx.installments,
      current_installment: tx.current_installment,
    })),
  );

  const selectedCount = useMemo(() => editableTxs.filter((tx) => tx.selected).length, [editableTxs]);

  const updateTx = (index: number, updates: Partial<EditableTransaction>) => {
    setEditableTxs((prev) => prev.map((tx, i) => (i === index ? { ...tx, ...updates } : tx)));
  };

  const handleCategoryChange = (index: number, value: string) => {
    if (value.startsWith("new:")) {
      const suggestedName = value.slice(4);
      const suggested = suggestedCategories.find((s) => s.name === suggestedName);
      updateTx(index, {
        useExistingCategory: false,
        category_id: null,
        suggested_category_name: suggestedName,
        suggested_category_type: suggested?.category_type ?? null,
      });
    } else {
      updateTx(index, {
        useExistingCategory: true,
        category_id: value,
        suggested_category_name: null,
        suggested_category_type: null,
      });
    }
  };

  const getCategoryValue = (tx: EditableTransaction): string => {
    if (tx.useExistingCategory && tx.category_id) return tx.category_id;
    if (tx.suggested_category_name) return `new:${tx.suggested_category_name}`;
    return "";
  };

  const handleConfirm = async () => {
    const request: ImportConfirmRequest = {
      import_type: previewData.import_type,
      target_id: previewData.target_id,
      transactions: editableTxs
        .filter((tx) => tx.selected)
        .map((tx) => ({
          description: tx.description,
          amount: tx.amount,
          transaction_date: tx.transaction_date,
          transaction_type: tx.transaction_type,
          category_id: tx.useExistingCategory ? tx.category_id : null,
          new_category_name: tx.useExistingCategory ? null : tx.suggested_category_name,
          new_category_type: tx.useExistingCategory ? null : tx.suggested_category_type,
          installments: tx.installments ?? null,
          current_installment: tx.current_installment ?? null,
        })),
    };
    await onConfirm(request);
  };

  const toggleAll = () => {
    const allSelected = editableTxs.every((tx) => tx.selected);
    setEditableTxs((prev) => prev.map((tx) => ({ ...tx, selected: !allSelected })));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="rounded-2xl glass-strong p-6 w-full max-w-6xl mx-4 max-h-[90vh] flex flex-col shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Revisar Transações Importadas</h2>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-text-muted">
            <span>{previewData.total_transactions} transações</span>
            <span>|</span>
            <span>Total: {formatCurrency(previewData.total_amount)}</span>
            {suggestedCategories.length > 0 && (
              <>
                <span>|</span>
                <span className="text-primary">
                  {suggestedCategories.length} categorias novas sugeridas pela IA
                </span>
              </>
            )}
          </div>
        </div>

        <div className="overflow-auto flex-1 min-h-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-text-muted text-left">
                <th className="pb-3 pr-2">
                  <input
                    type="checkbox"
                    checked={editableTxs.every((tx) => tx.selected)}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-white/10 accent-primary"
                  />
                </th>
                <th className="pb-3 font-medium">Descrição</th>
                <th className="pb-3 font-medium">Valor</th>
                <th className="pb-3 font-medium">Data</th>
                <th className="pb-3 font-medium">Tipo</th>
                <th className="pb-3 font-medium">Categoria</th>
                <th className="pb-3 font-medium">Confiança</th>
                {previewData.import_type === "credit_card" && (
                  <th className="pb-3 font-medium">Parcelas</th>
                )}
              </tr>
            </thead>
            <tbody>
              {editableTxs.map((tx, i) => {
                const typeCategories = categories.filter((c) => c.CategoryType === tx.transaction_type);
                const suggestedForType = suggestedCategories.filter(
                  (s) => s.category_type === tx.transaction_type,
                );

                return (
                  <tr key={i} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-2.5 pr-2">
                      <input
                        type="checkbox"
                        checked={tx.selected}
                        onChange={(e) => updateTx(i, { selected: e.target.checked })}
                        className="h-4 w-4 rounded border-white/10 accent-primary"
                      />
                    </td>
                    <td className="py-2.5 pr-2">
                      <input
                        type="text"
                        value={tx.description}
                        onChange={(e) => updateTx(i, { description: e.target.value })}
                        title={tx.original_description}
                        className="w-full rounded bg-white/5 border border-white/10 px-2 py-1 text-sm text-text-primary focus:outline-none focus:border-primary/50"
                      />
                    </td>
                    <td className="py-2.5 pr-2 whitespace-nowrap">
                      <span className={tx.transaction_type === "income" ? "text-income" : "text-expense"}>
                        {tx.transaction_type === "expense" ? "- " : "+ "}
                        {formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td className="py-2.5 pr-2 whitespace-nowrap">
                      {formatDate(tx.transaction_date)}
                    </td>
                    <td className="py-2.5 pr-2">
                      <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${
                        tx.transaction_type === "income"
                          ? "bg-income/20 text-income"
                          : "bg-expense/20 text-expense"
                      }`}>
                        {tx.transaction_type === "income" ? "Receita" : "Despesa"}
                      </span>
                    </td>
                    <td className="py-2.5 pr-2">
                      <select
                        value={getCategoryValue(tx)}
                        onChange={(e) => handleCategoryChange(i, e.target.value)}
                        className="w-full rounded bg-white/5 border border-white/10 px-2 py-1 text-sm text-text-primary focus:outline-none focus:border-primary/50"
                      >
                        <option value="">Selecionar categoria</option>
                        {typeCategories.map((c) => (
                          <option key={c.ID} value={c.ID}>{c.Name}</option>
                        ))}
                        {suggestedForType.length > 0 && (
                          <optgroup label="Sugeridas pela IA (novas)">
                            {suggestedForType.map((s) => (
                              <option key={`new:${s.name}`} value={`new:${s.name}`}>
                                {s.name} (nova)
                              </option>
                            ))}
                          </optgroup>
                        )}
                      </select>
                    </td>
                    <td className="py-2.5 pr-2">
                      <ConfidenceBadge confidence={tx.confidence} />
                    </td>
                    {previewData.import_type === "credit_card" && (
                      <td className="py-2.5 whitespace-nowrap">
                        {tx.installments ? `${tx.current_installment}/${tx.installments}` : "—"}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {error && <p className="text-sm text-danger mt-3">{error}</p>}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <span className="text-sm text-text-muted">
            {selectedCount} de {editableTxs.length} transações selecionadas
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={importing}
              className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-text-secondary hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={importing || selectedCount === 0}
              className="rounded-lg bg-primary hover:bg-primary-hover text-background font-semibold px-4 py-2.5 text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {importing && <Loader2 className="h-4 w-4 animate-spin" />}
              Confirmar Importação
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
