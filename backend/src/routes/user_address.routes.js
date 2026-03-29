import express from 'express';
import userAddressController from '../controllers/user_address.controller.js';
import verifyToken from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(verifyToken); // Tất cả các API này yêu cầu đăng nhập

router.get('/', userAddressController.getAddresses);
router.post('/', userAddressController.addAddress);
router.put('/:id', userAddressController.updateAddress);
router.delete('/:id', userAddressController.deleteAddress);
router.patch('/:id/set-default', userAddressController.setDefault);

export default router;
