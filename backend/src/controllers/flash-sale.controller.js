import flashSaleService from '../services/flash-sale.service.js';
import asyncHandler from '../utils/asyncHandler.js';

// Không cần đăng nhập: trang chủ và card sản phẩm đều đọc được ưu đãi.
const flashSaleController = {
    getCurrent: asyncHandler(async (req, res) => {
        res.json(await flashSaleService.getCurrent(req.query));
    }),

    // Tra nhanh ưu đãi của một sản phẩm (trang chi tiết) — trả {flash: null} khi
    // không có đợt nào đang chạy để UI khỏi phải tự lọc mảng.
    getProductFlash: asyncHandler(async (req, res) => {
        const flash = await flashSaleService.getProductFlash(req.params.id);
        res.json({ flash });
    }),
};

export default flashSaleController;
