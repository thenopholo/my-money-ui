import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import type { CreditCard } from "../../models/entities.ts";
import type {
  CreateCreditCardRequest,
  UpdateCreditCardRequest,
} from "../../models/dtos.ts";
import { CreditCardVisual } from "./CreditCardVisual.tsx";

interface CreditCardFormModalProps {
  onClose: () => void;
  onSubmit: (
    data: CreateCreditCardRequest | UpdateCreditCardRequest,
  ) => Promise<void>;
  card?: CreditCard;
  saving: boolean;
}

export function CreditCardFormModal({
  onClose,
  onSubmit,
  card,
  saving,
}: CreditCardFormModalProps) {
  const isEdit = !!card;

  const [name, setName] = useState(card?.Name ?? "");
  const [creditLimit, setCreditLimit] = useState(card?.CreditLimit ?? "");
  const [closeDay, setCloseDay] = useState(card?.CloseDay?.toString() ?? "");
  const [dueDay, setDueDay] = useState(card?.DueDay?.toString() ?? "");
  const [isActive, setIsActive] = useState(card?.IsActive ?? true);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Nome do cartão é obrigatório.");
      return;
    }

    const limitNum = parseFloat(creditLimit);
    if (isNaN(limitNum) || limitNum <= 0) {
      setError("Limite de crédito deve ser positivo.");
      return;
    }

    const closeDayNum = parseInt(closeDay, 10);
    if (isNaN(closeDayNum) || closeDayNum < 1 || closeDayNum > 28) {
      setError("Dia de fechamento deve estar entre 1 e 28.");
      return;
    }

    const dueDayNum = parseInt(dueDay, 10);
    if (isNaN(dueDayNum) || dueDayNum < 1 || dueDayNum > 31) {
      setError("Dia de vencimento deve estar entre 1 e 31.");
      return;
    }

    try {
      if (isEdit) {
        const data: UpdateCreditCardRequest = {
          name: name.trim(),
          credit_limit: creditLimit,
          close_day: closeDayNum,
          due_day: dueDayNum,
          is_active: isActive,
        };
        await onSubmit(data);
      } else {
        const data: CreateCreditCardRequest = {
          name: name.trim(),
          credit_limit: creditLimit,
          close_day: closeDayNum,
          due_day: dueDayNum,
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

  const previewCard: CreditCard = {
    ID: card?.ID ?? "preview",
    UserID: "",
    Name: name || "Meu Cartão",
    CreditLimit: creditLimit || "0",
    CloseDay: parseInt(closeDay, 10) || 1,
    DueDay: parseInt(dueDay, 10) || 1,
    IsActive: isActive,
    CreatedAt: "",
    UpdatedAt: "",
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="rounded-2xl bg-surface ring-1 ring-white/10 p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
        <h2 className="text-lg font-semibold mb-4">
          {isEdit ? "Editar Cartão" : "Novo Cartão"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="cardName"
              className="block text-sm text-text-secondary mb-1"
            >
              Nome do Cartão
            </label>
            <input
              id="cardName"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg bg-[#050505] border border-white/10 px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-white/20"
              placeholder="Ex: Nubank Visa, Itaú Mastercard"
            />
            <p className="text-xs text-text-muted mt-1">
              Inclua o nome do banco e a bandeira para melhor identificação
              visual.
            </p>
          </div>

          <div>
            <label
              htmlFor="creditLimit"
              className="block text-sm text-text-secondary mb-1"
            >
              Limite de Crédito
            </label>
            <input
              id="creditLimit"
              type="number"
              step="0.01"
              min="0.01"
              required
              value={creditLimit}
              onChange={(e) => setCreditLimit(e.target.value)}
              className="w-full rounded-lg bg-[#050505] border border-white/10 px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-white/20"
              placeholder="0.00"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="closeDay"
                className="block text-sm text-text-secondary mb-1"
              >
                Dia de Fechamento
              </label>
              <input
                id="closeDay"
                type="number"
                min="1"
                max="28"
                required
                value={closeDay}
                onChange={(e) => setCloseDay(e.target.value)}
                className="w-full rounded-lg bg-[#050505] border border-white/10 px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-white/20"
                placeholder="1–28"
              />
            </div>
            <div>
              <label
                htmlFor="dueDay"
                className="block text-sm text-text-secondary mb-1"
              >
                Dia de Vencimento
              </label>
              <input
                id="dueDay"
                type="number"
                min="1"
                max="31"
                required
                value={dueDay}
                onChange={(e) => setDueDay(e.target.value)}
                className="w-full rounded-lg bg-[#050505] border border-white/10 px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-white/20"
                placeholder="1–31"
              />
            </div>
          </div>

          {isEdit && (
            <div className="flex items-center gap-2">
              <input
                id="isActive"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-white/10 accent-primary"
              />
              <label
                htmlFor="isActive"
                className="text-sm text-text-secondary"
              >
                Cartão ativo
              </label>
            </div>
          )}

          {/* Card Preview */}
          <div>
            <p className="text-xs text-text-muted mb-2">Preview</p>
            <CreditCardVisual card={previewCard} spent={0} />
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
              {isEdit ? "Salvar Alterações" : "Criar Cartão"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
