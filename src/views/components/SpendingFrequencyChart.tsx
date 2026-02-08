import { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import type { Transaction, CreditCardTransaction } from "../../models/entities.ts";
import { formatCurrency } from "../../utils/currency.ts";

interface SpendingFrequencyChartProps {
  transactions: Transaction[];
  creditCardTransactions: CreditCardTransaction[];
}

type Period = "7d" | "30d" | "1y";

interface DataPoint {
  date: string;
  label: string;
  amount: number;
}

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "7d", label: "Últimos 7 dias" },
  { value: "30d", label: "Últimos 30 dias" },
  { value: "1y", label: "Último ano" },
];

function formatDateLabel(d: Date, period: Period): string {
  if (period === "1y") {
    return d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
  }
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "");
}

function dateKey(d: Date, period: Period): string {
  if (period === "1y") {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function SpendingFrequencyChart({
  transactions,
  creditCardTransactions,
}: SpendingFrequencyChartProps) {
  const [period, setPeriod] = useState<Period>("7d");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const data = useMemo<DataPoint[]>(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Construir mapa de gastos por dia/mês
    const expenseMap = new Map<string, number>();

    // Transações bancárias de despesa
    for (const tx of transactions) {
      if (tx.TransactionType !== "expense") continue;
      const d = new Date(tx.TransactionDate);
      const key = dateKey(d, period);
      expenseMap.set(key, (expenseMap.get(key) ?? 0) + parseFloat(tx.Amount));
    }

    // Transações de cartão de crédito (todas são despesa)
    for (const tx of creditCardTransactions) {
      const d = new Date(tx.TransactionDate);
      const key = dateKey(d, period);
      expenseMap.set(key, (expenseMap.get(key) ?? 0) + parseFloat(tx.Amount));
    }

    // Gerar pontos para o período
    const points: DataPoint[] = [];

    if (period === "7d") {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = dateKey(d, period);
        points.push({
          date: key,
          label: formatDateLabel(d, period),
          amount: expenseMap.get(key) ?? 0,
        });
      }
    } else if (period === "30d") {
      for (let i = 29; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = dateKey(d, period);
        points.push({
          date: key,
          label: formatDateLabel(d, period),
          amount: expenseMap.get(key) ?? 0,
        });
      }
    } else {
      // Último ano — agrupado por mês
      for (let i = 11; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const key = dateKey(d, period);
        points.push({
          date: key,
          label: formatDateLabel(d, period),
          amount: expenseMap.get(key) ?? 0,
        });
      }
    }

    return points;
  }, [period, transactions, creditCardTransactions]);

  const maxAmount = Math.max(...data.map((d) => d.amount), 1);

  // Dimensões do SVG
  const svgWidth = 800;
  const svgHeight = 340;
  const paddingLeft = 80;
  const paddingRight = 40;
  const paddingTop = 55;
  const paddingBottom = 45;
  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Calcular posições dos pontos
  const points = data.map((d, i) => ({
    x: paddingLeft + (data.length > 1 ? (i / (data.length - 1)) * chartWidth : chartWidth / 2),
    y: paddingTop + chartHeight - (d.amount / maxAmount) * chartHeight,
    ...d,
  }));

  // Gerar path da linha
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  // Gerar path da área
  const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? paddingLeft} ${paddingTop + chartHeight} L ${paddingLeft} ${paddingTop + chartHeight} Z`;

  // Linhas de grade horizontais
  const gridLines = 4;
  const gridValues = Array.from(
    { length: gridLines + 1 },
    (_, i) => (maxAmount / gridLines) * i,
  );

  const selectedLabel =
    PERIOD_OPTIONS.find((o) => o.value === period)?.label ?? "";

  return (
    <div>
      {/* Dropdown de período */}
      <div className="flex justify-end mb-4">
        <div className="relative">
          <button
            className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm text-white"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {selectedLabel}
            <ChevronDown className="h-4 w-4" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 rounded-lg glass-strong shadow-lg z-10">
              {PERIOD_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className="block w-full px-4 py-2 text-sm text-left hover:bg-white/5 whitespace-nowrap"
                  onClick={() => {
                    setPeriod(opt.value);
                    setDropdownOpen(false);
                    setHoveredPoint(null);
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Gráfico SVG */}
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full"
          style={{ minWidth: 400 }}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Linhas de grade horizontais */}
          {gridValues.map((val, i) => {
            const y =
              paddingTop + chartHeight - (val / maxAmount) * chartHeight;
            return (
              <g key={i}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="#27272a"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  fill="#52525b"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {formatCurrency(val)}
                </text>
              </g>
            );
          })}

          {/* Área preenchida */}
          {points.length > 0 && (
            <path d={areaPath} fill="url(#areaGradient)" />
          )}

          {/* Linha */}
          {points.length > 0 && (
            <path
              d={linePath}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}

          {/* Pontos */}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredPoint === i ? 6 : 4}
                fill={hoveredPoint === i ? "#8b5cf6" : "#ffffff"}
                stroke="#8b5cf6"
                strokeWidth="2"
                style={{ cursor: "pointer", transition: "r 0.15s ease" }}
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              {/* Área transparente de hover maior */}
              <circle
                cx={p.x}
                cy={p.y}
                r={16}
                fill="transparent"
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            </g>
          ))}

          {/* Labels eixo X */}
          {points.map((p, i) => {
            // Mostrar apenas alguns labels para não sobrepor
            const showLabel =
              data.length <= 12 ||
              i % Math.ceil(data.length / 10) === 0 ||
              i === data.length - 1;
            if (!showLabel) return null;
            return (
              <text
                key={i}
                x={p.x}
                y={svgHeight - 8}
                textAnchor="middle"
                fill="#52525b"
                fontSize="10"
                fontFamily="monospace"
              >
                {p.label}
              </text>
            );
          })}

          {/* Tooltip */}
          {hoveredPoint !== null && points[hoveredPoint] && (() => {
            const pt = points[hoveredPoint];
            const tooltipH = 36;
            const gap = 10;
            // Se o ponto estiver muito perto do topo, exibir tooltip abaixo
            const showBelow = pt.y - tooltipH - gap < 0;
            const tooltipY = showBelow ? pt.y + gap : pt.y - tooltipH - gap;
            // Limitar posição horizontal para não cortar nas bordas
            const tooltipW = 130;
            const rawX = pt.x - tooltipW / 2;
            const clampedX = Math.max(4, Math.min(rawX, svgWidth - tooltipW - 4));

            return (
              <g>
                <rect
                  x={clampedX}
                  y={tooltipY}
                  width={tooltipW}
                  height={tooltipH}
                  rx={6}
                  fill="#23232e"
                  stroke="#27272a"
                  strokeWidth="1"
                />
                <text
                  x={clampedX + tooltipW / 2}
                  y={tooltipY + 14}
                  textAnchor="middle"
                  fill="#a1a1aa"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {pt.label}
                </text>
                <text
                  x={clampedX + tooltipW / 2}
                  y={tooltipY + 28}
                  textAnchor="middle"
                  fill="#f1f1f1"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {formatCurrency(pt.amount)}
                </text>
              </g>
            );
          })()}
        </svg>
      </div>
    </div>
  );
}
