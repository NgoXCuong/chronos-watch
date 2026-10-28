import { Op, Sequelize } from 'sequelize';
import sequelize from '../config/db.js';
import FlashSale from '../models/flash_sale.model.js';
import FlashSaleItem from '../models/flash_sale_item.model.js';
import Product from '../models/product.model.js';
import AppError from '../utils/AppError.js';
import { parseBulkIds, runBulk } from '../utils/bulkOps.js';
import { FLASH_SALE_STATUSES, getFlashSaleState } from '../utils/flashSale.js';
import {
    assertNoOverlap,
    normalizeFlashSaleInput,
    syncFlashSaleItems,
} from './flash-sale-item.service.js';

// sortKey cột bảng admin — frontend (constants/flashSale.js) phải khớp danh sách này
const SORTABLE_FLASH_COLUMNS = ['name', 'start_date', 'end_date', 'created_at', 'item_count', 'sold_units'];

const buildFlashSort = (sort, dir) => {
    const key = SORTABLE_FLASH_COLUMNS.includes(sort) ? sort : 'created_at';
    const direction = String(dir).toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    return [[key, direction], ['id', 'DESC']];
};

// Bộ lọc cửa sổ — now tính trong hàm để không đóng băng lúc server khởi động.
const STATE_FILTERS = {
    running: (now) => ({ status: 'active', start_date: { [Op.lte]: now }, end_date: { [Op.gt]: now } }),
    upcoming: (now) => ({ status: 'active', start_date: { [Op.gt]: now } }),
    expired: (now) => ({ status: 'active', end_date: { [Op.lte]: now } }),
    inactive: () => ({ status: 'inactive' }),
};

const toInt = (value, fallback = 0) => {
    const n = Math.trunc(Number(value));
    return Number.isFinite(n) ? Math.max(0, n) : fallback;
};

