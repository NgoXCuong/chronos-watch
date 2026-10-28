import { Op, fn, col } from "sequelize";
import bcrypt from "bcryptjs";
import sequelize from "../config/db.js";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import UserAddress from "../models/user_address.model.js";
import AppError from "../utils/AppError.js";

// Cột được phép sort từ bảng admin (whitelist chống SQL injection qua ORDER BY).
// order_count/total_spent là alias của subquery trong SELECT — MySQL cho phép ORDER BY alias.
const SORTABLE_USER_COLUMNS = [
    'username',
    'full_name',
    'email',
    'created_at',
    'order_count',
    'total_spent'
];

const buildUserSort = (sort, dir) => {
    const key = SORTABLE_USER_COLUMNS.includes(sort) ? sort : 'created_at';
    const direction = String(dir).toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    return [[key, direction], ['id', 'ASC']];
};

// Không bao giờ SELECT password — danh sách admin chỉ cần thông tin nhận diện
const USER_CARD_ATTRIBUTES = [
    'id',
    'username',
    'email',
    'full_name',
    'phone',
    'avatar_url',
    'role',
    'status',
    'created_at'
];

// "Đơn hợp lệ" = loại hủy/hoàn, khớp cách dashboard tính doanh thu
const ORDER_SCOPE = "o.status NOT IN ('cancelled', 'returned')";
const ORDER_METRICS = [
    [
        sequelize.literal(`(
            SELECT COUNT(*) FROM orders AS o
            WHERE o.user_id = User.id AND ${ORDER_SCOPE}
        )`),
        'order_count'
    ],
    [
        sequelize.literal(`(
            SELECT COALESCE(SUM(o.total_amount), 0) FROM orders AS o
            WHERE o.user_id = User.id AND ${ORDER_SCOPE}
        )`),
        'total_spent'
    ]
];

// Đúng ENUM trong models/user.model.js — 'staff' không tồn tại trong CSDL
const ROLES = ['admin', 'customer'];
const STATUSES = ['active', 'banned'];

// Ngưỡng 6 ký tự khớp validate của form đổi mật khẩu phía client
const PASSWORD_MIN = 6;
// bcrypt chỉ đọc 72 byte đầu — chặn từ trước để không "đổi thành công" một mật khẩu
// mà khách không thể đăng nhập bằng
const PASSWORD_MAX = 72;

const monthBounds = (now = new Date()) => ({
    startOfMonth: new Date(now.getFullYear(), now.getMonth(), 1),
    lastMonthRange: [
        new Date(now.getFullYear(), now.getMonth() - 1, 1),
        new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)
    ],
    sixMonthsAgo: new Date(now.getFullYear(), now.getMonth() - 5, 1)
});

const toIdList = (ids) => [
    ...new Set(
        (Array.isArray(ids) ? ids : []).map(Number).filter((id) => Number.isInteger(id) && id > 0)
    )
];

const requireActor = (actor) => {
    if (!actor?.id) throw new AppError(401, "Không xác định được tài khoản đăng nhập.");
    return Number(actor.id);
};

