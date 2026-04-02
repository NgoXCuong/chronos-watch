import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Banner = sequelize.define('Banner', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    image_url: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    link_url: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    position: {
        type: DataTypes.ENUM('home_main', 'home_sidebar', 'popup'),
        defaultValue: 'home_main'
    },
    sort_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    is_active: {
        type: DataTypes.TINYINT(1),
        defaultValue: 1
    }
}, {
    tableName: 'banners',
    timestamps: false // No created_at/updated_at in existing SQL schema for banners
});

export default Banner;
