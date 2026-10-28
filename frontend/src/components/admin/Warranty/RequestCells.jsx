import { Badge } from "../../ui/badge";
import { cn } from "@/lib/utils";
import { formatDate, formatRelativeTime } from "../../../utils/formatCurrency";
import { WARRANTY_REQUEST_STATUS } from "../../../constants/warrantyStatus";
import { WarrantyStateBadge } from "./WarrantyCells";

/** Ô cell của bảng yêu cầu bảo hành — chỉ export component (rule react-refresh). */

export const RequestStatusBadge = ({ status }) => {
  const cfg = WARRANTY_REQUEST_STATUS[status];
  if (!cfg) return <Badge variant="muted">{status || "—"}</Badge>;
  return (
    <Badge variant={cfg.badge} className="gap-1.5">
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </Badge>
  );
};

// row.warranty là object rút gọn từ backend; warranty_state = trạng thái phiếu cha
export const RequestWarrantyCell = ({ row }) => (
  <span className="block min-w-0 leading-tight">
    <span className="block truncate font-mono text-[13px] font-semibold tabular-nums text-navy-700 dark:text-navy-100">
      {row.warranty?.code || "—"}
    </span>
    <span className="block truncate text-[11px] text-muted-foreground">
      {row.warranty?.product_name || "Không rõ sản phẩm"}
    </span>
    <span className="mt-1 inline-block">
      <WarrantyStateBadge state={row.warranty_state} />
    </span>
  </span>
);

export const RequestCustomerCell = ({ row }) => {
  const customer = row.customer ?? {};
  return (
    <span className="block min-w-0 leading-tight">
      <span className="block truncate text-[13px] font-semibold text-foreground">
        {customer.full_name?.trim() || customer.username || "—"}
      </span>
      <span className="block truncate text-[11px] text-muted-foreground">
        {customer.email || (customer.phone ? `SĐT ${customer.phone}` : "không email")}
      </span>
    </span>
  );
};

export const RequestIssueCell = ({ row }) => (
  <p className="line-clamp-2 min-w-0 text-[12px] leading-snug text-card-foreground">
    {row.issue || "Khách không mô tả thêm"}
  </p>
);

export const RequestDateCell = ({ row }) => (
  <span className="block min-w-0 whitespace-nowrap leading-tight">
    <span className="block text-[12px] tabular-nums text-foreground">
      {formatDate(row.created_at)}
    </span>
    <span className="block text-[11px] text-muted-foreground">
      {row.created_at ? formatRelativeTime(row.created_at) : "—"}
    </span>
    {row.replied_at && (
      <span className="block text-[11px] text-muted-foreground">
        phản hồi {formatDate(row.replied_at)}
      </span>
    )}
  </span>
);
