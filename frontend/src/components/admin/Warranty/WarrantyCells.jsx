import { Badge } from "../../ui/badge";
import { cn } from "@/lib/utils";
import { formatDate } from "../../../utils/formatCurrency";
import { WARRANTY_STATE } from "../../../constants/warrantyStatus";

/** Ô cell của bảng phiếu bảo hành — chỉ export component (rule react-refresh). */

// `state` do backend suy ra (row.state) — không bao giờ badge từ row.status đơn thuần
export const WarrantyStateBadge = ({ state }) => {
  const cfg = WARRANTY_STATE[state];
  if (!cfg) return <Badge variant="muted">{state || "—"}</Badge>;
  return (
    <Badge variant={cfg.badge} className="gap-1.5">
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </Badge>
  );
};

// Mã phiếu / serial: chuỗi đối chiếu thủ công nên trình bày mono
export const WarrantyMonoCell = ({ value, empty = "—" }) =>
  value ? (
    <span className="block truncate font-mono text-[13px] font-semibold tabular-nums text-navy-700 dark:text-navy-100">
      {value}
    </span>
  ) : (
    <span className="block text-[13px] text-muted-foreground">{empty}</span>
  );

export const WarrantyProductCell = ({ row }) => (
  <span className="block min-w-0 leading-tight">
    <span className="block truncate text-[13px] font-semibold text-foreground">
      {row.product_name || "—"}
    </span>
    <span className="block truncate font-mono text-[11px] tabular-nums text-muted-foreground">
      {row.sku || "không SKU"}
    </span>
  </span>
);

export const WarrantyCustomerCell = ({ row }) => {
  const customer = row.user ?? {};
  const secondary =
    customer.email || (customer.phone ? `SĐT ${customer.phone}` : "không email");
  return (
    <span className="block min-w-0 leading-tight">
      <span className="block truncate text-[13px] font-semibold text-foreground">
        {customer.full_name?.trim() || customer.username || "—"}
      </span>
      <span className="block truncate text-[11px] text-muted-foreground">{secondary}</span>
    </span>
  );
};

export const WarrantyTermCell = ({ row }) => {
  const months = Number(row.warranty_months) || 0;
  return (
    <span className="block min-w-0 whitespace-nowrap leading-tight">
      <span className="block text-[11px] tabular-nums text-muted-foreground">
        từ {formatDate(row.start_date)}
      </span>
      <span className="block text-[11px] tabular-nums text-muted-foreground">
        đến {formatDate(row.end_date)}
      </span>
      {months > 0 && (
        <span className="block text-[11px] font-semibold text-navy-700 dark:text-navy-100">
          {months} tháng
        </span>
      )}
    </span>
  );
};

// Thanh tiến trình đọc thẳng progress.usedPercent — backend tính, UI không suy lại ngày
export const WarrantyProgressCell = ({ row }) => {
  const progress = row.progress;
  if (!progress) return <span className="block text-[13px] text-muted-foreground">—</span>;
  const ended = Number(progress.leftDays) <= 0;
  return (
    <span className="block min-w-0 leading-tight">
      <span className="block h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <span
          className={cn(
            "block h-full rounded-full",
            ended ? "bg-sale" : "bg-navy-600 dark:bg-navy-300",
          )}
          style={{
            width: `${Math.min(100, Math.max(2, Number(progress.usedPercent) || 0))}%`,
          }}
        />
      </span>
      <span
        className={cn(
          "mt-1 block text-[11px] font-semibold tabular-nums",
          ended ? "text-sale" : "text-navy-700 dark:text-navy-100",
        )}
      >
        {ended ? "Đã hết hạn" : `Còn ${progress.leftDays} ngày`}
      </span>
      <span className="block text-[11px] tabular-nums text-muted-foreground">
        dùng {progress.usedPercent}% thời hạn
      </span>
    </span>
  );
};

export const WarrantyOrderCell = ({ row }) =>
  row.order?.order_code ? (
    <span className="block min-w-0 leading-tight">
      <span className="block truncate font-mono text-[12px] tabular-nums text-navy-700 dark:text-navy-100">
        {row.order.order_code}
      </span>
      <span className="block text-[11px] text-muted-foreground">
        phiếu sinh từ đơn này
      </span>
    </span>
  ) : (
    <span className="block text-[13px] text-muted-foreground">—</span>
  );
