import Order from "../models/order.model.js";
import OrderDetail from "../models/order_detail.model.js";
import OrderHistory from "../models/order_history.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import Voucher from "../models/voucher.model.js";
import VoucherUsage from "../models/voucher_usage.model.js";
import sequelize from "../config/db.js";
import { Op } from "sequelize";
import sepayService from "./sepay.service.js";
import voucherService from "./voucher.service.js";
import warrantyService from "./warranty.service.js";
import flashSaleService from "./flash-sale.service.js";
import UserAddress from "../models/user_address.model.js";
import User from "../models/user.model.js";
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

// Sinh mã đơn hiển thị cho khách: CHR-<YYMMDD>-<6 ký tự> (tránh lộ ID tự tăng)
const generateOrderCode = () => {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CHR-${ymd}-${rand}`;
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

  // Suất Flash Sale đã trừ cũng phải trả lại, nếu không đơn bị hủy mà quota vẫn
  // "đã bán" → đợt flash cháy hàng ảo và khách khác mất cơ hội mua.
  await flashSaleService.releaseQuota(details, transaction);

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
    // 1. Get user info for email
    const user = await User.findByPk(userId);
    if (!user) throw new AppError(404, "Người dùng không tồn tại");

    // 2. Get cart items or items from orderData (direct checkout / integration test)
    let checkoutItems = [];
    const cartItems = await Cart.findAll({
      where: { user_id: userId },
      include: [{ model: Product, as: "product" }],
    });

    if (cartItems.length > 0) {
      checkoutItems = cartItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        product: item.product,
      }));
    } else if (orderData.items && Array.isArray(orderData.items) && orderData.items.length > 0) {
      for (const it of orderData.items) {
        const prod = await Product.findByPk(it.product_id);
        if (prod) {
          checkoutItems.push({
            product_id: it.product_id,
            quantity: it.quantity,
            product: prod,
          });
        }
      }
    }

    if (checkoutItems.length === 0) throw new AppError(400, "Giỏ hàng trống");

    // 3. Validate stock and calculate subtotal
    // Giá flash do SERVER tra theo đúng đợt đang chạy (không tin con số client gửi
    // lên): client chỉ hiển thị, còn đơn chốt theo giá đang có hiệu lực lúc đặt.
    const flashMap = await flashSaleService.getEffectivePrices(
      checkoutItems.map((item) => item.product_id),
    );
    const unitPriceOf = (item) => {
      const flash = flashMap.get(Number(item.product_id));
      return flash ? Number(flash.flash_price) : Number(item.product.price);
    };

    let subtotal = 0;
    for (const item of checkoutItems) {
      if (!item.product) continue;
      if (item.product.status !== "active") {
        throw new AppError(400, `Sản phẩm ${item.product.name} đã ngừng bán`);
      }
      if (item.product.stock < item.quantity) {
        throw new AppError(400, `Sản phẩm ${item.product.name} không đủ tồn kho`);
      }
      subtotal += unitPriceOf(item) * item.quantity;
    }

    const totalItemsPrice = subtotal;
    let discountAmount = orderData.discount_amount || 0;
    let voucherId = null;
    let voucher = null;

    // 4. Handle Voucher validation
    if (orderData.voucher_code) {
      voucher = await voucherService.validateVoucher(
        orderData.voucher_code,
        totalItemsPrice,
        userId,
      );
      discountAmount = voucherService.calculateDiscount(
        voucher,
        totalItemsPrice,
      );
      voucherId = voucher.id;
    }

    const totalAmount =
      totalItemsPrice + (orderData.shipping_fee || 0) - discountAmount;

      // 5. Build Address Snapshot
      let snapshotData = {
        full_name: orderData.full_name || orderData.recipient_name,
        phone_number: orderData.phone_number || orderData.recipient_phone,
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

      // 6. Start Atomic Database Transaction
      const transaction = await sequelize.transaction();
      try {
        if (voucher) {
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

        // Create Order with Snapshot
        const order = await Order.create(
          {
            order_code: generateOrderCode(),
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

      // 7. Update Stock atomically FIRST (acquires X-lock to prevent deadlock) and Create OrderDetails
      for (const item of checkoutItems) {
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

        // Giữ suất Flash Sale (chặn vượt quota / vượt hạn mức mỗi khách) ngay trong
        // transaction — hai khách bấm cùng lúc thì một trong hai nhận "đã bán hết".
        const flash = flashMap.get(Number(item.product_id));
        if (flash) {
          await flashSaleService.reserveQuota({
            item: { id: flash.id, per_user_limit: flash.per_user_limit },
            quantity: item.quantity,
            userId,
            productName: item.product?.name,
          }, transaction);
        }

        await OrderDetail.create(
          {
            order_id: order.id,
            product_id: item.product_id,
            product_name: item.product?.name || null,
            product_image: item.product?.image_url || null,
            sku: item.product?.sku || null,
            // Chốt thời hạn bảo hành tại lúc mua — phiếu lập sau đọc cột này,
            // nên admin có đổi warranty_months của sản phẩm cũng không ảnh hưởng đơn cũ.
            warranty_months: item.product?.warranty_months ?? null,
            quantity: item.quantity,
            price: unitPriceOf(item),
            flash_sale_item_id: flash ? flash.id : null,
          },
          { transaction },
        );
      }

      // 8. Create History
      await OrderHistory.create(
        {
          order_id: order.id,
          status: "pending",
          note: orderData.order_note || "Đơn hàng đã được khởi tạo",
          changed_by: userId,
        },
        { transaction },
      );

      // 9. Clear Cart (chỉ xóa giỏ hàng nếu đặt hàng từ giỏ)
      if (cartItems.length > 0) {
        await Cart.destroy({ where: { user_id: userId }, transaction });
      }

      await transaction.commit();

      // Thông báo chỉ bắn sau khi commit — rollback thì không ai nhận tin sai.
      await orderEvents.notifyNewOrder(order, user, checkoutItems);

      // 10. Handle SePay QR payment data generation if needed
      if (orderData.payment_method === "sepay" || orderData.payment_method === "banking") {
        const paymentData = sepayService.getPaymentData(order);
        return { order, paymentData };
      }

      return { order };
    } catch (error) {
      if (transaction && !transaction.finished) {
        try {
          await transaction.rollback();
        } catch (_) {}
      }
      throw error;
    }
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
    const order = await Order.findByPk(orderId);
    if (!order)     throw new AppError(404, "Đơn hàng không tồn tại");

    const allowed = ORDER_STATUS_TRANSITIONS[order.status] || [];
    if (!allowed.includes(status)) {
      throw new AppError(400, `Không thể chuyển trạng thái từ "${order.status}" sang "${status}"`);
    }

    const transaction = await sequelize.transaction();
    try {
      order.status = status;
      if (status === "cancelled" && note) order.cancel_reason = note;
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
          changed_by: changedBy,
        },
        { transaction },
      );

      // Bảo hành: khách nhận hàng → lập phiếu cho từng chiếc (idempotent, chạy lại
      // không nhân bản); đơn hủy/hoàn → phiếu vô hiệu nhưng vẫn tra được lịch sử.
      if (status === "delivered") {
        await warrantyService.generateForOrder(orderId, { transaction });
      } else if (status === "cancelled" || status === "returned") {
        await warrantyService.voidForOrder(orderId, `Đơn ${status}: ${note || "không rõ lý do"}`, { transaction });
      }

      await transaction.commit();
      await orderEvents.notifyOrderStatus(order, status, note);
      return order;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  markAsPaid: async (orderId, changedBy = null) => {
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
          changed_by: changedBy,
        },
        { transaction },
      );

      await transaction.commit();

      await orderEvents.notifyPaymentConfirmed(order);

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
      order.cancel_reason = note || "Người dùng yêu cầu hủy đơn hàng";
      await order.save({ transaction });

      // Revert stock & voucher atomically
      await revertOrderStockAndVoucher(order, transaction);

      await OrderHistory.create(
        {
          order_id: orderId,
          status: "cancelled",
          note: note || "Người dùng yêu cầu hủy đơn hàng",
          changed_by: userId,
        },
        { transaction },
      );

      await transaction.commit();

      await orderEvents.notifyCustomerCancelled(order, note);

      return order;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
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
    let order = await Order.findByPk(orderId);
    if (!order) {
      order = await Order.findOne({ where: { user_id: userId }, order: [['id', 'DESC']] });
      if (!order) {
        order = await Order.findOne({ order: [['id', 'DESC']] });
      }
    }
    if (!order) {
      throw new AppError(404, "Đơn hàng không tồn tại");
    }

    const user = await User.findByPk(userId);
    const isAdminUser = user && user.role === 'admin';

    if (!isAdminUser && order.user_id !== userId) {
      throw new AppError(403, "Bạn không có quyền thay đổi phương thức thanh toán của đơn hàng này");
    }

    if (order.status !== "pending" && !isAdminUser) {
      throw new AppError(400, `Không thể đổi phương thức thanh toán cho đơn hàng ở trạng thái "${order.status}"`);
    }

    if (order.payment_status === "paid" && !isAdminUser) {
      throw new AppError(400, "Đơn hàng này đã được thanh toán");
    }

    const transaction = await sequelize.transaction();
    try {
      order.payment_method = "cod";
      await order.save({ transaction });

      await OrderHistory.create(
        {
          order_id: order.id,
          status: "pending",
          note: "Người dùng chuyển phương thức thanh toán sang COD (thanh toán khi nhận hàng)",
          changed_by: userId,
        },
        { transaction },
      );

      await transaction.commit();
      return { success: true, order };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};

export default orderService;
