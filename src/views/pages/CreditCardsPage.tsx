import { useState } from "react";
import { CreditCard, Plus, Pencil, Trash2, RefreshCw } from "lucide-react";
import { useCreditCardsViewModel } from "../../viewmodels/credit-cards.viewmodel.ts";
import { CreditCardFormModal } from "../components/CreditCardFormModal.tsx";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal.tsx";
import { CreditCardVisual } from "../components/CreditCardVisual.tsx";
import { formatCurrency } from "../../utils/currency.ts";
import type { CreditCard as CreditCardEntity } from "../../models/entities.ts";
import type {
  CreateCreditCardRequest,
  UpdateCreditCardRequest,
} from "../../models/dtos.ts";

export function CreditCardsPage() {
  const {
    cards,
    loading,
    saving,
    error,
    loadCards,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useCreditCardsViewModel();

  const [formOpen, setFormOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCardEntity | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<CreditCardEntity | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => {
    setEditingCard(undefined);
    setFormOpen(true);
  };

  const openEdit = (card: CreditCardEntity) => {
    setEditingCard(card);
    setFormOpen(true);
  };

  const handleFormSubmit = async (
    data: CreateCreditCardRequest | UpdateCreditCardRequest,
  ) => {
    if (editingCard) {
      await handleUpdate(editingCard.ID, data as UpdateCreditCardRequest);
    } else {
      await handleCreate(data as CreateCreditCardRequest);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await handleDelete(deleteTarget.ID);
      setDeleteTarget(null);
    } catch {
      // error handled by viewmodel
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-primary" />
          Cartões de Crédito
        </h1>
        <button
          onClick={openCreate}
          className="rounded-lg bg-primary hover:bg-primary-hover text-background font-semibold py-2.5 px-4 text-sm transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Cartão
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl bg-surface border border-danger/50 p-4 flex items-center justify-between">
          <p className="text-sm text-danger">{error}</p>
          <button
            onClick={loadCards}
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-light transition-colors flex items-center gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Tentar novamente
          </button>
        </div>
      )}

      {/* Empty state */}
      {!error && cards.length === 0 && (
        <div className="rounded-xl bg-surface border border-border p-12 flex flex-col items-center justify-center text-center">
          <CreditCard className="h-12 w-12 text-text-muted mb-4" />
          <p className="text-text-muted text-sm">
            Nenhum cartão cadastrado. Crie seu primeiro cartão para começar!
          </p>
        </div>
      )}

      {/* Cards grid */}
      {cards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.ID}
              className="rounded-xl bg-surface border border-border p-5 flex flex-col gap-4"
            >
              <CreditCardVisual card={card} spent={0} />

              <div className="flex items-center gap-2">
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    card.IsActive
                      ? "bg-income/15 text-income"
                      : "bg-text-muted/15 text-text-muted"
                  }`}
                >
                  {card.IsActive ? "Ativo" : "Inativo"}
                </span>
              </div>

              <div className="text-sm text-text-secondary space-y-1">
                <p>
                  Limite:{" "}
                  <span className="text-text-primary font-medium">
                    {formatCurrency(card.CreditLimit)}
                  </span>
                </p>
                <p>
                  Fechamento: dia{" "}
                  <span className="text-text-primary font-medium">
                    {card.CloseDay}
                  </span>{" "}
                  &middot; Vencimento: dia{" "}
                  <span className="text-text-primary font-medium">
                    {card.DueDay}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-1 mt-auto pt-2 border-t border-border">
                <button
                  onClick={() => openEdit(card)}
                  className="rounded-lg p-2 text-text-muted hover:text-primary hover:bg-surface-light transition-colors"
                  title="Editar"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(card)}
                  className="rounded-lg p-2 text-text-muted hover:text-danger hover:bg-surface-light transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {formOpen && (
        <CreditCardFormModal
          key={editingCard?.ID ?? "new"}
          onClose={() => setFormOpen(false)}
          onSubmit={handleFormSubmit}
          card={editingCard}
          saving={saving}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Excluir Cartão"
        message={`Tem certeza que deseja excluir o cartão "${deleteTarget?.Name}"? Esta ação não pode ser desfeita.`}
        loading={deleting}
      />
    </div>
  );
}
