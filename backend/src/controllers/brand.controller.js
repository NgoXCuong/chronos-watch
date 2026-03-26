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
            const brand = await brandService.create(req.body);
            res.status(201).json(brand);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const brand = await brandService.update(req.params.id, req.body);
            res.json(brand);
        } catch (error) {
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
    }
};

export default brandController;
