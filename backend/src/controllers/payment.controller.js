import orderService from "../services/order.service.js";
import formatSequelizeError from "../utils/errorHandler.js";

const paymentController = {
    handleVNPayReturn: async (req, res) => {
        try {
            const vnp_Params = req.query;
            const result = await orderService.finishPayment(vnp_Params);

            if (result.success) {
                // Redirect to a frontend success page (if it exists) or return JSON
                // For now, returning JSON since it's backend-only focus
                res.json({
                    message: "Thanh toán thành công!",
                    order: result.order
                });
            } else {
                res.status(400).json({
                    message: "Thanh toán thất bại hoặc chữ ký không hợp lệ",
                    order: result.order
                });
            }
        } catch (error) {
            res.status(500).json({ message: formatSequelizeError(error) });
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
    }
};

export default paymentController;
