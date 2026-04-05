import orderService from "../services/order.service.js";
import formatSequelizeError from "../utils/errorHandler.js";

const paymentController = {
    handleVNPayReturn: async (req, res) => {
        try {
            const vnp_Params = req.query;
            const result = await orderService.finishPayment(vnp_Params);
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

            if (result.success) {
                // Redirect to a frontend success page with order details
                res.redirect(`${frontendUrl}/checkout/success?orderId=${result.order.id}`);
            } else {
                res.redirect(`${frontendUrl}/checkout/fail?orderId=${result.order?.id}`);
            }
        } catch (error) {
            console.error('VNPay Return Error:', error);
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            res.redirect(`${frontendUrl}/checkout/fail`);
        }
    },

    handleVNPayIPN: async (req, res) => {
        try {
            const vnp_Params = req.query;
            const result = await orderService.finishPayment(vnp_Params);

            if (result.success) {
                // Return code for VNPay as per their documentation
                res.status(200).json({ RspCode: '00', Message: 'Success' });
            } else {
                // In case of error (e.g., order already confirmed, signature fail)
                // Note: Better error handling based on VNPay's RspCode list could be added
                res.status(200).json({ RspCode: '01', Message: 'Order not found or invalid signature' });
            }
        } catch (error) {
            console.error('IPN Error:', error);
            res.status(200).json({ RspCode: '99', Message: 'Unknown Error' });
        }
    },

    getBankConfig: (req, res) => {
        res.json({
            bankId: process.env.BANK_ID || 'vietcombank',
            accountNo: process.env.ACCOUNT_NO || '0123456789',
            accountName: process.env.ACCOUNT_NAME || 'CHRONOS WATCH VIETNAM',
            template: process.env.VIETQR_TEMPLATE || 'compact',
            qrBaseUrl: process.env.VIETQR_BASE_URL || 'https://img.vietqr.io/image'
        });
    }
};

export default paymentController;
