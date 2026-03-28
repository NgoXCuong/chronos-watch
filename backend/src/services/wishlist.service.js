import Wishlist from '../models/wishlist.model.js';
import Product from '../models/product.model.js';
import Brand from '../models/brand.model.js';

const wishlistService = {
    toggleWishlist: async (userId, productId) => {
        const existing = await Wishlist.findOne({
            where: {
                user_id: userId,
                product_id: productId
            }
        });

        if (existing) {
            await existing.destroy();
            return { added: false, message: "Đã xóa sản phẩm khỏi danh sách yêu thích." };
        } else {
            // Check if product exists
            const product = await Product.findByPk(productId);
            if (!product) throw new Error("Sản phẩm không tồn tại.");

            await Wishlist.create({
                user_id: userId,
                product_id: productId
            });
            return { added: true, message: "Đã thêm sản phẩm vào danh sách yêu thích." };
        }
    },

    getWishlist: async (userId) => {
        return await Wishlist.findAll({
            where: { user_id: userId },
            include: [
                { 
                    model: Product, 
                    as: 'product',
                    include: [{ model: Brand, as: 'brand', attributes: ['name'] }]
                }
            ],
            order: [['created_at', 'DESC']]
        });
    }
};

export default wishlistService;
