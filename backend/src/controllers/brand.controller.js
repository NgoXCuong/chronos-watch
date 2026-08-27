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

    toggleStatus: asyncHandler(async (req, res) => {
        const brand = await brandService.toggleStatus(req.params.id);
        res.json({ message: "Cập nhật trạng thái thành công", brand });
    })
};

export default brandController;
