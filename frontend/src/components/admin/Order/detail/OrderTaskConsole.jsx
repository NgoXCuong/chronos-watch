import {
  ArrowLeft,
  Ban,
  Banknote,
  CheckCircle2,
  Printer,
  Sparkles,
  XCircle,
} from "lucide-react";
import { Button } from "../../../ui/button";
import { cn } from "@/lib/utils";
import { formatDateTime } from "../../../../utils/formatCurrency";
import { OrderMoneyPanel } from "./OrderMoneyPanel";
import OrderStatusStepper from "./OrderStatusStepper";
import {
  COLLECT_PAYMENT_LABELS,
  MANUAL_PAYMENT_METHODS,
  NEXT_STEP_ACTION,
} from "../../../../constants/orderStatus";
import { OrderStatusBadge } from "../OrderCells";

const PAYMENT_HINT = {
  cod: "Thu tiền mặt khi khách nhận hàng.",
  banking: "Xác nhận sau khi nhận được chuyển khoản.",
  sepay: "Xác nhận sau khi webhook báo đã có tiền.",
};

const CollectButton = ({ order, updating, onMarkAsPaid }) => {
  if (
    order.payment_status === "paid" ||
    !MANUAL_PAYMENT_METHODS.includes(order.payment_method)
  )
    return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        onClick={onMarkAsPaid}
        disabled={updating}
        className="h-10 gap-2 rounded-lg border-white/35 bg-transparent text-[13px] font-semibold text-white hover:bg-white/12 hover:text-white"
      >
        <Banknote className="h-4 w-4" strokeWidth={2} />
        {COLLECT_PAYMENT_LABELS[order.payment_method] ?? "Đã thu tiền"}
      </Button>
      <span className="text-[11px] text-white/55">
        {PAYMENT_HINT[order.payment_method] ?? "Chờ xác nhận đã nhận tiền."}
      </span>
    </div>
  );
};

// Khối việc cần làm ngay: một hành động chính + thu tiền + hủy
const ActionPanel = ({ order, updating, onAdvance, onMarkAsPaid, onCancel }) => {
  const step = NEXT_STEP_ACTION[order.status];
  const canCancel = ["pending", "confirmed", "processing"].includes(order.status);

  if (!step) {
    const closed = order.status === "delivered";
    return (
      <div
        className={cn(
          "flex flex-col gap-3.5 p-5",
          closed
            ? "bg-success-soft/70 dark:bg-success/10"
            : "bg-sale-soft/70 dark:bg-sale/10",
        )}
      >
        <div className="flex items-center gap-2.5">
          {closed ? (
            <CheckCircle2
              className="h-5 w-5 shrink-0 text-success"
              strokeWidth={2}
            />
          ) : (
            <XCircle className="h-5 w-5 shrink-0 text-sale" strokeWidth={2} />
          )}
          <h3 className="text-[15px] font-extrabold text-card-foreground">
            {closed
              ? "Giao dịch đã hoàn tất"
              : `Đơn đã ${order.status === "returned" ? "hoàn trả" : "hủy"}`}
          </h3>
        </div>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          {closed
            ? "Doanh thu đã được ghi nhận. Không còn thao tác nào cần xử lý."
            : "Tồn kho và voucher đã được đối soát hoàn lại. Không thể chuyển trạng thái."}
        </p>
        {closed && (
          <CollectButton
            order={order}
            updating={updating}
            onMarkAsPaid={onMarkAsPaid}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 bg-navy-900 p-5 text-white dark:bg-navy-800">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-navy-200" strokeWidth={2} />
        <span className="text-xs font-bold uppercase tracking-[0.02em] text-navy-200">
          Cần làm ngay
        </span>
      </div>

      <div className="min-w-0">
        <h3 className="text-[17px] font-extrabold leading-snug">{step.title}</h3>
        <p className="mt-1 text-[13px] leading-relaxed text-white/60">
          {step.hint}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={() => onAdvance(step.status)}
          disabled={updating}
          className="h-10 min-w-[190px] flex-1 bg-white text-[13px] font-bold text-navy-900 hover:bg-navy-50"
        >
          {updating ? "Đang xử lý…" : step.label}
        </Button>
        {canCancel && (
          <Button
            variant="ghost"
            onClick={onCancel}
            disabled={updating}
            className="h-10 gap-2 rounded-lg px-3.5 text-[13px] font-semibold text-white/70 hover:bg-white/12 hover:text-white"
          >
            <Ban className="h-4 w-4" strokeWidth={2} />
            Hủy đơn
          </Button>
        )}
      </div>

      <CollectButton
        order={order}
        updating={updating}
        onMarkAsPaid={onMarkAsPaid}
      />
    </div>
  );
};

// Bảng điều khiển tác vụ: danh tính đơn + việc cần làm ngay + tiền + dòng chảy trạng thái
const OrderTaskConsole = ({
  order,
  updating,
  onBack,
  onPrint,
  onAdvance,
  onMarkAsPaid,
  onCancel,
}) => (
  <section className="overflow-hidden rounded-xl border border-border bg-card shadow-card print:hidden">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Quay lại danh sách đơn hàng"
          onClick={onBack}
          className="h-9 w-9 shrink-0 rounded-lg border border-border bg-muted/50 text-muted-foreground hover:bg-navy-50 hover:text-navy-700 dark:hover:bg-navy-500/15 dark:hover:text-navy-100"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
        </Button>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.02em] text-muted-foreground">
            Đơn hàng
          </p>
          <p className="truncate font-mono text-[15px] font-extrabold leading-tight text-foreground">
            {order.order_code || `#${order.id}`}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span className="hidden text-[12px] text-muted-foreground sm:block">
          Đặt lúc {formatDateTime(order.created_at)}
        </span>
        <Button
          variant="outline"
          onClick={onPrint}
          className="h-9 gap-2 rounded-lg border-border px-3.5 text-[13px]"
        >
          <Printer className="h-4 w-4" strokeWidth={2} />
          In hóa đơn
        </Button>
      </div>
    </div>

    <div className="grid gap-px bg-border lg:grid-cols-[minmax(0,1fr)_300px]">
      <ActionPanel
        order={order}
        updating={updating}
        onAdvance={onAdvance}
        onMarkAsPaid={onMarkAsPaid}
        onCancel={onCancel}
      />
      <OrderMoneyPanel order={order} />
    </div>

    <div className="border-t border-border bg-navy-50/50 px-5 py-4 dark:bg-navy-500/8">
      <OrderStatusStepper status={order.status} history={order.history} />
    </div>
  </section>
);

export default OrderTaskConsole;
