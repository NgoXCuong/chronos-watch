import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

const cartService = {
    getCart: async (userId) => {
        return await Cart.findAll({
            where: { user_id: userId },
            include: [{
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'slug', 'price', 'image_url', 'stock']
            }]
        });
    },

    addToCart: async (userId, productId, quantity = 1) => {
        // Check if product exists
        const product = await Product.findByPk(productId);
        if (!product) throw new Error('Sản phẩm không tồn tại');
        if (product.stock < quantity) throw new Error('Số lượng sản phẩm trong kho không đủ');

        // Check if item already in cart
        let cartItem = await Cart.findOne({
            where: { user_id: userId, product_id: productId }
        });

        if (cartItem) {
            cartItem.quantity += parseInt(quantity);
            if (product.stock < cartItem.quantity) throw new Error('Số lượng vượt quá tồn kho');
            await cartItem.save();
        } else {
            cartItem = await Cart.create({
                user_id: userId,
                product_id: productId,
                quantity: parseInt(quantity)
            });
        }

        return cartItem;
    },

    updateQuantity: async (userId, productId, quantity) => {
        const cartItem = await Cart.findOne({
            where: { user_id: userId, product_id: productId }
        });

        if (!cartItem) throw new Error('Sản phẩm không có trong giỏ hàng');

        const product = await Product.findByPk(productId);
        if (product.stock < quantity) throw new Error('Số lượng sản phẩm trong kho không đủ');

        cartItem.quantity = parseInt(quantity);
        await cartItem.save();
        return cartItem;
    },

    removeFromCart: async (userId, productId) => {
        const deleted = await Cart.destroy({
            where: { user_id: userId, product_id: productId }
        });

        if (!deleted) throw new Error('Sản phẩm không có trong giỏ hàng');
        return true;
    },

    clearCart: async (userId) => {
        await Cart.destroy({
            where: { user_id: userId }
        });
        return true;
    }
};

export default cartService;
