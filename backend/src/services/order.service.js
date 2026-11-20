import { withLockedOrder } from "../utils/lockedOrder.js";
import { revertOrderStockAndVoucher } from "./order-stock.service.js";
import checkout from "./order-checkout.service.js";
import Order from "../models/order.model.js";
import OrderDetail from "../models/order_detail.model.js";
import OrderHistory from "../models/order_history.model.js";
import Product from "../models/product.model.js";
import sepayService from "./sepay.service.js";
import warrantyService from "./warranty.service.js";
import UserAddress from "../models/user_address.model.js";
import AppError from "../utils/AppError.js";
import orderEvents from "./order-events.service.js";

const ORDER_STATUS_TRANSITIONS = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['processing', 'cancelled'],
    processing: ['shipping', 'cancelled'],
    shipping: ['delivered'],
    delivered: ['returned'],
    cancelled: [],
    returned: [],
};

const orderService = {
  checkout,

  getOrderDetail: async (orderId, userId = null, userRole = null) => {
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderDetail,
          as: "details",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "slug", "name", "image_url", "status"],
            },
          ],
        },
        { model: OrderHistory, as: "history" },
        { model: UserAddress, as: "shipping_address_ref" },
      ],
    });
    if (!order)     throw new AppError(404, "Đơn hàng không tồn tại");

    // IDOR protection: only the owner or an admin can access order details
    if (userId && userRole !== "admin" && order.user_id !== userId) {
      throw new AppError(403, "Bạn không có quyền xem thông tin đơn hàng này");
    }

    return order;
  },

  updateOrderStatus: async (orderId, status, note, changedBy = null) => {
    const order = await withLockedOrder({ id: orderId }, async (order, transaction) => {
      const allowed = ORDER_STATUS_TRANSITIONS[order.status] || [];
      if (!allowed.includes(status)) {
        throw new AppError(400, `Không thể chuyển trạng thái từ "${order.status}" sang "${status}"`);
      }
      order.status = status;
      if (status === "cancelled" && note) order.cancel_reason = note;
      await order.save({ transaction });
      if (status === "cancelled" || status === "returned") {
        await revertOrderStockAndVoucher(order, transaction);
      }
      await OrderHistory.create({
        order_id: orderId, status, note: note || `Cập nhật trạng thái mới: ${status}`,
        changed_by: changedBy,
      }, { transaction });
      if (status === "delivered") {
        await warrantyService.generateForOrder(orderId, { transaction });
      } else if (status === "cancelled" || status === "returned") {
        await warrantyService.voidForOrder(orderId, `Đơn ${status}: ${note || "không rõ lý do"}`, { transaction });
      }
      return order;
    });
    await orderEvents.notifyOrderStatus(order, status, note);
    return order;
  },

  markAsPaid: async (orderId, changedBy = null) => {
    const order = await withLockedOrder({ id: orderId }, async (order, transaction) => {
      if (order.payment_status === "paid") throw new AppError(400, "Đơn hàng này đã được thanh toán");
      if (order.payment_method !== "cod" || ['cancelled', 'returned'].includes(order.status)) {
        throw new AppError(400, "Chỉ xác nhận thu tiền cho đơn COD còn hiệu lực");
      }
      order.payment_status = "paid";
      await order.save({ transaction });
      await OrderHistory.create({
        order_id: orderId, status: order.status, note: "Admin xác nhận đã thu tiền COD.", changed_by: changedBy,
      }, { transaction });
      return order;
    });
    await orderEvents.notifyPaymentConfirmed(order);
    return order;
  },

  cancelOrder: async (userId, orderId, note) => {
    const order = await withLockedOrder({ id: orderId, user_id: userId }, async (order, transaction) => {
      if (!["pending", "confirmed"].includes(order.status)) {
        throw new AppError(400, "Không thể hủy đơn hàng ở trạng thái hiện tại");
      }
      order.status = "cancelled";
      order.cancel_reason = note || "Người dùng yêu cầu hủy đơn hàng";
      await order.save({ transaction });
      await revertOrderStockAndVoucher(order, transaction);
      await OrderHistory.create({
        order_id: orderId, status: "cancelled", note: order.cancel_reason, changed_by: userId,
      }, { transaction });
      return order;
    });
    await orderEvents.notifyCustomerCancelled(order, note);
    return order;
  },

  retryPayment: async (orderId, userId) => {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new AppError(404, "Đơn hàng không tồn tại");
    }

    if (order.user_id !== userId) {
      throw new AppError(403, "Bạn không có quyền thực hiện thanh toán cho đơn hàng này");
    }

    if (order.status !== "pending") {
      throw new AppError(400, `Không thể thanh toán lại cho đơn hàng ở trạng thái "${order.status}"`);
    }

    if (order.payment_status === "paid") {
      throw new AppError(400, "Đơn hàng này đã được thanh toán");
    }

    if (order.payment_method !== "sepay") {
      order.payment_method = "sepay";
      await order.save();
    }

    const paymentData = sepayService.getPaymentData(order);
    return { order, paymentData };
  },


  switchPaymentMethodToCOD: async (orderId, userId) => {
    const order = await withLockedOrder({ id: orderId }, async (order, transaction) => {
      if (order.user_id !== userId) {
        throw new AppError(403, "Bạn không có quyền thay đổi phương thức thanh toán của đơn hàng này");
      }
      if (order.status !== "pending") {
        throw new AppError(400, `Không thể đổi phương thức thanh toán cho đơn hàng ở trạng thái "${order.status}"`);
      }
      if (order.payment_status === "paid") throw new AppError(400, "Đơn hàng này đã được thanh toán");
      order.payment_method = "cod";
      await order.save({ transaction });
      await OrderHistory.create({
        order_id: order.id, status: order.status,
        note: "Người dùng chuyển phương thức thanh toán sang COD (thanh toán khi nhận hàng)", changed_by: userId,
      }, { transaction });
      return order;
    });
    return { success: true, order };
  },
};

export default orderService;
