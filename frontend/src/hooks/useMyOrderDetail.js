import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import orderApi from "@/api/order.api";
import paymentApi from "@/api/payment.api";

// Vì sao không phải "đang tải" toàn trang: `loadedId !== id` chỉ đúng khi đơn này
// chưa từng được tải, nên chuyển tab/ngược danh sách không nháy skeleton.
export const useMyOrderDetail = (id) => {
  const [order, setOrder] = useState(null);
  const [loadedId, setLoadedId] = useState(null);
  const [busy, setBusy] = useState(null);

  const fetchOrder = useCallback(async () => {
    try {
      const data = await orderApi.getOrderDetail(id);
      setOrder(data);
    } catch (error) {
      setOrder(null);
      toast.error(error?.response?.data?.message || "Không tải được đơn hàng này");
    } finally {
      setLoadedId(id);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // Một tác vụ chạy một lúc: nút khác bị khóa khi đang hủy/xác nhận thanh toán.
  const runAction = useCallback(
    async (key, call, successMessage) => {
      setBusy(key);
      try {
        await call();
        toast.success(successMessage);
        await fetchOrder();
        return true;
      } catch (error) {
        toast.error(error?.response?.data?.message || "Thao tác không thành công");
        return false;
      } finally {
        setBusy(null);
      }
    },
    [fetchOrder],
  );

  return {
    order,
    loading: loadedId !== id,
    busy,
    confirmTransfer: () =>
      runAction("transfer", () => paymentApi.confirmSePayPayment(id), "Đã ghi nhận chuyển khoản"),
    cancelOrder: (note) =>
      runAction("cancel", () => orderApi.cancelOrder(id, note), "Đơn hàng đã được hủy"),
  };
};

export default useMyOrderDetail;
