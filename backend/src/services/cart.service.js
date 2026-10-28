import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import AppError from "../utils/AppError.js";
import { Op } from "sequelize";

const cartService = {
    getCart: async (userId) => {
        const items = await Cart.findAll({
            where: { user_id: userId },
            include: [{
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'slug', 'price', 'image_url', 'stock', 'status']
            }]
        });

        // Dọn các dòng không còn bán được (sản phẩm ngừng bán hoặc đã bị xóa)
        // để giỏ hiển thị và bước thanh toán luôn khớp nhau.
        const unavailableIds = items
            .filter((item) => !item.product || item.product.status !== 'active')
            .map((item) => item.id);
        if (unavailableIds.length > 0) {
            await Cart.destroy({ where: { id: { [Op.in]: unavailableIds } } });
        }

        return items.filter((item) => item.product && item.product.status === 'active');
    },

    addToCart: async (userId, productId, quantity = 1) => {
        // Check if product exists
        const product = await Product.findByPk(productId);
        if (!product) throw new AppError(404, 'Sản phẩm không tồn tại');
        if (product.status !== 'active') throw new AppError(400, 'Sản phẩm đã ngừng bán');
        if (product.stock < quantity) throw new AppError(400, 'Số lượng sản phẩm trong kho không đủ');

        // Check if item already in cart
        let cartItem = await Cart.findOne({
            where: { user_id: userId, product_id: productId }
        });

        if (cartItem) {
            cartItem.quantity += parseInt(quantity);
            if (product.stock < cartItem.quantity) throw new AppError(400, 'Số lượng vượt quá tồn kho');
            await cartItem.save();
        } else {
            try {
                cartItem = await Cart.create({
                    user_id: userId,
                    product_id: productId,
                    quantity: parseInt(quantity)
                });
            } catch (err) {
                // Xử lý Race Condition khi nhiều luồng cùng insert đồng thời gây duplicate unique_cart
                if (err.name === 'SequelizeUniqueConstraintError' || err.original?.code === 'ER_DUP_ENTRY') {
                    cartItem = await Cart.findOne({
                        where: { user_id: userId, product_id: productId }
                    });
                    if (cartItem) {
                        cartItem.quantity += parseInt(quantity);
                        if (product.stock < cartItem.quantity) throw new AppError(400, 'Số lượng vượt quá tồn kho');
                        await cartItem.save();
                    }
                } else {
                    throw err;
                }
            }
        }

        return cartItem;
    },

    updateQuantity: async (userId, productId, quantity) => {
        const cartItem = await Cart.findOne({
            where: { user_id: userId, product_id: productId }
        });

        if (!cartItem) throw new AppError(404, 'Sản phẩm không có trong giỏ hàng');

        const product = await Product.findByPk(productId);
        if (!product) throw new AppError(404, 'Sản phẩm không tồn tại');
        if (product.status !== 'active') throw new AppError(400, 'Sản phẩm đã ngừng bán');
        if (product.stock < quantity) throw new AppError(400, 'Số lượng sản phẩm trong kho không đủ');

        cartItem.quantity = parseInt(quantity);
        await cartItem.save();
        return cartItem;
    },

    removeFromCart: async (userId, productId) => {
        const deleted = await Cart.destroy({
            where: { user_id: userId, product_id: productId }
        });

        if (!deleted) throw new AppError(404, 'Sản phẩm không có trong giỏ hàng');
        return true;
    },

    clearCart: async (userId) => {
        await Cart.destroy({
            where: { user_id: userId }
        });
        return true;
    },

    syncCart: async (userId, items) => {
        if (!Array.isArray(items)) return;

        for (const item of items) {
            const productId = item.product_id || item.id || item._id;
            const quantity = parseInt(item.quantity) || 1;

            const product = await Product.findByPk(productId);
            if (!product || product.status !== 'active' || product.stock < 1) continue;

            let cartItem = await Cart.findOne({
                where: { user_id: userId, product_id: productId }
            });

            const finalQuantity = cartItem ? (cartItem.quantity + quantity) : quantity;
            const cappedQuantity = Math.min(finalQuantity, product.stock);

            if (cartItem) {
                cartItem.quantity = cappedQuantity;
                await cartItem.save();
            } else {
                await Cart.create({
                    user_id: userId,
                    product_id: productId,
                    quantity: cappedQuantity
                });
            }
        }
        return await cartService.getCart(userId);
    }
};

export default cartService;
