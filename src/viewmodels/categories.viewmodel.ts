import { useCallback, useEffect, useState } from "react";
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categories.service.ts";
import { ApiRequestError } from "../services/http-client.ts";
import type { Category } from "../models/entities.ts";
import type { CreateCategoryRequest, UpdateCategoryRequest } from "../models/dtos.ts";

export function useCategoriesViewModel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  const loadCategories = useCallback(async () => {
    try {
      setError("");
      setLoading(true);
      const data = await listCategories();
      setCategories(data);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
      } else {
        setError("Erro ao carregar categorias.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleCreate = async (data: CreateCategoryRequest) => {
    setSaving(true);
    try {
      await createCategory(data);
      await loadCategories();
    } catch (err) {
      if (err instanceof ApiRequestError) {
        throw err;
      }
      throw new Error("Erro ao criar categoria.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string, data: UpdateCategoryRequest) => {
    setSaving(true);
    try {
      await updateCategory(id, data);
      await loadCategories();
    } catch (err) {
      if (err instanceof ApiRequestError) {
        throw err;
      }
      throw new Error("Erro ao atualizar categoria.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    try {
      await deleteCategory(id);
      await loadCategories();
    } catch (err) {
      if (err instanceof ApiRequestError) {
        throw err;
      }
      throw new Error("Erro ao excluir categoria.");
    } finally {
      setSaving(false);
    }
  };

  const filteredCategories =
    filter === "all"
      ? categories
      : categories.filter((c) => c.CategoryType === filter);

  const incomeCount = categories.filter((c) => c.CategoryType === "income").length;
  const expenseCount = categories.filter((c) => c.CategoryType === "expense").length;

  return {
    categories,
    filteredCategories,
    filter,
    setFilter,
    incomeCount,
    expenseCount,
    loading,
    saving,
    error,
    loadCategories,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}
