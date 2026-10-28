import { Op } from 'sequelize';
import Notification from '../models/notification.model.js';
import User from '../models/user.model.js';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const DEDUPE_WINDOW_HOURS = 24;

// Cùng danh sách với ENUM của bảng notifications — lọc theo giá trị lạ thì bỏ qua
// thay vì ném SQL error (query đến từ URL người dùng sửa được).
const NOTIFICATION_TYPES = ['order', 'payment', 'stock', 'review', 'warranty', 'system'];

// Thông báo là tác vụ phụ: lỗi ghi thông báo KHÔNG được làm hỏng nghiệp vụ chính
// (đặt đơn, thanh toán, gửi bảo hành...), nên mọi lệnh ghi đều nuốt lỗi + log.
const fireAndForget = async (work) => {
    try {
        return await work();
    } catch (error) {
        console.error('[notification]', error.message);
        return null;
    }
};

const adminIds = async () => {
    const rows = await User.findAll({
        where: { role: 'admin', status: 'active' },
        attributes: ['id'],
        raw: true,
    });
    return rows.map((row) => row.id);
};

// Cột DB giới hạn 200/500/255 ký tự: cắt trước khi ghi để một tên sản phẩm dài
// không âm thầm làm mất cả thông báo (INSERT lỗi bị fireAndForget nuốt mất).
const clamp = (value, max) => String(value ?? '').slice(0, max);
const sanitize = (payload) => ({
    ...payload,
    title: clamp(payload.title, 200),
    message: clamp(payload.message, 500),
    link: payload.link ? clamp(payload.link, 255) : null,
});

const normalizePaging = (query) => {
    const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(query.limit, 10) || DEFAULT_LIMIT));
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    return { limit, page, offset: (page - 1) * limit };
};

// Bộ lọc dùng chung cho trang "tất cả thông báo": trạng thái đọc, loại, từ khóa.
// unread=1 (chuông) và read=1 (trang admin lọc "đã đọc") loại trừ nhau.
const buildWhere = (userId, query) => {
    const where = { user_id: userId };

    if (query.unread === '1' || query.unread === 'true') {
        where.read_at = { [Op.is]: null };
    } else if (query.read === '1' || query.read === 'true') {
        where.read_at = { [Op.not]: null };
    }

    const type = String(query.type ?? '').trim().toLowerCase();
    if (NOTIFICATION_TYPES.includes(type)) where.type = type;

    const search = String(query.search ?? '').trim().slice(0, 100);
    if (search) {
        where[Op.or] = [
            { title: { [Op.like]: `%${search}%` } },
            { message: { [Op.like]: `%${search}%` } },
        ];
    }

    return where;
};

const notificationService = {
    notifyUser: (userId, payload) => fireAndForget(async () => {
        if (!userId) return null;
        return Notification.create({ ...sanitize(payload), user_id: userId });
    }),

    notifyAdmins: (payload) => fireAndForget(async () => {
        const ids = await adminIds();
        if (!ids.length) return [];
        return Notification.bulkCreate(ids.map((user_id) => ({ ...sanitize(payload), user_id })));
    }),

    // Cảnh báo tồn kho bắn theo sự kiện, không phải theo mỗi lần poll:
    // cùng dedupe_key trong 24h thì bỏ qua, tránh chuông admin lặp 10 thông báo giống nhau.
    notifyAdminsOnce: (dedupeKey, payload, hours = DEDUPE_WINDOW_HOURS) => fireAndForget(async () => {
        const since = new Date(Date.now() - hours * 60 * 60 * 1000);
        const existing = await Notification.findOne({
            where: { dedupe_key: dedupeKey, created_at: { [Op.gte]: since } },
            attributes: ['id'],
            raw: true,
        });
        if (existing) return null;

        const ids = await adminIds();
        if (!ids.length) return [];
        return Notification.bulkCreate(
            ids.map((user_id) => ({ ...sanitize(payload), dedupe_key: dedupeKey, user_id }))
        );
    }),

    listForUser: async (userId, query = {}) => {
        const { limit, page, offset } = normalizePaging(query);
        const where = buildWhere(userId, query);

        const [result, unreadCount] = await Promise.all([
            Notification.findAndCountAll({
                where,
                order: [['created_at', 'DESC'], ['id', 'DESC']],
                limit,
                offset,
            }),
            Notification.count({ where: { user_id: userId, read_at: { [Op.is]: null } } }),
        ]);

        return {
            items: result.rows,
            total: result.count,
            page,
            limit,
            unreadCount,
        };
    },

    markRead: async (userId, notificationId) => {
        const [updated] = await Notification.update(
            { read_at: new Date() },
            { where: { id: notificationId, user_id: userId, read_at: { [Op.is]: null } } }
        );
        return { updated };
    },

    markAllRead: async (userId) => {
        const [updated] = await Notification.update(
            { read_at: new Date() },
            { where: { user_id: userId, read_at: { [Op.is]: null } } }
        );
        return { updated };
    },
};

export default notificationService;
