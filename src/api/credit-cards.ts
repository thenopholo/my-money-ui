import { del, get, post, put } from "./client.ts";
import type { CreateCreditCardRequest, UpdateCreditCardRequest } from "../types/api.ts";
import type { CreditCard } from "../types/models.ts";

export function createCreditCard(data: CreateCreditCardRequest): Promise<CreditCard> {
  return post<CreditCard>("/api/credit-cards", data);
}

export function listCreditCards(): Promise<CreditCard[]> {
  return get<CreditCard[]>("/api/credit-cards");
}

export function getCreditCard(id: string): Promise<CreditCard> {
  return get<CreditCard>(`/api/credit-cards/${id}`);
}

export function updateCreditCard(id: string, data: UpdateCreditCardRequest): Promise<CreditCard> {
  return put<CreditCard>(`/api/credit-cards/${id}`, data);
}

export function deleteCreditCard(id: string): Promise<void> {
  return del(`/api/credit-cards/${id}`);
}
