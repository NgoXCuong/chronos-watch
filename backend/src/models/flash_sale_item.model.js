import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import FlashSale from './flash_sale.model.js';
import Product from './product.model.js';
import OrderDetail from './order_detail.model.js';

// Một dòng = ưu đãi của MỘT sản phẩm trong một đợt. Giá flash ghi ở đây chứ không
// ghi vào products.price: hết đợt phải trả giá cũ mà không cần "gỡ" thủ công,
// và giá niêm yết của sản phẩm không bị lịch trình bán hàng làm hỏng.
// quota = tổng suất bán được ở giá flash; sold_count tăng khi khách đặt và hoàn lại
// khi đơn bị hủy/hoàn (order.service.js).
const FlashSaleItem = sequelize.define(
  'FlashSaleItem',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    flash_sale_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'flash_sales',
        key: 'id',
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
    },
    flash_price: {
      type: DataTypes.DECIMAL(15, 0),
      allowNull: false,
    },
    quota: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },
    sold_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // 0 = không giới hạn; N > 0 = mỗi khách tối đa N chiếc của dòng này trong đợt
    per_user_limit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: { min: 0 },
    },
  },
  {
    tableName: 'flash_sale_items',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

FlashSale.hasMany(FlashSaleItem, { foreignKey: 'flash_sale_id', as: 'items', onDelete: 'CASCADE' });
FlashSaleItem.belongsTo(FlashSale, { foreignKey: 'flash_sale_id', as: 'flashSale' });
FlashSaleItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Product.hasMany(FlashSaleItem, { foreignKey: 'product_id', as: 'flashSaleItems' });

// Dòng đơn hàng nhớ đã mua theo suất flash nào để hủy/hoàn là trừ lại quota.
// ON DELETE SET NULL (khai báo trong migration): xóa đợt vẫn giữ được giá đã bán của đơn cũ.
OrderDetail.belongsTo(FlashSaleItem, { foreignKey: 'flash_sale_item_id', as: 'flashSaleItem' });
FlashSaleItem.hasMany(OrderDetail, { foreignKey: 'flash_sale_item_id', as: 'orderDetails' });

export default FlashSaleItem;
