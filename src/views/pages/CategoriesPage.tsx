import { useState } from "react";
import { Tag, Plus, Pencil, Trash2, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import { useCategoriesViewModel } from "../../viewmodels/categories.viewmodel.ts";
import { CategoryFormModal } from "../components/CategoryFormModal.tsx";
import { CategoryBadge } from "../components/CategoryBadge.tsx";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal.tsx";
import type { Category } from "../../models/entities.ts";
import type { CreateCategoryRequest, UpdateCategoryRequest } from "../../models/dtos.ts";

export function CategoriesPage() {
  const {
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
    categories,
  } = useCategoriesViewModel();

  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => {
    setEditingCategory(undefined);
    setFormOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditingCategory(category);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: CreateCategoryRequest | UpdateCategoryRequest) => {
    if (editingCategory) {
      await handleUpdate(editingCategory.ID, data as UpdateCategoryRequest);
    } else {
      await handleCreate(data as CreateCategoryRequest);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await handleDelete(deleteTarget.ID);
      setDeleteTarget(null);
    } catch {
      // error is re-thrown from viewmodel, handled in the modal UX
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Tag className="h-6 w-6 text-primary" />
          Categorias
        </h1>
        <button
          onClick={openCreate}
          className="rounded-lg bg-primary hover:bg-primary-hover text-background font-semibold py-2.5 px-4 text-sm transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nova Categoria
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-primary-dim text-primary"
              : "text-text-secondary hover:bg-white/5"
          }`}
        >
          Todas ({categories.length})
        </button>
        <button
          onClick={() => setFilter("income")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1.5 ${
            filter === "income"
              ? "bg-income/20 text-income"
              : "text-text-secondary hover:bg-white/5"
          }`}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          Receitas ({incomeCount})
        </button>
        <button
          onClick={() => setFilter("expense")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1.5 ${
            filter === "expense"
              ? "bg-expense/20 text-expense"
              : "text-text-secondary hover:bg-white/5"
          }`}
        >
          <TrendingDown className="h-3.5 w-3.5" />
          Despesas ({expenseCount})
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl glass border border-danger/50 p-4 flex items-center justify-between">
          <p className="text-sm text-danger">{error}</p>
          <button
            onClick={loadCategories}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-text-secondary hover:bg-white/5 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Tentar novamente
          </button>
        </div>
      )}

      {/* Empty state */}
      {!error && filteredCategories.length === 0 && (
        <div className="rounded-xl glass p-12 shadow-lg flex flex-col items-center justify-center text-center">
          <Tag className="h-12 w-12 text-text-muted mb-4" />
          <p className="text-text-muted text-sm">
            {filter !== "all"
              ? `Nenhuma categoria de ${filter === "income" ? "receita" : "despesa"} cadastrada.`
              : "Nenhuma categoria cadastrada. Crie sua primeira categoria para começar!"}
          </p>
        </div>
      )}

      {/* Categories grid */}
      {filteredCategories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCategories.map((category) => (
            <div
              key={category.ID}
              className="rounded-xl glass p-4 shadow-lg flex flex-col gap-3"
            >
              <div className="flex items-start justify-between">
                <CategoryBadge category={category} size="lg" />
                <div className="flex items-center gap-1 ml-2 shrink-0">
                  <button
                    onClick={() => openEdit(category)}
                    className="rounded-lg p-2 text-text-muted hover:text-primary hover:bg-white/5 transition-colors"
                    title="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(category)}
                    className="rounded-lg p-2 text-text-muted hover:text-danger hover:bg-white/5 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium w-fit ${
                  category.CategoryType === "income"
                    ? "bg-income/15 text-income"
                    : "bg-expense/15 text-expense"
                }`}
              >
                {category.CategoryType === "income" ? "Receita" : "Despesa"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {formOpen && (
        <CategoryFormModal
          key={editingCategory?.ID ?? "new"}
          onClose={() => setFormOpen(false)}
          onSubmit={handleFormSubmit}
          category={editingCategory}
          saving={saving}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Excluir Categoria"
        message={`Tem certeza que deseja excluir a categoria "${deleteTarget?.Name}"? Esta ação não pode ser desfeita.`}
        loading={deleting}
      />
    </div>
  );
}
