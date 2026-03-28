import express from 'express';
import authRoutes from './auth.routes.js'
import brandRoutes from './brand.routes.js'
import categoryRoutes from './category.routes.js'
import productRoutes from './product.routes.js'
import cartRoutes from './cart.routes.js'
import orderRoutes from './order.routes.js'
import paymentRoutes from './payment.routes.js'

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/brands', brandRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/carts', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);

export default router;