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
  Asterisk,
} from "lucide-react";
import { useAuth } from "../../viewmodels/auth.viewmodel.tsx";
import { useSidebar } from "../../viewmodels/sidebar.viewmodel.ts";

const menuItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transações", icon: ArrowLeftRight },
];

const financeItems = [
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
      className={`fixed left-4 top-4 bottom-4 z-40 flex flex-col bg-[#050505]/80 backdrop-blur-md rounded-[20px] ring-1 ring-white/10
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-[72px]" : "w-64"}`}
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="relative h-7 w-7 shrink-0">
          <Asterisk className="absolute inset-0 h-7 w-7 text-white rotate-12" />
          <Asterisk className="absolute inset-0 h-7 w-7 text-orange-400 -rotate-12 opacity-60" />
        </div>
        <span
          className={`text-xl font-bold text-white whitespace-nowrap transition-[opacity,max-width] duration-200
          ${isCollapsed ? "opacity-0 max-w-0 overflow-hidden" : "opacity-100 max-w-[200px]"}`}
        >
          My Money
        </span>
      </div>

      {/* Toggle */}
      <button
        onClick={toggleSidebar}
        className="mx-3 mb-2 p-2 rounded-lg text-text-secondary hover:bg-white/5 transition-colors"
        title={isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
      >
        {isCollapsed ? (
          <PanelLeftOpen className="h-4 w-4" />
        ) : (
          <PanelLeftClose className="h-4 w-4" />
        )}
      </button>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-4 overflow-y-auto">
        {/* Menu group */}
        <div>
          {!isCollapsed && (
            <p className="text-[10px] uppercase text-neutral-500 font-medium tracking-wider px-3 mb-2">
              Menu
            </p>
          )}
          <div className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200
                  ${isCollapsed ? "justify-center" : ""}
                  ${
                    isActive
                      ? "bg-white/5 ring-1 ring-white/10 text-white font-semibold"
                      : "text-neutral-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-orange-400" : ""}`} />
                    <span
                      className={`whitespace-nowrap transition-[opacity,max-width] duration-200
                      ${isCollapsed ? "opacity-0 max-w-0 overflow-hidden" : "opacity-100 max-w-[200px]"}`}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Financas group */}
        <div>
          {!isCollapsed && (
            <p className="text-[10px] uppercase text-neutral-500 font-medium tracking-wider px-3 mb-2">
              Finanças
            </p>
          )}
          <div className="space-y-1">
            {financeItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200
                  ${isCollapsed ? "justify-center" : ""}
                  ${
                    isActive
                      ? "bg-white/5 ring-1 ring-white/10 text-white font-semibold"
                      : "text-neutral-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-orange-400" : ""}`} />
                    <span
                      className={`whitespace-nowrap transition-[opacity,max-width] duration-200
                      ${isCollapsed ? "opacity-0 max-w-0 overflow-hidden" : "opacity-100 max-w-[200px]"}`}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/5">
        <button
          onClick={logout}
          title={isCollapsed ? "Sair" : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-400
            hover:bg-white/5 hover:text-danger transition-colors w-full
            ${isCollapsed ? "justify-center" : ""}`}
        >
          <LogOut className="h-4 w-4 shrink-0" />
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
