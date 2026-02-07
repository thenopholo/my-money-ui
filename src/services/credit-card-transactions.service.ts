import { del, get, post, put } from "./http-client.ts";
import type {
  AssignInvoiceRequest,
  AssignInvoiceResponse,
  CreateCreditCardTransactionRequest,
  UpdateCreditCardTransactionRequest,
} from "../models/dtos.ts";
import type { CreditCardTransaction } from "../models/entities.ts";

export function createCreditCardTransaction(
  cardId: string,
  data: CreateCreditCardTransactionRequest,
): Promise<CreditCardTransaction> {
  return post<CreditCardTransaction>(`/api/credit-cards/${cardId}/transactions`, data);
}

export function listCreditCardTransactions(cardId: string): Promise<CreditCardTransaction[]> {
  return get<CreditCardTransaction[]>(`/api/credit-cards/${cardId}/transactions`);
}

export function getCreditCardTransaction(id: string): Promise<CreditCardTransaction> {
  return get<CreditCardTransaction>(`/api/credit-card-transactions/${id}`);
}

export function updateCreditCardTransaction(
  id: string,
  data: UpdateCreditCardTransactionRequest,
): Promise<CreditCardTransaction> {
  return put<CreditCardTransaction>(`/api/credit-card-transactions/${id}`, data);
}

export function deleteCreditCardTransaction(id: string): Promise<void> {
  return del(`/api/credit-card-transactions/${id}`);
}

export function assignInvoice(
  transactionId: string,
  data: AssignInvoiceRequest,
): Promise<AssignInvoiceResponse> {
  return post<AssignInvoiceResponse>(
    `/api/credit-card-transactions/${transactionId}/assign-invoice`,
    data,
  );
}
