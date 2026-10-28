import { Badge } from "../../ui/badge";
import { cn } from "@/lib/utils";
import { formatDateTime } from "../../../utils/formatCurrency";
import { flashSoldPercent, getFlashStateBadge } from "../../../utils/flashSale";

// Ô trạng thái: `state` do backend suy ra (không có cột nào trong DB) — UI chỉ vẽ badge
export const FlashSaleStateBadge = ({ state }) => {
  const badge = getFlashStateBadge(state);
  return (
    <Badge variant={badge.variant} className="gap-1.5">
      {badge.dot && <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", badge.dot)} />}
      {badge.label}
    </Badge>
  );
};

// Tên đợt + mô tả phụ (mô tả để đọc nhanh, không bấm vào là sửa cả trang)
export const FlashSaleNameCell = ({ sale }) => (
  <div className="min-w-0">
    <p className="truncate text-[13px] font-semibold text-card-foreground">{sale.name}</p>
    <p className="truncate text-[11px] text-muted-foreground">
      {sale.description || `Đợt #${sale.id}`}
    </p>
  </div>
);

export const FlashSaleItemCountCell = ({ count }) => (
  <span className="block leading-tight">
    <span className="text-[13px] font-bold tabular-nums text-foreground">
      {Number(count) || 0}
    </span>
    <span className="block text-[11px] text-muted-foreground">sản phẩm flash</span>
  </span>
);

// Đã bán / tổng suất + thanh tiến trình. flashSoldPercent mong đợi {quota, sold_count}
// nên phải đổi tên cột tổng hợp của danh sách (quota_units/sold_units) sang ô đó.
export const FlashSaleSoldCell = ({ sale }) => {
  const sold = Number(sale.sold_units) || 0;
  const quota = Number(sale.quota_units) || 0;
  const percent = flashSoldPercent({ quota, sold_count: sold });

  return (
    <div className="min-w-0 leading-tight">
      <div className="flex items-center gap-1.5">
        <span className="text-[13px] font-bold tabular-nums text-foreground">{sold}</span>
        <span className="text-[11px] tabular-nums text-muted-foreground">/ {quota} suất</span>
        <Badge variant="teal" className="ml-auto tabular-nums">
          {percent}%
        </Badge>
      </div>
      <span className="mt-1.5 block h-1 w-full overflow-hidden rounded-full bg-muted">
        <span
          className={cn(
            "block h-full rounded-full transition-all",
            percent >= 100 ? "bg-sale" : "bg-navy-600 dark:bg-navy-300",
          )}
          style={{ width: `${percent}%` }}
        />
      </span>
    </div>
  );
};

// Flash Sale bán theo KHUNG GIỜ (DATETIME) nên lịch hiển thị cả giờ, không chỉ ngày
export const FlashSaleWindowCell = ({ sale }) => (
  <span className="block min-w-0 whitespace-nowrap text-[11px] tabular-nums leading-tight text-muted-foreground">
    <span className="block">từ {formatDateTime(sale.start_date)}</span>
    <span className="block">đến {formatDateTime(sale.end_date)}</span>
  </span>
);
