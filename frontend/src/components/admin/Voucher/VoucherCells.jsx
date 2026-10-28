import { Badge } from "../../ui/badge";
import { formatDate, formatCompactVnd } from "../../../utils/formatCurrency";
import { getVoucherStatus, isVoucherExhausted } from "../../../utils/voucherStatus";

// code là chuỗi người dùng gõ ở checkout nên trình bày mono, không tô màu amber cũ
export const VoucherCodeCell = ({ code }) => (
  <span className="block truncate font-mono text-[13px] font-bold tracking-tight text-navy-700 dark:text-navy-100">
    {code}
  </span>
);

export const VoucherTypeBadge = ({ value }) => (
  <Badge variant={value === "percentage" ? "teal" : "violet"}>
    {value === "percentage" ? "Phần trăm" : "Số tiền"}
  </Badge>
);

// percentage → "15%" + mức trần; fixed → "500k"
export const VoucherValueCell = ({ row }) => {
  const isPercent = row.discount_type === "percentage";
  return (
    <span className="block min-w-0 leading-tight">
      <span className="text-[13px] font-extrabold tabular-nums text-foreground">
        {isPercent
          ? `${Number(row.discount_value)}%`
          : formatCompactVnd(row.discount_value)}
      </span>
      {isPercent && Number(row.max_discount) > 0 && (
        <span className="block text-[11px] tabular-nums text-muted-foreground">
          trần {formatCompactVnd(row.max_discount)}
        </span>
      )}
    </span>
  );
};

export const VoucherMinOrderCell = ({ value }) => (
  <span className="text-[13px] tabular-nums text-muted-foreground">
    {Number(value) > 0 ? formatCompactVnd(value) : "Không yêu cầu"}
  </span>
);

// usage_limit NULL = không giới hạn; per_user_limit NULL = mỗi người dùng thoải mái
export const VoucherUsageCell = ({ row }) => {
  const limit = row.usage_limit === null || row.usage_limit === undefined ? "∞" : Number(row.usage_limit);
  return (
    <span className="block min-w-0 leading-tight">
      <span
        className={
          isVoucherExhausted(row)
            ? "text-[13px] font-bold tabular-nums text-sale"
            : "text-[13px] font-semibold tabular-nums text-foreground"
        }
      >
        {Number(row.used_count || 0)}/{limit}
      </span>
      <span className="block text-[11px] text-muted-foreground">
        {row.per_user_limit === null || row.per_user_limit === undefined
          ? "mọi lượt / người"
          : `${Number(row.per_user_limit)} lượt / người`}
      </span>
    </span>
  );
};

export const VoucherWindowCell = ({ row }) => (
  <span className="block min-w-0 whitespace-nowrap text-[11px] tabular-nums leading-tight text-muted-foreground">
    <span className="block">từ {formatDate(row.start_date)}</span>
    <span className="block">đến {formatDate(row.end_date)}</span>
  </span>
);

export const VoucherStatusBadge = ({ row, now }) => {
  const status = getVoucherStatus(row, now);
  return <Badge variant={status.variant}>{status.label}</Badge>;
};
