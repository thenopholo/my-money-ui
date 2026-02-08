const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return dateFormatter.format(new Date(dateStr));
}
