import React, { useRef, useState } from "react";
import { FileSpreadsheet, Loader2, Upload } from "lucide-react";
import type { BankAccount, CreditCard } from "../../models/entities.ts";
import type { ImportType } from "../../models/enums.ts";

interface ImportCSVModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (file: File, importType: ImportType, targetId: string) => Promise<void>;
  accounts: BankAccount[];
  creditCards: CreditCard[];
  importing: boolean;
  error: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function ImportCSVModal({
  open,
  onClose,
  onSubmit,
  accounts,
  creditCards,
  importing,
  error,
}: ImportCSVModalProps) {
  const [importType, setImportType] = useState<ImportType>("bank_account");
  const [targetId, setTargetId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFileError("");
    if (!selectedFile.name.endsWith(".csv")) {
      setFileError("Apenas arquivos .csv são aceitos.");
      return;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      setFileError("Arquivo muito grande (máx. 5MB).");
      return;
    }
    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !targetId) return;
    await onSubmit(file, importType, targetId);
  };

  const handleTypeChange = (type: ImportType) => {
    setImportType(type);
    setTargetId("");
  };

  const targets = importType === "bank_account"
    ? accounts.filter((a) => a.IsActive)
    : creditCards.filter((c) => c.IsActive);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="rounded-2xl glass-strong p-6 w-full max-w-lg mx-4 shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
        <h2 className="text-lg font-semibold mb-4">Importar Transações via CSV</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-2">Tipo de Importação</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange("bank_account")}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  importType === "bank_account"
                    ? "bg-primary text-background"
                    : "bg-white/5 border border-white/10 text-text-secondary hover:bg-white/5"
                }`}
              >
                Extrato Bancário
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange("credit_card")}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  importType === "credit_card"
                    ? "bg-primary text-background"
                    : "bg-white/5 border border-white/10 text-text-secondary hover:bg-white/5"
                }`}
              >
                Fatura de Cartão
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="importTarget" className="block text-sm text-text-secondary mb-1">
              {importType === "bank_account" ? "Conta Bancária" : "Cartão de Crédito"}
            </label>
            <select
              id="importTarget"
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary"
            >
              <option value="">
                {importType === "bank_account" ? "Selecione uma conta" : "Selecione um cartão"}
              </option>
              {targets.map((t) => (
                <option key={t.ID} value={t.ID}>
                  {t.Name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-2">Arquivo CSV</label>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                dragOver ? "border-primary bg-primary/5" : "border-white/10 hover:border-primary"
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileSpreadsheet className="h-8 w-8 text-primary" />
                  <div className="text-left">
                    <p className="text-sm text-text-primary font-medium">{file.name}</p>
                    <p className="text-xs text-text-muted">{formatFileSize(file.size)}</p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-text-muted mx-auto mb-2" />
                  <p className="text-sm text-text-secondary">Arraste seu CSV aqui</p>
                  <p className="text-xs text-text-muted mt-1">ou clique para selecionar</p>
                  <p className="text-xs text-text-muted mt-2">Formatos: .csv (máx. 5MB)</p>
                </>
              )}
            </div>
            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]); }}
            />
          </div>

          {fileError && <p className="text-sm text-danger">{fileError}</p>}
          {error && <p className="text-sm text-danger">{error}</p>}

          {importing && (
            <div className="flex items-center justify-center gap-2 py-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm text-text-muted">Analisando transações com IA...</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={importing}
              className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-text-secondary hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={importing || !file || !targetId}
              className="rounded-lg bg-primary hover:bg-primary-hover text-background font-semibold px-4 py-2.5 text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              Enviar para Análise
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
