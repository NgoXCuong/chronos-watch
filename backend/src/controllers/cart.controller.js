import cartService from "../services/cart.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

const cartController = {
    getCart: asyncHandler(async (req, res) => {
        const cartItems = await cartService.getCart(req.user.id);
        res.json(cartItems);
    }),

    addToCart: asyncHandler(async (req, res) => {
        const { product_id, quantity } = req.body;
        if (!product_id) throw new AppError(400, "Thiếu product_id");

        const cartItem = await cartService.addToCart(req.user.id, product_id, quantity || 1);
        res.status(201).json({
            message: "Đã thêm vào giỏ hàng",
            cartItem
        });
    }),

    updateQuantity: asyncHandler(async (req, res) => {
        const { product_id, quantity } = req.body;
        if (!product_id || !quantity) throw new AppError(400, "Thiếu thông tin cập nhật");

        const cartItem = await cartService.updateQuantity(req.user.id, product_id, quantity);
        res.json({
            message: "Cập nhật số lượng thành công",
            cartItem
        });
    }),

    removeFromCart: asyncHandler(async (req, res) => {
        const { productId } = req.params;
        await cartService.removeFromCart(req.user.id, productId);
        res.json({ message: "Đã xóa sản phẩm khỏi giỏ hàng" });
    }),

    clearCart: asyncHandler(async (req, res) => {
        await cartService.clearCart(req.user.id);
        res.json({ message: "Giỏ hàng đã được làm trống" });
    }),

    syncCart: asyncHandler(async (req, res) => {
        const { items } = req.body;
        const updatedCart = await cartService.syncCart(req.user.id, items);
        res.json({ message: "Đồng bộ giỏ hàng thành công", cart: updatedCart });
    })
};

export default cartController;
