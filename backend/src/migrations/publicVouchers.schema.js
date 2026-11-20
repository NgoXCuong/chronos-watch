import { DataTypes } from 'sequelize';

export async function migratePublicVouchers(sequelize) {
    const qi = sequelize.getQueryInterface();
    const columns = await qi.describeTable('vouchers');
    // Mã cũ giữ riêng tư cho đến khi admin chủ động công khai.
    if (!columns.is_public) await qi.addColumn('vouchers', 'is_public', { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false });
}
