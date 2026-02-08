import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar.tsx";
import { Header } from "./Header.tsx";
import { SidebarProvider, useSidebar } from "../../viewmodels/sidebar.viewmodel.ts";

function AppContent() {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div
        className={`transition-all duration-300 ease-in-out mr-4
          ${isCollapsed ? "ml-[104px]" : "ml-[288px]"}`}
      >
        <div className="pt-4">
          <Header />
        </div>
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AppLayout() {
  return (
    <SidebarProvider>
      <AppContent />
    </SidebarProvider>
  );
}
