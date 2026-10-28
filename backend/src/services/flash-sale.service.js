import { Op, Sequelize } from 'sequelize';
import FlashSale from '../models/flash_sale.model.js';
import FlashSaleItem from '../models/flash_sale_item.model.js';
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';
import OrderDetail from '../models/order_detail.model.js';
import AppError from '../utils/AppError.js';
import {
    flashDiscountPercent,
    getFlashSaleState,
    itemRemaining,
} from '../utils/flashSale.js';

// now TÍNH TRONG HÀM (tiền lệ bug banner.service.js): hằng số cấp module đóng băng
// mốc lúc server khởi động khiến "đang chạy" sai dần theo thời gian chạy.
const RUNNING_WHERE = (now) => ({
    status: 'active',
    start_date: { [Op.lte]: now },
    end_date: { [Op.gt]: now },
});

const SALE_FIELDS = ['id', 'name', 'description', 'start_date', 'end_date', 'status'];
const PRODUCT_FIELDS = ['id', 'name', 'slug', 'image_url', 'price', 'old_price', 'stock', 'avg_rating', 'review_count', 'sold_count'];

// Số nguyên mới được ghép vào sequelize.literal (nơi MySQL không nhận placeholder
// trong biểu thức cột) — chặn mọi ký tự SQL từ input.
const toInt = (value, fallback = 0) => {
    const n = Math.trunc(Number(value));
    return Number.isFinite(n) ? Math.max(0, n) : fallback;
};

const decorateItem = (raw) => {
    const product = raw.product || null;
    const listPrice = Number(product?.price);
    const flashPrice = Number(raw.flash_price);
    const quota = toInt(raw.quota);
    const sold = toInt(raw.sold_count);
    return {
        id: raw.id,
        flash_sale_id: raw.flash_sale_id,
        product_id: raw.product_id,
        flash_price: flashPrice,
        quota,
        sold_count: sold,
        remaining: Math.max(0, quota - sold),
        per_user_limit: toInt(raw.per_user_limit),
        sold_percent: quota > 0 ? Math.min(100, Math.round((sold / quota) * 100)) : 0,
        discount_percent: flashDiscountPercent(listPrice, flashPrice),
        saved: Number.isFinite(listPrice) ? Math.max(0, Math.round(listPrice - flashPrice)) : 0,
        sold_out: quota - sold <= 0,
        product,
    };
};

const itemInclude = (now) => ({
    model: FlashSaleItem,
    as: 'items',
    separate: true,
    required: false,
    where: { [Op.and]: [Sequelize.where(Sequelize.col('product.status'), '=', 'active')] },
    include: [{ model: Product, as: 'product', attributes: PRODUCT_FIELDS, required: true }],
    order: [['id', 'ASC']],
});

