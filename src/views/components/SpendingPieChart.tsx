import { useState } from "react";
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
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

  const size = 280;
  const center = size / 2;
  const radius = 120;
  const innerRadius = 75;
  const hoverRadius = 130;

  interface SliceData {
    path: string;
    hoverPath: string;
    color: string;
    startAngle: number;
    endAngle: number;
  }

  const slices: SliceData[] = [];
  let currentAngle = -Math.PI / 2;

  for (let i = 0; i < data.length; i++) {
    const slice = data[i];
    const sliceAngle = (slice.amount / total) * Math.PI * 2;
    const endAngle = currentAngle + sliceAngle;

    const color =
      slice.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length];

    const buildPath = (outerR: number): string => {
      const x1 = center + outerR * Math.cos(currentAngle);
      const y1 = center + outerR * Math.sin(currentAngle);
      const x2 = center + outerR * Math.cos(endAngle);
      const y2 = center + outerR * Math.sin(endAngle);

      const ix1 = center + innerRadius * Math.cos(currentAngle);
      const iy1 = center + innerRadius * Math.sin(currentAngle);
      const ix2 = center + innerRadius * Math.cos(endAngle);
      const iy2 = center + innerRadius * Math.sin(endAngle);

      const largeArc = sliceAngle > Math.PI ? 1 : 0;

      return [
        `M ${x1} ${y1}`,
        `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2}`,
        `L ${ix2} ${iy2}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1}`,
        "Z",
      ].join(" ");
    };

    slices.push({
      path: buildPath(radius),
      hoverPath: buildPath(hoverRadius),
      color,
      startAngle: currentAngle,
      endAngle,
    });

    currentAngle = endAngle;
  }

  const hoveredItem = hoveredIndex !== null ? data[hoveredIndex] : null;
  const hoveredPercent =
    hoveredItem !== null ? ((hoveredItem.amount / total) * 100).toFixed(2) : "";

  return (
    <div className="flex items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="drop-shadow"
        >
          {slices.map((slice, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <path
                key={i}
                d={isHovered ? slice.hoverPath : slice.path}
                fill={slice.color}
                stroke={isHovered ? "#ffffff" : "transparent"}
                strokeWidth={isHovered ? 2 : 0}
                style={{
                  transition: "d 0.2s ease, stroke 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {hoveredItem ? (
            <>
              <span className="text-lg font-bold text-text-primary">
                {formatCurrency(hoveredItem.amount)}
              </span>
              <span className="text-xs text-text-secondary">
                {hoveredItem.categoryName}
              </span>
              <span className="text-xs text-text-muted">{hoveredPercent}%</span>
            </>
          ) : (
            <>
              <span className="text-lg font-bold text-text-primary">
                {formatCurrency(total)}
              </span>
              <span className="text-xs text-text-muted">Total</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
