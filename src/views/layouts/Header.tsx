import { useAuth } from "../../viewmodels/auth.viewmodel.tsx";
import { User } from "lucide-react";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="glass rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.3)] flex items-center justify-between px-6 py-3">
      <p className="text-text-secondary text-sm">
        Olá, <span className="text-text-primary font-semibold">{user?.name}</span>
      </p>
      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/5">
        <User className="h-4 w-4 text-text-secondary" />
      </div>
    </header>
  );
}
