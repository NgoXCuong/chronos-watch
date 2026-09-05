import orderService from "../services/order.service.js";
import asyncHandler from "../utils/asyncHandler.js";

const orderController = {
    checkout: asyncHandler(async (req, res) => {
        const ipAddr = req.headers['x-forwarded-for'] || 
                     req.connection.remoteAddress || 
                     req.socket.remoteAddress || 
                     req.connection.socket.remoteAddress;

        const result = await orderService.checkout(req.user.id, req.body, ipAddr);
        res.status(201).json({
            message: result.paymentUrl ? "Vui lòng thực hiện thanh toán" : "Đặt hàng thành công!",
            ...result
        });
    }),

    getMyOrders: asyncHandler(async (req, res) => {
        const orders = await orderService.getUserOrders(req.user.id);
        res.json(orders);
    }),

    getDetail: asyncHandler(async (req, res) => {
        const order = await orderService.getOrderDetail(req.params.id, req.user?.id, req.user?.role);
        res.json(order);
    }),

    updateStatus: asyncHandler(async (req, res) => {
        const { status, note } = req.body;
        const order = await orderService.updateOrderStatus(req.params.id, status, note);
        res.json({
            message: "Cập nhật trạng thái đơn hàng thành công",
            order
        });
    }),

    markAsPaid: asyncHandler(async (req, res) => {
        const order = await orderService.markAsPaid(req.params.id);
        res.json({ message: "Đã xác nhận thu tiền COD thành công", order });
    }),

    cancelOrder: asyncHandler(async (req, res) => {
        const { note } = req.body;
        await orderService.cancelOrder(req.user.id, req.params.id, note);
        res.json({ message: "Đã hủy đơn hàng thành công" });
    }),

    retryPayment: asyncHandler(async (req, res) => {
        const ipAddr = req.headers['x-forwarded-for'] || 
                     req.connection.remoteAddress || 
                     req.socket.remoteAddress || 
                     req.connection.socket.remoteAddress;

        const result = await orderService.retryVNPayPayment(req.params.id, req.user.id, ipAddr);
        res.json({
            message: "Tạo liên kết thanh toán lại thành công",
            ...result
        });
    }),

    switchCOD: asyncHandler(async (req, res) => {
        const result = await orderService.switchPaymentMethodToCOD(req.params.id, req.user.id);
        res.json({
            message: "Đã chuyển phương thức thanh toán sang COD thành công",
            ...result
        });
    })
};

export default orderController;
