import Banner from "../models/banner.model.js";
import { Op } from "sequelize";
import AppError from "../utils/AppError.js";
import { parseBulkIds, runBulk } from "../utils/bulkOps.js";

// Cột sort được phép (Rule 3: sort server-side, whitelist chống chèn ORDER BY)
const SORTABLE_BANNER_COLUMNS = ['sort_order', 'title', 'start_date', 'created_at'];

const buildBannerSort = (sort, dir) => {
    const key = SORTABLE_BANNER_COLUMNS.includes(sort) ? sort : 'sort_order';
    const direction = String(dir).toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    return [[key, direction], ['id', 'ASC']];
};

// start_date NULL = mở từ đầu, end_date NULL = không đóng.
// Điều kiện Op.lt/Op.gt loại NULL nên "upcoming"/"expired" chỉ matched banner có hẹn giờ.
const SCHEDULE_FILTERS = {
    running: (now) => [
        { [Op.or]: [{ start_date: null }, { start_date: { [Op.lte]: now } }] },
        { [Op.or]: [{ end_date: null }, { end_date: { [Op.gte]: now } }] }
    ],
    upcoming: (now) => [{ start_date: { [Op.gt]: now } }],
    expired: (now) => [{ end_date: { [Op.lt]: now } }]
};

const bannerService = {
    // Public: chỉ banner đang kích hoạt và nằm trong khoảng hẹn giờ (nếu có)
    getActive: async () => {
        // phải tính now mỗi lần gọi: hằng số cấp module sẽ đóng băng mốc thời gian
        // khi server khởi động khiến lịch banner sai theo thời gian chạy
        const now = new Date();
        return await Banner.findAll({
            where: {
                is_active: true,
                [Op.and]: SCHEDULE_FILTERS.running(now)
            },
            order: [["sort_order", "ASC"], ["id", "ASC"]]
        });
    },

    // Admin: /banners/all — search + lọc + phân trang server-side, trả {count, rows}
    getAll: async (query = {}) => {
        const now = new Date();
        const { search, schedule } = query;
        const where = {};

        if (query.is_active === 'true' || query.is_active === 'false') {
            where.is_active = query.is_active === 'true';
        }
        if (search) {
            const like = { [Op.like]: `%${search}%` };
            where[Op.or] = [{ title: like }, { eyebrow: like }, { link_url: like }];
        }
        const scheduleFilters = SCHEDULE_FILTERS[schedule]?.(now) ?? [];
        if (scheduleFilters.length) where[Op.and] = scheduleFilters;

        const page = Math.max(1, parseInt(query.page, 10) || 1);
        const limit = Math.max(1, parseInt(query.limit, 10) || 10);

        return await Banner.findAndCountAll({
            where,
            limit,
            offset: (page - 1) * limit,
            order: buildBannerSort(query.sort, query.dir)
        });
    },

    create: async (data) => {
        return await Banner.create(data);
    },

    update: async (id, data) => {
        const banner = await Banner.findByPk(id);
        if (!banner) throw new AppError(404, "Banner không tồn tại");
        return await banner.update(data);
    },

    delete: async (id) => {
        const banner = await Banner.findByPk(id);
        if (!banner) throw new AppError(404, "Banner không tồn tại");
        await banner.destroy();
        return true;
    },

    // Xóa nhiều: từng id qua delete() để lỗi được báo riêng theo dòng
    bulkDelete: async (ids) => runBulk(parseBulkIds(ids), (id) => bannerService.delete(id)),

    toggleStatus: async (id) => {
        const banner = await Banner.findByPk(id);
        if (!banner) throw new AppError(404, "Banner không tồn tại");
        banner.is_active = !banner.is_active;
        await banner.save();
        return banner;
    },

    // Bật/ẩn hàng loạt: ĐẶT giá trị (không đảo) để một lần chọn nhiều cho kết quả dự đoán được
    bulkSetVisibility: async (ids, is_active) => {
        const list = parseBulkIds(ids);
        const [updated] = await Banner.update(
            { is_active: Boolean(is_active) },
            { where: { id: { [Op.in]: list } } }
        );
        return { updated, is_active: Boolean(is_active), requested: list.length };
    }
};

export default bannerService;
