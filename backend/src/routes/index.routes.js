import express from 'express';
import authRoutes from './auth.routes.js'
import brandRoutes from './brand.routes.js'
import categoryRoutes from './category.routes.js'
import productRoutes from './product.routes.js'

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/brands', brandRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);

export default router;