const flashSaleService = {
    // Trang chủ + card sản phẩm cần MỘT request: đợt đang chạy (kèm sản phẩm),
    // đợt kế tiếp (để đếm ngược "bắt đầu sau"), và server_time để đồng hồ không
    // lệch theo đồng hồ máy khách.
    getCurrent: async (query = {}) => {
        const now = new Date();
        const sale = await FlashSale.findOne({
            attributes: SALE_FIELDS,
            where: RUNNING_WHERE(now),
            include: [itemInclude(now)],
            order: [['start_date', 'ASC'], ['id', 'ASC']],
        });
        const upcoming = await FlashSale.findOne({
            attributes: SALE_FIELDS,
            where: { status: 'active', start_date: { [Op.gt]: now } },
            order: [['start_date', 'ASC']],
        });

        const items = (sale?.items || []).map(decorateItem);
        return {
            server_time: now.toISOString(),
            state: sale ? getFlashSaleState(sale, now, items) : null,
            sale: sale ? { ...sale.toJSON(), items } : null,
            upcoming: upcoming
                ? { ...upcoming.toJSON(), starts_in_ms: new Date(upcoming.start_date).getTime() - now.getTime() }
                : null,
            // show_hidden=1: trang "/flash-sale" tương lai cần cả suất đã cháy
            items: String(query.show_hidden) === '1' ? items : items.filter((item) => !item.sold_out),
        };
    },

    // Map product_id → ưu đãi đang có hiệu lực. Checkout dùng để chốt đơn giá,
    // giỏ hàng dùng để hiển thị "đã áp Flash Sale" — giá luôn tính ở server,
    // không tin con số client gửi lên.
    getEffectivePrices: async (productIds, { now = new Date() } = {}) => {
        const ids = [...new Set((Array.isArray(productIds) ? productIds : []).map(Number).filter((id) => Number.isInteger(id) && id > 0))];
        if (ids.length === 0) return new Map();

        const sale = await FlashSale.findOne({
            attributes: SALE_FIELDS,
            where: RUNNING_WHERE(now),
            include: [{
                model: FlashSaleItem,
                as: 'items',
                separate: true,
                where: { product_id: { [Op.in]: ids } },
                // Kèm giá niêm yết để UI (chi tiết SP, giỏ hàng) tự tính % giảm và
                // giá gạch ngang — backend vẫn là nơi chốt giá trị đơn.
                include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'slug', 'image_url', 'price', 'old_price', 'stock', 'status'], required: false }],
            }],
        });
        if (!sale) return new Map();

        return new Map((sale.items || []).map((raw) => {
            const item = decorateItem(raw.toJSON());
            return [Number(item.product_id), { ...item, sale_start_date: sale.start_date, sale_end_date: sale.end_date, sale_name: sale.name }];
        }));
    },

    // Lượt khách đã mua của TỪNG suất trong đợt, chỉ tính đơn chưa hủy/chưa hoàn.
    // Gom trong JS thay vì SUM/GROUP BY: bảng nhỏ (một khách × vài suất) và tránh
    // lỗi only_full_group_by khi Sequelize nối thêm cột của bảng JOIN.
    getUserPurchased: async (itemIds, userId, { transaction } = {}) => {
        if (!userId || itemIds.length === 0) return new Map();
        const rows = await OrderDetail.findAll({
            attributes: ['flash_sale_item_id', 'quantity'],
            include: [{
                model: Order,
                as: 'order',
                where: { user_id: userId, status: { [Op.notIn]: ['cancelled', 'returned'] } },
                required: true,
            }],
            where: { flash_sale_item_id: { [Op.in]: itemIds } },
            raw: true,
            transaction,
        });
        const totals = new Map();
        for (const row of rows) {
            const key = Number(row.flash_sale_item_id);
            totals.set(key, toInt(totals.get(key)) + toInt(row.quantity, 1));
        }
        return totals;
    },

    // Giữ suất trước khi ghi đơn: giới hạn mỗi khách → rồi UPDATE có điều kiện
    // (đọc-ghi trong cùng transaction, hai khách bấm cùng lúc không vượt quota).
    reserveQuota: async ({ item, quantity, userId, productName }, transaction) => {
        const qty = toInt(quantity, 1);
        if (qty <= 0) throw new AppError(400, 'Số lượng không hợp lệ.');
        const label = productName || 'sản phẩm';

        if (toInt(item.per_user_limit) > 0) {
            const bought = await flashSaleService.getUserPurchased([item.id], userId, { transaction });
            const used = bought.get(Number(item.id)) ?? 0;
            const limit = toInt(item.per_user_limit);
            if (used + qty > limit) {
                throw new AppError(400, `Flash Sale của ${label} giới hạn ${limit} chiếc/khách (bạn đã mua ${used}).`);
            }
        }

        const [affected] = await FlashSaleItem.update(
            { sold_count: Sequelize.literal(`sold_count + ${qty}`) },
            {
                where: {
                    id: item.id,
                    [Op.and]: [Sequelize.where(Sequelize.col('quota'), Op.gte, Sequelize.literal(`sold_count + ${qty}`))],
                },
                transaction,
            },
        );
        if (affected === 0) throw new AppError(400, `Suất Flash Sale của ${label} đã bán hết.`);
        return { item_id: item.id, quantity: qty };
    },

    // Hủy/hoàn đơn → trả lại suất để khách khác còn mua được (GREATEST chặn số âm
    // nếu đơn cũ bị xóa dòng thủ công).
    releaseQuota: async (details, transaction) => {
        for (const detail of details) {
            if (!detail.flash_sale_item_id) continue;
            await FlashSaleItem.update(
                { sold_count: Sequelize.literal(`GREATEST(0, sold_count - ${toInt(detail.quantity, 1)})`) },
                { where: { id: detail.flash_sale_item_id }, transaction },
            );
        }
    },

    // Cho UI chi tiết sản phẩm: ưu đãi của MỘT sản phẩm + hạn chót.
    getProductFlash: async (productId) => {
        const now = new Date();
        const map = await flashSaleService.getEffectivePrices([productId], { now });
        const entry = map.get(Number(productId));
        if (!entry) return null;
        return { ...entry, ends_in_ms: Math.max(0, new Date(entry.sale_end_date).getTime() - now.getTime()) };
    },
};

export default flashSaleService;
