import type { ApiError } from "../models/dtos.ts";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4235";

const TOKEN_KEY = "my_money_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export class ApiRequestError extends Error {
  status: number;
  body: ApiError;

  constructor(status: number, body: ApiError) {
    super(body.error);
    this.name = "ApiRequestError";
    this.status = status;
    this.body = body;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const body = await response.json();

  if (!response.ok) {
    throw new ApiRequestError(response.status, body as ApiError);
  }

  return body as T;
}

function buildHeaders(authenticated: boolean): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (authenticated) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
}

export async function get<T>(path: string, authenticated = true): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    headers: buildHeaders(authenticated),
  });
  return handleResponse<T>(response);
}

export async function post<T>(path: string, body?: unknown, authenticated = true): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: buildHeaders(authenticated),
    body: body != null ? JSON.stringify(body) : undefined,
  });
  return handleResponse<T>(response);
}

export async function put<T>(path: string, body: unknown, authenticated = true): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "PUT",
    headers: buildHeaders(authenticated),
    body: JSON.stringify(body),
  });
  return handleResponse<T>(response);
}

export async function del<T = void>(path: string, authenticated = true): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "DELETE",
    headers: buildHeaders(authenticated),
  });
  return handleResponse<T>(response);
}

export async function postMultipart<T>(path: string, formData: FormData, authenticated = true): Promise<T> {
  const headers: Record<string, string> = {};
  if (authenticated) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: formData,
  });
  return handleResponse<T>(response);
}
