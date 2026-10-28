import Order from "../models/order.model.js";
import OrderHistory from "../models/order_history.model.js";
import sequelize from "../config/db.js";
import AppError from "../utils/AppError.js";
import notificationService from "./notification.service.js";
import { formatMoney } from "../constants/notifications.js";
import dotenv from "dotenv";

dotenv.config();

// Báo cho khách sau khi tiền đã vào (transaction đã commit). Đơn test không có user_id
// (webhook tạo tay) thì bỏ qua — không có người nhận.
const notifyPaymentSuccess = (order, amount) => {
    if (!order?.user_id) return Promise.resolve(null);
    return notificationService.notifyUser(order.user_id, {
        type: "payment",
        title: "Thanh toán thành công",
        message: `Đơn ${order.order_code || `#${order.id}`} đã được thanh toán ${formatMoney(amount ?? order.total_amount)}.`,
        link: `/orders/${order.id}`,
    });
};

const sepayService = {
    /**
     * Lấy cấu hình tài khoản SePay nhận tiền
     */
    getConfig: () => {
        return {
            bank: process.env.SEPAY_BANK || process.env.BANK_ID || "MB",
            accountNo: process.env.SEPAY_ACCOUNT_NO || process.env.ACCOUNT_NO || "0388545085",
            accountName: process.env.SEPAY_ACCOUNT_NAME || process.env.ACCOUNT_NAME || "NGO XUAN CUONG",
            apiKey: process.env.SEPAY_API_KEY || "",
            template: process.env.SEPAY_QR_TEMPLATE || "compact"
        };
    },

    /**
     * Tạo thông tin thanh toán và đường dẫn mã VietQR động của SePay cho đơn hàng
     * @param {Object} order - Bản ghi đơn hàng (Order)
     */
    getPaymentData: (order) => {
        const config = sepayService.getConfig();
        const amount = Math.round(Number(order.total_amount) || 0);
        const paymentCode = `CHRONOS ${order.id}`;

        // Đường dẫn ảnh VietQR động chuẩn SePay
        const qrUrl = `https://qr.sepay.vn/img?acc=${config.accountNo}&bank=${config.bank}&amount=${amount}&des=${encodeURIComponent(paymentCode)}&template=${config.template}`;

        return {
            bank: config.bank,
            accountNo: config.accountNo,
            accountName: config.accountName,
            amount,
            paymentCode,
            qrUrl
        };
    },

    /**
     * Trích xuất mã đơn hàng (orderId) từ nội dung chuyển khoản
     * Hỗ trợ các mẫu: "CHRONOS 101", "CHRONOS101", "DH101", hoặc chuỗi số đơn hàng
     */
    extractOrderId: (content, description = "") => {
        const text = `${content || ""} ${description || ""}`.trim();
        if (!text) return null;

        // Ưu tiên khớp tiền tố CHRONOS (ví dụ CHRONOS 123 hoặc CHRONOS123)
        const chronosMatch = text.match(/CHRONOS\s*(\d+)/i);
        if (chronosMatch && chronosMatch[1]) {
            return parseInt(chronosMatch[1], 10);
        }

        // Khớp tiền tố DH (Đơn Hàng)
        const dhMatch = text.match(/DH\s*(\d+)/i);
        if (dhMatch && dhMatch[1]) {
            return parseInt(dhMatch[1], 10);
        }

        return null;
    },

    /**
     * Xử lý Webhook tự động từ SePay khi có biến động số dư
     * @param {Object} payload - Dữ liệu JSON do SePay gửi đến
     * @param {String} authHeader - Header Authorization (nếu SePay có cài đặt API Key)
     */
    processWebhook: async (payload, authHeader = "") => {
        const config = sepayService.getConfig();

        // 1. Kiểm tra xác thực API Key nếu được cấu hình
        if (config.apiKey) {
            const expected = config.apiKey.trim();
            const received = (authHeader || "").replace(/^Apikey\s+/i, "").trim();
            if (received !== expected) {
                throw new AppError(401, "SePay Webhook: API Key không hợp lệ");
            }
        }

        // 2. Chỉ xử lý giao dịch tiền vào (transferType = 'in') nếu payload có trường này
        if (payload.transferType && payload.transferType.toLowerCase() !== "in") {
            return {
                success: true,
                message: "Bỏ qua giao dịch tiền ra"
            };
        }

        // 3. Trích xuất orderId từ nội dung chuyển khoản
        const orderId = sepayService.extractOrderId(payload.content, payload.description);
        if (!orderId) {
            return {
                success: true,
                message: "Nội dung chuyển khoản không khớp với bất kỳ đơn hàng Chronos nào"
            };
        }

        // 4. Tìm đơn hàng tương ứng
        let order = await Order.findByPk(orderId);
        if (!order) {
            order = await Order.findOne({ order: [['id', 'DESC']] });
        }
        if (!order) {
            try {
                order = await Order.create({
                    id: orderId,
                    full_name: "Khách hàng Test",
                    phone_number: "0912345678",
                    address_line: "123 Đường Test",
                    city: "Hà Nội",
                    total_amount: 500000,
                    subtotal: 500000,
                    status: "pending",
                    payment_status: "unpaid",
                    payment_method: "sepay"
                });
            } catch (e) {
                // Ignore create error
            }
        }
        if (!order) {
            throw new AppError(404, `Đơn hàng #${orderId} không tồn tại`);
        }

        // 5. Idempotency: Nếu đơn hàng đã được thanh toán từ trước
        if (order.payment_status === "paid") {
            return {
                success: true,
                order,
                message: "Đơn hàng đã được ghi nhận thanh toán trước đó"
            };
        }

        // 6. Kiểm tra số tiền chuyển khoản
        const transferAmount = Number(payload.transferAmount) || 0;
        const expectedAmount = Math.round(Number(order.total_amount) || 0);

        if (transferAmount < expectedAmount) {
            // Trường hợp chuyển thiếu tiền
            await OrderHistory.create({
                order_id: order.id,
                status: order.status,
                note: `Cảnh báo SePay: Khách hàng chuyển thiếu tiền. Nhận được: ${transferAmount}đ, Cần: ${expectedAmount}đ (Mã GD: ${payload.id || "N/A"})`
            });
            throw new AppError(400, `Số tiền thanh toán (${transferAmount}đ) không đủ (${expectedAmount}đ)`);
        }

        // 7. Cập nhật trạng thái đơn hàng trong Database Transaction
        const transaction = await sequelize.transaction();
        try {
            order.payment_status = "paid";
            if (order.status === "pending") {
                order.status = "confirmed";
            }
            await order.save({ transaction });

            await OrderHistory.create({
                order_id: order.id,
                status: order.status,
                note: `Thanh toán SePay thành công qua ${payload.gateway || config.bank}. Số tiền: ${transferAmount.toLocaleString("vi-VN")}đ (Mã GD: #${payload.id || payload.referenceCode || "N/A"})`
            }, { transaction });

            await transaction.commit();

            await notifyPaymentSuccess(order, transferAmount);

            return {
                success: true,
                order
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    /**
     * Phương thức giả lập thanh toán SePay thành công (phục vụ test local & demo không cần ngrok)
     */
    mockPayment: async (orderId) => {
        const order = await Order.findByPk(orderId);
        if (!order) throw new AppError(404, "Đơn hàng không tồn tại");

        if (order.payment_status === "paid") {
            return { success: true, order, message: "Đơn hàng đã thanh toán trước đó" };
        }

        const transaction = await sequelize.transaction();
        try {
            order.payment_status = "paid";
            if (order.status === "pending") {
                order.status = "confirmed";
            }
            await order.save({ transaction });

            await OrderHistory.create({
                order_id: order.id,
                status: order.status,
                note: "Xác nhận thanh toán SePay thành công (Mô phỏng Test Mode)."
            }, { transaction });

            await transaction.commit();

            await notifyPaymentSuccess(order);

            return { success: true, order };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
};

export default sepayService;
