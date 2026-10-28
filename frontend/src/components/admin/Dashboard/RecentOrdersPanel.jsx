import { useNavigate } from "react-router-dom";
import { ArrowRight, ClipboardList } from "lucide-react";
import DashboardPanel from "../Common/DashboardPanel";
import { Badge } from "../../ui/badge";
import {
  formatCurrency,
  formatRelativeTime,
} from "../../../utils/formatCurrency";
import {
  ORDER_STATUS_BADGE,
  ORDER_STATUS_LABELS,
} from "../../../constants/orderStatus";

const firstDetail = (order) => order.details?.[0];

const OrderRow = ({ order, onOpen }) => {
  const detail = firstDetail(order);
  const image = detail?.product_image || detail?.product?.image_url;
  const extraItems = (order.details?.length || 0) - 1;

  return (
    <tr
      onClick={() => onOpen(order.id)}
      className="cursor-pointer border-t border-border transition-colors hover:bg-accent/60"
    >
      <td className="px-3 py-2.5">
        <p className="font-mono text-[12px] font-bold text-foreground">
          {order.order_code || `#${order.id}`}
        </p>
        <p className="text-[11px] text-muted-foreground">
          {formatRelativeTime(order.created_at)}
        </p>
      </td>
      <td className="px-3 py-2.5">
        <p className="truncate text-[12px] font-semibold text-card-foreground">
          {order.full_name ||
            order.user?.full_name ||
            order.user?.username ||
            "Khách vãng lai"}
        </p>
        <p className="truncate text-[11px] text-muted-foreground">
          {order.phone_number ||
            order.email ||
            order.user?.email ||
            "Không rõ liên hệ"}
        </p>
      </td>
      <td className="hidden px-3 py-2.5 md:table-cell">
        <div className="flex min-w-0 items-center gap-2">
          <span className="h-9 w-9 shrink-0 overflow-hidden rounded-md border border-border bg-navy-50 dark:bg-navy-500/10">
            {image ? (
              <img
                src={image}
                alt={detail?.product_name || "Sản phẩm"}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : null}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[12px] font-medium text-card-foreground">
              {detail?.product_name ||
                detail?.product?.name ||
                "Không rõ sản phẩm"}
            </span>
            <span className="block text-[11px] text-muted-foreground tabular-nums">
              {order.details?.length || 0} món
              {extraItems > 0 ? ` (+${extraItems} khác)` : ""}
            </span>
          </span>
        </div>
      </td>
      <td className="px-3 py-2.5 text-right">
        <p className="text-[12px] font-bold text-navy-600 tabular-nums dark:text-navy-100">
          {formatCurrency(order.total_amount)}
        </p>
      </td>
      <td className="px-3 py-2.5">
        <Badge variant={ORDER_STATUS_BADGE[order.status] ?? "muted"}>
          {ORDER_STATUS_LABELS[order.status] ?? order.status}
        </Badge>
      </td>
    </tr>
  );
};

// Bảng đơn hàng mới nhất — thay cho panel danh sách dạng thẻ cũ
const RecentOrdersPanel = ({ orders, className }) => {
  const navigate = useNavigate();
  const rows = orders || [];

  return (
    <DashboardPanel
      icon={ClipboardList}
      className={className}
      title="Đơn hàng mới nhất"
      subtitle="6 giao dịch gần đây"
      action={
        <button
          type="button"
          onClick={() => navigate("/admin/orders")}
          className="group/link flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.05em] text-navy-600 hover:underline dark:text-navy-100"
        >
          Tất cả
          <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
        </button>
      }
      bodyClassName="overflow-x-auto"
    >
      {rows.length === 0 ? (
        <div className="flex h-full min-h-32 flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/40 py-8 text-center">
          <p className="text-sm font-semibold text-muted-foreground">
            Chưa có đơn hàng nào
          </p>
        </div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-navy-50/60 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-navy-700 dark:bg-navy-500/10 dark:text-navy-100">
              <th className="px-3 py-2">Mã đơn</th>
              <th className="px-3 py-2">Khách hàng</th>
              <th className="hidden px-3 py-2 md:table-cell">Sản phẩm</th>
              <th className="px-3 py-2 text-right">Tổng tiền</th>
              <th className="px-3 py-2">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                onOpen={(id) => navigate(`/admin/orders/${id}`)}
              />
            ))}
          </tbody>
        </table>
      )}
    </DashboardPanel>
  );
};

export default RecentOrdersPanel;
