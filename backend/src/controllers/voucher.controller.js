import voucherService from '../services/voucher.service.js';

const voucherController = {
    // Admin CRUD
    getAll: async (req, res) => {
        try {
            const vouchers = await voucherService.getAll(req.query);
            res.json(vouchers);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    getDetail: async (req, res) => {
        try {
            const voucher = await voucherService.getDetail(req.params.id);
            if (!voucher) throw new Error("Voucher không tồn tại.");
            res.json(voucher);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    create: async (req, res) => {
        try {
            const voucher = await voucherService.create(req.body);
            res.status(201).json({
                message: "Tạo voucher thành công!",
                voucher
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const voucher = await voucherService.update(req.params.id, req.body);
            res.json({
                message: "Cập nhật voucher thành công!",
                voucher
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            await voucherService.delete(req.params.id);
            res.json({ message: "Xóa voucher thành công!" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Public validation logic check
    validate: async (req, res) => {
        try {
            const { code, total } = req.query;
            if (!code || !total) throw new Error("Thiếu tham số code hoặc total.");
            
            const voucher = await voucherService.validateVoucher(code, parseFloat(total));
            const discountAmount = voucherService.calculateDiscount(voucher, parseFloat(total));
            
            res.json({
                valid: true,
                voucher,
                discount_amount: discountAmount
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

export default voucherController;
