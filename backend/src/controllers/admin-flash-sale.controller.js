import flashSaleAdminService from '../services/admin-flash-sale.service.js';
import asyncHandler from '../utils/asyncHandler.js';

const adminFlashSaleController = {
    getAll: asyncHandler(async (req, res) => {
        const { count, rows, page, limit } = await flashSaleAdminService.getAll(req.query);
        res.json({ total: count, page, limit, flashSales: rows });
    }),

    getStats: asyncHandler(async (req, res) => {
        res.json(await flashSaleAdminService.getStats());
    }),

    getDetail: asyncHandler(async (req, res) => {
        res.json({ flashSale: await flashSaleAdminService.getDetail(req.params.id) });
    }),

    create: asyncHandler(async (req, res) => {
        const flashSale = await flashSaleAdminService.create(req.body || {});
        res.status(201).json({ message: 'Tạo đợt Flash Sale thành công.', flashSale });
    }),

    update: asyncHandler(async (req, res) => {
        const flashSale = await flashSaleAdminService.update(req.params.id, req.body || {});
        res.json({ message: 'Cập nhật đợt Flash Sale thành công.', flashSale });
    }),

    setStatus: asyncHandler(async (req, res) => {
        const flashSale = await flashSaleAdminService.setStatus(req.params.id, req.body?.status);
        res.json({
            message: flashSale.status === 'active' ? 'Đã bật đợt Flash Sale.' : 'Đã tắt đợt Flash Sale.',
            flashSale,
        });
    }),

    // SET, không toggle: mọi id nhận cùng một trạng thái (Rule 3)
    bulkSetStatus: asyncHandler(async (req, res) => {
        const result = await flashSaleAdminService.bulkSetStatus(req.body?.ids, req.body?.status);
        res.json({
            ...result,
            message: `Đã chuyển ${result.updated} đợt Flash Sale sang ${result.status === 'active' ? 'đang bật' : 'tắt'}.`,
        });
    }),

    bulkDelete: asyncHandler(async (req, res) => {
        const { done, failed } = await flashSaleAdminService.bulkDelete(req.body?.ids);
        res.json({
            deleted: done.length,
            failed,
            message: `Đã xóa ${done.length} đợt${failed.length ? `, ${failed.length} đợt không xóa được` : ''}`,
        });
    }),

    delete: asyncHandler(async (req, res) => {
        await flashSaleAdminService.delete(req.params.id);
        res.json({ message: 'Xóa đợt Flash Sale thành công.' });
    }),
};

export default adminFlashSaleController;
