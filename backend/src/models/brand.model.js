import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Brand = sequelize.define('Brand', {
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    slug: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    logo_url: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    country: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'brands',
    underscored: true,
    timestamps: true,
    updatedAt: false // Bảng brands trong SQL không có updated_at
});

export default Brand;
