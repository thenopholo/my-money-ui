import { post } from "./http-client.ts";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../models/dtos.ts";

export function register(data: RegisterRequest): Promise<RegisterResponse> {
  return post<RegisterResponse>("/auth/register", data, false);
}

export function login(data: LoginRequest): Promise<LoginResponse> {
  return post<LoginResponse>("/auth/login", data, false);
}
