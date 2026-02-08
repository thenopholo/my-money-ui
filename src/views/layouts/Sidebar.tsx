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
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useAuth } from "../../viewmodels/auth.viewmodel.tsx";
import { useSidebar } from "../../viewmodels/sidebar.viewmodel.ts";

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
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <aside
      className={`fixed left-4 top-4 bottom-4 z-40 flex flex-col glass-strong rounded-[20px]
        shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-[72px]" : "w-64"}`}
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <span className="text-xl font-bold text-primary whitespace-nowrap">
          {isCollapsed ? "MM" : "My Money"}
        </span>
      </div>

      {/* Toggle */}
      <button
        onClick={toggleSidebar}
        className="mx-3 mb-2 p-2 rounded-lg text-text-secondary hover:bg-white/5 transition-colors"
        title={isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
      >
        {isCollapsed ? (
          <PanelLeftOpen className="h-5 w-5" />
        ) : (
          <PanelLeftClose className="h-5 w-5" />
        )}
      </button>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={isCollapsed ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200
              ${isCollapsed ? "justify-center" : ""}
              ${
                isActive
                  ? "glass-active text-primary font-semibold"
                  : "text-text-secondary glass-hover"
              }`
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span
              className={`whitespace-nowrap transition-[opacity,max-width] duration-200
              ${isCollapsed ? "opacity-0 max-w-0 overflow-hidden" : "opacity-100 max-w-[200px]"}`}
            >
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={logout}
          title={isCollapsed ? "Sair" : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-secondary
            hover:bg-white/5 hover:text-danger transition-colors w-full
            ${isCollapsed ? "justify-center" : ""}`}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span
            className={`whitespace-nowrap transition-[opacity,max-width] duration-200
            ${isCollapsed ? "opacity-0 max-w-0 overflow-hidden" : "opacity-100 max-w-[200px]"}`}
          >
            Sair
          </span>
        </button>
      </div>
    </aside>
  );
}
