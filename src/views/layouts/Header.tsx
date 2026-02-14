import { useAuth } from "../../viewmodels/auth.viewmodel.tsx";
import { User } from "lucide-react";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-[#050505]/80 backdrop-blur-md rounded-2xl ring-1 ring-white/10 flex items-center justify-between px-6 py-3 mx-4 mt-4">
      <p className="text-text-secondary text-sm">
        Olá, <span className="text-text-primary font-semibold">{user?.name}</span>
      </p>
      <div className="flex items-center justify-center h-8 w-8 rounded-full ring-1 ring-white/10 bg-white/[0.02]">
        <User className="h-4 w-4 text-text-secondary" />
      </div>
    </header>
  );
}
