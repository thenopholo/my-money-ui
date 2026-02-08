import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../viewmodels/auth.viewmodel.tsx";
import { Loader2 } from "lucide-react";

export function AuthLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl glass-strong p-8 shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
        <h1 className="text-2xl font-bold text-center text-primary mb-8">
          My Money
        </h1>
        <Outlet />
      </div>
    </div>
  );
}
