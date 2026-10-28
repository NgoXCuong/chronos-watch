import { Mail, MapPin, Phone, StickyNote, Truck, User } from "lucide-react";
import { addressLine } from "@/utils/myOrders";
import OrderDetailPanel from "./OrderDetailPanel";

const Field = ({ icon: Icon, label, value }) =>
  value && (
    <div className="flex gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-navy-50 text-navy-500 dark:bg-navy-500/10">
        <Icon size={14} strokeWidth={2} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[12px] font-semibold uppercase tracking-[0.02em] text-muted-foreground">
          {label}
        </p>
        <p className="text-[13px] font-semibold leading-relaxed text-foreground">{value}</p>
      </div>
    </div>
  );

/** Địa chỉ nhận là SNAPSHOT lúc đặt hàng — sửa/xóa địa chỉ trong sổ không đổi được đơn đã đặt. */
const OrderDetailShipping = ({ order, className }) => (
  <OrderDetailPanel title="Giao hàng" icon={Truck} className={className}>
    <div className="space-y-3.5">
      <Field icon={User} label="Người nhận" value={order.full_name} />
      <Field icon={Phone} label="Điện thoại" value={order.phone_number} />
      <Field icon={Mail} label="Email" value={order.email} />
      <Field icon={MapPin} label="Địa chỉ" value={addressLine(order)} />
      {order.order_note && (
        <Field icon={StickyNote} label="Ghi chú cho đơn" value={order.order_note} />
      )}
    </div>
  </OrderDetailPanel>
);

export default OrderDetailShipping;
