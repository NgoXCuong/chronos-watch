import wishlistService from '../services/wishlist.service.js';

const wishlistController = {
    toggle: async (req, res) => {
        try {
            const userId = req.user.id;
            const productId = req.body.product_id;
            if (!productId) throw new Error("product_id là bắt buộc.");
            
            const result = await wishlistService.toggleWishlist(userId, productId);
            res.json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    get: async (req, res) => {
        try {
            const userId = req.user.id;
            const items = await wishlistService.getWishlist(userId);
            res.json(items);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

export default wishlistController;
