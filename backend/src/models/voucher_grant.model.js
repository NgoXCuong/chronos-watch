import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const VoucherGrant = sequelize.define('VoucherGrant', {
    voucher_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    granted_by: { type: DataTypes.INTEGER, allowNull: true },
}, { tableName: 'voucher_grants', timestamps: true, createdAt: 'granted_at', updatedAt: false,
    indexes: [{ unique: true, fields: ['voucher_id', 'user_id'] }] });
export default VoucherGrant;
