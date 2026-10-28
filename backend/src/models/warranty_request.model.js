import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.model.js';
import Warranty from './warranty.model.js';

// Yêu cầu bảo hành do khách gửi trên một phiếu. admin_reply/handled_by theo đúng
// mô hình phản hồi đánh giá (một câu trả lời, có người xử lý, có mốc giờ).
const WarrantyRequest = sequelize.define(
  'WarrantyRequest',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    warranty_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'warranties',
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
    // Mô tả lỗi/hiện tượng — nguồn duy nhất khách khai lúc gửi.
    issue: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'done', 'rejected'),
      defaultValue: 'pending',
    },
    admin_reply: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    replied_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    handled_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    tableName: 'warranty_requests',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

WarrantyRequest.belongsTo(Warranty, { foreignKey: 'warranty_id', as: 'warranty' });
Warranty.hasMany(WarrantyRequest, { foreignKey: 'warranty_id', as: 'requests' });
WarrantyRequest.belongsTo(User, { foreignKey: 'user_id', as: 'customer' });
WarrantyRequest.belongsTo(User, { foreignKey: 'handled_by', as: 'handler' });

export default WarrantyRequest;