const flashSaleAdminService = {
    getAll: async (query = {}) => {
        const now = new Date();
        const where = {};
        const search = String(query.search ?? '').trim();
        if (search) where.name = { [Op.like]: `%${search}%` };

        const stateFilter = STATE_FILTERS[String(query.state ?? '').trim()];
        if (stateFilter) Object.assign(where, stateFilter(now));
        // Cả hai bộ lọc đều áp dụng (AND): admin có thể lọc "đang tắt nhưng vẫn trong
        // khung giờ chạy" — bỏ qua status khi đã có state là âm thầm đổi kết quả.
        if (FLASH_SALE_STATUSES.includes(query.status)) where.status = query.status;

        const page = Math.max(1, parseInt(query.page, 10) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));

        const { count, rows } = await FlashSale.findAndCountAll({
            where,
            attributes: {
                include: [
                    [Sequelize.literal('(SELECT COUNT(*) FROM flash_sale_items i WHERE i.flash_sale_id = FlashSale.id)'), 'item_count'],
                    [Sequelize.literal('(SELECT COALESCE(SUM(i.sold_count), 0) FROM flash_sale_items i WHERE i.flash_sale_id = FlashSale.id)'), 'sold_units'],
                    [Sequelize.literal('(SELECT COALESCE(SUM(i.quota), 0) FROM flash_sale_items i WHERE i.flash_sale_id = FlashSale.id)'), 'quota_units'],
                ],
            },
            order: buildFlashSort(query.sort, query.dir),
            limit,
            offset: (page - 1) * limit,
            distinct: true,
        });

        return {
            count,
            rows: rows.map((row) => {
                const plain = row.toJSON();
                const itemCount = toInt(plain.item_count);
                const soldUnits = toInt(plain.sold_units);
                const quotaUnits = toInt(plain.quota_units);
                const base = getFlashSaleState(plain, now);
                // cháy hàng = tổng suất đã bán chạm TỔNG QUOTA (so với số DÒNG thì
                // sai: 1 dòng quota 50 bán 2 suất sẽ bị báo "đã cháy")
                const state = base === 'running' && quotaUnits > 0 && soldUnits >= quotaUnits ? 'sold_out' : base;
                return {
                    ...plain,
                    item_count: itemCount,
                    sold_units: soldUnits,
                    quota_units: quotaUnits,
                    remaining_units: Math.max(0, quotaUnits - soldUnits),
                    state,
                };
            }),
            page,
            limit,
        };
    },

    // Đọc trong cùng transaction lúc create/update: nếu tách kết nối khác thì chưa
    // commit là không thấy dòng vừa ghi (getDetail trả 404 ngay trong create).
    getDetail: async (id, { transaction } = {}) => {
        const sale = await FlashSale.findByPk(id, {
            transaction,
            include: [{
                model: FlashSaleItem,
                as: 'items',
                include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'slug', 'image_url', 'price', 'old_price', 'stock', 'status'] }],
                order: [['id', 'ASC']],
            }],
        });
        if (!sale) throw new AppError(404, 'Không tìm thấy đợt Flash Sale');
        const now = new Date();
        const plain = sale.toJSON();
        return {
            ...plain,
            state: getFlashSaleState(plain, now),
            items: (plain.items || []).map((item) => {
                const product = item.product || {};
                return {
                    ...item,
                    flash_price: Number(item.flash_price),
                    quota: toInt(item.quota),
                    sold_count: toInt(item.sold_count),
                    per_user_limit: toInt(item.per_user_limit),
                    remaining: Math.max(0, toInt(item.quota) - toInt(item.sold_count)),
                    list_price: Number(product.price),
                    discount_percent: Number(product.price) > item.flash_price
                        ? Math.round(((Number(product.price) - item.flash_price) / Number(product.price)) * 100)
                        : 0,
                };
            }),
        };
    },

    create: async (data = {}) => {
        const input = normalizeFlashSaleInput(data);
        await assertNoOverlap(input.start_date, input.end_date, input.status ?? 'active', null);
        return sequelize.transaction(async (transaction) => {
            const sale = await FlashSale.create(input, { transaction });
            await syncFlashSaleItems(sale.id, data.items, transaction);
            return flashSaleAdminService.getDetail(sale.id, { transaction });
        });
    },

    update: async (id, data = {}) => {
        const sale = await FlashSale.findByPk(id);
        if (!sale) throw new AppError(404, 'Không tìm thấy đợt Flash Sale');
        const input = normalizeFlashSaleInput(data, { partial: true });
        const next = { ...sale.toJSON(), ...input };
        await assertNoOverlap(next.start_date, next.end_date, next.status, sale.id);

        return sequelize.transaction(async (transaction) => {
            await sale.update(input, { transaction });
            await syncFlashSaleItems(sale.id, data.items, transaction);
            return flashSaleAdminService.getDetail(sale.id, { transaction });
        });
    },

    setStatus: async (id, status) => {
        if (!FLASH_SALE_STATUSES.includes(status)) throw new AppError(400, 'Trạng thái đợt không hợp lệ.');
        const sale = await FlashSale.findByPk(id);
        if (!sale) throw new AppError(404, 'Không tìm thấy đợt Flash Sale');
        if (status === 'active') {
            await assertNoOverlap(sale.start_date, sale.end_date, 'active', sale.id);
        }
        sale.status = status;
        await sale.save();
        return sale;
    },

    // Bật/tắt hàng loạt là SET (một UPDATE), không toggle từng dòng.
    bulkSetStatus: async (ids, status) => {
        if (!FLASH_SALE_STATUSES.includes(status)) throw new AppError(400, 'Trạng thái đợt không hợp lệ.');
        const list = parseBulkIds(ids);
        const [updated] = await FlashSale.update({ status }, { where: { id: { [Op.in]: list } } });
        return { updated, status, requested: list.length };
    },

    delete: async (id) => {
        const sale = await FlashSale.findByPk(id);
        if (!sale) throw new AppError(404, 'Không tìm thấy đợt Flash Sale');
        await sale.destroy();
        return true;
    },

    bulkDelete: async (ids) => runBulk(parseBulkIds(ids), (id) => flashSaleAdminService.delete(id)),

    getStats: async () => {
        const now = new Date();
        // Aggregate + JOIN qua Sequelize sinh GROUP BY thiếu cột → chết vì
        // only_full_group_by. Raw SQL với :now là cách gọn và đúng ở đây.
        const RUNNING = `s.status = 'active' AND s.start_date <= :now AND s.end_date > :now`;
        const [total, activeCount, running, upcoming, expired, itemAgg, revenueRow] = await Promise.all([
            FlashSale.count(),
            FlashSale.count({ where: { status: 'active' } }),
            FlashSale.count({ where: STATE_FILTERS.running(now) }),
            FlashSale.count({ where: STATE_FILTERS.upcoming(now) }),
            FlashSale.count({ where: STATE_FILTERS.expired(now) }),
            sequelize.query(
                `SELECT COUNT(DISTINCT i.product_id)     AS product_count,
                        COALESCE(SUM(i.quota), 0)       AS quota_total,
                        COALESCE(SUM(i.sold_count), 0)  AS sold_total
                   FROM flash_sale_items i
                   JOIN flash_sales s ON s.id = i.flash_sale_id
                  WHERE ${RUNNING}`,
                { replacements: { now }, type: Sequelize.QueryTypes.SELECT },
            ),
            sequelize.query(
                `SELECT COALESCE(SUM(od.price * od.quantity), 0) AS revenue
                   FROM order_details od
                   JOIN flash_sale_items i ON i.id = od.flash_sale_item_id
                   JOIN flash_sales s ON s.id = i.flash_sale_id
                  WHERE ${RUNNING}`,
                { replacements: { now }, type: Sequelize.QueryTypes.SELECT },
            ),
        ]);

        const agg = itemAgg[0] ?? {};
        return {
            total,
            active_count: activeCount,
            running_count: running,
            upcoming_count: upcoming,
            expired_count: expired,
            product_count: toInt(agg.product_count),
            sold_units: toInt(agg.sold_total),
            quota_units: toInt(agg.quota_total),
            remaining_units: Math.max(0, toInt(agg.quota_total) - toInt(agg.sold_total)),
            // SUM(DECIMAL) từ MySQL trả về CHUỖI — ép Number trước mọi phép tính
            running_revenue: Number(revenueRow?.[0]?.revenue ?? 0),
        };
    },
};

export default flashSaleAdminService;
