import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Order from './order.model.js';
import Product from './product.model.js';

const OrderDetail = sequelize.define('OrderDetail', {
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'orders',
            key: 'id'
        }
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(15, 0),
        allowNull: false
    },
    subtotal: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.quantity * this.price;
        }
    }
}, {
    tableName: 'order_details',
    underscored: true,
    timestamps: false
});

Order.hasMany(OrderDetail, { foreignKey: 'order_id', as: 'details' });
OrderDetail.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });
OrderDetail.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

export default OrderDetail;
