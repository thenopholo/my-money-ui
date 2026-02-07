export function SummaryCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="rounded-xl bg-surface border border-border p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-text-secondary">{title}</span>
        <span className={color}>{icon}</span>
      </div>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
