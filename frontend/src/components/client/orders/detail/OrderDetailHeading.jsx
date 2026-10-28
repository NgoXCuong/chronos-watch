import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS } from "@/constants/orderStatus";
import { orderCode } from "@/utils/myOrders";

/** Tiêu đề trang chi tiết: mã đơn + Badge trạng thái (một nguồn nhãn ở constants/orderStatus). */
const OrderDetailHeading = ({ order }) => {
  const status = ORDER_STATUS[order.status] || ORDER_STATUS.pending;
  const Icon = status.icon;

  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <span className="flex items-center gap-2">
        <FileText size={18} strokeWidth={2} className="text-navy-500" aria-hidden="true" />
        Đơn hàng <span className="font-mono tabular-nums">{orderCode(order)}</span>
      </span>
      <Badge variant={status.badge} className="gap-1.5">
        <Icon size={12} strokeWidth={2} aria-hidden="true" />
        {status.label}
      </Badge>
    </span>
  );
};

export default OrderDetailHeading;
