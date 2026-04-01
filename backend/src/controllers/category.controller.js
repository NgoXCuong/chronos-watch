import categoryService from "../services/category.service.js";
import formatSequelizeError from "../utils/errorHandler.js";

const categoryController = {
    getAll: async (req, res) => {
        try {
            const categories = await categoryService.getAll(req.query);
            res.json(categories);
        } catch (error) {
            res.status(400).json({ message: formatSequelizeError(error) });
        }
    },

    getDetail: async (req, res) => {
        try {
            const category = await categoryService.getDetail(req.params.id_or_slug);
            res.json(category);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    },

    create: async (req, res) => {
        try {
            const category = await categoryService.create(req.body);
            res.status(201).json(category);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const category = await categoryService.update(req.params.id, req.body);
            res.json(category);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            await categoryService.delete(req.params.id);
            res.json({ message: "Xóa danh mục thành công" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    toggleStatus: async (req, res) => {
        try {
            const category = await categoryService.toggleStatus(req.params.id);
            res.json({ message: "Cập nhật trạng thái thành công", category });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

export default categoryController;
