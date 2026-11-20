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
    sku: {
        type: DataTypes.STRING(50),
        allowNull: true,
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
    warranty_months: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 24
    },
    reorder_lead_days: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 7, validate: { min: 1, max: 365 } },
    reorder_safety_days: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 7, validate: { min: 0, max: 365 } },
    demand_window_days: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 28, validate: { min: 14, max: 90 } },
    inventory_available_since: { type: DataTypes.DATE, allowNull: true },
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
    avg_rating: {
        type: DataTypes.DECIMAL(2, 1),
        allowNull: true,
        defaultValue: 0
    },
    review_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    }
}, {
    tableName: 'products',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
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
