import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Order from './order.model.js';

const OrderHistory = sequelize.define('OrderHistory', {
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'orders',
            key: 'id'
        }
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'order_history',
    underscored: true,
    timestamps: true,
    updatedAt: false
});

Order.hasMany(OrderHistory, { foreignKey: 'order_id', as: 'history' });
OrderHistory.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

export default OrderHistory;
