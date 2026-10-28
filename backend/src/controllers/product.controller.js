import productService from "../services/product.service.js";
import aiService from "../services/ai.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { buildCreateData, buildUpdateData } from "../utils/productPayload.js";

const productController = {
    getAll: asyncHandler(async (req, res) => {
        const result = await productService.getAll(req.query);
        res.json(result);
    }),

    // Danh sách cho trang quản trị: gồm cả sản phẩm ngừng bán.
    getAdminAll: asyncHandler(async (req, res) => {
        const result = await productService.getAdminAll(req.query);
        res.json(result);
    }),

    getDetail: asyncHandler(async (req, res) => {
        const product = await productService.getDetail(req.params.id_or_slug);
        res.json(product);
    }),

    // Chi tiết cho form sửa: không chặn sản phẩm inactive và không tăng lượt xem.
    getAdminDetail: asyncHandler(async (req, res) => {
        const product = await productService.getDetail(req.params.id, { includeInactive: true });
        res.json(product);
    }),

    getFacets: asyncHandler(async (req, res) => {
        res.json(await productService.getFacets());
    }),

    // FormData (body chuỗi + files) → payload: xem utils/productPayload.js
    create: asyncHandler(async (req, res) => {
        const product = await productService.create(buildCreateData(req));
        aiService.clearProductContextCache();
        res.status(201).json({ message: "Tạo sản phẩm thành công!", product });
    }),

    update: asyncHandler(async (req, res) => {
        const product = await productService.update(req.params.id, buildUpdateData(req));
        aiService.clearProductContextCache();
        res.json({ message: "Cập nhật sản phẩm thành công!", product });
    }),

    delete: asyncHandler(async (req, res) => {
        await productService.delete(req.params.id);
        aiService.clearProductContextCache();
        res.json({ message: "Xóa sản phẩm thành công!" });
    }),

    // Sản phẩm chỉ ngừng bán (không xóa hẳn) — đổi status hàng loạt bằng một UPDATE
    bulkUpdateStatus: asyncHandler(async (req, res) => {
        const { ids, status } = req.body || {};
        const result = await productService.bulkUpdateStatus(ids, status);
        aiService.clearProductContextCache();
        res.json({ ...result, message: `Đã cập nhật ${result.updated} sản phẩm` });
    }),

    getRelated: asyncHandler(async (req, res) => {
        const limit = req.query.limit || 4;
        const related = await productService.getRelated(req.params.id_or_slug, limit);
        res.json(related);
    })
};

export default productController;
