import { Pencil, Power, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";

const ICON = "h-8 w-8 rounded-lg text-muted-foreground";
const NEUTRAL =
  "hover:bg-navy-50 hover:text-navy-700 dark:hover:bg-navy-500/15 dark:hover:text-navy-100";

// status (active/inactive) đổi qua PATCH /admin/flash-sales/:id/status.
// Xóa là hard delete (flash_sale_items + snapshot giá trong đơn hàng bị ảnh hưởng) nên
// trang gọi luôn hỏi trước — ở đây chỉ dựng nút ghost + icon theo Rule 3.
export const FlashSaleRowActions = ({ sale, onEdit, onToggle, onDelete }) => {
  const isActive = sale.status !== "inactive";
  const label = sale.name || `#${sale.id}`;

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Sửa đợt "${label}"`}
        onClick={() => onEdit?.(sale)}
        className={cn(ICON, NEUTRAL)}
      >
        <Pencil className="h-4 w-4" strokeWidth={2} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label={isActive ? `Tắt đợt "${label}"` : `Bật đợt "${label}"`}
        title={
          isActive
            ? "Tắt đợt, khách không mua được giá Flash nữa"
            : "Bật lại đợt này (backend chặn trùng lịch với đợt đang bật khác)"
        }
        onClick={() => onToggle?.(sale)}
        className={cn(
          ICON,
          isActive
            ? "text-navy-600 hover:bg-navy-50 hover:text-navy-700 dark:text-navy-200"
            : NEUTRAL,
        )}
      >
        <Power className="h-4 w-4" strokeWidth={2} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Xóa đợt "${label}"`}
        onClick={() => onDelete?.(sale)}
        className={cn(ICON, "hover:bg-sale-soft hover:text-sale")}
      >
        <Trash2 className="h-4 w-4" strokeWidth={2} />
      </Button>
    </div>
  );
};
