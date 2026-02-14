import React, { createElement, useState } from "react";
import { Loader2, TrendingUp, TrendingDown } from "lucide-react";
import { CATEGORY_COLORS } from "../../utils/category-colors.ts";
import { getDefaultColorByType } from "../../utils/category-colors.ts";
import { CATEGORY_ICONS, getCategoryIconComponent, DEFAULT_CATEGORY_ICON } from "../../utils/category-icons.ts";
import { CategoryBadge } from "./CategoryBadge.tsx";
import type { Category } from "../../models/entities.ts";
import type { CreateCategoryRequest, UpdateCategoryRequest } from "../../models/dtos.ts";
import type { CategoryType } from "../../models/enums.ts";

function IconPickerItem({
  iconName,
  selected,
  onClick,
  label,
}: {
  iconName: string;
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-1 rounded-lg p-2 transition-all ${
        selected
          ? "bg-primary-dim border border-primary"
          : "hover:bg-white/5 border border-transparent"
      }`}
      title={label}
    >
      {createElement(getCategoryIconComponent(iconName), { className: "h-5 w-5" })}
    </button>
  );
}

interface CategoryFormModalProps {
  onClose: () => void;
  onSubmit: (data: CreateCategoryRequest | UpdateCategoryRequest) => Promise<void>;
  category?: Category;
  saving: boolean;
}

export function CategoryFormModal({
  onClose,
  onSubmit,
  category,
  saving,
}: CategoryFormModalProps) {
  const isEdit = !!category;

  const [name, setName] = useState(category?.Name ?? "");
  const [categoryType, setCategoryType] = useState<CategoryType>(
    category?.CategoryType ?? "expense"
  );
  const [color, setColor] = useState<string | null>(category?.Color ?? null);
  const [icon, setIcon] = useState<string | null>(category?.Icon ?? null);
  const [error, setError] = useState("");

  const effectiveColor = color ?? getDefaultColorByType(categoryType);
  const effectiveIcon = icon ?? DEFAULT_CATEGORY_ICON;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Nome é obrigatório.");
      return;
    }

    try {
      const data: CreateCategoryRequest = {
        name: name.trim(),
        category_type: categoryType,
        color: color || null,
        icon: icon || null,
      };
      await onSubmit(data);
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro inesperado.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="rounded-2xl bg-surface ring-1 ring-white/10 p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
        <h2 className="text-lg font-semibold mb-4">
          {isEdit ? "Editar Categoria" : "Nova Categoria"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label htmlFor="categoryName" className="block text-sm text-text-secondary mb-1">
              Nome
            </label>
            <input
              id="categoryName"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg bg-[#050505] border border-white/10 px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-white/20"
              placeholder="Ex: Alimentação, Salário, Transporte"
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm text-text-secondary mb-1">Tipo</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCategoryType("income")}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  categoryType === "income"
                    ? "bg-income/20 text-income border border-income/50"
                    : "bg-white/5 text-text-secondary border border-white/10"
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                Receita
              </button>
              <button
                type="button"
                onClick={() => setCategoryType("expense")}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  categoryType === "expense"
                    ? "bg-expense/20 text-expense border border-expense/50"
                    : "bg-white/5 text-text-secondary border border-white/10"
                }`}
              >
                <TrendingDown className="h-4 w-4" />
                Despesa
              </button>
            </div>
          </div>

          {/* Cor */}
          <div>
            <label className="block text-sm text-text-secondary mb-1">Cor</label>
            <div className="grid grid-cols-6 gap-2">
              {CATEGORY_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    color === c.value
                      ? "border-white scale-110"
                      : "border-transparent hover:border-text-muted"
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Ícone */}
          <div>
            <label className="block text-sm text-text-secondary mb-1">Ícone</label>
            <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto">
              {CATEGORY_ICONS.map((item) => (
                <IconPickerItem
                  key={item.name}
                  iconName={item.name}
                  selected={icon === item.name}
                  onClick={() => setIcon(item.name)}
                  label={item.label}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm text-text-secondary mb-1">Preview</label>
            <div className="rounded-lg bg-white/5 border border-white/10 p-3">
              <CategoryBadge
                category={{
                  Name: name || "Categoria",
                  Color: effectiveColor,
                  Icon: effectiveIcon,
                }}
                size="lg"
              />
            </div>
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-full border border-white/10 px-4 py-2.5 text-sm text-text-secondary hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 btn-glow text-white font-semibold px-4 py-2.5 text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "Salvar Alterações" : "Criar Categoria"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
