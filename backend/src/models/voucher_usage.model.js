import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.model.js';
import Voucher from './voucher.model.js';
import Order from './order.model.js';

const VoucherUsage = sequelize.define('VoucherUsage', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    voucher_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'vouchers',
            key: 'id'
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'orders',
            key: 'id'
        }
    }
}, {
    tableName: 'voucher_usages',
    underscored: true,
    timestamps: true,
    createdAt: 'used_at',
    updatedAt: false
});

// Associations
VoucherUsage.belongsTo(Voucher, { foreignKey: 'voucher_id', as: 'voucher' });
Voucher.hasMany(VoucherUsage, { foreignKey: 'voucher_id', as: 'usages' });

VoucherUsage.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(VoucherUsage, { foreignKey: 'user_id', as: 'voucherUsages' });

VoucherUsage.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });
Order.hasOne(VoucherUsage, { foreignKey: 'order_id', as: 'voucherUsage' });

export default VoucherUsage;
