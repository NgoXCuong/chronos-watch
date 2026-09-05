import Order from "../models/order.model.js";
import OrderDetail from "../models/order_detail.model.js";
import OrderHistory from "../models/order_history.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import Voucher from "../models/voucher.model.js";
import VoucherUsage from "../models/voucher_usage.model.js";
import sequelize from "../config/db.js";
import { Op } from "sequelize";
import vnpayService from "./vnpay.service.js";
import voucherService from "./voucher.service.js";
import UserAddress from "../models/user_address.model.js";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";

const ORDER_STATUS_TRANSITIONS = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['processing', 'cancelled'],
    processing: ['shipping', 'cancelled'],
    shipping: ['delivered'],
    delivered: ['returned'],
    cancelled: [],
    returned: [],
};

const revertOrderStockAndVoucher = async (order, transaction) => {
  const details = await OrderDetail.findAll({
    where: { order_id: order.id },
    transaction,
  });
  for (const item of details) {
    await Product.update(
      {
        stock: sequelize.literal(`stock + ${item.quantity}`),
        sold_count: sequelize.literal(`GREATEST(0, sold_count - ${item.quantity})`),
      },
      { where: { id: item.product_id }, transaction },
    );
  }

  if (order.voucher_id) {
    await Voucher.update(
      {
        used_count: sequelize.literal('GREATEST(0, used_count - 1)')
      },
      { where: { id: order.voucher_id }, transaction }
    );
    await VoucherUsage.destroy({
      where: { order_id: order.id },
      transaction
    });
  }
};

