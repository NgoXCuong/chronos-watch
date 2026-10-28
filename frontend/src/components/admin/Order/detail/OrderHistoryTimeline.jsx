import { History } from "lucide-react";
import DetailSection from "./DetailSection";
import { cn } from "@/lib/utils";
import { formatDateTime } from "../../../../utils/formatCurrency";
import {
  ORDER_STATUS,
  statusLabel,
} from "../../../../constants/orderStatus";

const Entry = ({ entry, isLast }) => (
  <li className="relative flex gap-4 pb-5 last:pb-0">
    {!isLast && (
      <span
        aria-hidden="true"
        className="absolute left-[7px] top-4 bottom-0 w-px bg-border"
      />
    )}
    <span
      className={cn(
        "relative z-10 mt-1 h-[15px] w-[15px] shrink-0 rounded-full border-2 border-card",
        ORDER_STATUS[entry.status]?.dot || "bg-navy-500",
      )}
    />
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className="text-[13px] font-bold text-navy-700 dark:text-navy-100">
          {statusLabel(entry.status)}
        </span>
        <span className="text-[11px] tabular-nums text-muted-foreground">
          {formatDateTime(entry.created_at)}
        </span>
      </div>
      <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">
        {entry.note || "Hệ thống ghi nhận."}
      </p>
    </div>
  </li>
);

// Nhật ký chuyển trạng thái (bảng order_histories)
const OrderHistoryTimeline = ({ history = [] }) => (
  <DetailSection
    title="Lịch sử điều phối"
    icon={History}
    actions={
      <span className="text-[11px] font-semibold text-muted-foreground">
        {history.length} mốc
      </span>
    }
  >
    {history.length === 0 ? (
      <p className="text-[13px] text-muted-foreground">
        Chưa có mốc nào được ghi nhận.
      </p>
    ) : (
      <ol className="relative">
        {history.map((entry, idx) => (
          <Entry
            key={entry.id || `${entry.status}-${idx}`}
            entry={entry}
            isLast={idx === history.length - 1}
          />
        ))}
      </ol>
    )}
  </DetailSection>
);

export default OrderHistoryTimeline;
