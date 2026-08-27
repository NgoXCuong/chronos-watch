import wishlistService from '../services/wishlist.service.js';
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

const wishlistController = {
    toggle: asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const productId = req.body.product_id;
        if (!productId) throw new AppError(400, "product_id là bắt buộc.");
        
        const result = await wishlistService.toggleWishlist(userId, productId);
        res.json(result);
    }),

    get: asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const items = await wishlistService.getWishlist(userId);
        res.json(items);
    })
};

export default wishlistController;
