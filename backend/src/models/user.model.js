import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    full_name: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    avatar_url: { type: DataTypes.STRING },
    role: { type: DataTypes.ENUM('admin', 'customer'), defaultValue: 'customer' },
    status: { type: DataTypes.ENUM('active', 'banned'), defaultValue: 'active' },
    reset_password_token: { type: DataTypes.STRING },
    reset_password_expires: { type: DataTypes.DATE },
}, {
    tableName: 'users',
    underscored: true,
});

export default User;
