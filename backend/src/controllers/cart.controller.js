import cartService from "../services/cart.service.js";
import formatSequelizeError from "../utils/errorHandler.js";

const cartController = {
    getCart: async (req, res) => {
        try {
            const cartItems = await cartService.getCart(req.user.id);
            res.json(cartItems);
        } catch (error) {
            res.status(400).json({ message: formatSequelizeError(error) });
        }
    },

    addToCart: async (req, res) => {
        try {
            const { product_id, quantity } = req.body;
            if (!product_id) return res.status(400).json({ message: "Thiếu product_id" });

            const cartItem = await cartService.addToCart(req.user.id, product_id, quantity || 1);
            res.status(201).json({
                message: "Đã thêm vào giỏ hàng",
                cartItem
            });
        } catch (error) {
            res.status(400).json({ message: formatSequelizeError(error) });
        }
    },

    updateQuantity: async (req, res) => {
        try {
            const { product_id, quantity } = req.body;
            if (!product_id || !quantity) return res.status(400).json({ message: "Thiếu thông tin cập nhật" });

            const cartItem = await cartService.updateQuantity(req.user.id, product_id, quantity);
            res.json({
                message: "Cập nhật số lượng thành công",
                cartItem
            });
        } catch (error) {
            res.status(400).json({ message: formatSequelizeError(error) });
        }
    },

    removeFromCart: async (req, res) => {
        try {
            const { productId } = req.params;
            await cartService.removeFromCart(req.user.id, productId);
            res.json({ message: "Đã xóa sản phẩm khỏi giỏ hàng" });
        } catch (error) {
            res.status(400).json({ message: formatSequelizeError(error) });
        }
    },

    clearCart: async (req, res) => {
        try {
            await cartService.clearCart(req.user.id);
            res.json({ message: "Giỏ hàng đã được làm trống" });
        } catch (error) {
            res.status(400).json({ message: formatSequelizeError(error) });
        }
    }
};

export default cartController;
