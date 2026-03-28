import Voucher from '../models/voucher.model.js';
import { Op } from 'sequelize';

const voucherService = {
    // Admin CRUD
    getAll: async () => {
        return await Voucher.findAll({ order: [['created_at', 'DESC']] });
    },

    getDetail: async (id) => {
        return await Voucher.findByPk(id);
    },

    create: async (data) => {
        // Kiểm tra mã trùng
        const existing = await Voucher.findOne({ where: { code: data.code } });
        if (existing) throw new Error("Mã voucher đã tồn tại.");
        
        return await Voucher.create(data);
    },

    update: async (id, data) => {
        const voucher = await Voucher.findByPk(id);
        if (!voucher) throw new Error("Voucher không tồn tại.");
        return await voucher.update(data);
    },

    delete: async (id) => {
        const voucher = await Voucher.findByPk(id);
        if (!voucher) throw new Error("Voucher không tồn tại.");
        await voucher.destroy();
        return true;
    },

    // Logic nghiệp vụ cho Checkout
    validateVoucher: async (code, orderValue) => {
        const voucher = await Voucher.findOne({ 
            where: { 
                code: code,
                status: 'active'
            } 
        });

        if (!voucher) {
            throw new Error("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
        }

        const now = new Date();
        if (now < new Date(voucher.start_date) || now > new Date(voucher.end_date)) {
            throw new Error("Mã giảm giá đã hết hạn hoặc chưa đến ngày sử dụng.");
        }

        if (voucher.used_count >= voucher.usage_limit) {
            throw new Error("Mã giảm giá đã hết lượt sử dụng.");
        }

        if (orderValue < voucher.min_order_value) {
            throw new Error(`Đơn hàng tối thiểu ${voucher.min_order_value}đ để áp dụng mã này.`);
        }

        return voucher;
    },

    calculateDiscount: (voucher, orderValue) => {
        let discountAmount = 0;
        if (voucher.discount_type === 'percentage') {
            discountAmount = (orderValue * voucher.discount_value) / 100;
            if (voucher.max_discount > 0 && discountAmount > voucher.max_discount) {
                discountAmount = voucher.max_discount;
            }
        } else {
            discountAmount = parseFloat(voucher.discount_value);
        }

        // Đảm bảo số tiền giảm không vượt quá tổng giá trị đơn hàng
        return Math.min(discountAmount, orderValue);
    }
};

export default voucherService;
