import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const TokenBlacklist = sequelize.define('TokenBlacklist', {
    token_hash: {
        type: DataTypes.STRING(64),
        primaryKey: true
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'token_blacklist',
    timestamps: false,
    indexes: [
        {
            name: 'idx_token_blacklist_expires',
            fields: ['expires_at']
        }
    ]
});

export default TokenBlacklist;