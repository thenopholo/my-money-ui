import { createElement } from "react";
import { getCategoryIconComponent } from "../../utils/category-icons.ts";
import { DEFAULT_CATEGORY_COLOR } from "../../utils/category-colors.ts";
import { DEFAULT_CATEGORY_ICON } from "../../utils/category-icons.ts";
import type { Category } from "../../models/entities.ts";

interface CategoryBadgeProps {
  category: Pick<Category, "Name" | "Color" | "Icon">;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const sizeConfig = {
  sm: { circle: 24, icon: 12, text: "text-xs" },
  md: { circle: 32, icon: 16, text: "text-sm" },
  lg: { circle: 40, icon: 20, text: "text-base" },
} as const;

export function CategoryBadge({
  category,
  size = "md",
  showLabel = true,
}: CategoryBadgeProps) {
  const config = sizeConfig[size];
  const color = category.Color ?? DEFAULT_CATEGORY_COLOR;
  const iconName = category.Icon ?? DEFAULT_CATEGORY_ICON;

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center justify-center rounded-full shrink-0"
        style={{
          width: config.circle,
          height: config.circle,
          backgroundColor: `${color}33`,
        }}
      >
        {createElement(getCategoryIconComponent(iconName), {
          style: { color, width: config.icon, height: config.icon },
        })}
      </div>
      {showLabel && (
        <span className={`${config.text} font-medium`}>{category.Name}</span>
      )}
    </div>
  );
}
