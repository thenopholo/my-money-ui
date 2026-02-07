import { del, get, post, put } from "./http-client.ts";
import type { CreatePlannedIncomeRequest, UpdatePlannedIncomeRequest } from "../models/dtos.ts";
import type { PlannedIncome } from "../models/entities.ts";

export function createPlannedIncome(data: CreatePlannedIncomeRequest): Promise<PlannedIncome> {
  return post<PlannedIncome>("/api/planned-incomes", data);
}

export function listPlannedIncomes(): Promise<PlannedIncome[]> {
  return get<PlannedIncome[]>("/api/planned-incomes");
}

export function getPlannedIncome(id: string): Promise<PlannedIncome> {
  return get<PlannedIncome>(`/api/planned-incomes/${id}`);
}

export function updatePlannedIncome(
  id: string,
  data: UpdatePlannedIncomeRequest,
): Promise<PlannedIncome> {
  return put<PlannedIncome>(`/api/planned-incomes/${id}`, data);
}

export function deletePlannedIncome(id: string): Promise<void> {
  return del(`/api/planned-incomes/${id}`);
}
