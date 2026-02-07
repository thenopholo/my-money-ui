import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth.viewmodel.tsx";

function validatePassword(password: string): string | null {
  if (password.length < 8) return "A senha deve ter no mínimo 8 caracteres";
  if (!/[A-Z]/.test(password)) return "A senha deve conter uma letra maiúscula";
  if (!/[a-z]/.test(password)) return "A senha deve conter uma letra minúscula";
  if (!/[0-9]/.test(password)) return "A senha deve conter um número";
  if (!/[^A-Za-z0-9]/.test(password)) return "A senha deve conter um caractere especial";
  return null;
}

export function useRegisterViewModel() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const pwError = validatePassword(password);
    if (pwError) {
      setError(pwError);
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, password });
      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  }

  return {
    name, setName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    error, loading, handleSubmit,
  };
}
