import Voucher from '../models/voucher.model.js';
import VoucherUsage from '../models/voucher_usage.model.js';
import { Op } from 'sequelize';
import AppError from "../utils/AppError.js";
import { parseBulkIds, runBulk } from "../utils/bulkOps.js";

// Cột được phép sort từ bảng admin (whitelist chống SQL injection qua ORDER BY)
const SORTABLE_VOUCHER_COLUMNS = [
    'code',
    'discount_type',
    'discount_value',
    'min_order_value',
    'used_count',
    'start_date',
    'end_date',
    'created_at'
];

const buildVoucherSort = (sort, dir) => {
    const key = SORTABLE_VOUCHER_COLUMNS.includes(sort) ? sort : 'created_at';
    const direction = String(dir).toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    return [[key, direction], ['id', 'ASC']];
};

// Bộ lọc theo cửa sổ thời gian có hiệu lực (now tính mỗi lần gọi, không đóng băng lúc load module)
const WINDOW_FILTERS = {
    running: (now) => [
        { start_date: { [Op.lte]: now } },
        { end_date: { [Op.gte]: now } }
    ],
    upcoming: (now) => [{ start_date: { [Op.gt]: now } }],
    expired: (now) => [{ end_date: { [Op.lt]: now } }]
};

const normalizeVoucherInput = (data = {}, { partial = false } = {}) => {
    const out = { ...data };

    if (out.code !== undefined) out.code = String(out.code ?? '').trim().toUpperCase();
    if (!partial && !out.code) throw new AppError(400, "Mã voucher không được để trống.");
    // Mã hiện ra ở ô nhập voucher lúc checkout nên chỉ nhận ký tự an toàn
    if (out.code && !/^[A-Z0-9_-]{1,50}$/.test(out.code)) {
        throw new AppError(400, "Mã voucher chỉ dùng chữ hoa, số, - và _ (tối đa 50 ký tự).");
    }

    // PUT một phần: không gửi discount_type thì giữ nguyên loại đang có, không ép về percentage
    if (out.discount_type === undefined) {
        if (!partial) out.discount_type = "percentage";
    } else if (!["percentage", "fixed"].includes(out.discount_type)) {
        throw new AppError(400, "Loại giảm giá không hợp lệ.");
    }

    const hasValue = out.discount_value !== undefined && out.discount_value !== null && out.discount_value !== '';
    if (!hasValue) {
        if (!partial) throw new AppError(400, "Giá trị giảm không được để trống.");
    } else {
        const value = Number(out.discount_value);
        if (!Number.isFinite(value) || value <= 0) {
            throw new AppError(400, "Giá trị giảm phải là số lớn hơn 0.");
        }
        if (out.discount_type === 'percentage' && value > 100) {
            throw new AppError(400, "Giảm phần trăm không thể vượt quá 100%.");
        }
        out.discount_value = Math.round(value);
    }

    // Cột start_date/end_date NOT NULL trong models/voucher.model.js
    if (!partial && (!out.start_date || !out.end_date)) {
        throw new AppError(400, "Voucher bắt buộc có ngày bắt đầu và ngày kết thúc.");
    }
    if (out.start_date && out.end_date && new Date(out.start_date) > new Date(out.end_date)) {
        throw new AppError(400, "Ngày bắt đầu phải trước ngày kết thúc.");
    }

    return out;
};

