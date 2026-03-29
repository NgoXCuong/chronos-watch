import userAddressService from "../services/user_address.service.js";

const userAddressController = {
    /**
     * Lấy tất cả địa chỉ của user
     */
    getAddresses: async (req, res) => {
        try {
            const addresses = await userAddressService.getAddresses(req.user.id);
            res.json(addresses);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    /**
     * Thêm địa chỉ mới
     */
    addAddress: async (req, res) => {
        try {
            const newAddress = await userAddressService.createAddress(req.user.id, req.body);
            res.status(201).json({
                message: "Thêm địa chỉ mới thành công!",
                address: newAddress
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    /**
     * Cập nhật địa chỉ
     */
    updateAddress: async (req, res) => {
        try {
            const updated = await userAddressService.updateAddress(req.user.id, req.params.id, req.body);
            res.json({
                message: "Cập nhật địa chỉ thành công!",
                address: updated
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    /**
     * Xóa địa chỉ
     */
    deleteAddress: async (req, res) => {
        try {
            await userAddressService.deleteAddress(req.user.id, req.params.id);
            res.json({ message: "Xóa địa chỉ thành công!" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    /**
     * Đặt địa chỉ mặc định
     */
    setDefault: async (req, res) => {
        try {
            const address = await userAddressService.setDefault(req.user.id, req.params.id);
            res.json({
                message: "Đã đặt làm địa chỉ mặc định!",
                address
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

export default userAddressController;
