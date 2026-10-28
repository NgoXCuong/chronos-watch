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

    toggleStatus: asyncHandler(async (req, res) => {
        const voucher = await voucherService.toggleStatus(req.params.id, req.body?.status);
        res.json({
            message: voucher.status === 'active' ? "Đã bật voucher!" : "Đã tắt voucher!",
            voucher
        });
    }),

    bulkUpdateStatus: asyncHandler(async (req, res) => {
        const { ids, status } = req.body || {};
        const result = await voucherService.bulkSetStatus(ids, status);
        res.json({
            ...result,
            message: `Đã ${result.status === "active" ? "bật" : "tạm ngưng"} ${result.updated} mã giảm giá`,
        });
    }),

    delete: asyncHandler(async (req, res) => {
        await voucherService.delete(req.params.id);
        res.json({ message: "Xóa voucher thành công!" });
    }),

    // Xóa nhiều: thành công một phần là hợp lệ → trả số dòng đã xóa + lý do từng dòng lỗi
    bulkDelete: asyncHandler(async (req, res) => {
        const { done, failed } = await voucherService.bulkDelete(req.body?.ids);
        res.json({
            deleted: done.length,
            failed,
            message: `Đã xóa ${done.length} voucher${failed.length ? `, ${failed.length} dòng không xóa được` : ""}`,
        });
    }),

    // Public validation logic check
    validate: asyncHandler(async (req, res) => {
        const code = req.query.code || req.body?.code;
        const total = req.query.total || req.body?.total || req.body?.orderValue || req.body?.order_amount;
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
