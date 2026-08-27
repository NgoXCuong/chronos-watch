import voucherService from '../services/voucher.service.js';
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

const voucherController = {
    // Admin CRUD
    getAll: asyncHandler(async (req, res) => {
        const vouchers = await voucherService.getAll(req.query);
        res.json(vouchers);
    }),

    getDetail: asyncHandler(async (req, res) => {
        const voucher = await voucherService.getDetail(req.params.id);
        if (!voucher) throw new AppError(404, "Voucher không tồn tại.");
        res.json(voucher);
    }),

    create: asyncHandler(async (req, res) => {
        const voucher = await voucherService.create(req.body);
        res.status(201).json({
            message: "Tạo voucher thành công!",
            voucher
        });
    }),

    update: asyncHandler(async (req, res) => {
        const voucher = await voucherService.update(req.params.id, req.body);
        res.json({
            message: "Cập nhật voucher thành công!",
            voucher
        });
    }),

    delete: asyncHandler(async (req, res) => {
        await voucherService.delete(req.params.id);
        res.json({ message: "Xóa voucher thành công!" });
    }),

    // Public validation logic check
    validate: asyncHandler(async (req, res) => {
        const { code, total } = req.query;
        if (!code || !total) throw new AppError(400, "Thiếu tham số code hoặc total.");
        
        const voucher = await voucherService.validateVoucher(code, parseFloat(total));
        const discountAmount = voucherService.calculateDiscount(voucher, parseFloat(total));
        
        res.json({
            valid: true,
            voucher,
            discount_amount: discountAmount
        });
    })
};

export default voucherController;
