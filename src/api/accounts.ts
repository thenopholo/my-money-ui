import { del, get, post, put } from "./client.ts";
import type { CreateAccountRequest, UpdateAccountRequest } from "../types/api.ts";
import type { BankAccount } from "../types/models.ts";

export function createAccount(data: CreateAccountRequest): Promise<BankAccount> {
  return post<BankAccount>("/api/accounts", data);
}

export function listAccounts(): Promise<BankAccount[]> {
  return get<BankAccount[]>("/api/accounts");
}

export function getAccount(id: string): Promise<BankAccount> {
  return get<BankAccount>(`/api/accounts/${id}`);
}

export function updateAccount(id: string, data: UpdateAccountRequest): Promise<BankAccount> {
  return put<BankAccount>(`/api/accounts/${id}`, data);
}

export function deleteAccount(id: string): Promise<void> {
  return del(`/api/accounts/${id}`);
}
