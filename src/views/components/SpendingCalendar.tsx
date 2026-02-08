import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Transaction, CreditCardTransaction } from "../../models/entities.ts";
import { formatCurrency } from "../../utils/currency.ts";

interface SpendingCalendarProps {
  transactions: Transaction[];
  creditCardTransactions: CreditCardTransaction[];
  initialMonth?: Date;
}

interface DayData {
  income: number;
  expense: number;
}

const WEEKDAY_HEADERS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

function buildDayKey(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

function parseDateKey(dateStr: string): string {
  const d = new Date(dateStr);
  return buildDayKey(d.getFullYear(), d.getMonth(), d.getDate());
}

export function SpendingCalendar({
  transactions,
  creditCardTransactions,
  initialMonth,
}: SpendingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(
    () => initialMonth ?? new Date(),
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay(); // 0=dom
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;

  // Agrupar transações por dia
  const dayMap = new Map<string, DayData>();

  const ensureDay = (key: string): DayData => {
    let data = dayMap.get(key);
    if (!data) {
      data = { income: 0, expense: 0 };
      dayMap.set(key, data);
    }
    return data;
  };

  for (const tx of transactions) {
    const key = parseDateKey(tx.TransactionDate);
    const data = ensureDay(key);
    const amount = parseFloat(tx.Amount);
    if (tx.TransactionType === "income") {
      data.income += amount;
    } else {
      data.expense += amount;
    }
  }

  for (const tx of creditCardTransactions) {
    const key = parseDateKey(tx.TransactionDate);
    const data = ensureDay(key);
    data.expense += parseFloat(tx.Amount);
  }

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthLabel = firstDay.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  // Construir array de dias visíveis (prev overflow + current + next overflow)
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  interface CellInfo {
    day: number;
    key: string;
    isCurrentMonth: boolean;
    isToday: boolean;
  }

  const cells: CellInfo[] = [];

  for (let i = 0; i < totalCells; i++) {
    if (i < startOffset) {
      // Dias do mês anterior
      const d = daysInPrevMonth - startOffset + 1 + i;
      const prevMonth = month - 1;
      const prevYear = prevMonth < 0 ? year - 1 : year;
      const pm = prevMonth < 0 ? 11 : prevMonth;
      cells.push({
        day: d,
        key: buildDayKey(prevYear, pm, d),
        isCurrentMonth: false,
        isToday: false,
      });
    } else if (i - startOffset < daysInMonth) {
      const d = i - startOffset + 1;
      cells.push({
        day: d,
        key: buildDayKey(year, month, d),
        isCurrentMonth: true,
        isToday: isCurrentMonth && today.getDate() === d,
      });
    } else {
      // Dias do próximo mês
      const d = i - startOffset - daysInMonth + 1;
      const nextMonth = month + 1;
      const nextYear = nextMonth > 11 ? year + 1 : year;
      const nm = nextMonth > 11 ? 0 : nextMonth;
      cells.push({
        day: d,
        key: buildDayKey(nextYear, nm, d),
        isCurrentMonth: false,
        isToday: false,
      });
    }
  }

  return (
    <div>
      {/* Cabeçalho de navegação */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPrevMonth}
          className="p-1 rounded-lg hover:bg-surface-hover transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-text-secondary" />
        </button>
        <span className="text-sm font-semibold capitalize">{monthLabel}</span>
        <button
          onClick={goToNextMonth}
          className="p-1 rounded-lg hover:bg-surface-hover transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-text-secondary" />
        </button>
      </div>

      {/* Headers dos dias da semana */}
      <div className="grid grid-cols-7 gap-px mb-1">
        {WEEKDAY_HEADERS.map((header) => (
          <div
            key={header}
            className="text-center text-[10px] font-medium text-text-muted uppercase py-1"
          >
            {header}
          </div>
        ))}
      </div>

      {/* Grid de dias */}
      <div className="grid grid-cols-7 gap-px bg-surface-light rounded-lg overflow-hidden">
        {cells.map((cell, i) => {
          const data = dayMap.get(cell.key);
          const badges: { type: "income" | "expense"; value: number }[] = [];
          if (data) {
            if (data.expense > 0) badges.push({ type: "expense", value: data.expense });
            if (data.income > 0) badges.push({ type: "income", value: data.income });
          }
          const visibleBadges = badges.slice(0, 2);
          const extraCount = badges.length - 2;

          return (
            <div
              key={i}
              className={`bg-surface p-1 min-h-[68px] flex flex-col ${
                !cell.isCurrentMonth ? "opacity-40" : ""
              }`}
            >
              <span
                className={`text-xs font-medium self-end mb-0.5 ${
                  cell.isToday
                    ? "text-warning font-bold"
                    : cell.isCurrentMonth
                      ? "text-text-primary"
                      : "text-text-muted"
                }`}
              >
                {cell.day}
              </span>
              <div className="flex flex-col gap-0.5 mt-auto">
                {visibleBadges.map((badge, bi) => (
                  <span
                    key={bi}
                    className={`text-[9px] leading-tight rounded px-1 py-0.5 font-medium text-white truncate ${
                      badge.type === "expense" ? "bg-expense" : "bg-income"
                    }`}
                  >
                    {formatCurrency(badge.value)}
                  </span>
                ))}
                {extraCount > 0 && (
                  <span className="text-[9px] text-text-muted">
                    +{extraCount}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
