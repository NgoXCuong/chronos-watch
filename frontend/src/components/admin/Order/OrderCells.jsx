import { Badge } from "../../ui/badge";
import { cn } from "../../../lib/utils";
import {
  ORDER_STATUS,
  ORDER_STATUS_BADGE,
  statusLabel,
} from "../../../constants/orderStatus";

export const OrderStatusBadge = ({ status }) => (
  <Badge variant={ORDER_STATUS_BADGE[status] ?? "muted"}>
    <span
      className={cn("h-1.5 w-1.5 rounded-full", ORDER_STATUS[status]?.dot)}
    />
    {statusLabel(status)}
  </Badge>
);

export const OrderCustomerCell = ({ order }) => {
  const name =
    order.full_name ||
    order.user?.full_name ||
    order.user?.username ||
    "Khách vãng lai";
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-50 text-[12px] font-bold text-navy-700 dark:bg-navy-500/15 dark:text-navy-100">
        {name.charAt(0).toUpperCase()}
      </span>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-semibold text-card-foreground">
          {name}
        </p>
        <p className="truncate text-[11px] text-muted-foreground">
          {order.phone_number || order.user?.email || "Chưa cập nhật"}
        </p>
      </div>
    </div>
  );
};
