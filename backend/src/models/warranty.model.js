import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Order from './order.model.js';
import OrderDetail from './order_detail.model.js';
import Product from './product.model.js';
import User from './user.model.js';

// Một phiếu = MỘT chiếc đồng hồ đã giao (dòng đơn có quantity=2 sinh 2 phiếu).
// product_name/sku/warranty_months là snapshot lúc lập phiếu: sửa sản phẩm sau này
// không được làm thay đổi quyền lợi của đơn đã bán.
const Warranty = sequelize.define(
  'Warranty',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id',
      },
    },
    order_detail_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'order_details',
        key: 'id',
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'products',
        key: 'id',
      },
    },
    product_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    sku: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    // Serial do khách/admin điền khi tiếp nhận; NULL khi chưa có. UNIQUE để không
    // hai phiếu cùng nhận một số serial (MySQL vẫn cho nhiều dòng NULL).
    serial: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    warranty_months: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    // 'processing' = đang tiếp nhận/sửa chữa; 'closed' = đã trả hàng; 'void' = đơn hủy/hoàn.
    // Hết hạn KHÔNG lưu ở đây — suy từ end_date (xem utils/warranty.js).
    status: {
      type: DataTypes.ENUM('active', 'processing', 'closed', 'void'),
      defaultValue: 'active',
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'warranties',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

Warranty.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });
Order.hasMany(Warranty, { foreignKey: 'order_id', as: 'warranties' });
Warranty.belongsTo(OrderDetail, { foreignKey: 'order_detail_id', as: 'orderDetail' });
Warranty.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Warranty.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Warranty, { foreignKey: 'user_id', as: 'warranties' });

export default Warranty;
