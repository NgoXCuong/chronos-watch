import { Receipt, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PAYMENT_LABEL } from "@/constants/checkout";
import { paymentStatusMeta } from "@/constants/myOrders";
import { formatCurrency } from "@/utils/formatCurrency";
import { needsTransferAction, toMoney } from "@/utils/myOrders";
import OrderDetailPanel from "./OrderDetailPanel";

const Row = ({ label, value, tone = "default" }) => (
  <div className="flex items-center justify-between gap-3 text-[13px]">
    <span className="text-muted-foreground">{label}</span>
    <span
      className={
        tone === "free"
          ? "font-semibold tabular-nums text-success"
          : tone === "minus"
            ? "font-semibold tabular-nums text-sale"
            : "font-semibold tabular-nums text-foreground"
      }
    >
      {value}
    </span>
  </div>
);

/** Tiền hàng: mọi số liệu là DECIMAL nên phải qua toMoney trước khi so sánh với 0. */
const OrderDetailCosts = ({ order, className }) => {
  const subtotal = toMoney(order.subtotal);
  const shippingFee = toMoney(order.shipping_fee);
  const discount = toMoney(order.discount_amount);
  const payment = paymentStatusMeta(order.payment_status);

  return (
    <OrderDetailPanel
      title="Tiền hàng"
      icon={Receipt}
      className={className}
      aside={
        <Badge variant={payment.badge} className="gap-1.5">
          <Wallet size={11} strokeWidth={2} aria-hidden="true" />
          {payment.label}
        </Badge>
      }
    >
      <div className="space-y-2">
        <Row label="Tạm tính" value={formatCurrency(subtotal)} />
        <Row
          label="Phí vận chuyển"
          value={shippingFee === 0 ? "Miễn phí" : formatCurrency(shippingFee)}
          tone={shippingFee === 0 ? "free" : "default"}
        />
        {discount > 0 && (
          <Row label="Ưu đãi" value={`− ${formatCurrency(discount)}`} tone="minus" />
        )}

        <div className="flex items-end justify-between gap-3 border-t border-border pt-3">
          <span className="text-[12px] font-bold uppercase tracking-[0.02em] text-muted-foreground">
            Tổng cộng
          </span>
          <span className="text-lg font-bold tabular-nums text-navy-700">
            {formatCurrency(order.total_amount)}
          </span>
        </div>

        <div className="rounded-lg bg-muted/40 px-3 py-2.5">
          <p className="text-[12px] text-muted-foreground">
            {PAYMENT_LABEL[order.payment_method] || "Chưa chọn phương thức thanh toán"}
          </p>
          {needsTransferAction(order) && (
            <p className="mt-1 text-[12px] leading-relaxed text-navy-700">
              Đã chuyển khoản rồi? Bấm{" "}
              <span className="font-bold">Xác nhận đã chuyển khoản</span> ở trên để Chronos
              ghi nhận sớm.
            </p>
          )}
        </div>
      </div>
    </OrderDetailPanel>
  );
};

export default OrderDetailCosts;