const adminUserService = {
    getAllUsers: async (query = {}) => {
        const where = {};
        const search = String(query.search ?? '').trim();
        if (search) {
            const like = { [Op.like]: `%${search}%` };
            where[Op.or] = [{ username: like }, { email: like }, { full_name: like }, { phone: like }];
        }
        if (ROLES.includes(query.role)) where.role = query.role;
        if (STATUSES.includes(query.status)) where.status = query.status;

        const page = Math.max(1, parseInt(query.page, 10) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));

        return await User.findAndCountAll({
            where,
            attributes: [...USER_CARD_ATTRIBUTES, ...ORDER_METRICS],
            order: buildUserSort(query.sort, query.dir),
            limit,
            offset: (page - 1) * limit
        });
    },

    // Số liệu toàn hệ thống — trang từng chỉ thấy 10 dòng nên không tự đếm được
    getUserStats: async () => {
        const { startOfMonth, lastMonthRange, sixMonthsAgo } = monthBounds();

        const [total, activeCount, bannedCount, adminCount, newThisMonth, newLastMonth, growthHistory] =
            await Promise.all([
                User.count(),
                User.count({ where: { status: 'active' } }),
                User.count({ where: { status: 'banned' } }),
                User.count({ where: { role: 'admin' } }),
                User.count({ where: { created_at: { [Op.gte]: startOfMonth } } }),
                User.count({ where: { created_at: { [Op.between]: lastMonthRange } } }),
                User.findAll({
                    attributes: [
                        [fn('YEAR', col('created_at')), 'year'],
                        [fn('MONTH', col('created_at')), 'month'],
                        [fn('COUNT', col('id')), 'count']
                    ],
                    where: { created_at: { [Op.gte]: sixMonthsAgo } },
                    group: [fn('YEAR', col('created_at')), fn('MONTH', col('created_at'))],
                    order: [[fn('YEAR', col('created_at')), 'ASC'], [fn('MONTH', col('created_at')), 'ASC']],
                    raw: true
                })
            ]);

        return {
            total,
            active_count: activeCount,
            banned_count: bannedCount,
            admin_count: adminCount,
            new_this_month: newThisMonth,
            new_last_month: newLastMonth,
            growth_history: growthHistory
        };
    },

    getUserDetail: async (userId) => {
        const user = await User.findByPk(userId, {
            attributes: [...USER_CARD_ATTRIBUTES, 'updated_at', ...ORDER_METRICS],
            include: [
                {
                    model: UserAddress,
                    as: 'addresses',
                    attributes: ['id', 'recipient_name', 'recipient_phone', 'address_line', 'ward', 'district', 'city', 'is_default'],
                    separate: true,
                    order: [['is_default', 'DESC'], ['id', 'DESC']]
                },
                {
                    model: Order,
                    as: 'orders',
                    attributes: ['id', 'order_code', 'total_amount', 'status', 'payment_method', 'created_at'],
                    separate: true,
                    limit: 5,
                    order: [['created_at', 'DESC']]
                }
            ]
        });
        if (!user) throw new AppError(404, "Thành viên không tồn tại");
        return user;
    },

    updateUserStatus: async (userId, status, actor) => {
        if (!STATUSES.includes(status)) throw new AppError(400, "Trạng thái không hợp lệ.");
        const actorId = requireActor(actor);
        const user = await User.findByPk(userId);
        if (!user) throw new AppError(404, "Thành viên không tồn tại");
        if (status === 'banned' && user.id === actorId) {
            throw new AppError(400, "Không thể khóa chính tài khoản đang đăng nhập.");
        }
        user.status = status;
        await user.save();
        return user;
    },

    updateUserRole: async (userId, role, actor) => {
        if (!ROLES.includes(role)) throw new AppError(400, "Vai trò không hợp lệ.");
        const actorId = requireActor(actor);
        const user = await User.findByPk(userId);
        if (!user) throw new AppError(404, "Thành viên không tồn tại");

        if (role === 'customer' && user.role === 'admin') {
            if (user.id === actorId) {
                throw new AppError(400, "Không thể hạ quyền chính tài khoản đang đăng nhập.");
            }
            const admins = await User.count({ where: { role: 'admin' } });
            if (admins <= 1) throw new AppError(400, "Hệ thống luôn cần ít nhất một quản trị viên.");
        }

        user.role = role;
        await user.save();
        return user;
    },

    // Admin gán mật khẩu mới cho một tài khoản (khách quên MK mà không còn truy cập
    // email). Không có "mật khẩu cũ" ở luồng này nên server không thể kiểm chứng như
    // /auth/change-password — vì vậy chặn dứt điểm việc admin đổi của chính mình,
    // và KHÔNG trả về instance (nó mang cột password đã băm).
    resetUserPassword: async (userId, password, actor) => {
        const actorId = requireActor(actor);
        const plain = String(password ?? '');
        if (plain.length < PASSWORD_MIN) {
            throw new AppError(400, `Mật khẩu mới phải có ít nhất ${PASSWORD_MIN} ký tự.`);
        }
        if (plain.length > PASSWORD_MAX) {
            throw new AppError(400, `Mật khẩu mới tối đa ${PASSWORD_MAX} ký tự.`);
        }

        const user = await User.findByPk(userId);
        if (!user) throw new AppError(404, "Thành viên không tồn tại");
        if (user.id === actorId) {
            throw new AppError(400, "Không đổi mật khẩu của chính mình ở đây — dùng tab Bảo mật và nhập mật khẩu cũ.");
        }

        user.password = await bcrypt.hash(plain, 10);
        // Link reset (1h) còn hiệu lực phải mất tác dụng theo mật khẩu mới
        user.reset_password_token = null;
        user.reset_password_expires = null;
        await user.save();

        return { id: user.id, username: user.username };
    },

    bulkUpdateStatus: async (ids, status, actor) => {
        if (!STATUSES.includes(status)) throw new AppError(400, "Trạng thái không hợp lệ.");
        const actorId = requireActor(actor);
        let targets = toIdList(ids);
        if (status === 'banned') targets = targets.filter((id) => id !== actorId);
        if (targets.length === 0) throw new AppError(400, "Không còn tài khoản nào để cập nhật.");

        const [updated] = await User.update({ status }, { where: { id: { [Op.in]: targets } } });
        return { updated, status };
    }
};

export default adminUserService;
