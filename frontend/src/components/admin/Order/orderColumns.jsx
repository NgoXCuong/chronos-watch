import { Badge } from "../../ui/badge";
import {
  formatCurrency,
  formatDate,
  formatRelativeTime,
} from "../../../utils/formatCurrency";
import { OrderCustomerCell, OrderStatusBadge } from "./OrderCells";
import { OrderRowActions } from "./OrderRowActions";

// Định nghĩa cột đơn hàng — trang dùng lại mảng này cho menu "Cột".
// Cell renderer chỉ chạy khi DataTable vẽ, nên menu gọi getOrderColumns() được.
export const getOrderColumns = ({
  onView,
  onStatusUpdate,
  updatingId,
} = {}) => [
  {
    id: "order_code",
    header: "Mã đơn",
    sortKey: "order_code",
    width: "180px",
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <p className="font-mono text-[13px] font-bold whitespace-nowrap text-foreground">
          {row.order_code || `#${row.id}`}
        </p>
        <p className="text-[11px] text-muted-foreground">
          {formatRelativeTime(row.created_at)}
        </p>
      </div>
    ),
  },
  {
    id: "customer",
    header: "Khách hàng",
    sortKey: "full_name",
    width: "300px",
    cell: ({ row }) => <OrderCustomerCell order={row} />,
  },
  {
    id: "created_at",
    header: "Ngày đặt",
    sortKey: "created_at",
    width: "130px",
    className: "text-[13px] whitespace-nowrap text-muted-foreground tabular-nums",
    cell: ({ row }) => formatDate(row.created_at),
  },
  {
    id: "total_amount",
    header: "Tổng tiền",
    sortKey: "total_amount",
    align: "right",
    width: "150px",
    className:
      "text-[13px] font-bold text-navy-700 tabular-nums dark:text-navy-100",
    cell: ({ row }) => formatCurrency(row.total_amount),
  },
  {
    id: "payment_method",
    header: "Thanh toán",
    sortKey: "payment_method",
    width: "140px",
    cell: ({ row }) => (
      <Badge variant="muted">{row.payment_method || "cod"}</Badge>
    ),
  },
  {
    id: "status",
    header: "Trạng thái",
    sortKey: "status",
    width: "170px",
    cell: ({ row }) => <OrderStatusBadge status={row.status} />,
  },
  {
    id: "actions",
    header: "Thao tác",
    align: "right",
    width: "64px",
    stopRowClick: true,
    cell: ({ row }) => (
      <OrderRowActions
        order={row}
        onView={onView}
        onStatusUpdate={onStatusUpdate}
        updating={updatingId === row.id}
      />
    ),
  },
];
