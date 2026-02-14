import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../viewmodels/auth.viewmodel.tsx";
import { Loader2, Asterisk } from "lucide-react";

export function AuthLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      {/* Decorative background */}
      <div className="stars" />
      <div className="fixed top-[-20%] left-[30%] w-[400px] h-[400px] rounded-full bg-orange-500/[0.04] blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-surface rounded-2xl ring-1 ring-white/10 p-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="relative h-7 w-7">
            <Asterisk className="absolute inset-0 h-7 w-7 text-white rotate-12" />
            <Asterisk className="absolute inset-0 h-7 w-7 text-orange-400 -rotate-12 opacity-60" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            My Money
          </h1>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
