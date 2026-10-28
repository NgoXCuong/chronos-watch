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
    product_name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    product_image: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    sku: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    // Snapshot thời hạn bảo hành (tháng) lúc mua — phiếu bảo hành sau này đọc từ đây,
    // không đọc products.warranty_months hiện tại (admin đổi giá trị thì quyền lợi
    // khách của đơn cũ sẽ bị thay đổi theo).
    warranty_months: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(15, 0),
        allowNull: false
    },
    // NULL = mua giá thường. Khi mua theo suất Flash Sale thì nhớ id dòng ưu đãi
    // để hủy/hoàn đơn trừ lại quota (association khai báo ở flash_sale_item.model.js).
    flash_sale_item_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'flash_sale_items',
            key: 'id'
        }
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
