import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Brand from './brand.model.js';
import Category from './category.model.js';
import ProductCategory from './product_category.model.js';

const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(15, 0),
        allowNull: false
    },
    old_price: {
        type: DataTypes.DECIMAL(15, 0),
        allowNull: true
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: { min: 0 }
    },
    brand_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'brands',
            key: 'id'
        }
    },
    image_url: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    image_gallery: {
        type: DataTypes.JSON,
        allowNull: true
    },
    specifications: {
        type: DataTypes.JSON,
        allowNull: true
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    sold_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    }
}, {
    tableName: 'products',
    underscored: true,
    timestamps: true
});

// Associations
Product.belongsTo(Brand, { foreignKey: 'brand_id', as: 'brand' });
Brand.hasMany(Product, { foreignKey: 'brand_id', as: 'products' });

Product.belongsToMany(Category, { 
    through: ProductCategory, 
    foreignKey: 'product_id', 
    otherKey: 'category_id',
    as: 'categories' 
});
Category.belongsToMany(Product, { 
    through: ProductCategory, 
    foreignKey: 'category_id', 
    otherKey: 'product_id',
    as: 'products' 
});

export default Product;
