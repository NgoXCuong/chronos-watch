import brandService from "../services/brand.service.js";
import asyncHandler from "../utils/asyncHandler.js";

const brandController = {
    getAll: asyncHandler(async (req, res) => {
        const brands = await brandService.getAll(req.query);
        res.json(brands);
    }),

    getDetail: asyncHandler(async (req, res) => {
        const brand = await brandService.getDetail(req.params.id_or_slug);
        res.json(brand);
    }),

    create: asyncHandler(async (req, res) => {
        const data = { ...req.body };
        if (req.file) data.logo_url = req.file.path;
        const brand = await brandService.create(data);
        res.status(201).json(brand);
    }),

    update: asyncHandler(async (req, res) => {
        const data = { ...req.body };
        if (req.file) data.logo_url = req.file.path;
        const brand = await brandService.update(req.params.id, data);
        res.json(brand);
    }),

    delete: asyncHandler(async (req, res) => {
        await brandService.delete(req.params.id);
        res.json({ message: "Xóa thương hiệu thành công" });
    }),

    // Xóa nhiều: thành công một phần là hợp lệ → trả số dòng đã xóa + lý do từng dòng lỗi
    bulkDelete: asyncHandler(async (req, res) => {
        const { done, failed } = await brandService.bulkDelete(req.body?.ids);
        res.json({
            deleted: done.length,
            failed,
            message: `Đã xóa ${done.length} thương hiệu${failed.length ? `, ${failed.length} dòng không xóa được` : ""}`,
        });
    }),

    toggleStatus: asyncHandler(async (req, res) => {
        const brand = await brandService.toggleStatus(req.params.id);
        res.json({ message: "Cập nhật trạng thái thành công", brand });
    }),

    bulkUpdateVisibility: asyncHandler(async (req, res) => {
        const { ids, is_active: isActive } = req.body || {};
        const result = await brandService.bulkSetVisibility(ids, isActive);
        res.json({
            ...result,
            message: `Đã ${result.is_active ? "cho hiển thị" : "ẩn"} ${result.updated} thương hiệu`,
        });
    })
};

export default brandController;
