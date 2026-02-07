import { post } from "./client.ts";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../types/api.ts";

export function register(data: RegisterRequest): Promise<RegisterResponse> {
  return post<RegisterResponse>("/auth/register", data, false);
}

export function login(data: LoginRequest): Promise<LoginResponse> {
  return post<LoginResponse>("/auth/login", data, false);
}
