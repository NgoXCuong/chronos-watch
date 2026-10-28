import { Op } from "sequelize";
import Warranty from "../models/warranty.model.js";
import WarrantyRequest from "../models/warranty_request.model.js";
import Order from "../models/order.model.js";
import OrderDetail from "../models/order_detail.model.js";
import OrderHistory from "../models/order_history.model.js";
import Product from "../models/product.model.js";
import AppError from "../utils/AppError.js";
import notificationService from "./notification.service.js";
import { truncateText } from "../constants/notifications.js";
import {
    WARRANTY_STATUSES,
    buildWarrantyCode,
    getWarrantyState,
    warrantyEndDate,
    warrantyProgress,
} from "../utils/warranty.js";

const DEFAULT_MONTHS = 12;

// Cột thật của bảng warranties. 'state'/'days_left' không sort được vì suy từ end_date
// ở tầng ứng dụng (xem utils/warranty.js) — muốn sort theo phải tính bằng SQL.
export const SORTABLE_WARRANTY_COLUMNS = [
    'code',
    'product_name',
    'sku',
    'serial',
    'start_date',
    'end_date',
    'created_at',
];

export const buildWarrantySort = (sort, dir) => {
    const key = SORTABLE_WARRANTY_COLUMNS.includes(sort) ? sort : 'created_at';
    const direction = String(dir).toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    return [[key, direction], ['id', 'ASC']];
};

export const parseWarrantyPage = ({ page, limit }) => {
    const p = Math.max(1, parseInt(page, 10) || 1);
    const size = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    return { page: p, limit: size, offset: (p - 1) * size };
};

// Lọc theo trạng thái SUY RA: 'expired'/'running' không phải giá trị ENUM trong DB.
export const applyWarrantyStateFilter = (where, state, now) => {
    if (!state || state === 'all') return where;
    if (WARRANTY_STATUSES.includes(state)) {
        where.status = state;
        return where;
    }
    if (state === 'expired') {
        where.status = 'active';
        where.end_date = { [Op.lt]: now };
    } else if (state === 'running') {
        where.status = 'active';
        where.end_date = { [Op.gte]: now };
    }
    return where;
};

export const applyWarrantySearch = (where, rawSearch, extraFields = []) => {
    const search = String(rawSearch ?? '').trim();
    if (!search) return where;
    const like = { [Op.like]: `%${search}%` };
    where[Op.or] = [
        { code: like },
        { serial: like },
        { product_name: like },
        { sku: like },
        ...extraFields.map((field) => ({ [field]: like })),
    ];
    return where;
};

// Gắn state + tiến trình vào từng phiếu để UI khách/admin chỉ việc hiển thị.
export const decorateWarranties = (rows, now = new Date()) =>
    rows.map((row) => {
        const plain = row.toJSON ? row.toJSON() : row;
        return {
            ...plain,
            state: getWarrantyState(plain, now),
            progress: warrantyProgress(plain, now),
        };
    });

// Mốc bắt đầu = lần đầu đơn được chuyển sang 'delivered'; chưa có lịch sử thì dùng
// updated_at của đơn (không dùng created_at — khách chưa nhận hàng).
const resolveStartDate = async (order, transaction) => {
    const first = await OrderHistory.findOne({
        where: { order_id: order.id, status: 'delivered' },
        order: [['created_at', 'ASC']],
        attributes: ['created_at'],
        transaction,
    });
    return first?.created_at ? new Date(first.created_at) : new Date(order.updated_at ?? Date.now());
};

// Mã W01, W02... đếm trên TOÀN đơn (không đếm từng dòng). Bộ đếm trong RAM chặn trùng
// giữa các phiếu cùng lập một lượt, còn findOne chặn trùng với phiếu đã có trong DB —
// nhờ vậy gọi lại nhiều lần (idempotent) vẫn không sinh mã trùng.
const createWarrantyCodeFactory = (orderCode, transaction) => {
    const used = new Set();
    let seq = 0;
    return async () => {
        let code = buildWarrantyCode(orderCode, 1);
        while (used.has(code) || await Warranty.findOne({ where: { code }, attributes: ['id'], raw: true, transaction })) {
            seq += 1;
            code = buildWarrantyCode(orderCode, seq + 1);
        }
        used.add(code);
        return code;
    };
};

