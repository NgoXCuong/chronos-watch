import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";

const ICON = "h-8 w-8 rounded-lg text-muted-foreground";

// Row action của bảng sản phẩm — chỉ icon ghost + Lucide (Rule 3, AGENTS.md)
export const ProductRowActions = ({ product, onView, onEdit, onDelete }) => {
  // Sản phẩm ngừng bán không mở được trang công khai và không cần "xóa" lần nữa.
  const isActive = product.status !== "inactive";

  return (
    <div className="flex items-center justify-end gap-1">
      {isActive && (
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Xem trang "${product.name}"`}
          onClick={() => onView?.(product.slug)}
          className={cn(ICON, "hover:bg-navy-50 hover:text-navy-700 dark:hover:bg-navy-500/15 dark:hover:text-navy-100")}
        >
          <Eye className="h-4 w-4" strokeWidth={2} />
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Sửa "${product.name}"`}
        onClick={() => onEdit?.(product.id)}
        className={cn(ICON, "hover:bg-navy-50 hover:text-navy-700 dark:hover:bg-navy-500/15 dark:hover:text-navy-100")}
      >
        <Pencil className="h-4 w-4" strokeWidth={2} />
      </Button>
      {isActive && (
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Xóa "${product.name}"`}
          onClick={() => onDelete?.(product)}
          className={cn(ICON, "hover:bg-sale-soft hover:text-sale")}
        >
          <Trash2 className="h-4 w-4" strokeWidth={2} />
        </Button>
      )}
    </div>
  );
};
