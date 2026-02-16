import { useState } from "react";
import { AlertTriangle, ArrowLeftRight, FileUp, Loader2, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useTransactionsViewModel } from "../../viewmodels/transactions.viewmodel.ts";
import { TransactionFormModal } from "../components/TransactionFormModal.tsx";
import { ImportCSVModal } from "../components/ImportCSVModal.tsx";
import { ImportPreviewModal } from "../components/ImportPreviewModal.tsx";
import { ImportResultModal } from "../components/ImportResultModal.tsx";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal.tsx";
import { ResetTransactionsModal } from "../components/ResetTransactionsModal.tsx";
import { formatCurrency } from "../../utils/currency.ts";
import { formatDate } from "../../utils/date.ts";
import type { Transaction } from "../../models/entities.ts";
import type { CreateTransactionRequest, UpdateTransactionRequest } from "../../models/dtos.ts";

export function TransactionsPage() {
  const vm = useTransactionsViewModel();

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleOpenCreate = () => {
    setEditingTransaction(undefined);
    setShowFormModal(true);
  };

  const handleOpenEdit = (tx: Transaction) => {
    setEditingTransaction(tx);
    setShowFormModal(true);
  };

  const handleCloseForm = () => {
    setShowFormModal(false);
    setEditingTransaction(undefined);
  };

  const handleFormSubmit = async (data: CreateTransactionRequest | UpdateTransactionRequest) => {
    if (editingTransaction) {
      await vm.handleUpdate(editingTransaction.ID, data as UpdateTransactionRequest);
    } else {
      await vm.handleCreate(data as CreateTransactionRequest);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    await vm.handleDelete(deletingId);
    setDeletingId(null);
  };

  const handleImportResultClose = () => {
    vm.resetImport();
    vm.loadTransactions();
  };

  const getAccountName = (accountId: string) =>
    vm.accounts.find((a) => a.ID === accountId)?.Name ?? "—";

  const getCategoryName = (categoryId: string) =>
    vm.categories.find((c) => c.ID === categoryId)?.Name ?? "—";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <ArrowLeftRight className="h-6 w-6 text-primary" />
          Transações
        </h1>
        <div className="flex gap-2">
          <button
            onClick={handleOpenCreate}
            className="rounded-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 btn-glow text-white font-semibold px-4 py-2 text-sm transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nova Transação
          </button>
          <button
            onClick={() => vm.setImportStep("upload")}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-text-secondary hover:bg-white/5 transition-colors flex items-center gap-2"
          >
            <FileUp className="h-4 w-4" />
            Importar CSV
          </button>
          <button
            onClick={() => setShowResetModal(true)}
            className="rounded-lg border border-danger/30 px-4 py-2 text-sm text-danger hover:bg-danger/10 transition-colors flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            Resetar Tudo
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl card-luminous p-4">
          <p className="text-xs text-text-muted mb-1">Receitas</p>
          <p className="text-lg font-semibold text-income">+ {formatCurrency(vm.totalIncome)}</p>
        </div>
        <div className="rounded-xl card-luminous p-4">
          <p className="text-xs text-text-muted mb-1">Despesas</p>
          <p className="text-lg font-semibold text-expense">- {formatCurrency(vm.totalExpense)}</p>
        </div>
        <div className="rounded-xl card-luminous p-4">
          <p className="text-xs text-text-muted mb-1">Saldo</p>
          <p className={`text-lg font-semibold ${vm.totalIncome - vm.totalExpense >= 0 ? "text-income" : "text-expense"}`}>
            {formatCurrency(vm.totalIncome - vm.totalExpense)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={vm.selectedAccountId}
          onChange={(e) => vm.setSelectedAccountId(e.target.value)}
          className="rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-primary/50"
        >
          <option value="">Todas as contas</option>
          {vm.accounts.map((a) => (
            <option key={a.ID} value={a.ID}>
              {a.Name || a.BankName}
            </option>
          ))}
        </select>

        <div className="flex rounded-lg border border-white/10 overflow-hidden">
          {(["all", "income", "expense"] as const).map((type) => (
            <button
              key={type}
              onClick={() => vm.setFilterType(type)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                vm.filterType === type
                  ? "bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white"
                  : "bg-white/5 text-text-secondary hover:bg-white/10"
              }`}
            >
              {type === "all" ? "Todas" : type === "income" ? "Receitas" : "Despesas"}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {vm.error && (
        <div className="rounded-xl bg-danger/10 border border-danger/30 p-4 flex items-center justify-between">
          <p className="text-sm text-danger">{vm.error}</p>
          <button
            onClick={() => vm.loadTransactions()}
            className="text-sm text-danger hover:underline flex items-center gap-1"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Tentar novamente
          </button>
        </div>
      )}

      {/* Loading */}
      {vm.loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Empty State */}
      {!vm.loading && !vm.error && vm.filteredTransactions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ArrowLeftRight className="h-12 w-12 text-text-muted mb-3" />
          <p className="text-text-secondary text-sm">
            {vm.transactions.length === 0
              ? "Nenhuma transação encontrada. Crie uma nova ou importe via CSV."
              : "Nenhuma transação encontrada para os filtros selecionados."}
          </p>
        </div>
      )}

      {/* Transactions Table */}
      {!vm.loading && vm.filteredTransactions.length > 0 && (
        <div className="rounded-xl card-luminous overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-text-muted text-left">
                  <th className="px-4 pb-3 pt-4 font-medium">Descrição</th>
                  <th className="px-4 pb-3 pt-4 font-medium">Valor</th>
                  <th className="px-4 pb-3 pt-4 font-medium">Data</th>
                  <th className="px-4 pb-3 pt-4 font-medium">Tipo</th>
                  <th className="px-4 pb-3 pt-4 font-medium">Conta</th>
                  <th className="px-4 pb-3 pt-4 font-medium">Categoria</th>
                  <th className="px-4 pb-3 pt-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {vm.filteredTransactions.map((tx) => (
                  <tr key={tx.ID} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-text-primary">
                      {tx.Description || "Transação"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={tx.TransactionType === "income" ? "text-income font-medium" : "text-expense font-medium"}>
                        {tx.TransactionType === "income" ? "+ " : "- "}
                        {formatCurrency(tx.Amount)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-muted whitespace-nowrap">
                      {formatDate(tx.TransactionDate)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${
                        tx.TransactionType === "income"
                          ? "bg-income/20 text-income"
                          : "bg-expense/20 text-expense"
                      }`}>
                        {tx.TransactionType === "income" ? "Receita" : "Despesa"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {getAccountName(tx.AccountID)}
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {getCategoryName(tx.CategoryID)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(tx)}
                          className="rounded-lg p-1.5 text-text-muted hover:text-primary hover:bg-white/5 transition-colors"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(tx.ID)}
                          className="rounded-lg p-1.5 text-text-muted hover:text-danger hover:bg-white/5 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <TransactionFormModal
        open={showFormModal}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        transaction={editingTransaction}
        accounts={vm.accounts}
        categories={vm.categories}
        saving={vm.saving}
      />

      <ImportCSVModal
        open={vm.importStep === "upload"}
        onClose={() => vm.resetImport()}
        onSubmit={vm.handleImportPreview}
        accounts={vm.accounts}
        creditCards={vm.creditCards}
        importing={vm.importing}
        error={vm.importError}
      />

      {vm.importStep === "preview" && vm.previewData && (
        <ImportPreviewModal
          open
          onClose={() => vm.resetImport()}
          onConfirm={vm.handleImportConfirm}
          previewData={vm.previewData}
          categories={vm.categories}
          importing={vm.importing}
          error={vm.importError}
          onCreateCategory={vm.handleCreateCategory}
          savingCategory={vm.saving}
        />
      )}

      {vm.importStep === "result" && vm.importResult && (
        <ImportResultModal
          open
          onClose={handleImportResultClose}
          result={vm.importResult}
        />
      )}

      <ConfirmDeleteModal
        open={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir Transação"
        message="Tem certeza que deseja excluir esta transação? O saldo da conta será revertido. Esta ação não pode ser desfeita."
        loading={vm.saving}
      />

      <ResetTransactionsModal
        open={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={async () => {
          await vm.handleResetAll();
          setShowResetModal(false);
        }}
        loading={vm.resetting}
      />
    </div>
  );
}
