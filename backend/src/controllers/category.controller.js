import categoryService from "../services/category.service.js";
import asyncHandler from "../utils/asyncHandler.js";

const categoryController = {
    getAll: asyncHandler(async (req, res) => {
        const categories = await categoryService.getAll(req.query);
        res.json(categories);
    }),

    getDetail: asyncHandler(async (req, res) => {
        const category = await categoryService.getDetail(req.params.id_or_slug);
        res.json(category);
    }),

    create: asyncHandler(async (req, res) => {
        const category = await categoryService.create(req.body);
        res.status(201).json(category);
    }),

    update: asyncHandler(async (req, res) => {
        const category = await categoryService.update(req.params.id, req.body);
        res.json(category);
    }),

    delete: asyncHandler(async (req, res) => {
        await categoryService.delete(req.params.id);
        res.json({ message: "Xóa danh mục thành công" });
    }),

    toggleStatus: asyncHandler(async (req, res) => {
        const category = await categoryService.toggleStatus(req.params.id);
        res.json({ message: "Cập nhật trạng thái thành công", category });
    })
};

export default categoryController;
