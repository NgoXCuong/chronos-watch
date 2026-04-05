import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.model.js';
import Voucher from './voucher.model.js';
import UserAddress from './user_address.model.js';

const Order = sequelize.define('Order', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    address_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'user_addresses',
            key: 'id'
        }
    },
    // Snapshot fields for historical accuracy
    full_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    phone_number: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    address_line: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    ward: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    district: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    city: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    order_note: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    subtotal: {
        type: DataTypes.DECIMAL(15, 0),
        allowNull: false
    },
    shipping_fee: {
        type: DataTypes.DECIMAL(15, 0),
        defaultValue: 0
    },
    discount_amount: {
        type: DataTypes.DECIMAL(15, 0),
        defaultValue: 0
    },
    total_amount: {
        type: DataTypes.DECIMAL(15, 0),
        allowNull: false
    },
    voucher_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled', 'returned'),
        defaultValue: 'pending'
    },
    payment_method: {
        type: DataTypes.ENUM('cod', 'vnpay', 'banking'),
        defaultValue: 'cod'
    },
    payment_status: {
        type: DataTypes.ENUM('unpaid', 'paid', 'refunded'),
        defaultValue: 'unpaid'
    }
}, {
    tableName: 'orders',
    createdAt: 'created_at',
    updatedAt: false
});

Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });

Order.belongsTo(Voucher, { foreignKey: 'voucher_id', as: 'voucher' });
Voucher.hasMany(Order, { foreignKey: 'voucher_id', as: 'orders' });

Order.belongsTo(UserAddress, { foreignKey: 'address_id', as: 'shipping_address_ref' });

export default Order;
