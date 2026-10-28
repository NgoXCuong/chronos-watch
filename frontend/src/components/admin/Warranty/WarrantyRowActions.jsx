import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";

const ICON = "h-8 w-8 rounded-lg text-muted-foreground";
const NEUTRAL =
  "hover:bg-navy-50 hover:text-navy-700 dark:hover:bg-navy-500/15 dark:hover:text-navy-100";

// Không có nút toggle ở đây: đổi trạng thái đi qua PATCH /admin/warranties/:id
// (WarrantyEditModal) hoặc bulk SET — để tránh kết quả phụ thuộc trạng thái từng dòng.
export const WarrantyRowActions = ({ warranty, onView, onEdit, onDelete }) => {
  const label = warranty.code || `#${warranty.id}`;

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Xem chi tiết phiếu "${label}"`}
        onClick={() => onView?.(warranty)}
        className={cn(ICON, NEUTRAL)}
      >
        <Eye className="h-4 w-4" strokeWidth={2} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Sửa phiếu "${label}"`}
        title="Cập nhật serial, trạng thái hoặc ghi chú"
        onClick={() => onEdit?.(warranty)}
        className={cn(ICON, NEUTRAL)}
      >
        <Pencil className="h-4 w-4" strokeWidth={2} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Xóa phiếu "${label}"`}
        onClick={() => onDelete?.(warranty)}
        className={cn(ICON, "hover:bg-sale-soft hover:text-sale")}
      >
        <Trash2 className="h-4 w-4" strokeWidth={2} />
      </Button>
    </div>
  );
};
