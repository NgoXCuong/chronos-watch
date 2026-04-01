import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Voucher = sequelize.define('Voucher', {
    code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    discount_type: {
        type: DataTypes.ENUM('percentage', 'fixed'),
        allowNull: false
    },
    discount_value: {
        type: DataTypes.DECIMAL(15, 0),
        allowNull: false
    },
    max_discount: {
        type: DataTypes.DECIMAL(15, 0),
        allowNull: true,
        defaultValue: 0
    },
    min_order_value: {
        type: DataTypes.DECIMAL(15, 0),
        allowNull: true,
        defaultValue: 0
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    usage_limit: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
    },
    used_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    }
}, {
    tableName: 'vouchers',
    underscored: true,
    timestamps: true
});

export default Voucher;
