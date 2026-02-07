import { del, get, post } from "./client.ts";
import type { CloseMonthRequest } from "../types/api.ts";
import type { Invoice } from "../types/models.ts";

export function closeMonth(cardId: string, data: CloseMonthRequest): Promise<Invoice> {
  return post<Invoice>(`/api/credit-cards/${cardId}/invoices/close-month`, data);
}

export function listInvoices(cardId: string): Promise<Invoice[]> {
  return get<Invoice[]>(`/api/credit-cards/${cardId}/invoices`);
}

export function getInvoice(id: string): Promise<Invoice> {
  return get<Invoice>(`/api/invoices/${id}`);
}

export function deleteInvoice(id: string): Promise<void> {
  return del(`/api/invoices/${id}`);
}
