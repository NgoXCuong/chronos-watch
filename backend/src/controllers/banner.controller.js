import bannerService from "../services/banner.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// FormData gửi giá trị dạng string; chuẩn hóa ngày giờ và số cho cột DATETIME/INT
const normalizeBody = (body, file) => {
    const data = { ...body };
    if (file) data.image_url = file.path;
    for (const key of ['start_date', 'end_date']) {
        if (!data[key] || data[key] === 'null') {
            data[key] = null;
        } else {
            const parsed = new Date(data[key]);
            if (isNaN(parsed.getTime())) throw new AppError(400, `Ngày ${key} không hợp lệ`);
            data[key] = parsed;
        }
    }
    if (data.sort_order !== undefined) data.sort_order = Number(data.sort_order) || 0;
    if (data.start_date && data.end_date && data.start_date >= data.end_date)
        throw new AppError(400, "Ngày bắt đầu phải trước ngày kết thúc");
    return data;
};

const bannerController = {
    getActive: asyncHandler(async (req, res) => {
        const banners = await bannerService.getActive();
        res.json(banners);
    }),

    getAll: asyncHandler(async (req, res) => {
        const banners = await bannerService.getAll(req.query);
        res.json(banners);
    }),

    create: asyncHandler(async (req, res) => {
        const data = normalizeBody(req.body, req.file);
        if (!String(data.title || '').trim()) throw new AppError(400, "Banner bắt buộc phải có tiêu đề");
        if (!data.image_url) throw new AppError(400, "Banner bắt buộc phải có ảnh");
        const banner = await bannerService.create(data);
        res.status(201).json(banner);
    }),

    update: asyncHandler(async (req, res) => {
        const data = normalizeBody(req.body, req.file);
        if (data.title !== undefined && !String(data.title || '').trim())
            throw new AppError(400, "Banner bắt buộc phải có tiêu đề");
        const banner = await bannerService.update(req.params.id, data);
        res.json(banner);
    }),

    delete: asyncHandler(async (req, res) => {
        await bannerService.delete(req.params.id);
        res.json({ message: "Xóa banner thành công" });
    }),

    // Xóa nhiều: thành công một phần là hợp lệ → trả số dòng đã xóa + lý do từng dòng lỗi
    bulkDelete: asyncHandler(async (req, res) => {
        const { done, failed } = await bannerService.bulkDelete(req.body?.ids);
        res.json({
            deleted: done.length,
            failed,
            message: `Đã xóa ${done.length} banner${failed.length ? `, ${failed.length} dòng không xóa được` : ""}`,
        });
    }),

    toggleStatus: asyncHandler(async (req, res) => {
        const banner = await bannerService.toggleStatus(req.params.id);
        res.json({ message: "Cập nhật trạng thái thành công", banner });
    }),

    bulkUpdateVisibility: asyncHandler(async (req, res) => {
        const { ids, is_active: isActive } = req.body || {};
        const result = await bannerService.bulkSetVisibility(ids, isActive);
        res.json({
            ...result,
            message: `Đã ${result.is_active ? "bật" : "tắt"} ${result.updated} banner`,
        });
    })
};

export default bannerController;
