import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar.tsx";
import { Header } from "./Header.tsx";
import { SidebarProvider, useSidebar } from "../../viewmodels/sidebar.viewmodel.ts";

function AppContent() {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen relative">
      {/* Decorative background */}
      <div className="stars" />
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-orange-500/[0.03] blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-orange-500/[0.02] blur-[100px] pointer-events-none" />

      <Sidebar />
      <div
        className={`relative z-10 transition-all duration-300 ease-in-out mr-4
          ${isCollapsed ? "ml-[104px]" : "ml-[288px]"}`}
      >
        <Header />
        <main className="p-4 pt-2">
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
