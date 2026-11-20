import { loadCheckoutItems, buildShippingAddress } from "./order-checkout-input.js";
import Order from "../models/order.model.js";
import OrderDetail from "../models/order_detail.model.js";
import OrderHistory from "../models/order_history.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import Voucher from "../models/voucher.model.js";
import VoucherUsage from "../models/voucher_usage.model.js";
import User from "../models/user.model.js";
import sequelize from "../config/db.js";
import { Op } from "sequelize";
import sepayService from "./sepay.service.js";
import voucherService from "./voucher.service.js";
import flashSaleService from "./flash-sale.service.js";
import orderEvents from "./order-events.service.js";
import AppError from "../utils/AppError.js";

// Sinh mã đơn hiển thị cho khách: CHR-<YYMMDD>-<6 ký tự> (tránh lộ ID tự tăng)
const generateOrderCode = () => {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CHR-${ymd}-${rand}`;
};

const checkout = async (userId, orderData = {}) => {
  if (!orderData || typeof orderData !== 'object' || Array.isArray(orderData)) {
    throw new AppError(400, "Dữ liệu đặt hàng không hợp lệ");
  }
  const paymentMethod = orderData.payment_method || 'cod';
  if (!['cod', 'sepay', 'banking'].includes(paymentMethod)) {
    throw new AppError(400, "Phương thức thanh toán không hợp lệ");
  }
  // 1. Get user info for email
  const user = await User.findByPk(userId);
  if (!user) throw new AppError(404, "Người dùng không tồn tại");

  const { checkoutItems, cartItems } = await loadCheckoutItems(userId, orderData);

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
  let discountAmount = 0;
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

  discountAmount = Math.max(0, Math.min(totalItemsPrice, Math.round(discountAmount)));
  const totalAmount = totalItemsPrice - discountAmount;

  const snapshotData = await buildShippingAddress(userId, user, orderData);

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
        payment_method: paymentMethod,
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
            status: "active",
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
};

export default checkout;
