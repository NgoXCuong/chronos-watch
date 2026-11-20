import sequelize from '../config/db.js';
import Order from '../models/order.model.js';
import AppError from './AppError.js';

// Mọi thay đổi vòng đời đọc lại trạng thái SAU khi giữ khóa dòng.
// Yêu cầu đồng thời phải đợi commit rồi mới được kiểm tra trạng thái mới nhất.
export const withLockedOrder = async (where, action) => {
  const transaction = await sequelize.transaction();
  try {
    const options = { transaction, lock: true };
    const order = where.user_id === undefined && where.order_code === undefined
      ? await Order.findByPk(where.id, options)
      : await Order.findOne({ where, ...options });
    if (!order) throw new AppError(404, 'Đơn hàng không tồn tại');
    const result = await action(order, transaction);
    await transaction.commit();
    return result;
  } catch (error) {
    if (!transaction.finished) await transaction.rollback();
    throw error;
  }
};
