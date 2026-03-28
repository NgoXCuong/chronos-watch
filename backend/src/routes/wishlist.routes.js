import express from 'express';
import wishlistController from '../controllers/wishlist.controller.js';
import verifyToken from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/toggle', verifyToken, wishlistController.toggle);
router.get('/', verifyToken, wishlistController.get);

export default router;
