import voucherService from '../services/voucher.service.js';
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import listPublicVouchers from '../services/public-voucher.service.js';
import { giftVoucher } from '../services/voucher-gift.service.js';

const voucherController = {
    gift: asyncHandler(async (req, res) => res.json(await giftVoucher(req.params.id, req.body?.user_ids, req.user.id))),
    getMine: asyncHandler(async (req, res) => res.json(await listPublicVouchers({ userId: req.user.id, total: req.query.total, scope: 'mine' }))),
    getAvailable: asyncHandler(async (req, res) => res.json(await listPublicVouchers({ userId: req.user?.id, total: req.query.total, scope: 'available' }))),
    bulkUpdateVisibility: asyncHandler(async (req, res) => {
        const result = await voucherService.bulkSetVisibility(req.body?.ids, req.body?.is_public);
        res.json({ ...result, message: `Đã đặt ${result.updated} mã giảm giá thành ${result.is_public ? 'công khai' : 'mã riêng'}.` });
    }),
    getPublic: asyncHandler(async (req, res) => {
        res.json(await listPublicVouchers({ total: req.query.total, userId: req.user?.id }));
    }),
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
        const code = String(req.query.code || req.body?.code || '').trim().toUpperCase();
        const rawTotal = req.query.total ?? req.body?.total ?? req.body?.orderValue ?? req.body?.order_amount;
        const total = Number(rawTotal);
        if (!code || rawTotal == null || String(rawTotal).trim() === '' || !Number.isFinite(total) || total <= 0) throw new AppError(400, "Mã hoặc giá trị đơn hàng không hợp lệ.");
        
        const voucher = await voucherService.validateVoucher(code, total, req.user?.id);
        const discountAmount = voucherService.calculateDiscount(voucher, parseFloat(total));
        
        res.json({
            valid: true,
            voucher,
            discount_amount: discountAmount
        });
    })
};

export default voucherController;
