import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthLayout } from "./views/layouts/AuthLayout.tsx";
import { AppLayout } from "./views/layouts/AppLayout.tsx";
import { ProtectedRoute } from "./views/components/ProtectedRoute.tsx";
import { LoginPage } from "./views/pages/LoginPage.tsx";
import { RegisterPage } from "./views/pages/RegisterPage.tsx";
import { DashboardPage } from "./views/pages/DashboardPage.tsx";
import { AccountsPage } from "./views/pages/AccountsPage.tsx";
import { TransactionsPage } from "./views/pages/TransactionsPage.tsx";
import { CreditCardsPage } from "./views/pages/CreditCardsPage.tsx";
import { CategoriesPage } from "./views/pages/CategoriesPage.tsx";
import { PlannedIncomesPage } from "./views/pages/PlannedIncomesPage.tsx";
import { PlannedExpensesPage } from "./views/pages/PlannedExpensesPage.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/credit-cards" element={<CreditCardsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/planned-incomes" element={<PlannedIncomesPage />} />
            <Route path="/planned-expenses" element={<PlannedExpensesPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
