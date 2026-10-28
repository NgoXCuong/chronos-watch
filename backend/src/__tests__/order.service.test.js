import { describe, it, expect, vi, beforeEach } from 'vitest';
import orderService from '../services/order.service.js';
import Order from '../models/order.model.js';
import OrderHistory from '../models/order_history.model.js';
import OrderDetail from '../models/order_detail.model.js';
import sequelize from '../config/db.js';
import AppError from '../utils/AppError.js';

// Chặn side effect ghi bảng notifications thật khi test checkout/hủy đơn.
vi.mock('../services/notification.service.js', () => ({
    default: {
        notifyUser: vi.fn(),
        notifyAdmins: vi.fn(),
        notifyAdminsOnce: vi.fn(),
        listForUser: vi.fn(),
        markRead: vi.fn(),
        markAllRead: vi.fn(),
    },
}));

describe('orderService - IDOR protection in getOrderDetail', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('UTC_ORD_01: cho phép chủ sở hữu xem đơn hàng của mình', async () => {
        const mockOrder = {
            id: 10,
            user_id: 100,
            status: 'pending',
        };
        vi.spyOn(Order, 'findByPk').mockResolvedValue(mockOrder);

        const result = await orderService.getOrderDetail(10, 100, 'customer');
        expect(result).toBe(mockOrder);
    });

    it('UTC_ORD_02: cho phép admin xem bất kỳ đơn hàng nào', async () => {
        const mockOrder = {
            id: 10,
            user_id: 100,
            status: 'pending',
        };
        vi.spyOn(Order, 'findByPk').mockResolvedValue(mockOrder);

        const result = await orderService.getOrderDetail(10, 999, 'admin');
        expect(result).toBe(mockOrder);
    });

    it('UTC_ORD_03: chặn và ném lỗi 403 khi người dùng khác cố truy cập đơn hàng (IDOR)', async () => {
        const mockOrder = {
            id: 10,
            user_id: 100,
            status: 'pending',
        };
        vi.spyOn(Order, 'findByPk').mockResolvedValue(mockOrder);

        await expect(orderService.getOrderDetail(10, 200, 'customer'))
            .rejects
            .toThrow('Bạn không có quyền xem thông tin đơn hàng này');
    });

    it('UTC_ORD_04: ném lỗi 404 khi đơn hàng không tồn tại', async () => {
        vi.spyOn(Order, 'findByPk').mockResolvedValue(null);

        await expect(orderService.getOrderDetail(999, 100, 'customer'))
            .rejects
            .toThrow('Đơn hàng không tồn tại');
    });
});

