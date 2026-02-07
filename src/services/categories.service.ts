import { del, get, post, put } from "./http-client.ts";
import type { CreateCategoryRequest, UpdateCategoryRequest } from "../models/dtos.ts";
import type { Category } from "../models/entities.ts";

export function createCategory(data: CreateCategoryRequest): Promise<Category> {
  return post<Category>("/api/categories", data);
}

export function listCategories(): Promise<Category[]> {
  return get<Category[]>("/api/categories");
}

export function getCategory(id: string): Promise<Category> {
  return get<Category>(`/api/categories/${id}`);
}

export function updateCategory(id: string, data: UpdateCategoryRequest): Promise<Category> {
  return put<Category>(`/api/categories/${id}`, data);
}

export function deleteCategory(id: string): Promise<void> {
  return del(`/api/categories/${id}`);
}
