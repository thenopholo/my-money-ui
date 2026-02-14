import { useState } from "react";
import { Wallet, Plus, Pencil, Trash2, RefreshCw } from "lucide-react";
import { useAccountsViewModel } from "../../viewmodels/accounts.viewmodel.ts";
import { AccountFormModal } from "../components/AccountFormModal.tsx";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal.tsx";
import { formatCurrency } from "../../utils/currency.ts";
import type { BankAccount } from "../../models/entities.ts";
import type { AccountType } from "../../models/enums.ts";
import type { CreateAccountRequest, UpdateAccountRequest } from "../../models/dtos.ts";

const accountTypeLabels: Record<AccountType, string> = {
  checking: "Corrente",
  savings: "Poupança",
};

export function AccountsPage() {
  const {
    accounts,
    loading,
    saving,
    error,
    loadAccounts,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useAccountsViewModel();

  const [formOpen, setFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<BankAccount | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => {
    setEditingAccount(undefined);
    setFormOpen(true);
  };

  const openEdit = (account: BankAccount) => {
    setEditingAccount(account);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: CreateAccountRequest | UpdateAccountRequest) => {
    if (editingAccount) {
      await handleUpdate(editingAccount.ID, data as UpdateAccountRequest);
    } else {
      await handleCreate(data as CreateAccountRequest);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await handleDelete(deleteTarget.ID);
      setDeleteTarget(null);
    } catch {
      // error is re-thrown from viewmodel, handled in the modal UX
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Wallet className="h-6 w-6 text-primary" />
          Contas
        </h1>
        <button
          onClick={openCreate}
          className="rounded-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 btn-glow text-white font-semibold py-2.5 px-4 text-sm transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nova Conta
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl card-luminous border border-danger/50 p-4 flex items-center justify-between">
          <p className="text-sm text-danger">{error}</p>
          <button
            onClick={loadAccounts}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-text-secondary hover:bg-white/5 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Tentar novamente
          </button>
        </div>
      )}

      {/* Empty state */}
      {!error && accounts.length === 0 && (
        <div className="rounded-xl card-luminous p-12 flex flex-col items-center justify-center text-center">
          <Wallet className="h-12 w-12 text-text-muted mb-4" />
          <p className="text-text-muted text-sm">
            Nenhuma conta cadastrada. Crie sua primeira conta para começar!
          </p>
        </div>
      )}

      {/* Accounts list */}
      {accounts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <div
              key={account.ID}
              className="rounded-xl card-luminous p-6 flex flex-col gap-4"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold truncate">{account.Name}</p>
                  <p className="text-sm text-text-muted">{account.BankName}</p>
                </div>
                <div className="flex items-center gap-1 ml-2 shrink-0">
                  <button
                    onClick={() => openEdit(account)}
                    className="rounded-lg p-2 text-text-muted hover:text-primary hover:bg-white/5 transition-colors"
                    title="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(account)}
                    className="rounded-lg p-2 text-text-muted hover:text-danger hover:bg-white/5 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    account.AccountType === "checking"
                      ? "bg-primary/15 text-primary"
                      : "bg-income/15 text-income"
                  }`}
                >
                  {accountTypeLabels[account.AccountType]}
                </span>
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    account.IsActive
                      ? "bg-income/15 text-income"
                      : "bg-text-muted/15 text-text-muted"
                  }`}
                >
                  {account.IsActive ? "Ativa" : "Inativa"}
                </span>
              </div>

              <p className="text-lg font-bold text-primary mt-auto">
                {formatCurrency(account.Balance)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {formOpen && (
        <AccountFormModal
          key={editingAccount?.ID ?? "new"}
          onClose={() => setFormOpen(false)}
          onSubmit={handleFormSubmit}
          account={editingAccount}
          saving={saving}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Excluir Conta"
        message={`Tem certeza que deseja excluir a conta "${deleteTarget?.Name}"? Esta ação não pode ser desfeita.`}
        loading={deleting}
      />
    </div>
  );
}
