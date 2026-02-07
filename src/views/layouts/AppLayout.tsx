import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar.tsx";
import { Header } from "./Header.tsx";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
