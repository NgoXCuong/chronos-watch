import sequelize from '../config/db.js';
import User from './user.model.js';
import Voucher from './voucher.model.js';

const Order = sequelize.define('Order', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    full_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    phone_number: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    address_line: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING(100),
        allowNull: false
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
        type: DataTypes.ENUM('pending', 'confirmed', 'shipping', 'delivered', 'cancelled', 'returned'),
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
    underscored: true,
    timestamps: true,
    updatedAt: false // Chỉ dùng created_at theo SQL
});

Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });

Order.belongsTo(Voucher, { foreignKey: 'voucher_id', as: 'voucher' });
Voucher.hasMany(Order, { foreignKey: 'voucher_id', as: 'orders' });

export default Order;
