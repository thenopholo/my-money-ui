import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useLoginViewModel } from "../../viewmodels/login.viewmodel.ts";

export function LoginPage() {
  const { email, setEmail, password, setPassword, error, loading, handleSubmit } = useLoginViewModel();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary"
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
          className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary"
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
        Entrar
      </button>

      <p className="text-center text-sm text-text-secondary">
        Não tem uma conta?{" "}
        <Link to="/register" className="text-primary hover:underline">
          Cadastre-se
        </Link>
      </p>
    </form>
  );
}
