import type { Recurrence } from "../models/enums.ts";

export const RECURRENCE_LABELS: Record<Recurrence, string> = {
  once: "Única",
  monthly: "Mensal",
  yearly: "Anual",
};

export const RECURRENCE_OPTIONS: { value: Recurrence; label: string }[] = [
  { value: "once", label: "Única" },
  { value: "monthly", label: "Mensal" },
  { value: "yearly", label: "Anual" },
];
