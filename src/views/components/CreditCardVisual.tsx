import type { CreditCard } from "../../models/entities.ts";
import { formatCurrency } from "../../utils/currency.ts";
import {
  detectBankColor,
  detectCardBrand,
  getBrandDisplayName,
  darkenColor,
} from "../../utils/card-brands.ts";

interface CreditCardVisualProps {
  card: CreditCard;
  spent: number;
  compact?: boolean;
  onClick?: () => void;
}

export function CreditCardVisual({
  card,
  spent,
  compact = false,
  onClick,
}: CreditCardVisualProps) {
  const bankColor = detectBankColor(card.Name);
  const brand = detectCardBrand(card.Name);
  const brandLabel = getBrandDisplayName(brand);
  const limit = parseFloat(card.CreditLimit);
  const percentage = limit > 0 ? (spent / limit) * 100 : 0;
  const clampedPercentage = Math.min(percentage, 100);

  const progressColor =
    percentage >= 100
      ? "#ef4444"
      : percentage >= 80
        ? "#eab308"
        : "rgba(255,255,255,0.8)";

  if (compact) {
    return (
      <div
        className="relative rounded-2xl p-4 text-white shadow-lg overflow-hidden cursor-pointer select-none flex flex-col justify-between"
        style={{
          background: `linear-gradient(135deg, ${bankColor}, ${darkenColor(bankColor, 30)})`,
          aspectRatio: "1.7",
        }}
        onClick={onClick}
      >
        <div className="flex justify-between items-start">
          <span className="text-sm font-bold drop-shadow">{card.Name}</span>
          {brandLabel && (
            <span className="text-xs font-semibold opacity-80">{brandLabel}</span>
          )}
        </div>

        <div>
          <div
            className="h-1.5 rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${clampedPercentage}%`,
                backgroundColor: progressColor,
              }}
            />
          </div>
          <div className="flex justify-between items-center mt-1.5">
            <span className="text-xs font-medium drop-shadow">
              {formatCurrency(spent)}
            </span>
            <span className="text-xs opacity-70 drop-shadow">
              {formatCurrency(limit)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative rounded-2xl p-5 text-white shadow-lg overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${bankColor}, ${darkenColor(bankColor, 30)})`,
        aspectRatio: "1.586",
      }}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <span className="text-sm font-bold drop-shadow">{card.Name}</span>
        {brandLabel && (
          <span className="text-xs font-semibold opacity-80">{brandLabel}</span>
        )}
      </div>

      <div className="absolute bottom-5 left-5 right-5">
        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-xs opacity-70">Limite</p>
            <p className="text-sm font-semibold drop-shadow">
              {formatCurrency(limit)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-70">Fatura Atual</p>
            <p className="text-sm font-semibold drop-shadow">
              {formatCurrency(spent)}
            </p>
          </div>
        </div>

        <div
          className="h-1.5 rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${clampedPercentage}%`,
              backgroundColor: progressColor,
            }}
          />
        </div>

        <div className="flex justify-between items-center mt-2">
          <span className="text-xs opacity-60">
            Fecha dia {card.CloseDay} &middot; Vence dia {card.DueDay}
          </span>
          <span className="text-xs font-medium opacity-70">
            {percentage.toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
}
