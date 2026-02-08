import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import type { BankAccount } from "../../models/entities.ts";
import type { CreateAccountRequest, UpdateAccountRequest } from "../../models/dtos.ts";
import type { AccountType } from "../../models/enums.ts";

interface AccountFormModalProps {
  onClose: () => void;
  onSubmit: (data: CreateAccountRequest | UpdateAccountRequest) => Promise<void>;
  account?: BankAccount;
  saving: boolean;
}

export function AccountFormModal({
  onClose,
  onSubmit,
  account,
  saving,
}: AccountFormModalProps) {
  const isEdit = !!account;

  const [accountType, setAccountType] = useState<AccountType>(account?.AccountType ?? "checking");
  const [bankName, setBankName] = useState(account?.BankName ?? "");
  const [name, setName] = useState(account?.Name ?? "");
  const [balance, setBalance] = useState(account?.Balance ?? "0");
  const [isActive, setIsActive] = useState(account?.IsActive ?? true);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!bankName.trim()) {
      setError("Nome do banco é obrigatório.");
      return;
    }

    const balanceNum = parseFloat(balance);
    if (isNaN(balanceNum)) {
      setError("Saldo deve ser um número válido.");
      return;
    }

    if (accountType === "savings" && balanceNum < 0) {
      setError("Contas poupança não permitem saldo negativo.");
      return;
    }

    try {
      if (isEdit) {
        const data: UpdateAccountRequest = {
          name: name.trim(),
          bank_name: bankName.trim(),
          balance: balance,
          is_active: isActive,
        };
        await onSubmit(data);
      } else {
        const data: CreateAccountRequest = {
          account_type: accountType,
          name: name.trim(),
          bank_name: bankName.trim(),
          balance: balance,
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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="rounded-2xl glass-strong p-6 w-full max-w-md mx-4 shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
        <h2 className="text-lg font-semibold mb-4">
          {isEdit ? "Editar Conta" : "Nova Conta"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="accountType" className="block text-sm text-text-secondary mb-1">
              Tipo da Conta
            </label>
            <select
              id="accountType"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value as AccountType)}
              disabled={isEdit}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary/50 disabled:opacity-50"
            >
              <option value="checking">Corrente</option>
              <option value="savings">Poupança</option>
            </select>
          </div>

          <div>
            <label htmlFor="bankName" className="block text-sm text-text-secondary mb-1">
              Nome do Banco
            </label>
            <input
              id="bankName"
              type="text"
              required
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/50"
              placeholder="Ex: Nubank"
            />
          </div>

          <div>
            <label htmlFor="accountName" className="block text-sm text-text-secondary mb-1">
              Nome da Conta
            </label>
            <input
              id="accountName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/50"
              placeholder="Se vazio, usa o nome do banco"
            />
          </div>

          <div>
            <label htmlFor="balance" className="block text-sm text-text-secondary mb-1">
              {isEdit ? "Saldo" : "Saldo Inicial"}
            </label>
            <input
              id="balance"
              type="number"
              step="0.01"
              required
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/50"
              placeholder="0.00"
            />
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
              <label htmlFor="isActive" className="text-sm text-text-secondary">
                Conta ativa
              </label>
            </div>
          )}

          {error && (
            <p className="text-sm text-danger">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-text-secondary hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary hover:bg-primary-hover text-background font-semibold px-4 py-2.5 text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "Salvar Alterações" : "Criar Conta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
