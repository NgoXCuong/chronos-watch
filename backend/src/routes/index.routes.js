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

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/brands', brandRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/carts', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/vouchers', voucherRoutes);
router.use('/payments', paymentRoutes);
router.use('/reviews', reviewRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/admin', adminRoutes);
router.use('/addresses', userAddressRoutes);

export default router;