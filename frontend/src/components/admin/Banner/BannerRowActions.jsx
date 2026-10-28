import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";

const ICON = "h-8 w-8 rounded-lg text-muted-foreground";
const NEUTRAL =
  "hover:bg-navy-50 hover:text-navy-700 dark:hover:bg-navy-500/15 dark:hover:text-navy-100";

// banners.is_active đổi qua PATCH toggle-status; xóa là hard delete (mất ảnh trong DB)
// nên luôn hỏi trước
export const BannerRowActions = ({ banner, onEdit, onToggle, onDelete }) => {
  const isActive = banner.is_active !== false;
  const label = banner.title?.split("|")[0]?.trim() || `#${banner.id}`;
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Sửa banner "${label}"`}
        onClick={() => onEdit?.(banner)}
        className={cn(ICON, NEUTRAL)}
      >
        <Pencil className="h-4 w-4" strokeWidth={2} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label={isActive ? `Tắt banner "${label}"` : `Bật banner "${label}"`}
        title={isActive ? "Tắt khỏi hero slider" : "Cho hiện lại hero slider"}
        onClick={() => onToggle?.(banner)}
        className={cn(ICON, NEUTRAL)}
      >
        {isActive ? (
          <Eye className="h-4 w-4" strokeWidth={2} />
        ) : (
          <EyeOff className="h-4 w-4" strokeWidth={2} />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Xóa banner "${label}"`}
        onClick={() => onDelete?.(banner)}
        className={cn(ICON, "hover:bg-sale-soft hover:text-sale")}
      >
        <Trash2 className="h-4 w-4" strokeWidth={2} />
      </Button>
    </div>
  );
};
