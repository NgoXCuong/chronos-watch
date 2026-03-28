import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.model.js';
import Product from './product.model.js';

const Wishlist = sequelize.define('Wishlist', {
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
    }
}, {
    tableName: 'wishlists',
    underscored: true,
    timestamps: true
});

// Associations
Wishlist.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Wishlist, { foreignKey: 'user_id', as: 'wishlistItems' });

Wishlist.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Product.hasMany(Wishlist, { foreignKey: 'product_id', as: 'wishlistItems' });

export default Wishlist;
