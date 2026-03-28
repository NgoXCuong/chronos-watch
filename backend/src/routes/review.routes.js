import express from 'express';
import reviewController from '../controllers/review.controller.js';
import verifyToken from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/product/:productId', reviewController.getByProduct);

// Private routes (requires Login)
router.post('/', verifyToken, reviewController.create);
router.delete('/:id', verifyToken, reviewController.delete);

export default router;
