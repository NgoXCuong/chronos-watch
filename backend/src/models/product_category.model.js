import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const ProductCategory = sequelize.define('ProductCategory', {
    product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'products',
            key: 'id'
        }
    },
    category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'categories',
            key: 'id'
        }
    }
}, {
    tableName: 'product_categories',
    underscored: true,
    timestamps: false
});

export default ProductCategory;
