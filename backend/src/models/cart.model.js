import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.model.js';
import Product from './product.model.js';

const Cart = sequelize.define('Cart', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
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
        defaultValue: 1,
        allowNull: false
    }
}, {
    tableName: 'carts',
    underscored: true,
    timestamps: false
});

// Associations
Cart.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Cart.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
User.hasMany(Cart, { foreignKey: 'user_id', as: 'cartItems' });
Product.hasMany(Cart, { foreignKey: 'product_id' });

export default Cart;