const warrantyService = {
    // Idempotent: gọi mỗi lần đơn chuyển sang 'delivered' (kể cả lập lại) — chỉ lập thêm
    // phiếu cho phần quantity chưa có phiếu. Một chiếc = một phiếu.
    generateForOrder: async (orderId, { transaction } = {}) => {
        const order = await Order.findByPk(orderId, {
            include: [{ model: OrderDetail, as: 'details' }],
            transaction,
        });
        if (!order) throw new AppError(404, "Đơn hàng không tồn tại");

        const startDate = await resolveStartDate(order, transaction);
        const voided = order.status === 'cancelled' || order.status === 'returned';
        const makeCode = createWarrantyCodeFactory(order.order_code, transaction);
        const created = [];

        for (const detail of order.details || []) {
            const qty = Number(detail.quantity) || 1;
            const existing = await Warranty.count({ where: { order_detail_id: detail.id }, transaction });
            // 173 dòng order_details cũ (dữ liệu seed) có snapshot NULL -> lấy lại từ products,
            // không để phiếu blank tên/SKU vì khách và admin đều đọc hai cột này.
            const product = await Product.findByPk(detail.product_id, {
                attributes: ['name', 'sku', 'warranty_months'],
                transaction,
            });
            const months = Number(detail.warranty_months) || Number(product?.warranty_months) || DEFAULT_MONTHS;

            for (let i = existing; i < qty; i += 1) {
                created.push(await Warranty.create({
                    code: await makeCode(),
                    order_id: order.id,
                    order_detail_id: detail.id,
                    user_id: order.user_id,
                    product_id: detail.product_id,
                    product_name: detail.product_name || product?.name || null,
                    sku: detail.sku || product?.sku || null,
                    warranty_months: months,
                    start_date: startDate,
                    end_date: warrantyEndDate(startDate, months),
                    status: voided ? 'void' : 'active',
                }, { transaction }));
            }
        }
        return created;
    },

    // Đơn hủy/hoàn → phiếu không còn hiệu lực, nhưng giữ lại để tra lịch sử.
    voidForOrder: async (orderId, reason, { transaction } = {}) => {
        const [updated] = await Warranty.update(
            { status: 'void', note: reason ?? null },
            { where: { order_id: orderId, status: { [Op.ne]: 'void' } }, transaction }
        );
        return updated;
    },

    getMyWarranties: async (userId, query = {}) => {
        const now = new Date();
        const where = applyWarrantySearch(
            applyWarrantyStateFilter({ user_id: userId }, query.state, now),
            query.search
        );
        // Liên kết sâu từ trang chi tiết đơn (/warranties?order=<id>): chỉ phiếu của đơn đó.
        // user_id vẫn nằm trong where nên không lộ phiếu của người khác.
        const orderId = Number(query.order ?? query.order_id);
        if (Number.isInteger(orderId) && orderId > 0) where.order_id = orderId;
        const { page, limit, offset } = parseWarrantyPage(query);

        const { count, rows } = await Warranty.findAndCountAll({
            where,
            include: [{ model: Order, as: 'order', attributes: ['id', 'order_code', 'status'] }],
            order: buildWarrantySort(query.sort, query.dir),
            limit,
            offset,
            distinct: true,
        });

        return { count, rows: decorateWarranties(rows, now), page, limit };
    },

    getMyWarranty: async (warrantyId, userId) => {
        const warranty = await Warranty.findOne({
            where: { id: warrantyId, user_id: userId },
            include: [
                { model: Order, as: 'order', attributes: ['id', 'order_code', 'status', 'created_at'] },
                {
                    model: WarrantyRequest,
                    as: 'requests',
                    attributes: ['id', 'issue', 'status', 'admin_reply', 'replied_at', 'created_at'],
                    separate: true,
                    order: [['created_at', 'DESC']],
                },
            ],
        });
        // Không tồn tại hoặc của người khác → 404 (không lộ sự tồn tại của phiếu)
        if (!warranty) throw new AppError(404, "Không tìm thấy phiếu bảo hành");
        return decorateWarranties([warranty])[0];
    },

    createRequest: async ({ warrantyId, userId, issue }) => {
        const text = String(issue ?? '').trim();
        if (!text) throw new AppError(400, "Hãy mô tả tình trạng sản phẩm.");
        if (text.length > 2000) throw new AppError(400, "Mô tả tối đa 2000 ký tự.");

        const warranty = await Warranty.findOne({ where: { id: warrantyId, user_id: userId } });
        if (!warranty) throw new AppError(404, "Không tìm thấy phiếu bảo hành");
        if (warranty.status === 'void') throw new AppError(400, "Phiếu này đã hủy theo đơn hàng, không gửi được yêu cầu.");
        if (getWarrantyState(warranty) === 'expired') throw new AppError(400, "Phiếu đã hết hạn bảo hành.");

        const open = await WarrantyRequest.count({
            where: { warranty_id: warranty.id, status: { [Op.in]: ['pending', 'processing'] } },
        });
        if (open > 0) throw new AppError(400, "Phiếu đang có yêu cầu chưa xử lý xong.");

        const created = await WarrantyRequest.create({
            warranty_id: warranty.id,
            user_id: userId,
            issue: text,
        });

        await notificationService.notifyAdmins({
            type: 'warranty',
            title: 'Yêu cầu bảo hành mới',
            message: `Phiếu ${warranty.code} — ${truncateText(text, 120)}`,
            link: '/admin/warranties'
        });

        return created;
    },
};

export default warrantyService;
