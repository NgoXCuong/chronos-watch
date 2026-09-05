import { describe, it, expect, vi, beforeEach } from 'vitest';
import orderService from '../services/order.service.js';
import Order from '../models/order.model.js';
import AppError from '../utils/AppError.js';

describe('orderService - IDOR protection in getOrderDetail', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('cho phép chủ sở hữu xem đơn hàng của mình', async () => {
        const mockOrder = {
            id: 10,
            user_id: 100,
            status: 'pending',
        };
        vi.spyOn(Order, 'findByPk').mockResolvedValue(mockOrder);

        const result = await orderService.getOrderDetail(10, 100, 'customer');
        expect(result).toBe(mockOrder);
    });

    it('cho phép admin xem bất kỳ đơn hàng nào', async () => {
        const mockOrder = {
            id: 10,
            user_id: 100,
            status: 'pending',
        };
        vi.spyOn(Order, 'findByPk').mockResolvedValue(mockOrder);

        const result = await orderService.getOrderDetail(10, 999, 'admin');
        expect(result).toBe(mockOrder);
    });

    it('chặn và ném lỗi 403 khi người dùng khác cố truy cập đơn hàng (IDOR)', async () => {
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

    it('ném lỗi 404 khi đơn hàng không tồn tại', async () => {
        vi.spyOn(Order, 'findByPk').mockResolvedValue(null);

        await expect(orderService.getOrderDetail(999, 100, 'customer'))
            .rejects
            .toThrow('Đơn hàng không tồn tại');
    });
});

describe('orderService - retryVNPayPayment & switchPaymentMethodToCOD', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('retryVNPayPayment tạo liên kết thanh toán mới cho chủ đơn hàng', async () => {
        const mockOrder = {
            id: 10,
            user_id: 100,
            status: 'pending',
            payment_status: 'unpaid',
            payment_method: 'vnpay',
            total_amount: 500000,
            save: vi.fn().mockResolvedValue(true),
        };
        vi.spyOn(Order, 'findByPk').mockResolvedValue(mockOrder);

        const result = await orderService.retryVNPayPayment(10, 100, '127.0.0.1');
        expect(result.order).toBe(mockOrder);
        expect(result.paymentUrl).toContain('vnp_Amount=50000000');
    });

    it('retryVNPayPayment từ chối khi khác user_id', async () => {
        const mockOrder = {
            id: 10,
            user_id: 100,
            status: 'pending',
            payment_status: 'unpaid',
        };
        vi.spyOn(Order, 'findByPk').mockResolvedValue(mockOrder);

        await expect(orderService.retryVNPayPayment(10, 200, '127.0.0.1'))
            .rejects
            .toThrow('Bạn không có quyền thực hiện thanh toán cho đơn hàng này');
    });

    it('retryVNPayPayment từ chối khi đơn hàng đã thanh toán', async () => {
        const mockOrder = {
            id: 10,
            user_id: 100,
            status: 'pending',
            payment_status: 'paid',
        };
        vi.spyOn(Order, 'findByPk').mockResolvedValue(mockOrder);

        await expect(orderService.retryVNPayPayment(10, 100, '127.0.0.1'))
            .rejects
            .toThrow('Đơn hàng này đã được thanh toán');
    });

    it('switchPaymentMethodToCOD chuyển phương thức sang COD thành công', async () => {
        const mockOrder = {
            id: 10,
            user_id: 100,
            status: 'pending',
            payment_status: 'unpaid',
            payment_method: 'vnpay',
            save: vi.fn().mockResolvedValue(true),
        };
        vi.spyOn(Order, 'findByPk').mockResolvedValue(mockOrder);

        const result = await orderService.switchPaymentMethodToCOD(10, 100);
        expect(result.success).toBe(true);
        expect(mockOrder.payment_method).toBe('cod');
        expect(mockOrder.save).toHaveBeenCalled();
    });

    it('switchPaymentMethodToCOD từ chối khi đơn hàng không ở trạng thái pending', async () => {
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
