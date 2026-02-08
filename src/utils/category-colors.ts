import type { CategoryType } from "../models/enums.ts";

export const CATEGORY_COLORS: { value: string; label: string }[] = [
  { value: "#22c55e", label: "Verde" },
  { value: "#ef4444", label: "Vermelho" },
  { value: "#3b82f6", label: "Azul" },
  { value: "#f59e0b", label: "Amarelo" },
  { value: "#8b5cf6", label: "Roxo" },
  { value: "#ec4899", label: "Rosa" },
  { value: "#06b6d4", label: "Ciano" },
  { value: "#f97316", label: "Laranja" },
  { value: "#14b8a6", label: "Teal" },
  { value: "#6366f1", label: "Índigo" },
  { value: "#84cc16", label: "Lima" },
  { value: "#a855f7", label: "Violeta" },
];

export const DEFAULT_CATEGORY_COLOR = "#a1a1aa";

export function getDefaultColorByType(type: CategoryType): string {
  return type === "income" ? "#22c55e" : "#ef4444";
}
