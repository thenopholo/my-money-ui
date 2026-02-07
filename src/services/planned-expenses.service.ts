import { del, get, post, put } from "./http-client.ts";
import type { CreatePlannedExpenseRequest, UpdatePlannedExpenseRequest } from "../models/dtos.ts";
import type { PlannedExpense } from "../models/entities.ts";

export function createPlannedExpense(data: CreatePlannedExpenseRequest): Promise<PlannedExpense> {
  return post<PlannedExpense>("/api/planned-expenses", data);
}

export function listPlannedExpenses(): Promise<PlannedExpense[]> {
  return get<PlannedExpense[]>("/api/planned-expenses");
}

export function getPlannedExpense(id: string): Promise<PlannedExpense> {
  return get<PlannedExpense>(`/api/planned-expenses/${id}`);
}

export function updatePlannedExpense(
  id: string,
  data: UpdatePlannedExpenseRequest,
): Promise<PlannedExpense> {
  return put<PlannedExpense>(`/api/planned-expenses/${id}`, data);
}

export function deletePlannedExpense(id: string): Promise<void> {
  return del(`/api/planned-expenses/${id}`);
}
