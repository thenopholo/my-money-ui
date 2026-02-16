import { del, get, post, put } from "./http-client.ts";
import type {
  CreatePlannedTransactionRequest,
  CreateTransactionRequest,
  PayInvoiceRequest,
  UpdateTransactionRequest,
} from "../models/dtos.ts";
import type { Transaction } from "../models/entities.ts";

export function createTransaction(data: CreateTransactionRequest): Promise<Transaction> {
  return post<Transaction>("/api/transactions", data);
}

export function getTransaction(id: string): Promise<Transaction> {
  return get<Transaction>(`/api/transactions/${id}`);
}

export function updateTransaction(id: string, data: UpdateTransactionRequest): Promise<Transaction> {
  return put<Transaction>(`/api/transactions/${id}`, data);
}

export function deleteTransaction(id: string): Promise<void> {
  return del(`/api/transactions/${id}`);
}

export function listAccountTransactions(accountId: string): Promise<Transaction[]> {
  return get<Transaction[]>(`/api/accounts/${accountId}/transactions`);
}

export function createFromPlannedIncome(
  plannedIncomeId: string,
  data: CreatePlannedTransactionRequest,
): Promise<Transaction> {
  return post<Transaction>(`/api/transactions/planned-income/${plannedIncomeId}`, data);
}

export function createFromPlannedExpense(
  plannedExpenseId: string,
  data: CreatePlannedTransactionRequest,
): Promise<Transaction> {
  return post<Transaction>(`/api/transactions/planned-expense/${plannedExpenseId}`, data);
}

export function payInvoice(data: PayInvoiceRequest): Promise<Transaction> {
  return post<Transaction>("/api/transactions/pay-invoice", data);
}

export function resetAllTransactions(): Promise<void> {
  return del("/api/transactions/reset");
}
