import brandService from "../services/brand.service.js";

const brandController = {
    getAll: async (req, res) => {
        try {
            const brands = await brandService.getAll();
            res.json(brands);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getDetail: async (req, res) => {
        try {
            const brand = await brandService.getDetail(req.params.id_or_slug);
            res.json(brand);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    },

    create: async (req, res) => {
        try {
            const data = { ...req.body };
            if (req.file) data.logo_url = req.file.path;
            const brand = await brandService.create(data);
            res.status(201).json(brand);
        } catch (error) {
            // Xử lý lỗi validation của Sequelize (ví dụ: trùng name, slug)
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ message: "Dữ liệu đã tồn tại (trùng Name hoặc Slug)" });
            }
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
            }
            res.status(400).json({ message: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const data = { ...req.body };
            if (req.file) data.logo_url = req.file.path;
            const brand = await brandService.update(req.params.id, data);
            res.json(brand);
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ message: "Dữ liệu đã tồn tại (trùng Name hoặc Slug)" });
            }
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
            }
            res.status(400).json({ message: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            await brandService.delete(req.params.id);
            res.json({ message: "Xóa thương hiệu thành công" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    toggleStatus: async (req, res) => {
        try {
            const brand = await brandService.toggleStatus(req.params.id);
            res.json({ message: "Cập nhật trạng thái thành công", brand });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

export default brandController;