const voucherService = {
    // Admin CRUD
    getAll: async (query = {}) => {
        const { search, discount_type, status, window } = query;
        const where = {};
        if (search) {
            where.code = { [Op.like]: `%${search}%` };
        }
        if (discount_type === 'percentage' || discount_type === 'fixed') {
            where.discount_type = discount_type;
        }
        if (status === 'active' || status === 'inactive') {
            where.status = status;
        }

        const now = new Date();
        const windowFilters = WINDOW_FILTERS[window]?.(now) ?? [];
        if (windowFilters.length) where[Op.and] = windowFilters;

        const page = Math.max(1, parseInt(query.page, 10) || 1);
        const limit = Math.max(1, parseInt(query.limit, 10) || 10);
        const offset = Math.max(0, (page - 1) * limit);

        return await Voucher.findAndCountAll({
            where,
            order: buildVoucherSort(query.sort, query.dir),
            limit,
            offset
        });
    },

    getDetail: async (id) => {
        return await Voucher.findByPk(id);
    },

    toggleStatus: async (id, status) => {
        if (status !== 'active' && status !== 'inactive') {
            throw new AppError(400, "Trạng thái voucher không hợp lệ.");
        }
        const voucher = await Voucher.findByPk(id);
        if (!voucher) throw new AppError(404, "Voucher không tồn tại.");
        voucher.status = status;
        await voucher.save();
        return voucher;
    },

    create: async (data) => {
        const input = normalizeVoucherInput(data);
        // Kiểm tra mã trùng
        const existing = await Voucher.findOne({ where: { code: input.code } });
        if (existing) throw new AppError(400, "Mã voucher đã tồn tại.");

        return await Voucher.create(input);
    },

    update: async (id, data) => {
        const voucher = await Voucher.findByPk(id);
        if (!voucher) throw new AppError(404, "Voucher không tồn tại.");
        const input = normalizeVoucherInput(data, { partial: true });
        if (input.code && input.code !== voucher.code) {
            const dup = await Voucher.findOne({ where: { code: input.code } });
            if (dup) throw new AppError(400, "Mã voucher đã tồn tại.");
        }
        return await voucher.update(input);
    },

    // Bật/tắt hàng loạt: ĐẶT status (không đảo) theo đúng ENUM active|inactive
    bulkSetStatus: async (ids, status) => {
        const list = parseBulkIds(ids);
        if (status !== 'active' && status !== 'inactive') {
            throw new AppError(400, "Trạng thái voucher không hợp lệ.");
        }
        const [updated] = await Voucher.update(
            { status },
            { where: { id: { [Op.in]: list } } }
        );
        return { updated, status, requested: list.length };
    },

    delete: async (id) => {
        const voucher = await Voucher.findByPk(id);
        if (!voucher) throw new AppError(404, "Voucher không tồn tại.");
        await voucher.destroy();
        return true;
    },

    // Xóa nhiều: voucher đã dùng bị ràng buộc voucher_usages → giữ lỗi từng dòng
    bulkDelete: async (ids) => runBulk(parseBulkIds(ids), (id) => voucherService.delete(id)),

    // Logic nghiệp vụ cho Checkout
    validateVoucher: async (code, orderValue, userId = null) => {
        const voucher = await Voucher.findOne({ 
            where: { 
                code: code,
                status: 'active'
            } 
        });

        if (!voucher) {
            throw new AppError(400, "Mã giảm giá không hợp lệ hoặc đã hết hạn.");
        }

        const now = new Date();
        if (now < new Date(voucher.start_date) || now > new Date(voucher.end_date)) {
            throw new AppError(400, "Mã giảm giá đã hết hạn hoặc chưa đến ngày sử dụng.");
        }

        if (voucher.usage_limit !== null && voucher.used_count >= voucher.usage_limit) {
            throw new AppError(400, "Mã giảm giá đã hết lượt sử dụng.");
        }

        if (orderValue < voucher.min_order_value) {
            throw new AppError(400, `Đơn hàng tối thiểu ${voucher.min_order_value}đ để áp dụng mã này.`);
        }

        // Kiểm tra giới hạn lượt dùng CỦA RIÊNG người dùng này (per_user_limit)
        if (userId && voucher.per_user_limit != null && voucher.per_user_limit > 0) {
            const usageCount = await VoucherUsage.count({
                where: {
                    voucher_id: voucher.id,
                    user_id: userId
                }
            });
            if (usageCount >= voucher.per_user_limit) {
                throw new AppError(400, "Bạn đã đạt giới hạn số lần sử dụng mã giảm giá này.");
            }
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
