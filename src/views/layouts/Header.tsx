import { useAuth } from "../../viewmodels/auth.viewmodel.tsx";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-border bg-surface flex items-center px-8">
      <p className="text-text-secondary text-sm">
        Olá, <span className="text-text-primary font-semibold">{user?.name}</span>
      </p>
    </header>
  );
}
