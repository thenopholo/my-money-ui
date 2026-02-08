import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../models/entities.ts";
import type { LoginRequest, RegisterRequest } from "../models/dtos.ts";
import * as authService from "../services/auth.service.ts";
import { setToken, removeToken, getToken } from "../services/http-client.ts";

const USER_KEY = "my_money_user";

export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadStoredUser(): User | null {
  const token = getToken();
  const stored = localStorage.getItem(USER_KEY);
  if (token && stored) {
    return JSON.parse(stored) as User;
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadStoredUser);

  const login = useCallback(async (data: LoginRequest) => {
    const res = await authService.login(data);
    setToken(res.token);
    const u: User = {
      id: res.id,
      name: res.name,
      email: res.email,
      created_at: "",
      updated_at: "",
    };
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setUser(u);
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    await authService.register(data);
  }, []);

  const logout = useCallback(() => {
    removeToken();
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext value={{ user, isLoading: false, login, register, logout }}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
