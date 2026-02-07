import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../viewmodels/auth.viewmodel.tsx";
import { Loader2 } from "lucide-react";

export function AuthLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl bg-surface border border-border p-8">
        <h1 className="text-2xl font-bold text-center text-primary mb-8">
          My Money
        </h1>
        <Outlet />
      </div>
    </div>
  );
}
