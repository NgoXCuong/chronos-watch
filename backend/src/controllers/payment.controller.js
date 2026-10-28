import sepayService from "../services/sepay.service.js";
import orderService from "../services/order.service.js";
import asyncHandler from "../utils/asyncHandler.js";

const paymentController = {
    // Xử lý Webhook gửi tự động từ SePay khi có biến động số dư
    handleSePayWebhook: asyncHandler(async (req, res) => {
        const payload = req.body;
        const authHeader = req.headers.authorization;
        const result = await sepayService.processWebhook(payload, authHeader);
        // Trả về JSON theo đúng chuẩn SePay mong đợi
        res.status(200).json({ success: true, ...result });
    }),

    // API Mô phỏng thanh toán SePay thành công (Test Mode khi chạy localhost không có ngrok)
    mockSePayPayment: asyncHandler(async (req, res) => {
        const { orderId } = req.params;
        const result = await sepayService.mockPayment(orderId);
        res.status(200).json({
            message: "Giả lập thanh toán SePay thành công",
            ...result
        });
    }),

    // Lấy thông tin thanh toán VietQR SePay của đơn hàng
    getSePayPaymentInfo: asyncHandler(async (req, res) => {
        const { orderId } = req.params;
        const order = await orderService.getOrderDetail(orderId, req.user?.id, req.user?.role);
        const paymentData = sepayService.getPaymentData(order);
        res.json({
            order,
            paymentData
        });
    }),

    // Cung cấp thông tin cấu hình ngân hàng hiển thị
    getBankConfig: asyncHandler(async (req, res) => {
        const config = sepayService.getConfig();
        res.json({
            bankId: config.bank,
            accountNo: config.accountNo,
            accountName: config.accountName,
            template: config.template,
            qrBaseUrl: "https://qr.sepay.vn/img"
        });
    })
};

export default paymentController;
