import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  CreditCard,
  Tag,
  TrendingUp,
  TrendingDown,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../viewmodels/auth.viewmodel.tsx";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transações", icon: ArrowLeftRight },
  { to: "/accounts", label: "Contas", icon: Wallet },
  { to: "/credit-cards", label: "Cartões", icon: CreditCard },
  { to: "/categories", label: "Categorias", icon: Tag },
  { to: "/planned-incomes", label: "Receitas Planejadas", icon: TrendingUp },
  { to: "/planned-expenses", label: "Despesas Planejadas", icon: TrendingDown },
];

export function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface border-r border-border flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-bold text-primary">My Money</h2>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-primary-dim text-primary font-semibold"
                  : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:bg-surface-hover hover:text-danger transition-colors w-full"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </div>
    </aside>
  );
}
