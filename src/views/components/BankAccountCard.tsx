import { Landmark, RefreshCw } from "lucide-react";
import type { BankAccount } from "../../models/entities.ts";
import type { AccountType } from "../../models/enums.ts";
import { formatCurrency } from "../../utils/currency.ts";
import { getBankLogo } from "../../utils/bank-logos.ts";

interface BankAccountCardProps {
  account: BankAccount;
  predictedBalance?: number;
}

const accountTypeLabels: Record<AccountType, string> = {
  checking: "C.Corrente",
  savings: "Poupança",
};

function balanceColorClass(value: number): string {
  if (value < 0) return "text-expense";
  if (value > 0) return "text-income";
  return "text-text-primary";
}

export function BankAccountCard({
  account,
  predictedBalance,
}: BankAccountCardProps) {
  const logo = getBankLogo(account.BankName);
  const balance = parseFloat(account.Balance);
  const predicted = predictedBalance ?? balance;
  const typeLabel = accountTypeLabels[account.AccountType] ?? account.AccountType;

  return (
    <div className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
      <div className="flex items-center gap-4 py-2">
        {logo ? (
          <img
            src={logo}
            alt={account.BankName}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.02] ring-1 ring-white/10">
            <Landmark className="h-5 w-5 text-text-secondary" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">
            {account.BankName} - {typeLabel}
          </p>
        </div>
        <button className="flex items-center gap-1.5 rounded-full ring-1 ring-white/10 px-3 py-1 text-xs text-text-secondary shrink-0">
          <RefreshCw className="h-3 w-3" />
          Open Finance
        </button>
      </div>

      <div className="flex justify-between text-sm mt-1">
        <span className="text-text-secondary">Saldo atual</span>
        <span className={balanceColorClass(balance)}>
          {formatCurrency(balance)}
        </span>
      </div>
      <div className="flex justify-between text-sm mt-1">
        <span className="text-text-secondary">Saldo previsto</span>
        <span className={balanceColorClass(predicted)}>
          {formatCurrency(predicted)}
        </span>
      </div>
    </div>
  );
}
