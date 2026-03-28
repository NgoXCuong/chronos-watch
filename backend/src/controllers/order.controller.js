import orderService from "../services/order.service.js";
import formatSequelizeError from "../utils/errorHandler.js";

const orderController = {
    checkout: async (req, res) => {
        try {
            const ipAddr = req.headers['x-forwarded-for'] || 
                         req.connection.remoteAddress || 
                         req.socket.remoteAddress || 
                         req.connection.socket.remoteAddress;

            const result = await orderService.checkout(req.user.id, req.body, ipAddr);
            res.status(201).json({
                message: result.paymentUrl ? "Vui lòng thực hiện thanh toán" : "Đặt hàng thành công!",
                ...result
            });
        } catch (error) {
            res.status(400).json({ message: formatSequelizeError(error) });
        }
    },

    getMyOrders: async (req, res) => {
        try {
            const orders = await orderService.getUserOrders(req.user.id);
            res.json(orders);
        } catch (error) {
            res.status(400).json({ message: formatSequelizeError(error) });
        }
    },

    getDetail: async (req, res) => {
        try {
            const order = await orderService.getOrderDetail(req.params.id);
            res.json(order);
        } catch (error) {
            res.status(404).json({ message: formatSequelizeError(error) });
        }
    },

    updateStatus: async (req, res) => {
        try {
            const { status, note } = req.body;
            const order = await orderService.updateOrderStatus(req.params.id, status, note);
            res.json({
                message: "Cập nhật trạng thái đơn hàng thành công",
                order
            });
        } catch (error) {
            res.status(400).json({ message: formatSequelizeError(error) });
        }
    },

    cancelOrder: async (req, res) => {
        try {
            const { note } = req.body;
            await orderService.cancelOrder(req.user.id, req.params.id, note);
            res.json({ message: "Đã hủy đơn hàng thành công" });
        } catch (error) {
            res.status(400).json({ message: formatSequelizeError(error) });
        }
    }
};

export default orderController;
