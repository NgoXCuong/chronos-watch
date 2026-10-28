import Wishlist from '../models/wishlist.model.js';
import Product from '../models/product.model.js';
import Brand from '../models/brand.model.js';
import AppError from "../utils/AppError.js";

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
            // Check if product exists and is still sellable
            const product = await Product.findByPk(productId);
            if (!product) throw new AppError(404, "Sản phẩm không tồn tại.");
            if (product.status !== 'active') {
                throw new AppError(400, "Sản phẩm đã ngừng bán.");
            }

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
                    // Giữ cả sản phẩm inactive để khách biết món đã lưu không còn bán,
                    // nhưng không join sâu thêm dữ liệu không dùng tới.
                    attributes: ['id', 'name', 'price', 'old_price', 'image_url', 'slug', 'status'],
                    include: [{ model: Brand, as: 'brand', attributes: ['name'] }]
                }
            ],
            order: [['created_at', 'DESC']]
        });
    }
};

export default wishlistService;
