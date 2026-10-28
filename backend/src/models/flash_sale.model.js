import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

// Một đợt Flash Sale = cửa sổ thời gian + danh sách sản phẩm ưu đãi
// (flash_sale_items). "Đang chạy" không phải cột: suy từ status + start/end,
// xem utils/flashSale.js.
const FlashSale = sequelize.define(
  'FlashSale',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    // 'inactive' = admin tắt hẳn (không hiện ở trang chủ dù còn trong lịch);
    // 'active' = được xét chạy, cửa sổ start_date/end_date quyết định running/upcoming/expired.
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
    },
  },
  {
    tableName: 'flash_sales',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default FlashSale;
