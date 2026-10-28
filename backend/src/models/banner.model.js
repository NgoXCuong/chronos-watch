import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Banner = sequelize.define('Banner', {
    eyebrow: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    subtitle: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    image_url: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    link_url: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    sort_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'banners',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

export default Banner;
