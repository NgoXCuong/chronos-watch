import UserAddress from "../models/user_address.model.js";
import sequelize from "../config/db.js";

const userAddressService = {
    /**
     * Lấy danh sách địa chỉ của người dùng
     */
    getAddresses: async (userId) => {
        return await UserAddress.findAll({
            where: { user_id: userId },
            order: [['is_default', 'DESC'], ['created_at', 'DESC']]
        });
    },

    /**
     * Thêm địa chỉ mới
     */
    createAddress: async (userId, addressData) => {
        const transaction = await sequelize.transaction();
        try {
            const { is_default } = addressData;

            // Nếu đây là địa chỉ đầu tiên hoặc được đánh dấu là mặc định
            const addressCount = await UserAddress.count({ where: { user_id: userId } });
            const shouldBeDefault = is_default || addressCount === 0;

            if (shouldBeDefault) {
                // Bỏ mặc định của các địa chỉ cũ
                await UserAddress.update(
                    { is_default: false },
                    { where: { user_id: userId }, transaction }
                );
            }

            const newAddress = await UserAddress.create({
                ...addressData,
                user_id: userId,
                is_default: shouldBeDefault
            }, { transaction });

            await transaction.commit();
            return newAddress;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    /**
     * Cập nhật địa chỉ
     */
    updateAddress: async (userId, addressId, addressData) => {
        const address = await UserAddress.findOne({ where: { id: addressId, user_id: userId } });
        if (!address) throw new Error('Địa chỉ không tồn tại');

        const transaction = await sequelize.transaction();
        try {
            const { is_default } = addressData;

            if (is_default && !address.is_default) {
                // Nếu cập nhật thành mặc định, bỏ mặc định của các cái khác
                await UserAddress.update(
                    { is_default: false },
                    { where: { user_id: userId }, transaction }
                );
            }

            await address.update(addressData, { transaction });
            await transaction.commit();
            return address;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    /**
     * Xóa địa chỉ
     */
    deleteAddress: async (userId, addressId) => {
        const address = await UserAddress.findOne({ where: { id: addressId, user_id: userId } });
        if (!address) throw new Error('Địa chỉ không tồn tại');

        const isDefault = address.is_default;
        await address.destroy();

        // Nếu xóa địa chỉ mặc định, hãy chọn một địa chỉ khác làm mặc định (nếu còn)
        if (isDefault) {
            const nextAddress = await UserAddress.findOne({ where: { user_id: userId } });
            if (nextAddress) {
                nextAddress.is_default = true;
                await nextAddress.save();
            }
        }

        return true;
    },

    /**
     * Đặt địa chỉ làm mặc định
     */
    setDefault: async (userId, addressId) => {
        const address = await UserAddress.findOne({ where: { id: addressId, user_id: userId } });
        if (!address) throw new Error('Địa chỉ không tồn tại');

        const transaction = await sequelize.transaction();
        try {
            // Bỏ mặc định tất cả
            await UserAddress.update(
                { is_default: false },
                { where: { user_id: userId }, transaction }
            );

            // Set cái này làm mặc định
            address.is_default = true;
            await address.save({ transaction });

            await transaction.commit();
            return address;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
};

export default userAddressService;
