import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Order from './order.model.js';
import User from './user.model.js';

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
    },
    changed_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    tableName: 'order_history',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

Order.hasMany(OrderHistory, { foreignKey: 'order_id', as: 'history' });
OrderHistory.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });
OrderHistory.belongsTo(User, { foreignKey: 'changed_by', as: 'changedByUser' });
User.hasMany(OrderHistory, { foreignKey: 'changed_by', as: 'orderHistoryChanges' });

export default OrderHistory;
