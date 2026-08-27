import userAddressService from "../services/user_address.service.js";
import asyncHandler from "../utils/asyncHandler.js";

const userAddressController = {
    /**
     * Lấy tất cả địa chỉ của user
     */
    getAddresses: asyncHandler(async (req, res) => {
        const addresses = await userAddressService.getAddresses(req.user.id);
        res.json(addresses);
    }),

    /**
     * Thêm địa chỉ mới
     */
    addAddress: asyncHandler(async (req, res) => {
        const newAddress = await userAddressService.createAddress(req.user.id, req.body);
        res.status(201).json({
            message: "Thêm địa chỉ mới thành công!",
            address: newAddress
        });
    }),

    /**
     * Cập nhật địa chỉ
     */
    updateAddress: asyncHandler(async (req, res) => {
        const updated = await userAddressService.updateAddress(req.user.id, req.params.id, req.body);
        res.json({
            message: "Cập nhật địa chỉ thành công!",
            address: updated
        });
    }),

    /**
     * Xóa địa chỉ
     */
    deleteAddress: asyncHandler(async (req, res) => {
        await userAddressService.deleteAddress(req.user.id, req.params.id);
        res.json({ message: "Xóa địa chỉ thành công!" });
    }),

    /**
     * Đặt địa chỉ mặc định
     */
    setDefault: asyncHandler(async (req, res) => {
        const address = await userAddressService.setDefault(req.user.id, req.params.id);
        res.json({
            message: "Đã đặt làm địa chỉ mặc định!",
            address
        });
    })
};

export default userAddressController;