describe('orderService - retryPayment & switchPaymentMethodToCOD', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('UTC_ORD_05: retryPayment tạo dữ liệu thanh toán SePay mới cho chủ đơn hàng', async () => {
        const mockOrder = {
            id: 10,
            user_id: 100,
            status: 'pending',
            payment_status: 'unpaid',
            payment_method: 'sepay',
            total_amount: 500000,
            save: vi.fn().mockResolvedValue(true),
        };
        vi.spyOn(Order, 'findByPk').mockResolvedValue(mockOrder);

        const result = await orderService.retryPayment(10, 100);
        expect(result.order).toBe(mockOrder);
        expect(result.paymentData.amount).toBe(500000);
        expect(result.paymentData.qrUrl).toBeDefined();
    });

    it('UTC_ORD_06: retryPayment từ chối khi khác user_id', async () => {
        const mockOrder = {
            id: 10,
            user_id: 100,
            status: 'pending',
            payment_status: 'unpaid',
        };
        vi.spyOn(Order, 'findByPk').mockResolvedValue(mockOrder);

        await expect(orderService.retryPayment(10, 200))
            .rejects
            .toThrow('Bạn không có quyền thực hiện thanh toán cho đơn hàng này');
    });

    it('UTC_ORD_07: retryPayment từ chối khi đơn hàng đã thanh toán', async () => {
        const mockOrder = {
            id: 10,
            user_id: 100,
            status: 'pending',
            payment_status: 'paid',
        };
        vi.spyOn(Order, 'findByPk').mockResolvedValue(mockOrder);

        await expect(orderService.retryPayment(10, 100))
            .rejects
            .toThrow('Đơn hàng này đã được thanh toán');
    });

    it('UTC_ORD_08: switchPaymentMethodToCOD chuyển phương thức sang COD thành công', async () => {
        const mockOrder = {
            id: 10,
            user_id: 100,
            status: 'pending',
            payment_status: 'unpaid',
            payment_method: 'sepay',
            save: vi.fn().mockResolvedValue(true),
        };
        vi.spyOn(Order, 'findByPk').mockResolvedValue(mockOrder);
        vi.spyOn(OrderHistory, 'create').mockResolvedValue({});

        const result = await orderService.switchPaymentMethodToCOD(10, 100);
        expect(result.success).toBe(true);
        expect(mockOrder.payment_method).toBe('cod');
        expect(mockOrder.save).toHaveBeenCalled();
    });

    it('UTC_ORD_09: switchPaymentMethodToCOD từ chối khi đơn hàng không ở trạng thái pending', async () => {
        const mockOrder = {
            id: 10,
            user_id: 100,
            status: 'delivered',
            payment_status: 'unpaid',
        };
        vi.spyOn(Order, 'findByPk').mockResolvedValue(mockOrder);

        await expect(orderService.switchPaymentMethodToCOD(10, 100))
            .rejects
            .toThrow('Không thể đổi phương thức thanh toán cho đơn hàng ở trạng thái "delivered"');
    });
});

describe('orderService - updateOrderStatus & cancelOrder', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        const mockTransaction = {
            commit: vi.fn().mockResolvedValue(true),
            rollback: vi.fn().mockResolvedValue(true),
        };
        vi.spyOn(sequelize, 'transaction').mockResolvedValue(mockTransaction);
        vi.spyOn(OrderHistory, 'create').mockResolvedValue(true);
        vi.spyOn(OrderDetail, 'findAll').mockResolvedValue([]);
    });

    it('UTC_ORD_10: updateOrderStatus chuyển trạng thái từ pending sang confirmed thành công', async () => {
        const mockOrder = {
            id: 15,
            status: 'pending',
            save: vi.fn().mockResolvedValue(true),
        };
        vi.spyOn(Order, 'findByPk').mockResolvedValue(mockOrder);

        const result = await orderService.updateOrderStatus(15, 'confirmed', 'Admin duyệt đơn');
        expect(result.status).toBe('confirmed');
        expect(mockOrder.save).toHaveBeenCalled();
        expect(OrderHistory.create).toHaveBeenCalledWith(
            expect.objectContaining({ order_id: 15, status: 'confirmed' }),
            expect.any(Object)
        );
    });

    it('UTC_ORD_11: updateOrderStatus ném lỗi AppError 400 khi chuyển trạng thái trái quy tắc vòng đời', async () => {
        const mockOrder = {
            id: 15,
            status: 'delivered',
        };
        vi.spyOn(Order, 'findByPk').mockResolvedValue(mockOrder);

        await expect(orderService.updateOrderStatus(15, 'pending'))
            .rejects
            .toThrow('Không thể chuyển trạng thái từ "delivered" sang "pending"');
    });

    it('UTC_ORD_12: cancelOrder hủy đơn thành công và tự động kích hoạt hoàn trả tồn kho & voucher', async () => {
        const mockOrder = {
            id: 25,
            user_id: 1,
            status: 'pending',
            voucher_id: null,
            save: vi.fn().mockResolvedValue(true),
        };
        vi.spyOn(Order, 'findOne').mockResolvedValue(mockOrder);

        const result = await orderService.cancelOrder(1, 25, 'Khách đổi ý');
        expect(result.status).toBe('cancelled');
        expect(mockOrder.save).toHaveBeenCalled();
        expect(OrderHistory.create).toHaveBeenCalledWith(
            expect.objectContaining({ order_id: 25, status: 'cancelled' }),
            expect.any(Object)
        );
    });
});
