import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useRegisterViewModel } from "../../viewmodels/register.viewmodel.ts";

export function RegisterPage() {
  const {
    name, setName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    error, loading, handleSubmit,
  } = useRegisterViewModel();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm text-text-secondary mb-1">
          Nome
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg bg-surface-light border border-border px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary"
          placeholder="Seu nome"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm text-text-secondary mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg bg-surface-light border border-border px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary"
          placeholder="seu@email.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm text-text-secondary mb-1">
          Senha
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg bg-surface-light border border-border px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary"
          placeholder="********"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm text-text-secondary mb-1">
          Confirmar Senha
        </label>
        <input
          id="confirmPassword"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full rounded-lg bg-surface-light border border-border px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary"
          placeholder="********"
        />
      </div>

      {error && (
        <p className="text-sm text-danger">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-primary hover:bg-primary-hover text-background font-semibold py-2.5 text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Cadastrar
      </button>

      <p className="text-center text-sm text-text-secondary">
        Já tem uma conta?{" "}
        <Link to="/login" className="text-primary hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
