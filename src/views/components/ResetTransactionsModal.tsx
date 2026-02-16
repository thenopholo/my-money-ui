import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

interface ResetTransactionsModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

export function ResetTransactionsModal({
  open,
  onClose,
  onConfirm,
  loading,
}: ResetTransactionsModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const isConfirmed = confirmText === "RESETAR";

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="rounded-2xl bg-surface ring-1 ring-white/10 p-6 w-full max-w-md mx-4 shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-full bg-danger/20 p-2">
            <AlertTriangle className="h-5 w-5 text-danger" />
          </div>
          <h2 className="text-lg font-semibold">Resetar Todas as Transações</h2>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-sm text-text-muted">
            Esta ação é <span className="text-danger font-semibold">irreversível</span> e irá:
          </p>
          <ul className="text-sm text-text-muted space-y-1 list-disc list-inside">
            <li>Apagar todas as transações bancárias</li>
            <li>Zerar os saldos de todas as contas</li>
          </ul>
          <p className="text-sm text-text-muted">
            Digite <span className="font-mono font-semibold text-danger">RESETAR</span> para confirmar:
          </p>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Digite RESETAR"
            className="w-full rounded-lg bg-[#050505] border border-white/10 px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-white/20"
            autoFocus
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-full border border-white/10 px-4 py-2.5 text-sm text-text-secondary hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!isConfirmed || loading}
            className="rounded-lg bg-danger hover:bg-danger-hover text-white font-semibold px-4 py-2.5 text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Resetar
          </button>
        </div>
      </div>
    </div>
  );
}
