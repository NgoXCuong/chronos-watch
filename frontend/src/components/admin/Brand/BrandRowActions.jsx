import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";

const ICON = "h-8 w-8 rounded-lg text-muted-foreground";
const NEUTRAL =
  "hover:bg-navy-50 hover:text-navy-700 dark:hover:bg-navy-500/15 dark:hover:text-navy-100";

// brands.is_active đổi qua PATCH toggle-status; xóa là hard delete nên luôn hỏi trước
export const BrandRowActions = ({ brand, onEdit, onToggle, onDelete }) => (
  <div className="flex items-center justify-end gap-1">
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Sửa "${brand.name}"`}
      onClick={() => onEdit?.(brand)}
      className={cn(ICON, NEUTRAL)}
    >
      <Pencil className="h-4 w-4" strokeWidth={2} />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      aria-label={brand.is_active ? `Ẩn "${brand.name}"` : `Hiện "${brand.name}"`}
      title={brand.is_active ? "Ẩn khỏi website" : "Cho hiển thị lại"}
      onClick={() => onToggle?.(brand)}
      className={cn(ICON, NEUTRAL)}
    >
      {brand.is_active ? (
        <Eye className="h-4 w-4" strokeWidth={2} />
      ) : (
        <EyeOff className="h-4 w-4" strokeWidth={2} />
      )}
    </Button>
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Xóa "${brand.name}"`}
      onClick={() => onDelete?.(brand)}
      className={cn(ICON, "hover:bg-sale-soft hover:text-sale")}
    >
      <Trash2 className="h-4 w-4" strokeWidth={2} />
    </Button>
  </div>
);
