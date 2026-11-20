import OrderDetail from "../models/order_detail.model.js";
import Product from "../models/product.model.js";
import Voucher from "../models/voucher.model.js";
import VoucherUsage from "../models/voucher_usage.model.js";
import sequelize from "../config/db.js";
import flashSaleService from "./flash-sale.service.js";

export const revertOrderStockAndVoucher = async (order, transaction) => {
  const details = await OrderDetail.findAll({
    where: { order_id: order.id },
    transaction,
  });
  for (const item of details) {
    await Product.update(
      {
        // Đặt trước stock để CASE đọc số tồn cũ trong UPDATE của MySQL.
        inventory_available_since: sequelize.literal('CASE WHEN stock = 0 THEN NOW() ELSE inventory_available_since END'),
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

