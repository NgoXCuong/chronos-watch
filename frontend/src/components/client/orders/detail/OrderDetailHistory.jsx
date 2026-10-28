import { History } from "lucide-react";
import { ORDER_STATUS } from "@/constants/orderStatus";
import { ORDER_NOTE_FALLBACK } from "@/constants/myOrders";
import { formatDateTime } from "@/utils/formatCurrency";
import { orderHistory } from "@/utils/myOrders";
import OrderDetailPanel from "./OrderDetailPanel";
import { cn } from "@/lib/utils";

const Entry = ({ entry, isLast }) => {
  const meta = ORDER_STATUS[entry.status];

  return (
    <li className="relative flex gap-3 pb-4 last:pb-0">
      {!isLast && (
        <span aria-hidden="true" className="absolute left-[5px] top-3 bottom-0 w-px bg-border" />
      )}
      <span
        className={cn(
          "relative z-10 mt-1.5 size-[11px] shrink-0 rounded-full ring-4 ring-card",
          meta?.dot || "bg-navy-300",
        )}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <p className="text-[13px] font-bold text-foreground">{meta?.label || entry.status}</p>
          <p className="text-[12px] tabular-nums text-muted-foreground">
            {formatDateTime(entry.created_at)}
          </p>
        </div>
        <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">
          {entry.note || ORDER_NOTE_FALLBACK}
        </p>
      </div>
    </li>
  );
};

/** Lịch sử do backend ghi ở mọi lần đổi trạng thái — hiển thị đủ, không cắt 3 dòng. */
const OrderDetailHistory = ({ order, className }) => {
  const entries = orderHistory(order);

  return (
    <OrderDetailPanel title="Lịch sử đơn hàng" icon={History} className={className}>
      {entries.length === 0 ? (
        <p className="py-2 text-[13px] text-muted-foreground">
          Chưa có mốc nào được ghi cho đơn này.
        </p>
      ) : (
        <ol>
          {entries.map((entry, index) => (
            <Entry key={entry.id ?? `${entry.status}-${index}`} entry={entry} isLast={index === entries.length - 1} />
          ))}
        </ol>
      )}
    </OrderDetailPanel>
  );
};

export default OrderDetailHistory;