const orderService = {
  checkout: async (userId, orderData, ipAddr) => {
    const transaction = await sequelize.transaction();
    try {
      // 1. Get user info for email
      const user = await User.findByPk(userId);
      if (!user) throw new AppError(404, "Người dùng không tồn tại");

      // 2. Get cart items
      const cartItems = await Cart.findAll({
        where: { user_id: userId },
        include: [{ model: Product, as: "product" }],
      });

      if (cartItems.length === 0) throw new AppError(400, "Giỏ hàng trống");

      // 3. Validate stock and calculate subtotal
      let subtotal = 0;
      for (const item of cartItems) {
        if (!item.product) continue;
        if (item.product.stock < item.quantity) {
          throw new AppError(400, `Sản phẩm ${item.product.name} không đủ tồn kho`);
        }
        subtotal += item.product.price * item.quantity;
      }

      const totalItemsPrice = subtotal;
      let discountAmount = orderData.discount_amount || 0;
      let voucherId = null;

      // 4. Handle Voucher
      if (orderData.voucher_code) {
        const voucher = await voucherService.validateVoucher(
          orderData.voucher_code,
          totalItemsPrice,
          userId,
        );
        discountAmount = voucherService.calculateDiscount(
          voucher,
          totalItemsPrice,
        );
        voucherId = voucher.id;

        // Atomic voucher usage limit check & increment
        const [affectedVoucher] = await Voucher.update(
          { used_count: sequelize.literal("used_count + 1") },
          {
            where: {
              id: voucher.id,
              [Op.or]: [
                { usage_limit: null },
                { used_count: { [Op.lt]: sequelize.col("usage_limit") } },
              ],
            },
            transaction,
          },
        );

        if (affectedVoucher === 0) {
          throw new AppError(400, "Mã giảm giá đã hết lượt sử dụng");
        }
      }

      const totalAmount =
        totalItemsPrice + (orderData.shipping_fee || 0) - discountAmount;

      // 5. Build Address Snapshot
      let snapshotData = {
        full_name: orderData.full_name,
        phone_number: orderData.phone_number,
        address_line: orderData.address_line,
        ward: orderData.ward,
        district: orderData.district,
        city: orderData.city,
        email: user.email,
        address_id: orderData.address_id || null,
        order_note: orderData.order_note,
      };

      // If address_id is provided, fetch and overwrite snapshot fields to ensure accuracy
      if (orderData.address_id) {
        const savedAddr = await UserAddress.findByPk(orderData.address_id);
        if (savedAddr) {
          snapshotData.full_name = savedAddr.recipient_name;
          snapshotData.phone_number = savedAddr.recipient_phone;
          snapshotData.address_line = savedAddr.address_line;
          snapshotData.ward = savedAddr.ward;
          snapshotData.district = savedAddr.district;
          snapshotData.city = savedAddr.city;
        }
      }

      // 6. Create Order with Snapshot
      const order = await Order.create(
        {
          user_id: userId,
          ...snapshotData,
          subtotal: totalItemsPrice,
          discount_amount: discountAmount,
          total_amount: totalAmount,
          voucher_id: voucherId,
          status: "pending",
          payment_status: "unpaid",
          payment_method: orderData.payment_method || "cod",
          shipping_fee: orderData.shipping_fee || 0,
        },
        { transaction },
      );

      // Record voucher usage if voucher applied
      if (voucherId) {
        await VoucherUsage.create(
          {
            voucher_id: voucherId,
            user_id: userId,
            order_id: order.id,
          },
          { transaction },
        );
      }

      // 7. Create OrderDetails and Update Stock atomically
      for (const item of cartItems) {
        await OrderDetail.create(
          {
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.product.price,
          },
          { transaction },
        );

        // Atomic stock reduction & sold_count increment (safeguard against race conditions)
        const [affectedRows] = await Product.update(
          {
            stock: sequelize.literal(`stock - ${item.quantity}`),
            sold_count: sequelize.literal(`sold_count + ${item.quantity}`),
          },
          {
            where: {
              id: item.product_id,
              stock: { [Op.gte]: item.quantity },
            },
            transaction,
          },
        );

        if (affectedRows === 0) {
          throw new AppError(400, `Sản phẩm ${item.product ? item.product.name : "này"} không đủ số lượng tồn kho`);
        }
      }

      // 8. Create History
      await OrderHistory.create(
        {
          order_id: order.id,
          status: "pending",
          note: orderData.order_note || "Đơn hàng đã được khởi tạo",
        },
        { transaction },
      );

      // 9. Clear Cart
      await Cart.destroy({ where: { user_id: userId }, transaction });

      await transaction.commit();

      // 10. Handle VNPay URL generation if needed
      if (orderData.payment_method === "vnpay") {
        const paymentUrl = vnpayService.createPaymentUrl(order, ipAddr);
        return { order, paymentUrl };
      }

      return { order };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  finishPayment: async (vnp_Params) => {
    const isValid = vnpayService.validateResponse(vnp_Params);
    const orderId = vnp_Params["vnp_TxnRef"];
    const responseCode = vnp_Params["vnp_ResponseCode"];
    const responseAmount = parseInt(vnp_Params["vnp_Amount"], 10);

    const order = await Order.findByPk(orderId);
    if (!order) throw new AppError(404, "Đơn hàng không tồn tại");

    // Kiểm tra số tiền thanh toán khớp với total_amount của đơn hàng
    // (VNPay trả vnp_Amount theo đơn vị "cents" = VND * 100)
    const expectedAmount = Math.round(parseFloat(order.total_amount) * 100);
    const amountValid = Number.isFinite(responseAmount) && responseAmount === expectedAmount;

    // Idempotency check: If already paid or confirmed, just return success
    if (order.payment_status === "paid" || order.status === "confirmed") {
      return { success: true, order };
    }

    if (isValid && responseCode === "00" && amountValid) {
      const transaction = await sequelize.transaction();
      try {
        order.payment_status = "paid";
        order.status = "confirmed";
        await order.save({ transaction });

        await OrderHistory.create(
          {
            order_id: orderId,
            status: "confirmed",
            note: "Thanh toán VNPay thành công. Đơn hàng đã được xác nhận tự động.",
          },
          { transaction },
        );

        await transaction.commit();
        return { success: true, order };
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } else {
      // Payment failed, signature invalid, or amount mismatch
      return { success: false, order, message: "Thanh toán không thành công" };
    }
  },

  getUserOrders: async (userId) => {
    return await Order.findAll({
      where: { user_id: userId },
      include: [
        { model: UserAddress, as: "shipping_address_ref" },
        {
          model: OrderDetail,
          as: "details",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "slug", "name", "image_url"],
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });
  },

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
              attributes: ["id", "slug", "name", "image_url"],
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

  updateOrderStatus: async (orderId, status, note) => {
    const order = await Order.findByPk(orderId);
    if (!order)     throw new AppError(404, "Đơn hàng không tồn tại");

    const allowed = ORDER_STATUS_TRANSITIONS[order.status] || [];
    if (!allowed.includes(status)) {
      throw new AppError(400, `Không thể chuyển trạng thái từ "${order.status}" sang "${status}"`);
    }

    const transaction = await sequelize.transaction();
    try {
      order.status = status;
      await order.save({ transaction });

      // Hoàn trả tồn kho và voucher nếu đơn hàng bị hủy hoặc hoàn trả
      if (status === "cancelled" || status === "returned") {
        await revertOrderStockAndVoucher(order, transaction);
      }

      await OrderHistory.create(
        {
          order_id: orderId,
          status,
          note: note || `Cập nhật trạng thái mới: ${status}`,
        },
        { transaction },
      );

      await transaction.commit();
      return order;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  markAsPaid: async (orderId) => {
    const order = await Order.findByPk(orderId);
    if (!order)     throw new AppError(404, "Đơn hàng không tồn tại");
    if (order.payment_status === "paid")
      throw new AppError(400, "Đơn hàng này đã được thanh toán");

    const transaction = await sequelize.transaction();
    try {
      order.payment_status = "paid";
      await order.save({ transaction });

      await OrderHistory.create(
        {
          order_id: orderId,
          status: order.status,
          note: "Admin xác nhận đã thu tiền COD.",
        },
        { transaction },
      );

      await transaction.commit();
      return order;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  cancelOrder: async (userId, orderId, note) => {
    const order = await Order.findOne({
      where: { id: orderId, user_id: userId },
    });
    if (!order)     throw new AppError(404, "Đơn hàng không tồn tại");
    if (!["pending", "confirmed"].includes(order.status)) {
      throw new AppError(400, "Không thể hủy đơn hàng ở trạng thái hiện tại");
    }

    const transaction = await sequelize.transaction();
    try {
      order.status = "cancelled";
      await order.save({ transaction });

      // Revert stock & voucher atomically
      await revertOrderStockAndVoucher(order, transaction);

      await OrderHistory.create(
        {
          order_id: orderId,
          status: "cancelled",
          note: note || "Người dùng yêu cầu hủy đơn hàng",
        },
        { transaction },
      );

      await transaction.commit();
      return order;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};

export default orderService;
