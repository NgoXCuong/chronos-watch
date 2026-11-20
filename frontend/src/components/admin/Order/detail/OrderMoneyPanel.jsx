import { cn } from "@/lib/utils";
import { formatCurrency } from "../../../../utils/formatCurrency";

const MoneyLine = ({ label, value, tone }) => (
  <div className="flex items-baseline justify-between gap-3 text-[12px]">
    <span className="text-navy-700/70 dark:text-navy-100/60">{label}</span>
    <span
      className={cn(
        "font-semibold tabular-nums text-navy-800 dark:text-navy-100",
        tone,
      )}
    >
      {value}
    </span>
  </div>
);

// Đối chiếu tiền trong phiên xử lý: số phải thu + cấu phần + trạng thái thu
export const OrderMoneyPanel = ({ order, compact = false }) => {
  const discount = Number(order.discount_amount) || 0;

  if (compact) return (
    <div className="grid content-center gap-3 bg-navy-50/70 px-5 py-4 dark:bg-navy-500/12">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[22px] font-bold tabular-nums text-foreground">{formatCurrency(order.total_amount)}</p>
        <span className={cn("text-xs font-semibold", order.payment_status === "paid" ? "text-success" : "text-warning")}>
          {order.payment_status === "paid" ? "Đã thu tiền" : "Chờ thu tiền"}
        </span>
      </div>
      <div className="space-y-1 border-t border-border pt-2">
        <MoneyLine label="Tiền hàng" value={formatCurrency(order.subtotal)} />
        <MoneyLine label="Vận chuyển" value="Miễn phí" />
        {discount > 0 && <MoneyLine label="Giảm giá" value={`−${formatCurrency(order.discount_amount)}`} tone="text-sale" />}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col justify-between gap-4 bg-navy-50/70 p-5 dark:bg-navy-500/12">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.02em] text-navy-700 dark:text-navy-100">
          Khách phải trả
        </p>
        <p className="mt-1.5 text-[26px] font-extrabold leading-none text-navy-700 tabular-nums dark:text-navy-100">
          {formatCurrency(order.total_amount)}
        </p>
      </div>

      <div className="space-y-1.5 border-t border-navy-500/20 pt-3.5">
        <MoneyLine label="Tiền hàng" value={formatCurrency(order.subtotal)} />
        <MoneyLine
          label="Vận chuyển"
          value="Miễn phí"
          tone="text-success"
        />
        {discount > 0 && (
          <MoneyLine
            label="Giảm giá"
            value={`−${formatCurrency(order.discount_amount)}`}
            tone="text-sale"
          />
        )}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-navy-500/20 pt-3.5">
        <span className="text-[12px] font-semibold text-navy-700/70 dark:text-navy-100/60">
          Thanh toán
        </span>
        {order.payment_status === "paid" ? (
          <span className="text-[12px] font-bold uppercase text-success">
            Đã thu tiền
          </span>
        ) : (
          <span className="text-[12px] font-bold uppercase text-warning">
            Chờ thu
          </span>
        )}
      </div>
    </div>
  );
};
