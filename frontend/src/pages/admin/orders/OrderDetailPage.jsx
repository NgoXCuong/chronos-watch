import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import adminApi from "../../../api/admin.api";
import { Button } from "../../../components/ui/button";
import OrderTaskConsole from "../../../components/admin/Order/detail/OrderTaskConsole";
import OrderItemsTable from "../../../components/admin/Order/detail/OrderItemsTable";
import OrderFactTable from "../../../components/admin/Order/detail/OrderFactTable";
import OrderHistoryTimeline from "../../../components/admin/Order/detail/OrderHistoryTimeline";
import OrderProcessNote from "../../../components/admin/Order/detail/OrderProcessNote";
import OrderInvoicePrint from "../../../components/admin/Order/detail/OrderInvoicePrint";
import { statusLabel } from "../../../constants/orderStatus";

const Shell = ({ children }) => (
  <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card shadow-card">
    {children}
  </div>
);

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [note, setNote] = useState("");

  const fetchOrderDetail = async () => {
    setLoading(true);
    try {
      setOrder(await adminApi.getOrderDetail(id));
    } catch (error) {
      console.error("Lỗi lấy chi tiết đơn hàng:", error);
      toast.error("Không thể tải thông tin đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const runAction = async (action, successMessage) => {
    setUpdating(true);
    try {
      await action();
      toast.success(successMessage);
      setNote("");
      await fetchOrderDetail();
    } catch (error) {
      toast.error(error?.message || "Không thực hiện được thao tác");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateStatus = (nextStatus) => {
    if (
      nextStatus === "cancelled" &&
      !window.confirm("Hủy đơn hàng này? Kho và voucher sẽ được hoàn lại.")
    )
      return;

    runAction(
      () => adminApi.updateOrderStatus(id, nextStatus, note),
      `Đã chuyển sang: ${statusLabel(nextStatus)}`,
    );
  };

  const handleMarkAsPaid = () =>
    runAction(
      () => adminApi.markOrderAsPaid(id),
      order?.payment_method === "cod"
        ? "Đã xác nhận thu tiền COD"
        : "Đã xác nhận khách chuyển khoản",
    );

  if (loading) {
    return (
      <Shell>
        <span className="h-9 w-9 animate-spin rounded-full border-2 border-navy-700 border-t-transparent" />
        <p className="text-[13px] font-semibold text-muted-foreground">
          Đang tải đơn hàng…
        </p>
      </Shell>
    );
  }

  if (!order) {
    return (
      <Shell>
        <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-muted/50">
          <AlertCircle
            className="h-6 w-6 text-muted-foreground"
            strokeWidth={2}
          />
        </span>
        <p className="text-[15px] font-bold text-foreground">
          Không tìm thấy đơn hàng
        </p>
        <Button
          variant="outline"
          onClick={() => navigate("/admin/orders")}
          className="rounded-lg"
        >
          Quay lại danh sách
        </Button>
      </Shell>
    );
  }

  return (
    <div className="space-y-3 pb-10">
      <OrderTaskConsole
        order={order}
        updating={updating}
        onBack={() => navigate("/admin/orders")}
        onPrint={() => window.print()}
        onAdvance={handleUpdateStatus}
        onMarkAsPaid={handleMarkAsPaid}
        onCancel={() => handleUpdateStatus("cancelled")}
      />

      {/* Hai cột dọc độc lập: card tự giữ chiều cao, không căn hàng tạo lỗ trống */}
      <div className="grid grid-cols-1 items-start gap-3 xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="min-w-0 space-y-3">
          <OrderItemsTable order={order} />
          <OrderHistoryTimeline history={order.history} />
        </div>
        <div className="min-w-0 space-y-3">
          <OrderFactTable order={order} />
          <OrderProcessNote note={note} onNoteChange={setNote} />
        </div>
      </div>

      <OrderInvoicePrint order={order} />
    </div>
  );
};

export default OrderDetailPage;
