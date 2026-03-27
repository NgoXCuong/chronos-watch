import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const UserAddress = sequelize.define('UserAddress', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    recipient_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    recipient_phone: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    address_line: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    ward: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    district: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    city: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'user_addresses',
    underscored: true,
    timestamps: true,
    updatedAt: false
});

export default UserAddress;
