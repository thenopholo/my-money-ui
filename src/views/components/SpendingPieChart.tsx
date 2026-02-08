import { formatCurrency } from "../../utils/currency.ts";

export interface CategorySpending {
  categoryName: string;
  amount: number;
  color: string;
}

interface SpendingPieChartProps {
  data: CategorySpending[];
}

const FALLBACK_COLORS = [
  "#8b5cf6",
  "#06b6d4",
  "#f59e0b",
  "#ef4444",
  "#22c55e",
  "#ec4899",
  "#3b82f6",
  "#f97316",
];

export function SpendingPieChart({ data }: SpendingPieChartProps) {
  const total = data.reduce((sum, d) => sum + d.amount, 0);

  if (data.length === 0 || total === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-text-muted text-sm text-center">
          Sem gastos no cartão para exibir.
        </p>
      </div>
    );
  }

  const size = 140;
  const center = size / 2;
  const radius = 56;
  const innerRadius = 34;

  const slices: { path: string; color: string }[] = [];
  let currentAngle = -Math.PI / 2;

  for (let i = 0; i < data.length; i++) {
    const slice = data[i];
    const sliceAngle = (slice.amount / total) * Math.PI * 2;
    const endAngle = currentAngle + sliceAngle;

    const x1 = center + radius * Math.cos(currentAngle);
    const y1 = center + radius * Math.sin(currentAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);

    const ix1 = center + innerRadius * Math.cos(currentAngle);
    const iy1 = center + innerRadius * Math.sin(currentAngle);
    const ix2 = center + innerRadius * Math.cos(endAngle);
    const iy2 = center + innerRadius * Math.sin(endAngle);

    const largeArc = sliceAngle > Math.PI ? 1 : 0;
    const color =
      slice.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length];

    const path = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${ix2} ${iy2}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1}`,
      "Z",
    ].join(" ");

    slices.push({ path, color });
    currentAngle = endAngle;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="drop-shadow"
        >
          {slices.map((slice, i) => (
            <path key={i} d={slice.path} fill={slice.color} />
          ))}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-text-primary">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      <div className="w-full space-y-1.5 max-h-36 overflow-y-auto">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{
                backgroundColor:
                  item.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length],
              }}
            />
            <span className="text-text-secondary truncate flex-1">
              {item.categoryName}
            </span>
            <span className="text-text-primary font-medium shrink-0">
              {formatCurrency(item.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
