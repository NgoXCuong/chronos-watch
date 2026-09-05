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
