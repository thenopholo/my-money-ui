import { useState } from "react";
import {
  TrendingUp,
  Plus,
  RefreshCw,
  DollarSign,
  ListFilter,
  Clock,
  Repeat,
  CalendarDays,
} from "lucide-react";
import { usePlannedIncomesViewModel } from "../../viewmodels/planned-incomes.viewmodel.ts";
import { PlannedTransactionCard } from "../components/PlannedTransactionCard.tsx";
import { PlannedTransactionFormModal } from "../components/PlannedTransactionFormModal.tsx";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal.tsx";
import { formatCurrency } from "../../utils/currency.ts";
import type { PlannedIncome } from "../../models/entities.ts";
import type {
  CreatePlannedIncomeRequest,
  UpdatePlannedIncomeRequest,
} from "../../models/dtos.ts";
import type { Recurrence } from "../../models/enums.ts";

const FREQUENCY_TABS: { value: "all" | Recurrence; label: string; icon: typeof ListFilter }[] = [
  { value: "all", label: "Todas", icon: ListFilter },
  { value: "once", label: "Única", icon: Clock },
  { value: "monthly", label: "Mensal", icon: Repeat },
  { value: "yearly", label: "Anual", icon: CalendarDays },
];

const STATUS_TABS: { value: "all" | "active" | "inactive"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Ativos" },
  { value: "inactive", label: "Inativos" },
];

export function PlannedIncomesPage() {
  const {
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
  } = usePlannedIncomesViewModel();

  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PlannedIncome | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<PlannedIncome | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => {
    setEditingItem(undefined);
    setFormOpen(true);
  };

  const openEdit = (item: PlannedIncome) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: CreatePlannedIncomeRequest | UpdatePlannedIncomeRequest) => {
    if (editingItem) {
      await handleUpdate(editingItem.ID, data as UpdatePlannedIncomeRequest);
    } else {
      await handleCreate(data as CreatePlannedIncomeRequest);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await handleDelete(deleteTarget.ID);
      setDeleteTarget(null);
    } catch {
      // error re-thrown from viewmodel
    } finally {
      setDeleting(false);
    }
  };

  const getAccountName = (accountId: string) => {
    const acc = accounts.find((a) => a.ID === accountId);
    return acc ? `${acc.Name} — ${acc.BankName}` : "—";
  };

  const getCategory = (categoryId: string) => {
    return categories.find((c) => c.ID === categoryId) ?? null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  const hasFilters = frequencyFilter !== "all" || activeFilter !== "all";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-income" />
          Receitas Planejadas
        </h1>
        <button
          onClick={openCreate}
          className="rounded-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 btn-glow text-white font-semibold py-2.5 px-4 text-sm transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nova Receita
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl card-luminous border border-danger/50 p-4 flex items-center justify-between">
          <p className="text-sm text-danger">{error}</p>
          <button
            onClick={loadData}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-text-secondary hover:bg-white/5 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Tentar novamente
          </button>
        </div>
      )}

      {/* Summary bar */}
      {!error && incomes.length > 0 && (
        <div className="rounded-xl card-luminous p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-income" />
              <div>
                <p className="text-xs text-text-muted">Total Ativo</p>
                <p className="text-lg font-bold text-income">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <p className="text-xs text-text-muted">Itens Ativos</p>
              <p className="text-lg font-bold">{activeCount}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      {!error && incomes.length > 0 && (
        <div className="flex flex-wrap items-center gap-4">
          {/* Frequency filter */}
          <div className="flex items-center gap-1">
            {FREQUENCY_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.value}
                  onClick={() => setFrequencyFilter(tab.value)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    frequencyFilter === tab.value
                      ? "bg-primary-dim text-primary"
                      : "text-text-secondary hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeFilter === tab.value
                    ? "bg-primary-dim text-primary"
                    : "text-text-secondary hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!error && incomes.length === 0 && (
        <div className="rounded-xl card-luminous p-12 flex flex-col items-center justify-center text-center">
          <TrendingUp className="h-12 w-12 text-text-muted mb-4" />
          <p className="text-text-muted text-sm">
            Nenhuma receita planejada cadastrada. Crie sua primeira receita para começar!
          </p>
        </div>
      )}

      {/* Filtered empty state */}
      {!error && incomes.length > 0 && filteredIncomes.length === 0 && hasFilters && (
        <div className="rounded-xl card-luminous p-12 flex flex-col items-center justify-center text-center">
          <TrendingUp className="h-12 w-12 text-text-muted mb-4" />
          <p className="text-text-muted text-sm">
            Nenhuma receita planejada encontrada com os filtros selecionados.
          </p>
        </div>
      )}

      {/* List */}
      {filteredIncomes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIncomes.map((item) => (
            <PlannedTransactionCard
              key={item.ID}
              description={item.Description}
              amount={item.Amount}
              dueDay={item.DueDay}
              frequency={item.Frequency}
              isActive={item.IsActive}
              startDate={item.StartDate}
              endDate={item.EndDate}
              accountName={getAccountName(item.AccountID)}
              category={getCategory(item.CategoryID)}
              type="income"
              onEdit={() => openEdit(item)}
              onDelete={() => setDeleteTarget(item)}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      {formOpen && (
        <PlannedTransactionFormModal
          key={editingItem?.ID ?? "new"}
          type="income"
          onClose={() => setFormOpen(false)}
          onSubmit={handleFormSubmit}
          item={editingItem}
          saving={saving}
          accounts={accounts}
          categories={categories}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Excluir Receita Planejada"
        message={`Tem certeza que deseja excluir a receita "${deleteTarget?.Description}"? Esta ação não pode ser desfeita.`}
        loading={deleting}
      />
    </div>
  );
}
