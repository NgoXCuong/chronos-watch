import bannerService from "../services/banner.service.js";
import formatSequelizeError from "../utils/errorHandler.js";

const bannerController = {
    getAll: async (req, res) => {
        try {
            const banners = await bannerService.getAll(req.query);
            res.json(banners);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    getDetail: async (req, res) => {
        try {
            const banner = await bannerService.getById(req.params.id);
            res.json(banner);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    },

    create: async (req, res) => {
        try {
            const data = { ...req.body };
            if (req.file) {
                // Giống Brand/Product, lưu path vào image_url
                data.image_url = req.file.path;
            } else {
                return res.status(400).json({ message: "Vui lòng tải lên ảnh banner" });
            }
            
            const banner = await bannerService.create(data);
            res.status(201).json(banner);
        } catch (error) {
            res.status(400).json({ message: formatSequelizeError(error) });
        }
    },

    update: async (req, res) => {
        try {
            const data = { ...req.body };
            if (req.file) data.image_url = req.file.path;
            
            const banner = await bannerService.update(req.params.id, data);
            res.json(banner);
        } catch (error) {
            res.status(400).json({ message: formatSequelizeError(error) });
        }
    },

    delete: async (req, res) => {
        try {
            await bannerService.delete(req.params.id);
            res.json({ message: "Xóa banner thành công" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    toggleStatus: async (req, res) => {
        try {
            const banner = await bannerService.toggleStatus(req.params.id);
            res.json({ message: "Cập nhật trạng thái thành công", banner });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

export default bannerController;
