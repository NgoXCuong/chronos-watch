import { Link, useParams } from "react-router-dom";
import { FileSearch, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import AccountLayout from "@/components/client/AccountLayout";
import NoticeCard from "@/components/client/NoticeCard";
import OrderDetailActions from "@/components/client/orders/detail/OrderDetailActions";
import OrderDetailCosts from "@/components/client/orders/detail/OrderDetailCosts";
import OrderDetailHeading from "@/components/client/orders/detail/OrderDetailHeading";
import OrderDetailHistory from "@/components/client/orders/detail/OrderDetailHistory";
import OrderDetailItems from "@/components/client/orders/detail/OrderDetailItems";
import OrderDetailPanel from "@/components/client/orders/detail/OrderDetailPanel";
import OrderDetailShipping from "@/components/client/orders/detail/OrderDetailShipping";
import OrderDetailSkeleton from "@/components/client/orders/detail/OrderDetailSkeleton";
import OrderProgressStepper from "@/components/client/orders/detail/OrderProgressStepper";
import { PAYMENT_LABEL } from "@/constants/checkout";
import { useMyOrderDetail } from "@/hooks/useMyOrderDetail";
import { formatDateTime } from "@/utils/formatCurrency";

const MissingOrder = () => (
  <NoticeCard
    icon={FileSearch}
    tone="error"
    title="Không tìm thấy đơn hàng này"
    description="Đơn có thể đã bị xóa, hoặc không thuộc tài khoản bạn đang đăng nhập."
  >
    <Link to="/orders" className={cn(buttonVariants({ variant: "buy", size: "sm" }))}>
      Về danh sách đơn hàng
    </Link>
  </NoticeCard>
);

/**
 * Trang chi tiết đơn của khách theo hướng bảng điều khiển tác vụ: tiêu đề mang mã đơn +
 * trạng thái, một hàng nút hành động chỉ hiện khi trạng thái cho phép, rồi stepper,
 * sản phẩm · tiền hàng · giao hàng · lịch sử. Số liệu đều đọc từ snapshot của đơn.
 */
const MyOrderDetailPage = () => {
  const { id } = useParams();
  const { order, loading, busy, confirmTransfer, cancelOrder } = useMyOrderDetail(id);

  const subtitle = order
    ? `Đặt ngày ${formatDateTime(order.created_at)} · ${
        PAYMENT_LABEL[order.payment_method] || "Chưa chọn phương thức thanh toán"
      }`
    : "Tiến trình giao hàng, tiền hàng và các thao tác bạn có thể tự thực hiện.";

  return (
    <AccountLayout
      title={order ? <OrderDetailHeading order={order} /> : "Chi tiết đơn hàng"}
      subtitle={subtitle}
      actions={order && !loading && (
        <OrderDetailActions
          order={order}
          busy={busy}
          onConfirmTransfer={confirmTransfer}
          onCancel={() => cancelOrder()}
        />
      )}
    >
      {loading ? (
        <OrderDetailSkeleton />
      ) : !order ? (
        <MissingOrder />
      ) : (
        <div className="space-y-4">
          <OrderDetailPanel title="Tiến trình giao hàng" icon={Truck}>
            <OrderProgressStepper order={order} />
          </OrderDetailPanel>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0 space-y-4">
              <OrderDetailItems order={order} />
              <OrderDetailHistory order={order} />
            </div>
            <div className="space-y-4">
              <OrderDetailCosts order={order} />
              <OrderDetailShipping order={order} />
            </div>
          </div>
        </div>
      )}
    </AccountLayout>
  );
};

export default MyOrderDetailPage;
