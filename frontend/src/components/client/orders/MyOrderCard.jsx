import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CalendarDays, CreditCard, Star } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import paymentApi from "@/api/payment.api";
import { ORDER_STATUS } from "@/constants/orderStatus";
import { PAYMENT_LABEL } from "@/constants/checkout";
import { formatCurrency, formatDate } from "@/utils/formatCurrency";
import {
  isDeliveredOrder,
  needsTransferAction,
  orderCode,
  orderItems,
  orderSummary,
  reviewLink,
} from "@/utils/myOrders";
import MyOrderItems from "./MyOrderItems";

const Meta = ({ icon: Icon, children }) => (
  <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
    {Icon && <Icon size={13} strokeWidth={2} className="text-navy-500" aria-hidden="true" />}
    {children}
  </span>
);

/** Một thẻ đơn hàng ở `/orders` — hành động chỉ hiện khi trạng thái đơn cho phép. */
const MyOrderCard = ({ order, onConfirmed }) => {
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const status = ORDER_STATUS[order.status] || ORDER_STATUS.pending;
  const StatusIcon = status.icon;
  const { unitCount } = orderSummary(order);
  const reviewTo = isDeliveredOrder(order) ? reviewLink(orderItems(order)[0]) : "";

  const confirmTransfer = async () => {
    setConfirming(true);
    try {
      await paymentApi.confirmSePayPayment(order.id);
      toast.success(`Đã ghi nhận thanh toán cho đơn ${orderCode(order)}`);
      await onConfirmed?.();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Không xác nhận được thanh toán");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <article className="rounded-xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-hover md:p-5">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-3">
        <div className="min-w-0">
          <p className="text-[12px] font-semibold uppercase tracking-[0.02em] text-muted-foreground">
            Mã đơn
          </p>
          <p className="truncate font-mono text-sm font-bold tabular-nums text-navy-700">
            {orderCode(order)}
          </p>
        </div>
        <Badge variant={status.badge} className="gap-1.5">
          <StatusIcon size={13} strokeWidth={2} aria-hidden="true" />
          {status.label}
        </Badge>
      </header>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 py-3">
        <Meta icon={CalendarDays}>Đặt ngày {formatDate(order.created_at)}</Meta>
        <Meta icon={CreditCard}>
          {PAYMENT_LABEL[order.payment_method] || "Chưa chọn thanh toán"}
          {order.payment_status === "paid" ? " · đã trả" : " · chưa trả"}
        </Meta>
        <Meta>{unitCount} chiếc</Meta>
      </div>

      <div className="rounded-lg bg-muted/40 p-3">
        <MyOrderItems order={order} />
      </div>

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.02em] text-muted-foreground">
            Tổng tiền
          </p>
          <p className="text-lg font-bold tabular-nums text-navy-700">
            {formatCurrency(order.total_amount)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {needsTransferAction(order) && (
            <Button size="sm" variant="buy" loading={confirming} onClick={confirmTransfer}>
              Xác nhận đã chuyển tiền
            </Button>
          )}
          {reviewTo && (
            <Button
              size="sm"
              variant="ghost"
              className="gap-1.5 text-navy-600 hover:text-navy-700"
              onClick={() => navigate(reviewTo)}
            >
              <Star size={14} strokeWidth={2} aria-hidden="true" />
              Đánh giá
            </Button>
          )}
          <Link to={`/orders/${order.id}`}>
            <Button size="sm" className="gap-2">
              Xem chi tiết
              <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </footer>
    </article>
  );
};

export default MyOrderCard;
