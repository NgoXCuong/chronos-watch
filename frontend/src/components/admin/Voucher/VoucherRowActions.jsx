import { Pencil, Power, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";

const ICON = "h-8 w-8 rounded-lg text-muted-foreground";
const NEUTRAL =
  "hover:bg-navy-50 hover:text-navy-700 dark:hover:bg-navy-500/15 dark:hover:text-navy-100";

// status (active/inactive) đổi qua PATCH /vouchers/:id/status; xóa là hard delete
// (voucher đã dùng vẫn còn lịch sử trong voucher_usages) nên luôn hỏi trước
export const VoucherRowActions = ({ voucher, onEdit, onToggle, onDelete }) => {
  const isActive = voucher.status !== "inactive";
  const label = voucher.code || `#${voucher.id}`;

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Sửa voucher "${label}"`}
        onClick={() => onEdit?.(voucher)}
        className={cn(ICON, NEUTRAL)}
      >
        <Pencil className="h-4 w-4" strokeWidth={2} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label={isActive ? `Tắt voucher "${label}"` : `Bật voucher "${label}"`}
        title={
          isActive
            ? "Tạm ngưng, khách không nhập mã được nữa"
            : "Cho phép dùng lại mã này"
        }
        onClick={() => onToggle?.(voucher)}
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
        aria-label={`Xóa voucher "${label}"`}
        onClick={() => onDelete?.(voucher)}
        className={cn(ICON, "hover:bg-sale-soft hover:text-sale")}
      >
        <Trash2 className="h-4 w-4" strokeWidth={2} />
      </Button>
    </div>
  );
};
