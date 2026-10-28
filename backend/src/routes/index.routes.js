import express from 'express';
import authRoutes from './auth.routes.js'
import brandRoutes from './brand.routes.js'
import categoryRoutes from './category.routes.js'
import productRoutes from './product.routes.js'
import cartRoutes from './cart.routes.js'
import orderRoutes from './order.routes.js'
import paymentRoutes from './payment.routes.js'
import reviewRoutes from './review.routes.js'
import wishlistRoutes from './wishlist.routes.js'
import voucherRoutes from './voucher.routes.js'
import adminRoutes from './admin.routes.js'
import userAddressRoutes from './user_address.routes.js'
import aiRoutes from './ai.routes.js';
import bannerRoutes from './banner.routes.js';
import warrantyRoutes from './warranty.routes.js';
import flashSaleRoutes from './flash-sale.routes.js';
import notificationRoutes from './notification.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/brands', brandRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/carts', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/vouchers', voucherRoutes);
router.use('/payments', paymentRoutes);
router.use('/reviews', reviewRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/admin', adminRoutes);
router.use('/addresses', userAddressRoutes);
router.use('/ai', aiRoutes);
router.use('/banners', bannerRoutes);
router.use('/warranties', warrantyRoutes);
router.use('/flash-sales', flashSaleRoutes);
router.use('/notifications', notificationRoutes);

export default router;