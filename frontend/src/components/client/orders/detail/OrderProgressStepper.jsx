import { Info } from "lucide-react";
import { ORDER_STATUS, ORDER_STATUS_FLOW } from "@/constants/orderStatus";
import { MY_ORDER_STEP_HINTS } from "@/constants/myOrders";
import { isClosedOrder } from "@/utils/myOrders";
import { cn } from "@/lib/utils";

const CLOSED_TONES = {
  cancelled: "border-sale/25 bg-sale-soft text-sale",
  returned: "border-border bg-muted text-muted-foreground",
};

/** Đơn bị hủy/hoàn: thay stepper bằng một dòng cho biết hành trình đã dừng ở đâu. */
const ClosedOrderBanner = ({ order }) => {
  const status = ORDER_STATUS[order.status] || ORDER_STATUS.cancelled;
  const Icon = status.icon;
  return (
    <div className="space-y-2">
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border px-4 py-3",
          CLOSED_TONES[order.status] || CLOSED_TONES.cancelled,
        )}
      >
        <Icon size={18} strokeWidth={2} aria-hidden="true" />
        <p className="text-[13px] font-bold uppercase tracking-[0.02em]">
          {status.label} — hành trình dừng tại đây
        </p>
      </div>
      {order.cancel_reason && (
        <p className="text-[12px] leading-relaxed text-muted-foreground">
          Lý do: {order.cancel_reason}
        </p>
      )}
    </div>
  );
};

const Step = ({ stepKey, index, currentIndex }) => {
  const meta = ORDER_STATUS[stepKey];
  const Icon = meta.icon;
  const done = index <= currentIndex;
  const current = index === currentIndex;

  return (
    <li className="relative flex flex-col items-center gap-2 text-center">
      <span
        className={cn(
          "z-10 flex size-9 items-center justify-center rounded-full border-2 transition-colors",
          done
            ? "border-navy-600 bg-navy-600 text-white shadow-card"
            : "border-border bg-card text-muted-foreground",
          current && "ring-4 ring-navy-500/15",
        )}
      >
        <Icon size={15} strokeWidth={2} aria-hidden="true" />
      </span>
      <span
        className={cn(
          "text-[12px] font-bold uppercase tracking-[0.02em]",
          done ? "text-navy-700" : "text-muted-foreground",
        )}
      >
        {meta.label}
      </span>
    </li>
  );
};

/**
 * Stepper 5 mốc giao hàng (ORDER_STATUS_FLOW) — mốc sáng theo trạng thái THẬT của đơn,
 * không phải theo thứ tự khách bấm. Mobile: một dòng "bước i/5" gọn.
 */
const OrderProgressStepper = ({ order }) => {
  if (isClosedOrder(order)) return <ClosedOrderBanner order={order} />;

  const currentIndex = Math.max(
    0,
    ORDER_STATUS_FLOW.indexOf(order.status),
  );
  const currentMeta = ORDER_STATUS[order.status] || ORDER_STATUS.pending;

  return (
    <div className="space-y-4">
      <ol className="relative flex justify-between gap-3 sm:grid sm:grid-cols-5">
        <span
          aria-hidden="true"
          className="absolute left-[8%] right-[8%] top-4 hidden h-px bg-border sm:block"
        />
        <span
          aria-hidden="true"
          className="absolute left-[8%] top-4 hidden h-px bg-navy-600 transition-all duration-500 sm:block"
          style={{ width: `${(currentIndex / (ORDER_STATUS_FLOW.length - 1)) * 84}%` }}
        />
        {ORDER_STATUS_FLOW.map((stepKey, index) => (
          <Step key={stepKey} stepKey={stepKey} index={index} currentIndex={currentIndex} />
        ))}
      </ol>

      <p className="flex items-start gap-2 text-[12px] leading-relaxed text-muted-foreground">
        <Info
          size={13}
          strokeWidth={2}
          className="mt-0.5 shrink-0 text-navy-300"
          aria-hidden="true"
        />
        <span>
          <span className="font-bold text-navy-700">
            Bước {currentIndex + 1}/{ORDER_STATUS_FLOW.length} · {currentMeta.label}:
          </span>{" "}
          {MY_ORDER_STEP_HINTS[order.status] || "Chronos đang cập nhật tiến trình đơn của bạn."}
        </span>
      </p>
    </div>
  );
};

export default OrderProgressStepper;
