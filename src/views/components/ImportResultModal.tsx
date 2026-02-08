import { CheckCircle2 } from "lucide-react";
import type { ImportResult } from "../../models/entities.ts";

interface ImportResultModalProps {
  open: boolean;
  onClose: () => void;
  result: ImportResult;
}

export function ImportResultModal({ open, onClose, result }: ImportResultModalProps) {
  if (!open) return null;

  const errors = result.errors ?? [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="rounded-xl bg-surface border border-border p-6 w-full max-w-md mx-4">
        <div className="flex flex-col items-center text-center">
          <CheckCircle2 className="h-12 w-12 text-income mb-4" />
          <h2 className="text-lg font-semibold mb-4">Importação Concluída</h2>

          <div className="space-y-2 w-full text-left text-sm">
            <div className="flex items-center gap-2">
              <span className="text-income">&#10003;</span>
              <span>{result.created} transações criadas</span>
            </div>

            {(result.duplicates_skipped ?? 0) > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-text-muted">&#9197;</span>
                <span>{result.duplicates_skipped} duplicatas ignoradas</span>
              </div>
            )}

            {(result.categories_created ?? 0) > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-primary">&#127991;</span>
                <span>{result.categories_created} categorias novas criadas</span>
              </div>
            )}

            {errors.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center gap-2 text-danger">
                  <span>&#9888;</span>
                  <span>{errors.length} erros</span>
                </div>
                <ul className="mt-1 ml-6 list-disc text-xs text-text-muted space-y-1">
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 rounded-lg bg-primary hover:bg-primary-hover text-background font-semibold px-6 py-2.5 text-sm transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
