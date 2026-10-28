import adminWarrantyService from '../services/admin-warranty.service.js';
import asyncHandler from "../utils/asyncHandler.js";

const adminWarrantyController = {
    getAllWarranties: asyncHandler(async (req, res) => {
        const result = await adminWarrantyService.getAllWarranties(req.query);
        res.json({
            total: result.count,
            page: result.page,
            limit: result.limit,
            warranties: result.rows,
        });
    }),

    getWarrantyStats: asyncHandler(async (req, res) => {
        res.json(await adminWarrantyService.getStats());
    }),

    getWarrantyDetail: asyncHandler(async (req, res) => {
        res.json({ warranty: await adminWarrantyService.getWarrantyDetail(req.params.id) });
    }),

    updateWarranty: asyncHandler(async (req, res) => {
        const warranty = await adminWarrantyService.updateWarranty(req.params.id, req.body || {});
        res.json({ message: "Cập nhật phiếu bảo hành thành công.", warranty });
    }),

    bulkSetStatus: asyncHandler(async (req, res) => {
        const result = await adminWarrantyService.bulkSetStatus(req.body?.ids, req.body?.status);
        res.json({
            ...result,
            message: `Đã chuyển ${result.updated} phiếu sang trạng thái ${result.status}.`,
        });
    }),

    bulkDelete: asyncHandler(async (req, res) => {
        const { done, failed } = await adminWarrantyService.bulkDelete(req.body?.ids);
        res.json({
            deleted: done.length,
            failed,
            message: `Đã xóa ${done.length} phiếu${failed.length ? `, ${failed.length} phiếu không xóa được` : ""}`,
        });
    }),

    deleteWarranty: asyncHandler(async (req, res) => {
        await adminWarrantyService.delete(req.params.id);
        res.json({ message: "Xóa phiếu bảo hành thành công." });
    }),

    getRequests: asyncHandler(async (req, res) => {
        const result = await adminWarrantyService.getRequests(req.query);
        res.json({
            total: result.count,
            page: result.page,
            limit: result.limit,
            requests: result.rows,
        });
    }),

    replyRequest: asyncHandler(async (req, res) => {
        const request = await adminWarrantyService.replyRequest(req.params.id, req.body || {}, req.user);
        res.json({ message: "Đã phản hồi yêu cầu bảo hành.", request });
    }),
};

export default adminWarrantyController;
