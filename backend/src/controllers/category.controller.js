import categoryService from "../services/category.service.js";
import asyncHandler from "../utils/asyncHandler.js";

// FormData (multipart) luôn nhận giá trị dạng string -> chuẩn hóa kiểu dữ liệu
const normalizeBody = (body, file) => {
    const data = { ...body };
    if (file) data.image_url = file.path;
    if (data.parent_id === '' || data.parent_id === 'null') data.parent_id = null;
    if (data.parent_id !== null && data.parent_id !== undefined) data.parent_id = Number(data.parent_id);
    if (data.sort_order !== undefined) data.sort_order = Number(data.sort_order) || 0;
    return data;
};

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
        const category = await categoryService.create(normalizeBody(req.body, req.file));
        res.status(201).json(category);
    }),

    update: asyncHandler(async (req, res) => {
        const category = await categoryService.update(req.params.id, normalizeBody(req.body, req.file));
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
