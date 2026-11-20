import OrderHistory from "../models/order_history.model.js";
import { withLockedOrder } from "../utils/lockedOrder.js";
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
        const paymentCode = order.order_code || `CHRONOS ${order.id}`;

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

    // Ngân hàng có thể bỏ dấu gạch ngang trong nội dung CHR-YYMMDD-XXXXXX.
    // Khôi phục đúng mã để tra unique order_code, không suy đoán O/0 hay chọn đơn gần nhất.
    extractOrderCode: (content, description = "") => {
        const text = `${content || ''} ${description || ''}`;
        const matches = [...text.matchAll(/\bCHR[\s-]*(\d{6})[\s-]*([A-Z0-9]{6})(?![A-Z0-9])/gi)];
        const codes = [...new Set(matches.map((match) => `CHR-${match[1]}-${match[2].toUpperCase()}`))];
        if (codes.length > 1) throw new AppError(400, "Nội dung chuyển khoản có nhiều mã đơn hàng");
        return codes[0] || null;
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

    processWebhook: async (payload, authHeader = "") => {
        const config = sepayService.getConfig();
        const expectedKey = config.apiKey.trim();
        if (!expectedKey) throw new AppError(503, "Chưa cấu hình khóa xác thực SePay Webhook");
        const match = /^Apikey\s+(.+)$/i.exec(authHeader);
        if (!match || match[1].trim() !== expectedKey) {
            throw new AppError(401, "SePay Webhook: API Key không hợp lệ");
        }
        if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
            throw new AppError(400, "Dữ liệu SePay không hợp lệ");
        }
        if (payload.transferType !== 'in') {
            return { success: true, message: "Bỏ qua giao dịch không phải tiền vào" };
        }
        if (String(payload.accountNumber || '') !== String(config.accountNo)) {
            throw new AppError(400, "Tài khoản nhận tiền SePay không khớp cấu hình");
        }
        const transferAmount = Number(payload.transferAmount);
        if (!Number.isFinite(transferAmount) || transferAmount <= 0) {
            throw new AppError(400, "Số tiền thanh toán không hợp lệ");
        }
        const orderCode = sepayService.extractOrderCode(payload.content, payload.description);
        const orderId = orderCode ? null : sepayService.extractOrderId(payload.content, payload.description);
        if (!orderCode && !orderId) return { success: true, message: "Nội dung chuyển khoản không khớp với bất kỳ đơn hàng Chronos nào" };

        const where = orderCode ? { order_code: orderCode } : { id: orderId };
        const result = await withLockedOrder(where, async (order, transaction) => {
            if (['cancelled', 'returned'].includes(order.status)) {
                return { success: true, message: "Đơn đã hủy/hoàn trả; cần đối soát khoản tiền nhận được" };
            }
            if (order.payment_status === 'paid') {
                return { success: true, order, message: "Đơn hàng đã được ghi nhận thanh toán trước đó" };
            }
            if (!['sepay', 'banking'].includes(order.payment_method)) {
                throw new AppError(400, "Đơn hàng không sử dụng thanh toán chuyển khoản");
            }
            const expectedAmount = Number(order.total_amount);
            if (!Number.isFinite(expectedAmount) || expectedAmount < 0) {
                throw new AppError(400, "Tổng tiền đơn hàng không hợp lệ");
            }
            if (transferAmount < expectedAmount) {
                throw new AppError(400, `Số tiền thanh toán (${transferAmount}đ) không đủ (${expectedAmount}đ)`);
            }
            order.payment_status = 'paid';
            if (order.status === 'pending') order.status = 'confirmed';
            await order.save({ transaction });
            await OrderHistory.create({
                order_id: order.id, status: order.status,
                note: `Thanh toán SePay thành công qua ${payload.gateway || config.bank}. Số tiền: ${transferAmount.toLocaleString("vi-VN")}đ (Mã GD: #${payload.id || payload.referenceCode || "N/A"})`,
            }, { transaction });
            return { success: true, order, newlyPaid: true };
        });
        if (result.newlyPaid) await notifyPaymentSuccess(result.order, transferAmount);
        const { newlyPaid, ...response } = result;
        return response;
    },

    mockPayment: async (orderId, actor) => {
        if (process.env.NODE_ENV === 'production' || process.env.ENABLE_MOCK_PAYMENTS !== 'true') {
            throw new AppError(404, "Chức năng giả lập thanh toán đã tắt");
        }
        if (actor?.role !== 'admin') throw new AppError(403, "Chỉ Admin được giả lập thanh toán");
        const result = await withLockedOrder({ id: orderId }, async (order, transaction) => {
            if (['cancelled', 'returned'].includes(order.status) || !['sepay', 'banking'].includes(order.payment_method)) {
                throw new AppError(400, "Đơn hàng không hợp lệ để giả lập thanh toán");
            }
            if (order.payment_status === 'paid') return { success: true, order };
            order.payment_status = 'paid';
            if (order.status === 'pending') order.status = 'confirmed';
            await order.save({ transaction });
            await OrderHistory.create({
                order_id: order.id, status: order.status, changed_by: actor.id,
                note: "Admin giả lập thanh toán SePay (môi trường demo).",
            }, { transaction });
            return { success: true, order, newlyPaid: true };
        });
        if (result.newlyPaid) await notifyPaymentSuccess(result.order);
        const { newlyPaid, ...response } = result;
        return response;
    },
};

export default sepayService;
